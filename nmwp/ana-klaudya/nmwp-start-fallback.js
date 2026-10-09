(() => {
  const activateFallback=()=>{
    const button=document.getElementById('entryButton');
    if(!button||button.dataset.nmwpFallback==='1')return;
    button.dataset.nmwpFallback='1';
    button.addEventListener('click',()=>{
      setTimeout(()=>{
        const frame=document.getElementById('cenicientoFrame');
        if(!frame)return;
        const alreadyStarted=!frame.hidden && !!frame.getAttribute('src');
        if(alreadyStarted)return;

        const body=document.body;
        const root=document.documentElement;
        const backdrop=document.getElementById('poemBackdrop');
        const nav=document.getElementById('anaNavigation');
        const entry=document.getElementById('entry');

        button.disabled=true;
        body.classList.add('journey-started','sound-ready','sonrisa-open','ceniciento-open');
        root.classList.add('ceniciento-open');
        if(entry)entry.classList.add('is-open');
        if(nav)nav.hidden=true;
        if(backdrop)backdrop.hidden=false;
        frame.hidden=false;
        frame.classList.add('sonrisa-transition');
        frame.setAttribute('title','Prologue · Following a Card');
        frame.src='../estrella/?music=parent&v=20261009-nmwp-start-fallback&prologue=1';
        if(location.hash!=='#estrella')history.pushState({piece:'estrella'},'','#estrella');
      },80);
    },true);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activateFallback,{once:true});
  else activateFallback();
})();
