(()=>{
'use strict';
const ROOT='/solo-la-tarjeta/';
const VERSION='20261014-espejo-soundtrack-3';
const AUDIO_URL=ROOT+'assets/oras-el-espejo-centro-de-datos.m4a?v='+VERSION;
const FALLBACK_DURATION=138.014;

let ctx=null,buffer=null,source=null,gain=null;
let startedAt=0,elapsedBeforeStart=0,ended=false,playing=false,ticker=0,loading=null;
let panel=null,toggle=null,range=null,value=null;

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
function syncPanel(){
  ensurePanel();
  panel.hidden=!document.body.classList.contains('mirror');
  if(toggle){
    toggle.textContent=playing?'Pausa':(elapsedBeforeStart>0&&!ended?'Reanudar':'Activar sonido');
    toggle.setAttribute('aria-pressed',playing?'true':'false');
  }
}
function stopTicker(){if(ticker){clearInterval(ticker);ticker=0}}
function startTicker(){stopTicker();syncFinalButton();syncPanel();ticker=setInterval(()=>{syncFinalButton();syncPanel()},200)}
function stopSource(keepPosition=true){
  if(playing&&ctx&&keepPosition)elapsedBeforeStart=Math.min(buffer?.duration||FALLBACK_DURATION,elapsedBeforeStart+(ctx.currentTime-startedAt));
  if(source){try{source.onended=null;source.stop()}catch(_){};try{source.disconnect()}catch(_){};source=null}
  playing=false;
  syncPanel();
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
function ensurePanel(){
  if(panel)return panel;
  const style=document.createElement('style');
  style.id='oras-espejo-soundtrack-style';
  style.textContent=`
  .oras-espejo-sound{position:fixed;z-index:2147483646;left:max(18px,env(safe-area-inset-left));top:max(18px,env(safe-area-inset-top));display:grid;grid-template-columns:auto minmax(110px,180px) auto;align-items:center;gap:10px;padding:9px 12px;border:1px solid rgba(242,236,222,.22);border-radius:14px;background:rgba(8,8,8,.62);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#f2ecde;font:600 .62rem/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 8px 28px rgba(0,0,0,.28)}
  .oras-espejo-sound[hidden]{display:none!important}
  .oras-espejo-sound button{border:0;background:transparent;color:#f2ecde;padding:4px 2px;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}
  .oras-espejo-sound input[type=range]{width:100%;accent-color:#ead6b7}
  .oras-espejo-sound output{min-width:34px;text-align:right;color:rgba(242,236,222,.72)}
  body.mirror .mirror-final-continue.oras-audio-locked{opacity:.42!important;cursor:default!important}
  @media(max-width:700px){.oras-espejo-sound{left:max(10px,env(safe-area-inset-left));top:max(10px,env(safe-area-inset-top));grid-template-columns:auto 96px auto;gap:7px;padding:7px 9px;font-size:.56rem}}
  `;
  document.head.appendChild(style);
  panel=document.createElement('div');
  panel.className='oras-espejo-sound';
  panel.hidden=true;
  toggle=document.createElement('button');
  toggle.type='button';toggle.textContent='Activar sonido';toggle.setAttribute('aria-label','Activar o pausar la música de EL ESPEJO');
  range=document.createElement('input');
  range.type='range';range.min='0';range.max='100';range.step='1';range.value='78';range.setAttribute('aria-label','Volumen de EL ESPEJO');
  value=document.createElement('output');value.textContent='78 %';
  range.addEventListener('input',()=>{const v=Number(range.value)/100;if(gain)gain.gain.value=v;value.textContent=`${range.value} %`});
  toggle.addEventListener('click',async()=>{
    try{
      if(playing){stopSource(true);stopTicker();syncFinalButton();return}
      await beginPlayback(elapsedBeforeStart||0);
    }catch(_){toggle.textContent='Reintentar sonido'}
  });
  panel.append(toggle,range,value);
  document.body.append(panel);
  return panel;
}
async function beginPlayback(offset=0){
  ended=false;
  stopSource(false);
  const b=await loadBuffer();
  const c=await ensureContext();
  elapsedBeforeStart=Math.max(0,Math.min(offset,b.duration-.05));
  source=c.createBufferSource();source.buffer=b;source.connect(gain);
  source.onended=()=>{
    if(!playing)return;
    elapsedBeforeStart=b.duration;playing=false;ended=true;source=null;stopTicker();syncFinalButton();syncPanel();
  };
  startedAt=c.currentTime;playing=true;source.start(0,elapsedBeforeStart);startTicker();
}
async function startSoundtrack(){
  ensurePanel();panel.hidden=false;
  ended=false;elapsedBeforeStart=0;stopTicker();stopSource(false);syncFinalButton();
  try{await beginPlayback(0)}catch(_){syncPanel()}
}
function resetSoundtrack(){
  stopTicker();stopSource(false);elapsedBeforeStart=0;ended=false;if(panel)panel.hidden=true;syncFinalButton();
}

/* Impide atravesar EL ESPEJO mientras la banda sonora no haya terminado. */
document.addEventListener('click',event=>{
  const button=event.target?.closest?.('.mirror-final-continue');
  if(!button||ended)return;
  event.preventDefault();event.stopImmediatePropagation();syncFinalButton();
},{capture:true});
document.addEventListener('keydown',event=>{
  const button=event.target?.closest?.('.mirror-final-continue');
  if(!button||ended)return;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopImmediatePropagation();syncFinalButton()}
},{capture:true});

window.addEventListener('oras:mirror-start',()=>{queueMicrotask(startSoundtrack)});
window.addEventListener('oras:mirror-reset',resetSoundtrack);
new MutationObserver(syncPanel).observe(document.body,{attributes:true,attributeFilter:['class']});
ensurePanel();syncPanel();

/* Acceso directo ?mirror=1: EL ESPEJO puede haberse iniciado desde el propio módulo. */
setTimeout(()=>{if(document.body.classList.contains('mirror')&&!document.getElementById('mirror')?.hidden&&!playing)startSoundtrack()},80);
})();
