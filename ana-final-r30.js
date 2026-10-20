(()=>{
'use strict';
if(window.__anaFinalR30)return;
window.__anaFinalR30=true;

const TAIL_SECONDS=12;
const BLACK_LEAD_SECONDS=3.4;
const BLACK_HOLD_MS=260;
const BLACK_IN_MS=1150;
const PHOTO_REVEAL_MS=1750;
const QUESTION_DELAY_MS=2050;
const body=document.body;

/* R30 · transición canónica:
   pulso nativo continuo -> «el calor.» original -> fundido a negro ->
   breve negro pleno -> aparición de la fotografía desde negro -> interrogante.
   No se crea una copia de «el calor.» y no se sustituye el pulso nativo. */
const legacy=document.getElementById('recording');
if(!legacy)return;
const recording=legacy.cloneNode(true);
legacy.replaceWith(recording);

const dialog=document.getElementById('voiceDialog');
const voicePlay=document.getElementById('voicePlay');
const voiceLaunch=document.getElementById('voiceLaunch');
const status=document.getElementById('voiceStatus');
const ambient=document.getElementById('voiceMusic');
const finalHeat=document.getElementById('finalHeat');
const portrait=document.getElementById('portraitFinale');
const portraitImg=document.getElementById('anaPortrait');
const question=document.getElementById('cenicientoLink');
if(!finalHeat||!portrait||!portraitImg||!question)return;

const blackout=document.createElement('div');
blackout.id='anaBlackoutR30';
blackout.setAttribute('aria-hidden','true');
body.appendChild(blackout);

const style=document.createElement('style');
style.id='ana-final-r30-style';
style.textContent=`
/* Durante la voz se conservan intactos el pulso nativo y su fase. */
body.ana-voice-r30 .world .layer:not(.pulse-field),
body.ana-voice-r30 .world .layer:not(.pulse-field)::before,
body.ana-voice-r30 .world .layer:not(.pulse-field)::after{
  animation:none!important;transition:none!important;filter:none!important;will-change:auto!important
}
body.ana-voice-r30 .layer-warm{animation:none!important;filter:none!important;will-change:auto!important}
body.ana-voice-r30 #reading .line{filter:none!important}

/* Un único «el calor.»: el original. */
body.ana-final-r30 #finalHeat,
body.ana-final-r30 #finalHeat .heat-part{
  opacity:1!important;visibility:visible!important
}

/* Velo negro intermedio. Empieza transparente y cubre toda la escena. */
#anaBlackoutR30{
  position:fixed;inset:0;z-index:140;pointer-events:none;background:#000;
  opacity:0;visibility:hidden;transition:none
}
body.ana-black-in-r30 #anaBlackoutR30{
  visibility:visible;opacity:1;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)
}
body.ana-photo-reveal-r30 #anaBlackoutR30{
  visibility:visible;opacity:0;
  transition:opacity ${PHOTO_REVEAL_MS}ms cubic-bezier(.22,.61,.36,1)
}

/* Mientras llega el negro, calor y pulso se disuelven orgánicamente. */
body.ana-black-in-r30 #finalHeat{
  position:relative;z-index:132;
  opacity:0!important;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r30 .world .pulse-field{
  opacity:0!important;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r30 .voice-dialog{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;
  transition:opacity .45s ease!important
}

/* La fotografía ya está preparada bajo el negro; nace únicamente al retirarse el velo. */
body.ana-photo-r30 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:120!important;pointer-events:none!important;background:#000!important;
  transition:none!important
}
body.ana-photo-r30 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important;transition:none!important
}
body.ana-photo-r30 #reading{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:none!important
}

/* El interrogante entra solo después de asentarse la foto. */
body.ana-question-r30 .portrait-question{
  width:96px!important;height:96px!important;opacity:1!important;visibility:visible!important;
  pointer-events:auto!important;z-index:420!important;
  transition:opacity .7s ease!important
}
body.ana-question-r30 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important
}

/* Navegación y sonido siempre por encima de la transición. */
body.ana-black-in-r30 .journey-nav,body.ana-black-in-r30 .oras-toolbar,
body.ana-black-in-r30 [data-oras-toolbar],body.ana-photo-r30 .journey-nav,
body.ana-photo-r30 .oras-toolbar,body.ana-photo-r30 [data-oras-toolbar],
body.ana-question-r30 .journey-nav,body.ana-question-r30 .oras-toolbar,
body.ana-question-r30 [data-oras-toolbar]{z-index:500!important;pointer-events:auto!important}
body.ana-black-in-r30 .sound-toggle,body.ana-photo-r30 .sound-toggle,
body.ana-question-r30 .sound-toggle{z-index:501!important;pointer-events:auto!important}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

let blackTimer=0;
let photoTimer=0;
let questionTimer=0;
let oralStopTimer=0;
let sequenceStarted=false;
const clearTimers=()=>{
  if(blackTimer){clearTimeout(blackTimer);blackTimer=0;}
  if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}
  if(questionTimer){clearTimeout(questionTimer);questionTimer=0;}
  if(oralStopTimer){clearTimeout(oralStopTimer);oralStopTimer=0;}
};
const oralEnd=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+8 ? d-TAIL_SECONDS : NaN;
};
const blackoutTime=()=>{
  const e=oralEnd();
  return Number.isFinite(e)?Math.max(0,e-BLACK_LEAD_SECONDS):NaN;
};

function ensureOriginalHeat(){
  body.classList.add('ana-final-r30');
  finalHeat.classList.add('is-shown','show-calor');
  finalHeat.classList.remove('is-burning');
  for(const prop of ['font-size','line-height','transform','position','left','top','display','opacity','visibility']){
    finalHeat.style.removeProperty(prop);
  }
}

function showQuestion(){
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  question.style.opacity='0';
  question.style.visibility='visible';
  question.style.pointerEvents='none';
  requestAnimationFrame(()=>{
    body.classList.add('ana-question-r30');
    question.style.opacity='1';
    question.style.pointerEvents='auto';
  });
}

function revealPhotoFromBlack(){
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  body.classList.add('ana-photo-r30');
  /* La imagen queda bajo negro pleno. Solo después retiramos el velo. */
  photoTimer=setTimeout(()=>{
    body.classList.add('ana-photo-reveal-r30');
    questionTimer=setTimeout(showQuestion,QUESTION_DELAY_MS);
  },BLACK_HOLD_MS);
}

function beginCanonicalTransition(){
  if(sequenceStarted)return;
  sequenceStarted=true;
  if(blackTimer){clearTimeout(blackTimer);blackTimer=0;}
  ensureOriginalHeat();
  body.dataset.anaFinalDone='1';

  blackout.style.visibility='visible';
  blackout.style.opacity='0';
  void blackout.offsetWidth;
  body.classList.add('ana-black-in-r30');

  if(dialog)dialog.setAttribute('aria-hidden','true');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}

  photoTimer=setTimeout(revealPhotoFromBlack,BLACK_IN_MS);

  const end=oralEnd();
  if(Number.isFinite(end)){
    const wait=Math.max(250,(end-(recording.currentTime||0)+.12)*1000);
    oralStopTimer=setTimeout(()=>{try{recording.pause();}catch(_){}},wait);
  }
}

function arm(){
  if(blackTimer){clearTimeout(blackTimer);blackTimer=0;}
  if(sequenceStarted||recording.paused)return;
  const t=blackoutTime();
  if(!Number.isFinite(t))return;
  const now=recording.currentTime||0;
  if(now>=t){beginCanonicalTransition();return;}
  blackTimer=setTimeout(beginCanonicalTransition,Math.max(100,(t-now)*1000));
}

function prepare(){
  if(sequenceStarted)return;
  body.classList.add('ana-voice-r30','voice-open');
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
}

function start(){
  if(sequenceStarted)return;
  prepare();
  recording.muted=false;
  if(recording.volume===0)recording.volume=1;
  Promise.resolve(recording.play()).then(()=>{
    if(voicePlay)voicePlay.textContent='Pausar';
    if(status)status.textContent='';
    arm();
  }).catch(()=>{
    if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';
    if(voicePlay)voicePlay.textContent='Activar voz';
  });
}
function toggle(){
  if(sequenceStarted)return;
  if(!recording.paused){
    recording.pause();
    if(blackTimer){clearTimeout(blackTimer);blackTimer=0;}
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

recording.addEventListener('loadedmetadata',()=>{if(!recording.paused)arm();},{passive:true});
recording.addEventListener('playing',()=>{if(!sequenceStarted){prepare();arm();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!sequenceStarted&&!recording.paused)arm();},{passive:true});
recording.addEventListener('pause',()=>{if(!sequenceStarted&&blackTimer){clearTimeout(blackTimer);blackTimer=0;}},{passive:true});
recording.addEventListener('ended',()=>{if(!sequenceStarted)beginCanonicalTransition();},{once:true});
recording.addEventListener('error',()=>{
  if(sequenceStarted)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
