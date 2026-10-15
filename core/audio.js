import {loadState,setAudio} from './state.js';

let active=null;
let dock=null;
let unlockHandler=null;
let meta={};
let timeHandler=null;
let endedHandler=null;
let playHandler=null;
let pauseHandler=null;

const TRACKS={
  solo:'./solo-la-tarjeta-fondo.mp3',
  ana:'./elegia-breve/ana-klaudya.m4a'
};

function groupFor(id){
  if(id==='solo')return 'solo';
  if(id==='ceniciento'||id?.startsWith('ana-'))return 'ana';
  return null;
}
function icon(muted){return muted?'×':'♪';}
function formatTime(seconds){seconds=Math.max(0,Math.floor(seconds||0));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}

export function bindAudio(el){
  active=el||null;
  if(!active)return;
  const s=loadState();
  active.volume=s.audio.volume;
  active.muted=!s.audio.enabled;
}

export function toggleMute(){
  const s=loadState();
  const enabled=!s.audio.enabled;
  setAudio({enabled});
  if(active)active.muted=!enabled;
  if(enabled)tryPlay();
  syncDock();
  return enabled;
}

export function setVolume(v){
  const volume=Math.max(0,Math.min(1,Number(v)));
  setAudio({volume,enabled:volume>0});
  if(active){active.volume=volume;active.muted=volume===0;}
  if(volume>0)tryPlay();
  syncDock();
  return volume;
}

export function audioState(){return loadState().audio;}

function syncDock(){
  if(!dock)return;
  const s=loadState();
  const button=dock.querySelector('[data-audio-toggle]');
  const slider=dock.querySelector('[data-audio-range]');
  const mute=dock.querySelector('[data-audio-mute]');
  const value=dock.querySelector('[data-audio-value]');
  const play=dock.querySelector('[data-audio-play]');
  const time=dock.querySelector('[data-audio-time]');
  if(button){button.textContent=icon(!s.audio.enabled);button.setAttribute('aria-label',s.audio.enabled?'Abrir control de sonido':'Activar sonido');}
  if(slider)slider.value=String(Math.round(s.audio.volume*100));
  if(mute)mute.textContent=s.audio.enabled?'Silencio':'Activar';
  if(value)value.textContent=`${Math.round(s.audio.volume*100)}%`;
  if(play&&active)play.textContent=active.paused?'Reproducir':'Pausa';
  if(time&&active&&Number.isFinite(active.duration))time.textContent=`${formatTime(active.currentTime)} / ${formatTime(active.duration)}`;
}

function tryPlay(){
  if(!active||!loadState().audio.enabled)return Promise.resolve(false);
  return active.play().then(()=>{syncDock();return true;}).catch(()=>false);
}

function removeListeners(){
  if(!active)return;
  if(timeHandler)active.removeEventListener('timeupdate',timeHandler);
  if(endedHandler)active.removeEventListener('ended',endedHandler);
  if(playHandler)active.removeEventListener('play',playHandler);
  if(pauseHandler)active.removeEventListener('pause',pauseHandler);
  timeHandler=endedHandler=playHandler=pauseHandler=null;
}

export function clearAudioDock(){
  if(unlockHandler){document.removeEventListener('pointerdown',unlockHandler,true);document.removeEventListener('keydown',unlockHandler,true);unlockHandler=null;}
  removeListeners();
  active?.pause();
  active=null;meta={};
  dock?.remove();dock=null;
}

export function mountAudioDock(container,id,options={}){
  clearAudioDock();
  const group=groupFor(id),src=options.src||TRACKS[group];
  if(!container||!src)return null;
  meta={...options};
  const audio=document.createElement('audio');
  audio.src=src;audio.loop=options.loop!==undefined?!!options.loop:true;audio.preload='auto';
  audio.setAttribute('playsinline','');
  container.appendChild(audio);bindAudio(audio);

  dock=document.createElement('div');
  dock.className='oras-audio-dock';
  dock.innerHTML=`<div class="oras-audio-pop" data-audio-pop hidden><span class="oras-audio-label">${options.label||'Sonido'}</span><button type="button" data-audio-play>Reproducir</button><input data-audio-range type="range" min="0" max="100" step="1" orient="vertical" aria-label="Volumen"><span data-audio-value></span><span data-audio-time></span><button type="button" data-audio-mute>Silencio</button></div><button class="oras-audio-button" type="button" data-audio-toggle aria-expanded="false">♪</button>`;
  container.appendChild(dock);
  const pop=dock.querySelector('[data-audio-pop]');
  const button=dock.querySelector('[data-audio-toggle]');
  button.addEventListener('click',()=>{
    const open=pop.hidden;pop.hidden=!open;button.setAttribute('aria-expanded',String(open));
    if(!loadState().audio.enabled&&open){setAudio({enabled:true});active.muted=false;}
    syncDock();
  });
  dock.querySelector('[data-audio-range]').addEventListener('input',e=>setVolume(Number(e.target.value)/100));
  dock.querySelector('[data-audio-mute]').addEventListener('click',toggleMute);
  dock.querySelector('[data-audio-play]').addEventListener('click',()=>{
    if(!active)return;
    if(active.paused)tryPlay();else active.pause();
  });

  timeHandler=()=>{
    syncDock();
    options.onTime?.({current:active.currentTime||0,duration:Number.isFinite(active.duration)?active.duration:0,audio:active});
  };
  endedHandler=()=>{syncDock();options.onEnded?.({audio:active});};
  playHandler=pauseHandler=syncDock;
  active.addEventListener('timeupdate',timeHandler);
  active.addEventListener('ended',endedHandler);
  active.addEventListener('play',playHandler);
  active.addEventListener('pause',pauseHandler);

  unlockHandler=()=>{tryPlay();};
  document.addEventListener('pointerdown',unlockHandler,{capture:true,once:true});
  document.addEventListener('keydown',unlockHandler,{capture:true,once:true});
  syncDock();
  if(options.autoplay)queueMicrotask(tryPlay);
  return audio;
}
