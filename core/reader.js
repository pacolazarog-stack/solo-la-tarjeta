import {LEAVES,EXPANSION_IDS} from '../content/manifest.js';
import {LIFE_SOURCES,LIFE_IDS} from '../content/life-sources.js';
import {loadState,markVisited} from './state.js';
import {isUnlocked} from './progress.js';
import {openIndex} from './index-modal.js';
import {mountAudioDock,clearAudioDock} from './audio.js';
import {renderCeniciento,cleanupCeniciento} from './ceniciento.js';
import {renderMirror,cleanupMirror} from './mirror.js';
import {renderExpansion,cleanupExpansion} from './expansion.js';
import {renderAnaScene,cleanupAnaScene} from './ana-scenes.js';

let host=null;
let observer=null;
let lineObserver=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const htmlText=s=>String(s??'').split('\n').map(esc).join('<br>');

function leaf(id){return LEAVES.find(x=>x.id===id)||null;}
function lifeIndex(id){return LIFE_IDS.indexOf(id);}
function routeId(){return new URLSearchParams(location.search).get('read');}
function nodeText(node){
  if(!node)return '';
  const clone=node.cloneNode(true);
  clone.querySelectorAll('br').forEach(br=>br.replaceWith('\n'));
  return (clone.textContent||'').replace(/[ \t]+/g,' ').replace(/\n\s+/g,'\n').trim();
}

async function extract(source,id){
  const res=await fetch(source,{cache:'no-store'});
  if(!res.ok)throw new Error(`No se pudo cargar ${source}`);
  const doc=new DOMParser().parseFromString(await res.text(),'text/html');
  const spec=LIFE_SOURCES[id];
  const nodes=[];
  for(const selector of spec?.selectors||[])doc.querySelectorAll(selector).forEach(n=>nodes.push(n));
  if(!nodes.length)doc.querySelectorAll('main .line,article .line,main p,article p').forEach(n=>nodes.push(n));
  const seen=new Set(),lines=[];
  for(const n of nodes){
    const text=nodeText(n);
    const key=text.replace(/\s+/g,' ').trim();
    if(!key||seen.has(key))continue;
    if(/^(Anterior|Siguiente|Inicio|Índice|Volver|Cerrar|Repetir|Música|Voz)$/i.test(key))continue;
    seen.add(key);
    lines.push({text,wait:Number(n.dataset?.wait)||null,className:n.className||''});
  }
  return lines;
}

function candidateNavId(delta){
  const i=lifeIndex(routeId());
  return i<0?null:(LIFE_IDS[i+delta]||null);
}
function navId(delta){
  const target=candidateNavId(delta);
  const item=leaf(target);
  return item&&isUnlocked(item,loadState())?target:null;
}
function navigate(id,via){
  if(!id)return;
  const qs=new URLSearchParams();qs.set('read',id);if(via)qs.set('via',via);
  history.pushState({},'',`?${qs.toString()}`);
  window.dispatchEvent(new CustomEvent('oras:route'));
}
function refreshLifeNext(){
  const next=candidateNavId(1),item=leaf(next),button=host?.querySelector('[data-next]');
  if(!button||!next||!item)return;
  if(isUnlocked(item,loadState())){button.disabled=false;button.dataset.target=next;}
}

