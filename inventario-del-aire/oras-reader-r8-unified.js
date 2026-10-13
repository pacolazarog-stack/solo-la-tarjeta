(()=>{
'use strict';

/* EL INVENTARIO DEL AIRE · R8.2
   Ritmo textual unificado + continuidad de fraseo en la costura X–XIII.
   No cambia una sola palabra del canon: sólo recompone visualmente los bloques. */

const book=document.getElementById('book');
if(!book)return;

const REFLOW_CHAPTERS=new Set(['last-room','deep-archive','trace-machine','resonator']);
const EMPHASIS=new Set([
  'La máquina no explicaba. Relacionaba.',
  'Ella siempre cosía los botones dos veces.',
  'Incluso una ausencia necesita una huella.'
]);

let raf=0;
let resizeTimer=0;

function originalText(p){return (p.getAttribute('aria-label')||p.textContent||'').replace(/\s+/g,' ').trim();}

function isEmphasis(text){
  if(EMPHASIS.has(text))return true;
  if(/^\[[A-ZÁÉÍÓÚÜÑ0-9 .·_-]+\]$/.test(text))return true;
  if(text.length<90&&/^[A-ZÁÉÍÓÚÜÑ0-9 .·,:;_-]+$/.test(text)&&/[A-ZÁÉÍÓÚÜÑ]{4}/.test(text))return true;
  return false;
}

function splitSentences(text){
  const out=text.match(/[^.!?…]+(?:[.!?…]+[»”"']*|$)/g);
  return (out||[text]).map(s=>s.trim()).filter(Boolean);
}

function splitLong(text,max=340){
  if(text.length<=430)return[text];
  const sentences=splitSentences(text);
  const groups=[];
  let current='';
  for(const s of sentences){
    if(current&&current.length+1+s.length>max){groups.push(current);current=s;}
    else current=current?current+' '+s:s;
  }
  if(current)groups.push(current);
  if(groups.length>1&&groups.at(-1).length<105){
    const tail=groups.pop();
    groups[groups.length-1]+=' '+tail;
  }
  return groups;
}

function rebalance(texts){
  const units=[];
  for(const text of texts){
    if(isEmphasis(text)){units.push({text,hard:true});continue;}
    splitLong(text).forEach(t=>units.push({text:t,hard:false}));
  }

  const out=[];
  let current='';
  const flush=()=>{if(current){out.push(current.trim());current='';}};

  for(const unit of units){
    if(unit.hard){flush();out.push(unit.text);continue;}
    if(!current){current=unit.text;continue;}
    const combined=current.length+1+unit.text.length;
    if(current.length<145&&combined<=385){current+=' '+unit.text;continue;}
    if(combined<=285){current+=' '+unit.text;continue;}
    flush();current=unit.text;
  }
  flush();
  return out;
}

function spanWords(el,text){
  el.dataset.displayReady='1';
  el.setAttribute('aria-label',text);
  el.textContent='';
  const words=text.trim().split(/\s+/).filter(Boolean);
  words.forEach((w,i)=>{
    const s=document.createElement('span');
    s.className='display-word';
    s.textContent=w;
    el.appendChild(s);
    if(i<words.length-1)el.appendChild(document.createTextNode(' '));
  });
}

function normalizeSeamParagraphs(){
  for(const panel of [...book.querySelectorAll('.story-panel')]){
    if(!REFLOW_CHAPTERS.has(panel.dataset.chapter)||panel.dataset.r8Paragraphs==='1')continue;
    const copy=panel.querySelector(':scope > .panel-copy');
    if(!copy)continue;
    const old=[...copy.children].filter(el=>el.tagName==='P'&&!el.classList.contains('atlas-r6-margin'));
    if(!old.length)continue;
    const texts=old.map(originalText).filter(Boolean);
    const balanced=rebalance(texts);
    const heading=[...copy.children].find(el=>/^H[1-3]$/.test(el.tagName));
    if(!heading||!balanced.length)continue;

    old.forEach(p=>p.remove());
    let anchor=heading;
    for(const text of balanced){
      const p=document.createElement('p');
      p.className='r8-balanced-paragraph';
      spanWords(p,text);
      anchor.insertAdjacentElement('afterend',p);
      anchor=p;
    }
    panel.dataset.r8Paragraphs='1';
  }
}

function relocatePersistentEchoes(){
  for(const echo of [...book.querySelectorAll('.story-panel > .atlas-r7-echo')]){
    const copy=echo.parentElement?.querySelector(':scope > .panel-copy');
    if(copy)copy.appendChild(echo);
  }
}

function assignUnifiedTimings(){
  normalizeSeamParagraphs();
  relocatePersistentEchoes();
  const panels=[...book.querySelectorAll('.story-panel:not(.atlas-panel)')];
  for(const panel of panels){
    const words=[...panel.querySelectorAll('.display-word')];
    if(!words.length)continue;

    let lastTop=null;
    let row=-1;
    let pos=0;
    let lastElement=null;
    let blockGap=0;

    for(const word of words){
      const parent=word.parentElement;
      const top=Math.round(word.getBoundingClientRect().top);
      const newRow=lastTop===null||Math.abs(top-lastTop)>3;
      const newBlock=parent!==lastElement;

      if(newBlock&&lastElement)blockGap+=.060;
      if(newRow){row++;pos=0;lastTop=top;}

      const delay=Math.min(6.2,.07+blockGap+(row*.100)+(pos*.013));
      word.style.setProperty('--reveal-delay',delay.toFixed(3)+'s');
      pos++;
      lastElement=parent;
    }
  }
}

function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(assignUnifiedTimings));
}

function ready(){return book.querySelector('.story-panel .display-word');}

if(ready())schedule();

const mo=new MutationObserver(()=>{
  if(ready())schedule();
});
mo.observe(book,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(schedule,210);
},{passive:true});

if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});

})();
