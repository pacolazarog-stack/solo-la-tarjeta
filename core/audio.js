import {loadState,setAudio} from './state.js';

let active=null;
let dock=null;
let unlockHandler=null;

const TRACKS={
  solo:'./solo-la-tarjeta-fondo.mp3',
  ana:'./elegia-breve/ana-klaudya.m4a'
};

function groupFor(id){return id==='solo'?'solo':id?.startsWith('ana-')?'ana':null;}
function icon(muted){return muted?'×':'♪';}

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
  syncDock();
  return enabled;
}

export function setVolume(v){
  const volume=Math.max(0,Math.min(1,Number(v)));
  setAudio({volume,enabled:volume>0});
  if(active){active.volume=volume;active.muted=volume===0;}
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
  if(button){button.textContent=icon(!s.audio.enabled);button.setAttribute('aria-label',s.audio.enabled?'Silenciar sonido':'Activar sonido');}
  if(slider)slider.value=String(Math.round(s.audio.volume*100));
  if(mute)mute.textContent=s.audio.enabled?'Silencio':'Activar';
  if(value)value.textContent=`${Math.round(s.audio.volume*100)}%`;
}

function tryPlay(){
  if(!active||!loadState().audio.enabled)return;
  active.play().catch(()=>{});
}

export function clearAudioDock(){
  if(unlockHandler){document.removeEventListener('pointerdown',unlockHandler,true);document.removeEventListener('keydown',unlockHandler,true);unlockHandler=null;}
  active?.pause();
  active=null;
  dock?.remove();
  dock=null;
}

export function mountAudioDock(container,id){
  clearAudioDock();
  const group=groupFor(id),src=TRACKS[group];
  if(!container||!src)return null;
  const audio=document.createElement('audio');
  audio.src=src;audio.loop=true;audio.preload='auto';
  container.appendChild(audio);bindAudio(audio);

  dock=document.createElement('div');
  dock.className='oras-audio-dock';
  dock.innerHTML=`<div class="oras-audio-pop" data-audio-pop hidden><input data-audio-range type="range" min="0" max="100" step="1" orient="vertical" aria-label="Volumen"><span data-audio-value></span><button type="button" data-audio-mute>Silencio</button></div><button class="oras-audio-button" type="button" data-audio-toggle aria-expanded="false">♪</button>`;
  container.appendChild(dock);
  const pop=dock.querySelector('[data-audio-pop]');
  const button=dock.querySelector('[data-audio-toggle]');
  button.addEventListener('click',()=>{
    const open=pop.hidden;pop.hidden=!open;button.setAttribute('aria-expanded',String(open));
    if(!loadState().audio.enabled&&open){setAudio({enabled:true});active.muted=false;tryPlay();}
    syncDock();
  });
  dock.querySelector('[data-audio-range]').addEventListener('input',e=>{setVolume(Number(e.target.value)/100);tryPlay();});
  dock.querySelector('[data-audio-mute]').addEventListener('click',()=>{toggleMute();if(loadState().audio.enabled)tryPlay();});

  unlockHandler=()=>{tryPlay();};
  document.addEventListener('pointerdown',unlockHandler,{capture:true,once:true});
  document.addEventListener('keydown',unlockHandler,{capture:true,once:true});
  syncDock();
  return audio;
}
