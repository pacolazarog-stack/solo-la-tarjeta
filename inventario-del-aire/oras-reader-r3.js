(()=>{
'use strict';

const book=document.getElementById('book');
const stage=document.getElementById('photoStage');
if(!book||!stage)return;

const TRANSITIONS=['tr-down','tr-left','tr-fade','tr-up','tr-right','tr-flash'];
const ASSETS={
  house:{house:'asset-house-arrival',entry:'asset-house-entry',clock:'asset-house-clock',kitchen:'asset-house-kitchen',corridor:'asset-house-corridor',bedroom:'asset-house-bedroom',garden:'asset-house-garden',inventory:'asset-house-inventory',exit:'asset-house-exit'},
  train:{train:'asset-train-station',station:'asset-train-station',inspector:'asset-train-inspector',shadows:'asset-train-shadows','row-seven':'asset-train-row-seven',conversation:'asset-train-conversation','mobile-inventory':'asset-train-mobile-inventory',workshop:'asset-train-workshop',office:'asset-train-office','last-journey':'asset-train-last-journey'},
  city:{city:'asset-city-plaza',plaza:'asset-city-plaza',archivist:'asset-city-archivist',fountain:'asset-city-fountain',resisters:'asset-city-resisters',map:'asset-city-map',theory:'asset-city-theory',museum:'asset-city-museum',visitor:'asset-city-visitor',winter:'asset-city-winter','last-room':'asset-city-last-room'},
  zero:{zero:null}
};

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
      frag.appendChild(panel);
    }
    panel.querySelector('.panel-copy').appendChild(node);
  }
  pending.forEach(n=>panel?.querySelector('.panel-copy')?.appendChild(n));
  book.replaceChildren(frag);
  panels=[...book.querySelectorAll('.story-panel')];
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
  },{threshold:.28,rootMargin:'-8% 0px -8% 0px'});
  panels.forEach(p=>io.observe(p));
}

function showBackground(panel){
  if(!panel||panel===activePanel)return;
  activePanel=panel;
  const asset=panel.dataset.asset||'';
  const tr=panel.dataset.transition||'tr-fade';
  document.body.dataset.panelTransition=tr;

  if(!asset){
    const old=layers[activeLayer];
    old.classList.add('bg-exit');
    setTimeout(()=>{old.className='photo-layer'},1150);
    return;
  }

  const nextIndex=1-activeLayer;
  const incoming=layers[nextIndex];
  const outgoing=layers[activeLayer];
  incoming.className='photo-layer '+asset+' bg-enter '+tr;
  incoming.style.zIndex='2';
  outgoing.classList.remove('bg-enter');
  outgoing.classList.add('bg-exit');
  outgoing.style.zIndex='1';

  setTimeout(()=>{
    outgoing.className='photo-layer';
    incoming.className='photo-layer '+asset+' bg-current';
    incoming.style.zIndex='1';
    activeLayer=nextIndex;
  },1700);
}

function syncPanel(){
  if(!panels.length)return;
  const y=scrollY+innerHeight*.48;
  let chosen=panels[0];
  for(const p of panels){
    if(p.offsetTop<=y)chosen=p;
    else break;
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
    resizeTimer=setTimeout(assignTimings,180);
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