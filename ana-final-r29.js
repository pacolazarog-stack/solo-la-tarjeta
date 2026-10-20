(()=>{
'use strict';
if(window.__anaFinalR29)return;
window.__anaFinalR29=true;

const TAIL_SECONDS=12;
const PHOTO_EARLY_SECONDS=1.6;
const body=document.body;

/* R29 · continuidad canónica.
   1) El latido no cambia al comenzar la voz: se conserva el pulse-field nativo,
      exactamente el mismo que funciona antes de pulsar Voz.
   2) No se reescribe «el calor.»: se usa el nodo original #finalHeat, con su
      tipografía/tamaño/posición originales.
   3) Foto, calor y latido se solapan en un fundido continuo; después aparece ?.
*/
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

const style=document.createElement('style');
style.id='ana-final-r29-style';
style.textContent=`
/* Durante la voz se congelan todas las capas pesadas EXCEPTO el latido nativo.
   Así el pulso conserva exactamente la sístole/diástole de la lectura inicial. */
body.ana-voice-r29 .world .layer:not(.pulse-field),
body.ana-voice-r29 .world .layer:not(.pulse-field)::before,
body.ana-voice-r29 .world .layer:not(.pulse-field)::after{
  animation:none!important;transition:none!important;filter:none!important;will-change:auto!important
}
body.ana-voice-r29 .layer-warm{animation:none!important;filter:none!important;will-change:auto!important}
body.ana-voice-r29 #reading .line{filter:none!important}

/* El calor original es el único calor: no hay copia ni cambio tipográfico. */
body.ana-final-r29 #finalHeat{
  opacity:1!important;visibility:visible!important;
}
body.ana-final-r29 #finalHeat .heat-part{
  opacity:1!important;visibility:visible!important;
}

/* Inicio del fundido: la fotografía entra detrás del mismo «el calor.». */
body.ana-transition-r29 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:120!important;pointer-events:none!important;
  transition:opacity 2.4s cubic-bezier(.22,.61,.36,1)!important;
  background:#1b1711!important
}
body.ana-transition-r29 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important;
  transition:opacity 2.4s cubic-bezier(.22,.61,.36,1)!important
}
body.ana-transition-r29 #finalHeat{
  position:relative;z-index:125;
  opacity:0!important;
  transition:opacity 2.25s cubic-bezier(.22,.61,.36,1)!important
}
body.ana-transition-r29 .world .pulse-field{
  opacity:0!important;
  transition:opacity 2.1s ease!important;
}
body.ana-transition-r29 .voice-dialog{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;
  transition:opacity .55s ease!important
}

/* Interrogante: aparece DESPUÉS de que la foto ya esté asentada. */
body.ana-question-r29 .portrait-question{
  width:96px!important;height:96px!important;
  opacity:1!important;visibility:visible!important;pointer-events:auto!important;
  z-index:420!important;transition:opacity .7s ease!important
}
body.ana-question-r29 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important;
}

/* Navegación siempre utilizable durante y después del fundido. */
body.ana-transition-r29 .journey-nav,body.ana-transition-r29 .oras-toolbar,
body.ana-transition-r29 [data-oras-toolbar],body.ana-question-r29 .journey-nav,
body.ana-question-r29 .oras-toolbar,body.ana-question-r29 [data-oras-toolbar]{
  z-index:500!important;pointer-events:auto!important
}
body.ana-transition-r29 .sound-toggle,body.ana-question-r29 .sound-toggle{
  z-index:501!important;pointer-events:auto!important
}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

let photoTimer=0;
let questionTimer=0;
let oralStopTimer=0;
let transitioned=false;
const clearTimers=()=>{
  if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}
  if(questionTimer){clearTimeout(questionTimer);questionTimer=0;}
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

function ensureOriginalHeat(){
  body.classList.add('ana-final-r29');
  finalHeat.classList.add('is-shown','show-calor');
  finalHeat.classList.remove('is-burning');
  finalHeat.style.removeProperty('font-size');
  finalHeat.style.removeProperty('line-height');
  finalHeat.style.removeProperty('transform');
  finalHeat.style.removeProperty('position');
  finalHeat.style.removeProperty('left');
  finalHeat.style.removeProperty('top');
  finalHeat.style.removeProperty('display');
  finalHeat.style.removeProperty('opacity');
  finalHeat.style.removeProperty('visibility');
}

function beginPhotoTransition(){
  if(transitioned)return;
  transitioned=true;
  if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}
  ensureOriginalHeat();
  body.dataset.anaFinalDone='1';

  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  /* Partimos realmente de 0 para que exista evolución y no salto. */
  portrait.style.display='block';
  portrait.style.visibility='visible';
  portrait.style.opacity='0';
  portraitImg.style.opacity='0';
  void portrait.offsetWidth;
  body.classList.add('ana-transition-r29');
  portrait.style.opacity='1';
  portraitImg.style.opacity='1';

  if(dialog)dialog.setAttribute('aria-hidden','true');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}

  /* El interrogante llega cuando foto/calor ya han realizado el fundido. */
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  question.style.opacity='0';
  question.style.visibility='visible';
  question.style.pointerEvents='none';
  questionTimer=setTimeout(()=>{
    body.classList.add('ana-question-r29');
    question.style.opacity='1';
    question.style.pointerEvents='auto';
  },2450);

  /* La voz termina en su final oral, no en el EOF de la cola técnica. */
  const end=oralEnd();
  if(Number.isFinite(end)){
    const wait=Math.max(250,(end-(recording.currentTime||0)+.12)*1000);
    oralStopTimer=setTimeout(()=>{try{recording.pause();}catch(_){}},wait);
  }
}

function arm(){
  if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}
  if(transitioned||recording.paused)return;
  const t=photoTime();
  if(!Number.isFinite(t))return;
  const now=recording.currentTime||0;
  if(now>=t){beginPhotoTransition();return;}
  photoTimer=setTimeout(beginPhotoTransition,Math.max(100,(t-now)*1000));
}

function prepare(){
  if(transitioned)return;
  body.classList.add('ana-voice-r29','voice-open');
  /* No sustituimos el pulso: el nativo sigue corriendo sin reinicio de fase. */
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
}

function start(){
  if(transitioned)return;
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
  if(transitioned)return;
  if(!recording.paused){recording.pause();if(photoTimer){clearTimeout(photoTimer);photoTimer=0;}if(voicePlay)voicePlay.textContent='Continuar';return;}
  start();
}

document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  t.id==='voiceLaunch'?start():toggle();
},true);

recording.addEventListener('loadedmetadata',()=>{if(!recording.paused)arm();},{passive:true});
recording.addEventListener('playing',()=>{if(!transitioned){prepare();arm();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!transitioned&&!recording.paused)arm();},{passive:true});
recording.addEventListener('pause',()=>{if(!transitioned&&photoTimer){clearTimeout(photoTimer);photoTimer=0;}},{passive:true});
recording.addEventListener('ended',()=>{if(!transitioned)beginPhotoTransition();},{once:true});
recording.addEventListener('error',()=>{
  if(transitioned)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
