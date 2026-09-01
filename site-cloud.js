window.LibraryGuidancePublicReady=(async()=>{
  const KEY='libraryGuidanceCMSv2';
  try{
    const cfg=window.LibraryGuidanceCloudConfig?.firebase||{};
    if(!(cfg.apiKey&&cfg.authDomain&&cfg.projectId&&cfg.appId)) return false;
    const [{initializeApp,getApps,getApp},{getFirestore,doc,getDoc}]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js')
    ]);
    const app=getApps().length?getApp():initializeApp(cfg);
    const db=getFirestore(app);
    const snap=await getDoc(doc(db,'cms','site'));
    if(!snap.exists()) return false;
    const state=snap.data()?.state;
    if(!state||typeof state!=='object') return false;
    localStorage.setItem(KEY,JSON.stringify(state));
    return true;
  }catch(error){
    console.warn('Public Firestore load skipped; using local/default content.',error);
    return false;
  }
})();
