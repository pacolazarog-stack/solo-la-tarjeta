import {markVisited} from './state.js';
import {mountAudioDock,clearAudioDock} from './audio.js';

let scrollHandler=null;
let revealObserver=null;
let endObserver=null;
let cometTimer=null;

const clamp=n=>Math.max(0,Math.min(1,n));
const mix=(a,b,t)=>a+(b-a)*clamp(t);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function progress(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  return clamp(scrollY/max);
}
function setv(name,value){document.documentElement.style.setProperty(name,String(value));}
function updateWorld(){
  const p=progress();
  const dawn=clamp(1-p/.18);
  const warm=clamp((p-.03)/.22)*(1-clamp((p-.38)/.2));
  const sunset=clamp((p-.22)/.22)*(1-clamp((p-.62)/.16));
  const night=clamp((p-.48)/.24);
  const stars=clamp((p-.56)/.2);
  const moon=clamp((p-.60)/.12)*(1-clamp((p-.82)/.08));
  const venus=clamp((p-.68)/.08)*(1-clamp((p-.88)/.06));
  const finalMoon=clamp((p-.80)/.10);
  const yin=clamp((p-.88)/.09);
  const white=clamp((p-.965)/.035);
  setv('--solo-dawn',dawn);setv('--solo-warm',warm);setv('--solo-sunset',sunset);
  setv('--solo-night',night);setv('--solo-stars',stars);setv('--solo-moon',moon);
  setv('--solo-venus',venus);setv('--solo-final-moon',finalMoon);setv('--solo-yin',yin);setv('--solo-white',white);
  setv('--solo-progress',p);
}
function startComet(host){
  const c=host.querySelector('[data-solo-comet]');if(!c)return;
  c.classList.remove('is-active');void c.offsetWidth;c.classList.add('is-active');
}
function sanitizeArticle(doc){
  const article=doc.querySelector('main article,article');
  if(!article)return '';
  const clone=article.cloneNode(true);
  clone.querySelectorAll('script,audio,button,nav,iframe').forEach(n=>n.remove());
  clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
  clone.querySelectorAll('[style]').forEach(n=>n.removeAttribute('style'));
  clone.querySelectorAll('img').forEach(img=>{
    img.loading='lazy';img.decoding='async';
    const src=img.getAttribute('src')||'';
    if(src&&!src.startsWith('data:')&&!src.startsWith('http')&&!src.startsWith('/'))img.setAttribute('src','./'+src.replace(/^\.\//,''));
  });
  return clone.innerHTML;
}
function world(){return `<div class="oras-solo-world" aria-hidden="true">
  <div class="solo-dawn-dark"></div><div class="solo-dawn-warm"></div><div class="solo-sunset"></div><div class="solo-night"></div><div class="solo-stars"></div>
  <div class="solo-comet" data-solo-comet><span></span><i></i></div>
  <div class="solo-moon"></div>
  <div class="solo-final-moon"><span class="solo-crescent"></span><svg viewBox="0 0 100 100"><g class="solo-yin"><rect x="0" y="0" width="50" height="100" fill="#faf9ee"/><rect x="50" y="0" width="50" height="100" fill="#08101e"/><circle cx="50" cy="25" r="25" fill="#08101e"/><circle cx="50" cy="75" r="25" fill="#faf9ee"/><circle cx="50" cy="25" r="8" fill="#faf9ee"/><circle cx="50" cy="75" r="8" fill="#08101e"/></g></svg></div>
  <div class="solo-venus"></div><div class="solo-white"></div><div class="solo-vignette"></div>
</div>`}

export async function renderSoloScene(host,{item,openIndex,navigate}){
  cleanupSoloScene();
  document.body.classList.add('oras-reading','oras-solo-reading');
  host.hidden=false;
  host.innerHTML=`<section class="oras-solo-shell">${world()}<header class="oras-reader-head oras-solo-head"><span>I · LA VIDA</span><button data-index>Índice ORAS</button></header><div class="oras-reader-loading">Abriendo la lectura…</div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  const res=await fetch('./index-legacy.html',{cache:'no-store'});if(!res.ok)throw new Error('No se pudo cargar SOLO LA TARJETA');
  const doc=new DOMParser().parseFromString(await res.text(),'text/html');
  const body=sanitizeArticle(doc);
  host.innerHTML=`<section class="oras-solo-shell">${world()}<header class="oras-reader-head oras-solo-head"><span>I · LA VIDA</span><button data-index>Índice ORAS</button></header>
  <header class="solo-hero"><div><h1>${esc(item.title)}</h1><span></span></div></header>
  <main class="solo-copy"><article>${body}<div class="solo-end" data-read-end></div></article></main>
  <nav class="oras-reader-nav oras-solo-nav"><button data-prev>Anterior</button><button data-index>Índice</button><button data-next disabled>Siguiente</button></nav></section>`;
  host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
  host.querySelector('[data-prev]')?.addEventListener('click',openIndex);
  const next=host.querySelector('[data-next]');
  next?.addEventListener('click',()=>{if(!next.disabled)navigate('ana-prologo');});
  revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{rootMargin:'0px 0px -9% 0px',threshold:.04});
  host.querySelectorAll('.reveal,.dusk-beat,.photo-layer,.tower-photo').forEach(n=>revealObserver.observe(n));
  const twoDays=host.querySelector('.two-days-passage');
  if(twoDays){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){startComet(host);io.disconnect()}},{threshold:.25});io.observe(twoDays)}
  const end=host.querySelector('[data-read-end]');
  endObserver=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){markVisited('solo');if(next)next.disabled=false;endObserver.disconnect()}},{threshold:.6});
  endObserver.observe(end);
  scrollHandler=()=>updateWorld();addEventListener('scroll',scrollHandler,{passive:true});updateWorld();
  mountAudioDock(host,'solo');
  scrollTo({top:0,left:0,behavior:'auto'});
}

export function cleanupSoloScene(){
  if(scrollHandler)removeEventListener('scroll',scrollHandler);scrollHandler=null;
  revealObserver?.disconnect();revealObserver=null;endObserver?.disconnect();endObserver=null;
  clearTimeout(cometTimer);cometTimer=null;clearAudioDock();
  document.body.classList.remove('oras-solo-reading');
  for(const n of ['--solo-dawn','--solo-warm','--solo-sunset','--solo-night','--solo-stars','--solo-moon','--solo-venus','--solo-final-moon','--solo-yin','--solo-white','--solo-progress'])document.documentElement.style.removeProperty(n);
}
