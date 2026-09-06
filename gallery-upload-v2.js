(()=>{
'use strict';
const $=(s,p=document)=>p.querySelector(s);
const cfg=()=>window.LibraryGuidanceCloudConfig?.githubMedia||{};
const MAX_FILE=10*1024*1024;
const MAX_BATCH=60;
const SEND_GROUP=4;
const SEND_GAP=2200;
const GROUP_PAUSE=5000;
const ACCEPT='image/jpeg,image/png,image/webp';
const REPO='library1615-max/library-guidance-group';
const API_BASE=`https://api.github.com/repos/${REPO}/contents/images/gallery`;
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
function createPostFrame(requestId){
  const name=`galleryUpload_${requestId}`;
  const f=document.createElement('iframe');
  f.id=name;f.name=name;f.title='圖片上傳服務';f.setAttribute('aria-hidden','true');
  f.style.cssText='position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:0;left:-9999px;top:-9999px';
  document.body.appendChild(f);
  setTimeout(()=>f.remove(),90000);
  return name;
}
async function submitToAppsScript(file,date){
  if(!configured())throw new Error('UPLOAD_NOT_CONFIGURED');
  const user=window.LibraryGuidanceCloud?.auth?.currentUser;if(!user)throw new Error('AUTH_REQUIRED');
  const token=await user.getIdToken();const f=await compress(file);const dataUrl=await fileToDataURL(f);const base64=String(dataUrl).split(',')[1]||'';
  const requestId='g'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  const target=createPostFrame(requestId);
  const post=document.createElement('form');post.method='POST';post.action=cfg().appsScriptUrl;post.target=target;post.style.display='none';
  const fields={requestId,idToken:token,base64,mimeType:f.type,fileName:f.name,date};
  Object.entries(fields).forEach(([k,v])=>{const input=document.createElement('input');input.type='hidden';input.name=k;input.value=String(v??'');post.appendChild(input)});
  document.body.appendChild(post);post.submit();setTimeout(()=>post.remove(),4000);
}
async function listGalleryFiles(date){
  const res=await fetch(`${API_BASE}/${encodeURIComponent(date)}?ref=main&_=${Date.now()}`,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
  if(res.status===404)return [];
  if(res.status===403){const remaining=Number(res.headers.get('x-ratelimit-remaining')||0);if(remaining===0)throw new Error('GITHUB_RATE_LIMIT')}
  if(!res.ok)throw new Error('GITHUB_CHECK_FAILED');
  const data=await res.json();
  return Array.isArray(data)?data.filter(x=>x&&x.type==='file'&&x.path).map(x=>x.path):[];
}
async function waitForBatch(date,before,count,status){
  const baseline=new Set(before);
  const deadline=Date.now()+300000;
  let lastCount=-1;
  while(Date.now()<deadline){
    await sleep(5000);
    const now=await listGalleryFiles(date);
    const fresh=now.filter(p=>!baseline.has(p)).sort();
    if(fresh.length!==lastCount){lastCount=fresh.length;status.textContent=`③ GitHub 已確認 ${Math.min(fresh.length,count)}/${count} 張照片…`}
    if(fresh.length>=count)return fresh.slice(-count).sort();
  }
  throw new Error('GITHUB_BATCH_TIMEOUT');
}
function card(file,i,done){const d=document.createElement('div');d.className='media-thumb';d.dataset.index=i;const url=URL.createObjectURL(file);d.innerHTML=`<img src="${url}" alt="待上傳照片"><button type="button" aria-label="移除照片" ${done?'disabled':''}>×</button><small>${done?'✓ 已確認':(i===0?'封面照片':`照片 ${i+1}`)}</small>`;return d}
function savePayload(form,paths){const d=new FormData(form);const payload={id:d.get('id'),title:d.get('title'),date:d.get('date'),category:d.get('category'),image:paths[0]||'',photos:paths.slice(1).join('\n'),desc:d.get('desc'),url:d.get('url'),home:d.get('home')==='on'};if(typeof window.__libraryGallerySave==='function')return window.__libraryGallerySave(payload);try{if(typeof upsert==='function'&&typeof resetForm==='function'){upsert('gallery',payload,'成果');resetForm('galleryForm');return true}}catch(e){console.error(e)}return false}
function init(){
  const form=$('#galleryForm');if(!form||$('#galleryMediaPicker'))return;
  const image=form.elements.image;if(!image)return;image.required=false;image.removeAttribute('required');const old=image.closest('.field');if(old)old.style.display='none';
  const photos=form.elements.photos?.closest('.field');if(photos)photos.style.display='none';
  const box=document.createElement('section');box.id='galleryMediaPicker';box.className='gallery-media-picker';
  box.innerHTML=`<div class="media-title"><div><strong>活動照片</strong><p>可一次上傳大量活動照片；第一張自動作為封面。</p></div><span>最多 ${MAX_BATCH} 張</span></div><div class="media-service-ready"><strong>✓ 穩定大量照片模式已啟用</strong><p>每張照片使用獨立上傳通道，並分組節流送出，避免同一個 iframe 互相中斷前一張上傳。</p></div><label class="media-drop"><input id="galleryFiles" type="file" accept="${ACCEPT}" multiple><b>＋ 選擇照片</b><span>可一次選取多張 JPG、PNG、WebP</span></label><div id="galleryMediaStatus" class="media-status">尚未選擇照片</div><div id="galleryThumbs" class="media-thumbs"></div><div class="media-help">大量上傳流程：①記錄 GitHub → ②每 ${SEND_GROUP} 張為一組穩定送出 → ③整批確認 → ④寫入成果與 Firestore。</div>`;
  old?.after(box);
  let selected=[],confirmed=0;
  const input=$('#galleryFiles'),thumbs=$('#galleryThumbs'),status=$('#galleryMediaStatus');
  function render(){thumbs.innerHTML='';selected.forEach((f,i)=>thumbs.appendChild(card(f,i,i<confirmed)));if(!form.dataset.uploadStage){status.textContent=selected.length?`已選擇 ${selected.length} 張照片；第一張將作為封面。`:'尚未選擇照片'}}
  input.addEventListener('change',()=>{let files=[...input.files].filter(f=>ACCEPT.includes(f.type));if(files.length>MAX_BATCH){alert(`一次最多 ${MAX_BATCH} 張，已保留前 ${MAX_BATCH} 張。`);files=files.slice(0,MAX_BATCH)}const tooBig=files.filter(f=>f.size>MAX_FILE);if(tooBig.length)alert(`有 ${tooBig.length} 張照片超過 10 MB，請先縮小後再上傳。`);selected=files.filter(f=>f.size<=MAX_FILE);confirmed=0;form.dataset.uploadStage='';render()});
  thumbs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;selected.splice(Number(b.parentElement.dataset.index),1);render()});
  form.addEventListener('reset',()=>{selected=[];confirmed=0;form.dataset.uploadStage='';setTimeout(render)});
  form.addEventListener('submit',async e=>{
    if(!selected.length)return;
    if(form.dataset.mediaUploading==='1'){e.preventDefault();e.stopImmediatePropagation();return}
    e.preventDefault();e.stopImmediatePropagation();
    const submit=form.querySelector('[type="submit"]'),original=submit?.textContent;
    form.dataset.mediaUploading='1';form.dataset.uploadStage='1';if(submit){submit.disabled=true;submit.textContent=`準備上傳 ${selected.length} 張`}
    try{
      const date=form.elements.date?.value||new Date().toISOString().slice(0,10);
      status.textContent='① 正在記錄 GitHub 目前圖片清單…';
      const before=await listGalleryFiles(date);
      for(let i=0;i<selected.length;i++){
        if(submit)submit.textContent=`送出 ${i+1}/${selected.length}`;
        status.textContent=`② 正在送出第 ${i+1}/${selected.length} 張照片…`;
        await submitToAppsScript(selected[i],date);
        await sleep(SEND_GAP);
        if((i+1)%SEND_GROUP===0 && i+1<selected.length){status.textContent=`② 已送出 ${i+1}/${selected.length} 張，讓伺服器處理這一組…`;await sleep(GROUP_PAUSE)}
      }
      status.textContent=`③ ${selected.length} 張已送出，正在整批確認 GitHub 圖片…`;
      const paths=await waitForBatch(date,before,selected.length,status);
      confirmed=paths.length;render();
      image.value=paths[0]||'';if(form.elements.photos)form.elements.photos.value=paths.slice(1).join('\n');
      status.textContent=`④ 已確認 ${paths.length} 張照片，正在寫入成果資料…`;
      const ok=savePayload(form,paths);if(!ok)throw new Error('CMS_SAVE_FAILED');
      form.dataset.mediaUploading='0';form.dataset.uploadStage='done';selected=[];confirmed=0;
      if(submit){submit.disabled=false;submit.textContent=original}
      status.textContent=`✓ ${paths.length} 張照片與成果資料已成功儲存，正在同步到 Firestore。`;
      setTimeout(()=>{form.dataset.uploadStage='';render()},5000);
    }catch(err){
      form.dataset.mediaUploading='0';form.dataset.uploadStage='';if(submit){submit.disabled=false;submit.textContent=original}
      const map={AUTH_REQUIRED:'請先登入管理員帳號。',UPLOAD_NOT_CONFIGURED:'安全上傳網址尚未設定。',GITHUB_BATCH_TIMEOUT:'整批照片已送出，但 5 分鐘內仍未全部出現在 GitHub。請先不要重複上傳；稍後可重新整理確認。',GITHUB_RATE_LIMIT:'GitHub 公開查詢暫時達到頻率上限，請稍後再試。',GITHUB_CHECK_FAILED:'目前無法讀取 GitHub 圖片清單，請稍後再試。',CMS_SAVE_FAILED:'照片已全部建立，但成果資料寫入 CMS 失敗。'};
      status.textContent=`⚠ ${map[err.message]||err.message}`;console.error('Gallery bulk upload failed',err);render();
    }
  },true);
  render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,150));else setTimeout(init,150);
})();