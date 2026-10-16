(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261016-ana-direct-estrella-r4';
const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta',`${BASE}/estrella/`],
  ['elegia','Elegía breve para Ana Klaudya',`${BASE}/elegia-breve/`],
  ['ojos','En tus ojos',`${BASE}/ojos/`],
  ['labios','En tus labios',`${BASE}/sonrisa/`],
  ['cabello','Tu cabello',`${BASE}/cabello/`],
  ['piel','Tu piel',`${BASE}/piel/`],
  ['interludio','Interludio · Iba a llevarte flores',`${BASE}/interludio/`],
  ['epilogo','Epílogo · A fuego lento · Flores',`${BASE}/epilogo/`]
]);

const emptyParts=()=>Object.fromEntries(ANA_PARTS.map(([k])=>[k,false]));
function readState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
    saved.anaParts=Object.assign(emptyParts(),saved.anaParts&&typeof saved.anaParts==='object'?saved.anaParts:{});
    return saved;
  }catch(_){return {anaParts:emptyParts()};}
}
function writeState(patch){
  try{
    const next=Object.assign({},readState(),patch);
    localStorage.setItem(STORAGE,JSON.stringify(next));
    return next;
  }catch(_){return readState();}
}
const anaCount=parts=>ANA_PARTS.filter(([k])=>parts?.[k]===true).length;
const anaComplete=parts=>anaCount(parts)===ANA_PARTS.length;
function completeAnaPart(key){
  if(!ANA_PARTS.some(([k])=>k===key))return;
  const state=readState();
  if(state.anaParts[key]===true)return;
  const parts=Object.assign(emptyParts(),state.anaParts,{[key]:true});
  writeState({anaParts:parts,anaComplete:anaComplete(parts)});
}

const style=document.createElement('style');
style.id='oras-reading-window-stable-r3';
style.textContent=`
.ou-reading-checklist{display:none!important}
.ou-reading-window-r2{position:fixed;z-index:2147483000;left:max(62px,calc(env(safe-area-inset-left) + 62px));bottom:max(12px,env(safe-area-inset-bottom));font-family:Georgia,"Times New Roman",serif;color:#f7f1e8}
.ou-reading-window-r2>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:7px;min-height:31px;padding:6px 11px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(13,13,13,.72);color:#f7f1e8;box-shadow:0 5px 18px rgba(0,0,0,.14);font:500 12px/1.2 Georgia,"Times New Roman",serif}
.ou-reading-window-r2>summary::-webkit-details-marker{display:none}
.ou-reading-window-r2>summary::before{content:"";width:5px;height:5px;border-radius:50%;background:#e9cf91}
.ou-reading-window-r2 .ou-rw-panel{display:none!important}
body.mirror .ou-reading-window-r2{display:none!important}
@media(max-width:700px){.ou-reading-window-r2{left:max(57px,calc(env(safe-area-inset-left) + 57px));bottom:max(10px,env(safe-area-inset-bottom))}.ou-reading-window-r2>summary{font-size:11px;min-height:29px;padding:5px 9px}}
`;
document.head.appendChild(style);

let box=document.querySelector('.ou-reading-window-r2');
if(!box){
  box=document.createElement('details');
  box.className='ou-reading-window-r2';
  box.innerHTML='<summary>Índice ORAS</summary><div class="ou-rw-panel" aria-hidden="true"></div>';
  document.body.appendChild(box);
}
box.setAttribute('aria-label','Índice canónico de ORAS');

function openIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  let script=document.querySelector('script[data-oras-master-index-global]');
  if(!script){
    script=document.createElement('script');
    script.dataset.orasMasterIndexGlobal='1';
    script.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;
    script.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
    document.head.appendChild(script);
  }
}
const summary=box.querySelector('summary');
summary.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openIndex();});
document.addEventListener('click',e=>{
  const a=e.target.closest?.('a');
  if(!a)return;
  const label=(a.textContent||'').trim().toLowerCase();
  if(label==='índice'||label==='indice'||label==='índice oras'||label==='indice oras'){
    e.preventDefault();openIndex();
  }
});

