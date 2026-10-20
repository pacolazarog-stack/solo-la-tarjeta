(()=>{
'use strict';
if(window.__anaFinalR32)return;
window.__anaFinalR32=true;

const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=5.2;
const WORD_HOLD_MS=1750;
const BLACK_IN_MS=1450;
const BLACK_HOLD_MS=420;
const PHOTO_REVEAL_MS=2400;
const QUESTION_FADE_MS=3200;
const QUESTION_DELAY_MS=1050;
const body=document.body;

/* R32 · norma canónica visual:
   - Un único latido continuo desde la presentación hasta el fundido final.
   - Al comenzar la voz NO cambia el ritmo; se conserva el pulse-field original.
   - El mismo latido se va tornando rojo mediante una segunda piel sincronizada en fase.
   - El «el calor.» original culmina el recorrido.
   - Negro real antes de la foto; la fotografía nace desde negro.
   - El interrogante gana presencia progresivamente sobre la fotografía.
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
const world=document.querySelector('.world');
const nativePulse=document.querySelector('.world .pulse-field');
if(!finalHeat||!portrait||!portraitImg||!question||!world||!nativePulse)return;

/* Segunda piel del MISMO latido. Se sincroniza con el pulse-field nativo y solo
   aporta progresivamente el rojo; nunca sustituye el latido original. */
const redPulseWrap=document.createElement('div');
redPulseWrap.id='anaRedPulseWrapR32';
redPulseWrap.setAttribute('aria-hidden','true');
const redPulse=nativePulse.cloneNode(true);
redPulse.classList.add('ana-red-pulse-r32');
redPulse.removeAttribute('id');
redPulseWrap.appendChild(redPulse);
world.appendChild(redPulseWrap);

const blackout=document.createElement('div');
blackout.id='anaBlackoutR32';
blackout.setAttribute('aria-hidden','true');
body.appendChild(blackout);

const style=document.createElement('style');
style.id='ana-final-r32-style';
style.textContent=`
/* La voz no cambia la fisiología del latido. */
body.ana-voice-r32 .world .pulse-field{
  display:block!important;visibility:visible!important;animation-play-state:running!important
}
body.ana-voice-r32 .world .pulse-field::before,
body.ana-voice-r32 .world .pulse-field::after{
  animation-play-state:running!important
}

/* Se congelan las capas costosas, pero NO el latido. */
body.ana-voice-r32 .world .layer:not(.pulse-field),
body.ana-voice-r32 .world .layer:not(.pulse-field)::before,
body.ana-voice-r32 .world .layer:not(.pulse-field)::after{
  animation:none!important;transition:none!important;filter:none!important;will-change:auto!important
}
body.ana-voice-r32 .layer-warm{animation:none!important;filter:none!important;will-change:auto!important}
body.ana-voice-r32 #reading .line{filter:none!important}

/* Segunda piel roja: exactamente las mismas pulsaciones, sin filtros caros. */
#anaRedPulseWrapR32{
  position:absolute;inset:0;z-index:4;pointer-events:none;opacity:0
}
#anaRedPulseWrapR32 .ana-red-pulse-r32{filter:none!important}
#anaRedPulseWrapR32 .ana-red-pulse-r32::before{
  background:radial-gradient(82% 66% at 50% 52%,
    rgba(178,52,41,.34) 0%,rgba(173,61,46,.23) 38%,rgba(145,48,43,.10) 65%,rgba(145,48,43,0) 82%)!important
}
#anaRedPulseWrapR32 .ana-red-pulse-r32::after{
  background:radial-gradient(94% 74% at 50% 57%,
    rgba(214,103,74,.20) 0%,rgba(188,73,58,.13) 42%,rgba(122,44,42,.06) 70%,rgba(122,44,42,0) 86%)!important
}

/* El final legado queda neutralizado visualmente hasta nuestro tramo final. */
body.ana-voice-r32:not(.ana-final-r32) #finalHeat,
body.ana-voice-r32:not(.ana-final-r32) #finalHeat .heat-part{
  opacity:0!important;visibility:hidden!important
}

/* El MISMO «el calor.» original aparece; no hay copia ni cambio de tamaño. */
body.ana-final-r32 #finalHeat{
  opacity:1!important;visibility:visible!important;
  transition:opacity .72s cubic-bezier(.22,.61,.36,1)!important
}
body.ana-final-r32 #finalHeat .heat-part{visibility:visible!important}
body.ana-final-r32 #finalHeat .heat-el{opacity:1!important}
body.ana-final-r32:not(.ana-calor-r32) #finalHeat .heat-calor{opacity:0!important}
body.ana-final-r32.ana-calor-r32 #finalHeat .heat-calor{
  opacity:1!important;transition:opacity .62s cubic-bezier(.22,.61,.36,1)!important
}

/* Negro real previo a la foto. El pulso no se apaga: simplemente queda cubierto por el negro. */
#anaBlackoutR32{
  position:fixed;inset:0;z-index:145;pointer-events:none;background:#000;
  opacity:0;visibility:hidden;transition:none
}
body.ana-black-in-r32 #anaBlackoutR32{
  visibility:visible;opacity:1;
  transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)
}
body.ana-photo-reveal-r32 #anaBlackoutR32{
  visibility:visible;opacity:0;
  transition:opacity ${PHOTO_REVEAL_MS}ms cubic-bezier(.22,.61,.36,1)
}
body.ana-black-in-r32 #finalHeat{
  opacity:0!important;transition:opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)!important
}
body.ana-black-in-r32 .voice-dialog{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;
  transition:opacity .5s ease!important
}

/* Foto preparada bajo negro: no salta, se revela al retirarse el velo. */
body.ana-photo-r32 .portrait-finale{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:120!important;pointer-events:none!important;background:#000!important;transition:none!important
}
body.ana-photo-r32 .portrait-finale img{
  display:block!important;visibility:visible!important;opacity:1!important;
  filter:none!important;pointer-events:none!important;transition:none!important
}
body.ana-photo-r32 #reading{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:none!important
}

/* El interrogante no aparece: se revela. */
body.ana-question-r32 .portrait-question{
  width:96px!important;height:96px!important;visibility:visible!important;pointer-events:auto!important;
  z-index:420!important;opacity:1!important;
  transition:opacity ${QUESTION_FADE_MS}ms cubic-bezier(.22,.61,.36,1)!important
}
body.ana-question-r32 .portrait-question .question-beat{
  width:68px!important;height:68px!important;font-size:2.15rem!important;
  animation:anaQuestionR32 2.45s ease-in-out infinite!important
}
@keyframes anaQuestionR32{
  0%,100%{transform:scale(.985)}
  18%{transform:scale(1.075)}
  34%{transform:scale(1)}
  52%{transform:scale(1.035)}
  68%{transform:scale(1)}
}

/* Navegación y sonido por encima de negro/foto. */
body.ana-black-in-r32 .journey-nav,body.ana-black-in-r32 .oras-toolbar,
body.ana-black-in-r32 [data-oras-toolbar],body.ana-photo-r32 .journey-nav,
body.ana-photo-r32 .oras-toolbar,body.ana-photo-r32 [data-oras-toolbar],
body.ana-question-r32 .journey-nav,body.ana-question-r32 .oras-toolbar,
body.ana-question-r32 [data-oras-toolbar]{z-index:500!important;pointer-events:auto!important}
body.ana-black-in-r32 .sound-toggle,body.ana-photo-r32 .sound-toggle,
body.ana-question-r32 .sound-toggle{z-index:501!important;pointer-events:auto!important}
`;
document.head.appendChild(style);

try{
  portraitImg.loading='eager';
  portraitImg.decoding='async';
  portraitImg.setAttribute('fetchpriority','high');
  portraitImg.decode?.().catch(()=>{});
}catch(_){}

/* Sincronizar la piel roja con la fase exacta del latido que ya estaba corriendo. */
function syncRedPulsePhase(){
  try{
    const source=nativePulse.getAnimations({subtree:true});
    const target=redPulseWrap.getAnimations({subtree:true});
    for(const ta of target){
      const name=ta.animationName||ta.effect?.target?.getAnimations?.()[0]?.animationName;
      const sa=source.find(a=>(a.animationName||'')===name);
      if(sa && sa.currentTime!=null)ta.currentTime=sa.currentTime;
      ta.playbackRate=1;
      ta.play();
    }
  }catch(_){}
}
requestAnimationFrame(syncRedPulsePhase);

let heatAnimation=null;
function ensureHeatAnimation(){
  if(heatAnimation)return heatAnimation;
  const end=oralEnd();
  const duration=Math.max(1000,(Number.isFinite(end)?end:100)*1000);
  heatAnimation=redPulseWrap.animate([{opacity:0},{opacity:.92}],{
    duration,easing:'linear',fill:'forwards'
  });
  heatAnimation.pause();
  return heatAnimation;
}
function syncHeatToAudio(play=false){
  const a=ensureHeatAnimation();
  const end=oralEnd();
  if(Number.isFinite(end)&&end>0){
    a.currentTime=Math.min(end,recording.currentTime||0)*1000;
  }
  if(play)a.play(); else a.pause();
}

let wordTimer=0,blackTimer=0,photoTimer=0,questionTimer=0,oralStopTimer=0;
let sequenceStarted=false,blackStarted=false;
const clearTimer=(name)=>{
  const id={wordTimer,blackTimer,photoTimer,questionTimer,oralStopTimer}[name];
  if(id)clearTimeout(id);
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
  body.classList.add('ana-final-r32');
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('is-burning','show-calor');
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      body.classList.add('ana-calor-r32');
      finalHeat.classList.add('show-calor');
    },520);
  });
  blackTimer=setTimeout(beginBlack,WORD_HOLD_MS);
}

