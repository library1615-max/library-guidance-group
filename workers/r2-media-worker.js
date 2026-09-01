export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || 'https://library1615-max.github.io',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Filename',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (!['POST','DELETE'].includes(request.method)) return json({error:'Method not allowed'},405,cors);
    const auth = request.headers.get('Authorization') || '';
    if (!auth.startsWith('Bearer ')) return json({error:'Missing Firebase ID token'},401,cors);
    const token = auth.slice(7);
    const verified = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
    if (!verified.ok) return json({error:'Unauthorized'},401,cors);

    if (request.method === 'POST' && url.pathname === '/upload') {
      const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
      if (!contentType.startsWith('image/') && contentType !== 'application/pdf') return json({error:'Unsupported file type'},400,cors);
      const original = sanitize(request.headers.get('X-Filename') || 'file');
      const ext = original.includes('.') ? '.' + original.split('.').pop().toLowerCase() : '';
      const key = `media/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}${ext}`;
      await env.MEDIA_BUCKET.put(key, request.body, { httpMetadata: { contentType } });
      return json({ key, url: `${env.PUBLIC_BASE_URL.replace(/\/$/,'')}/${key}` },200,cors);
    }

    if (request.method === 'DELETE' && url.pathname === '/delete') {
      const key = url.searchParams.get('key');
      if (!key || !key.startsWith('media/')) return json({error:'Invalid key'},400,cors);
      await env.MEDIA_BUCKET.delete(key);
      return json({ok:true,key},200,cors);
    }
    return json({error:'Not found'},404,cors);
  }
};

function sanitize(name){return name.replace(/[^a-zA-Z0-9._-]/g,'-').slice(-120)}
function json(data,status,headers){return new Response(JSON.stringify(data),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8'}})}

async function verifyFirebaseToken(token, projectId){
  try{
    const [h,p,s] = token.split('.');
    if (!h || !p || !s) return {ok:false};
    const header = JSON.parse(atobUrl(h));
    const payload = JSON.parse(atobUrl(p));
    if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}` || payload.exp * 1000 < Date.now()) return {ok:false};
    const certs = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com').then(r=>r.json());
    const pem = certs[header.kid];
    if (!pem) return {ok:false};
    const key = await crypto.subtle.importKey('spki',pemToArrayBuffer(pem),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,base64UrlToBytes(s),new TextEncoder().encode(`${h}.${p}`));
    return {ok,payload};
  }catch{return {ok:false}}
}
function atobUrl(v){return atob(v.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(v.length/4)*4,'='))}
function base64UrlToBytes(v){const raw=atobUrl(v),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out}
function pemToArrayBuffer(pem){const b64=pem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s/g,'');const raw=atob(b64);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes.buffer}
