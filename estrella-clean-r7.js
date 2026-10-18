(()=>{
'use strict';
if(window.__orasStarCleanR9)return;
window.__orasStarCleanR9=true;
document.body?.classList.add('oras-star-clean-r9-compatible');

const params=new URLSearchParams(location.search);
const parentMode=params.get('music')==='parent' && window.parent!==window;
if(!parentMode)return;

/* En modo embebido la única música válida es la del documento padre ANA. */
const local=document.getElementById('orasStarMusic');
if(local){
  try{local.pause();local.currentTime=0;}catch(_){}
  local.muted=true;
}

function transitionToElegia(){
  const p=window.parent;
  try{
    const doc=p.document;
    const root=doc.documentElement;
    const body=doc.body;
    const frame=doc.getElementById('cenicientoFrame');
    const backdrop=doc.getElementById('poemBackdrop');
    const entry=doc.getElementById('entry');
    const entryButton=doc.getElementById('entryButton');
    const entryActions=entryButton?.closest('.entry-actions');
    const title=entry?.querySelector('.entry-title');
    const music=doc.getElementById('voiceMusic');
    const sound=doc.getElementById('soundToggle');
    const journey=doc.getElementById('journeyNav');

    /* Nunca tocar currentTime, src, pause() ni volume del audio padre. */
    if(music){music.muted=false;if(music.paused)music.play().catch(()=>{});}

    root?.classList.remove('poem-route-loading','ceniciento-open','publication-pending','oras-master-entry');
    root?.setAttribute('data-oras-star-transition','1');
    body?.classList.remove('ceniciento-open','sonrisa-open','eyes-open','prelude','voice-open','portrait-revealed','reading-ready');
    body?.classList.add('locked','journey-started','sound-ready');

    if(backdrop){backdrop.hidden=true;backdrop.style.setProperty('display','none','important');}
    if(frame){
      frame.hidden=true;
      frame.style.setProperty('display','none','important');
      frame.style.setProperty('visibility','hidden','important');
      frame.style.setProperty('pointer-events','none','important');
      frame.removeAttribute('aria-busy');
    }

    if(entry){
      entry.hidden=false;
      entry.classList.remove('is-open');
      entry.style.setProperty('display','grid','important');
      entry.style.setProperty('visibility','visible','important');
      entry.style.setProperty('opacity','1','important');
      entry.style.setProperty('pointer-events','none','important');
      entry.style.setProperty('background','#eef1e9','important');
      entry.style.setProperty('z-index','2147482500','important');
    }
    if(title){title.style.setProperty('display','block','important');title.style.setProperty('visibility','visible','important');title.style.setProperty('opacity','1','important');}
    if(entryButton)entryButton.style.setProperty('display','none','important');
    if(entryActions)entryActions.style.setProperty('display','none','important');
    if(sound){sound.style.setProperty('visibility','visible','important');sound.style.setProperty('opacity','.72','important');sound.style.setProperty('pointer-events','auto','important');sound.style.setProperty('z-index','2147483646','important');}
    if(journey){journey.hidden=false;journey.style.setProperty('visibility','visible','important');journey.style.setProperty('opacity','1','important');journey.style.setProperty('z-index','2147483646','important');}

    try{p.history.replaceState(null,'',p.location.pathname+p.location.search);}catch(_){}

    clearTimeout(p.__orasStarDirectTimer);
    p.__orasStarDirectTimer=p.setTimeout(()=>{
      p.__orasStarDirectTimer=null;
      root?.removeAttribute('data-oras-star-transition');
      if(entry){
        entry.classList.add('is-open');
        for(const prop of ['display','visibility','opacity','pointer-events','background','z-index'])entry.style.removeProperty(prop);
      }
      if(title){for(const prop of ['display','visibility','opacity'])title.style.removeProperty(prop);}
      if(entryButton)entryButton.style.removeProperty('display');
      if(entryActions)entryActions.style.removeProperty('display');
      if(frame){for(const prop of ['display','visibility','pointer-events'])frame.style.removeProperty(prop);frame.removeAttribute('src');}
      if(backdrop)backdrop.style.removeProperty('display');
      body?.classList.remove('locked');
      const read=doc.getElementById('anaRead');
      if(read)read.click();
    },5000);
  }catch(_){
    /* Último recurso: sólo si no pudiéramos acceder al padre. */
    window.parent.postMessage({channel:'oras-star-flow-v1',type:'complete'},location.origin);
  }
}

const next=document.getElementById('next');
if(next){
  next.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    transitionToElegia();
  },true);
}

const prev=document.getElementById('prev');
if(prev){
  prev.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    window.parent.location.href='/solo-la-tarjeta/?read=solo';
  },true);
}
})();