function showQuestion(){
  question.hidden=false;
  question.removeAttribute('hidden');
  question.setAttribute('aria-hidden','false');
  question.style.opacity='0.02';
  question.style.visibility='visible';
  question.style.pointerEvents='none';
  question.style.removeProperty('transition');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    body.classList.add('ana-question-r32');
    question.style.removeProperty('opacity');
    question.style.pointerEvents='auto';
  }));
}

function revealPhotoFromBlack(){
  portrait.hidden=false;
  portrait.removeAttribute('hidden');
  portrait.setAttribute('aria-hidden','false');
  body.classList.add('ana-photo-r32');
  photoTimer=setTimeout(()=>{
    body.classList.add('ana-photo-reveal-r32');
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
  body.classList.add('ana-black-in-r32');
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
  body.classList.add('ana-voice-r32','voice-open');
  /* Evita que revealLines() lance el final legado. */
  finalHeat.classList.add('is-shown');
  finalHeat.classList.remove('show-calor','is-burning');
  syncRedPulsePhase();
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
    syncHeatToAudio(true);
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
    syncHeatToAudio(false);
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

recording.addEventListener('loadedmetadata',()=>{ensureHeatAnimation();if(!recording.paused)arm();},{passive:true});
recording.addEventListener('playing',()=>{if(!blackStarted){prepare();syncHeatToAudio(true);arm();}},{passive:true});
recording.addEventListener('seeked',()=>{if(!blackStarted){syncHeatToAudio(!recording.paused);if(!recording.paused)arm();}},{passive:true});
recording.addEventListener('pause',()=>{syncHeatToAudio(false);if(!blackStarted&&wordTimer){clearTimeout(wordTimer);wordTimer=0;}},{passive:true});
recording.addEventListener('ended',()=>{syncHeatToAudio(false);if(!sequenceStarted)showOriginalHeat();},{once:true});
recording.addEventListener('error',()=>{
  if(blackStarted)return;
  if(status)status.textContent='No se ha podido cargar el audio. Pulsa Activar voz para volver a intentarlo.';
  if(voicePlay)voicePlay.textContent='Activar voz';
},{passive:true});
})();
