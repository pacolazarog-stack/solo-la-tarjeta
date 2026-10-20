(()=>{
'use strict';
if(window.__anaFinalR31)return;
window.__anaFinalR31=true;

const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=4.3;
const WORD_HOLD_MS=1350;
const BLACK_IN_MS=1200;
const BLACK_HOLD_MS=300;
const PHOTO_REVEAL_MS=1800;
const QUESTION_DELAY_MS=2150;
const body=document.body;

/* R31 · final canónico estable.
   - El pulso nativo NO se sustituye ni se reinicia al comenzar la voz.
   - Se neutraliza el startFinalSequence legado marcando #finalHeat como ya revelado,
     pero manteniéndolo oculto hasta nuestro propio tramo final.
   - Se usa el mismo #finalHeat original: el -> calor. -> negro -> foto -> ?
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

const blackout=document.createElement('div');
blackout.id='anaBlackoutR31';
blackout.setAttribute('aria-hidden','true');
body.appendChild(blackout);

const style=document.createElement('style');
style.id='ana-final-r31-style';
style.textContent=`
/* Durante la voz se congela todo lo pesado EXCEPTO el pulse-field nativo. */
body.ana-voice-r31 .world .layer:not(.pulse-field),
body.ana-voice-r31 .world .layer:not(.pulse-field)::before,
body.ana-voice-r31 .world .layer:not(.pulse-field)::after{
  animation:none!important;transition:none!important;filter:none!important;will-change:auto!important
}
body.ana-voice-r31 .layer-warm{animation:none!important;filter:none!important;will-change:auto!important}
body.ana-voice-r31 #reading .line{filter:none!important}

/* Neutralización visual del final legado: #finalHeat ya lleva is-shown para que
   revealLines() no invoque startFinalSequence(), pero permanece invisible hasta r31. */
body.ana-voice-r31:not(.ana-final-r31) #finalHeat,
body.ana-voice-r31:not(.ana-final-r31) #finalHeat .heat-part{
  opacity:0!important;visibility:hidden!important
}

/* El MISMO calor original aparece sin cambio de tamaño ni nodo duplicado. */
body.ana-final-r31 #finalHeat{
  opacity:1!important;visibility:visible!important;
  transition:opacity .72s cubic-bezier(.22,.61,.36,1)!important
}
body.ana-final-r31 #finalHeat .heat-part{
  opacity:1!important;visibility:visible!important
}

#anaBlackoutR31{
  position:fixed;inset:0;z-index:140;pointer-events:none;background:#000;
  opacity:0;visibility:hidden;transition:none
}
body.ana-black-in-r31 #anaBlackoutR31{
  visibility:visible;opacity:1;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)
}
body.ana-photo-reveal-r31 #anaBlackoutR31{
  visibility:visible;opacity:0;
  transition:opacity ${PHOTO_REVEAL_MS}ms cubic-bezier(.22,.61,.36,1)
}

/* El pulso sigue vivo hasta que empieza a cerrarse el negro. */
body.ana-black-in-r31 .world .pulse-field{
  opacity:0!important;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r31 #finalHeat{
  opacity:0!important;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r31 .voice-dialog{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;
  transition:opacity .45s ease!important
}

body.ana-photo-r31 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:120!important;pointer-events:none!important;background:#000!important;
  transition:none!important
}
body.ana-photo-r31 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important;transition:none!important
}
body.ana-photo-r31 #reading{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:none!important
}
body.ana-question-r31 .portrait-question{
  width:96px!important;height:96px!important;opacity:1!important;visibility:visible!important;
  pointer-events:auto!important;z-index:420!important;transition:opacity .7s ease!important
}
body.ana-question-r31 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important
}

body.ana-black-in-r31 .journey-nav,body.ana-black-in-r31 .oras-toolbar,
body.ana-black-in-r31 [data-oras-toolbar],body.ana-photo-r31 .journey-nav,
body.ana-photo-r31 .oras-toolbar,body.ana-photo-r31 [data-oras-toolbar],
body.ana-question-r31 .journey-nav,body.ana-question-r31 .oras-toolbar,
body.ana-question-r31 [data-oras-toolbar]{z-index:500!important;pointer-events:auto!important}
body.ana-black-in-r31 .sound-toggle,body.ana-photo-r31 .sound-toggle,
body.ana-question-r31 .sound-toggle{z-index:501!important;pointer-events:auto!important}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

let wordTimer=0, blackTimer=0, photoTimer=0, questionTimer=0, oralStopTimer=0;
let sequenceStarted=false, blackStarted=false;
const clearTimers=()=>{
  for(const [name,id] of [['wordTimer',wordTimer],['blackTimer',blackTimer],['photoTimer',photoTimer],['questionTimer',questionTimer],['oralStopTimer',oralStopTimer]]){
    if(id)clearTimeout(id);
  }
  wordTimer=blackTimer=photoTimer=questionTimer=oralStopTimer=0;
};
const oralEnd=()=>{
  const d=recording.duration;
  return Number.isFinite(d)&&d>TAIL_SECONDS+8 ? d-TAIL_SECONDS : NaN;
};
const wordTime=()=>{
  const e=oralEnd();
  return Number.isFinite(e)?Math.max(0,e-FINAL_WORD_LEAD_SECONDS):NaN;
};

function showOriginalHeat(){
  if(sequenceStarted)return;
  sequenceStarted=true;
  body.classList.add('ana-final-r31');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('is-burning','show-calor');
  /* Primero queda visible el «el» original. */
  requestAnimationFrame(()=>{
    setTimeout(()=>finalHeat.classList.add('show-calor'),420);
  });
  blackTimer=setTimeout(beginBlack,WORD_HOLD_MS);
}

function showQuestion(){
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  question.style.opacity='0';
  question.style.visibility='visible';
  question.style.pointerEvents='none';
  requestAnimationFrame(()=>{
    body.classList.add('ana-question-r31');
    question.style.opacity='1';
    question.style.pointerEvents='auto';
  });
}

function revealPhotoFromBlack(){
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  body.classList.add('ana-photo-r31');
  photoTimer=setTimeout(()=>{
    body.classList.add('ana-photo-reveal-r31');
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
  body.classList.add('ana-black-in-r31');
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
  body.classList.add('ana-voice-r31','voice-open');
  /* Clave: impedir que el revealLines legado dispare startFinalSequence cuando llegue a «el». */
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
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
    arm();
  }).catch(()=>{
    if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';
    if(voicePlay)voicePlay.textContent='Activar voz';
  });
}
function toggle(){
  if(blackStarted)return;
  if(!recording.paused){
    recording.pause();
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

recording.addEventListener('loadedmetadata',()=>{if(!recording.paused)arm();},{passive:true});
recording.addEventListener('playing',()=>{if(!blackStarted){prepare();arm();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!blackStarted&&!recording.paused)arm();},{passive:true});
recording.addEventListener('pause',()=>{if(!blackStarted&&wordTimer){clearTimeout(wordTimer);wordTimer=0;}},{passive:true});
recording.addEventListener('ended',()=>{if(!sequenceStarted)showOriginalHeat();},{once:true});
recording.addEventListener('error',()=>{
  if(blackStarted)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
