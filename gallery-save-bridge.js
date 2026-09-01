(()=>{
'use strict';
const KEY='libraryGuidanceCMSv2';
window.__libraryGallerySave=function(payload){
  try{
    if(typeof upsert==='function'&&typeof resetForm==='function'){
      upsert('gallery',payload,'成果');
      resetForm('galleryForm');
      return true;
    }
  }catch(e){console.warn('Direct gallery save unavailable, using fallback',e)}
  try{
    const st=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(!Array.isArray(st.gallery))st.gallery=[];
    const id=Number(payload.id||0);
    const item={...payload,id:id||Date.now()};
    if(id){const i=st.gallery.findIndex(x=>Number(x.id)===id);if(i>=0)st.gallery[i]={...st.gallery[i],...item};else st.gallery.unshift(item)}else st.gallery.unshift(item);
    if(!Array.isArray(st.logs))st.logs=[];
    st.logs.unshift({time:new Date().toLocaleString('zh-TW',{hour12:false}),action:`新增成果：${payload.title||''}`});
    localStorage.setItem(KEY,JSON.stringify(st));
    const tbody=document.getElementById('galleryTableBody');
    if(tbody){const tr=document.createElement('tr');tr.innerHTML=`<td>${payload.date||'—'}</td><td>${payload.category||''}</td><td>${payload.title||''}</td><td>${payload.home?'是':'否'}</td><td><span class="status-pill">已儲存</span></td>`;tbody.prepend(tr)}
    const form=document.getElementById('galleryForm');if(form){form.reset();const hidden=form.elements.id;if(hidden)hidden.value=''}
    const t=document.getElementById('toast');if(t){t.textContent='成果已儲存';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
    return true;
  }catch(e){console.error('Gallery save fallback failed',e);return false}
};
})();