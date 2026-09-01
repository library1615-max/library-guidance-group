const defaultNews=[
 {date:'2026-09-01',cat:'重要公告',tag:'important',title:'115年度全國高級中等學校圖書館輔導團研習開放報名',desc:'中區、北區、南區場次資訊與報名連結。',url:'https://www.shs.edu.tw/',status:'已發布'},
 {date:'2026-08-28',cat:'研習活動',tag:'',title:'AI時代圖書館創新應用研習－中區場次資訊',desc:'研習日期：9/04｜國立中興大學圖書館6樓會議廳。',url:'#events',status:'已發布'},
 {date:'2026-08-21',cat:'閱讀推廣',tag:'',title:'2026全國閱讀推廣教師研習－活動花絮',desc:'精彩課程與活動照片已上傳，歡迎瀏覽。',url:'#outcomes',status:'已發布'},
 {date:'2026-08-15',cat:'小論文',tag:'paper',title:'115學年度全國高級中等學校小論文寫作比賽資訊',desc:'競賽與投稿資訊請依中學生網站公告為準。',url:'https://www.shs.edu.tw/',status:'已發布'},
 {date:'2026-08-08',cat:'AI與數位應用',tag:'ai',title:'生成式AI在圖書館服務的應用與實踐',desc:'研習教材與簡報已上傳至資源中心。',url:'#resources',status:'已發布'}
];
const defaultEvents=[
 {region:'中區',date:'2026-09-04',cls:'',image:'images/event-central-workshop.png',title:'中區圖書館輔導團研習',place:'國立中興大學｜圖書館6樓會議廳',url:'#'},
 {region:'北區',date:'2026-09-11',cls:'north',image:'images/event-north-workshop.png',title:'北區圖書館輔導團研習',place:'國立陽明交通大學｜浩然圖書資訊中心B1國際會議廳',url:'#'},
 {region:'南區',date:'2026-09-22',cls:'south',image:'images/event-south-workshop.png',title:'南區圖書館輔導團研習',place:'國立成功大學｜成功校區圖書館總館B1會議廳',url:'#'}
];
function loadLocal(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)&&v.length?v:fallback}catch{return fallback}}
const storedNews=loadLocal('lgg_news',null);
const storedEvents=loadLocal('lgg_events',null);
const newsData=(storedNews||defaultNews).filter(n=>n.status!=='草稿').map(n=>({...n,desc:n.desc||n.content||'',tag:n.tag||(n.cat==='重要公告'?'important':n.cat==='AI與數位應用'?'ai':n.cat==='小論文'?'paper':''),url:n.url||'#'}));
const events=(storedEvents||defaultEvents).map(e=>{const d=String(e.date||'').split('-');const region=e.region||'中區';return {...e,day:d[2]||'',month:d[1]||'',cls:e.cls||(region==='南區'?'south':region==='北區'?'north':''),image:e.image||(region==='中區'?'images/event-central-workshop.png':region==='北區'?'images/event-north-workshop.png':'images/event-south-workshop.png'),url:e.url||'#'}});
const list=document.querySelector('#newsList'),search=document.querySelector('#newsSearch'),filters=document.querySelector('#newsFilters'),empty=document.querySelector('#emptyNews');
let active='all';
function renderNews(){const q=(search?.value||'').trim().toLowerCase();const data=newsData.filter(n=>(active==='all'||n.cat===active)&&(`${n.date} ${n.cat} ${n.title} ${n.desc}`).toLowerCase().includes(q));list.innerHTML=data.map(n=>`<a class="news-item" href="${n.url}" ${n.url.startsWith('http')?'target="_blank" rel="noopener"':''}><div class="news-date">${n.date}</div><div><span class="tag ${n.tag}">${n.cat}</span><h3>${n.title}</h3><p>${n.desc}</p></div><div class="arrow">›</div></a>`).join('');empty.hidden=data.length!==0}
search?.addEventListener('input',renderNews);filters?.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;[...filters.children].forEach(b=>b.classList.remove('is-active'));e.target.classList.add('is-active');active=e.target.dataset.filter;renderNews()});
const eventGrid=document.querySelector('#eventGrid');
if(eventGrid)eventGrid.innerHTML=events.map(e=>`<a class="event-card" href="${e.url||'#'}" ${String(e.url||'').startsWith('http')?'target="_blank" rel="noopener"':''}><div class="event-cover ${e.cls}" style="background-image:url('${e.image}')"><span class="region">${e.region}</span></div><div class="event-body"><div class="date-big"><b>${e.day}</b><span>${e.month}月</span></div><h3>${e.title}</h3><p>${e.place}</p><span class="mini-btn">了解活動 →</span></div></a>`).join('');

const galleryItems=[
 ['images/gallery-central-workshop.png','中區研習活動紀錄'],
 ['images/gallery-national-exchange.png','全國輔導團交流'],
 ['images/gallery-ai-sharing.png','AI應用分享']
];
document.querySelectorAll('.gallery figure').forEach((figure,i)=>{const item=galleryItems[i];if(!item)return;const photo=figure.querySelector('.photo');if(photo)photo.innerHTML=`<img src="${item[0]}" alt="${item[1]}" loading="lazy">`;});
const imageStyles=document.createElement('style');
imageStyles.textContent=`
.event-cover{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}
.event-cover:before,.event-cover:after{display:none!important}
.event-cover .region{box-shadow:0 4px 12px rgba(20,65,70,.12)}
.gallery .photo{overflow:hidden;padding:0!important}
.gallery .photo img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .35s ease}
.gallery figure:hover .photo img{transform:scale(1.025)}
.gallery .photo>span{display:none!important}
`;
document.head.appendChild(imageStyles);
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mainNav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
renderNews();
