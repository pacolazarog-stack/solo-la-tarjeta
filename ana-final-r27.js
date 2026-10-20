(()=>{
'use strict';
if(window.__anaFinalR27)return;
window.__anaFinalR27=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=2.0;
const WORD_LEAD_SECONDS=2.8;
const body=document.body;

/* R27 · secuencia canónica:
   lectura/voz + pulso amplio -> «el calor.» completo -> transición suave a foto
   -> interrogante visible -> navegación siempre operativa.
   Se mantiene congelado el motor visual antiguo también durante la fotografía. */
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
pulse.id='anaPulseR27';
pulse.setAttribute('aria-hidden','true');
body.appendChild(pulse);

const finalWord=document.createElement('div');
finalWord.id='anaFinalWordR27';
finalWord.setAttribute('aria-hidden','true');
finalWord.innerHTML='<span>el</span><span>calor.</span>';
body.appendChild(finalWord);

const style=document.createElement('style');
style.id='ana-final-r27-style';
style.textContent=`
@keyframes anaPulseR27{
  0%,100%{opacity:.22;transform:translate3d(-50%,-50%,0) scale(.88)}
  48%{opacity:.64;transform:translate3d(-50%,-50%,0) scale(1.10)}
}
@keyframes anaQuestionR27{
  0%,100%{transform:scale(.96)}
  18%{transform:scale(1.14)}
  36%{transform:scale(1.00)}
  52%{transform:scale(1.08)}
  68%{transform:scale(1.00)}
}
#anaPulseR27{
  display:none;position:fixed;left:50%;top:50%;width:min(82vw,1120px);height:min(70vh,720px);
  z-index:6;pointer-events:none;border-radius:50%;opacity:0;
  background:radial-gradient(ellipse at center,rgba(27,102,67,.38) 0%,rgba(44,111,76,.22) 43%,rgba(33,91,64,.08) 66%,rgba(33,91,64,0) 84%);
  transform:translate3d(-50%,-50%,0);will-change:transform,opacity
}
body.ana-voice-r27 #anaPulseR27{display:block;animation:anaPulseR27 1.85s ease-in-out infinite}
body.ana-photo-r27 #anaPulseR27{animation:none!important;opacity:0!important;transition:opacity .7s ease}

/* Congelación estable del motor antiguo: se conserva durante la foto. */
body.ana-voice-r27 .world .layer,body.ana-voice-r27 .world .layer::before,body.ana-voice-r27 .world .layer::after,
body.ana-photo-r27 .world .layer,body.ana-photo-r27 .world .layer::before,body.ana-photo-r27 .world .layer::after{
  animation:none!important;transition:none!important;filter:none!important;will-change:auto!important
}
body.ana-voice-r27 .world .pulse-field,body.ana-photo-r27 .world .pulse-field{opacity:0!important}
body.ana-voice-r27 .layer-warm,body.ana-photo-r27 .layer-warm{opacity:0!important}
body.ana-photo-r27 .world{visibility:hidden!important}

body.ana-voice-r27 #reading{display:block!important;visibility:visible!important;opacity:1!important}
body.ana-voice-r27 #reading .line{animation:none!important;transition:none!important;filter:none!important}
body.ana-voice-r27 #finalHeat,body.ana-voice-r27 .heat-final,body.ana-voice-r27 .heat-part{
  animation:none!important;transition:none!important;filter:none!important
}

#anaFinalWordR27{
  position:fixed;left:50%;top:50%;z-index:115;display:grid;justify-items:center;pointer-events:none;
  transform:translate(-50%,-50%);opacity:0;visibility:hidden;color:#e89372;
  font:500 clamp(2.5rem,6.2vw,5.2rem)/.82 Georgia,'Times New Roman',serif;
  text-shadow:0 1px 18px rgba(95,42,24,.18);transition:opacity .55s ease,visibility 0s linear .55s
}
#anaFinalWordR27 span+span{margin-top:-.08em}
body.ana-final-word-r27 #anaFinalWordR27{opacity:1;visibility:visible;transition:opacity .55s ease}
body.ana-photo-r27 #anaFinalWordR27{opacity:0;visibility:hidden;transition:opacity .8s ease,visibility 0s linear .8s}

body.ana-photo-r27 .portrait-finale{
  display:block!important;opacity:1!important;visibility:visible!important;z-index:120!important;
  pointer-events:none!important;transition:opacity 1.45s ease!important;background:#1b1711!important
}
body.ana-photo-r27 .portrait-finale img{
  display:block!important;opacity:1!important;visibility:visible!important;filter:none!important;
  transition:opacity 1.45s ease!important;pointer-events:none!important
}
body.ana-photo-r27 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .9s ease!important}
body.ana-photo-r27 .voice-dialog{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .35s ease!important}
body.ana-photo-r27 .portrait-question{
  width:96px!important;height:96px!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;
  z-index:126!important;transition:opacity .7s ease .9s!important
}
body.ana-photo-r27 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important;transform:none;
  animation:anaQuestionR27 1.85s ease-in-out infinite!important
}
body.ana-photo-r27 .journey-nav,body.ana-photo-r27 .oras-toolbar,
body.ana-photo-r27 [data-oras-toolbar]{z-index:400!important;pointer-events:auto!important}
body.ana-photo-r27 .sound-toggle{z-index:401!important;pointer-events:auto!important}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

let wordTimer=0;
let photoTimer=0;
let oralStopTimer=0;
let photoDone=false;
let wordShown=false;
const clearTimers=()=>{
  if(wordTimer){clearTimeout(wordTimer);wordTimer=0;}
  if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}
  if(oralStopTimer){clearTimeout(oralStopTimer);oralStopTimer=0;}
};
const oralEnd=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+8 ? d-TAIL_SECONDS : NaN;
};
const photoTime=()=>{
  const e=oralEnd();
  return Number.isFinite(e)?Math.max(0,e-PHOTO_EARLY_SECONDS):NaN;
};
const wordTime=()=>{
  const p=photoTime();
  return Number.isFinite(p)?Math.max(0,p-WORD_LEAD_SECONDS):NaN;
};

function showFinalWord(){
  if(photoDone||wordShown)return;
  wordShown=true;
  body.classList.add('ana-final-word-r27');
  /* Garantiza la palabra completa, no una transición interrumpida del bloque legado. */
  if(finalHeat){finalHeat.style.opacity='0';finalHeat.style.visibility='hidden';finalHeat.classList.remove('is-burning');}
}

function showPhoto(){
  if(photoDone)return;
  photoDone=true;
  if(wordTimer){clearTimeout(wordTimer);wordTimer=0;}
  if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}
  body.dataset.anaFinalDone='1';
  body.classList.remove('voice-open','locked');
  body.classList.add('ana-photo-r27');
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  if(dialog)dialog.setAttribute('aria-hidden','true');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}
  /* La voz termina completa en el punto oral, pero nunca alcanza el EOF físico con cola. */
  const end=oralEnd();
  if(Number.isFinite(end)){
    const wait=Math.max(250,(end-(recording.currentTime||0)+.15)*1000);
    oralStopTimer=setTimeout(()=>{try{recording.pause();}catch(_){}},wait);
  }
}

function armSequence(){
  clearTimers();
  if(photoDone||recording.paused)return;
  const now=recording.currentTime||0;
  const wt=wordTime();
  const pt=photoTime();
  if(Number.isFinite(wt)){
    if(now>=wt)showFinalWord();
    else wordTimer=setTimeout(showFinalWord,Math.max(100,(wt-now)*1000));
  }
  if(Number.isFinite(pt)){
    if(now>=pt)showPhoto();
    else photoTimer=setTimeout(showPhoto,Math.max(100,(pt-now)*1000));
  }
}

function prepare(){
  if(photoDone)return;
  body.classList.add('ana-voice-r27','voice-open');
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
    armSequence();
  }).catch(()=>{
    if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';
    if(voicePlay)voicePlay.textContent='Activar voz';
  });
}
function toggle(){
  if(photoDone)return;
  if(!recording.paused){
    recording.pause();clearTimers();
    if(voicePlay)voicePlay.textContent='Continuar';
    return;
  }
  start();
}

document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  t.id==='voiceLaunch'?start():toggle();
},true);

recording.addEventListener('loadedmetadata',()=>{if(!recording.paused)armSequence();},{passive:true});
recording.addEventListener('playing',()=>{if(!photoDone){prepare();armSequence();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!photoDone&&!recording.paused)armSequence();},{passive:true});
recording.addEventListener('pause',()=>{if(!photoDone)clearTimers();},{passive:true});
recording.addEventListener('ended',()=>{if(!photoDone){showFinalWord();setTimeout(showPhoto,900);}},{once:true});
recording.addEventListener('error',()=>{
  if(photoDone)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
