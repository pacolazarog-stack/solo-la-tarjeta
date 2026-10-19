(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261018-r3-progress-1';
const VERSION='20261019-ana-edge-mp3-pulse-r14';
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
      io.disconnect();completeAnaPart(key);
    }
  },{threshold:[ratio,.8,1]});
  io.observe(target);
}

function setupElegia(){
  const body=document.body;
  const recording=document.getElementById('recording');
  const ambient=document.getElementById('voiceMusic');
  const portrait=document.getElementById('portraitFinale');
  const image=document.getElementById('anaPortrait');
  const question=document.getElementById('cenicientoLink');
  const dialog=document.getElementById('voiceDialog');
  const voicePlay=document.getElementById('voicePlay');
  if(!recording)return;

  const style=document.createElement('style');
  style.id='oras-ana-safe-pulse-r14';
  style.textContent=`
    @keyframes orasSafePulseR14{0%,100%{opacity:.38}50%{opacity:.76}}
    .pulse-field{
      animation:orasSafePulseR14 1.85s ease-in-out infinite!important;
      filter:none!important;
      transform:none!important;
      will-change:opacity!important;
    }
    .pulse-field::before,.pulse-field::after{
      animation:none!important;
      filter:none!important;
      transform:none!important;
      will-change:auto!important;
    }
    .layer-warm,.heat-final.is-burning{
      animation:none!important;
      filter:none!important;
      will-change:auto!important;
    }
    body.voice-open .layer-green,
    body.voice-open .layer-deep,
    body.voice-open .layer-billiard,
    body.voice-open .layer-warm,
    body.voice-open #reading .line{
      filter:none!important;
      will-change:auto!important;
    }
    body.edge-final-safe .pulse-field{animation:none!important;opacity:.42!important}
  `;
  document.head.appendChild(style);

  let finalDone=false;
  let finalTimer=0;

  const clearFinalTimer=()=>{if(finalTimer){clearTimeout(finalTimer);finalTimer=0;}};
  const showFinal=()=>{
    if(finalDone)return;
    finalDone=true;
    clearFinalTimer();
    if(dialog){
      dialog.style.display='none';
      dialog.setAttribute('aria-hidden','true');
      dialog.removeAttribute('open');
    }
    body.classList.add('edge-final-safe','portrait-revealed');
    body.classList.remove('voice-open','locked');
    body.dataset.anaFinalDone='1';
    try{recording.pause();recording.removeAttribute('controls');}catch(_){}
    try{ambient?.pause();}catch(_){}
    if(portrait){
      portrait.setAttribute('aria-hidden','false');
      Object.assign(portrait.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',zIndex:'120',transition:'none'});
    }
    if(image)Object.assign(image.style,{opacity:'1',visibility:'visible',transition:'none'});
    if(question)Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none'});
    completeAnaPart('elegia');
  };

  const armFinal=()=>{
    clearFinalTimer();
    if(finalDone||recording.paused)return;
    const d=recording.duration,current=recording.currentTime||0;
    if(Number.isFinite(d)&&d>current){
      finalTimer=setTimeout(showFinal,Math.max(500,(d-current+0.35)*1000));
    }else{
      finalTimer=setTimeout(showFinal,105000);
    }
  };

  const startVoice=()=>{
    body.classList.add('voice-open');
    try{if(dialog&&!dialog.open)dialog.show();}catch(_){}
    try{ambient?.pause();}catch(_){}
    recording.muted=false;
    if(recording.volume===0)recording.volume=1;
    recording.play().then(()=>{
      if(voicePlay)voicePlay.textContent='Pausar';
      const status=document.getElementById('voiceStatus');if(status)status.textContent='';
      armFinal();
    }).catch(()=>{});
  };

  document.addEventListener('click',e=>{
    const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
    if(!t)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(t.id==='voicePlay'&&!recording.paused){
      recording.pause();clearFinalTimer();
      if(voicePlay)voicePlay.textContent='Continuar';
      return;
    }
    startVoice();
  },true);

  document.addEventListener('play',e=>{
    if(e.target!==recording)return;
    e.stopImmediatePropagation();
    body.classList.add('voice-open');
    try{ambient?.pause();}catch(_){}
    armFinal();
  },true);
  document.addEventListener('pause',e=>{
    if(e.target!==recording)return;
    e.stopImmediatePropagation();
    if(!finalDone)clearFinalTimer();
  },true);
  document.addEventListener('ended',e=>{
    if(e.target!==recording)return;
    e.stopImmediatePropagation();
    showFinal();
  },true);
  recording.addEventListener('seeked',()=>{if(!recording.paused)armFinal();});
  recording.addEventListener('loadedmetadata',()=>{if(!recording.paused)armFinal();},{once:false});

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
  if(path.endsWith('/epilogo')){
    const flowers=document.getElementById('flowerCoda');
    if(flowers){const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});mark();}
  }
  addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.channel==='ceniciento-music-v1'&&e.data?.type==='interlude-ended')completeAnaPart('interludio');});
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}

setupTracking();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();