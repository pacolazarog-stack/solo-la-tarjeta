(()=>{
'use strict';

const book=document.getElementById('book');
if(!book)return;

const HEADINGS=new Map([
  ['## XI. EL ARCHIVO PROFUNDO',{chapter:'deep-archive',title:'XI. EL ARCHIVO PROFUNDO'}],
  ['## XII. LA MÁQUINA DE LAS HUELLAS',{chapter:'trace-machine',title:'XII. LA MÁQUINA DE LAS HUELLAS'}],
  ['# ATLAS / AZAR',{chapter:'atlas',title:'ATLAS / AZAR'}],
  ['## XIII. EL RESONADOR',{chapter:'resonator',title:'XIII. EL RESONADOR'}]
]);

function normalizeR8Headings(){
  let changed=false;
  for(const p of [...book.querySelectorAll('p')]){
    const key=(p.textContent||'').trim();
    const spec=HEADINGS.get(key);
    if(!spec)continue;
    const h=document.createElement('h3');
    h.dataset.chapter=spec.chapter;
    h.dataset.chapterWorld='city';
    h.textContent=spec.title;
    p.replaceWith(h);
    changed=true;
  }
  return changed;
}

function run(){normalizeR8Headings();}

if(book.classList.contains('ready'))run();
const mo=new MutationObserver(()=>{
  if(!book.classList.contains('ready'))return;
  run();
  if(book.querySelector('[data-chapter="deep-archive"]')&&book.querySelector('[data-chapter="trace-machine"]')&&book.querySelector('[data-chapter="atlas"]')&&book.querySelector('[data-chapter="resonator"]'))mo.disconnect();
});
mo.observe(book,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});

})();
