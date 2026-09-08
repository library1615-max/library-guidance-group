(()=>{
'use strict';
const KEY='libraryGuidanceCMSv2';
let busy=false;
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function numOrder(x,fallback){const n=Number(x?.order);return Number.isFinite(n)&&n>0?n:fallback}
function sortData(kind,arr){const a=[...(arr||[])];if(kind==='news')return a.filter(x=>!x.draft).sort((x,y)=>{if(!!x.pin!==!!y.pin)return x.pin?-1:1;if(x.pin&&y.pin)return 0;return numOrder(x,999999)-numOrder(y,999999)});return a.sort((x,y)=>numOrder(x,999999)-numOrder(y,999999))}
function reorder(containerSelector,itemSelector,titleSelector,kind,key){const box=document.querySelector(containerSelector);if(!box||busy)return;const rows=[...box.querySelectorAll(itemSelector)];if(rows.length<2)return;const st=state(),data=sortData(kind,st[key]||[]);const rank=new Map(data.map((x,i)=>[String(x.title||'').trim(),i]));busy=true;rows.sort((a,b)=>(rank.get(a.querySelector(titleSelector)?.textContent.trim())??999999)-(rank.get(b.querySelector(titleSelector)?.textContent.trim())??999999)).forEach(x=>box.appendChild(x));busy=false}
function apply(){reorder('#newsList','.news-item','h3','news','news');reorder('#eventGrid','.event-card','h3','events','events');reorder('.feature-strip','.feature-card','h3','resources','resources');reorder('.quick-grid','.quick-card','h2','links','links')}
function init(){apply();const obs=new MutationObserver(()=>{if(!busy)requestAnimationFrame(apply)});['#newsList','#eventGrid','.feature-strip','.quick-grid'].forEach(s=>{const el=document.querySelector(s);if(el)obs.observe(el,{childList:true})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,50));else setTimeout(init,50);
})();