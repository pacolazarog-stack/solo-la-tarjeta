(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261018-ana-end-stable-r6';
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
body.oras-ana-end-running .pulse-field{animation:orasEndPulse 1.85s ease-in-out infinite!important;animation-play-state:running!important;opacity:1!important;filter:none!important;transform-origin:50% 54%!important}
body.oras-ana-end-running .pulse-field::before{animation:orasEndWaveA 1.85s ease-out infinite!important;animation-play-state:running!important}
body.oras-ana-end-running .pulse-field::after{animation:orasEndWaveB 1.85s ease-out .28s infinite!important;animation-play-state:running!important}
body.oras-ana-end-running .layer-warm{animation:warmBreath 1.85s linear infinite!important;animation-play-state:running!important}
@keyframes orasEndPulse{0%,100%{opacity:.45;transform:scale(1)}45%{opacity:1;transform:scale(1.045)}70%{opacity:.66;transform:scale(1.018)}}
@keyframes orasEndWaveA{0%{opacity:.72;transform:scale(.78)}72%{opacity:.16;transform:scale(1.18)}100%{opacity:0;transform:scale(1.28)}}
@keyframes orasEndWaveB{0%{opacity:.50;transform:scale(.84)}75%{opacity:.10;transform:scale(1.24)}100%{opacity:0;transform:scale(1.34)}}
body.oras-ana-photo #portraitFinale{visibility:visible!important;opacity:1!important;pointer-events:auto!important;transition:opacity 2.8s ease!important;z-index:2147482500!important}
body.oras-ana-photo #portraitFinale img{opacity:1!important;visibility:visible!important;filter:none!important;transition:opacity 3.5s ease!important}
body.oras-ana-photo #cenicientoLink{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483400!important}
body.oras-ana-photo #journeyNav{z-index:2147483600!important;pointer-events:auto!important}
body.oras-ana-photo #journeyNav button{pointer-events:auto!important}
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
  const body=document.body,root=document.documentElement;
  const recording=document.getElementById('recording');
  const status=document.getElementById('voiceStatus');
  const finale=document.getElementById('portraitFinale');
  const portrait=document.getElementById('anaPortrait');
  const question=document.getElementById('cenicientoLink');
  const prev=document.getElementById('journeyPrevious');
  const next=document.getElementById('journeyNext');
  let started=false,raf=0,photoTimer=0,revealing=false;

  const setElegiaJourney=()=>{try{window.ORASSetJourney?.('elegia');}catch(_){}};
  setElegiaJourney();setTimeout(setElegiaJourney,0);setTimeout(setElegiaJourney,700);

  const forcePiece=id=>{const b=document.getElementById(id);if(b){b.click();return true;}return false;};
  prev?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();forcePiece('anaEstrella');},{capture:true});
  next?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();forcePiece('anaOjos');},{capture:true});

  const revealPhoto=()=>{
    if(revealing||!finale||!portrait||!question)return;revealing=true;
    cancelAnimationFrame(raf);raf=0;
    body.classList.remove('oras-ana-end-running');
    body.classList.add('portrait-revealed','portrait-choice-visible','oras-ana-photo');
    finale.hidden=false;finale.setAttribute('aria-hidden','false');
    finale.style.visibility='visible';finale.style.opacity='1';finale.style.pointerEvents='auto';
    portrait.style.visibility='visible';portrait.style.opacity='1';
    question.hidden=false;question.removeAttribute('hidden');
    question.style.display='block';question.style.visibility='visible';question.style.opacity='1';question.style.pointerEvents='auto';
    setElegiaJourney();completeAnaPart('elegia');
  };

  const startEnd=()=>{
    if(started)return;started=true;
    body.classList.add('oras-ana-end-running');
    const t0=performance.now(),duration=14000;
    const from=parseFloat(getComputedStyle(root).getPropertyValue('--warm'))||0;
    const tick=now=>{
      if(body.classList.contains('oras-ana-photo'))return;
      const p=Math.min(1,(now-t0)/duration),e=p*p*(3-2*p);
      const warm=from+(0.96-from)*e;
      root.style.setProperty('--warm',warm.toFixed(3));
      root.style.setProperty('--green',(Math.max(.16,.58*(1-e*.70))).toFixed(3));
      root.style.setProperty('--deep',(Math.max(.10,.44*(1-e*.58))).toFixed(3));
      root.style.setProperty('--billiard',(Math.max(.12,.72*(1-e*.72))).toFixed(3));
      if(p<1)raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    photoTimer=setTimeout(revealPhoto,duration+900);
  };

  recording?.addEventListener('ended',startEnd);
  if(recording?.ended)startEnd();
  if(status){const check=()=>{if((status.textContent||'').toLowerCase().includes('fin de la grabación'))startEnd();};new MutationObserver(check).observe(status,{childList:true,subtree:true,characterData:true});check();}
  new MutationObserver(()=>{if(body.classList.contains('portrait-revealed')&&!body.classList.contains('oras-ana-photo')){clearTimeout(photoTimer);revealPhoto();}}).observe(body,{attributes:true,attributeFilter:['class']});
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
