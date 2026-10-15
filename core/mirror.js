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
let mechanicalCtx=null;
let mechanicalNoise=null;
let lockedScene=null;
let lastTouchY=null;
const clearedPauses=new Set();

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function cleanupMirror(){
  pauseObserver?.disconnect();pauseObserver=null;
  cleanupFns.forEach(fn=>{try{fn();}catch{}});cleanupFns=[];
  audioEnded=false;scrollRAF=0;lockedScene=null;lastTouchY=null;clearedPauses.clear();
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

function prepareMechanicalAudio(){
  if(mechanicalCtx)return true;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  mechanicalCtx=new AC();
  const length=Math.max(1,Math.floor(mechanicalCtx.sampleRate*.028));
  mechanicalNoise=mechanicalCtx.createBuffer(1,length,mechanicalCtx.sampleRate);
  const data=mechanicalNoise.getChannelData(0);let seed=1977;
  for(let i=0;i<length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647)*2-1;}
  return true;
}
function fireMechanicalClack(){
  if(!mechanicalCtx||mechanicalCtx.state!=='running')return;
  const t=mechanicalCtx.currentTime+.002;
  const snap=mechanicalCtx.createOscillator(),sg=mechanicalCtx.createGain();
  snap.type='square';snap.frequency.setValueAtTime(690,t);snap.frequency.exponentialRampToValueAtTime(185,t+.052);
  sg.gain.setValueAtTime(.0001,t);sg.gain.exponentialRampToValueAtTime(.038,t+.003);sg.gain.exponentialRampToValueAtTime(.0001,t+.058);
  snap.connect(sg).connect(mechanicalCtx.destination);snap.start(t);snap.stop(t+.062);
  const body=mechanicalCtx.createOscillator(),bg=mechanicalCtx.createGain();
  body.type='triangle';body.frequency.setValueAtTime(118,t);body.frequency.exponentialRampToValueAtTime(82,t+.07);
  bg.gain.setValueAtTime(.022,t);bg.gain.exponentialRampToValueAtTime(.0001,t+.075);
  body.connect(bg).connect(mechanicalCtx.destination);body.start(t);body.stop(t+.08);
  if(mechanicalNoise){const src=mechanicalCtx.createBufferSource(),filter=mechanicalCtx.createBiquadFilter(),ng=mechanicalCtx.createGain();src.buffer=mechanicalNoise;filter.type='bandpass';filter.frequency.value=2350;filter.Q.value=.9;ng.gain.setValueAtTime(.043,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.029);src.connect(filter).connect(ng).connect(mechanicalCtx.destination);src.start(t);src.stop(t+.03);}
}
function playMechanicalClack(){
  if(!prepareMechanicalAudio())return;
  if(mechanicalCtx.state==='suspended')mechanicalCtx.resume().then(fireMechanicalClack).catch(()=>{});else fireMechanicalClack();
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
  container.style.setProperty('--mirror-progress',p.toFixed(4));
  container.dataset.phase=p<.24?'entrada':p<.76?'deformacion':'salida';
}

