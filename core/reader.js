import {LEAVES,ANA_IDS} from '../content/manifest.js';
import {LIFE_SOURCES,LIFE_IDS} from '../content/life-sources.js';
import {loadState,markVisited} from './state.js';
import {isUnlocked,anaComplete} from './progress.js';
import {openIndex} from './index-modal.js';

let host=null;
let observer=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function leaf(id){return LEAVES.find(x=>x.id===id)||null;}
function lifeIndex(id){return LIFE_IDS.indexOf(id);}
function routeId(){return new URLSearchParams(location.search).get('read');}
function canonicalText(node){return (node?.textContent||'').replace(/\s+/g,' ').trim();}

async function extract(source){
  const res=await fetch(source,{cache:'no-store'});
  if(!res.ok)throw new Error(`No se pudo cargar ${source}`);
  const doc=new DOMParser().parseFromString(await res.text(),'text/html');
  const spec=LIFE_SOURCES[routeId()];
  const nodes=[];
  for(const selector of spec?.selectors||[]){
    doc.querySelectorAll(selector).forEach(n=>nodes.push(n));
  }
  if(!nodes.length)doc.querySelectorAll('main p,article p,main .line').forEach(n=>nodes.push(n));
  const seen=new Set(),lines=[];
  for(const n of nodes){
    const text=canonicalText(n);
    if(!text||seen.has(text))continue;
    if(/^(Anterior|Siguiente|Inicio|Índice|Volver|Cerrar|Repetir|Música|Voz)$/i.test(text))continue;
    seen.add(text);lines.push(text);
  }
  return lines;
}

function navId(delta){
  const id=routeId(),i=lifeIndex(id);
  if(i<0)return null;
  const target=LIFE_IDS[i+delta];
  if(!target)return null;
  const item=leaf(target);
  return item&&isUnlocked(item,loadState())?target:null;
}

function navigate(id){
  if(!id)return;
  history.pushState({},'',`?read=${encodeURIComponent(id)}`);
  window.dispatchEvent(new CustomEvent('oras:route'));
}

function watchRead(id){
  observer?.disconnect();
  const sentinel=host?.querySelector('[data-read-end]');
  if(!sentinel)return;
  observer=new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)){
      markVisited(id);
      host?.classList.add('is-complete');
      observer?.disconnect();
      if(id==='ana-epilogo')renderQuestion();
    }
  },{threshold:.6});
  observer.observe(sentinel);
}

function renderQuestion(){
  const slot=host?.querySelector('[data-question-slot]');
  if(!slot)return;
  const ready=anaComplete(loadState());
  slot.innerHTML=ready?`<button class="oras-question" data-question aria-label="Abrir Ceniciento desde el interrogante">?</button>`:'';
  slot.querySelector('[data-question]')?.addEventListener('click',()=>{
    history.pushState({},'',`?read=ceniciento&via=interrogante`);
    window.dispatchEvent(new CustomEvent('oras:route'));
  });
}

function renderLocked(item){
  document.body.classList.add('oras-reading');
  host.hidden=false;
  host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>Esta puerta todavía no está abierta.</p><button data-index>Abrir índice</button></div></section>`;
  host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
}

function renderCenicientoGate(){
  const via=new URLSearchParams(location.search).get('via');
  if(via!=='interrogante'||!anaComplete(loadState())){
    history.replaceState({},'', '?read=ana-epilogo');
    return renderCurrent();
  }
  document.body.classList.add('oras-reading','oras-ceniciento-gate');
  host.hidden=false;
  host.innerHTML=`<section class="oras-reader-shell oras-reader-transition"><header class="oras-reader-head"><span>ORAS · LA VIDA</span><button data-index>Índice</button></header><div class="oras-threshold"><span class="oras-question-large">?</span><h1>CENICIENTO</h1><p>El único acceso sigue siendo el interrogante.</p><button class="oras-primary" data-enter-ceniciento>Seguir</button></div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  host.querySelector('[data-enter-ceniciento]')?.addEventListener('click',()=>{
    location.href='./elegia-breve/#ceniciento';
  });
}

export async function renderCurrent(){
  if(!host)return;
  const id=routeId();
  if(!id){document.body.classList.remove('oras-reading','oras-ceniciento-gate');host.hidden=true;host.innerHTML='';return;}
  if(id==='ceniciento')return renderCenicientoGate();
  if(!LIFE_IDS.includes(id))return;
  const item=leaf(id);
  if(!item||!isUnlocked(item,loadState()))return renderLocked(item);
  document.body.classList.add('oras-reading');
  document.body.classList.toggle('oras-ana-reading',id.startsWith('ana-'));
  host.hidden=false;
  host.innerHTML=`<section class="oras-reader-shell is-loading"><header class="oras-reader-head"><span>${id==='solo'?'I · LA VIDA':'ANA KLAUDYA'}</span><button data-index>Índice ORAS</button></header><div class="oras-reader-loading">Preparando el texto…</div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  try{
    const lines=await extract(LIFE_SOURCES[id].source);
    const prev=navId(-1),next=navId(1);
    const prose=lines.map((text,i)=>`<p class="oras-text-line" style="--i:${i}">${esc(text)}</p>`).join('');
    host.innerHTML=`<section class="oras-reader-shell ${esc(LIFE_SOURCES[id].theme)}"><header class="oras-reader-head"><span>${id==='solo'?'I · LA VIDA':'ANA KLAUDYA'}</span><button data-index>Índice ORAS</button></header><article class="oras-reader-copy"><h1>${esc(item.title)}</h1>${prose}<div class="oras-read-end" data-read-end aria-hidden="true"></div><div class="oras-question-slot" data-question-slot></div></article><nav class="oras-reader-nav" aria-label="Navegación de lectura"><button data-prev ${prev?'':'disabled'}>Anterior</button><button data-index>Índice</button><button data-next ${next?'':'disabled'}>Siguiente</button></nav></section>`;
    host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
    host.querySelector('[data-prev]')?.addEventListener('click',()=>navigate(prev));
    host.querySelector('[data-next]')?.addEventListener('click',()=>{markVisited(id);navigate(next);});
    const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('is-visible')),{rootMargin:'0px 0px -12% 0px',threshold:.05});
    host.querySelectorAll('.oras-text-line').forEach(p=>io.observe(p));
    watchRead(id);
    if(id==='ana-epilogo')renderQuestion();
    scrollTo({top:0,left:0,behavior:'auto'});
  }catch(err){
    host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>No se ha podido cargar el texto canónico.</p><small>${esc(err.message)}</small></div></section>`;
    host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  }
}

export function installReader(){
  host=document.querySelector('[data-oras-reader]');
  if(!host)return;
  window.addEventListener('popstate',renderCurrent);
  window.addEventListener('oras:route',renderCurrent);
  window.addEventListener('oras:state',()=>routeId()==='ana-epilogo'&&renderQuestion());
  renderCurrent();
}
