(()=>{
'use strict';
if(window.__orasReadingWindowR3)return;
window.__orasReadingWindowR3=true;
window.__orasDisableLegacyVoiceMix=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261018-r3-progress-1';
const VERSION='20261020-ana-voice-owner-r21';
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
function readState(){try{const s=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};s.anaParts=Object.assign(emptyParts(),s.anaParts&&typeof s.anaParts==='object'?s.anaParts:{});return s;}catch(_){return {anaParts:emptyParts()};}}
function writeState(patch){try{const n=Object.assign({},readState(),patch);localStorage.setItem(STORAGE,JSON.stringify(n));return n;}catch(_){return readState();}}
function completeAnaPart(key){if(!ANA_PARTS.some(([k])=>k===key))return;const s=readState();if(s.anaParts[key]===true)return;const parts=Object.assign(emptyParts(),s.anaParts,{[key]:true});writeState({anaParts:parts,anaComplete:ANA_PARTS.every(([k])=>parts[k]===true)});try{dispatchEvent(new CustomEvent('oras:progress-changed',{detail:{part:key,anaParts:parts}}));}catch(_){}}
function openIndex(){if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}let s=document.querySelector('script[data-oras-master-index-global]');if(!s){s=document.createElement('script');s.dataset.orasMasterIndexGlobal='1';s.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;s.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});document.head.appendChild(s);}}
function observeEnd(selector,key,ratio=.55){const target=[...document.querySelectorAll(selector)].at(-1);if(!target||!('IntersectionObserver'in window))return;const io=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting&&x.intersectionRatio>=ratio)){io.disconnect();completeAnaPart(key);}},{threshold:[ratio,.8,1]});io.observe(target);}

function setupElegia(){
  const body=document.body;
  const nameAudio=document.getElementById('nameAudio');
  const entryButton=document.getElementById('entryButton');
  /* Única responsabilidad especial de esta capa en ANA: recuperar el nombre hablado.
     La voz larga y el final pertenecen exclusivamente a ana-final-r21.js. */
  if(nameAudio&&entryButton){
    let token=0;
    entryButton.addEventListener('click',()=>{
      if(entryButton.disabled)return;
      const t=++token;
      try{
        nameAudio.pause();nameAudio.currentTime=0;nameAudio.muted=true;
        Promise.resolve(nameAudio.play()).then(()=>{
          if(t!==token)return;
          nameAudio.pause();nameAudio.currentTime=0;nameAudio.muted=false;
          setTimeout(()=>{if(t!==token)return;try{nameAudio.currentTime=0;}catch(_){}nameAudio.play().catch(()=>{});},2410);
        }).catch(()=>{nameAudio.muted=false;});
      }catch(_){nameAudio.muted=false;}
    },true);
  }
  if('MutationObserver'in window){
    const mark=()=>{if(body.classList.contains('portrait-revealed'))completeAnaPart('elegia');};
    new MutationObserver(mark).observe(body,{attributes:true,attributeFilter:['class']});mark();
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
window.ORASReadingWindowR3=window.ORASReadingWindowR2;
})();
