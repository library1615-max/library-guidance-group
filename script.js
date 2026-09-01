(()=>{
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='beautify.css';
  document.head.appendChild(css);

  const loadCore=()=>{
    const core=document.createElement('script');
    core.src='site-core.js';
    core.defer=true;
    core.onload=()=>{
      const extra=document.createElement('script');
      extra.src='gallery-enhance.js';
      document.body.appendChild(extra);
    };
    document.body.appendChild(core);
  };

  const config=document.createElement('script');
  config.src='cloud-config.js';
  config.onload=()=>{
    const cloud=document.createElement('script');
    cloud.type='module';
    cloud.src='site-cloud.js';
    cloud.onload=()=>{
      const ready=window.LibraryGuidancePublicReady||Promise.resolve(false);
      Promise.race([
        ready,
        new Promise(resolve=>setTimeout(()=>resolve(false),3500))
      ]).finally(loadCore);
    };
    cloud.onerror=loadCore;
    document.body.appendChild(cloud);
  };
  config.onerror=loadCore;
  document.body.appendChild(config);
})();
