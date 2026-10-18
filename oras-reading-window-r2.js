(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261018-r3-progress-1';
const VERSION='20261018-canonical-nav-final-1';
const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta',`${BASE}/estrella/`],
  ['elegia','Elegía breve para Ana Klaudya',`${BASE}/elegia-breve/`],
  ['ojos','En tus ojos',`${BASE}/ojos/`],
  ['labios','En tus labios',`${BASE}/sonrisa/`],
  ['cabello','Tu cabello',`${BASE}/cabello/`],
  ['piel','Tu piel',`${BASE}/piel/`],
  ['interludio','Interludio · Iba a llevarte flores',`${BASE}/interludio/`],
  ['epilogo','Epílogo · A fuego lento · Flores',`${BASE}/epilogo/`]
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
function completeAnaPart(key){
  if(!ANA_PARTS.some(([k])=>k===key))return;
  const state=readState();
  if(state.anaParts[key]===true)return;
  const parts=Object.assign(emptyParts(),state.anaParts,{[key]:true});
  writeState({anaParts:parts,anaComplete:ANA_PARTS.every(([k])=>parts[k]===true)});
  try{window.dispatchEvent(new CustomEvent('oras:progress-changed',{detail:{part:key,anaParts:parts}}));}catch(_){}
}

/* El índice flotante heredado dejó de ser canónico. Si alguna versión anterior
   lo dejó en el DOM, se elimina. La única navegación visible debe ser la barra
   inferior Atrás | Índice ORAS | Adelante. */
document.querySelectorAll('.ou-reading-window-r2').forEach(el=>el.remove());

function openIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  let s=document.querySelector('script[data-oras-master-index-global]');
  if(!s){
    s=document.createElement('script');
    s.dataset.orasMasterIndexGlobal='1';
    s.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;
    s.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
    document.head.appendChild(s);
  }
}

function observeEnd(selector,key,ratio=.55){
  const target=[...document.querySelectorAll(selector)].at(-1);
  if(!target||!('IntersectionObserver'in window))return;
  const io=new IntersectionObserver(entries=>{
    if(entries.some(x=>x.isIntersecting&&x.intersectionRatio>=ratio)){
      io.disconnect();
      completeAnaPart(key);
    }
  },{threshold:[ratio,.8,1]});
  io.observe(target);
}

function setupElegia(){
  const body=document.body;
  const recording=document.getElementById('recording');

  /* No se interceptan COMENZAR, Atrás, Adelante ni el evento ended.
     La propia página de ANA es la autoridad de navegación y de su secuencia
     final. Este runtime sólo registra la lectura completada. */
  recording?.addEventListener('ended',()=>completeAnaPart('elegia'));
  if(recording?.ended)completeAnaPart('elegia');

  if('MutationObserver'in window){
    const markPortrait=()=>{
      if(body.classList.contains('portrait-revealed'))completeAnaPart('elegia');
    };
    new MutationObserver(markPortrait).observe(body,{attributes:true,attributeFilter:['class']});
    markPortrait();
  }
}

function setupTracking(){
  const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
  if(path.endsWith('/estrella'))observeEnd('.phrase','estrella');
  if(path.endsWith('/ojos'))observeEnd('.line','ojos');
  if(path.endsWith('/sonrisa'))observeEnd('.line','labios');
  if(path.endsWith('/cabello'))observeEnd('.line','cabello');
  if(path.endsWith('/piel'))observeEnd('.line','piel');
  if(path.endsWith('/elegia-breve'))setupElegia();
  if(path.endsWith('/epilogo')){
    const flowers=document.getElementById('flowerCoda');
    if(flowers){
      const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};
      new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});
      mark();
    }
  }
  addEventListener('message',e=>{
    if(e.origin===location.origin&&e.data?.channel==='ceniciento-music-v1'&&e.data?.type==='interlude-ended')completeAnaPart('interludio');
  });
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}

setupTracking();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();
