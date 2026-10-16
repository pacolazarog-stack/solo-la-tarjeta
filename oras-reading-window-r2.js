(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261016-root-stable-3';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261016-ana-route-2`;
const CURRENT_PATH=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');

/* La raíz usa exclusivamente la navegación ORAS unificada. */
if(CURRENT_PATH===BASE){
  window.__orasSoloPrevNextR1=true;
  window.__orasSoloAutoIntroInstalled=true;
}

const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta',`${ANA_DOC}#estrella`],
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
style.id='oras-reading-window-stable-r6';
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
   Las piezas hijas de ANA viven dentro de un iframe y no deben crear otra. */
function ensureUnifiedNav(){
  const isAnaChild=['/estrella','/ojos','/sonrisa','/cabello','/piel','/interludio','/epilogo'].some(s=>CURRENT_PATH.endsWith(s));
  if(isAnaChild)return;
  if(window.__orasUnifiedNavR4||document.querySelector('script[data-oras-unified-nav-core]'))return;
  const script=document.createElement('script');
  script.dataset.orasUnifiedNavCore='1';
  script.src=`${BASE}/oras-unified-nav-r1.js?v=20261016-unified-nav-7`;
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

/* IMPORTANTE: este módulo ya no toca cenicientoFrame ni la ruta directa de ANA.
   openPoem()/syncPoemRoute() son la única autoridad sobre el iframe. */
setupTracking();
ensureUnifiedNav();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();
