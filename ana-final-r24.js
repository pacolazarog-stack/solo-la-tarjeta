(()=>{
'use strict';
if(window.__anaFinalR24)return;
window.__anaFinalR24=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=4.0;
const body=document.body;

/* R24: voz aislada, texto visible, calor pesado desactivado y final ligero. */
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
const question=document.getElementById('cenicientoLink');
if(!portrait||!question)return;

const style=document.createElement('style');
style.id='ana-final-r24-style';
style.textContent=`
  @keyframes anaPulseR24{0%,100%{opacity:.40}50%{opacity:.72}}
  body.ana-voice-r24 #reading{display:block!important;visibility:visible!important;opacity:1!important}
  body.ana-voice-r24 #finalHeat,body.ana-voice-r24 #finalHeatAnchor,
  body.ana-voice-r24 .heat-final,body.ana-voice-r24 .heat-part{display:none!important;animation:none!important;filter:none!important;transform:none!important}
  body.ana-voice-r24 .layer-warm{animation:none!important;filter:none!important;opacity:0!important;will-change:auto!important}
  body.ana-voice-r24 .pulse-field{animation:anaPulseR24 1.85s ease-in-out infinite!important;filter:none!important;transform:none!important;will-change:opacity!important}
  body.ana-voice-r24 .pulse-field::before,body.ana-voice-r24 .pulse-field::after{animation:none!important;filter:none!important;transform:none!important;will-change:auto!important}
  body.ana-photo-r24 .portrait-finale{opacity:1!important;visibility:visible!important;transition:opacity .35s linear!important;pointer-events:auto!important}
  body.ana-photo-r24 .portrait-finale img{opacity:1!important;visibility:visible!important;transition:none!important}
  body.ana-photo-r24 .portrait-question{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transition:none!important}
  body.ana-photo-r24 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:none!important}
`;
document.head.appendChild(style);

let photoTimer=0;
let photoDone=false;
const clearPhotoTimer=()=>{if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}};
const targetTime=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+6 ? d-TAIL_SECONDS-PHOTO_EARLY_SECONDS : NaN;
};

function showPhoto(){
  if(photoDone)return;
  photoDone=true;
  clearPhotoTimer();
  body.dataset.anaFinalDone='1';
  body.classList.remove('ana-voice-r24','voice-open','locked');
  body.classList.add('portrait-revealed','edge-final-safe','ana-photo-r24');
  if(finalHeat)finalHeat.style.display='none';
  if(dialog){dialog.style.display='none';dialog.setAttribute('aria-hidden','true');}
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  question.hidden=false;
  question.removeAttribute('hidden');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}
  try{window.ORASReadingWindowR2?.completeAnaPart?.('elegia');}catch(_){}
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
  body.classList.add('ana-voice-r24','voice-open');
  if(reading){
    reading.style.removeProperty('display');
    reading.style.removeProperty('visibility');
    reading.style.removeProperty('opacity');
  }
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
