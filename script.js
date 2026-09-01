const newsData=[
 {date:'2026-09-01',cat:'重要公告',tag:'important',title:'114年度全國高級中等學校圖書館輔導團研習開放報名',desc:'中區、南區、北區場次資訊與報名連結。',url:'https://www.shs.edu.tw/'},
 {date:'2026-08-28',cat:'研習活動',tag:'',title:'AI時代圖書館創新應用研習－中區場次資訊',desc:'研習日期：9/03｜國立中興大學圖書館。',url:'#events'},
 {date:'2026-08-21',cat:'閱讀推廣',tag:'',title:'2026全國閱讀推廣教師研習－活動花絮',desc:'精彩課程與活動照片已上傳，歡迎瀏覽。',url:'#outcomes'},
 {date:'2026-08-15',cat:'小論文',tag:'paper',title:'114學年度全國高級中等學校小論文寫作比賽資訊',desc:'競賽與投稿資訊請依中學生網站公告為準。',url:'https://www.shs.edu.tw/'},
 {date:'2026-08-08',cat:'AI與數位應用',tag:'ai',title:'生成式AI在圖書館服務的應用與實踐',desc:'研習教材與簡報已上傳至資源中心。',url:'#resources'}
];
const events=[
 {region:'中區',day:'03',month:'SEP',cls:'',title:'AI時代圖書館創新應用研習',place:'國立中興大學｜圖書館6樓會議廳'},
 {region:'南區',day:'12',month:'SEP',cls:'south',title:'閱讀素養與多元文本教學研習',place:'國立成功大學｜圖書館總館B1會議廳'},
 {region:'北區',day:'25',month:'SEP',cls:'north',title:'小論文寫作與格式輔導實作研習',place:'國立陽明交通大學｜浩然圖書資訊中心'}
];
const list=document.querySelector('#newsList'), search=document.querySelector('#newsSearch'), filters=document.querySelector('#newsFilters'), empty=document.querySelector('#emptyNews');
let active='all';
function renderNews(){const q=(search?.value||'').trim().toLowerCase();const data=newsData.filter(n=>(active==='all'||n.cat===active)&&(`${n.date} ${n.cat} ${n.title} ${n.desc}`).toLowerCase().includes(q));list.innerHTML=data.map(n=>`<a class="news-item" href="${n.url}" ${n.url.startsWith('http')?'target="_blank" rel="noopener"':''}><div class="news-date">${n.date}</div><div><span class="tag ${n.tag}">${n.cat}</span><h3>${n.title}</h3><p>${n.desc}</p></div><div class="arrow">›</div></a>`).join('');empty.hidden=data.length!==0}
search?.addEventListener('input',renderNews);filters?.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;[...filters.children].forEach(b=>b.classList.remove('is-active'));e.target.classList.add('is-active');active=e.target.dataset.filter;renderNews()});
const eventGrid=document.querySelector('#eventGrid');eventGrid.innerHTML=events.map(e=>`<a class="event-card" href="#"><div class="event-cover ${e.cls}"><span class="region">${e.region}</span></div><div class="event-body"><div class="date-big"><b>${e.day}</b><span>${e.month}</span></div><h3>${e.title}</h3><p>${e.place}</p><span class="mini-btn">了解活動 →</span></div></a>`).join('');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mainNav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
renderNews();
