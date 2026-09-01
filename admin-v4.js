(()=>{
'use strict';
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const KEY='libraryGuidanceCMSv2';
const readState=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const safe=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function goView(name){const btn=$(`.nav-btn[data-view="${name}"]`);if(btn)btn.click()}

function addTopPreview(){
 const actions=$('.top-actions'); if(!actions||$('#frontPreviewBtn'))return;
 const a=document.createElement('a');a.id='frontPreviewBtn';a.className='top-preview-btn';a.href='index.html';a.target='_blank';a.rel='noopener';a.innerHTML='↗ 預覽前台';actions.prepend(a);
}

function addMobileNavigation(){
 const topLeft=$('.topbar > div:first-child');
 if(topLeft&&!$('#mobileHomeBtn')){
  const b=document.createElement('button');b.id='mobileHomeBtn';b.type='button';b.className='mobile-home-btn';b.innerHTML='← <span>總覽</span>';b.setAttribute('aria-label','返回總覽');b.addEventListener('click',()=>goView('dashboard'));topLeft.insertBefore(b,$('#pageTitle'));
 }
 if(!$('#mobileAdminDock')){
  const dock=document.createElement('nav');dock.id='mobileAdminDock';dock.className='mobile-admin-dock';dock.setAttribute('aria-label','手機版後台快速導覽');dock.innerHTML='<button type="button" data-mobile-view="dashboard"><span>⌂</span><b>總覽</b></button><button type="button" data-mobile-menu><span>☰</span><b>功能</b></button><a href="index.html" target="_blank" rel="noopener"><span>↗</span><b>前台</b></a>';
  document.body.appendChild(dock);
  dock.querySelector('[data-mobile-view="dashboard"]')?.addEventListener('click',()=>goView('dashboard'));
  dock.querySelector('[data-mobile-menu]')?.addEventListener('click',()=>$('#sidebar')?.classList.toggle('open'));
 }
 const sync=()=>{const current=$('.view.active')?.dataset.view||'dashboard';document.body.dataset.adminView=current;$('#mobileHomeBtn')?.classList.toggle('show',current!=='dashboard');$$('#mobileAdminDock button').forEach(x=>x.classList.toggle('active',x.dataset.mobileView===current))};
 const observer=new MutationObserver(sync);$$('.view').forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));sync();
}

function addPublishCenter(){
 const dashboard=$('.view[data-view="dashboard"]'); if(!dashboard||$('#publishCenter'))return;
 const panel=document.createElement('section');panel.className='panel publish-center';panel.id='publishCenter';
 panel.innerHTML=`<div class="panel-head publish-head"><div><h3>發布檢查中心</h3><p>發布內容前，快速確認草稿、連結、圖片與活動資料是否完整。</p></div><div class="row-actions"><button class="secondary-btn" id="runPublishCheck" type="button">重新檢查</button><a class="primary-btn link-btn" href="index.html" target="_blank" rel="noopener">開啟前台</a></div></div><div class="publish-grid" id="publishGrid"></div><div class="upcoming-box"><div class="mini-title">最近活動</div><div id="upcomingEvents"></div></div>`;
 const firstPanel=dashboard.querySelector('.panel'); firstPanel?.after(panel) || dashboard.append(panel);
 $('#runPublishCheck')?.addEventListener('click',()=>{renderPublishCenter();window.toast?.('已重新檢查網站資料')});renderPublishCenter();
}

function renderPublishCenter(){
 const st=readState(),news=st.news||[],events=st.events||[],resources=st.resources||[],gallery=st.gallery||[],links=st.links||[],settings=st.settings||{};
 const drafts=news.filter(x=>x.draft).length;
 const brokenLinks=[...news,...events,...resources,...gallery,...links].filter(x=>x.url!==undefined&&String(x.url||'').trim()==='').length;
 const missingImages=[...events,...gallery].filter(x=>!String(x.image||'').trim()).length;
 const missingSettings=['siteName','heroTitle','heroDesc','seoDesc'].filter(k=>!String(settings[k]||'').trim()).length;
 const checks=[{name:'已發布公告',value:news.length-drafts,ok:true,note:`另有 ${drafts} 則草稿`},{name:'空白連結',value:brokenLinks,ok:brokenLinks===0,note:brokenLinks?'建議補上網址或檔案連結':'連結資料完整'},{name:'缺少圖片',value:missingImages,ok:missingImages===0,note:missingImages?'活動或成果尚未設定圖片':'圖片欄位完整'},{name:'網站基本設定',value:missingSettings===0?'完整':`${missingSettings} 項未填`,ok:missingSettings===0,note:'檢查網站名稱、Hero 與 SEO 摘要'}];
 const grid=$('#publishGrid'); if(grid)grid.innerHTML=checks.map(c=>`<article class="publish-check ${c.ok?'ok':'warn'}"><span class="check-icon">${c.ok?'✓':'!'}</span><div><b>${safe(c.name)}</b><strong>${safe(c.value)}</strong><small>${safe(c.note)}</small></div></article>`).join('');
 const upcoming=$('#upcomingEvents');if(upcoming){const arr=[...events].filter(e=>e.date).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);upcoming.innerHTML=arr.length?arr.map(e=>`<div class="upcoming-row"><time>${safe(e.date)}</time><span class="region-chip">${safe(e.region||'活動')}</span><b>${safe(e.title||'未命名活動')}</b><span>${safe(e.place||'')}</span></div>`).join(''):'<p class="empty-note">目前沒有活動資料。</p>'}
}

