(()=>{
'use strict';
if(window.__anaFinalR22)return;
window.__anaFinalR22=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=3.0;
const PAUSE_AFTER_PHOTO_MS=3600;
const body=document.body;

/*
  R22: aislamiento real de la voz de ANA.
  El HTML histórico registró muchos listeners sobre #recording. En vez de
  intentar neutralizarlos uno por uno, sustituimos el elemento por un clon.
  Los listeners antiguos quedan unidos al nodo retirado y no pueden volver a
  gobernar play/pause/error/ended del audio visible.
*/
const legacyRecording=document.getElementById('recording');
if(!legacyRecording)return;
const recording=legacyRecording.cloneNode(true);
legacyRecording.replaceWith(recording);

const dialog=document.getElementById('voiceDialog');
const voicePlay=document.getElementById('voicePlay');
const voiceLaunch=document.getElementById('voiceLaunch');
const status=document.getElementById('voiceStatus');
const ambient=document.getElementById('voiceMusic');
const reading=document.getElementById('reading');
const finalHeat=document.getElementById('finalHeat');
const portrait=document.getElementById('portraitFinale');
const image=document.getElementById('anaPortrait');
const question=document.getElementById('cenicientoLink');
if(!portrait||!image||!question)return;

const style=document.createElement('style');
style.id='ana-final-r22-style';
style.textContent=`
  @keyframes anaPulseR22{0%,100%{opacity:.40}50%{opacity:.72}}
  body.ana-voice-r22 #reading{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
  body.ana-voice-r22 #finalHeat,body.ana-voice-r22 #finalHeatAnchor,
  body.ana-voice-r22 .heat-final,body.ana-voice-r22 .heat-part{display:none!important;animation:none!important;filter:none!important;transform:none!important}
  body.ana-voice-r22 .layer-warm{animation:none!important;filter:none!important;opacity:0!important;will-change:auto!important}
  body.ana-voice-r22 .pulse-field{animation:anaPulseR22 1.85s ease-in-out infinite!important;filter:none!important;transform:none!important;will-change:opacity!important}
  body.ana-voice-r22 .pulse-field::before,body.ana-voice-r22 .pulse-field::after{animation:none!important;filter:none!important;transform:none!important;will-change:auto!important}
  body.portrait-revealed #reading{display:none!important;visibility:hidden!important;opacity:0!important}
`;
document.head.appendChild(style);
try{image.decode?.().catch(()=>{});}catch(_){}

let photoTimer=0;
let stopTimer=0;
let photoDone=false;
const clearPhotoTimer=()=>{if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}};
const clearStopTimer=()=>{if(stopTimer){clearTimeout(stopTimer);stopTimer=0;}};
const targetTime=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+4 ? d-TAIL_SECONDS-PHOTO_EARLY_SECONDS : NaN;
};

function showPhoto(){
  if(photoDone)return;
  photoDone=true;
  clearPhotoTimer();
  body.dataset.anaFinalDone='1';
  body.classList.remove('ana-voice-r22','voice-open','locked');
  body.classList.add('portrait-revealed','edge-final-safe');

  if(reading){
    reading.style.setProperty('display','none','important');
    reading.style.setProperty('visibility','hidden','important');
    reading.style.setProperty('opacity','0','important');
  }
  if(finalHeat)finalHeat.style.setProperty('display','none','important');
  if(dialog){
    dialog.style.display='none';
    dialog.style.visibility='hidden';
    dialog.style.pointerEvents='none';
    dialog.setAttribute('aria-hidden','true');
    dialog.removeAttribute('open');
  }

  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  Object.assign(portrait.style,{
    display:'block',position:'fixed',inset:'0',opacity:'1',visibility:'visible',
    pointerEvents:'auto',zIndex:'2147483000',transition:'none'
  });
  image.hidden=false;
  image.removeAttribute('hidden');
  Object.assign(image.style,{display:'block',opacity:'1',visibility:'visible',transition:'opacity 1.2s ease-in-out'});
  question.hidden=false;
  question.removeAttribute('hidden');
  Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none'});

  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}
  try{window.ORASReadingWindowR2?.completeAnaPart?.('elegia');}catch(_){}

  /* Se pausa después de terminar la voz real, pero NO se elimina src.
     Así nunca aparece 0:00/0:00 ni el falso error de carga. */
  clearStopTimer();
  stopTimer=setTimeout(()=>{
    try{recording.pause();}catch(_){}
    try{ambient?.pause();}catch(_){}
  },PAUSE_AFTER_PHOTO_MS);
}

function armPhoto(){
  clearPhotoTimer();
  if(photoDone||recording.paused)return;
  const target=targetTime();
  if(!Number.isFinite(target))return;
  const now=recording.currentTime||0;
  if(now>=target){showPhoto();return;}
  photoTimer=setTimeout(showPhoto,Math.max(80,(target-now)*1000));
}

function prepareVoiceView(){
  body.classList.add('ana-voice-r22','voice-open');
  if(reading){
    reading.style.setProperty('display','none','important');
    reading.style.setProperty('visibility','hidden','important');
  }
  if(finalHeat)finalHeat.style.setProperty('display','none','important');
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
}

function startVoice(){
  if(photoDone)return;
  prepareVoiceView();
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

function toggleVoice(){
  if(photoDone)return;
  if(!recording.paused){
    recording.pause();
    clearPhotoTimer();
    if(voicePlay)voicePlay.textContent='Continuar';
    return;
  }
  startVoice();
}

/* Captura antes que los listeners históricos de los botones. */
document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if(t.id==='voiceLaunch'){startVoice();return;}
  toggleVoice();
},true);

for(const evt of ['play','playing','seeked','loadedmetadata','durationchange']){
  recording.addEventListener(evt,()=>{
    if(photoDone)return;
    if(!recording.paused){prepareVoiceView();armPhoto();}
  },true);
}
recording.addEventListener('pause',()=>{if(!photoDone)clearPhotoTimer();},true);
recording.addEventListener('timeupdate',()=>{
  if(photoDone)return;
  const t=targetTime();
  if(Number.isFinite(t)&&recording.currentTime>=t)showPhoto();
},true);
recording.addEventListener('ended',showPhoto,true);
recording.addEventListener('error',()=>{
  if(photoDone)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},true);
})();
