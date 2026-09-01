const newsData=[
 {date:'2026-09-01',cat:'重要公告',tag:'important',title:'114年度全國高級中等學校圖書館輔導團研習開放報名',desc:'中區、南區、北區場次資訊與報名連結。',url:'https://www.shs.edu.tw/'},
 {date:'2026-08-28',cat:'研習活動',tag:'',title:'AI時代圖書館創新應用研習－中區場次資訊',desc:'研習日期：9/03｜國立中興大學圖書館。',url:'#events'},
 {date:'2026-08-21',cat:'閱讀推廣',tag:'',title:'2026全國閱讀推廣教師研習－活動花絮',desc:'精彩課程與活動照片已上傳，歡迎瀏覽。',url:'#outcomes'},
 {date:'2026-08-15',cat:'小論文',tag:'paper',title:'114學年度全國高級中等學校小論文寫作比賽資訊',desc:'競賽與投稿資訊請依中學生網站公告為準。',url:'https://www.shs.edu.tw/'},
 {date:'2026-08-08',cat:'AI與數位應用',tag:'ai',title:'生成式AI在圖書館服務的應用與實踐',desc:'研習教材與簡報已上傳至資源中心。',url:'#resources'}
];
const events=[
 {region:'中區',day:'03',month:'SEP',cls:'',image:'images/event-central-workshop.png',title:'AI時代圖書館創新應用研習',place:'國立中興大學｜圖書館6樓會議廳'},
 {region:'南區',day:'12',month:'SEP',cls:'south',image:'images/event-south-workshop.png',title:'閱讀素養與多元文本教學研習',place:'國立成功大學｜圖書館總館B1會議廳'},
 {region:'北區',day:'25',month:'SEP',cls:'north',image:'images/event-north-workshop.png',title:'小論文寫作與格式輔導實作研習',place:'國立陽明交通大學｜浩然圖書資訊中心'}
];
const list=document.querySelector('#newsList'), search=document.querySelector('#newsSearch'), filters=document.querySelector('#newsFilters'), empty=document.querySelector('#emptyNews');
let active='all';
function renderNews(){const q=(search?.value||'').trim().toLowerCase();const data=newsData.filter(n=>(active==='all'||n.cat===active)&&(`${n.date} ${n.cat} ${n.title} ${n.desc}`).toLowerCase().includes(q));list.innerHTML=data.map(n=>`<a class="news-item" href="${n.url}" ${n.url.startsWith('http')?'target="_blank" rel="noopener"':''}><div class="news-date">${n.date}</div><div><span class="tag ${n.tag}">${n.cat}</span><h3>${n.title}</h3><p>${n.desc}</p></div><div class="arrow">›</div></a>`).join('');empty.hidden=data.length!==0}
search?.addEventListener('input',renderNews);filters?.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;[...filters.children].forEach(b=>b.classList.remove('is-active'));e.target.classList.add('is-active');active=e.target.dataset.filter;renderNews()});
const eventGrid=document.querySelector('#eventGrid');eventGrid.innerHTML=events.map(e=>`<a class="event-card" href="#"><div class="event-cover ${e.cls}" style="background-image:url('${e.image}')"><span class="region">${e.region}</span></div><div class="event-body"><div class="date-big"><b>${e.day}</b><span>${e.month}</span></div><h3>${e.title}</h3><p>${e.place}</p><span class="mini-btn">了解活動 →</span></div></a>`).join('');

// V2 image assets: replace prototype CSS artwork with the uploaded official visuals.
const heroArt=document.querySelector('.hero-illustration');
if(heroArt){heroArt.innerHTML='<img class="hero-main-image" src="images/hero-library-ai.png" alt="閱讀、科技與教育，共創圖書館的未來">';}
const galleryItems=[
 ['images/gallery-central-workshop.png','中區研習活動紀錄'],
 ['images/gallery-national-exchange.png','全國輔導團交流'],
 ['images/gallery-ai-sharing.png','AI應用分享']
];
document.querySelectorAll('.gallery figure').forEach((figure,i)=>{const item=galleryItems[i];if(!item)return;const photo=figure.querySelector('.photo');if(photo)photo.innerHTML=`<img src="${item[0]}" alt="${item[1]}" loading="lazy">`;});
const imageStyles=document.createElement('style');
imageStyles.textContent=`
.hero-illustration{height:auto!important;min-height:430px;display:flex;align-items:center;justify-content:center}
.hero-main-image{width:100%;height:auto;max-height:520px;object-fit:contain;display:block;border-radius:28px;filter:drop-shadow(0 18px 30px rgba(45,105,112,.08))}
.event-cover{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}
.event-cover:before,.event-cover:after{display:none!important}
.event-cover .region{box-shadow:0 4px 12px rgba(20,65,70,.12)}
.gallery .photo{overflow:hidden;padding:0!important}
.gallery .photo img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .35s ease}
.gallery figure:hover .photo img{transform:scale(1.025)}
.gallery .photo>span{display:none!important}
@media(max-width:900px){.hero-illustration{min-height:0}.hero-main-image{max-height:none;border-radius:20px}}
`;
document.head.appendChild(imageStyles);

const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mainNav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
renderNews();
