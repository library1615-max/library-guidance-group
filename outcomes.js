(()=>{
'use strict';
const KEY='libraryGuidanceCMSv2';
const fallback=[
 {id:1,title:'中區研習活動紀錄',date:'2026-09-04',category:'研習活動',image:'images/gallery-central-workshop.png',desc:'中區研習活動成果紀錄',home:true},
 {id:2,title:'全國輔導團交流',date:'2026-09-11',category:'交流分享',image:'images/gallery-national-exchange.png',desc:'全國圖書館輔導團專業交流',home:true},
 {id:3,title:'AI應用分享',date:'2026-09-22',category:'AI應用',image:'images/gallery-ai-sharing.png',desc:'AI與圖書館創新應用分享',home:true}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
let cms={};try{cms=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
const items=Array.isArray(cms.gallery)&&cms.gallery.length?cms.gallery:fallback;
const search=document.getElementById('outcomeSearch'),select=document.getElementById('outcomeCategory'),grid=document.getElementById('outcomesGrid'),empty=document.getElementById('outcomesEmpty'),count=document.getElementById('resultCount');
const cats=[...new Set(items.map(x=>x.category).filter(Boolean))].sort();select.innerHTML='<option value="all">全部分類</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
function render(){const q=(search.value||'').trim().toLowerCase(),cat=select.value;const data=[...items].filter(x=>(cat==='all'||x.category===cat)&&(`${x.title||''} ${x.desc||''} ${x.category||''} ${x.date||''}`).toLowerCase().includes(q)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));count.textContent=`共 ${data.length} 筆成果`;grid.innerHTML=data.map(x=>`<a class="outcome-list-card" href="outcome.html?id=${encodeURIComponent(x.id)}"><div class="cover"><img src="${esc(x.image||'images/gallery-central-workshop.png')}" alt="${esc(x.title||'活動成果')}" loading="lazy"><span class="badge">${esc(x.category||'活動成果')}</span></div><div class="body"><h3>${esc(x.title||'活動成果')}</h3><p>${esc(x.desc||'點擊查看活動照片與完整說明。')}</p><div class="outcome-meta"><span>${esc(x.date||'')}</span><b>查看活動 →</b></div></div></a>`).join('');empty.hidden=data.length!==0}
search.addEventListener('input',render);select.addEventListener('change',render);render();
})();