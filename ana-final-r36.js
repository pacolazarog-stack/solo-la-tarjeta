(()=>{
'use strict';
if(window.__anaFinalR36)return;
window.__anaFinalR36=true;

const body=document.body;
const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=12.5;
const EL_TO_CALOR_MS=2600;
const CALOR_HOLD_MS=4200;
const BLACK_IN_MS=3200;
const BLACK_HOLD_MS=1100;
const PHOTO_REVEAL_MS=7000;
const QUESTION_BIRTH_MS=7800;
const QUESTION_START_MS=1700;
const PULSE_MS=1850;

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
const legacyPortrait=document.getElementById('portraitFinale');
const legacyQuestion=document.getElementById('cenicientoLink');
const sourceImg=document.getElementById('anaPortrait');
if(!finalHeat||!sourceImg)return;

/* R36. Un único pulso autónomo reproduce exactamente el pulso canónico inicial
   (1,85 s y mismas fases) desde que carga ANA hasta el fundido a negro. No se
   reinicia, no depende de la voz y no se sustituye al cambiar de estado. */
const pulse=document.createElement('div');
pulse.id='anaPulseR36';
pulse.setAttribute('aria-hidden','true');
pulse.innerHTML='<i class="ana-pulse-a-r36"></i><i class="ana-pulse-b-r36"></i><i class="ana-pulse-red-r36"></i>';
body.appendChild(pulse);
const pulseRed=pulse.querySelector('.ana-pulse-red-r36');

/* Escena final completamente independiente del final legado. */
const finale=document.createElement('div');
finale.id='anaFinalStageR36';
finale.setAttribute('aria-hidden','true');
finale.innerHTML=`
  <div class="ana-final-photo-wrap-r36">
    <img class="ana-final-photo-r36" alt="" draggable="false">
    <button id="anaQuestionR36" class="ana-question-r36" type="button" aria-label="Entrar en Ceniciento">
      <span class="ana-question-beat-r36">?</span>
    </button>
  </div>`;
body.appendChild(finale);
const finalPhoto=finale.querySelector('.ana-final-photo-r36');
const question=finale.querySelector('#anaQuestionR36');
finalPhoto.src=sourceImg.currentSrc||sourceImg.src;

const style=document.createElement('style');
style.id='ana-final-r36-style';
style.textContent=`
/* El pulso canónico de ANA: mismas tres curvas de la portada. */
#anaPulseR36{position:fixed;inset:0;z-index:18;pointer-events:none;overflow:hidden;opacity:1;visibility:visible}
#anaPulseR36>i{position:absolute;inset:-10%;border-radius:50%;pointer-events:none;display:block}
#anaPulseR36:before{content:"";position:absolute;inset:0;animation:anaPulseFieldR36 ${PULSE_MS}ms linear infinite;background:transparent}
#anaPulseR36 .ana-pulse-a-r36{background:radial-gradient(82% 66% at 50% 52%,rgba(35,100,69,.30) 0%,rgba(43,106,75,.20) 38%,rgba(36,91,66,.09) 65%,rgba(36,91,66,0) 82%);animation:anaPulseAR36 ${PULSE_MS}ms ease-in-out infinite}
#anaPulseR36 .ana-pulse-b-r36{background:radial-gradient(94% 74% at 50% 57%,rgba(114,153,107,.17) 0%,rgba(65,116,85,.11) 42%,rgba(28,78,56,.05) 70%,rgba(28,78,56,0) 86%);animation:anaPulseBR36 ${PULSE_MS}ms ease-in-out infinite}
#anaPulseR36 .ana-pulse-red-r36{opacity:0;background:radial-gradient(88% 70% at 50% 54%,rgba(216,79,59,.31) 0%,rgba(186,60,50,.18) 42%,rgba(132,42,43,.08) 68%,rgba(96,28,34,0) 86%);animation:anaPulseAR36 ${PULSE_MS}ms ease-in-out infinite}
@keyframes anaPulseFieldR36{0%,100%{opacity:.42}10%{opacity:.78}18%{opacity:.47}33%{opacity:.69}44%{opacity:.45}}
@keyframes anaPulseAR36{0%,100%{opacity:.28;transform:scale(1)}10%{opacity:.66;transform:scale(1.025)}18%{opacity:.31;transform:scale(1.004)}33%{opacity:.56;transform:scale(1.018)}44%{opacity:.29;transform:scale(1)}}
@keyframes anaPulseBR36{0%,100%{opacity:.18;transform:scale(1.005)}10%{opacity:.40;transform:scale(1.035)}18%{opacity:.20;transform:scale(1.009)}33%{opacity:.34;transform:scale(1.026)}44%{opacity:.18;transform:scale(1.005)}}

/* Se elimina el pulso legado para que solo exista uno y nunca haya un relevo al activar voz. */
.world .pulse-field{opacity:0!important;visibility:hidden!important;animation:none!important}
.world .pulse-field:before,.world .pulse-field:after{animation:none!important}

/* La voz no toca el pulso. Solo alivia capas secundarias. */
body.ana-voice-r36 .world .layer-green,body.ana-voice-r36 .world .layer-deep,
body.ana-voice-r36 .world .layer-billiard,body.ana-voice-r36 .world .layer-warm,
body.ana-voice-r36 .world .grain{animation-play-state:paused!important;will-change:auto!important}

/* El final textual sigue siendo el original. */
body.ana-voice-r36:not(.ana-final-r36) #finalHeat,
body.ana-voice-r36:not(.ana-final-r36) #finalHeat .heat-part{opacity:0!important;visibility:hidden!important}
body.ana-final-r36 #finalHeat{opacity:1!important;visibility:visible!important;z-index:80!important}
body.ana-final-r36 #finalHeat .heat-part{visibility:visible!important}
body.ana-final-r36 #finalHeat .heat-el{opacity:1!important}
body.ana-final-r36:not(.ana-calor-r36) #finalHeat .heat-calor{opacity:0!important}
body.ana-final-r36.ana-calor-r36 #finalHeat .heat-calor{opacity:1!important;transition:opacity 1450ms cubic-bezier(.22,.61,.36,1)!important}

/* Desactiva por completo fotografía e interrogante legados: R36 tiene su escena propia. */
#portraitFinale,#cenicientoLink{pointer-events:none!important}
body.ana-r36-active #portraitFinale,body.ana-r36-active #cenicientoLink{display:none!important;visibility:hidden!important;opacity:0!important}

/* La escena final entra primero como negro puro. */
#anaFinalStageR36{position:fixed;inset:0;z-index:700;background:#000;opacity:0;visibility:hidden;pointer-events:none;overflow:hidden}
#anaFinalStageR36 .ana-final-photo-wrap-r36{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000}
#anaFinalStageR36 .ana-final-photo-r36{display:block;height:100%;width:100%;object-fit:contain;opacity:0;filter:none;pointer-events:none}

/* El ? nace de casi nada. El contenedor crece de forma continua; el hijo conserva el latido. */
#anaFinalStageR36 .ana-question-r36{position:absolute;left:30%;top:44%;translate:-50% -50%;width:96px;height:96px;border:0;border-radius:50%;display:grid;place-items:center;background:rgba(247,246,235,.92);color:#30271f;z-index:760;opacity:0;transform:scale(.02);filter:blur(14px);pointer-events:none;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.14);transform-origin:center}
#anaFinalStageR36 .ana-question-beat-r36{display:grid;place-items:center;width:68px;height:68px;font:500 2.15rem/1 Georgia,serif;animation:anaQuestionBeatR36 ${PULSE_MS}ms linear infinite}
@keyframes anaQuestionBeatR36{0%,100%{transform:scale(.94)}10%{transform:scale(1.08)}18%{transform:scale(.985)}33%{transform:scale(1.04)}44%{transform:scale(.96)}}

/* Navegación por encima de la escena final. */
body.ana-photo-r36 .journey-nav,body.ana-photo-r36 .oras-toolbar,body.ana-photo-r36 [data-oras-toolbar],
body.ana-photo-r36 .sound-toggle{position:fixed!important;z-index:1400!important;pointer-events:auto!important}
`;
document.head.appendChild(style);
body.classList.add('ana-r36-active');

try{
  finalPhoto.loading='eager';
  finalPhoto.decoding='async';
  finalPhoto.fetchPriority='high';
  finalPhoto.decode?.().catch(()=>{});
}catch(_){}

let redAnim=null;
let wordTimer=0,calorTimer=0,blackTimer=0,oralStopTimer=0;
let sequenceStarted=false,blackStarted=false;
const oralEnd=()=>{const d=recording.duration;return Number.isFinite(d)&&d>TAIL_SECONDS+8?d-TAIL_SECONDS:NaN};
const wordTime=()=>{const e=oralEnd();return Number.isFinite(e)?Math.max(0,e-FINAL_WORD_LEAD_SECONDS):NaN};

function ensureRedAnim(){
  if(redAnim)return redAnim;
  const end=oralEnd();
  const duration=Math.max(1000,(Number.isFinite(end)?end:100)*1000);
  redAnim=pulseRed.animate([{opacity:0},{opacity:.72}],{duration,easing:'linear',fill:'forwards'});
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
  body.classList.add('ana-voice-r36','voice-open');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  try{ambient?.pause();}catch(_){}
  try{if(dialog&&!dialog.open)dialog.show();}catch(_){try{dialog?.setAttribute('open','')}catch(__){}}
}

function showOriginalHeat(){
  if(sequenceStarted)return;
  sequenceStarted=true;
  body.classList.add('ana-final-r36');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  calorTimer=setTimeout(()=>{
    body.classList.add('ana-calor-r36');
    finalHeat.classList.add('show-calor');
    blackTimer=setTimeout(beginBlack,CALOR_HOLD_MS);
  },EL_TO_CALOR_MS);
}

function birthQuestion(){
  const frames=[
    {offset:0,opacity:0,transform:'scale(.02)',filter:'blur(14px)'},
    {offset:.24,opacity:.045,transform:'scale(.12)',filter:'blur(11px)'},
    {offset:.48,opacity:.16,transform:'scale(.30)',filter:'blur(8px)'},
    {offset:.70,opacity:.38,transform:'scale(.53)',filter:'blur(5px)'},
    {offset:.86,opacity:.68,transform:'scale(.76)',filter:'blur(2px)'},
    {offset:1,opacity:1,transform:'scale(1)',filter:'blur(0px)'}
  ];
  const a=question.animate(frames,{duration:QUESTION_BIRTH_MS,easing:'linear',fill:'forwards'});
  setTimeout(()=>{question.style.pointerEvents='auto'},Math.round(QUESTION_BIRTH_MS*.72));
  return a;
}

function beginBlack(){
  if(blackStarted)return;
  blackStarted=true;
  body.dataset.anaFinalDone='1';
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia')}catch(_){}

  finale.style.visibility='visible';
  finale.style.opacity='0';
  finale.style.transition='none';
  void finale.offsetWidth;
  finale.style.transition=`opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)`;
  finale.style.opacity='1';

  finalHeat.style.transition=`opacity ${BLACK_IN_MS}ms ease`;
  finalHeat.style.opacity='0';
  pulse.style.transition=`opacity ${BLACK_IN_MS}ms ease`;
  pulse.style.opacity='0';
  if(dialog){dialog.style.transition='opacity 700ms ease';dialog.style.opacity='0';dialog.style.pointerEvents='none'}

  setTimeout(()=>{
    body.classList.add('ana-photo-r36');
    /* Negro pleno antes de que la foto empiece a existir visualmente. */
    setTimeout(()=>{
      finalPhoto.animate([{opacity:0},{opacity:1}],{duration:PHOTO_REVEAL_MS,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
      setTimeout(birthQuestion,QUESTION_START_MS);
    },BLACK_HOLD_MS);
  },BLACK_IN_MS);

  const end=oralEnd();
  if(Number.isFinite(end)){
    const wait=Math.max(250,(end-(recording.currentTime||0)+.15)*1000);
    oralStopTimer=setTimeout(()=>{try{recording.pause()}catch(_){}},wait);
  }
}

function arm(){
  if(wordTimer){clearTimeout(wordTimer);wordTimer=0}
  if(sequenceStarted||recording.paused)return;
  const t=wordTime();
  if(!Number.isFinite(t))return;
  const now=recording.currentTime||0;
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
  if(!recording.paused){recording.pause();syncRed(false);if(wordTimer){clearTimeout(wordTimer);wordTimer=0}if(voicePlay)voicePlay.textContent='Continuar';return}
  start();
}

document.addEventListener('click',e=>{
  const t=e.target?.closest?.('#voicePlay,#voiceLaunch');
  if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  t.id==='voiceLaunch'?start():toggle();
},true);

/* Botón propio: no comparte id, hash ni listeners con el interrogante legado. */
question.addEventListener('click',e=>{
  e.preventDefault();e.stopImmediatePropagation();
  question.style.pointerEvents='none';
  window.location.replace('/solo-la-tarjeta/ceniciento/?from=ana-r36');
},true);

recording.addEventListener('loadedmetadata',()=>{ensureRedAnim();if(!recording.paused)arm()},{passive:true});
recording.addEventListener('playing',()=>{if(!blackStarted){prepare();syncRed(true);arm()}},{passive:true});
recording.addEventListener('seeked',()=>{if(!blackStarted){syncRed(!recording.paused);if(!recording.paused)arm()}},{passive:true});
recording.addEventListener('pause',()=>{syncRed(false);if(!blackStarted&&wordTimer){clearTimeout(wordTimer);wordTimer=0}},{passive:true});
recording.addEventListener('ended',()=>{if(!sequenceStarted)showOriginalHeat()},{once:true});
recording.addEventListener('error',()=>{if(blackStarted)return;if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';if(voicePlay)voicePlay.textContent='Activar voz'},{passive:true});
})();
