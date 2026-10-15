import {loadState,setAudio} from './state.js';

let active=null;
export function bindAudio(el){active=el||null;if(!active)return;const s=loadState();active.volume=s.audio.volume;active.muted=!s.audio.enabled;}
export function toggleMute(){const s=loadState();const enabled=!s.audio.enabled;setAudio({enabled});if(active)active.muted=!enabled;return enabled;}
export function setVolume(v){const volume=Math.max(0,Math.min(1,Number(v)));setAudio({volume,enabled:volume>0});if(active){active.volume=volume;active.muted=volume===0;}return volume;}
export function audioState(){return loadState().audio;}
