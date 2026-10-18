(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261018-ana-end-stability-4';
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
function readState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};saved.anaParts=Object.assign(emptyParts(),saved.anaParts&&typeof saved.anaParts==='object'?saved.anaParts:{});return saved;}catch(_){return {anaParts:emptyParts()};}}
function writeState(patch){try{const next=Object.assign({},readState(),patch);localStorage.setItem(STORAGE,JSON.stringify(next));return next;}catch(_){return readState();}}
function completeAnaPart(key){if(!ANA_PARTS.some(([k])=>k===key))return;const state=readState();if(state.anaParts[key]===true)return;const parts=Object.assign(emptyParts(),state.anaParts,{[key]:true});writeState({anaParts:parts,anaComplete:ANA_PARTS.every(([k])=>parts[k]===true)});}

const style=document.createElement('style');
style.id='oras-reading-window-stable-r6';
style.textContent=`
.ou-reading-checklist{display:none!important}
.ou-reading-window-r2{position:fixed;z-index:2147483000;left:max(62px,calc(env(safe-area-inset-left) + 62px));bottom:max(12px,env(safe-area-inset-bottom));font-family:Georgia,"Times New Roman",serif;color:#f7f1e8}
.ou-reading-window-r2>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:7px;min-height:31px;padding:6px 11px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(13,13,13,.72);color:#f7f1e8;box-shadow:0 5px 18px rgba(0,0,0,.14);font:500 12px/1.2 Georgia,"Times New Roman",serif}
.ou-reading-window-r2>summary::-webkit-details-marker{display:none}.ou-reading-window-r2>summary::before{content:"";width:5px;height:5px;border-radius:50%;background:#e9cf91}.ou-reading-window-r2 .ou-rw-panel{display:none!important}body.mirror .ou-reading-window-r2{display:none!important}
body.oras-safe-ending .layer-warm{animation:none!important;filter:none!important;will-change:opacity!important}
body.oras-safe-ending .pulse-field{animation:orasSafePulse 1.85s ease-in-out infinite!important;filter:none!important;will-change:opacity!important}
@keyframes orasSafePulse{0%,100%{opacity:.44}50%{opacity:.82}}
@media(max-width:700px){.ou-reading-window-r2{left:max(57px,calc(env(safe-area-inset-left) + 57px));bottom:max(10px,env(safe-area-inset-bottom))}.ou-reading-window-r2>summary{font-size:11px;min-height:29px;padding:5px 9px}}
`;
document.head.appendChild(style);

let box=document.querySelector('.ou-reading-window-r2');
if(!box){box=document.createElement('details');box.className='ou-reading-window-r2';box.innerHTML='<summary>Índice ORAS</summary><div class="ou-rw-panel" aria-hidden="true"></div>';document.body.appendChild(box);}
box.setAttribute('aria-label','Índice canónico de ORAS');
function openIndex(){if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}let s=document.querySelector('script[data-oras-master-index-global]');if(!s){s=document.createElement('script');s.dataset.orasMasterIndexGlobal='1';s.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;s.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});document.head.appendChild(s);}}
box.querySelector('summary').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openIndex();});

function observeEnd(selector,key,ratio=.55){const target=[...document.querySelectorAll(selector)].at(-1);if(!target||!('IntersectionObserver'in window))return;const io=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting&&x.intersectionRatio>=ratio)){io.disconnect();completeAnaPart(key);}},{threshold:[ratio,.8,1]});io.observe(target);}

function setupElegia(){
  const body=document.body;
  const recording=document.getElementById('recording');
  const prev=document.getElementById('journeyPrevious');
  const next=document.getElementById('journeyNext');
  const entryButton=document.getElementById('entryButton');
  const anaRead=document.getElementById('anaRead');

  /* COMENZAR entra en la Elegía; el prólogo queda accesible aparte. */
  entryButton?.addEventListener('click',e=>{
    if(location.hash)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    try{window.dispatchEvent(new CustomEvent('oras:reading-start'));}catch(_){}
    if(anaRead){anaRead.click();return;}
  },true);

  const setElegiaJourney=()=>{try{window.ORASSetJourney?.('elegia');}catch(_){}};
  setElegiaJourney();setTimeout(setElegiaJourney,0);setTimeout(setElegiaJourney,700);

  const forcePiece=id=>{const b=document.getElementById(id);if(b){b.click();return true;}return false;};
  prev?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();forcePiece('anaEstrella');},{capture:true});
  next?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();forcePiece('anaOjos');},{capture:true});

  /* Final seguro: interceptamos EN CAPTURA el evento ended antes del manejador
     pesado de la página. La transición conserva el pulso expansivo, vira de
     verde a cálido y muestra la fotografía sin filtros de pantalla completa. */
  const safeEnd=()=>{
    if(body.classList.contains('oras-safe-ending'))return;
    body.classList.add('oras-safe-ending');
    const root=document.documentElement;
    const heat=document.getElementById('finalHeat');
    const warm=document.querySelector('.layer-warm');
    const portrait=document.getElementById('portraitFinale');
    const img=document.getElementById('anaPortrait');
    const nav=document.getElementById('anaNavigation');
    heat?.classList.add('is-shown','show-calor','is-burning');
    if(warm){
      warm.style.animation='none';
      warm.style.filter='none';
      warm.style.opacity='0.06';
      warm.style.transition='opacity 7.5s cubic-bezier(.18,.72,.2,1)';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{warm.style.opacity='0.92';}));
    }
    setTimeout(()=>{
      if(!portrait)return;
      portrait.style.transition='opacity 5s ease,visibility 0s linear';
      if(img){img.style.transition='opacity 7s ease';img.style.opacity='1';}
      portrait.setAttribute('aria-hidden','false');
      body.classList.add('portrait-revealed');
      if(nav)nav.hidden=true;
      root.style.setProperty('--question-current','.55');
      root.style.setProperty('--question-first','.64');
      root.style.setProperty('--question-next','.72');
    },8200);
  };
  recording?.addEventListener('ended',e=>{
    e.stopImmediatePropagation();
    safeEnd();
    completeAnaPart('elegia');
  },true);
  if(recording?.ended){safeEnd();completeAnaPart('elegia');}

  if('MutationObserver'in window){
    const markPortrait=()=>{if(body.classList.contains('portrait-revealed'))completeAnaPart('elegia');};
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
  if(path.endsWith('/epilogo')){const flowers=document.getElementById('flowerCoda');if(flowers){const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});mark();}}
  addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.channel==='ceniciento-music-v1'&&e.data?.type==='interlude-ended')completeAnaPart('interludio');});
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}
setupTracking();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();