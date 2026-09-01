const STORAGE={news:'lgg_news',events:'lgg_events'};
const defaults={
 news:[
  {id:1,date:'2026-09-01',cat:'重要公告',title:'115年度全國高級中等學校圖書館輔導團研習開放報名',content:'中區、北區、南區場次資訊與報名連結。',url:'',status:'已發布',pin:true,important:true},
  {id:2,date:'2026-08-28',cat:'研習活動',title:'AI時代圖書館創新應用研習－中區場次資訊',content:'研習日期：9/04｜國立中興大學圖書館6樓會議廳。',url:'',status:'已發布'}
 ],
 events:[
  {id:1,region:'中區',date:'2026-09-04',title:'中區圖書館輔導團研習',place:'國立中興大學圖書館6樓會議廳',url:'',image:'images/event-central-workshop.png'},
  {id:2,region:'北區',date:'2026-09-11',title:'北區圖書館輔導團研習',place:'國立陽明交通大學浩然圖書資訊中心B1國際會議廳',url:'',image:'images/event-north-workshop.png'},
  {id:3,region:'南區',date:'2026-09-22',title:'南區圖書館輔導團研習',place:'國立成功大學成功校區圖書館總館B1會議廳',url:'',image:'images/event-south-workshop.png'}
 ]
};
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const load=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)&&v.length?v:fallback}catch{return fallback}};
const state={view:'dashboard',news:load(STORAGE.news,defaults.news),events:load(STORAGE.events,defaults.events),editingNews:null,editingEvent:null};
const persist=()=>{localStorage.setItem(STORAGE.news,JSON.stringify(state.news));localStorage.setItem(STORAGE.events,JSON.stringify(state.events));updateStats()};
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1900)}
function setView(name){state.view=name;$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('#pageTitle').textContent=({dashboard:'總覽',news:'最新消息管理',events:'活動研習管理',resources:'資源中心',gallery:'活動成果',links:'相關連結',users:'帳號與權限',logs:'操作紀錄',settings:'網站設定'})[name]||'後台管理';if(innerWidth<821)$('#sidebar')?.classList.remove('open')}
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));$('#mobileToggle')?.addEventListener('click',()=>$('#sidebar')?.classList.toggle('open'));
function updateStats(){const cards=$$('.stat-card b');if(cards[0])cards[0].textContent=state.news.length;if(cards[1])cards[1].textContent=state.events.length}
function renderNews(){const tb=$('#newsTableBody');if(!tb)return;tb.innerHTML=state.news.sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(n=>`<tr><td>${n.date||''}</td><td><span class="badge ${n.cat==='重要公告'?'important':''}">${n.cat||'其他'}</span></td><td>${escapeHtml(n.title||'')}</td><td>${n.status||'已發布'}</td><td><div class="row-actions"><button class="icon-action" data-edit-news="${n.id}">編輯</button><button class="icon-action" data-delete-news="${n.id}">刪除</button></div></td></tr>`).join('')}
function renderEvents(){const tb=$('#eventTableBody');if(!tb)return;tb.innerHTML=state.events.sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(e=>`<tr><td>${e.region}</td><td>${e.date}</td><td>${escapeHtml(e.title||'')}</td><td>${escapeHtml(e.place||'')}</td><td><div class="row-actions"><button class="icon-action" data-edit-event="${e.id}">編輯</button><button class="icon-action" data-delete-event="${e.id}">刪除</button></div></td></tr>`).join('')}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function fillForm(form,data){Object.entries(data).forEach(([k,v])=>{const el=form.elements[k];if(!el)return;if(el.type==='checkbox')el.checked=!!v;else el.value=v??''})}
$('#newsForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const item={id:state.editingNews||Date.now(),date:f.get('date'),cat:f.get('cat'),title:f.get('title'),content:f.get('content')||'',url:f.get('url')||'',linkType:f.get('linkType')||'公告內頁',status:f.get('draft')?'草稿':'已發布',pin:!!f.get('pin'),important:!!f.get('important')};if(state.editingNews){state.news=state.news.map(n=>n.id===state.editingNews?item:n)}else state.news.unshift(item);state.editingNews=null;persist();renderNews();e.currentTarget.reset();toast('公告已儲存；前台重新整理後即可預覽');setView('news')});
$('#eventForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const region=f.get('region');const image=region==='中區'?'images/event-central-workshop.png':region==='北區'?'images/event-north-workshop.png':'images/event-south-workshop.png';const item={id:state.editingEvent||Date.now(),region,date:f.get('date'),title:f.get('title'),place:f.get('place'),url:f.get('url')||'',image};if(state.editingEvent){state.events=state.events.map(x=>x.id===state.editingEvent?item:x)}else state.events.push(item);state.editingEvent=null;persist();renderEvents();e.currentTarget.reset();toast('活動已儲存；前台重新整理後即可預覽');setView('events')});
document.addEventListener('click',e=>{
 const en=e.target.closest('[data-edit-news]');if(en){const item=state.news.find(n=>n.id===Number(en.dataset.editNews));if(item){state.editingNews=item.id;fillForm($('#newsForm'),{...item,draft:item.status==='草稿'});$('#newsForm')?.scrollIntoView({behavior:'smooth',block:'start'});toast('已載入公告，可直接修改後儲存')}return}
 const dn=e.target.closest('[data-delete-news]');if(dn){if(confirm('確定刪除這則公告？')){state.news=state.news.filter(n=>n.id!==Number(dn.dataset.deleteNews));persist();renderNews();toast('公告已刪除')}return}
 const ee=e.target.closest('[data-edit-event]');if(ee){const item=state.events.find(x=>x.id===Number(ee.dataset.editEvent));if(item){state.editingEvent=item.id;fillForm($('#eventForm'),item);$('#eventForm')?.scrollIntoView({behavior:'smooth',block:'start'});toast('已載入活動，可直接修改後儲存')}return}
 const de=e.target.closest('[data-delete-event]');if(de){if(confirm('確定刪除這筆活動？')){state.events=state.events.filter(x=>x.id!==Number(de.dataset.deleteEvent));persist();renderEvents();toast('活動已刪除')}return}
});
$$('[data-save-demo]').forEach(b=>b.addEventListener('click',()=>toast('此區功能版面已完成，正式雲端儲存將於 Firebase 串接後啟用')));
renderNews();renderEvents();updateStats();
