(() => {
  const routes=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
  const titleFor=piece=>({
    estrella:'FOLLOWING A CARD',
    ojos:'IN YOUR EYES',
    sonrisa:'ON YOUR LIPS',
    cabello:'YOUR HAIR',
    piel:'YOUR SKIN',
    interludio:'I WAS GOING TO BRING YOU FLOWERS · INTERLUDE',
    epilogo:'OVER A LOW FLAME · EPILOGUE',
    ceniciento:'CENICIENTO · READ OR LISTEN'
  })[piece]||'ANA KLAUDYA';

  const forceRouteVisible=(piece,asPrologue=false)=>{
    if(!routes.has(piece))return;
    const button=document.getElementById('entryButton');
    const frame=document.getElementById('cenicientoFrame');
    if(!frame)return;

    const body=document.body;
    const root=document.documentElement;
    const backdrop=document.getElementById('poemBackdrop');
    const nav=document.getElementById('anaNavigation');
    const entry=document.getElementById('entry');

    if(button)button.disabled=true;
    body.classList.add('journey-started','sound-ready','sonrisa-open','ceniciento-open');
    root.classList.add('ceniciento-open');
    root.classList.remove('poem-route-loading');
    if(entry)entry.classList.add('is-open');
    if(nav)nav.hidden=true;
    if(backdrop)backdrop.hidden=false;

    frame.hidden=false;
    frame.classList.add('sonrisa-transition','sonrisa-visible');
    frame.setAttribute('title',titleFor(piece));

    if(!frame.getAttribute('src')){
      frame.src='../'+piece+'/?music=parent&v=20261009-nmwp-route-fix'+(asPrologue?'&prologue=1':'');
    }

    document.title=titleFor(piece);
  };

  const activateFallback=()=>{
    const button=document.getElementById('entryButton');
    const frame=document.getElementById('cenicientoFrame');
    if(!button||!frame)return;

    if(button.dataset.nmwpFallback!=='1'){
      button.dataset.nmwpFallback='1';
      button.addEventListener('click',()=>{
        setTimeout(()=>forceRouteVisible('estrella',true),40);
      },true);
    }

    const syncFromHash=()=>{
      const piece=location.hash.slice(1);
      if(routes.has(piece))setTimeout(()=>forceRouteVisible(piece,piece==='estrella'),0);
    };
    window.addEventListener('hashchange',syncFromHash);
    window.addEventListener('popstate',syncFromHash);
    frame.addEventListener('load',()=>{
      const piece=location.hash.slice(1);
      if(routes.has(piece))forceRouteVisible(piece,piece==='estrella');
    });
    syncFromHash();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activateFallback,{once:true});
  else activateFallback();
})();
