(()=>{
'use strict';
if(window.__anaFinalR20)return;
window.__anaFinalR20=true;

const TAIL_SECONDS=12;
const VISUAL_EARLY_SECONDS=2.2;
const STOP_AFTER_REVEAL_MS=3000;
const recording=document.getElementById('recording');
const dialog=document.getElementById('voiceDialog');
const portrait=document.getElementById('portraitFinale');
const image=document.getElementById('anaPortrait');
const question=document.getElementById('cenicientoLink');
const ambient=document.getElementById('voiceMusic');
const body=document.body;
if(!recording||!portrait||!image||!question)return;

/* Durante la voz sólo permanece el pulso ligero. Se retira por completo la
   capa textual final «el calor.», que estaba coincidiendo con el punto de
   bloqueo de Edge. */
const style=document.createElement('style');
style.id='ana-final-r20-style';
style.textContent=`
  @keyframes anaPulseR20{0%,100%{opacity:.42}50%{opacity:.72}}
  body.ana-voice-isolated-r20 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
  body.ana-voice-isolated-r20 #finalHeat,
  body.ana-voice-isolated-r20 .heat-anchor,
  body.ana-voice-isolated-r20 .heat-final,
  body.ana-voice-isolated-r20 .heat-part{display:none!important;animation:none!important;filter:none!important;transform:none!important}
  body.ana-voice-isolated-r20 .layer-warm{animation:none!important;filter:none!important;will-change:auto!important}
  body.ana-voice-isolated-r20 .pulse-field{animation:anaPulseR20 1.85s ease-in-out infinite!important;filter:none!important;transform:none!important;will-change:opacity!important}
  body.ana-voice-isolated-r20 .pulse-field::before,
  body.ana-voice-isolated-r20 .pulse-field::after{animation:none!important;filter:none!important;transform:none!important;will-change:auto!important}
`;
document.head.appendChild(style);

/* Prepara la foto antes del final para que la transición no dependa de una
   decodificación tardía. */
try{image.decode?.().catch(()=>{});}catch(_){}

let timer=0;
let done=false;
const clear=()=>{if(timer){clearTimeout(timer);timer=0;}};

const forceFinal=()=>{
  if(done)return;
  done=true;
  clear();
  body.dataset.anaFinalDone='1';
  body.classList.add('portrait-revealed');
  body.classList.remove('voice-open','locked','ana-voice-isolated-r20');

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
  Object.assign(portrait.style,{display:'block',position:'fixed',inset:'0',opacity:'1',visibility:'visible',pointerEvents:'auto',zIndex:'2147483000',transition:'none'});
  image.hidden=false;
  image.removeAttribute('hidden');
  Object.assign(image.style,{display:'block',opacity:'1',visibility:'visible',transition:'opacity 1.2s ease-in-out'});
  question.hidden=false;
  question.removeAttribute('hidden');
  Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none'});

  setTimeout(()=>{
    try{recording.pause();}catch(_){}
    try{recording.removeAttribute('src');recording.load();}catch(_){}
    try{ambient?.pause();}catch(_){}
  },STOP_AFTER_REVEAL_MS);

  try{window.ORASReadingWindowR2?.completeAnaPart?.('elegia');}catch(_){}
};

const threshold=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+2 ? d-TAIL_SECONDS-VISUAL_EARLY_SECONDS : NaN;
};

const arm=()=>{
  clear();
  if(done||recording.paused)return;
  body.classList.add('ana-voice-isolated-r20');
  const target=threshold();
  if(!Number.isFinite(target))return;
  const t=recording.currentTime||0;
  if(t>=target){forceFinal();return;}
  timer=setTimeout(forceFinal,Math.max(80,(target-t)*1000));
};

for(const evt of ['loadedmetadata','durationchange','play','playing','seeked']){
  recording.addEventListener(evt,arm,true);
}
recording.addEventListener('pause',()=>{if(!done)clear();},true);
recording.addEventListener('timeupdate',()=>{
  if(done)return;
  const target=threshold();
  if(Number.isFinite(target)&&recording.currentTime>=target)forceFinal();
},true);
})();