function releasePause(container,forward=true){
  if(!lockedScene)return;
  const scene=lockedScene;scene.dataset.passed='1';scene.classList.remove('awaiting-follow');
  scene.querySelector('[data-mirror-follow]')?.setAttribute('hidden','');
  lockedScene=null;container.classList.remove('is-paused');
  if(forward){const next=scene.nextElementSibling;next?.scrollIntoView({behavior:'smooth',block:'start'});}
}
function bindPauses(container){
  pauseObserver=new IntersectionObserver(entries=>{
    if(lockedScene)return;
    for(const entry of entries){
      if(!entry.isIntersecting||entry.intersectionRatio<.68)continue;
      const scene=entry.target,number=Number(scene.dataset.pauseNumber||0);
      if(clearedPauses.has(number))continue;
      lockedScene=scene;container.classList.add('is-paused');scene.classList.add('awaiting-follow');
      scene.querySelector('[data-mirror-follow]')?.removeAttribute('hidden');
      container.scrollTop=scene.offsetTop;break;
    }
  },{root:container,threshold:[.68,.9]});
  container.querySelectorAll('[data-mirror-pause]').forEach(scene=>pauseObserver.observe(scene));
  container.querySelectorAll('[data-mirror-follow]').forEach(button=>button.addEventListener('click',()=>{
    const scene=button.closest('.oras-mirror-scene'),number=Number(scene.dataset.pauseNumber||0);if(lockedScene!==scene)return;
    clearedPauses.add(number);playMechanicalClack();releasePause(container,true);
  }));
  const wheel=e=>{if(!lockedScene)return;if(e.deltaY<0){releasePause(container,false);return;}e.preventDefault();e.stopPropagation();};
  const touchStart=e=>{lastTouchY=e.touches[0]?.clientY??null;};
  const touchMove=e=>{if(!lockedScene){lastTouchY=e.touches[0]?.clientY??null;return;}const y=e.touches[0]?.clientY??lastTouchY;if(lastTouchY!==null&&y>lastTouchY){releasePause(container,false);lastTouchY=y;return;}e.preventDefault();e.stopPropagation();lastTouchY=y;};
  const key=e=>{if(!lockedScene)return;if(['ArrowUp','PageUp','Home'].includes(e.key)){releasePause(container,false);return;}if(['ArrowDown','PageDown',' ','End'].includes(e.key)){e.preventDefault();e.stopPropagation();}};
  container.addEventListener('wheel',wheel,{passive:false});container.addEventListener('touchstart',touchStart,{passive:true});container.addEventListener('touchmove',touchMove,{passive:false});container.addEventListener('keydown',key);
  cleanupFns.push(()=>container.removeEventListener('wheel',wheel),()=>container.removeEventListener('touchstart',touchStart),()=>container.removeEventListener('touchmove',touchMove),()=>container.removeEventListener('keydown',key));
}

function leaveMirror(host){
  const shell=host.querySelector('.oras-mirror-shell');
  markVisited('espejo');setDeformed(true);playMechanicalClack();shell?.classList.add('is-leaving');
  setTimeout(()=>{history.pushState({},'','?indice=1');window.dispatchEvent(new CustomEvent('oras:route'));requestAnimationFrame(openIndex);},1160);
}

export function renderMirror(host){
  cleanupMirror();clearAudioDock();
  if(!mirrorReady(loadState())){
    document.body.classList.add('oras-reading');host.hidden=false;
    host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS · EL UMBRAL</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>EL ESPEJO todavía no puede abrirse.</p></div></section>`;
    host.querySelector('[data-index]')?.addEventListener('click',openIndex);return;
  }

  document.body.classList.add('oras-reading','oras-mirror-reading');host.hidden=false;
  const scenes=MIRROR_SCENES.map((text,i)=>{
    const n=i+1,pause=MIRROR_PAUSES.has(n),final=n===MIRROR_SCENES.length;
    return `<section class="oras-mirror-scene ${final?'is-final':''}" ${pause?`data-mirror-pause data-pause-number="${n}"`:''} aria-label="Fragmento ${n} de ${MIRROR_SCENES.length}"><div class="oras-mirror-copy">${fragmentHTML(text)}</div>${pause?'<button type="button" class="oras-mirror-follow" data-mirror-follow hidden>seguir</button>':''}${final?'<button type="button" class="oras-mirror-final is-locked" data-mirror-final disabled>espera · sonido</button>':''}</section>`;
  }).join('');
  host.innerHTML=`<section class="oras-mirror-shell"><header class="oras-mirror-head"><span>II · EL UMBRAL</span><strong>EL ESPEJO</strong><button type="button" data-index>Índice</button></header><div class="oras-mirror-scroll" data-mirror-scroll tabindex="0">${scenes}</div><div class="oras-mirror-progress" aria-hidden="true"><i></i></div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  const container=host.querySelector('[data-mirror-scroll]');bindPauses(container);
  const onScroll=()=>{if(!scrollRAF)scrollRAF=requestAnimationFrame(()=>updateWarp(container));};
  container.addEventListener('scroll',onScroll,{passive:true});cleanupFns.push(()=>container.removeEventListener('scroll',onScroll));updateWarp(container);
  host.querySelector('[data-mirror-final]')?.addEventListener('click',()=>{if(audioEnded)leaveMirror(host);});
  mountAudioDock(host,'espejo',{src:MIRROR_SOUNDTRACK,loop:false,autoplay:true,label:'El Espejo',onTime:({current,duration})=>setFinalGate(host,current,duration),onEnded:()=>{audioEnded=true;setFinalGate(host);}});
}
