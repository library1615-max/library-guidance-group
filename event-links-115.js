(()=>{
'use strict';
const map={
  '中區':'workshop-115.html#central',
  '北區':'workshop-115.html#north',
  '南區':'workshop-115.html#south'
};
function detectRegion(el){
  const text=(el.textContent||'').replace(/\s+/g,'');
  if(text.includes('中區')||text.includes('2026-09-04')||text.includes('09月04'))return '中區';
  if(text.includes('北區')||text.includes('2026-09-11')||text.includes('09月11'))return '北區';
  if(text.includes('南區')||text.includes('2026-09-22')||text.includes('09月22'))return '南區';
  return '';
}
function patch(){
  document.querySelectorAll('#eventGrid .event-card, body[data-page="events"] #contentGrid .content-card').forEach(card=>{
    const region=detectRegion(card);
    if(!region)return;
    card.href=map[region];
    card.removeAttribute('target');
    card.removeAttribute('rel');
    const more=card.querySelector('.mini-btn,.more');
    if(more)more.textContent='查看完整課程與交通資訊 →';
  });
}
let timer;
const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(patch,30)});
observer.observe(document.documentElement,{childList:true,subtree:true});
patch();
setTimeout(patch,500);
setTimeout(patch,1800);
})();