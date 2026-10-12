(()=>{
'use strict';

const book=document.getElementById('book');
const stage=document.getElementById('photoStage');
if(!book||!stage)return;

const TRANSITIONS=['tr-down','tr-left','tr-fade','tr-up','tr-right','tr-flash'];
const ASSETS={
  house:{house:'asset-house-arrival',entry:'asset-house-entry',clock:'asset-house-clock',kitchen:'asset-house-kitchen',corridor:'asset-house-corridor',bedroom:'asset-house-bedroom',garden:'asset-house-garden',inventory:'asset-house-inventory',exit:'asset-house-exit'},
  zero:{zero:null}
};

/* Sprites fotográficos aportados para R3.
   Cada tira conserva el orden narrativo de sus capítulos. */
const SPRITE_INDEX={
  train:{train:0,station:0,inspector:1,shadows:2,'row-seven':3,conversation:4,'mobile-inventory':5,workshop:6,office:7,'last-journey':8},
  city:{city:0,plaza:0,archivist:1,fountain:2,resisters:3,map:4,theory:5,museum:6,visitor:7,winter:8,'last-room':9}
};
const SPRITE_COUNT={train:9,city:10};
const TILE_RATIO=426/240;

let panels=[];
let layers=[...stage.querySelectorAll('.photo-layer')];
let activeLayer=0;
let activePanel=null;
let resizeTimer=0;

function randomSeed(){
  const key='oras-r3-transition-seed';
  let n=Number(sessionStorage.getItem(key));
  if(!Number.isFinite(n)||!n){
    n=Math.floor(Math.random()*2147483646)+1;
    sessionStorage.setItem(key,String(n));
  }
  return n;
}
function randFactory(seed){
  let s=seed%2147483647;
  return ()=>{s=s*16807%2147483647;return (s-1)/2147483646};
}
const rnd=randFactory(randomSeed());
function nextTransition(prev){
  const choices=TRANSITIONS.filter(x=>x!==prev);
  return choices[Math.floor(rnd()*choices.length)]||'tr-fade';
}

function panelMeta(panel){
  const heading=panel.querySelector('[data-chapter], [data-world-marker]');
  let world='house',chapter='house';
  if(heading){
    world=heading.dataset.chapterWorld||heading.dataset.worldMarker||world;
    chapter=heading.dataset.chapter||heading.dataset.worldMarker||world;
  }
  return {world,chapter,asset:ASSETS[world]?.[chapter]||null};
}

function wrapPanels(){
  if(book.querySelector('.story-panel'))return;
  const nodes=[...book.children];
  const frag=document.createDocumentFragment();
  let panel=null;
  let pending=[];
  let prevTr='';

  for(const node of nodes){
    const starts=node.matches('h1,h2,h3[data-chapter]');
    const isLabel=node.classList?.contains('volume-label');
    if(isLabel){pending.push(node);continue}
    if(starts){
      panel=document.createElement('section');
      panel.className='story-panel';
      const copy=document.createElement('div');
      copy.className='panel-copy';
      pending.splice(0).forEach(n=>copy.appendChild(n));
      copy.appendChild(node);
      panel.appendChild(copy);
      const meta=panelMeta(panel);
      panel.dataset.world=meta.world;
      panel.dataset.chapter=meta.chapter;
      if(meta.asset)panel.dataset.asset=meta.asset;
      prevTr=nextTransition(prevTr);
      panel.dataset.transition=prevTr;
      frag.appendChild(panel);
      continue;
    }
    if(!panel){
      panel=document.createElement('section');
      panel.className='story-panel';
      const copy=document.createElement('div');
      copy.className='panel-copy';
      panel.appendChild(copy);
      prevTr=nextTransition(prevTr);
      panel.dataset.transition=prevTr;
      panel.dataset.world='house';
      panel.dataset.chapter='house';
      frag.appendChild(panel);
    }
    panel.querySelector('.panel-copy').appendChild(node);
  }
  pending.forEach(n=>panel?.querySelector('.panel-copy')?.appendChild(n));
  book.replaceChildren(frag);
  panels=[...book.querySelectorAll('.story-panel')];
  document.documentElement.classList.add('oras-reader-active');
  document.body.classList.add('oras-reader-active');
}

function splitWords(){
  for(const panel of panels){
    const els=[...panel.querySelectorAll('h1,h2,h3,.volume-label,p')];
    for(const el of els){
      if(el.dataset.displayReady)continue;
      const text=el.textContent||'';
      el.dataset.displayReady='1';
      el.setAttribute('aria-label',text);
      const words=text.trim().split(/\s+/).filter(Boolean);
      el.textContent='';
      words.forEach((w,i)=>{
        const s=document.createElement('span');
        s.className='display-word';
        s.textContent=w;
        el.appendChild(s);
        if(i<words.length-1)el.appendChild(document.createTextNode(' '));
      });
    }
  }
}

function assignTimings(){
  for(const panel of panels){
    const words=[...panel.querySelectorAll('.display-word')];
    let currentTop=null,row=-1,pos=0;
    for(const w of words){
      const top=Math.round(w.getBoundingClientRect().top);
      if(currentTop===null||Math.abs(top-currentTop)>3){currentTop=top;row++;pos=0}
      const delay=row*.48+pos*.035;
      w.style.setProperty('--reveal-delay',delay.toFixed(3)+'s');
      pos++;
    }
  }
}

function setupReading(){
  const io=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(e.isIntersecting){
        e.target.classList.add('is-reading');
        io.unobserve(e.target);
      }
    }
  },{threshold:.55,rootMargin:'-4% 0px -4% 0px'});
  panels.forEach(p=>io.observe(p));
}

