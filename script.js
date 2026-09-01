const defaultData={
 news:[
  {id:1,date:'2026-09-01',cat:'重要公告',title:'115年度全國高級中等學校圖書館輔導團研習開放報名',desc:'中區、北區、南區場次資訊與報名連結。',url:'https://www.shs.edu.tw/',pin:true,draft:false},
  {id:2,date:'2026-08-28',cat:'研習活動',title:'AI時代圖書館創新應用研習－中區場次資訊',desc:'研習日期：9/04｜國立中興大學圖書館6樓會議廳。',url:'#events',pin:false,draft:false},
  {id:3,date:'2026-08-21',cat:'閱讀推廣',title:'2026全國閱讀推廣教師研習－活動花絮',desc:'精彩課程與活動照片已上傳，歡迎瀏覽。',url:'#outcomes',pin:false,draft:false}
 ],
 events:[
  {id:1,region:'中區',date:'2026-09-04',image:'images/event-central-workshop.png',title:'中區圖書館輔導團研習',place:'國立中興大學｜圖書館6樓會議廳',url:'#'},
  {id:2,region:'北區',date:'2026-09-11',image:'images/event-north-workshop.png',title:'北區圖書館輔導團研習',place:'國立陽明交通大學｜浩然圖書資訊中心B1國際會議廳',url:'#'},
  {id:3,region:'南區',date:'2026-09-22',image:'images/event-south-workshop.png',title:'南區圖書館輔導團研習',place:'國立成功大學｜成功校區圖書館總館B1會議廳',url:'#'}
 ],
 resources:[
  {id:1,title:'專題資源',desc:'豐富的圖書館專業資源與教材工具',url:'#resources',icon:'冊',home:true},
  {id:2,title:'活動成果',desc:'研習活動花絮與成果分享',url:'#outcomes',icon:'◉',home:true},
  {id:3,title:'AI應用專區',desc:'AI在圖書館的創新應用與教學資源',url:'#resources',icon:'AI',home:true},
  {id:4,title:'研習教材',desc:'研習簡報與教學資源下載專區',url:'#resources',icon:'▣',home:true},
  {id:5,title:'法規政策',desc:'圖書館相關法規與政策下載',url:'#resources',icon:'§',home:true}
 ],
 gallery:[
  {id:1,title:'中區研習活動紀錄',image:'images/gallery-central-workshop.png',url:'',home:true},
  {id:2,title:'全國輔導團交流',image:'images/gallery-national-exchange.png',url:'',home:true},
  {id:3,title:'AI應用分享',image:'images/gallery-ai-sharing.png',url:'',home:true}
 ],
 links:[
  {id:1,title:'中學生網站',desc:'小論文、閱讀心得與學習資源',url:'https://www.shs.edu.tw/',icon:'◎',order:1,home:true},
  {id:2,title:'高中職小論文檢核輔助系統',desc:'AI輔助小論文格式自我檢核',url:'https://library1615-max.github.io/thesis-format-system/',icon:'AI',order:2,home:true}
 ],
 settings:{siteName:'全國高級中等學校圖書館輔導團',kicker:'閱讀 × 科技 × 教育',heroTitle:'共創圖書館的未來',heroDesc:'串聯全國高中職圖書館專業能量，推動閱讀素養、AI應用與多元學習。',seoDesc:'全國高級中等學校圖書館輔導團官方網站',footerText:'閱讀・科技・教育・共創'}
};
const KEY='libraryGuidanceCMSv2';
function loadCMS(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v)return {...defaultData,...v};const oldNews=JSON.parse(localStorage.getItem('lgg_news')||'null'),oldEvents=JSON.parse(localStorage.getItem('lgg_events')||'null');return {...defaultData,news:Array.isArray(oldNews)&&oldNews.length?oldNews:defaultData.news,events:Array.isArray(oldEvents)&&oldEvents.length?oldEvents:defaultData.events}}catch{return defaultData}}
const cms=loadCMS();
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const iconSvg=(type)=>{
 const common='viewBox="0 0 48 48" fill="none" aria-hidden="true"';
 const icons={
  student:`<svg ${common}><path d="M9 13.5c5.8 0 10.8 1.8 15 5.5 4.2-3.7 9.2-5.5 15-5.5v22c-5.8 0-10.8 1.7-15 5-4.2-3.3-9.2-5-15-5v-22Z"/><path d="M24 19v21.5"/><path d="M13 18.5c3.7.2 6.7 1.1 9 2.8M35 18.5c-3.7.2-6.7 1.1-9 2.8"/><path class="accent" d="M34 8v5M31.5 10.5h5"/></svg>`,
  thesis:`<svg ${common}><path d="M14 7h15l8 8v26H14V7Z"/><path d="M29 7v9h8"/><path d="m20 28 3.4 3.4L31 23.8"/><circle class="accent" cx="10" cy="14" r="2"/><circle class="accent" cx="9" cy="22" r="1.5"/><path class="accent" d="M10 16v4"/></svg>`,
  resources:`<svg ${common}><path d="M10 11h9v27h-9zM20 9h9v29h-9zM30 14h8v24h-8z"/><path d="M13 17h3M23 15h3M33 20h2"/><path class="accent" d="M7 38h34"/></svg>`,
  gallery:`<svg ${common}><rect x="8" y="10" width="32" height="28" rx="4"/><circle cx="18" cy="19" r="3"/><path d="m12 33 8-8 6 6 4-4 6 6"/><path class="accent" d="M35 7v5M32.5 9.5h5"/></svg>`,
  ai:`<svg ${common}><circle cx="24" cy="24" r="6"/><circle cx="11" cy="13" r="3"/><circle cx="37" cy="12" r="3"/><circle cx="39" cy="34" r="3"/><circle cx="11" cy="35" r="3"/><path d="m15 16 5 5M29 20l5-5M29 28l7 4M19 29l-5 4"/><path class="accent" d="M24 8v6M24 34v6"/></svg>`,
  training:`<svg ${common}><rect x="8" y="9" width="32" height="24" rx="3"/><path d="M15 17h18M15 23h12M24 33v7M18 40h12"/><path class="accent" d="m32 26 3-3 3 3"/></svg>`,
  policy:`<svg ${common}><path d="M24 7 37 12v10c0 9.1-5.3 15.1-13 19-7.7-3.9-13-9.9-13-19V12l13-5Z"/><path d="M18 19h12M18 25h9"/><path class="accent" d="m19 31 3 3 7-7"/></svg>`,
  link:`<svg ${common}><path d="M19 29 29 19M16 16h-4a7 7 0 0 0 0 14h7M32 32h4a7 7 0 1 0 0-14h-7"/></svg>`
 };
 return icons[type]||icons.link;
};
const resourceIconType=(title='')=>title.includes('活動成果')?'gallery':title.toUpperCase().includes('AI')?'ai':title.includes('研習')?'training':title.includes('法規')||title.includes('政策')?'policy':'resources';
const linkIconType=(title='')=>title.includes('中學生')?'student':title.includes('小論文')?'thesis':'link';
const newsData=(cms.news||defaultData.news).filter(n=>!(n.draft||n.status==='草稿')).map(n=>({...n,desc:n.desc||n.content||'',tag:n.cat==='重要公告'?'important':n.cat==='AI與數位應用'?'ai':n.cat==='小論文'?'paper':''})).sort((a,b)=>(b.pin-a.pin)||String(b.date).localeCompare(String(a.date)));
const events=(cms.events||defaultData.events).map(e=>{const d=String(e.date||'').split('-'),region=e.region||'中區';return {...e,day:d[2]||'',month:d[1]||'',cls:region==='南區'?'south':region==='北區'?'north':'',image:e.image||(region==='中區'?'images/event-central-workshop.png':region==='北區'?'images/event-north-workshop.png':'images/event-south-workshop.png')}}).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
const list=document.querySelector('#newsList'),search=document.querySelector('#newsSearch'),filters=document.querySelector('#newsFilters'),empty=document.querySelector('#emptyNews');let active='all';
function renderNews(){const q=(search?.value||'').trim().toLowerCase();const data=newsData.filter(n=>(active==='all'||n.cat===active)&&(`${n.date} ${n.cat} ${n.title} ${n.desc}`).toLowerCase().includes(q));if(list)list.innerHTML=data.map(n=>`<a class="news-item" href="${esc(n.url||'#')}" ${String(n.url||'').startsWith('http')?'target="_blank" rel="noopener"':''}><div class="news-date">${esc(n.date)}</div><div><span class="tag ${n.tag}">${esc(n.cat)}</span><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p></div><div class="arrow">›</div></a>`).join('');if(empty)empty.hidden=data.length!==0}
search?.addEventListener('input',renderNews);filters?.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;[...filters.children].forEach(b=>b.classList.remove('is-active'));e.target.classList.add('is-active');active=e.target.dataset.filter;renderNews()});
const eventGrid=document.querySelector('#eventGrid');if(eventGrid)eventGrid.innerHTML=events.map(e=>`<a class="event-card" href="${esc(e.url||'#')}" ${String(e.url||'').startsWith('http')?'target="_blank" rel="noopener"':''}><div class="event-cover ${e.cls}" style="background-image:url('${esc(e.image)}')"><span class="region">${esc(e.region)}</span></div><div class="event-body"><div class="date-big"><b>${esc(e.day)}</b><span>${esc(e.month)}月</span></div><h3>${esc(e.title)}</h3><p>${esc(e.place)}</p><span class="mini-btn">了解活動 →</span></div></a>`).join('');
const featureStrip=document.querySelector('.feature-strip');if(featureStrip){const palettes=['f-mint','f-pink','f-lilac','f-yellow','f-blue'];featureStrip.innerHTML=(cms.resources||[]).filter(r=>r.home).slice(0,5).map((r,i)=>`<a class="feature-card ${palettes[i%palettes.length]}" href="${esc(r.url||'#resources')}" ${String(r.url||'').startsWith('http')?'target="_blank" rel="noopener"':''}><span class="feature-icon feature-icon-svg">${iconSvg(resourceIconType(r.title))}</span><div><h3>${esc(r.title)}</h3><p>${esc(r.desc||'')}</p></div><b class="card-arrow">→</b></a>`).join('')}
const gallery=document.querySelector('.gallery');if(gallery)gallery.innerHTML=(cms.gallery||[]).filter(g=>g.home).slice(0,3).map(g=>`<figure>${g.url?`<a href="${esc(g.url)}" ${String(g.url).startsWith('http')?'target="_blank" rel="noopener"':''}>`:''}<div class="photo"><img src="${esc(g.image)}" alt="${esc(g.title)}" loading="lazy"></div><figcaption>${esc(g.title)}</figcaption>${g.url?'</a>':''}</figure>`).join('');
const quickGrid=document.querySelector('.quick-grid');if(quickGrid)quickGrid.innerHTML=[...(cms.links||[])].filter(l=>l.home).sort((a,b)=>a.order-b.order).slice(0,4).map((l,i)=>`<a class="quick-card ${i%2?'sky':'mint'}" href="${esc(l.url)}" target="_blank" rel="noopener"><div class="quick-icon quick-icon-svg">${iconSvg(linkIconType(l.title))}</div><div class="quick-copy"><h2>${esc(l.title)}</h2><p>${esc(l.desc||'')}</p><span>前往網站 <b>↗</b></span></div><span class="quick-orbit" aria-hidden="true"></span></a>`).join('');
const settings=cms.settings||defaultData.settings;const heroKicker=document.querySelector('.hero-kicker');if(heroKicker){const parts=String(settings.kicker||'閱讀 × 科技 × 教育').split('×').map(s=>s.trim());heroKicker.innerHTML=`<span class="green">${esc(parts[0]||'閱讀')}</span><b>×</b><span class="blue">${esc(parts[1]||'科技')}</span><b>×</b><span class="coral">${esc(parts[2]||'教育')}</span>`}const heroTitle=document.querySelector('.hero h1');if(heroTitle)heroTitle.textContent=settings.heroTitle||defaultData.settings.heroTitle;const lead=document.querySelector('.hero .lead');if(lead)lead.textContent=settings.heroDesc||defaultData.settings.heroDesc;document.title=`${settings.siteName||defaultData.settings.siteName}`;const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=settings.seoDesc||defaultData.settings.seoDesc;
const imageStyles=document.createElement('style');imageStyles.textContent=`.event-cover{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}.event-cover:before,.event-cover:after{display:none!important}.gallery .photo{overflow:hidden;padding:0!important}.gallery .photo img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .35s ease}.gallery figure:hover .photo img{transform:scale(1.025)}.gallery figure a{text-decoration:none;color:inherit}`;document.head.appendChild(imageStyles);
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mainNav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});renderNews();