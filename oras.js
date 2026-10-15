import {installIndex,openIndex} from './core/index-modal.js';
import {loadState} from './core/state.js';
import {setDeformed} from './core/transitions.js';

function boot(){
  installIndex();
  const state=loadState();
  setDeformed(state.realityDeformed);
  document.querySelector('[data-oras-enter]')?.addEventListener('click',openIndex);
  document.querySelector('[data-oras-index]')?.addEventListener('click',openIndex);
  const qs=new URLSearchParams(location.search);
  if(qs.get('indice')==='1') requestAnimationFrame(openIndex);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
