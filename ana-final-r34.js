(()=>{
'use strict';
if(window.__anaFinalR34)return;
window.__anaFinalR34=true;

const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=10.8;
const EL_TO_CALOR_MS=3300;
const CALOR_HOLD_MS=3400;
const BLACK_IN_MS=1800;
const BLACK_HOLD_MS=850;
const PHOTO_REVEAL_MS=4200;
const QUESTION_DELAY_MS=1500;
const QUESTION_FADE_MS=5200;
const body=document.body;

/* R34 · norma canónica ANA
   1) Se conserva EL MISMO pulse-field nativo de la presentación durante toda la voz.
   2) El color vira gradualmente al rojo sin cambiar el ritmo del latido.
   3) «el» -> pausa amplia -> «calor.» -> permanencia -> negro lento -> foto lenta.
   4) El interrogante nace casi invisible, palpita mientras gana presencia y abre CENICIENTO.
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
const nativePulse=document.querySelector('.world .pulse-field');
if(!finalHeat||!portrait||!portraitImg||!question||!nativePulse)return;

const redWash=document.createElement('div');
redWash.id='anaRedWashR34';
redWash.setAttribute('aria-hidden','true');
body.appendChild(redWash);

const blackout=document.createElement('div');
blackout.id='anaBlackoutR34';
blackout.setAttribute('aria-hidden','true');
body.appendChild(blackout);

const style=document.createElement('style');
style.id='ana-final-r34-style';
style.textContent=`
/* EL LATIDO NATIVO ES EL ÚNICO MOTOR. No se clona ni se sustituye. */
body.ana-voice-r34 .world .pulse-field{
  position:fixed!important;inset:0!important;z-index:18!important;
  display:block!important;visibility:visible!important;opacity:1;
  animation-play-state:running!important;pointer-events:none!important
}
body.ana-voice-r34 .world .pulse-field::before,
body.ana-voice-r34 .world .pulse-field::after{
  animation-play-state:running!important
}
/* Solo se congelan las capas que no son el pulso. */
body.ana-voice-r34 .world .layer-green,
body.ana-voice-r34 .world .layer-deep,
body.ana-voice-r34 .world .layer-billiard,
body.ana-voice-r34 .world .layer-warm,
body.ana-voice-r34 .world .grain{
  animation-play-state:paused!important;will-change:auto!important
}
body.ana-voice-r34 #reading .line{filter:none!important}

/* Velo cromático: cambia el color, no la fisiología del pulso. */
#anaRedWashR34{
  position:fixed;inset:0;z-index:19;pointer-events:none;opacity:0;visibility:hidden;
  background:
    radial-gradient(82% 66% at 50% 54%,rgba(201,66,50,.24),rgba(165,48,43,.12) 52%,transparent 82%),
    linear-gradient(rgba(145,45,39,.08),rgba(174,55,43,.13));
}
body.ana-voice-r34 #anaRedWashR34{visibility:visible}

/* Neutralizamos el final antiguo sin alterar el nodo original. */
body.ana-voice-r34:not(.ana-final-r34) #finalHeat,
body.ana-voice-r34:not(.ana-final-r34) #finalHeat .heat-part{
  opacity:0!important;visibility:hidden!important
}
body.ana-final-r34 #finalHeat{
  opacity:1!important;visibility:visible!important;z-index:40!important
}
body.ana-final-r34 #finalHeat .heat-part{visibility:visible!important}
body.ana-final-r34 #finalHeat .heat-el{opacity:1!important}
body.ana-final-r34:not(.ana-calor-r34) #finalHeat .heat-calor{opacity:0!important}
body.ana-final-r34.ana-calor-r34 #finalHeat .heat-calor{
  opacity:1!important;transition:opacity 1.35s cubic-bezier(.22,.61,.36,1)!important
}

/* Negro lento y pleno antes de la fotografía. */
#anaBlackoutR34{
  position:fixed;inset:0;z-index:220;pointer-events:none;background:#000;
  opacity:0;visibility:hidden
}
body.ana-black-in-r34 #anaBlackoutR34{
  visibility:visible;opacity:1;transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)
}
body.ana-black-out-r34 #anaBlackoutR34{
  visibility:visible;opacity:0;transition:opacity ${PHOTO_REVEAL_MS}ms cubic-bezier(.22,.61,.36,1)
}
body.ana-black-in-r34 #finalHeat{
  opacity:0!important;transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r34 .voice-dialog{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .7s ease!important
}