function addLivePreview(formId,type){
 const form=document.getElementById(formId); if(!form||form.dataset.v4Preview)return; form.dataset.v4Preview='1';
 const grid=form.closest('.editor-grid'); const old=grid?.querySelector('.preview-card'); if(!old)return;
 old.classList.add('live-preview'); old.innerHTML='<div class="preview-eyebrow">即時預覽</div><div class="preview-content"></div><small class="preview-help">輸入欄位後，此處會同步顯示前台內容概念。</small>';
 const render=()=>{const d=new FormData(form),box=old.querySelector('.preview-content');if(!box)return;
  if(type==='news')box.innerHTML=`<span class="tag-demo">${safe(d.get('cat')||'公告')}</span><h3>${safe(d.get('title')||'公告標題')}</h3><p>${safe(d.get('desc')||'公告簡短說明會顯示在這裡。')}</p><small>${safe(d.get('date')||'發布日期')} ${form.elements.draft?.checked?'｜草稿':'｜已發布'}</small>`;
  if(type==='event'){const img=d.get('image');box.innerHTML=`${img?`<img src="${safe(img)}" alt="活動圖片預覽" onerror="this.style.display='none'">`:''}<span class="tag-demo">${safe(d.get('region')||'區域')}</span><h3>${safe(d.get('title')||'活動名稱')}</h3><p>${safe(d.get('place')||'活動地點')}</p><small>${safe(d.get('date')||'活動日期')}</small>`}
  if(type==='resource')box.innerHTML=`<div class="preview-icon">${safe(d.get('icon')||'冊')}</div><span class="tag-demo">${safe(d.get('category')||'資源分類')}</span><h3>${safe(d.get('title')||'資源名稱')}</h3><p>${safe(d.get('desc')||'資源說明')}</p>`;
  if(type==='gallery'){const img=d.get('image');box.innerHTML=`${img?`<img src="${safe(img)}" alt="成果圖片預覽" onerror="this.style.display='none'">`:''}<span class="tag-demo">${safe(d.get('category')||'成果分類')}</span><h3>${safe(d.get('title')||'成果標題')}</h3><p>${safe(d.get('desc')||'成果摘要')}</p>`}
  if(type==='link')box.innerHTML=`<div class="preview-icon">${safe(d.get('icon')||'↗')}</div><h3>${safe(d.get('title')||'網站名稱')}</h3><p>${safe(d.get('desc')||'網站簡短說明')}</p><small>${safe(d.get('url')||'https://')}</small>`;
 };
 form.addEventListener('input',render);form.addEventListener('change',render);render();
}

function addFilters(){
 const newsHead=$('.view[data-view="news"] .panel-head');if(newsHead&&!$('#newsStatusFilter')){const s=document.createElement('select');s.id='newsStatusFilter';s.className='search-input compact-select';s.innerHTML='<option value="all">全部狀態</option><option value="published">已發布</option><option value="draft">草稿</option>';newsHead.append(s);s.addEventListener('change',filterNewsRows)}
 const eventHead=$('.view[data-view="events"] .panel-head');if(eventHead&&!$('#eventRegionFilter')){const s=document.createElement('select');s.id='eventRegionFilter';s.className='search-input compact-select';s.innerHTML='<option value="all">全部區域</option><option>中區</option><option>北區</option><option>南區</option>';eventHead.append(s);s.addEventListener('change',filterEventRows)}
}
function filterNewsRows(){const v=$('#newsStatusFilter')?.value||'all';$$('#newsTableBody tr').forEach(tr=>{const t=tr.textContent;tr.hidden=v==='draft'?!t.includes('草稿'):v==='published'?!t.includes('已發布'):false})}
function filterEventRows(){const v=$('#eventRegionFilter')?.value||'all';$$('#eventTableBody tr').forEach(tr=>{tr.hidden=v!=='all'&&!tr.textContent.includes(v)})}
function enhanceTables(){const observer=new MutationObserver(()=>{filterNewsRows();filterEventRows();renderPublishCenter()});['newsTableBody','eventTableBody','resourceTableBody','galleryTableBody','linkTableBody'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true})})}

function addUnsavedIndicator(){
 const top=$('.top-actions');if(!top||$('#unsavedBadge'))return;const badge=document.createElement('span');badge.id='unsavedBadge';badge.className='unsaved-badge';badge.textContent='尚未修改';top.insertBefore(badge,top.lastElementChild);let dirty=false;
 $$('form').forEach(f=>{f.addEventListener('input',()=>{dirty=true;badge.textContent='有未儲存變更';badge.classList.add('dirty')});f.addEventListener('submit',()=>setTimeout(()=>{dirty=false;badge.textContent='已儲存';badge.classList.remove('dirty')},50));f.addEventListener('reset',()=>{dirty=false;badge.textContent='尚未修改';badge.classList.remove('dirty')})});window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}})
}

function init(){addTopPreview();addMobileNavigation();addPublishCenter();addLivePreview('newsForm','news');addLivePreview('eventForm','event');addLivePreview('resourceForm','resource');addLivePreview('galleryForm','gallery');addLivePreview('linkForm','link');addFilters();enhanceTables();addUnsavedIndicator()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();