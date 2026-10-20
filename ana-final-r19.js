(()=>{
'use strict';
if(window.__anaFinalR19)return;
window.__anaFinalR19=true;

const TAIL_SECONDS=12;
const VISUAL_EARLY_SECONDS=1.8;
const STOP_AFTER_REVEAL_MS=2600;
const recording=document.getElementById('recording');
const dialog=document.getElementById('voiceDialog');
const portrait=document.getElementById('portraitFinale');
const image=document.getElementById('anaPortrait');
const question=document.getElementById('cenicientoLink');
const ambient=document.getElementById('voiceMusic');
const body=document.body;
if(!recording||!portrait||!image||!question)return;

let timer=0;
let done=false;
const clear=()=>{if(timer){clearTimeout(timer);timer=0;}};

const forceFinal=()=>{
  if(done)return;
  done=true;
  clear();
  body.dataset.anaFinalDone='1';
  body.classList.add('portrait-revealed');
  body.classList.remove('voice-open','locked');

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

  /* No corta la última palabra: deja terminar la voz sobre la fotografía y
     después descarga el audio, todavía muy lejos del EOF físico de 1:52. */
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