/* La foto está debajo del negro; nunca aparece mediante corte. */
body.ana-photo-r34 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:180!important;pointer-events:none!important;background:#000!important;transition:none!important
}
body.ana-photo-r34 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important;transition:none!important
}
body.ana-photo-r34 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important}

/* El ? permanece inicialmente casi ausente. */
body.ana-photo-r34 .portrait-question{
  visibility:visible!important;opacity:.015!important;pointer-events:none!important;
  width:96px!important;height:96px!important;z-index:620!important;
  transition:opacity ${QUESTION_FADE_MS}ms cubic-bezier(.22,.61,.36,1)!important
}
body.ana-question-r34 .portrait-question{
  visibility:visible!important;opacity:1!important;pointer-events:auto!important
}
body.ana-photo-r34 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important;
  animation:anaQuestionHeartbeatR34 2.45s ease-in-out infinite!important
}
@keyframes anaQuestionHeartbeatR34{
  0%,100%{transform:scale(.965)}
  11%{transform:scale(1.08)}
  19%{transform:scale(.995)}
  34%{transform:scale(1.035)}
  43%{transform:scale(.985)}
  72%{transform:scale(.965)}
}

/* Botonera siempre utilizable. */
body.ana-photo-r34 .journey-nav,
body.ana-photo-r34 .oras-toolbar,
body.ana-photo-r34 [data-oras-toolbar],
body.ana-question-r34 .journey-nav,
body.ana-question-r34 .oras-toolbar,
body.ana-question-r34 [data-oras-toolbar]{z-index:900!important;pointer-events:auto!important}
body.ana-photo-r34 .sound-toggle,body.ana-question-r34 .sound-toggle{
  z-index:901!important;pointer-events:auto!important
}

/* Al entrar en CENICIENTO se retira físicamente toda la escena de ANA. */
body.ana-ceniciento-r34 .portrait-finale,
body.ana-ceniciento-r34 #anaBlackoutR34,
body.ana-ceniciento-r34 #anaRedWashR34,
body.ana-ceniciento-r34 .portrait-question{
  display:none!important;visibility:hidden!important;pointer-events:none!important
}
body.ana-ceniciento-r34 .world .pulse-field{visibility:hidden!important}
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

function ensureRedProgress(){
  if(redProgress)return redProgress;
  const end=oralEnd();
  const duration=Math.max(1000,(Number.isFinite(end)?end:100)*1000);
  redProgress=redWash.animate([{opacity:0},{opacity:.82}],{duration,easing:'linear',fill:'forwards'});
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
  body.classList.add('ana-final-r34');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('is-burning','show-calor');
  calorTimer=setTimeout(()=>{
    body.classList.add('ana-calor-r34');
    finalHeat.classList.add('show-calor');
    blackTimer=setTimeout(beginBlack,CALOR_HOLD_MS);
  },EL_TO_CALOR_MS);
}

function showQuestion(){
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  /* La clase cambia .015 -> 1 y la transición de 5,2 s hace visible el nacimiento. */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    body.classList.add('ana-question-r34');
  }));
}

function revealPhotoUnderBlack(){
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  body.classList.add('ana-photo-r34');

  setTimeout(()=>{
    body.classList.add('ana-black-out-r34');
    /* El interrogante comienza a nacer mientras la foto todavía emerge del negro. */
    questionTimer=setTimeout(showQuestion,QUESTION_DELAY_MS);
  },BLACK_HOLD_MS);
}

function beginBlack(){
  if(blackStarted)return;
  blackStarted=true;
  body.dataset.anaFinalDone='1';
  blackout.style.visibility='visible';
  blackout.style.opacity='0';
  void blackout.offsetWidth;
  body.classList.add('ana-black-in-r34');
  if(dialog)dialog.setAttribute('aria-hidden','true');
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}

  photoTimer=setTimeout(revealPhotoUnderBlack,BLACK_IN_MS);

  const end=oralEnd();
  if(Number.isFinite(end)){
    const wait=Math.max(250,(end-(recording.currentTime||0)+.15)*1000);
    oralStopTimer=setTimeout(()=>{try{recording.pause();}catch(_){}},wait);
  }
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
  body.classList.add('ana-voice-r34','voice-open');
  /* Impide que revealLines() dispare el final legado. */
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  redWash.style.visibility='visible';
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

/* No anulamos el handler canónico del ?. Solo retiramos ANA DESPUÉS de que ese handler
   abra CENICIENTO. La clase !important vence las reglas de fotografía anteriores. */
question.addEventListener('click',()=>{
  setTimeout(()=>body.classList.add('ana-ceniciento-r34'),80);
},false);

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
