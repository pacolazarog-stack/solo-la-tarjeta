(()=>{
'use strict';
if(window.__anaFinalR25)return;
window.__anaFinalR25=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=6;
const body=document.body;
const html=document.documentElement;

/* R25: modo de voz ligero. El poema queda estable y legible; el latido vive en
   una capa propia de opacidad, independiente de los filtros/animaciones del mundo. */
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
const portraitImg=document.getElementById('anaPortrait');
const question=document.getElementById('cenicientoLink');
if(!portrait||!question)return;

const pulse=document.createElement('div');
pulse.id='anaSafePulseR25';
pulse.setAttribute('aria-hidden','true');
document.body.appendChild(pulse);

const style=document.createElement('style');
style.id='ana-final-r25-style';
style.textContent=`
  @keyframes anaSafePulseR25{0%,100%{opacity:.22}50%{opacity:.58}}
  #anaSafePulseR25{position:fixed;inset:0;z-index:6;pointer-events:none;opacity:0;
    background:radial-gradient(92% 72% at 50% 56%,rgba(30,96,66,.34) 0%,rgba(55,115,82,.18) 46%,rgba(31,78,57,0) 82%);
    animation:anaSafePulseR25 1.85s ease-in-out infinite;will-change:opacity}
  body.ana-voice-r25 #anaSafePulseR25{opacity:.42}
  body.ana-voice-r25 .world .layer,body.ana-voice-r25 .world .layer::before,body.ana-voice-r25 .world .layer::after{
    animation:none!important;filter:none!important;transform:none!important;transition:none!important;will-change:auto!important}
  body.ana-voice-r25 .world .pulse-field{opacity:0!important}
  body.ana-voice-r25 .layer-warm{opacity:0!important}
  body.ana-voice-r25 #reading{display:block!important;visibility:visible!important;opacity:1!important}
  body.ana-voice-r25 #reading .line{opacity:1!important;transform:none!important;filter:none!important;transition:none!important;animation:none!important}
  body.ana-voice-r25 #finalHeat,body.ana-voice-r25 #finalHeatAnchor,
  body.ana-voice-r25 .heat-final,body.ana-voice-r25 .heat-part{display:none!important;animation:none!important;filter:none!important}
  html.ana-voice-r25-html{scroll-behavior:auto!important}
  body.ana-photo-r25 #anaSafePulseR25{display:none!important}
  body.ana-photo-r25 .portrait-finale{opacity:1!important;visibility:visible!important;transition:none!important;pointer-events:auto!important;z-index:120!important}
  body.ana-photo-r25 .portrait-finale img{opacity:1!important;visibility:visible!important;transition:none!important;filter:none!important}
  body.ana-photo-r25 .portrait-question{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transition:none!important;z-index:2!important}
  body.ana-photo-r25 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:none!important}
`;
document.head.appendChild(style);

try{
  if(portraitImg){
    portraitImg.loading='eager';
    portraitImg.decoding='async';
    portraitImg.setAttribute('fetchpriority','high');
    portraitImg.decode?.().catch(()=>{});
  }
}catch(_){}

let photoTimer=0;
let photoDone=false;
const clearPhotoTimer=()=>{if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}};
const targetTime=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+PHOTO_EARLY_SECONDS+8 ? d-TAIL_SECONDS-PHOTO_EARLY_SECONDS : NaN;
};

function showPhoto(){
  if(photoDone)return;
  photoDone=true;
  clearPhotoTimer();
  body.dataset.anaFinalDone='1';
  body.classList.remove('ana-voice-r25','voice-open','locked');
  html.classList.remove('ana-voice-r25-html');
  body.classList.add('portrait-revealed','ana-photo-r25');
  if(finalHeat)finalHeat.style.display='none';
  if(dialog){dialog.style.display='none';dialog.setAttribute('aria-hidden','true');}
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  question.hidden=false;
  question.removeAttribute('hidden');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}
}

function armPhoto(){
  clearPhotoTimer();
  if(photoDone||recording.paused)return;
  const target=targetTime();
  if(!Number.isFinite(target))return;
  const now=recording.currentTime||0;
  if(now>=target){showPhoto();return;}
  photoTimer=setTimeout(showPhoto,Math.max(100,(target-now)*1000));
}

function prepareVoiceView(){
  body.classList.add('ana-voice-r25','voice-open');
  html.classList.add('ana-voice-r25-html');
  if(reading){reading.style.removeProperty('display');reading.style.removeProperty('visibility');reading.style.removeProperty('opacity');}
  if(finalHeat)finalHeat.style.display='none';
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
  if(!recording.paused){recording.pause();clearPhotoTimer();if(voicePlay)voicePlay.textContent='Continuar';return;}
  startVoice();
}

document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(t.id==='voiceLaunch'){startVoice();return;}
  toggleVoice();
},true);

for(const evt of ['play','playing','seeked','loadedmetadata','durationchange']){
  recording.addEventListener(evt,()=>{if(!photoDone&&!recording.paused){prepareVoiceView();armPhoto();}},true);
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