function resetLayer(layer){
  layer.className='photo-layer';
  layer.style.removeProperty('background-image');
  layer.style.removeProperty('background-size');
  layer.style.removeProperty('background-position');
  layer.style.removeProperty('z-index');
}

function spriteBase64(world){
  if(world==='train')return window.ORAS_TRAIN_SPRITE_B64||'';
  if(world==='city')return window.ORAS_CITY_SPRITE_B64||'';
  return '';
}

function applySprite(layer,world,chapter){
  const idx=SPRITE_INDEX[world]?.[chapter];
  const count=SPRITE_COUNT[world];
  const b64=spriteBase64(world);
  if(idx==null||!count||!b64)return false;

  const rect=layer.getBoundingClientRect();
  const h=rect.height||innerHeight*1.04;
  const w=rect.width||innerWidth*1.04;
  const tileW=h*TILE_RATIO;
  const totalW=count*tileW;
  const x=w/2-(idx+.5)*tileW;

  layer.style.backgroundImage=`url("data:image/avif;base64,${b64}")`;
  layer.style.backgroundSize=`${totalW.toFixed(1)}px ${h.toFixed(1)}px`;
  layer.style.backgroundPosition=`${x.toFixed(1)}px center`;
  return true;
}

function applyPanelPhoto(layer,panel){
  resetLayer(layer);
  const world=panel?.dataset.world||'house';
  const chapter=panel?.dataset.chapter||world;
  const asset=panel?.dataset.asset||'';

  if(world==='train'||world==='city')return applySprite(layer,world,chapter);
  if(world==='house'&&asset){
    layer.classList.add(asset);
    return true;
  }
  return false;
}

function worldProgress(panel){
  const world=panel?.dataset.world||'house';
  const group=panels.filter(p=>(p.dataset.world||'house')===world);
  const index=Math.max(0,group.indexOf(panel));
  return group.length>1?index/(group.length-1):0;
}

function syncWorldState(panel){
  if(!panel)return;
  const world=panel.dataset.world||'house';
  const chapter=panel.dataset.chapter||world;
  const progress=worldProgress(panel);
  document.body.dataset.world=world;
  document.body.dataset.chapter=chapter;
  document.documentElement.style.setProperty('--world-progress',progress.toFixed(4));
  document.documentElement.style.setProperty('--erosion',(world==='city'?progress:0).toFixed(4));
  document.documentElement.style.setProperty('--zero-progress',(world==='zero'?progress:0).toFixed(4));
  document.body.classList.toggle('final-withdrawal',world==='zero'&&progress>.78);
}

function refreshActivePhoto(){
  if(!activePanel)return;
  const layer=layers[activeLayer];
  const hadCurrent=layer.classList.contains('bg-current');
  const ok=applyPanelPhoto(layer,activePanel);
  if(hadCurrent)layer.classList.add('bg-current');
  document.body.classList.toggle('r3-photo-active',ok);
}

function showBackground(panel){
  if(!panel)return;
  syncWorldState(panel);
  if(panel===activePanel)return;
  activePanel=panel;
  const tr=panel.dataset.transition||'tr-fade';
  document.body.dataset.panelTransition=tr;

  const nextIndex=1-activeLayer;
  const incoming=layers[nextIndex];
  const outgoing=layers[activeLayer];
  const hasPhoto=applyPanelPhoto(incoming,panel);
  document.body.classList.toggle('r3-photo-active',hasPhoto);

  if(!hasPhoto){
    outgoing.classList.remove('bg-enter');
    outgoing.classList.add('bg-exit');
    setTimeout(()=>resetLayer(outgoing),1150);
    return;
  }

  incoming.classList.add('bg-enter',tr);
  incoming.style.zIndex='2';
  outgoing.classList.remove('bg-enter');
  outgoing.classList.add('bg-exit');
  outgoing.style.zIndex='1';

  setTimeout(()=>{
    resetLayer(outgoing);
    incoming.classList.remove('bg-enter',tr);
    incoming.classList.add('bg-current');
    incoming.style.zIndex='1';
    activeLayer=nextIndex;
  },1700);
}

function syncPanel(){
  if(!panels.length)return;
  const targetY=innerHeight*.5;
  let chosen=panels[0];
  let best=Infinity;
  for(const p of panels){
    const r=p.getBoundingClientRect();
    const d=Math.abs((r.top+r.height*.5)-targetY);
    if(d<best){best=d;chosen=p}
  }
  showBackground(chosen);
}

function start(){
  wrapPanels();
  splitWords();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    assignTimings();
    setupReading();
    syncPanel();
  }));
  let pending=false;
  addEventListener('scroll',()=>{
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;syncPanel()});
  },{passive:true});
  addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      assignTimings();
      refreshActivePhoto();
      syncPanel();
    },180);
  },{passive:true});
}

if(book.classList.contains('ready'))start();
else{
  const mo=new MutationObserver(()=>{
    if(book.classList.contains('ready')){mo.disconnect();start()}
  });
  mo.observe(book,{attributes:true,attributeFilter:['class']});
}
})();