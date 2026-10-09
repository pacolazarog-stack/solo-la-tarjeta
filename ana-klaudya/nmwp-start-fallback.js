(() => {
  const pieces=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);

  const forceRoute=piece=>{
    if(!pieces.has(piece))return;
    const frame=document.getElementById('cenicientoFrame');
    const body=document.body;
    const root=document.documentElement;
    const backdrop=document.getElementById('poemBackdrop');
    const nav=document.getElementById('anaNavigation');
    const entry=document.getElementById('entry');
    const button=document.getElementById('entryButton');
    if(!frame||!body||!root)return;

    if(button)button.disabled=true;
    body.classList.add('journey-started','sound-ready','sonrisa-open','ceniciento-open');
    root.classList.add('ceniciento-open');
    if(entry)entry.classList.add('is-open');
    if(nav)nav.hidden=true;
    if(backdrop)backdrop.hidden=false;

    frame.hidden=false;
    frame.classList.add('sonrisa-transition');
    frame.addEventListener('load',()=>frame.classList.add('sonrisa-visible'),{once:true});

    if(!frame.getAttribute('src')){
      const suffix=piece==='estrella'?'&prologue=1':'';
      frame.src='../'+piece+'/?music=parent&v=20261009-nmwp-route-fix'+suffix;
    }
  };

  const activateFallback=()=>{
    const button=document.getElementById('entryButton');
    if(!button)return;

    if(button.dataset.nmwpFallback!=='1'){
      button.dataset.nmwpFallback='1';
      button.addEventListener('click',()=>{
        const entry=document.getElementById('entry');
        if(entry)entry.classList.add('is-open');
        setTimeout(()=>{
          forceRoute('estrella');
          if(location.hash!=='#estrella')history.pushState({piece:'estrella'},'','#estrella');
        },60);
      },true);
    }

    const routed=location.hash.slice(1);
    if(pieces.has(routed))setTimeout(()=>forceRoute(routed),0);
    window.addEventListener('hashchange',()=>{
      const piece=location.hash.slice(1);
      if(pieces.has(piece))setTimeout(()=>forceRoute(piece),0);
    });
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activateFallback,{once:true});
  else activateFallback();
})();
