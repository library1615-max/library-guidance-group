(()=>{
'use strict';
const KEY='libraryGuidanceCMSv2';
const page=document.body.dataset.page;
if(!['news','events','resources'].includes(page))return;
let busy=false;
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function ord(x,f){const n=Number(x?.order);return Number.isFinite(n)&&n>0?n:f}
function data(){const st=read(),arr=[...(st[page]||[])];if(page==='news')return arr.filter(x=>!x.draft).sort((a,b)=>{if(!!a.pin!==!!b.pin)return a.pin?-1:1;if(a.pin&&b.pin)return 0;return ord(a,999999)-ord(b,999999)});return arr.sort((a,b)=>ord(a,999999)-ord(b,999999))}
function apply(){const grid=document.getElementById('contentGrid');if(!grid||busy)return;const cards=[...grid.querySelectorAll('.content-card')];if(cards.length<2)return;const rank=new Map(data().map((x,i)=>[String(x.title||'').trim(),i]));busy=true;cards.sort((a,b)=>(rank.get(a.querySelector('h2')?.textContent.trim())??999999)-(rank.get(b.querySelector('h2')?.textContent.trim())??999999)).forEach(c=>grid.appendChild(c));busy=false}
function init(){apply();const grid=document.getElementById('contentGrid');if(!grid)return;new MutationObserver(()=>{if(!busy)requestAnimationFrame(apply)}).observe(grid,{childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,50));else setTimeout(init,50);
})();