function observeEnd(selector,key,ratio=.55){
  const target=[...document.querySelectorAll(selector)].at(-1);
  if(!target||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>{
    if(entries.some(x=>x.isIntersecting&&x.intersectionRatio>=ratio)){
      io.disconnect();completeAnaPart(key);
    }
  },{threshold:[ratio,.8,1]});
  io.observe(target);
}
function setupTracking(){
  const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
  if(path.endsWith('/estrella'))observeEnd('.phrase','estrella');
  if(path.endsWith('/ojos'))observeEnd('.line','ojos');
  if(path.endsWith('/sonrisa'))observeEnd('.line','labios');
  if(path.endsWith('/cabello'))observeEnd('.line','cabello');
  if(path.endsWith('/piel'))observeEnd('.line','piel');
  if(path.endsWith('/epilogo')){
    const flowers=document.getElementById('flowerCoda');
    if(flowers){
      const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};
      new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});mark();
    }
  }
  if(path.endsWith('/elegia-breve')){
    const markElegia=()=>{
      const b=document.body;if(!b)return;
      if(b.classList.contains('portrait-revealed')) completeAnaPart('elegia');
    };
    new MutationObserver(markElegia).observe(document.body,{attributes:true,attributeFilter:['class']});
    markElegia();
  }
  addEventListener('message',e=>{
    if(e.origin!==location.origin)return;
    if(e.data?.channel==='ceniciento-music-v1'&&e.data?.type==='interlude-ended')completeAnaPart('interludio');
  });
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}

function stabilizeDirectAnaRoute(){
  const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
  if(!path.endsWith('/elegia-breve'))return;
  const frame=document.getElementById('cenicientoFrame');
  if(!frame)return;
  const directPieces=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
  let applying=false;
  const clearForce=()=>{
    frame.style.removeProperty('display');
    frame.style.removeProperty('opacity');
    frame.style.removeProperty('visibility');
    frame.style.removeProperty('pointer-events');
    frame.style.removeProperty('z-index');
  };
  const enforce=()=>{
    if(applying)return;
    const piece=location.hash.slice(1);
    if(!directPieces.has(piece)){clearForce();return;}
    applying=true;
    try{
      frame.hidden=false;
      frame.classList.add('sonrisa-transition','sonrisa-visible');
      frame.style.setProperty('display','block','important');
      frame.style.setProperty('opacity','1','important');
      frame.style.setProperty('visibility','visible','important');
      frame.style.setProperty('pointer-events','auto','important');
      frame.style.setProperty('z-index','2147482000','important');
      const expected=`/${piece}/`;
      const src=frame.getAttribute('src')||'';
      if(!src || !src.includes(expected)){
        frame.setAttribute('src',`../${piece}/?music=parent&v=20261016-direct-route-r4`);
      }
    }finally{applying=false;}
  };
  const observer=new MutationObserver(()=>queueMicrotask(enforce));
  observer.observe(frame,{attributes:true,attributeFilter:['hidden','class','style','src']});
  frame.addEventListener('load',enforce);
  addEventListener('hashchange',enforce);
  addEventListener('popstate',enforce);
  enforce();
  setTimeout(enforce,0);
  setTimeout(enforce,250);
  setTimeout(enforce,800);
  setTimeout(enforce,1800);
  setTimeout(enforce,3500);
}

setupTracking();
stabilizeDirectAnaRoute();
addEventListener('storage',e=>{if(e.key===STORAGE){/* state is read lazily by the canonical index */}});
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};

if(location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')==='/solo-la-tarjeta'&&!window.__orasMasterIndexLoader){
  window.__orasMasterIndexLoader=true;
  const script=document.createElement('script');
  script.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;
  script.async=false;
  document.head.appendChild(script);
}
})();
