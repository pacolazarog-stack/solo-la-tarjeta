import {loadState,markVisited,allowMirror} from './state.js';
import {anaComplete} from './progress.js';
import {openIndex} from './index-modal.js';
import {mountAudioDock,clearAudioDock} from './audio.js';

let scrollHandler=null;
let endObserver=null;
let activeHost=null;

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const params=()=>new URLSearchParams(location.search);

export function cleanupCeniciento(){
  if(scrollHandler){window.removeEventListener('scroll',scrollHandler);scrollHandler=null;}
  endObserver?.disconnect();endObserver=null;activeHost=null;
}

function setRoute(mode){
  const q=params();q.set('read','ceniciento');q.set('via','interrogante');
  if(mode)q.set('mode',mode);else q.delete('mode');
  history.pushState({},'',`?${q.toString()}`);
  window.dispatchEvent(new CustomEvent('oras:route'));
}

function backToAna(){
  history.pushState({},'','?read=ana-epilogo');
  window.dispatchEvent(new CustomEvent('oras:route'));
}

function toMirror(){
  markVisited('ceniciento');
  allowMirror();
  history.pushState({},'','?read=espejo');
  window.dispatchEvent(new CustomEvent('oras:route'));
}

async function loadText(){
  const res=await fetch('./ceniciento/texto.md',{cache:'no-store'});
  if(!res.ok)throw new Error('No se pudo cargar el texto canónico de CENICIENTO');
  const raw=(await res.text()).replace(/^#\s*CENICIENTO\s*/i,'').trim();
  return raw.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
}

function framePath(index){return `./ceniciento/frames-stable/${String(index).padStart(2,'0')}.webp`;}
function setFrame(img,p){
  const n=Math.max(1,Math.min(9,1+Math.floor(Math.max(0,Math.min(1,p))*8)));
  const src=framePath(n);if(img&&img.getAttribute('src')!==src)img.setAttribute('src',src);
}

function shellHeader(){return `<header class="oras-reader-head oras-reader-head-dark"><button type="button" data-back-ana>Anterior</button><span>ORAS · CENICIENTO</span><button type="button" data-index>Índice</button></header>`;}
function bindCommon(host){
  host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
  host.querySelectorAll('[data-back-ana]').forEach(b=>b.addEventListener('click',backToAna));
}
function revealFollow(host){
  markVisited('ceniciento');
  const buttons=[...host.querySelectorAll('[data-follow-mirror]')];
  buttons.forEach(button=>{button.hidden=false;button.disabled=false;});
  buttons.find(button=>button.closest('.oras-ceniciento-follow'))?.focus({preventScroll:true});
}

async function renderRead(host){
  const lines=await loadText();
  const prose=lines.map((x,i)=>`<p class="oras-ceniciento-line" style="--i:${i}">${esc(x)}</p>`).join('');
  host.innerHTML=`<section class="oras-reader-shell oras-ceniciento-shell">${shellHeader()}<div class="oras-ceniciento-world" aria-hidden="true"><img data-ceniciento-frame src="${framePath(1)}" alt=""><div></div></div><article class="oras-ceniciento-copy"><h1>CENICIENTO</h1>${prose}<div class="oras-read-end" data-ceniciento-end aria-hidden="true"></div><div class="oras-ceniciento-follow"><button type="button" class="oras-primary oras-primary-dark" data-follow-mirror hidden disabled>Seguir</button></div></article><nav class="oras-reader-nav oras-reader-nav-dark"><button type="button" data-back-ana>Anterior</button><button type="button" data-index>Índice</button><button type="button" data-follow-mirror disabled>Seguir</button></nav></section>`;
  bindCommon(host);
  host.querySelectorAll('[data-follow-mirror]').forEach(b=>b.addEventListener('click',()=>{if(!b.disabled)toMirror();}));
  const frame=host.querySelector('[data-ceniciento-frame]');
  scrollHandler=()=>{
    const doc=document.documentElement;
    const max=Math.max(1,doc.scrollHeight-innerHeight);
    setFrame(frame,scrollY/max);
  };
  window.addEventListener('scroll',scrollHandler,{passive:true});scrollHandler();
  const lineIO=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('is-visible')),{rootMargin:'0px 0px -12% 0px',threshold:.05});
  host.querySelectorAll('.oras-ceniciento-line').forEach(p=>lineIO.observe(p));
  endObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){lineIO.disconnect();endObserver.disconnect();revealFollow(host);}},{threshold:.55});
  endObserver.observe(host.querySelector('[data-ceniciento-end]'));
  mountAudioDock(host,'ceniciento');
  scrollTo({top:0,left:0,behavior:'auto'});
}

function renderVoice(host){
  host.innerHTML=`<section class="oras-reader-shell oras-ceniciento-shell oras-ceniciento-voice">${shellHeader()}<div class="oras-ceniciento-world is-voice" aria-hidden="true"><img data-ceniciento-frame src="${framePath(1)}" alt=""><div></div></div><div class="oras-ceniciento-voice-copy"><p class="oras-kicker">voz · partitura emocional</p><h1>CENICIENTO</h1><p data-voice-time>0:00</p><button type="button" class="oras-primary oras-primary-dark" data-follow-mirror hidden disabled>Seguir</button></div></section>`;
  bindCommon(host);
  const follow=host.querySelector('[data-follow-mirror]');follow.addEventListener('click',()=>{if(!follow.disabled)toMirror();});
  const frame=host.querySelector('[data-ceniciento-frame]');
  const time=host.querySelector('[data-voice-time]');
  mountAudioDock(host,'ceniciento',{src:'./ceniciento/CENICIENTO_completo.m4a',loop:false,autoplay:true,label:'Voz Ceniciento',onTime:({current,duration})=>{
    if(duration>0)setFrame(frame,current/duration);
    const m=Math.floor(current/60),s=String(Math.floor(current%60)).padStart(2,'0');
    time.textContent=`${m}:${s}`;
  },onEnded:()=>{revealFollow(host);}});
}

function renderGate(host){
  clearAudioDock();
  host.innerHTML=`<section class="oras-reader-shell oras-reader-transition oras-ceniciento-gate-clean">${shellHeader()}<div class="oras-threshold"><span class="oras-question-large">?</span><h1>CENICIENTO</h1><p>El interrogante es la única puerta.</p><div class="oras-threshold-actions"><button class="oras-primary oras-primary-dark" type="button" data-mode="voice">Voz</button><button class="oras-primary oras-primary-dark" type="button" data-mode="read">Leer</button></div></div></section>`;
  bindCommon(host);
  host.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setRoute(b.dataset.mode)));
}

export async function renderCeniciento(host){
  cleanupCeniciento();activeHost=host;
  const q=params(),via=q.get('via'),mode=q.get('mode');
  if(via!=='interrogante'||!anaComplete(loadState())){
    history.replaceState({},'','?read=ana-epilogo');
    window.dispatchEvent(new CustomEvent('oras:route'));
    return;
  }
  document.body.classList.add('oras-reading','oras-ceniciento-reading');
  host.hidden=false;
  if(!mode)return renderGate(host);
  try{
    if(mode==='voice')return renderVoice(host);
    return await renderRead(host);
  }catch(err){
    host.innerHTML=`<section class="oras-reader-shell oras-ceniciento-shell">${shellHeader()}<div class="oras-reader-lock"><p>No se ha podido abrir CENICIENTO.</p><small>${esc(err.message)}</small></div></section>`;
    bindCommon(host);
  }
}
