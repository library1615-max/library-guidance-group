(()=>{
'use strict';
const safe=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function val(form,name,fallback=''){const el=form?.elements?.[name];if(!el)return fallback;if(el.type==='checkbox')return el.checked;return String(el.value??'').trim()||fallback}
function renderNews(){
  const form=document.getElementById('newsForm');
  if(!form)return;
  const card=form.closest('.editor-grid')?.querySelector('.preview-card');
  if(!card)return;
  card.classList.add('live-preview');
  let box=card.querySelector('.preview-content');
  if(!box){
    card.innerHTML='<div class="preview-eyebrow">即時預覽</div><div class="preview-content"></div><small class="preview-help">輸入欄位後，此處會同步顯示前台內容概念。</small>';
    box=card.querySelector('.preview-content');
  }
  const cat=val(form,'cat','其他');
  const title=val(form,'title','公告標題');
  const desc=val(form,'desc','公告簡短說明會顯示在這裡。');
  const date=val(form,'date','發布日期');
  const status=val(form,'draft',false)?'草稿':'已發布';
  box.innerHTML=`<span class="tag-demo">${safe(cat)}</span><h3>${safe(title)}</h3><p>${safe(desc)}</p><small>${safe(date)} ｜${status}</small>`;
}
function bind(){
  const form=document.getElementById('newsForm');
  if(!form||form.dataset.previewFixBound)return;
  form.dataset.previewFixBound='1';
  ['input','change','keyup','paste'].forEach(type=>form.addEventListener(type,()=>requestAnimationFrame(renderNews)));
  form.addEventListener('reset',()=>setTimeout(renderNews,0));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-edit-news], [data-reset-form="newsForm"], .nav-btn[data-view="news"]')) setTimeout(renderNews,60);
  });
  renderNews();
  setTimeout(renderNews,100);
  setTimeout(renderNews,500);
  let signature='';
  setInterval(()=>{
    if(!document.querySelector('.view[data-view="news"].active'))return;
    const next=['cat','title','desc','date'].map(n=>val(form,n,'')).join('\u0001')+'\u0001'+val(form,'draft',false);
    if(next!==signature){signature=next;renderNews()}
  },400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
