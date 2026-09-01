const defaults={
 news:[
  {id:1,date:'2026-09-01',cat:'重要公告',title:'115年度全國高級中等學校圖書館輔導團研習開放報名',desc:'中區、北區、南區場次資訊與報名連結。',url:'',pin:true,draft:false},
  {id:2,date:'2026-08-28',cat:'研習活動',title:'AI時代圖書館創新應用研習－中區場次資訊',desc:'研習日期：9/04｜國立中興大學圖書館。',url:'',pin:false,draft:false}
 ],
 events:[
  {id:1,region:'中區',date:'2026-09-04',title:'中區圖書館輔導團研習',place:'國立中興大學圖書館6樓會議廳',url:'',image:'images/event-central-workshop.png'},
  {id:2,region:'北區',date:'2026-09-11',title:'北區圖書館輔導團研習',place:'國立陽明交通大學浩然圖書資訊中心B1國際會議廳',url:'',image:'images/event-north-workshop.png'},
  {id:3,region:'南區',date:'2026-09-22',title:'南區圖書館輔導團研習',place:'國立成功大學成功校區圖書館總館B1會議廳',url:'',image:'images/event-south-workshop.png'}
 ],
 resources:[
  {id:1,title:'專題資源',category:'專題資源',desc:'豐富的圖書館專業資源與教材工具',url:'#resources',icon:'冊',home:true},
  {id:2,title:'AI應用專區',category:'AI應用專區',desc:'AI在圖書館的創新應用與教學資源',url:'#resources',icon:'AI',home:true},
  {id:3,title:'研習教材',category:'研習教材',desc:'研習簡報與教學資源下載專區',url:'#resources',icon:'▣',home:true},
  {id:4,title:'法規政策',category:'法規政策',desc:'圖書館相關法規與政策下載',url:'#resources',icon:'§',home:true}
 ],
 gallery:[
  {id:1,title:'中區研習活動紀錄',date:'2026-09-04',category:'研習活動',image:'images/gallery-central-workshop.png',desc:'中區研習活動成果紀錄',url:'',home:true},
  {id:2,title:'全國輔導團交流',date:'2026-09-11',category:'交流分享',image:'images/gallery-national-exchange.png',desc:'全國圖書館輔導團專業交流',url:'',home:true},
  {id:3,title:'AI應用分享',date:'2026-09-22',category:'AI應用',image:'images/gallery-ai-sharing.png',desc:'AI與圖書館創新應用分享',url:'',home:true}
 ],
 links:[
  {id:1,title:'中學生網站',desc:'小論文、閱讀心得與學習資源',url:'https://www.shs.edu.tw/',icon:'◎',order:1,home:true},
  {id:2,title:'高中職小論文檢核輔助系統',desc:'AI輔助小論文格式自我檢核',url:'https://library1615-max.github.io/thesis-format-system/',icon:'AI',order:2,home:true}
 ],
 settings:{siteName:'全國高級中等學校圖書館輔導團',kicker:'閱讀 × 科技 × 教育',heroTitle:'共創圖書館的未來',heroDesc:'串聯全國高中職圖書館專業能量，推動閱讀素養、AI應用與多元學習。',email:'',phone:'',seoDesc:'全國高級中等學校圖書館輔導團官方網站',footerText:'閱讀・科技・教育・共創'},
 logs:[]
};
const KEY='libraryGuidanceCMSv2';
const clone=v=>JSON.parse(JSON.stringify(v));
let state=(()=>{try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');return saved?{...clone(defaults),...saved}:clone(defaults)}catch{return clone(defaults)}})();
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function persist(){localStorage.setItem(KEY,JSON.stringify(state));updateStats()}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1800)}
function addLog(action){state.logs.unshift({time:new Date().toLocaleString('zh-TW',{hour12:false}),action});state.logs=state.logs.slice(0,100)}
function setView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));const map={dashboard:'總覽',news:'最新消息管理',events:'活動研習管理',resources:'資源中心管理',gallery:'活動成果管理',links:'相關連結管理',users:'帳號與權限',logs:'操作紀錄',settings:'網站設定'};$('#pageTitle').textContent=map[name]||'後台管理';if(innerWidth<821)$('#sidebar')?.classList.remove('open');if(name==='logs')renderLogs()}
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.goto)));$('#mobileToggle')?.addEventListener('click',()=>$('#sidebar')?.classList.toggle('open'));
function updateStats(){$('#statNews').textContent=state.news.length;$('#statEvents').textContent=state.events.length;$('#statResources').textContent=state.resources.length;$('#statGallery').textContent=state.gallery.length;renderDataHealth()}
function rowBtns(type,id){return `<div class="row-actions"><button class="icon-action" data-edit-${type}="${id}">編輯</button><button class="icon-action" data-delete-${type}="${id}">刪除</button></div>`}
function renderNews(){const q=($('#newsAdminSearch')?.value||'').trim().toLowerCase();const arr=state.news.filter(n=>`${n.date} ${n.cat} ${n.title} ${n.desc||''}`.toLowerCase().includes(q));$('#newsTableBody').innerHTML=arr.map(n=>`<tr><td>${esc(n.date)}</td><td><span class="badge ${n.cat==='重要公告'?'important':''}">${esc(n.cat)}</span></td><td>${esc(n.title)}</td><td>${n.draft?'草稿':'已發布'}</td><td>${rowBtns('news',n.id)}</td></tr>`).join('')}
function renderEvents(){$('#eventTableBody').innerHTML=[...state.events].sort((a,b)=>a.date.localeCompare(b.date)).map(e=>`<tr><td>${esc(e.region)}</td><td>${esc(e.date)}</td><td>${esc(e.title)}</td><td>${esc(e.place)}</td><td>${rowBtns('event',e.id)}</td></tr>`).join('')}
function renderResources(){$('#resourceTableBody').innerHTML=state.resources.map(r=>`<tr><td>${esc(r.category)}</td><td>${esc(r.title)}</td><td>${r.home?'是':'否'}</td><td>${esc(r.url||'—')}</td><td>${rowBtns('resource',r.id)}</td></tr>`).join('')}
function renderGallery(){$('#galleryTableBody').innerHTML=state.gallery.map(g=>`<tr><td>${esc(g.date||'—')}</td><td>${esc(g.category)}</td><td>${esc(g.title)}</td><td>${g.home?'是':'否'}</td><td>${rowBtns('gallery',g.id)}</td></tr>`).join('')}
function renderLinks(){$('#linkTableBody').innerHTML=[...state.links].sort((a,b)=>a.order-b.order).map(l=>`<tr><td>${l.order}</td><td>${esc(l.title)}</td><td>${esc(l.url)}</td><td>${l.home?'是':'否'}</td><td>${rowBtns('link',l.id)}</td></tr>`).join('')}
function renderLogs(){const el=$('#logList');el.innerHTML=(state.logs.length?state.logs:[{time:'尚無紀錄',action:'開始操作後，新增、修改與刪除會顯示在這裡。'}]).map(x=>`<div class="log-item"><time>${esc(x.time)}</time><div>${esc(x.action)}</div></div>`).join('')}
function resetForm(id){const f=document.getElementById(id);f?.reset();const hidden=f?.querySelector('[name=id]');if(hidden)hidden.value=''}
$$('[data-reset-form]').forEach(b=>b.addEventListener('click',()=>resetForm(b.dataset.resetForm)));
function fillForm(form,obj){Object.entries(obj).forEach(([k,v])=>{const el=form.elements[k];if(!el)return;if(el.type==='checkbox')el.checked=!!v;else el.value=v??''});form.scrollIntoView({behavior:'smooth',block:'start'})}
function upsert(type,data,label){const id=Number(data.id||0);if(id){const i=state[type].findIndex(x=>x.id===id);if(i>=0)state[type][i]={...state[type][i],...data,id};addLog(`修改${label}：${data.title||''}`)}else{data.id=Date.now();state[type].unshift(data);addLog(`新增${label}：${data.title||''}`)}persist();renderAll();toast(`${label}已儲存`)}
$('#newsForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);upsert('news',{id:d.get('id'),date:d.get('date'),cat:d.get('cat'),title:d.get('title'),desc:d.get('desc'),url:d.get('url'),pin:d.get('pin')==='on',draft:d.get('draft')==='on'},'公告');resetForm('newsForm')});
$('#eventForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);upsert('events',{id:d.get('id'),region:d.get('region'),date:d.get('date'),title:d.get('title'),place:d.get('place'),url:d.get('url'),image:d.get('image')},'活動');resetForm('eventForm')});
$('#resourceForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);upsert('resources',{id:d.get('id'),title:d.get('title'),category:d.get('category'),desc:d.get('desc'),url:d.get('url'),icon:d.get('icon')||'冊',home:d.get('home')==='on'},'資源');resetForm('resourceForm')});
$('#galleryForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);upsert('gallery',{id:d.get('id'),title:d.get('title'),date:d.get('date'),category:d.get('category'),image:d.get('image'),desc:d.get('desc'),url:d.get('url'),home:d.get('home')==='on'},'成果');resetForm('galleryForm')});
$('#linkForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);upsert('links',{id:d.get('id'),title:d.get('title'),desc:d.get('desc'),url:d.get('url'),icon:d.get('icon')||'↗',order:Number(d.get('order')||1),home:d.get('home')==='on'},'連結');resetForm('linkForm')});
const keyFor=t=>t==='news'?'news':t==='event'?'events':t==='resource'?'resources':t==='gallery'?'gallery':'links';
function bindEditDelete(type,formId,label){document.addEventListener('click',e=>{const edit=e.target.closest(`[data-edit-${type}]`);if(edit){const id=Number(edit.getAttribute(`data-edit-${type}`));const obj=state[keyFor(type)].find(x=>x.id===id);if(obj)fillForm(document.getElementById(formId),obj)}const del=e.target.closest(`[data-delete-${type}]`);if(del){const id=Number(del.getAttribute(`data-delete-${type}`));const key=keyFor(type),obj=state[key].find(x=>x.id===id);if(obj&&confirm(`確定刪除「${obj.title}」？`)){state[key]=state[key].filter(x=>x.id!==id);addLog(`刪除${label}：${obj.title}`);persist();renderAll();toast(`${label}已刪除`)}}})}
bindEditDelete('news','newsForm','公告');bindEditDelete('event','eventForm','活動');bindEditDelete('resource','resourceForm','資源');bindEditDelete('gallery','galleryForm','成果');bindEditDelete('link','linkForm','連結');
$('#newsAdminSearch')?.addEventListener('input',renderNews);
function loadSettings(){const f=$('#settingsForm');if(!f)return;Object.entries(state.settings).forEach(([k,v])=>{if(f.elements[k])f.elements[k].value=v||''})}
$('#settingsForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);state.settings=Object.fromEntries([...d.entries()]);addLog('更新網站基本設定');persist();toast('網站設定已儲存')});
$('#clearLogs')?.addEventListener('click',()=>{state.logs=[];persist();renderLogs();toast('展示紀錄已清除')});
$('#demoLogout')?.addEventListener('click',e=>{e.preventDefault();toast('正式登入完成後才會啟用登出功能')});
function renderAll(){renderNews();renderEvents();renderResources();renderGallery();renderLinks();updateStats();loadSettings()}
renderAll();persist();

// --- CMS V3：資料備份、匯入、還原與健康檢查 ---
function ensureDataTools(){
 const dashboard=document.querySelector('.view[data-view="dashboard"]');
 if(!dashboard||document.getElementById('dataToolsPanel'))return;
 const panel=document.createElement('div');panel.className='panel';panel.id='dataToolsPanel';
 panel.innerHTML=`<div class="panel-head"><div><h3>資料備份與搬移</h3><p style="margin:5px 0 0;color:#718491;font-size:12px">目前資料儲存在這台裝置的瀏覽器。正式 Firebase 上線前，可先使用 JSON 備份避免資料遺失。</p></div><span class="status-pill">本機 CMS</span></div><div class="cms-tool-grid"><div class="cms-tool-card"><b>匯出備份</b><p>將公告、活動、資源、成果、連結及網站設定下載為 JSON。</p><button class="secondary-btn" id="exportCmsData" type="button">下載備份檔</button></div><div class="cms-tool-card"><b>匯入備份</b><p>從另一台電腦匯入先前下載的 JSON 資料。</p><input id="importCmsFile" type="file" accept="application/json,.json" hidden><button class="secondary-btn" id="importCmsData" type="button">選擇備份檔</button></div><div class="cms-tool-card danger-zone"><b>還原示範資料</b><p>清除目前本機修改，恢復網站預設內容。</p><button class="danger-btn" id="resetCmsData" type="button">還原預設資料</button></div></div><div id="dataHealth" class="data-health"></div>`;
 dashboard.appendChild(panel);
 document.getElementById('exportCmsData')?.addEventListener('click',exportCmsData);
 document.getElementById('importCmsData')?.addEventListener('click',()=>document.getElementById('importCmsFile')?.click());
 document.getElementById('importCmsFile')?.addEventListener('change',importCmsData);
 document.getElementById('resetCmsData')?.addEventListener('click',resetCmsData);
 renderDataHealth();
}
function exportCmsData(){
 const payload={version:3,exportedAt:new Date().toISOString(),data:state};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`library-guidance-cms-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);a.remove();addLog('匯出網站資料備份');persist();toast('備份檔已下載');
}
function validImportedData(v){return v&&typeof v==='object'&&Array.isArray(v.news)&&Array.isArray(v.events)&&Array.isArray(v.resources)&&Array.isArray(v.gallery)&&Array.isArray(v.links)&&v.settings&&typeof v.settings==='object'}
function importCmsData(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);const data=parsed.data||parsed;if(!validImportedData(data))throw new Error('格式不符');if(!confirm('匯入後會取代目前這台瀏覽器中的後台資料，確定繼續？'))return;state={...clone(defaults),...data};addLog(`匯入資料備份：${file.name}`);persist();renderAll();renderLogs();renderDataHealth();toast('備份資料已匯入')}catch{alert('無法匯入：這不是有效的網站後台備份檔。')}finally{e.target.value=''}};reader.readAsText(file,'utf-8')}
function resetCmsData(){if(!confirm('確定要清除目前本機修改，並還原為網站預設資料嗎？此動作無法復原，建議先下載備份。'))return;state=clone(defaults);addLog('還原網站預設資料');persist();renderAll();renderLogs();renderDataHealth();toast('已還原預設資料')}
function renderDataHealth(){const el=document.getElementById('dataHealth');if(!el)return;const missing=[];state.news.filter(n=>!n.draft&&!n.title).length&&missing.push('公告標題');state.events.filter(e=>!e.date||!e.title||!e.place).length&&missing.push('活動必要欄位');state.gallery.filter(g=>g.home&&!g.image).length&&missing.push('首頁成果圖片');state.links.filter(l=>l.home&&!/^https?:\/\//.test(l.url||'')).length&&missing.push('首頁外部連結');const bytes=new Blob([JSON.stringify(state)]).size;el.innerHTML=`<div><b>${missing.length?'⚠ 資料需要檢查':'✓ 資料狀態正常'}</b><span>${missing.length?`請檢查：${missing.join('、')}`:'主要內容欄位完整，可繼續編輯。'}</span></div><div><b>${(bytes/1024).toFixed(1)} KB</b><span>目前本機 CMS 資料量</span></div><div><b>${state.logs.length}</b><span>已記錄操作筆數</span></div>`}
function addImagePathPreviews(){[['eventForm','image'],['galleryForm','image']].forEach(([formId,name])=>{const f=document.getElementById(formId),input=f?.elements[name];if(!input||input.dataset.previewBound)return;input.dataset.previewBound='1';const preview=document.createElement('div');preview.className='path-preview';input.insertAdjacentElement('afterend',preview);const update=()=>{const src=input.value.trim();preview.innerHTML=src?`<div class="path-preview-box"><img src="${esc(src)}" alt="圖片路徑預覽" onerror="this.parentElement.classList.add('broken')"><span>${esc(src)}</span></div>`:''};input.addEventListener('input',update);input.addEventListener('change',update);update()})}
ensureDataTools();addImagePathPreviews();renderDataHealth();