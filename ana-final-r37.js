(()=>{
'use strict';
if(window.__anaFinalR37)return;
window.__anaFinalR37=true;

const body=document.body;
const PULSE_MS=1850;
const TAIL_SECONDS=12;
const FINAL_WORD_LEAD_SECONDS=12.5;
const EL_TO_CALOR_MS=2600;
const CALOR_HOLD_MS=4200;
const BLACK_IN_MS=3400;
const BLACK_HOLD_MS=1200;
const PHOTO_REVEAL_MS=7200;
const QUESTION_START_MS=1800;
const QUESTION_BIRTH_MS=9200;

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
const sourceImg=document.getElementById('anaPortrait');
if(!finalHeat||!sourceImg)return;

const pulse=document.createElement('div');
pulse.id='anaPulseR37';
pulse.setAttribute('aria-hidden','true');
pulse.innerHTML='<i class="a"></i><i class="b"></i><i class="r"></i>';
body.appendChild(pulse);
const pulseRed=pulse.querySelector('.r');

const finale=document.createElement('div');
finale.id='anaFinalStageR37';
finale.setAttribute('aria-hidden','true');
finale.innerHTML=`<div class="photo-wrap"><img class="photo" alt="" draggable="false"><button id="anaQuestionR37" class="q" type="button" aria-label="Entrar en Ceniciento"><span class="beat">?</span></button></div>`;
body.appendChild(finale);
const photo=finale.querySelector('.photo');
const question=finale.querySelector('#anaQuestionR37');
photo.src=sourceImg.currentSrc||sourceImg.src;

const style=document.createElement('style');
style.textContent=`
#anaPulseR37{position:fixed;inset:0;z-index:18;pointer-events:none;overflow:hidden;opacity:1}
#anaPulseR37>i{position:absolute;inset:-10%;border-radius:50%;display:block;pointer-events:none}
#anaPulseR37 .a{background:radial-gradient(82% 66% at 50% 52%,rgba(35,100,69,.30),rgba(43,106,75,.20) 38%,rgba(36,91,66,.09) 65%,rgba(36,91,66,0) 82%);animation:pA ${PULSE_MS}ms ease-in-out infinite}
#anaPulseR37 .b{background:radial-gradient(94% 74% at 50% 57%,rgba(114,153,107,.17),rgba(65,116,85,.11) 42%,rgba(28,78,56,.05) 70%,rgba(28,78,56,0) 86%);animation:pB ${PULSE_MS}ms ease-in-out infinite}
#anaPulseR37 .r{opacity:0;background:radial-gradient(88% 70% at 50% 54%,rgba(216,79,59,.31),rgba(186,60,50,.18) 42%,rgba(132,42,43,.08) 68%,rgba(96,28,34,0) 86%);animation:pA ${PULSE_MS}ms ease-in-out infinite}
@keyframes pA{0%,100%{opacity:.28;transform:scale(1)}10%{opacity:.66;transform:scale(1.025)}18%{opacity:.31;transform:scale(1.004)}33%{opacity:.56;transform:scale(1.018)}44%{opacity:.29;transform:scale(1)}}
@keyframes pB{0%,100%{opacity:.18;transform:scale(1.005)}10%{opacity:.40;transform:scale(1.035)}18%{opacity:.20;transform:scale(1.009)}33%{opacity:.34;transform:scale(1.026)}44%{opacity:.18;transform:scale(1.005)}}
.world .pulse-field{opacity:0!important;visibility:hidden!important;animation:none!important}.world .pulse-field:before,.world .pulse-field:after{animation:none!important}
body.ana-voice-r37 .world .layer-green,body.ana-voice-r37 .world .layer-deep,body.ana-voice-r37 .world .layer-billiard,body.ana-voice-r37 .world .layer-warm,body.ana-voice-r37 .world .grain{animation-play-state:paused!important;will-change:auto!important}
body.ana-voice-r37:not(.ana-final-r37) #finalHeat,body.ana-voice-r37:not(.ana-final-r37) #finalHeat .heat-part{opacity:0!important;visibility:hidden!important}
body.ana-final-r37 #finalHeat{opacity:1!important;visibility:visible!important;z-index:80!important}
body.ana-final-r37 #finalHeat .heat-part{visibility:visible!important}
body.ana-final-r37 #finalHeat .heat-el{opacity:1!important}
body.ana-final-r37:not(.ana-calor-r37) #finalHeat .heat-calor{opacity:0!important}
body.ana-final-r37.ana-calor-r37 #finalHeat .heat-calor{opacity:1!important;transition:opacity 1450ms cubic-bezier(.22,.61,.36,1)!important}
#portraitFinale,#cenicientoLink{pointer-events:none!important}body.ana-r37-active #portraitFinale,body.ana-r37-active #cenicientoLink{display:none!important;visibility:hidden!important;opacity:0!important}
#anaFinalStageR37{position:fixed;inset:0;z-index:700;background:#000;opacity:0;visibility:hidden;pointer-events:none;overflow:hidden}
#anaFinalStageR37 .photo-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000}
#anaFinalStageR37 .photo{display:block;width:100%;height:100%;object-fit:contain;opacity:0;pointer-events:none}
#anaFinalStageR37 .q{position:absolute;left:30%;top:44%;width:96px;height:96px;margin:-48px 0 0 -48px;border:0;border-radius:50%;display:grid;place-items:center;background:rgba(247,246,235,.92);color:#30271f;z-index:760;opacity:0;transform:scale(.001);filter:blur(16px);pointer-events:none;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.14);transform-origin:50% 50%;will-change:transform,opacity,filter}
#anaFinalStageR37 .beat{display:grid;place-items:center;width:68px;height:68px;font:500 2.15rem/1 Georgia,serif;animation:qBeat ${PULSE_MS}ms linear infinite;will-change:transform}
@keyframes qBeat{0%,100%{transform:scale(.985)}10%{transform:scale(1.025)}18%{transform:scale(.995)}33%{transform:scale(1.014)}44%{transform:scale(.99)}}
body.ana-photo-r37 .journey-nav,body.ana-photo-r37 .oras-toolbar,body.ana-photo-r37 [data-oras-toolbar],body.ana-photo-r37 .sound-toggle{position:fixed!important;z-index:1400!important;pointer-events:auto!important}
`;
document.head.appendChild(style);
body.classList.add('ana-r37-active');

try{photo.loading='eager';photo.decoding='async';photo.fetchPriority='high';photo.decode?.().catch(()=>{});}catch(_){}

let redAnim=null,wordTimer=0,calorTimer=0,blackTimer=0,oralStopTimer=0;
let sequenceStarted=false,blackStarted=false;
const oralEnd=()=>{const d=recording.duration;return Number.isFinite(d)&&d>TAIL_SECONDS+8?d-TAIL_SECONDS:NaN};
const wordTime=()=>{const e=oralEnd();return Number.isFinite(e)?Math.max(0,e-FINAL_WORD_LEAD_SECONDS):NaN};

function ensureRedAnim(){if(redAnim)return redAnim;const end=oralEnd();const duration=Math.max(1000,(Number.isFinite(end)?end:100)*1000);redAnim=pulseRed.animate([{opacity:0},{opacity:.72}],{duration,easing:'linear',fill:'forwards'});redAnim.pause();return redAnim}
function syncRed(play){const a=ensureRedAnim();const end=oralEnd();if(Number.isFinite(end)&&end>0)a.currentTime=Math.min(end,recording.currentTime||0)*1000;play?a.play():a.pause()}
function prepare(){if(blackStarted)return;body.classList.add('ana-voice-r37','voice-open');finalHeat.classList.add('is-shown');finalHeat.classList.remove('show-calor','is-burning');try{ambient?.pause()}catch(_){}try{if(dialog&&!dialog.open)dialog.show()}catch(_){try{dialog?.setAttribute('open','')}catch(__){}}}
function showOriginalHeat(){if(sequenceStarted)return;sequenceStarted=true;body.classList.add('ana-final-r37');finalHeat.classList.add('is-shown');finalHeat.classList.remove('show-calor','is-burning');calorTimer=setTimeout(()=>{body.classList.add('ana-calor-r37');finalHeat.classList.add('show-calor');blackTimer=setTimeout(beginBlack,CALOR_HOLD_MS)},EL_TO_CALOR_MS)}

function birthQuestion(){
  const start=performance.now();
  const step=now=>{
    const p=Math.max(0,Math.min(1,(now-start)/QUESTION_BIRTH_MS));
    const e=p*p*(3-2*p);
    const scale=.001+(1-.001)*e;
    const opacity=Math.pow(p,1.55);
    const blur=16*(1-e);
    question.style.transform=`scale(${scale})`;
    question.style.opacity=String(opacity);
    question.style.filter=`blur(${blur}px)`;
    if(p<1){requestAnimationFrame(step)}else{question.style.transform='scale(1)';question.style.opacity='1';question.style.filter='blur(0)';question.style.pointerEvents='auto'}
  };
  requestAnimationFrame(step);
}

function beginBlack(){
  if(blackStarted)return;
  blackStarted=true;
  body.dataset.anaFinalDone='1';
  try{window.ORASReadingWindowR3?.completeAnaPart?.('elegia')}catch(_){}
  finale.style.visibility='visible';finale.style.opacity='0';finale.style.transition='none';void finale.offsetWidth;finale.style.transition=`opacity ${BLACK_IN_MS}ms cubic-bezier(.38,0,.22,1)`;finale.style.opacity='1';
  finalHeat.style.transition=`opacity ${BLACK_IN_MS}ms ease`;finalHeat.style.opacity='0';
  pulse.style.transition=`opacity ${BLACK_IN_MS}ms ease`;pulse.style.opacity='0';
  if(dialog){dialog.style.transition='opacity 900ms ease';dialog.style.opacity='0';dialog.style.pointerEvents='none'}
  setTimeout(()=>{body.classList.add('ana-photo-r37');setTimeout(()=>{photo.animate([{opacity:0},{opacity:1}],{duration:PHOTO_REVEAL_MS,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});setTimeout(birthQuestion,QUESTION_START_MS)},BLACK_HOLD_MS)},BLACK_IN_MS);
  const end=oralEnd();if(Number.isFinite(end)){const wait=Math.max(250,(end-(recording.currentTime||0)+.15)*1000);oralStopTimer=setTimeout(()=>{try{recording.pause()}catch(_){}},wait)}
}
function arm(){if(wordTimer){clearTimeout(wordTimer);wordTimer=0}if(sequenceStarted||recording.paused)return;const t=wordTime();if(!Number.isFinite(t))return;const now=recording.currentTime||0;if(now>=t){showOriginalHeat();return}wordTimer=setTimeout(showOriginalHeat,Math.max(100,(t-now)*1000))}
function start(){if(blackStarted)return;prepare();recording.muted=false;if(recording.volume===0)recording.volume=1;Promise.resolve(recording.play()).then(()=>{if(voicePlay)voicePlay.textContent='Pausar';if(status)status.textContent='';syncRed(true);arm()}).catch(()=>{if(status)status.textContent='No se ha podido iniciar la voz. Pulsa Activar voz para intentarlo de nuevo.';if(voicePlay)voicePlay.textContent='Activar voz'})}
function toggle(){if(blackStarted)return;if(!recording.paused){recording.pause();syncRed(false);if(wordTimer){clearTimeout(wordTimer);wordTimer=0}if(voicePlay)voicePlay.textContent='Continuar';return}start()}

document.addEventListener('click',e=>{const t=e.target?.closest?.('#voicePlay,#voiceLaunch');if(!t)return;e.preventDefault();e.stopImmediatePropagation();t.id==='voiceLaunch'?start():toggle()},true);
question.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(question.dataset.go==='1')return;question.dataset.go='1';question.style.pointerEvents='none';window.location.href='/solo-la-tarjeta/ceniciento/?from=ana-r37&v=20261021-r37'},true);
recording.addEventListener('loadedmetadata',()=>{ensureRedAnim();if(!recording.paused)arm()},{passive:true});
recording.addEventListener('playing',()=>{if(!blackStarted){prepare();syncRed(true);arm()}},{passive:true});
recording.addEventListener('seeked',()=>{if(!blackStarted){syncRed(!recording.paused);if(!recording.paused)arm()}},{passive:true});
recording.addEventListener('pause',()=>{syncRed(false);if(!blackStarted&&wordTimer){clearTimeout(wordTimer);wordTimer=0}},{passive:true});
recording.addEventListener('ended',()=>{if(!sequenceStarted)showOriginalHeat()},{once:true});
})();