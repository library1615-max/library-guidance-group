(()=>{
'use strict';
const KEY='libraryGuidanceCMSv2';
const URL='workshop-115.html';
const TITLE='115年度「AI輔助圖書館營運與學術寫作增能研習」北中南三區資訊';
function run(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return;
    const state=JSON.parse(raw);
    if(!Array.isArray(state.news))state.news=[];
    const exists=state.news.some(n=>String(n.url||'').includes('workshop-115.html')||String(n.title||'')===TITLE);
    if(exists)return;
    state.news.unshift({
      id:Date.now(),
      date:'2026-09-02',
      cat:'研習活動',
      title:TITLE,
      desc:'115年度全國高級中等學校圖書館輔導團研習總覽，包含中區、北區、南區場次日期、地點、課程講師、接駁交通、停車與共同研習資訊。',
      url:URL,
      pin:true,
      draft:false
    });
    localStorage.setItem(KEY,JSON.stringify(state));
    sessionStorage.setItem('workshopNewsImported','1');
    setTimeout(()=>location.reload(),1400);
  }catch(e){console.warn('Workshop news import skipped',e)}
}
if(sessionStorage.getItem('workshopNewsImported')==='1')return;
setTimeout(run,900);
})();