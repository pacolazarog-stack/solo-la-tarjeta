(()=>{
'use strict';
if(window.__anaFinalR18)return;
window.__anaFinalR18=true;

const TAIL_SECONDS=12;
const EARLY_SECONDS=.9;
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
  Object.assign(image.style,{display:'block',opacity:'1',visibility:'visible',transition:'opacity 1.4s ease-in-out'});
  question.hidden=false;
  question.removeAttribute('hidden');
  Object.assign(question.style,{opacity:'1',visibility:'visible',pointerEvents:'auto',transition:'none'});

  /* Retira la reproducción mucho antes del EOF real del archivo acolchado. */
  setTimeout(()=>{
    try{recording.pause();}catch(_){}
    try{recording.removeAttribute('src');recording.load();}catch(_){}
    try{ambient?.pause();}catch(_){}
  },250);

  try{window.ORASReadingWindowR2?.completeAnaPart?.('elegia');}catch(_){}
};

const arm=()=>{
  clear();
  if(done||recording.paused)return;
  const d=recording.duration;
  const t=recording.currentTime||0;
  if(!Number.isFinite(d)||d<=TAIL_SECONDS+1)return;
  const spokenEnd=d-TAIL_SECONDS;
  const wait=Math.max(120,(spokenEnd-t-EARLY_SECONDS)*1000);
  timer=setTimeout(forceFinal,wait);
};

recording.addEventListener('loadedmetadata',arm,true);
recording.addEventListener('durationchange',arm,true);
recording.addEventListener('play',arm,true);
recording.addEventListener('playing',arm,true);
recording.addEventListener('seeked',arm,true);
recording.addEventListener('pause',()=>{if(!done)clear();},true);

/* Respaldo puntual, sin setInterval continuo. */
recording.addEventListener('timeupdate',()=>{
  if(done)return;
  const d=recording.duration;
  if(!Number.isFinite(d)||d<=TAIL_SECONDS+1)return;
  if(recording.currentTime>=d-TAIL_SECONDS-EARLY_SECONDS)forceFinal();
},true);
})();
