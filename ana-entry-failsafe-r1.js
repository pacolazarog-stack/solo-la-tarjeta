(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR9)return;
window.__orasAnaEntryFailsafeR9=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const STAR_MUSIC_STATE='oras.ana.star.music.v1';
const MASTER_VOLUME='oras.master.volume.v1';
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();

const style=document.createElement('style');
style.id='oras-ana-direct-route-r9';
style.textContent=`
html[data-oras-ana-route="estrella"] #cenicientoFrame,
html[data-oras-ana-route="estrella"] #cenicientoFrame[hidden]{
 display:block!important;
 opacity:1!important;
 visibility:visible!important;
 pointer-events:auto!important;
 z-index:2147482000!important;
 background:#090e19!important;
}
html[data-oras-ana-route="estrella"] #poemBackdrop{display:block!important;}
html[data-oras-ana-resumed="1"] #reading{display:block!important;visibility:visible!important;opacity:1!important;}
html[data-oras-ana-resumed="1"] body{overflow:auto!important;touch-action:auto!important;}
html[data-oras-ana-resumed="1"] .entry{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}
html[data-oras-ana-resumed="1"] #poemBackdrop,html[data-oras-ana-resumed="1"] #cenicientoFrame{display:none!important;visibility:hidden!important;pointer-events:none!important;}
html[data-oras-ana-fallback="1"] #reading .line{opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;}
/* Tras el prólogo no hay botón de comienzo: la cartela permanece cinco segundos. */
html[data-oras-ana-after-star="1"] #entryButton{display:none!important;}
html[data-oras-ana-after-star="1"] .entry-inner{gap:0!important;}
/* La navegación general debe permanecer disponible incluso durante la cartela. */
html[data-oras-ana-after-star="1"] #orasUnifiedNav{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;}
`;
document.head.appendChild(style);

function unlockChild(frame,piece){
  try{
    const doc=frame.contentDocument;
    if(!doc?.documentElement||!doc.body)return;
    doc.documentElement.classList.remove('publication-pending');
    doc.body.style.setProperty('visibility','visible','important');
    doc.body.style.setProperty('opacity','1','important');
    if(piece==='estrella'){
      const main=doc.querySelector('main');
      if(main){main.style.setProperty('visibility','visible','important');main.style.setProperty('opacity','1','important');}
      const intro=doc.querySelector('.intro');
      if(intro){intro.style.setProperty('visibility','visible','important');intro.style.setProperty('opacity','1','important');}
    }
  }catch(_){}
}

function releaseDirectRoute(){
  if(!isAnaRoot())return;
  const root=document.documentElement;
  const body=document.body;
  const frame=document.getElementById('cenicientoFrame');
  const backdrop=document.getElementById('poemBackdrop');
  root.removeAttribute('data-oras-ana-route');
  root.classList.remove('poem-route-loading','ceniciento-open');
  if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
  if(frame){
    frame.hidden=true;
    frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');
    frame.removeAttribute('aria-busy');
    for(const prop of ['display','opacity','visibility','pointer-events','z-index','background'])frame.style.removeProperty(prop);
    const src=frame.getAttribute('src')||'';
    if(src.includes('/estrella/'))frame.removeAttribute('src');
  }
  if(body){
    body.classList.remove('ceniciento-open','sonrisa-open','eyes-open');
    if(body.classList.contains('reading-ready'))body.classList.remove('locked');
  }
}

function applyDirectRoute(){
  if(!isAnaRoot())return;
  const piece=route();
  const root=document.documentElement;
  if(!POEM_ROUTES.has(piece)){
    releaseDirectRoute();
    return;
  }
  root.setAttribute('data-oras-ana-route',piece);
  root.classList.remove('publication-pending','poem-route-loading','oras-master-entry');
  root.classList.add('ceniciento-open');

  const body=document.body;
  const frame=document.getElementById('cenicientoFrame');
  const backdrop=document.getElementById('poemBackdrop');
  if(!body||!frame)return;

  body.classList.add('journey-started','ceniciento-open','sonrisa-open');
  body.classList.toggle('eyes-open',piece==='ojos');
  body.classList.remove('locked');
  if(backdrop)backdrop.hidden=false;

  frame.hidden=false;
  frame.classList.add('sonrisa-transition','sonrisa-visible');
  frame.classList.remove('sonrisa-leaving');
  frame.removeAttribute('aria-busy');

  const expected=`../${piece}/?music=parent&v=20261018-ana-direct-route-r9`;
  const current=frame.getAttribute('src')||'';
  if(!current.includes(`/${piece}/`))frame.src=expected;

  unlockChild(frame,piece);
  frame.addEventListener('load',()=>unlockChild(frame,piece),{once:true});
}

