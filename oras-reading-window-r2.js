(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261016-root-stable-4';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261016-ana-route-3`;
const CURRENT_PATH=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
const params=new URLSearchParams(location.search);
const STAR_STANDALONE=`${BASE}/estrella/?music=parent&standalone=1&from=ana`;

/*
 * El prólogo deja de depender del iframe heredado. Cualquier entrada real a
 * #estrella se convierte en una escena autónoma de primer nivel. Así se rompe
 * el bucle elegia-breve -> iframe -> estrella -> elegia-breve que dejaba la
 * pantalla crema sin contenido en Edge.
 */
function leaveForStandaloneStar(){
  if(window.parent!==window)return false;
  if(!CURRENT_PATH.endsWith('/elegia-breve'))return false;
  if(location.hash.toLowerCase()!=='#estrella')return false;
  location.replace(STAR_STANDALONE);
  return true;
}
if(leaveForStandaloneStar())return;
addEventListener('hashchange',leaveForStandaloneStar);

/* Al volver del prólogo autónomo, entrar directamente en la lectura de ANA.
   Usamos el botón nativo ya enlazado al closure de ANA para conservar su
   estado interno de lectura, voz y scroll. */
function resumeAnaAfterPrologue(){
  if(!CURRENT_PATH.endsWith('/elegia-breve')||params.get('afterPrologue')!=='1')return;
  const clean=new URL(location.href);
  clean.searchParams.delete('afterPrologue');
  try{history.replaceState(null,'',clean.pathname+clean.search+clean.hash);}catch(_){ }
  const resume=()=>{
    const read=document.getElementById('anaRead');
    if(read){read.click();return true;}
    return false;
  };
  if(!resume())addEventListener('DOMContentLoaded',()=>setTimeout(resume,0),{once:true});
}

/* En la escena autónoma, la continuidad aparece sólo cuando la última frase
   ha sido revelada. */
function installStandaloneStarContinuation(){
  if(window.parent!==window||!CURRENT_PATH.endsWith('/estrella')||params.get('standalone')!=='1')return;
  const install=()=>{
    if(document.getElementById('orasStarContinue'))return;
    const style=document.createElement('style');
    style.id='oras-star-standalone-style';
    style.textContent=`
#orasStarContinue{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;display:none;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border:1px solid rgba(234,213,165,.52);border-radius:999px;background:rgba(9,14,25,.82);color:#f8eee4;text-decoration:none;font:600 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.28)}
#orasStarContinue.is-ready{display:inline-flex}
#orasStarContinue:focus-visible{outline:2px solid #ead5a5;outline-offset:3px}
`;
    document.head.appendChild(style);
    const a=document.createElement('a');
    a.id='orasStarContinue';
    a.href=`${ANA_DOC}&afterPrologue=1`;
    a.textContent='Continuar · Ana Klaudya →';
    a.setAttribute('aria-label','Continuar a Ana Klaudya');
    document.body.appendChild(a);
    const final=[...document.querySelectorAll('.phrase')].at(-1);
    if(!final){a.classList.add('is-ready');return;}
    const reveal=()=>{
      if(!final.classList.contains('hidden-phrase')&&final.getAttribute('aria-hidden')!=='true'){
        a.classList.add('is-ready');
        completeAnaPart('estrella');
        return true;
      }
      return false;
    };
    if(reveal())return;
    new MutationObserver((_,obs)=>{if(reveal())obs.disconnect();}).observe(final,{attributes:true,attributeFilter:['class','aria-hidden']});
  };
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',install,{once:true});
  else install();
}

/* La raíz usa exclusivamente la navegación ORAS unificada. */
if(CURRENT_PATH===BASE){
  window.__orasSoloPrevNextR1=true;
  window.__orasSoloAutoIntroInstalled=true;
}

const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta',STAR_STANDALONE],
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

/* El índice antiguo deja de ser una segunda botonera. */
const style=document.createElement('style');
style.id='oras-reading-window-stable-r7';
style.textContent=`
.ou-reading-checklist,.ou-reading-window-r2{display:none!important}
body.mirror .ou-reading-window-r2{display:none!important}
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

/* La botonera global sólo se instala en documentos principales de ORAS.
   Las piezas hijas de ANA no deben crear otra. */
function ensureUnifiedNav(){
  const isAnaChild=['/estrella','/ojos','/sonrisa','/cabello','/piel','/interludio','/epilogo'].some(s=>CURRENT_PATH.endsWith(s));
  if(isAnaChild)return;
  if(window.__orasUnifiedNavR4||document.querySelector('script[data-oras-unified-nav-core]'))return;
  const script=document.createElement('script');
  script.dataset.orasUnifiedNavCore='1';
  script.src=`${BASE}/oras-unified-nav-r1.js?v=20261016-unified-nav-8`;
  script.defer=true;
  document.body.appendChild(script);
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
  });
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}

resumeAnaAfterPrologue();
installStandaloneStarContinuation();
setupTracking();
ensureUnifiedNav();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();
