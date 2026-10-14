(()=>{
'use strict';
const ROOT='/solo-la-tarjeta/';
const VERSION='20261014-espejo-soundtrack-2';
const AUDIO_URL=ROOT+'assets/oras-espejo-centro-datos.mp3?v='+VERSION;
const FALLBACK_DURATION=138.014;

let ctx=null,buffer=null,source=null,gain=null;
let startedAt=0,elapsedBeforeStart=0,ended=false,playing=false,ticker=0,loading=null,gate=null;

const mirror=()=>document.getElementById('mirror');
const finalButton=()=>document.querySelector('.mirror-final-continue');

function remaining(){
  const duration=buffer?.duration||FALLBACK_DURATION;
  const elapsed=playing&&ctx ? elapsedBeforeStart+(ctx.currentTime-startedAt) : elapsedBeforeStart;
  return Math.max(0,duration-elapsed);
}
function formatTime(seconds){
  seconds=Math.max(0,Math.ceil(seconds));
  return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
}
function syncFinalButton(){
  const button=finalButton();
  if(!button)return;
  if(ended){
    button.disabled=false;
    button.textContent='seguir';
    button.setAttribute('aria-label','Seguir hacia EL INVENTARIO DEL AIRE');
    button.classList.remove('oras-audio-locked');
    return;
  }
  button.disabled=true;
  button.classList.add('oras-audio-locked');
  button.textContent=`espera · ${formatTime(remaining())}`;
  button.setAttribute('aria-label',`EL ESPEJO no puede atravesarse hasta que termine la música. Quedan ${Math.ceil(remaining())} segundos`);
}
function stopTicker(){
  if(ticker){clearInterval(ticker);ticker=0}
}
function startTicker(){
  stopTicker();
  syncFinalButton();
  ticker=setInterval(syncFinalButton,200);
}
function stopSource(){
  if(source){try{source.onended=null;source.stop()}catch(_){};try{source.disconnect()}catch(_){};source=null}
  playing=false;
}
async function ensureContext(){
  if(!ctx){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)throw new Error('AudioContext no disponible');
    ctx=new AC();
    gain=ctx.createGain();
    gain.gain.value=.78;
    gain.connect(ctx.destination);
  }
  if(ctx.state==='suspended')await ctx.resume();
  return ctx;
}
async function loadBuffer(){
  if(buffer)return buffer;
  if(loading)return loading;
  loading=(async()=>{
    const response=await fetch(AUDIO_URL,{cache:'force-cache'});
    if(!response.ok)throw new Error(`No se pudo cargar la música (${response.status})`);
    const data=await response.arrayBuffer();
    const c=await ensureContext();
    buffer=await c.decodeAudioData(data.slice(0));
    return buffer;
  })();
  try{return await loading}finally{loading=null}
}
function ensureGate(){
  if(gate)return gate;
  const style=document.createElement('style');
  style.id='oras-espejo-soundtrack-style';
  style.textContent=`
  .oras-espejo-audio-gate{position:fixed;z-index:2147483646;inset:0;display:grid;place-items:center;background:#080808;color:#f2ecde;font-family:Iowan Old Style,Palatino Linotype,Book Antiqua,Palatino,Georgia,serif}
  .oras-espejo-audio-gate[hidden]{display:none!important}
  .oras-espejo-audio-gate button{min-width:210px;min-height:50px;padding:13px 22px;border:1px solid rgba(242,236,222,.36);border-radius:999px;background:#080808;color:#f2ecde;font:600 .72rem/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}
  body.mirror .mirror-final-continue.oras-audio-locked{opacity:.42!important;cursor:default!important}
  `;
  document.head.appendChild(style);
  gate=document.createElement('div');
  gate.className='oras-espejo-audio-gate';
  gate.hidden=true;
  const button=document.createElement('button');
  button.type='button';
  button.textContent='iniciar EL ESPEJO';
  button.setAttribute('aria-label','Iniciar EL ESPEJO con la música');
  button.addEventListener('click',async()=>{
    button.disabled=true;
    try{
      await beginPlayback();
      gate.hidden=true;
      mirror()?.focus?.({preventScroll:true});
    }catch(_){
      button.disabled=false;
      button.textContent='reintentar';
    }
  });
  gate.append(button);
  document.body.append(gate);
  return gate;
}
function revealGate(){
  const g=ensureGate();
  g.hidden=false;
  const b=g.querySelector('button');
  if(b){b.disabled=false;b.textContent='iniciar EL ESPEJO';setTimeout(()=>b.focus(),30)}
}
async function beginPlayback(){
  ended=false;elapsedBeforeStart=0;
  stopSource();
  const b=await loadBuffer();
  const c=await ensureContext();
  source=c.createBufferSource();
  source.buffer=b;
  source.connect(gain);
  source.onended=()=>{
    if(!playing)return;
    elapsedBeforeStart=b.duration;
    playing=false;ended=true;
    source=null;
    stopTicker();
    syncFinalButton();
  };
  startedAt=c.currentTime;
  playing=true;
  source.start(0,0);
  startTicker();
}
async function startSoundtrack(){
  ended=false;elapsedBeforeStart=0;
  stopTicker();stopSource();syncFinalButton();
  try{
    await beginPlayback();
    if(gate)gate.hidden=true;
  }catch(_){
    revealGate();
  }
}
function resetSoundtrack(){
  stopTicker();stopSource();
  elapsedBeforeStart=0;ended=false;
  if(gate)gate.hidden=true;
  syncFinalButton();
}

/* Captura la salida antes del listener original de EL ESPEJO. */
document.addEventListener('click',event=>{
  const button=event.target?.closest?.('.mirror-final-continue');
  if(!button||ended)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  syncFinalButton();
},{capture:true});
document.addEventListener('keydown',event=>{
  const button=event.target?.closest?.('.mirror-final-continue');
  if(!button||ended)return;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopImmediatePropagation();syncFinalButton()}
},{capture:true});

window.addEventListener('oras:mirror-start',()=>{queueMicrotask(startSoundtrack)});
window.addEventListener('oras:mirror-reset',resetSoundtrack);

/* Acceso directo ?mirror=1: el evento puede haberse emitido antes de cargar este script. */
if(document.body.classList.contains('mirror')&&!document.getElementById('mirror')?.hidden){queueMicrotask(startSoundtrack)}
})();
