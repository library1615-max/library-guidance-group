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
function updateStats(){$('#statNews').textContent=state.news.length;$('#statEvents').textContent=state.events.length;$('#statResources').textContent=state.resources.length;$('#statGallery').textContent=state.gallery.length}
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