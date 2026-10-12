(()=>{
'use strict';

const book=document.getElementById('book');
const stage=document.getElementById('photoStage');
if(!book||!stage)return;

const TRANSITIONS=['tr-down','tr-left','tr-fade','tr-up','tr-right','tr-flash'];
const PHOTOS={
  house:{
    house:'./assets-r2/i1-llegada.avif',
    entry:'./assets-r4/house/01-recibidor.webp',
    clock:'./assets-r4/house/02-reloj.webp',
    kitchen:'./assets-r4/house/03-cocina.webp',
    corridor:'./assets-r4/house/04-pasillo.webp',
    bedroom:'./assets-r4/house/05-dormitorio.webp',
    garden:'./assets-r4/house/06-jardin.webp',
    inventory:'./assets-r4/house/07-inventario.webp',
    exit:'./assets-r4/house/08-salida.webp'
  },
  train:{
    train:'./assets-r4/train/01-estacion.webp',
    station:'./assets-r4/train/01-estacion.webp',
    inspector:'./assets-r4/train/02-revisor.webp',
    shadows:'./assets-r4/train/03-sombras.webp',
    'row-seven':'./assets-r4/train/04-fila-siete.webp',
    conversation:'./assets-r4/train/05-conversacion.webp',
    'mobile-inventory':'./assets-r4/train/06-inventario-ausencias-moviles.webp',
    workshop:'./assets-r4/train/07-taller.webp',
    office:'./assets-r4/train/08-oficio.webp',
    'last-journey':'./assets-r4/train/09-ultimo-recorrido.webp'
  },
  city:{
    city:'./assets-r4/city/01-plaza.webp',
    plaza:'./assets-r4/city/01-plaza.webp',
    archivist:'./assets-r4/city/02-archivero.webp',
    fountain:'./assets-r4/city/03-fuente.webp',
    resisters:'./assets-r4/city/04-resistentes.webp',
    map:'./assets-r4/city/05-mapa-imposible.webp',
    theory:'./assets-r4/city/06-teoria.webp',
    museum:'./assets-r4/city/07-museo.webp',
    visitor:'./assets-r4/city/08-visitante.webp',
    winter:'./assets-r4/city/09-invierno.webp',
    'last-room':'./assets-r4/city/10-ultima-sala.webp'
  },
  zero:{zero:'./assets-r4/zero/01-habitacion-cero.webp'}
};

let panels=[];
let layers=[...stage.querySelectorAll('.photo-layer')];
let activeLayer=0;
let activePanel=null;
let resizeTimer=0;

function randomSeed(){
  const key='oras-r4-transition-seed';
  let n=Number(sessionStorage.getItem(key));
  if(!Number.isFinite(n)||!n){n=Math.floor(Math.random()*2147483646)+1;sessionStorage.setItem(key,String(n));}
  return n;
}
function randFactory(seed){let s=seed%2147483647;return()=>{s=s*16807%2147483647;return(s-1)/2147483646};}
const rnd=randFactory(randomSeed());
function nextTransition(prev){const choices=TRANSITIONS.filter(x=>x!==prev);return choices[Math.floor(rnd()*choices.length)]||'tr-fade';}

function panelMeta(panel){
  const heading=panel.querySelector('[data-chapter], [data-world-marker]');
  let world='house',chapter='house';
  if(heading){world=heading.dataset.chapterWorld||heading.dataset.worldMarker||world;chapter=heading.dataset.chapter||heading.dataset.worldMarker||world;}
  return{world,chapter};
}

function wrapPanels(){
  if(book.querySelector('.story-panel')){panels=[...book.querySelectorAll('.story-panel')];return;}
  const nodes=[...book.children];
  const frag=document.createDocumentFragment();
  let panel=null,pending=[],prevTr='';
  for(const node of nodes){
    const starts=node.matches('h1,h2,h3[data-chapter]');
    const isLabel=node.classList?.contains('volume-label');
    if(isLabel){pending.push(node);continue;}
    if(starts){
      panel=document.createElement('section');panel.className='story-panel';
      const copy=document.createElement('div');copy.className='panel-copy';
      pending.splice(0).forEach(n=>copy.appendChild(n));copy.appendChild(node);panel.appendChild(copy);
      const meta=panelMeta(panel);panel.dataset.world=meta.world;panel.dataset.chapter=meta.chapter;
      prevTr=nextTransition(prevTr);panel.dataset.transition=prevTr;frag.appendChild(panel);continue;
    }
    if(!panel){
      panel=document.createElement('section');panel.className='story-panel';
      const copy=document.createElement('div');copy.className='panel-copy';panel.appendChild(copy);
      prevTr=nextTransition(prevTr);panel.dataset.transition=prevTr;panel.dataset.world='house';panel.dataset.chapter='house';frag.appendChild(panel);
    }
    panel.querySelector('.panel-copy').appendChild(node);
  }
  pending.forEach(n=>panel?.querySelector('.panel-copy')?.appendChild(n));
  book.replaceChildren(frag);panels=[...book.querySelectorAll('.story-panel')];
  document.documentElement.classList.add('oras-reader-active');document.body.classList.add('oras-reader-active');
}

function splitWords(){
  for(const panel of panels){
    for(const el of [...panel.querySelectorAll('h1,h2,h3,.volume-label,p')]){
      if(el.dataset.displayReady)continue;
      const text=el.textContent||'';el.dataset.displayReady='1';el.setAttribute('aria-label',text);
      const words=text.trim().split(/\s+/).filter(Boolean);el.textContent='';
      words.forEach((w,i)=>{const s=document.createElement('span');s.className='display-word';s.textContent=w;el.appendChild(s);if(i<words.length-1)el.appendChild(document.createTextNode(' '));});
    }
  }
}

function assignTimings(){
  for(const panel of panels){
    const words=[...panel.querySelectorAll('.display-word')];let currentTop=null,row=-1,pos=0;
    for(const w of words){const top=Math.round(w.getBoundingClientRect().top);if(currentTop===null||Math.abs(top-currentTop)>3){currentTop=top;row++;pos=0;}const delay=row*.48+pos*.035;w.style.setProperty('--reveal-delay',delay.toFixed(3)+'s');pos++;}
  }
}

function setupReading(){
  const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-reading');io.unobserve(e.target);}}},{threshold:.55,rootMargin:'-4% 0px -4% 0px'});
  panels.forEach(p=>io.observe(p));
}

function resetLayer(layer){layer.className='photo-layer';layer.style.removeProperty('background-image');layer.style.removeProperty('background-position');layer.style.removeProperty('z-index');}
function photoFor(panel){const world=panel?.dataset.world||'house';const chapter=panel?.dataset.chapter||world;return PHOTOS[world]?.[chapter]||PHOTOS[world]?.[world]||'';}
function applyPanelPhoto(layer,panel){resetLayer(layer);const url=photoFor(panel);if(!url)return false;layer.style.backgroundImage=`url("${url}")`;layer.style.backgroundPosition='center center';return true;}
function preloadAround(panel){const i=panels.indexOf(panel);[i-1,i,i+1].forEach(n=>{const p=panels[n];if(!p)return;const u=photoFor(p);if(u){const img=new Image();img.decoding='async';img.src=u;}});}

function worldProgress(panel){const world=panel?.dataset.world||'house';const group=panels.filter(p=>(p.dataset.world||'house')===world);const index=Math.max(0,group.indexOf(panel));return group.length>1?index/(group.length-1):0;}
function syncWorldState(panel){
  if(!panel)return;const world=panel.dataset.world||'house';const chapter=panel.dataset.chapter||world;const progress=worldProgress(panel);
  document.body.dataset.world=world;document.body.dataset.chapter=chapter;
  document.documentElement.style.setProperty('--world-progress',progress.toFixed(4));
  document.documentElement.style.setProperty('--erosion',(world==='city'?progress:0).toFixed(4));
  document.documentElement.style.setProperty('--zero-progress',(world==='zero'?progress:0).toFixed(4));
  document.body.classList.toggle('final-withdrawal',world==='zero'&&progress>.78);
}

function refreshActivePhoto(){if(!activePanel)return;const layer=layers[activeLayer];const current=layer.classList.contains('bg-current');const ok=applyPanelPhoto(layer,activePanel);if(current)layer.classList.add('bg-current');document.body.classList.toggle('r4-photo-active',ok);}
function showBackground(panel){
  if(!panel)return;syncWorldState(panel);preloadAround(panel);if(panel===activePanel)return;activePanel=panel;
  const tr=panel.dataset.transition||'tr-fade';document.body.dataset.panelTransition=tr;
  const nextIndex=1-activeLayer,incoming=layers[nextIndex],outgoing=layers[activeLayer];
  const hasPhoto=applyPanelPhoto(incoming,panel);document.body.classList.toggle('r4-photo-active',hasPhoto);
  if(!hasPhoto){outgoing.classList.remove('bg-enter');outgoing.classList.add('bg-exit');setTimeout(()=>resetLayer(outgoing),1000);return;}
  incoming.classList.add('bg-enter',tr);incoming.style.zIndex='2';outgoing.classList.remove('bg-enter');outgoing.classList.add('bg-exit');outgoing.style.zIndex='1';
  setTimeout(()=>{resetLayer(outgoing);incoming.classList.remove('bg-enter',tr);incoming.classList.add('bg-current');incoming.style.zIndex='1';activeLayer=nextIndex;},1600);
}

function syncPanel(){
  if(!panels.length)return;const targetY=innerHeight*.5;let chosen=panels[0],best=Infinity;
  for(const p of panels){const r=p.getBoundingClientRect();const d=Math.abs((r.top+r.height*.5)-targetY);if(d<best){best=d;chosen=p;}}
  showBackground(chosen);
}

function start(){
  wrapPanels();splitWords();requestAnimationFrame(()=>requestAnimationFrame(()=>{assignTimings();setupReading();syncPanel();}));
  let pending=false;addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;syncPanel();});},{passive:true});
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{assignTimings();refreshActivePhoto();syncPanel();},180);},{passive:true});
}

if(book.classList.contains('ready'))start();else{const mo=new MutationObserver(()=>{if(book.classList.contains('ready')){mo.disconnect();start();}});mo.observe(book,{attributes:true,attributeFilter:['class']});}
})();