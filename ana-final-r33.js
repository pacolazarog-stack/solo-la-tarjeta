(()=>{
'use strict';
if(window.__anaFinalR33)return;
window.__anaFinalR33=true;

const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=7.4;
const EL_TO_CALOR_MS=3000;
const CALOR_HOLD_MS=1700;
const BLACK_IN_MS=1000;
const BLACK_HOLD_MS=320;
const PHOTO_READY_MS=900;
const BLACK_OUT_MS=1900;
const QUESTION_DELAY_MS=850;
const QUESTION_FADE_MS=3600;
const body=document.body;

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
const nativePulse=document.querySelector('.world .pulse-field');
if(!finalHeat||!portrait||!portraitImg||!question||!nativePulse)return;

/* R33 · una sola respiración visual de principio a fin.
   Durante la voz se usa un clon fijo del mismo pulse-field, sincronizado de fase
   con el pulso de la presentación. Sobre él crece el rojo sin cambiar el ritmo.
   Final: «el» -> pausa amplia -> «calor.» -> negro -> foto -> ?.
*/
const pulseCarrier=document.createElement('div');
pulseCarrier.id='anaPulseCarrierR33';
pulseCarrier.setAttribute('aria-hidden','true');
const pulseClone=nativePulse.cloneNode(true);
pulseClone.removeAttribute('id');
pulseClone.classList.add('ana-pulse-clone-r33');
pulseCarrier.appendChild(pulseClone);
body.appendChild(pulseCarrier);

const redCarrier=document.createElement('div');
redCarrier.id='anaRedCarrierR33';
redCarrier.setAttribute('aria-hidden','true');
const redClone=nativePulse.cloneNode(true);
redClone.removeAttribute('id');
redClone.classList.add('ana-pulse-red-r33');
redCarrier.appendChild(redClone);
body.appendChild(redCarrier);

const blackout=document.createElement('div');
blackout.id='anaBlackoutR33';
blackout.setAttribute('aria-hidden','true');
body.appendChild(blackout);

const style=document.createElement('style');
style.id='ana-final-r33-style';
style.textContent=`
/* Portador fijo: misma sístole/diástole que la presentación, por encima del mundo. */
#anaPulseCarrierR33,#anaRedCarrierR33{
  position:fixed;inset:0;z-index:7;pointer-events:none;overflow:hidden;
  opacity:0;visibility:hidden
}
body.ana-voice-r33 #anaPulseCarrierR33,
body.ana-voice-r33 #anaRedCarrierR33{visibility:visible}
#anaPulseCarrierR33>.pulse-field,#anaRedCarrierR33>.pulse-field{
  position:absolute!important;inset:0!important;display:block!important;visibility:visible!important;
  animation-play-state:running!important;filter:none!important
}
#anaPulseCarrierR33>.pulse-field::before,#anaPulseCarrierR33>.pulse-field::after,
#anaRedCarrierR33>.pulse-field::before,#anaRedCarrierR33>.pulse-field::after{
  animation-play-state:running!important
}
#anaRedCarrierR33 .ana-pulse-red-r33::before{
  background:radial-gradient(82% 66% at 50% 52%,rgba(185,54,42,.33) 0%,rgba(176,65,48,.23) 38%,rgba(143,47,42,.10) 65%,rgba(143,47,42,0) 82%)!important
}
#anaRedCarrierR33 .ana-pulse-red-r33::after{
  background:radial-gradient(94% 74% at 50% 57%,rgba(220,108,78,.20) 0%,rgba(191,76,59,.13) 42%,rgba(126,45,42,.06) 70%,rgba(126,45,42,0) 86%)!important
}

/* Las capas costosas se congelan; el latido visible vive en los portadores fijos. */
body.ana-voice-r33 .world .layer{animation-play-state:paused!important;will-change:auto!important}
body.ana-voice-r33 .world .layer::before,body.ana-voice-r33 .world .layer::after{animation-play-state:paused!important}
body.ana-voice-r33 #reading .line{filter:none!important}

/* Final legado neutralizado hasta nuestro propio tramo final. */
body.ana-voice-r33:not(.ana-final-r33) #finalHeat,
body.ana-voice-r33:not(.ana-final-r33) #finalHeat .heat-part{
  opacity:0!important;visibility:hidden!important
}
body.ana-final-r33 #finalHeat{opacity:1!important;visibility:visible!important}
body.ana-final-r33 #finalHeat .heat-part{visibility:visible!important}
body.ana-final-r33 #finalHeat .heat-el{opacity:1!important}
body.ana-final-r33:not(.ana-calor-r33) #finalHeat .heat-calor{opacity:0!important}
body.ana-final-r33.ana-calor-r33 #finalHeat .heat-calor{
  opacity:1!important;transition:opacity .9s cubic-bezier(.22,.61,.36,1)!important
}

/* Negro real, completo, antes de revelar la fotografía. */
#anaBlackoutR33{
  position:fixed;inset:0;z-index:145;pointer-events:none;background:#000;
  opacity:0;visibility:hidden
}
body.ana-black-in-r33 #anaBlackoutR33{
  visibility:visible;opacity:1;transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)
}
body.ana-black-out-r33 #anaBlackoutR33{
  visibility:visible;opacity:0;transition:opacity ${BLACK_OUT_MS}ms cubic-bezier(.22,.61,.36,1)
}
body.ana-black-in-r33 #finalHeat{
  opacity:0!important;transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r33 #anaPulseCarrierR33,
body.ana-black-in-r33 #anaRedCarrierR33{
  opacity:0!important;transition:opacity ${BLACK_IN_MS}ms ease!important
}
body.ana-black-in-r33 .voice-dialog{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .5s ease!important
}

/* Foto preparada bajo negro, sin salto. */
body.ana-photo-r33 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:120!important;pointer-events:none!important;background:#000!important;transition:none!important
}
body.ana-photo-r33 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important;transition:none!important
}
body.ana-photo-r33 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important}

/* Interrogante: nace casi invisible y gana presencia lentamente. */
body.ana-question-r33 .portrait-question{
  width:96px!important;height:96px!important;visibility:visible!important;
  pointer-events:auto!important;z-index:420!important
}
body.ana-question-r33 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important;
  animation:anaQuestionR33 2.45s ease-in-out infinite!important
}
@keyframes anaQuestionR33{
  0%,100%{transform:scale(.985)}
  18%{transform:scale(1.075)}
  34%{transform:scale(1)}
  52%{transform:scale(1.035)}
  68%{transform:scale(1)}
}

body.ana-photo-r33 .journey-nav,body.ana-photo-r33 .oras-toolbar,
body.ana-photo-r33 [data-oras-toolbar],body.ana-question-r33 .journey-nav,
body.ana-question-r33 .oras-toolbar,body.ana-question-r33 [data-oras-toolbar]{z-index:500!important;pointer-events:auto!important}
body.ana-photo-r33 .sound-toggle,body.ana-question-r33 .sound-toggle{z-index:501!important;pointer-events:auto!important}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

let redProgress=null;
let wordTimer=0,calorTimer=0,blackTimer=0,photoTimer=0,questionTimer=0,oralStopTimer=0;
let sequenceStarted=false,blackStarted=false;

const oralEnd=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+8 ? d-TAIL_SECONDS : NaN;
};
const wordTime=()=>{
  const e=oralEnd();
  return Number.isFinite(e)?Math.max(0,e-FINAL_WORD_LEAD_SECONDS):NaN;
};

function syncClonePhase(cloneRoot){
  try{
    const source=nativePulse.getAnimations({subtree:true});
    const target=cloneRoot.getAnimations({subtree:true});
    for(const ta of target){
      const tn=ta.animationName||'';
      const sa=source.find(a=>(a.animationName||'')===tn);
      if(sa&&sa.currentTime!=null)ta.currentTime=sa.currentTime;
      ta.playbackRate=1;ta.play();
    }
  }catch(_){}
}
function activateContinuousPulse(){
  syncClonePhase(pulseCarrier);
  syncClonePhase(redCarrier);
  pulseCarrier.style.visibility='visible';
  pulseCarrier.style.opacity='1';
  redCarrier.style.visibility='visible';
  redCarrier.style.opacity='0';
}
function ensureRedProgress(){
  if(redProgress)return redProgress;
  const end=oralEnd();
  const duration=Math.max(1000,(Number.isFinite(end)?end:100)*1000);
  redProgress=redCarrier.animate([{opacity:0},{opacity:.82}],{duration,easing:'linear',fill:'forwards'});
  redProgress.pause();
  return redProgress;
}
function syncRedToAudio(play){
  const a=ensureRedProgress();
  const end=oralEnd();
  if(Number.isFinite(end)&&end>0)a.currentTime=Math.min(end,recording.currentTime||0)*1000;
  play?a.play():a.pause();
}

function showOriginalHeat(){
  if(sequenceStarted)return;
  sequenceStarted=true;
  body.classList.add('ana-final-r33');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('is-burning','show-calor');
  /* «el» queda solo durante tres segundos completos. */
  calorTimer=setTimeout(()=>{
    body.classList.add('ana-calor-r33');
    finalHeat.classList.add('show-calor');
    blackTimer=setTimeout(beginBlack,CALOR_HOLD_MS);
  },EL_TO_CALOR_MS);
}

function beginBlack(){
  if(blackStarted)return;
  blackStarted=true;
  body.dataset.anaFinalDone='1';
  blackout.style.visibility='visible';
  blackout.style.opacity='0';
  void blackout.offsetWidth;
  body.classList.add('ana-black-in-r33');
  if(dialog)dialog.setAttribute('aria-hidden','true');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}

  photoTimer=setTimeout(()=>{
    portrait.hidden=false;
    portrait.removeAttribute('hidden');
    portrait.setAttribute('aria-hidden','false');
    body.classList.add('ana-photo-r33');
    /* La foto se decodifica y queda plena mientras el negro todavía la cubre. */
    setTimeout(()=>{
      body.classList.add('ana-black-out-r33');
      questionTimer=setTimeout(showQuestion,BLACK_OUT_MS+QUESTION_DELAY_MS);
    },BLACK_HOLD_MS+PHOTO_READY_MS);
  },BLACK_IN_MS);

  const end=oralEnd();
  if(Number.isFinite(end)){
    const wait=Math.max(250,(end-(recording.currentTime||0)+.12)*1000);
    oralStopTimer=setTimeout(()=>{try{recording.pause();}catch(_){}},wait);
  }
}

function showQuestion(){
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  question.style.visibility='visible';
  question.style.opacity='0.04';
  question.style.pointerEvents='none';
  question.style.transition=`opacity ${QUESTION_FADE_MS}ms cubic-bezier(.22,.61,.36,1)`;
  body.classList.add('ana-question-r33');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    question.style.opacity='1';
    setTimeout(()=>{question.style.pointerEvents='auto';},700);
  }));
}

function arm(){
  if(wordTimer){clearTimeout(wordTimer);wordTimer=0;}
  if(sequenceStarted||recording.paused)return;
  const t=wordTime();
  if(!Number.isFinite(t))return;
  const now=recording.currentTime||0;
  if(now>=t){showOriginalHeat();return;}
  wordTimer=setTimeout(showOriginalHeat,Math.max(100,(t-now)*1000));
}

function prepare(){
  if(blackStarted)return;
  body.classList.add('ana-voice-r33','voice-open');
  /* Neutraliza startFinalSequence() legado sin tocar el nodo ni su tamaño. */
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  activateContinuousPulse();
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
}
function start(){
  if(blackStarted)return;
  prepare();
  recording.muted=false;
  if(recording.volume===0)recording.volume=1;
  Promise.resolve(recording.play()).then(()=>{
    if(voicePlay)voicePlay.textContent='Pausar';
    if(status)status.textContent='';
    syncRedToAudio(true);
    arm();
  }).catch(()=>{
    if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';
    if(voicePlay)voicePlay.textContent='Activar voz';
  });
}
function toggle(){
  if(blackStarted)return;
  if(!recording.paused){
    recording.pause();syncRedToAudio(false);
    if(wordTimer){clearTimeout(wordTimer);wordTimer=0;}
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

/* El enlace ? ya abre Ceniciento en el código canónico. R33 retira la fotografía
   después de ese click para que el iframe de Ceniciento no quede oculto debajo. */
question.addEventListener('click',()=>{
  question.style.pointerEvents='none';
  setTimeout(()=>{
    portrait.style.opacity='0';
    portrait.style.visibility='hidden';
    portrait.style.pointerEvents='none';
    portrait.hidden=true;
    blackout.style.visibility='hidden';
    pulseCarrier.style.visibility='hidden';
    redCarrier.style.visibility='hidden';
  },120);
});

recording.addEventListener('loadedmetadata',()=>{ensureRedProgress();if(!recording.paused)arm();},{passive:true});
recording.addEventListener('playing',()=>{if(!blackStarted){prepare();syncRedToAudio(true);arm();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!blackStarted){syncRedToAudio(!recording.paused);if(!recording.paused)arm();}},{passive:true});
recording.addEventListener('pause',()=>{syncRedToAudio(false);if(!blackStarted&&wordTimer){clearTimeout(wordTimer);wordTimer=0;}},{passive:true});
recording.addEventListener('ended',()=>{if(!sequenceStarted)showOriginalHeat();},{once:true});
recording.addEventListener('error',()=>{
  if(blackStarted)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
