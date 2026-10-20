(()=>{
'use strict';
if(window.__anaFinalR35)return;
window.__anaFinalR35=true;

const body=document.body;
const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=12.5;
const EL_TO_CALOR_MS=2600;
const CALOR_HOLD_MS=4200;
const BLACK_IN_MS=2200;
const BLACK_HOLD_MS=1200;
const PHOTO_REVEAL_MS=5000;
const QUESTION_DELAY_MS=1100;
const QUESTION_BIRTH_MS=6000;

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

/* R35 · norma canónica:
   - Pulso fisiológico autónomo y persistente durante TODA ANA, también con voz.
   - Viraje gradual verde -> rojo sin cambiar el ritmo.
   - «el» -> «calor.» -> respiración -> fundido REAL a negro -> foto emergiendo desde negro.
   - El interrogante nace: opacidad + escala + nitidez progresivas mientras palpita.
   - ? navega directamente a CENICIENTO, sin quedar oculto tras ANA.
*/

const pulse=document.createElement('div');
pulse.id='anaPulseR35';
pulse.setAttribute('aria-hidden','true');
pulse.innerHTML='<div class="ana-pulse-green-r35"></div><div class="ana-pulse-red-r35"></div>';
body.appendChild(pulse);
const pulseRed=pulse.querySelector('.ana-pulse-red-r35');

const blackout=document.createElement('div');
blackout.id='anaBlackoutR35';
blackout.setAttribute('aria-hidden','true');
body.appendChild(blackout);

const style=document.createElement('style');
style.id='ana-final-r35-style';
style.textContent=`
#anaPulseR35{
  position:fixed;inset:0;z-index:17;pointer-events:none;overflow:hidden;
  opacity:0;visibility:visible;transition:opacity 900ms ease
}
#anaPulseR35>div{
  position:absolute;left:50%;top:52%;width:118vw;height:92vh;
  transform:translate(-50%,-50%) scale(.94);border-radius:50%;
  animation:anaHeartR35 2.45s cubic-bezier(.36,.05,.26,1) infinite;
  will-change:transform,opacity
}
.ana-pulse-green-r35{
  opacity:.28;
  background:radial-gradient(ellipse at center,
    rgba(158,221,184,.32) 0%,rgba(111,184,146,.18) 42%,rgba(55,124,91,.07) 68%,rgba(35,87,63,0) 84%)
}
.ana-pulse-red-r35{
  opacity:0;
  background:radial-gradient(ellipse at center,
    rgba(232,104,79,.34) 0%,rgba(194,70,55,.20) 42%,rgba(135,46,43,.08) 68%,rgba(92,29,33,0) 84%)
}
@keyframes anaHeartR35{
  0%   {transform:translate(-50%,-50%) scale(.945);opacity:.70}
  10%  {transform:translate(-50%,-50%) scale(1.035);opacity:1}
  18%  {transform:translate(-50%,-50%) scale(.985);opacity:.86}
  30%  {transform:translate(-50%,-50%) scale(1.012);opacity:.94}
  42%  {transform:translate(-50%,-50%) scale(.972);opacity:.80}
  72%  {transform:translate(-50%,-50%) scale(.945);opacity:.70}
  100% {transform:translate(-50%,-50%) scale(.945);opacity:.70}
}

/* Al empezar la voz no se reinicia ni se sustituye el latido: R35 ya estaba corriendo. */
body.ana-voice-r35 #anaPulseR35{opacity:1}
body.ana-voice-r35 .world .pulse-field{animation-play-state:running!important}
body.ana-voice-r35 .world .pulse-field::before,
body.ana-voice-r35 .world .pulse-field::after{animation-play-state:running!important}

/* Solo se alivian capas secundarias; nunca el pulso. */
body.ana-voice-r35 .world .layer-green,
body.ana-voice-r35 .world .layer-deep,
body.ana-voice-r35 .world .layer-billiard,
body.ana-voice-r35 .world .layer-warm,
body.ana-voice-r35 .world .grain{animation-play-state:paused!important;will-change:auto!important}

/* Final legado neutralizado hasta nuestra propia secuencia. */
body.ana-voice-r35:not(.ana-final-r35) #finalHeat,
body.ana-voice-r35:not(.ana-final-r35) #finalHeat .heat-part{opacity:0!important;visibility:hidden!important}
body.ana-final-r35 #finalHeat{opacity:1!important;visibility:visible!important;z-index:70!important}
body.ana-final-r35 #finalHeat .heat-part{visibility:visible!important}
body.ana-final-r35 #finalHeat .heat-el{opacity:1!important}
body.ana-final-r35:not(.ana-calor-r35) #finalHeat .heat-calor{opacity:0!important}
body.ana-final-r35.ana-calor-r35 #finalHeat .heat-calor{
  opacity:1!important;transition:opacity 1450ms cubic-bezier(.22,.61,.36,1)!important
}

#anaBlackoutR35{
  position:fixed;inset:0;z-index:240;pointer-events:none;background:#000;
  opacity:0;visibility:hidden
}

/* Foto preparada siempre DEBAJO del negro. */
body.ana-photo-r35 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:200!important;pointer-events:none!important;background:#000!important
}
body.ana-photo-r35 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important
}
body.ana-photo-r35 #reading{opacity:0!important;visibility:hidden!important;pointer-events:none!important}

/* El interrogante nace, no aparece. El palpito está en el hijo para no interferir con escala de nacimiento. */
body.ana-photo-r35 .portrait-question{
  display:flex!important;visibility:visible!important;opacity:.01!important;
  transform:scale(.34)!important;filter:blur(7px)!important;
  transform-origin:center center!important;pointer-events:none!important;
  width:96px!important;height:96px!important;z-index:720!important;
  transition:opacity ${QUESTION_BIRTH_MS}ms cubic-bezier(.22,.61,.36,1),
             transform ${QUESTION_BIRTH_MS}ms cubic-bezier(.16,.84,.3,1),
             filter ${QUESTION_BIRTH_MS}ms ease!important
}
body.ana-question-r35 .portrait-question{
  opacity:1!important;transform:scale(1)!important;filter:blur(0)!important
}
body.ana-photo-r35 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important;
  animation:anaQuestionHeartR35 2.45s cubic-bezier(.36,.05,.26,1) infinite!important
}
@keyframes anaQuestionHeartR35{
  0%{transform:scale(.96)}10%{transform:scale(1.08)}18%{transform:scale(.995)}
  30%{transform:scale(1.035)}42%{transform:scale(.985)}72%,100%{transform:scale(.96)}
}

/* Botonera por encima de todo y siempre clicable. */
body.ana-photo-r35 .journey-nav,body.ana-photo-r35 .oras-toolbar,
body.ana-photo-r35 [data-oras-toolbar],body.ana-question-r35 .journey-nav,
body.ana-question-r35 .oras-toolbar,body.ana-question-r35 [data-oras-toolbar],
body.ana-photo-r35 .sound-toggle,body.ana-question-r35 .sound-toggle{
  position:fixed!important;z-index:1200!important;pointer-events:auto!important
}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

let redAnim=null;
let wordTimer=0,calorTimer=0,blackTimer=0,photoTimer=0,questionTimer=0,oralStopTimer=0;
let sequenceStarted=false,blackStarted=false;

const oralEnd=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+8?d-TAIL_SECONDS:NaN;
};
const wordTime=()=>{
  const e=oralEnd();
  return Number.isFinite(e)?Math.max(0,e-FINAL_WORD_LEAD_SECONDS):NaN;
};

function ensureRedAnim(){
  if(redAnim)return redAnim;
  const end=oralEnd();
  const duration=Math.max(1000,(Number.isFinite(end)?end:100)*1000);
  redAnim=pulseRed.animate([{opacity:0},{opacity:.68}],{duration,easing:'linear',fill:'forwards'});
  redAnim.pause();
  return redAnim;
}
function syncRed(play){
  const a=ensureRedAnim();
  const end=oralEnd();
  if(Number.isFinite(end)&&end>0)a.currentTime=Math.min(end,recording.currentTime||0)*1000;
  play?a.play():a.pause();
}

function prepare(){
  if(blackStarted)return;
  body.classList.add('ana-voice-r35','voice-open');
  pulse.style.opacity='1';
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','');}catch(__){}}
}

function showOriginalHeat(){
  if(sequenceStarted)return;
  sequenceStarted=true;
  body.classList.add('ana-final-r35');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  calorTimer=setTimeout(()=>{
    body.classList.add('ana-calor-r35');
    finalHeat.classList.add('show-calor');
    blackTimer=setTimeout(beginBlack,CALOR_HOLD_MS);
  },EL_TO_CALOR_MS);
}

function beginBlack(){
  if(blackStarted)return;
  blackStarted=true;
  body.dataset.anaFinalDone='1';
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia');}catch(_){}

  /* Fundido real a negro: propiedades inline para que ningún CSS legado lo anule. */
  blackout.style.visibility='visible';
  blackout.style.opacity='0';
  blackout.style.transition='none';
  void blackout.offsetWidth;
  blackout.style.transition=`opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)`;
  blackout.style.opacity='1';
  finalHeat.style.transition=`opacity ${BLACK_IN_MS}ms ease`;
  finalHeat.style.opacity='0';
  pulse.style.transition=`opacity ${BLACK_IN_MS}ms ease`;
  pulse.style.opacity='0';
  if(dialog){dialog.style.transition='opacity 700ms ease';dialog.style.opacity='0';dialog.style.pointerEvents='none';}

  photoTimer=setTimeout(()=>{
    /* Solo cuando el negro ya es pleno se monta la foto debajo. */
    portrait.hidden=false;
    portrait.removeAttribute('hidden');
    portrait.setAttribute('aria-hidden','false');
    question.hidden=false;
    question.removeAttribute('hidden');
    question.setAttribute('aria-hidden','false');
    body.classList.add('ana-photo-r35');

    setTimeout(()=>{
      blackout.style.transition=`opacity ${PHOTO_REVEAL_MS}ms cubic-bezier(.22,.61,.36,1)`;
      blackout.style.opacity='0';
      questionTimer=setTimeout(()=>{
        body.classList.add('ana-question-r35');
        /* Se habilita al final del nacimiento, no al principio. */
        setTimeout(()=>{question.style.pointerEvents='auto';},QUESTION_BIRTH_MS*.72);
      },QUESTION_DELAY_MS);
    },BLACK_HOLD_MS);
  },BLACK_IN_MS+80);

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

function start(){
  if(blackStarted)return;
  prepare();
  recording.muted=false;
  if(recording.volume===0)recording.volume=1;
  Promise.resolve(recording.play()).then(()=>{
    if(voicePlay)voicePlay.textContent='Pausar';
    if(status)status.textContent='';
    syncRed(true);arm();
  }).catch(()=>{
    if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';
    if(voicePlay)voicePlay.textContent='Activar voz';
  });
}
function toggle(){
  if(blackStarted)return;
  if(!recording.paused){
    recording.pause();syncRed(false);
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

/* Enlace inequívoco y funcional: CENICIENTO como página real, no hash que pueda quedar detrás de ANA. */
question.addEventListener('click',e=>{
  e.preventDefault();e.stopImmediatePropagation();
  window.location.assign('/solo-la-tarjeta/ceniciento/');
},true);

recording.addEventListener('loadedmetadata',()=>{ensureRedAnim();if(!recording.paused)arm();},{passive:true});
recording.addEventListener('playing',()=>{if(!blackStarted){prepare();syncRed(true);arm();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!blackStarted){syncRed(!recording.paused);if(!recording.paused)arm();}},{passive:true});
recording.addEventListener('pause',()=>{syncRed(false);if(!blackStarted&&wordTimer){clearTimeout(wordTimer);wordTimer=0;}},{passive:true});
recording.addEventListener('ended',()=>{if(!sequenceStarted)showOriginalHeat();},{once:true});
recording.addEventListener('error',()=>{
  if(blackStarted)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
