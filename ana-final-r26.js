(()=>{
'use strict';
if(window.__anaFinalR26)return;
window.__anaFinalR26=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=7;
const body=document.body;

/* R26: no anima el lienzo completo ni fuerza todas las líneas del poema.
   Congela las capas antiguas durante la voz y mantiene un único latido pequeño,
   compuesto solo con transform + opacity. */
const legacy=document.getElementById('recording');
if(!legacy)return;
const recording=legacy.cloneNode(true);
legacy.replaceWith(recording);

const dialog=document.getElementById('voiceDialog');
const voicePlay=document.getElementById('voicePlay');
const voiceLaunch=document.getElementById('voiceLaunch');
const status=document.getElementById('voiceStatus');
const ambient=document.getElementById('voiceMusic');
const reading=document.getElementById('reading');
const finalHeat=document.getElementById('finalHeat');
const portrait=document.getElementById('portraitFinale');
const portraitImg=document.getElementById('anaPortrait');
const question=document.getElementById('cenicientoLink');
if(!portrait||!portraitImg||!question)return;

const pulse=document.createElement('div');
pulse.id='anaPulseR26';
pulse.setAttribute('aria-hidden','true');
body.appendChild(pulse);

const style=document.createElement('style');
style.id='ana-final-r26-style';
style.textContent=`
@keyframes anaPulseR26{0%,100%{opacity:.20;transform:translate3d(-50%,-50%,0) scale(.94)}50%{opacity:.58;transform:translate3d(-50%,-50%,0) scale(1.06)}}
#anaPulseR26{display:none;position:fixed;left:50%;top:50%;width:min(46vw,560px);aspect-ratio:1.65/1;z-index:6;pointer-events:none;border-radius:50%;
 background:radial-gradient(ellipse at center,rgba(32,103,70,.34) 0%,rgba(48,112,78,.17) 48%,rgba(32,90,63,0) 76%);
 transform:translate3d(-50%,-50%,0);will-change:transform,opacity}
body.ana-voice-r26 #anaPulseR26{display:block;animation:anaPulseR26 1.85s ease-in-out infinite}
body.ana-voice-r26 .world .layer,body.ana-voice-r26 .world .layer::before,body.ana-voice-r26 .world .layer::after{
 animation:none!important;transition:none!important;filter:none!important;will-change:auto!important}
body.ana-voice-r26 .world .pulse-field{opacity:0!important}
body.ana-voice-r26 .layer-warm{opacity:0!important}
body.ana-voice-r26 #reading{display:block!important;visibility:visible!important;opacity:1!important}
body.ana-voice-r26 #reading .line{animation:none!important;transition:none!important;filter:none!important}
body.ana-voice-r26 #finalHeat,body.ana-voice-r26 .heat-final,body.ana-voice-r26 .heat-part{
 animation:none!important;transition:none!important;filter:none!important}
body.ana-photo-r26 #anaPulseR26{display:none!important}
`;
document.head.appendChild(style);

try{portraitImg.loading='eager';portraitImg.decoding='async';portraitImg.setAttribute('fetchpriority','high');portraitImg.decode?.().catch(()=>{});}catch(_){}

let timer=0;
let photoDone=false;
const clearTimer=()=>{if(timer){clearTimeout(timer);timer=0;}};
const targetTime=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+PHOTO_EARLY_SECONDS+5 ? d-TAIL_SECONDS-PHOTO_EARLY_SECONDS : NaN;
};

function showPhoto(){
  if(photoDone)return;
  photoDone=true;
  clearTimer();
  body.dataset.anaFinalDone='1';
  body.classList.remove('ana-voice-r26','voice-open','locked');
  body.classList.add('ana-photo-r26');
  try{recording.pause();}catch(_){}
  if(dialog){dialog.style.display='none';dialog.setAttribute('aria-hidden','true');}
  if(reading){reading.style.opacity='0';reading.style.visibility='hidden';reading.style.pointerEvents='none';}
  portrait.hidden=false;portrait.removeAttribute('hidden');portrait.setAttribute('aria-hidden','false');
  Object.assign(portrait.style,{display:'block',opacity:'1',visibility:'visible',pointerEvents:'auto',zIndex:'220',transition:'none'});
  Object.assign(portraitImg.style,{display:'block',opacity:'1',visibility:'visible',filter:'none',transition:'none'});
  question.hidden=false;question.removeAttribute('hidden');
  Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none',zIndex:'3'});
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}
}

function armPhoto(){
  clearTimer();
  if(photoDone||recording.paused)return;
  const target=targetTime();
  if(!Number.isFinite(target))return;
  const now=recording.currentTime||0;
  if(now>=target){showPhoto();return;}
  timer=setTimeout(showPhoto,Math.max(100,(target-now)*1000));
}

function prepare(){
  body.classList.add('ana-voice-r26','voice-open');
  /* El calor puede seguir visible como texto, pero queda completamente estático. */
  if(finalHeat){finalHeat.style.removeProperty('display');finalHeat.classList.remove('is-burning');}
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
}

function start(){
  if(photoDone)return;
  prepare();
  recording.muted=false;
  if(recording.volume===0)recording.volume=1;
  Promise.resolve(recording.play()).then(()=>{
    if(voicePlay)voicePlay.textContent='Pausar';
    if(status)status.textContent='';
    armPhoto();
  }).catch(()=>{
    if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';
    if(voicePlay)voicePlay.textContent='Activar voz';
  });
}
function toggle(){
  if(photoDone)return;
  if(!recording.paused){recording.pause();clearTimer();if(voicePlay)voicePlay.textContent='Continuar';return;}
  start();
}

document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  t.id==='voiceLaunch'?start():toggle();
},true);

recording.addEventListener('loadedmetadata',()=>{if(!recording.paused)armPhoto();},{passive:true});
recording.addEventListener('playing',()=>{if(!photoDone){prepare();armPhoto();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!photoDone&&!recording.paused)armPhoto();},{passive:true});
recording.addEventListener('pause',()=>{if(!photoDone)clearTimer();},{passive:true});
recording.addEventListener('ended',showPhoto,{once:true});
recording.addEventListener('error',()=>{
  if(photoDone)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