function worldMarkup(id){
  return `<div class="oras-reading-world is-solo" aria-hidden="true"><div class="oras-world-base"></div><div class="oras-world-grain"></div><div class="oras-world-stars"></div><div class="oras-world-orb"></div></div>`;
}
function watchRead(id){
  observer?.disconnect();
  const sentinel=host?.querySelector('[data-read-end]');
  if(!sentinel)return;
  observer=new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)){
      markVisited(id);host?.classList.add('is-complete');refreshLifeNext();observer?.disconnect();
    }
  },{threshold:.6});
  observer.observe(sentinel);
}
function renderLocked(){
  clearAudioDock();
  document.body.classList.add('oras-reading');
  host.hidden=false;
  host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>Esta puerta todavía no está abierta.</p><button data-index>Abrir índice</button></div></section>`;
  host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
}
function cleanupRoute(){
  observer?.disconnect();lineObserver?.disconnect();
  cleanupAnaScene();cleanupCeniciento();cleanupMirror();cleanupExpansion();clearAudioDock();
  document.body.classList.remove('oras-ceniciento-gate','oras-ceniciento-reading','oras-mirror-reading','oras-ana-reading','oras-expansion-reading');
}

export async function renderCurrent(){
  if(!host)return;
  cleanupRoute();
  const id=routeId();
  if(!id){document.body.classList.remove('oras-reading');host.hidden=true;host.innerHTML='';return;}
  if(id==='ceniciento')return renderCeniciento(host);
  if(id==='espejo')return renderMirror(host);
  if(EXPANSION_IDS.includes(id))return renderExpansion(host,id);
  if(!LIFE_IDS.includes(id))return;
  const item=leaf(id);
  if(!item||!isUnlocked(item,loadState()))return renderLocked();

  document.body.classList.add('oras-reading');
  host.hidden=false;
  host.innerHTML=`<section class="oras-reader-shell is-loading"><header class="oras-reader-head"><span>${id==='solo'?'I · LA VIDA':'ANA KLAUDYA'}</span><button data-index>Índice ORAS</button></header><div class="oras-reader-loading">Abriendo la lectura…</div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);

  try{
    const lines=id==='ana-interludio'?[]:await extract(LIFE_SOURCES[id].source,id);
    const prev=navId(-1),nextCandidate=candidateNavId(1),next=navId(1);
    if(id.startsWith('ana-')){
      renderAnaScene(host,{id,item,lines,prev,nextCandidate,next,openIndex,navigate});
      scrollTo({top:0,left:0,behavior:'auto'});
      return;
    }

    const prose=lines.map((line,i)=>`<p class="oras-text-line" style="--i:${i}">${htmlText(line.text)}</p>`).join('');
    const soloFirst=id==='solo';
    host.innerHTML=`<section class="oras-reader-shell ${esc(LIFE_SOURCES[id].theme)}">${worldMarkup(id)}<header class="oras-reader-head"><span>I · LA VIDA</span><button data-index>Índice ORAS</button></header><article class="oras-reader-copy"><h1>${esc(item.title)}</h1>${prose}<div class="oras-read-end" data-read-end aria-hidden="true"></div></article><nav class="oras-reader-nav" aria-label="Navegación de lectura"><button data-prev ${(!soloFirst&&!prev)?'disabled':''}>Anterior</button><button data-index>Índice</button><button data-next ${next?'':'disabled'} data-target="${esc(nextCandidate||'')}">Siguiente</button></nav></section>`;
    host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
    host.querySelector('[data-prev]')?.addEventListener('click',()=>{if(soloFirst)openIndex();else navigate(prev);});
    host.querySelector('[data-next]')?.addEventListener('click',e=>{if(e.currentTarget.disabled)return;markVisited(id);navigate(e.currentTarget.dataset.target);});
    lineObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('is-visible')),{rootMargin:'0px 0px -12% 0px',threshold:.05});
    host.querySelectorAll('.oras-text-line').forEach(p=>lineObserver.observe(p));
    watchRead(id);mountAudioDock(host,id);scrollTo({top:0,left:0,behavior:'auto'});
  }catch(err){
    clearAudioDock();
    host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>No se ha podido cargar el texto canónico.</p><small>${esc(err.message)}</small></div></section>`;
    host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  }
}

export function installReader(){
  host=document.querySelector('[data-oras-reader]');
  if(!host)return;
  window.addEventListener('popstate',renderCurrent);
  window.addEventListener('oras:route',renderCurrent);
  renderCurrent();
}
