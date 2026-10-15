import {MIRROR_SCENES,MIRROR_PAUSES,MIRROR_SOUNDTRACK} from '../content/mirror-scenes.js';
import {loadState,markVisited} from './state.js';
import {mirrorReady} from './progress.js';
import {openIndex} from './index-modal.js';
import {mountAudioDock,clearAudioDock} from './audio.js';
import {setDeformed} from './transitions.js';

let scrollRAF=0;
let pauseObserver=null;
let audioEnded=false;
let cleanupFns=[];

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function cleanupMirror(){
  pauseObserver?.disconnect();pauseObserver=null;
  cleanupFns.forEach(fn=>{try{fn();}catch{}});cleanupFns=[];
  audioEnded=false;scrollRAF=0;
}

function fragmentHTML(text){return text.split(/\n\n+/).map(block=>`<p>${block.split('\n').map(esc).join('<br>')}</p>`).join('');}
function timeLabel(seconds){seconds=Math.max(0,Math.ceil(seconds||0));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}

function setFinalGate(host,current=0,duration=0){
  const button=host.querySelector('[data-mirror-final]');
  if(!button)return;
  if(audioEnded){button.disabled=false;button.textContent='seguir';button.classList.remove('is-locked');return;}
  button.disabled=true;button.classList.add('is-locked');
  button.textContent=duration?`espera · ${timeLabel(duration-current)}`:'espera · sonido';
}

function updateWarp(container){
  scrollRAF=0;
  const max=Math.max(1,container.scrollHeight-container.clientHeight);
  const p=Math.max(0,Math.min(1,container.scrollTop/max));
  const bell=Math.sin(Math.PI*p),wave=Math.sin(p*Math.PI*8.5);
  container.style.setProperty('--mirror-shift',`${(wave*5.2*bell+p*.8).toFixed(2)}px`);
  container.style.setProperty('--mirror-skew',`${(wave*.72*bell+p*.10).toFixed(3)}deg`);
  container.style.setProperty('--mirror-scale',(1+bell*.013+p*.0015).toFixed(4));
  container.style.setProperty('--mirror-blur',`${(bell*.18).toFixed(2)}px`);
  container.style.setProperty('--mirror-shadow',`${(wave*2.1*bell).toFixed(2)}px`);
  container.dataset.phase=p<.24?'entrada':p<.76?'deformacion':'salida';
}

function bindPauses(container){
  pauseObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting||entry.intersectionRatio<.72)continue;
      const scene=entry.target;
      if(scene.dataset.passed==='1')continue;
      container.classList.add('is-paused');
      scene.classList.add('awaiting-follow');
      scene.querySelector('[data-mirror-follow]')?.removeAttribute('hidden');
      break;
    }
  },{root:container,threshold:[.72,.9]});
  container.querySelectorAll('[data-mirror-pause]').forEach(scene=>pauseObserver.observe(scene));

  container.querySelectorAll('[data-mirror-follow]').forEach(button=>button.addEventListener('click',()=>{
    const scene=button.closest('.oras-mirror-scene');
    scene.dataset.passed='1';scene.classList.remove('awaiting-follow');button.hidden=true;
    container.classList.remove('is-paused');
    const next=scene.nextElementSibling;
    next?.scrollIntoView({behavior:'smooth',block:'start'});
  }));
}

function leaveMirror(){
  markVisited('espejo');
  setDeformed(true);
  history.pushState({},'','?indice=1');
  window.dispatchEvent(new CustomEvent('oras:route'));
  requestAnimationFrame(openIndex);
}

export function renderMirror(host){
  cleanupMirror();clearAudioDock();
  if(!mirrorReady(loadState())){
    document.body.classList.add('oras-reading');
    host.hidden=false;
    host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS · EL UMBRAL</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>EL ESPEJO todavía no puede abrirse.</p></div></section>`;
    host.querySelector('[data-index]')?.addEventListener('click',openIndex);return;
  }

  document.body.classList.add('oras-reading','oras-mirror-reading');
  host.hidden=false;
  const scenes=MIRROR_SCENES.map((text,i)=>{
    const n=i+1,pause=MIRROR_PAUSES.has(n),final=n===MIRROR_SCENES.length;
    return `<section class="oras-mirror-scene ${final?'is-final':''}" ${pause?'data-mirror-pause':''} aria-label="Fragmento ${n} de ${MIRROR_SCENES.length}"><div class="oras-mirror-copy">${fragmentHTML(text)}</div>${pause?'<button type="button" class="oras-mirror-follow" data-mirror-follow hidden>seguir</button>':''}${final?'<button type="button" class="oras-mirror-final is-locked" data-mirror-final disabled>espera · sonido</button>':''}</section>`;
  }).join('');
  host.innerHTML=`<section class="oras-mirror-shell"><header class="oras-mirror-head"><span>II · EL UMBRAL</span><strong>EL ESPEJO</strong><button type="button" data-index>Índice</button></header><div class="oras-mirror-scroll" data-mirror-scroll>${scenes}</div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  const container=host.querySelector('[data-mirror-scroll]');
  bindPauses(container);
  const onScroll=()=>{if(!scrollRAF)scrollRAF=requestAnimationFrame(()=>updateWarp(container));};
  container.addEventListener('scroll',onScroll,{passive:true});cleanupFns.push(()=>container.removeEventListener('scroll',onScroll));
  updateWarp(container);
  host.querySelector('[data-mirror-final]')?.addEventListener('click',()=>{if(audioEnded)leaveMirror();});

  mountAudioDock(host,'espejo',{src:MIRROR_SOUNDTRACK,loop:false,autoplay:true,label:'El Espejo',onTime:({current,duration})=>setFinalGate(host,current,duration),onEnded:()=>{audioEnded=true;setFinalGate(host);}});
}
