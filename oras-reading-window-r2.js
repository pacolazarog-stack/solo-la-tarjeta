(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261018-r3-progress-1';
const VERSION='20261018-ana-final-rescue-r9';
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
  const portrait=document.getElementById('portraitFinale');
  const image=document.getElementById('anaPortrait');
  const question=document.getElementById('cenicientoLink');
  const dialog=document.getElementById('voiceDialog');
  let rescueDone=false;
  let lastMediaTime=0;
  let lastAdvanceAt=performance.now();

  const rescueFinal=()=>{
    if(rescueDone)return;
    rescueDone=true;
    try{recording?.pause();recording?.removeAttribute('controls');}catch(_){}
    try{if(dialog?.open)dialog.close();}catch(_){}
    if(dialog){dialog.style.display='none';dialog.setAttribute('aria-hidden','true');}
    body.classList.remove('voice-open','locked');
    body.classList.add('portrait-revealed','edge-final-safe');
    body.dataset.anaFinalDone='1';
    if(portrait){
      portrait.setAttribute('aria-hidden','false');
      portrait.style.opacity='1';
      portrait.style.visibility='visible';
      portrait.style.pointerEvents='auto';
      portrait.style.zIndex='120';
    }
    if(image){image.style.opacity='1';image.style.visibility='visible';}
    if(question){
      question.style.opacity='1';
      question.style.visibility='visible';
      question.style.pointerEvents='auto';
      question.style.transition='none';
    }
    completeAnaPart('elegia');
  };

  const nearEnd=()=>{
    if(!recording)return false;
    const duration=recording.duration;
    if(!Number.isFinite(duration)||duration<=0)return recording.currentTime>=99;
    return duration-recording.currentTime<=1.5;
  };

  recording?.addEventListener('ended',rescueFinal);
  recording?.addEventListener('play',()=>{
    lastMediaTime=recording.currentTime||0;
    lastAdvanceAt=performance.now();
  });
  recording?.addEventListener('seeked',()=>{
    lastMediaTime=recording.currentTime||0;
    lastAdvanceAt=performance.now();
    if(nearEnd())rescueFinal();
  });
  recording?.addEventListener('pause',()=>{
    if(nearEnd())rescueFinal();
  });
  recording?.addEventListener('timeupdate',()=>{
    if(nearEnd())rescueFinal();
  });

  /* Reloj externo: también actúa si Edge se queda mostrando 1:40 / 1:40
     y cambia a paused sin emitir ended. */
  setInterval(()=>{
    if(rescueDone||!recording||recording.seeking)return;
    const now=performance.now();
    const current=recording.currentTime||0;
    const duration=recording.duration;
    if(current>lastMediaTime+.015){lastMediaTime=current;lastAdvanceAt=now;}
    if(Number.isFinite(duration)&&duration>0){
      const remaining=duration-current;
      if(remaining<=1.5 || (remaining<=5 && now-lastAdvanceAt>=650))rescueFinal();
    }else if(current>=99 && now-lastAdvanceAt>=650){
      rescueFinal();
    }
  },100);

  if(recording?.ended||nearEnd())rescueFinal();

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
