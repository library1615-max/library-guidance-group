(()=>{
'use strict';
const $=(s,p=document)=>p.querySelector(s);
const cfg=()=>window.LibraryGuidanceCloudConfig?.githubMedia||{};
const MAX_FILE=10*1024*1024;
const MAX_BATCH=60;
const ACCEPT='image/jpeg,image/png,image/webp';
const REPO='library1615-max/library-guidance-group';
const SITE_BASE='https://library1615-max.github.io/library-guidance-group/';
const seenPaths=new Set();
const pending=new Map();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function configured(){return Boolean(String(cfg().appsScriptUrl||'').trim())}
function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
async function compress(file){
  if(file.size<=6*1024*1024)return file;
  const src=await fileToDataURL(file),img=new Image();
  await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=src});
  const max=2200,scale=Math.min(1,max/Math.max(img.width,img.height));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.84));
  return new File([blob],file.name.replace(/\.[^.]+$/,'.jpg'),{type:'image/jpeg'});
}
function ensurePostFrame(){let f=$('#galleryUploadBridge');if(f)return f;f=document.createElement('iframe');f.id='galleryUploadBridge';f.name='galleryUploadBridge';f.title='圖片上傳服務';f.setAttribute('aria-hidden','true');f.style.cssText='position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:0;left:-9999px;top:-9999px';document.body.appendChild(f);return f}
window.addEventListener('message',e=>{
  const d=e.data||{};
  if(!d.requestId||!pending.has(d.requestId))return;
  if(d.type==='LIBRARY_GALLERY_UPLOAD_SUCCESS'){
    const h=pending.get(d.requestId);pending.delete(d.requestId);clearTimeout(h.timer);h.resolve(d.result||{});
  }else if(d.type==='LIBRARY_GALLERY_UPLOAD_ERROR'){
    const h=pending.get(d.requestId);pending.delete(d.requestId);clearTimeout(h.timer);h.reject(new Error(d.error||'APPS_SCRIPT_UPLOAD_FAILED'));
  }
});
async function submitToAppsScript(file,date){
  if(!configured())throw new Error('UPLOAD_NOT_CONFIGURED');
  const user=window.LibraryGuidanceCloud?.auth?.currentUser;if(!user)throw new Error('AUTH_REQUIRED');
  const token=await user.getIdToken();const f=await compress(file);const dataUrl=await fileToDataURL(f);const base64=String(dataUrl).split(',')[1]||'';
  ensurePostFrame();const requestId='g'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  const response=new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(requestId);reject(new Error('APPS_SCRIPT_RESPONSE_TIMEOUT'))},45000);pending.set(requestId,{resolve,reject,timer})});
  const post=document.createElement('form');post.method='POST';post.action=cfg().appsScriptUrl;post.target='galleryUploadBridge';post.style.display='none';
  const fields={requestId,idToken:token,base64,mimeType:f.type,fileName:f.name,date};
  Object.entries(fields).forEach(([k,v])=>{const input=document.createElement('input');input.type='hidden';input.name=k;input.value=String(v??'');post.appendChild(input)});
  document.body.appendChild(post);post.submit();setTimeout(()=>post.remove(),2500);
  return {requestId,response};
}
async function fetchRecentCommits(){
  const res=await fetch(`https://api.github.com/repos/${REPO}/commits?sha=main&per_page=50&_=${Date.now()}`,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
  if(res.status===403){const remaining=Number(res.headers.get('x-ratelimit-remaining')||0);if(remaining===0)throw new Error('GITHUB_RATE_LIMIT')}
  if(!res.ok)throw new Error('GITHUB_CHECK_FAILED');
  return res.json();
}
async function pollGitHubPath(started,date,status,index,total){
  const prefix=`Upload gallery image: images/gallery/${date}/`;
  const deadline=Date.now()+60000;
  while(Date.now()<deadline){
    status.textContent=`② 第 ${index}/${total} 張等待 GitHub 備援確認…`;
    await sleep(4000);
    try{
      const commits=await fetchRecentCommits();
      for(const c of commits){
        const msg=String(c.commit?.message||'');
        const t=Date.parse(c.commit?.author?.date||c.commit?.committer?.date||0);
        if(msg.startsWith(prefix)&&t>=started-30000){
          const path=msg.slice('Upload gallery image: '.length).trim();
          if(path&&!seenPaths.has(path)){seenPaths.add(path);return {path,url:SITE_BASE+path,sha:c.sha}}
        }
      }
    }catch(e){if(e.message==='GITHUB_RATE_LIMIT')throw e;console.warn('GitHub fallback confirmation failed',e)}
  }
  throw new Error('GITHUB_CONFIRM_TIMEOUT');
}
async function confirmUpload(submission,started,date,status,index,total){
  try{
    status.textContent=`② 第 ${index}/${total} 張已送出，等待上傳服務回報…`;
    const result=await submission.response;
    if(result&&result.path){seenPaths.add(result.path);return result}
  }catch(e){
    if(e.message!=='APPS_SCRIPT_RESPONSE_TIMEOUT')throw e;
    console.warn('Apps Script response timeout; using GitHub fallback confirmation');
  }
  return pollGitHubPath(started,date,status,index,total);
}
function card(file,i,done){const d=document.createElement('div');d.className='media-thumb';d.dataset.index=i;const url=URL.createObjectURL(file);d.innerHTML=`<img src="${url}" alt="待上傳照片"><button type="button" aria-label="移除照片" ${done?'disabled':''}>×</button><small>${done?'✓ 已完成':(i===0?'封面照片':`照片 ${i+1}`)}</small>`;return d}
function savePayload(form,paths){const d=new FormData(form);const payload={id:d.get('id'),title:d.get('title'),date:d.get('date'),category:d.get('category'),image:paths[0]||'',photos:paths.slice(1).join('\n'),desc:d.get('desc'),url:d.get('url'),home:d.get('home')==='on'};if(typeof window.__libraryGallerySave==='function')return window.__libraryGallerySave(payload);try{if(typeof upsert==='function'&&typeof resetForm==='function'){upsert('gallery',payload,'成果');resetForm('galleryForm');return true}}catch(e){console.error(e)}return false}
function init(){
  const form=$('#galleryForm');if(!form||$('#galleryMediaPicker'))return;
  const image=form.elements.image;if(!image)return;image.required=false;image.removeAttribute('required');const old=image.closest('.field');if(old)old.style.display='none';
  const photos=form.elements.photos?.closest('.field');if(photos)photos.style.display='none';ensurePostFrame();
  const box=document.createElement('section');box.id='galleryMediaPicker';box.className='gallery-media-picker';
  box.innerHTML=`<div class="media-title"><div><strong>活動照片</strong><p>可一次上傳大量活動照片；第一張自動作為封面。</p></div><span>最多 ${MAX_BATCH} 張</span></div><div class="media-service-ready"><strong>✓ GitHub 大量照片上傳模式已啟用</strong><p>新版優先使用 Apps Script 成功回報，不再每張都等待 GitHub commit；只有回報逾時才啟用 GitHub 備援確認。</p></div><label class="media-drop"><input id="galleryFiles" type="file" accept="${ACCEPT}" multiple><b>＋ 選擇照片</b><span>可一次選取多張 JPG、PNG、WebP</span></label><div id="galleryMediaStatus" class="media-status">尚未選擇照片</div><div id="galleryThumbs" class="media-thumbs"></div><div class="media-help">大量上傳流程：①送出 → ②上傳服務確認 → ③保留已完成進度 → ④全部完成後寫入成果與 Firestore。</div>`;
  old?.after(box);
  let selected=[],uploaded=[];
  const input=$('#galleryFiles'),thumbs=$('#galleryThumbs'),status=$('#galleryMediaStatus');
  function render(){thumbs.innerHTML='';selected.forEach((f,i)=>thumbs.appendChild(card(f,i,i<uploaded.length)));if(!form.dataset.uploadStage){if(!selected.length)status.textContent='尚未選擇照片';else if(uploaded.length)status.textContent=`已完成 ${uploaded.length}/${selected.length} 張；再次按「儲存成果」可繼續。`;else status.textContent=`已選擇 ${selected.length} 張照片；第一張將作為封面。`}}
  input.addEventListener('change',()=>{let files=[...input.files].filter(f=>ACCEPT.includes(f.type));if(files.length>MAX_BATCH){alert(`一次最多 ${MAX_BATCH} 張，已保留前 ${MAX_BATCH} 張。`);files=files.slice(0,MAX_BATCH)}const tooBig=files.filter(f=>f.size>MAX_FILE);if(tooBig.length)alert(`有 ${tooBig.length} 張照片超過 10 MB，請先縮小後再上傳。`);selected=files.filter(f=>f.size<=MAX_FILE);uploaded=[];seenPaths.clear();form.dataset.uploadStage='';render()});
  thumbs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const idx=Number(b.parentElement.dataset.index);selected.splice(idx,1);if(idx<uploaded.length)uploaded=[];render()});
  form.addEventListener('reset',()=>{selected=[];uploaded=[];seenPaths.clear();form.dataset.uploadStage='';setTimeout(render)});
  form.addEventListener('submit',async e=>{
    if(!selected.length)return;
    if(form.dataset.mediaUploading==='1'){e.preventDefault();e.stopImmediatePropagation();return}
    e.preventDefault();e.stopImmediatePropagation();
    const submit=form.querySelector('[type="submit"]'),original=submit?.textContent;
    form.dataset.mediaUploading='1';form.dataset.uploadStage='1';if(submit){submit.disabled=true;submit.textContent=`上傳 0/${selected.length}`}
    try{
      const date=form.elements.date?.value||new Date().toISOString().slice(0,10);
      for(let i=uploaded.length;i<selected.length;i++){
        if(submit)submit.textContent=`上傳 ${i+1}/${selected.length}`;
        const started=Date.now();status.textContent=`① 正在送出第 ${i+1} / ${selected.length} 張照片…`;
        const submission=await submitToAppsScript(selected[i],date);
        const result=await confirmUpload(submission,started,date,status,i+1,selected.length);
        if(!result.path)throw new Error('UPLOAD_RESULT_MISSING_PATH');
        uploaded.push(result.path);status.textContent=`③ 已完成 ${uploaded.length}/${selected.length} 張`;render();await sleep(250);
      }
      image.value=uploaded[0]||'';if(form.elements.photos)form.elements.photos.value=uploaded.slice(1).join('\n');
      status.textContent=`④ ${uploaded.length} 張照片已完成，正在寫入成果資料…`;
      const ok=savePayload(form,uploaded);if(!ok)throw new Error('CMS_SAVE_FAILED');
      form.dataset.mediaUploading='0';form.dataset.uploadStage='done';selected=[];uploaded=[];
      if(submit){submit.disabled=false;submit.textContent=original}
      status.textContent='✓ 全部照片與成果資料已成功儲存，正在同步到 Firestore。';
      setTimeout(()=>{form.dataset.uploadStage='';render()},5000);
    }catch(err){
      form.dataset.mediaUploading='0';form.dataset.uploadStage='';if(submit){submit.disabled=false;submit.textContent=original}
      const map={AUTH_REQUIRED:'請先登入管理員帳號。',UPLOAD_NOT_CONFIGURED:'安全上傳網址尚未設定。',APPS_SCRIPT_UPLOAD_FAILED:'圖片上傳服務回報失敗。',GITHUB_CONFIRM_TIMEOUT:`上傳服務沒有回報，GitHub 備援確認也逾時；目前已完成 ${uploaded.length}/${selected.length} 張。請稍後再按「儲存成果」續傳。`,GITHUB_RATE_LIMIT:`GitHub 公開查詢暫時達到頻率上限；已完成 ${uploaded.length}/${selected.length} 張。請稍後再試。`,GITHUB_CHECK_FAILED:'暫時無法確認 GitHub 圖片狀態，已保留目前完成進度。',UPLOAD_RESULT_MISSING_PATH:'上傳服務已回應，但沒有取得圖片路徑。',CMS_SAVE_FAILED:'照片已全部建立，但成果資料寫入 CMS 失敗。'};
      status.textContent=`⚠ ${map[err.message]||err.message}`;console.error('Gallery bulk upload failed',err);render();
    }
  },true);
  render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,150));else setTimeout(init,150);
})();