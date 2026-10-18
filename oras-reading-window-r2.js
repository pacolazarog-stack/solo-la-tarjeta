(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261018-r3-progress-1';
const VERSION='20261018-ana-edge-preempt-r11';
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

  const SAFE_MARGIN=4.6;
  const FALLBACK_CUTOFF=95;

  const style=document.createElement('style');
  style.id='oras-edge-voice-safe-r11';
  style.textContent=`
    body.voice-open .world,
    body.voice-open .world *,
    body.voice-open .pulse-field,
    body.voice-open .pulse-field::before,
    body.voice-open .pulse-field::after,
    body.voice-open .layer-warm,
    body.voice-open .heat-final,
    body.voice-open #reading .line{
      animation:none!important;
      transition:none!important;
      filter:none!important;
      will-change:auto!important;
    }
    body.edge-final-safe .world,
    body.edge-final-safe .world *,
    body.edge-final-safe .heat-final{
      animation:none!important;
      transition:none!important;
      filter:none!important;
      will-change:auto!important;
    }
  `;
  document.head.appendChild(style);

  let rescueDone=false;
  let lastMediaTime=recording.currentTime||0;
  let lastAdvanceAt=performance.now();
  let finalTimer=0;
  let watchdog=0;

  const nearEnd=()=>{
    const d=recording.duration;
    if(!Number.isFinite(d)||d<=0)return recording.currentTime>=FALLBACK_CUTOFF;
    return d-recording.currentTime<=SAFE_MARGIN;
  };

  const showFinal=()=>{
    if(rescueDone)return;
    rescueDone=true;
    clearTimeout(finalTimer);finalTimer=0;
    if(watchdog){clearInterval(watchdog);watchdog=0;}

    /* Importante: no se usa dialog.close(). El listener histórico de close
       reactivaba mezcla/ambiente justo en el punto crítico de Edge. */
    if(dialog){
      dialog.style.display='none';
      dialog.setAttribute('aria-hidden','true');
      dialog.removeAttribute('open');
    }

    body.classList.add('edge-final-safe');
    try{recording.pause();recording.removeAttribute('controls');}catch(_){}
    try{ambient?.pause();}catch(_){}

    body.classList.remove('voice-open','locked');
    body.classList.add('portrait-revealed');
    body.dataset.anaFinalDone='1';

    if(portrait){
      portrait.setAttribute('aria-hidden','false');
      Object.assign(portrait.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',zIndex:'120',transition:'none'});
    }
    if(image)Object.assign(image.style,{opacity:'1',visibility:'visible',transition:'none'});
    if(question)Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none'});
    completeAnaPart('elegia');
  };

  const armFinal=()=>{
    clearTimeout(finalTimer);finalTimer=0;
    if(rescueDone||recording.paused)return;
    const d=recording.duration;
    const current=recording.currentTime||0;
    if(Number.isFinite(d)&&d>0){
      const remaining=d-current;
      if(remaining<=SAFE_MARGIN){showFinal();return;}
      finalTimer=setTimeout(showFinal,Math.max(0,(remaining-SAFE_MARGIN)*1000));
    }else{
      const remaining=Math.max(0,FALLBACK_CUTOFF-current);
      finalTimer=setTimeout(showFinal,remaining*1000);
    }
  };

  /* Intercepta únicamente el arranque/reanudación. La voz queda aislada de
     la antigua mezcla dinámica y del cierre del dialog. */
  document.addEventListener('click',e=>{
    const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
    if(!t)return;
    e.preventDefault();e.stopImmediatePropagation();
    body.classList.add('voice-open');
    try{if(dialog&&!dialog.open)dialog.show();}catch(_){}
    try{ambient?.pause();}catch(_){}
    recording.muted=false;
    if(recording.volume===0)recording.volume=1;
    if(t.id==='voicePlay'&&!recording.paused){
      recording.pause();
      if(voicePlay)voicePlay.textContent='Continuar';
      return;
    }
    recording.play().then(()=>{
      if(voicePlay)voicePlay.textContent='Pausar';
      const status=document.getElementById('voiceStatus');if(status)status.textContent='';
      lastMediaTime=recording.currentTime||0;lastAdvanceAt=performance.now();armFinal();
    }).catch(()=>{});
  },true);

  document.addEventListener('play',e=>{
    if(e.target!==recording)return;
    e.stopImmediatePropagation();
    body.classList.add('voice-open');
    try{ambient?.pause();}catch(_){}
    lastMediaTime=recording.currentTime||0;lastAdvanceAt=performance.now();armFinal();
  },true);
  document.addEventListener('pause',e=>{
    if(e.target!==recording)return;
    e.stopImmediatePropagation();
    if(!rescueDone&&nearEnd())showFinal();
  },true);
  document.addEventListener('ended',e=>{
    if(e.target!==recording)return;
    e.stopImmediatePropagation();showFinal();
  },true);

  recording.addEventListener('seeked',()=>{
    lastMediaTime=recording.currentTime||0;lastAdvanceAt=performance.now();
    if(nearEnd())showFinal();else armFinal();
  });
  recording.addEventListener('timeupdate',()=>{if(nearEnd())showFinal();});

  watchdog=setInterval(()=>{
    if(rescueDone||recording.seeking||recording.paused)return;
    const now=performance.now(),current=recording.currentTime||0,d=recording.duration;
    if(current>lastMediaTime+.02){lastMediaTime=current;lastAdvanceAt=now;}
    if((Number.isFinite(d)&&d>0&&d-current<=SAFE_MARGIN) || current>=FALLBACK_CUTOFF){showFinal();return;}
    if(Number.isFinite(d)&&d-current<=10&&now-lastAdvanceAt>=500)showFinal();
  },200);

  if(recording.ended||nearEnd())showFinal();
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