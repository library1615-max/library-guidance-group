(()=>{
'use strict';
const KEY='libraryGuidanceCMSv2';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function render(){const st=read(),settings=st.settings||{};const footer=document.querySelector('.footer .footer-grid');if(!footer)return;const cols=[...footer.children];const contact=cols.find(x=>x.querySelector('h4')?.textContent.includes('聯絡與資訊'))||cols[cols.length-1];if(!contact)return;const email=String(settings.email||'').trim();const phone=String(settings.phone||'').trim();const copyright=contact.querySelector('.admin-entry')?.closest('p');let box=contact.querySelector('.footer-contact-live');if(!box){box=document.createElement('div');box.className='footer-contact-live';const h=contact.querySelector('h4');h?.after(box)}box.innerHTML=`${email?`<p><strong>聯絡 Email</strong><br><a href="mailto:${esc(email)}">${esc(email)}</a></p>`:''}${phone?`<p><strong>聯絡電話</strong><br>${esc(phone)}</p>`:''}${!email&&!phone?'<p>聯絡資訊尚未設定</p>':''}`;copyright?.parentNode?.appendChild(copyright);const first=cols[0];if(first&&settings.footerText){const p=first.querySelector('p');if(p)p.textContent=settings.footerText}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();