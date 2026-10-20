(()=>{
'use strict';
if(window.__anaFinalR21)return;
window.__anaFinalR21=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=3.0;
const STOP_AFTER_PHOTO_MS=4200;
const body=document.body;
const recording=document.getElementById('recording');
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
if(!recording||!portrait||!image||!question)return;

const style=document.createElement('style');
style.id='ana-final-r21-style';
style.textContent=`
  @keyframes anaPulseR21{0%,100%{opacity:.40}50%{opacity:.72}}
  body.ana-voice-r21 #reading{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
  body.ana-voice-r21 #finalHeat,body.ana-voice-r21 #finalHeatAnchor,
  body.ana-voice-r21 .heat-final,body.ana-voice-r21 .heat-part{display:none!important;animation:none!important;filter:none!important;transform:none!important}
  body.ana-voice-r21 .layer-warm{animation:none!important;filter:none!important;opacity:0!important;will-change:auto!important}
  body.ana-voice-r21 .pulse-field{animation:anaPulseR21 1.85s ease-in-out infinite!important;filter:none!important;transform:none!important;will-change:opacity!important}
  body.ana-voice-r21 .pulse-field::before,body.ana-voice-r21 .pulse-field::after{animation:none!important;filter:none!important;transform:none!important;will-change:auto!important}
`;
document.head.appendChild(style);
try{image.decode?.().catch(()=>{});}catch(_){}

let timer=0,photoDone=false;
const clearTimer=()=>{if(timer){clearTimeout(timer);timer=0;}};
const targetTime=()=>{const d=recording.duration;return Number.isFinite(d)&&d>TAIL_SECONDS+4?d-TAIL_SECONDS-PHOTO_EARLY_SECONDS:NaN;};

function showPhoto(){
  if(photoDone)return;
  photoDone=true;clearTimer();
  body.dataset.anaFinalDone='1';
  body.classList.remove('ana-voice-r21','voice-open','locked');
  body.classList.add('portrait-revealed','edge-final-safe');
  if(reading){reading.style.display='none';reading.style.visibility='hidden';}
  if(finalHeat){finalHeat.style.display='none';}
  if(dialog){dialog.style.display='none';dialog.style.visibility='hidden';dialog.style.pointerEvents='none';dialog.setAttribute('aria-hidden','true');dialog.removeAttribute('open');}
  portrait.hidden=false;portrait.removeAttribute('hidden');portrait.setAttribute('aria-hidden','false');
  Object.assign(portrait.style,{display:'block',position:'fixed',inset:'0',opacity:'1',visibility:'visible',pointerEvents:'auto',zIndex:'2147483000',transition:'none'});
  image.hidden=false;image.removeAttribute('hidden');
  Object.assign(image.style,{display:'block',opacity:'1',visibility:'visible',transition:'opacity 1.2s ease-in-out'});
  question.hidden=false;question.removeAttribute('hidden');
  Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none'});
  try{window.ORASReadingWindowR2?.completeAnaPart?.('elegia');}catch(_){}
  setTimeout(()=>{
    try{recording.pause();}catch(_){}
    try{recording.removeAttribute('src');recording.load();}catch(_){}
    try{ambient?.pause();}catch(_){}
  },STOP_AFTER_PHOTO_MS);
}

function armPhoto(){
  clearTimer();if(photoDone||recording.paused)return;
  const target=targetTime();if(!Number.isFinite(target))return;
  const now=recording.currentTime||0;
  if(now>=target){showPhoto();return;}
  timer=setTimeout(showPhoto,Math.max(80,(target-now)*1000));
}

function startVoice(){
  body.classList.add('ana-voice-r21','voice-open');
  if(reading){reading.style.display='none';reading.style.visibility='hidden';}
  if(finalHeat)finalHeat.style.display='none';
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
  recording.muted=false;if(recording.volume===0)recording.volume=1;
  recording.play().then(()=>{
    if(voicePlay)voicePlay.textContent='Pausar';
    if(status)status.textContent='';
    armPhoto();
  }).catch(()=>{if(status)status.textContent='Pulsa Voz para iniciar la grabación.';});
}

function toggleVoice(){
  if(!recording.paused){recording.pause();clearTimer();if(voicePlay)voicePlay.textContent='Continuar';return;}
  startVoice();
}

document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(t.id==='voiceLaunch'){startVoice();return;}
  toggleVoice();
},true);

for(const evt of ['play','playing','seeked','loadedmetadata','durationchange'])recording.addEventListener(evt,()=>{if(!recording.paused){body.classList.add('ana-voice-r21');armPhoto();}},true);
recording.addEventListener('pause',()=>{if(!photoDone)clearTimer();},true);
recording.addEventListener('timeupdate',()=>{if(photoDone)return;const t=targetTime();if(Number.isFinite(t)&&recording.currentTime>=t)showPhoto();},true);
})();
