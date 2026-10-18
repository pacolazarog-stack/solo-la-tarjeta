(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261018-star-parent-continuity-2';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261018-ana-parent-continuity-2`;
const CURRENT_PATH=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
const params=new URLSearchParams(location.search);
const STAR_PARENT=`${ANA_DOC}#estrella`;
const STAR_MUSIC_STATE='oras.ana.star.music.v1';

/* Siguiendo una tarjeta permanece dentro del documento padre de ANA. */

function resumeAnaAfterPrologue(){
  if(!CURRENT_PATH.endsWith('/elegia-breve')||params.get('afterPrologue')!=='1')return;
  const clean=new URL(location.href);
  clean.searchParams.delete('afterPrologue');
  try{history.replaceState(null,'',clean.pathname+clean.search+clean.hash);}catch(_){ }

  const forceCleanAna=()=>{
    const root=document.documentElement;
    const body=document.body;
    root?.classList.remove('poem-route-loading','ceniciento-open');
    body?.classList.remove('ceniciento-open','sonrisa-open','eyes-open','locked','prelude','voice-open','portrait-revealed');
    body?.classList.add('journey-started','sound-ready','reading-ready');
    const backdrop=document.getElementById('poemBackdrop');
    if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
    const frame=document.getElementById('cenicientoFrame');
    if(frame){
      frame.hidden=true;
      frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');
      frame.removeAttribute('aria-busy');
      frame.removeAttribute('src');
      for(const prop of ['display','opacity','visibility','pointer-events','z-index','background'])frame.style.removeProperty(prop);
    }
    const entry=document.getElementById('entry');
    entry?.classList.add('is-open');
    const reading=document.getElementById('reading');
    if(reading){reading.style.removeProperty('visibility');reading.style.removeProperty('opacity');reading.style.removeProperty('display');}
    const finale=document.getElementById('portraitFinale');
    finale?.setAttribute('aria-hidden','true');
  };

  const restoreMusic=()=>{
    const music=document.getElementById('voiceMusic');
    if(!music)return;
    try{
      const saved=JSON.parse(sessionStorage.getItem(STAR_MUSIC_STATE)||'null');
      if(saved&&Number.isFinite(saved.time))music.currentTime=Math.max(0,saved.time);
      if(saved&&Number.isFinite(saved.volume))music.volume=Math.max(0,Math.min(1,saved.volume));
      if(saved?.playing){music.muted=false;music.play().catch(()=>{});}
      sessionStorage.removeItem(STAR_MUSIC_STATE);
    }catch(_){ }
  };

  const resume=()=>{
    const read=document.getElementById('anaRead');
    if(!read)return false;
    forceCleanAna();
    read.click();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      forceCleanAna();
      window.scrollTo({top:Math.max(0,window.innerHeight*.25),left:0,behavior:'auto'});
      restoreMusic();
    }));
    setTimeout(()=>{forceCleanAna();restoreMusic();},240);
    return true;
  };
  if(!resume())addEventListener('DOMContentLoaded',()=>setTimeout(resume,0),{once:true});
}

if(CURRENT_PATH===BASE){
  window.__orasSoloPrevNextR1=true;
  window.__orasSoloAutoIntroInstalled=true;
}

const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta',STAR_PARENT],
  ['elegia','Elegía breve para Ana Klaudya',ANA_DOC],
  ['ojos','En tus ojos',`${ANA_DOC}#ojos`],
  ['labios','En tus labios',`${ANA_DOC}#sonrisa`],
  ['cabello','Tu cabello',`${ANA_DOC}#cabello`],
  ['piel','Tu piel',`${ANA_DOC}#piel`],
  ['interludio','Interludio · Iba a llevarte flores',`${ANA_DOC}#interludio`],
  ['epilogo','Epílogo · A fuego lento · Flores',`${ANA_DOC}#epilogo`]
]);

const emptyParts=()=>Object.fromEntries(ANA_PARTS.map(([k])=>[k,false]));
function readState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
    saved.anaParts=Object.assign(emptyParts(),saved.anaParts&&typeof saved.anaParts==='object'?saved.anaParts:{});
    return saved;
  }catch(_){return {anaParts:emptyParts()};}
}
function writeState(patch){
  try{
    const next=Object.assign({},readState(),patch);
    localStorage.setItem(STORAGE,JSON.stringify(next));
    return next;
  }catch(_){return readState();}
}
const anaCount=parts=>ANA_PARTS.filter(([k])=>parts?.[k]===true).length;
const anaComplete=parts=>anaCount(parts)===ANA_PARTS.length;
function completeAnaPart(key){
  if(!ANA_PARTS.some(([k])=>k===key))return;
  const state=readState();
  if(state.anaParts[key]===true)return;
  const parts=Object.assign(emptyParts(),state.anaParts,{[key]:true});
  writeState({anaParts:parts,anaComplete:anaComplete(parts)});
}

const style=document.createElement('style');
style.id='oras-reading-window-stable-r10';
style.textContent=`
.ou-reading-checklist,.ou-reading-window-r2{display:none!important}
body.mirror .ou-reading-window-r2{display:none!important}
html[data-oras-star-transition="1"] #entryButton{display:none!important}
html[data-oras-star-transition="1"] #orasUnifiedNav{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
`;
document.head.appendChild(style);
document.querySelector('.ou-reading-window-r2')?.remove();

function openIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  let script=document.querySelector('script[data-oras-master-index-global]');
  if(!script){
    script=document.createElement('script');
    script.dataset.orasMasterIndexGlobal='1';
    script.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;
    script.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
    document.head.appendChild(script);
  }
}

function ensureUnifiedNav(){
  const isAnaChild=['/estrella','/ojos','/sonrisa','/cabello','/piel','/interludio','/epilogo'].some(s=>CURRENT_PATH.endsWith(s));
  if(isAnaChild)return;
  if(window.__orasUnifiedNavR4||document.querySelector('script[data-oras-unified-nav-core]'))return;
  const script=document.createElement('script');
  script.dataset.orasUnifiedNavCore='1';
  script.src=`${BASE}/oras-unified-nav-r1.js?v=20261018-unified-nav-parent-star-2`;
  script.defer=true;
  document.body.appendChild(script);
}

function revealUnifiedNav(){
  ensureUnifiedNav();
  const reveal=()=>{
    const nav=document.getElementById('orasUnifiedNav');
    if(nav){nav.hidden=false;nav.style.removeProperty('display');nav.style.removeProperty('visibility');nav.style.removeProperty('opacity');}
  };
  reveal();setTimeout(reveal,80);setTimeout(reveal,300);setTimeout(reveal,900);
}

function beginStarToElegiaTransition(){
  if(!CURRENT_PATH.endsWith('/elegia-breve'))return;
  const root=document.documentElement,body=document.body;
  const frame=document.getElementById('cenicientoFrame');
  const backdrop=document.getElementById('poemBackdrop');
  const entry=document.getElementById('entry');
  const music=document.getElementById('voiceMusic');

  root.removeAttribute('data-oras-ana-route');
  root.classList.remove('poem-route-loading','ceniciento-open','publication-pending','oras-master-entry');
  root.setAttribute('data-oras-star-transition','1');
  body?.classList.remove('ceniciento-open','sonrisa-open','eyes-open','prelude','voice-open','portrait-revealed','reading-ready');
  body?.classList.add('locked','journey-started','sound-ready');

  if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
  if(frame){
    frame.hidden=true;frame.removeAttribute('aria-busy');frame.removeAttribute('src');
    frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');
    for(const prop of ['display','opacity','visibility','pointer-events','z-index','background'])frame.style.removeProperty(prop);
  }
  try{history.replaceState(null,'',location.pathname+location.search);}catch(_){ }

  /* El mismo elemento de audio del padre continúa sonando: no se pausa, no se recrea, no se busca. */
  if(music){music.muted=false;if(music.paused)music.play().catch(()=>{});}

  if(entry)entry.classList.remove('is-open');
  revealUnifiedNav();
  completeAnaPart('estrella');

  clearTimeout(window.__orasStarToElegiaTimer);
  window.__orasStarToElegiaTimer=setTimeout(()=>{
    window.__orasStarToElegiaTimer=null;
    root.removeAttribute('data-oras-star-transition');
    if(entry)entry.classList.add('is-open');
    body?.classList.remove('locked');
    const read=document.getElementById('anaRead');
    if(read)read.click();
    revealUnifiedNav();
  },5000);
}

function observeEnd(selector,key,ratio=.55){
  const target=[...document.querySelectorAll(selector)].at(-1);
  if(!target||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>{
    if(entries.some(x=>x.isIntersecting&&x.intersectionRatio>=ratio)){
      io.disconnect();completeAnaPart(key);
    }
  },{threshold:[ratio,.8,1]});
  io.observe(target);
}
function setupTracking(){
  const path=CURRENT_PATH;
  if(path.endsWith('/estrella'))observeEnd('.phrase','estrella');
  if(path.endsWith('/ojos'))observeEnd('.line','ojos');
  if(path.endsWith('/sonrisa'))observeEnd('.line','labios');
  if(path.endsWith('/cabello'))observeEnd('.line','cabello');
  if(path.endsWith('/piel'))observeEnd('.line','piel');
  if(path.endsWith('/epilogo')){
    const flowers=document.getElementById('flowerCoda');
    if(flowers){
      const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};
      new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});
      mark();
    }
  }
  if(path.endsWith('/elegia-breve')){
    const markElegia=()=>{
      const b=document.body;if(!b)return;
      if(b.classList.contains('portrait-revealed'))completeAnaPart('elegia');
    };
    new MutationObserver(markElegia).observe(document.body,{attributes:true,attributeFilter:['class']});
    markElegia();
  }
  addEventListener('message',e=>{
    if(e.origin!==location.origin)return;
    if(e.data?.channel==='ceniciento-music-v1'&&e.data?.type==='interlude-ended')completeAnaPart('interludio');
    if(e.data?.channel==='oras-star-flow-v1'&&e.data?.type==='complete')beginStarToElegiaTransition();
  });
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}

resumeAnaAfterPrologue();
setupTracking();
ensureUnifiedNav();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();