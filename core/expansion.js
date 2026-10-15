import {LEAVES,EXPANSION_IDS} from '../content/manifest.js';
import {expansionScene} from '../content/expansion-scenes.js';
import {loadState,markVisited} from './state.js';
import {isUnlocked} from './progress.js';
import {openIndex} from './index-modal.js';
import {mountAudioDock,clearAudioDock} from './audio.js';

const ROOT_SOURCE='./EL_INVENTARIO_DEL_AIRE_TRILOGIA_CANONICA.md';
const REVISED_SOURCE='./inventario-del-aire/CAPITULOS_XI_XIII_ORAS.md';
let cleanupFns=[];
let cache=null;
let scrollRAF=0;

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function cleanupExpansion(){cleanupFns.forEach(fn=>{try{fn()}catch{}});cleanupFns=[];scrollRAF=0;}
function leaf(id){return LEAVES.find(x=>x.id===id)||null;}
function qid(){return new URLSearchParams(location.search).get('read');}

function plainParagraphs(raw){
  return raw.trim().split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).map(block=>block.replace(/^>\s?/gm,'').replace(/\*\*/g,'')).filter(x=>!/^```/.test(x));
}
function sectionsByH2(md,anchor){
  const lines=md.split(/\r?\n/),out=[];let active=false,current=null;
  for(const line of lines){
    if(/^#\s+/.test(line)&&!/^##\s+/.test(line)){const h=line.replace(/^#\s+/,'').trim();active=h.toUpperCase()===anchor.toUpperCase();current=null;continue;}
    if(active&&/^##\s+/.test(line)){if(current)out.push(current);current={title:line.replace(/^##\s+/,'').trim(),body:[]};continue;}
    if(active&&current)current.body.push(line);
  }
  if(current)out.push(current);return out;
}
function extractH2(md,pattern){
  const lines=md.split(/\r?\n/);let current=null;
  for(const line of lines){
    if(/^##\s+/.test(line)){if(current&&pattern.test(current.title))return current;current={title:line.replace(/^##\s+/,'').trim(),body:[]};continue;}
    if(/^#\s+/.test(line)&&current){if(pattern.test(current.title))return current;current=null;}
    if(current)current.body.push(line);
  }
  return current&&pattern.test(current.title)?current:null;
}
function extractAtlas(md){
  const lines=md.split(/\r?\n/);let on=false,out=[];
  for(const line of lines){if(/^#\s+ATLAS\s*\/\s*AZAR/i.test(line)){on=true;continue;}if(on&&(/^##\s+XII\./i.test(line)||/^#\s+EPÍLOGO/i.test(line)))break;if(on)out.push(line);}return out;
}
function extractZero(md){
  const lines=md.split(/\r?\n/);let on=false,out=[];
  for(const line of lines){if(/^#\s+La habitación número cero/i.test(line)){on=true;continue;}if(on)out.push(line);}return out;
}

async function loadCorpus(){
  if(cache)return cache;
  const [rootRes,revRes]=await Promise.all([fetch(ROOT_SOURCE,{cache:'no-store'}),fetch(REVISED_SOURCE,{cache:'no-store'})]);
  if(!rootRes.ok||!revRes.ok)throw new Error('No se ha podido cargar el corpus de expansión');
  const [root,rev]=await Promise.all([rootRes.text(),revRes.text()]);
  const inv=sectionsByH2(root,'EL INVENTARIO DEL AIRE').slice(0,8);
  const som=sectionsByH2(root,'EL OFICIO DE LAS SOMBRAS').slice(0,9);
  const city=sectionsByH2(root,'LA CIUDAD QUE APRENDIÓ A OLVIDAR').slice(0,9);
  const x=extractH2(rev,/^X\.\s+EL ARCHIVO PROFUNDO/i),xi=extractH2(rev,/^XI\.\s+LA MÁQUINA DE LAS HUELLAS/i),xii=extractH2(rev,/^XII\.\s+EL RESONADOR/i),xiii=extractH2(rev,/^XIII\.\s+LA ÚLTIMA SALA/i);
  const atlas=extractAtlas(rev),zero=extractZero(root),map={};
  inv.forEach((s,i)=>map[`inv-${i+1}`]={title:s.title,lines:plainParagraphs(s.body.join('\n')),world:'house',kicker:'III · LA EXPANSIÓN · EL INVENTARIO DEL AIRE'});
  som.forEach((s,i)=>map[`som-${i+1}`]={title:s.title,lines:plainParagraphs(s.body.join('\n')),world:'train',kicker:'III · LA EXPANSIÓN · EL OFICIO DE LAS SOMBRAS'});
  city.forEach((s,i)=>map[`ciu-${i+1}`]={title:s.title,lines:plainParagraphs(s.body.join('\n')),world:'city',kicker:'III · LA EXPANSIÓN · LA CIUDAD QUE APRENDIÓ A OLVIDAR'});
  [[10,x],[11,xi],[12,xii],[13,xiii]].forEach(([n,s])=>{if(s)map[`ciu-${n}`]={title:s.title,lines:plainParagraphs(s.body.join('\n')),world:'archive',kicker:'IV · EL ARCHIVERO'};});
  map['ciu-14']={title:'ATLAS / AZAR',lines:plainParagraphs(atlas.join('\n')),world:'atlas',kicker:'V · EL CERO · DOCUMENTO RECUPERADO DEL ARCHIVO PROFUNDO',documental:true};
  map.zero={title:'La Habitación Número Cero',lines:plainParagraphs(zero.join('\n')),world:'zero',kicker:'V · EL CERO'};
  cache=map;return map;
}

function navigate(id){history.pushState({},'',`?read=${encodeURIComponent(id)}`);window.dispatchEvent(new CustomEvent('oras:route'));}
function adjacent(id){const i=EXPANSION_IDS.indexOf(id);return {prev:i>0?EXPANSION_IDS[i-1]:'espejo',next:i>=0&&i<EXPANSION_IDS.length-1?EXPANSION_IDS[i+1]:null};}
function sceneMarkup(id){
  const scene=expansionScene(id);if(!scene)return '';
  return `<div class="oras-expansion-scene is-${esc(scene.kind)}" data-expansion-scene data-motion="${esc(scene.motion)}" aria-hidden="true"><img src="${esc(scene.image)}" alt="" decoding="async"></div>`;
}
function bindVisible(host){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('is-visible')),{rootMargin:'0px 0px -10% 0px',threshold:.04});
  host.querySelectorAll('.oras-expansion-line').forEach(x=>io.observe(x));cleanupFns.push(()=>io.disconnect());
}
function bindSceneProgress(host){
  const shell=host.querySelector('.oras-expansion-shell');if(!shell)return;
  const update=()=>{scrollRAF=0;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const p=Math.max(0,Math.min(1,scrollY/max));shell.style.setProperty('--scene-progress',p.toFixed(4));};
  const onScroll=()=>{if(!scrollRAF)scrollRAF=requestAnimationFrame(update);};
  addEventListener('scroll',onScroll,{passive:true});cleanupFns.push(()=>removeEventListener('scroll',onScroll));update();
}
function unlockNextButtons(host,next){
  if(!next)return;const item=leaf(next);if(!item||!isUnlocked(item,loadState()))return;
  host.querySelectorAll('[data-next-expansion]').forEach(b=>{b.disabled=false;b.hidden=false;});
}
function bindEnd(host,id,next){
  const end=host.querySelector('[data-expansion-end]');if(!end)return;
  const io=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;markVisited(id);host.classList.add('is-complete');io.disconnect();unlockNextButtons(host,next);if(!next)host.querySelector('[data-finish-expansion]')?.removeAttribute('hidden');},{threshold:.55});
  io.observe(end);cleanupFns.push(()=>io.disconnect());
}

export async function renderExpansion(host,id=qid()){
  cleanupExpansion();clearAudioDock();
  const item=leaf(id),state=loadState();document.body.classList.add('oras-reading','oras-expansion-reading');host.hidden=false;
  if(!item||!EXPANSION_IDS.includes(id)||!isUnlocked(item,state)){
    host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>Esta parte del archivo todavía no está abierta.</p></div></section>`;
    host.querySelector('[data-index]')?.addEventListener('click',openIndex);return;
  }
  host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-loading">Abriendo el archivo…</div></section>`;
  host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  try{
    const corpus=await loadCorpus(),spec=corpus[id];if(!spec)throw new Error('Fragmento no localizado');
    const {prev,next}=adjacent(id),nextOpen=next&&isUnlocked(leaf(next),loadState());
    const prose=spec.lines.map((p,i)=>`<p class="oras-expansion-line" style="--i:${i}">${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
    const doc=spec.documental?'<div class="oras-document-stamp">DOCUMENTO RECUPERADO DEL ARCHIVO PROFUNDO</div>':'';
    host.innerHTML=`<section class="oras-expansion-shell is-${esc(spec.world)} ${spec.documental?'is-documental':''}">${sceneMarkup(id)}<header class="oras-reader-head oras-expansion-head"><span>${esc(spec.kicker)}</span><button data-index>Índice ORAS</button></header><article class="oras-expansion-copy">${doc}<p class="oras-expansion-kicker">${esc(spec.kicker)}</p><h1>${esc(item.title)}</h1>${prose}<div class="oras-read-end" data-expansion-end aria-hidden="true"></div>${next?`<button type="button" class="oras-expansion-next" data-next-expansion ${nextOpen?'':'hidden disabled'}>Seguir</button>`:'<button type="button" class="oras-expansion-next" data-finish-expansion hidden>Índice ORAS</button>'}</article><nav class="oras-reader-nav oras-expansion-nav"><button data-prev-expansion>Anterior</button><button data-index>Índice</button>${next?`<button data-next-expansion ${nextOpen?'':'disabled'}>Siguiente</button>`:'<button data-finish-expansion hidden>Índice ORAS</button>'}</nav><div class="oras-expansion-progress" aria-hidden="true"></div></section>`;
    host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
    host.querySelectorAll('[data-prev-expansion]').forEach(b=>b.addEventListener('click',()=>navigate(prev)));
    host.querySelectorAll('[data-next-expansion]').forEach(b=>b.addEventListener('click',()=>{if(!b.disabled&&next)navigate(next);}));
    host.querySelectorAll('[data-finish-expansion]').forEach(b=>b.addEventListener('click',openIndex));
    bindVisible(host);bindSceneProgress(host);bindEnd(host,id,next);
    mountAudioDock(host,id,{src:'./solo-la-tarjeta-fondo.mp3',loop:true,autoplay:true,label:spec.world==='zero'?'Cero':'Archivo'});
    scrollTo({top:0,left:0,behavior:'auto'});
  }catch(err){
    clearAudioDock();host.innerHTML=`<section class="oras-reader-shell"><header class="oras-reader-head"><span>ORAS</span><button data-index>Índice</button></header><div class="oras-reader-lock"><p>No se ha podido abrir este fragmento.</p><small>${esc(err.message)}</small></div></section>`;
    host.querySelector('[data-index]')?.addEventListener('click',openIndex);
  }
}