function readStarState(){
  try{return JSON.parse(sessionStorage.getItem(STAR_MUSIC_STATE)||'null');}catch(_){return null;}
}
function masterLevel(saved){
  try{
    const raw=Number(localStorage.getItem(MASTER_VOLUME));
    if(Number.isFinite(raw)&&raw>=0)return Math.max(0,Math.min(1,raw/100));
  }catch(_){}
  if(saved&&Number.isFinite(saved.volume))return Math.max(0,Math.min(1,saved.volume));
  return .8;
}
function restoreAnaMusic(saved){
  const music=document.getElementById('voiceMusic');
  if(!music)return;
  const level=masterLevel(saved);
  try{
    if(saved&&Number.isFinite(saved.time))music.currentTime=Math.max(0,saved.time);
    music.volume=level;
    music.muted=level<=0;
    const enabled=document.getElementById('musicEnabled');
    if(enabled)enabled.checked=level>0;
    const slider=document.getElementById('musicLevel');
    if(slider){
      const max=Number(slider.max||100);
      slider.value=String(Math.round(Math.min(max,level*100)));
      slider.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(saved?.playing!==false&&level>0)music.play().catch(()=>{});
  }catch(_){}
}

function ensureUnifiedNavVisible(){
  const reveal=()=>{
    const nav=document.getElementById('orasUnifiedNav');
    if(nav){nav.hidden=false;nav.style.removeProperty('display');nav.style.removeProperty('visibility');nav.style.removeProperty('opacity');}
  };
  reveal();
  setTimeout(reveal,120);
  setTimeout(reveal,700);
  setTimeout(reveal,1800);
}

function forceAnaReading(saved=null,fallback=false){
  if(!isAnaRoot()||route())return false;
  const root=document.documentElement,body=document.body;
  if(!body)return false;
  root.removeAttribute('data-oras-ana-route');
  root.removeAttribute('data-oras-ana-after-star');
  root.classList.remove('publication-pending','poem-route-loading','ceniciento-open','oras-master-entry');
  root.setAttribute('data-oras-ana-resumed','1');
  if(fallback)root.setAttribute('data-oras-ana-fallback','1');
  body.classList.remove('locked','prelude','ceniciento-open','sonrisa-open','eyes-open','voice-open','portrait-revealed');
  body.classList.add('journey-started','sound-ready','reading-ready');
  const entry=document.getElementById('entry');
  if(entry)entry.classList.add('is-open');
  const backdrop=document.getElementById('poemBackdrop');
  if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
  const frame=document.getElementById('cenicientoFrame');
  if(frame){frame.hidden=true;frame.removeAttribute('src');frame.removeAttribute('aria-busy');frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');for(const prop of ['display','opacity','visibility','pointer-events','z-index','background'])frame.style.removeProperty(prop);}
  const reading=document.getElementById('reading');
  if(reading){reading.hidden=false;reading.style.removeProperty('display');reading.style.removeProperty('visibility');reading.style.removeProperty('opacity');}
  const finale=document.getElementById('portraitFinale');
  if(finale)finale.setAttribute('aria-hidden','true');
  restoreAnaMusic(saved);
  ensureUnifiedNavVisible();
  requestAnimationFrame(()=>{window.scrollTo({top:0,left:0,behavior:'auto'});restoreAnaMusic(saved);});
  return true;
}

function resumeFromStar(){
  if(!isAnaRoot()||route())return false;
  const saved=readStarState();
  const qs=new URLSearchParams(location.search);
  const requested=qs.get('afterPrologue')==='1'||qs.get('afterStar')==='1'||qs.get('from')==='star';
  /* El estado de música guardado al salir de Siguiendo una tarjeta basta para reconocer la transición. */
  if(!saved&&!requested)return false;

  const root=document.documentElement;
  root.setAttribute('data-oras-ana-after-star','1');
  root.classList.remove('publication-pending','poem-route-loading','oras-master-entry');
  const body=document.body;
  body?.classList.add('locked','journey-started','sound-ready');
  body?.classList.remove('reading-ready','prelude','ceniciento-open','sonrisa-open','eyes-open','voice-open','portrait-revealed');

  const entry=document.getElementById('entry');
  entry?.classList.remove('is-open');
  const entryButton=document.getElementById('entryButton');
  if(entryButton)entryButton.hidden=true;

  const backdrop=document.getElementById('poemBackdrop');
  if(backdrop)backdrop.hidden=true;
  const frame=document.getElementById('cenicientoFrame');
  if(frame){frame.hidden=true;frame.removeAttribute('src');}

  /* La música heredada se restaura ya durante la cartela, no cinco segundos después. */
  restoreAnaMusic(saved);
  ensureUnifiedNavVisible();

  if(requested){
    qs.delete('afterPrologue');qs.delete('afterStar');qs.delete('from');
    const q=qs.toString();
    try{history.replaceState(null,'',location.pathname+(q?'?'+q:''));}catch(_){}
  }

  if(window.__orasAnaAfterStarTimer)clearTimeout(window.__orasAnaAfterStarTimer);
  window.__orasAnaAfterStarTimer=setTimeout(()=>{
    window.__orasAnaAfterStarTimer=null;
    forceAnaReading(saved,false);
    try{sessionStorage.removeItem(STAR_MUSIC_STATE);}catch(_){}
  },5000);
  return true;
}

function installStartFallback(){
  if(!isAnaRoot())return;
  const button=document.getElementById('entryButton');
  if(!button||button.dataset.orasFallback==='1')return;
  button.dataset.orasFallback='1';
  button.addEventListener('click',()=>{
    setTimeout(()=>{
      const entry=document.getElementById('entry');
      const body=document.body;
      const failed=(!!entry&&!entry.classList.contains('is-open'))||!!body?.classList.contains('locked');
      if(failed)forceAnaReading(null,true);
      restoreAnaMusic(null);
    },900);
  },true);
}

function schedule(){
  if(resumeFromStar())return;
  applyDirectRoute();
  installStartFallback();
  setTimeout(()=>{if(!resumeFromStar()){applyDirectRoute();installStartFallback();}},120);
  setTimeout(()=>{if(!resumeFromStar()){applyDirectRoute();installStartFallback();}},700);
  setTimeout(()=>{if(!resumeFromStar()){applyDirectRoute();installStartFallback();}},1800);
}

addEventListener('DOMContentLoaded',schedule,{once:true});
addEventListener('pageshow',()=>{if(!resumeFromStar())applyDirectRoute();installStartFallback();});
addEventListener('hashchange',applyDirectRoute);
addEventListener('popstate',()=>{if(!resumeFromStar())applyDirectRoute();});
if(document.readyState!=='loading')schedule();
})();
