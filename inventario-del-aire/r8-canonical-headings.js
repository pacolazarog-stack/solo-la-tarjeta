(()=>{
'use strict';

const book=document.getElementById('book');
if(!book)return;

/*
  Orden canónico desde 2026-10-13:
  IX · Invierno
  X · El Archivo Profundo
  XI · La Máquina de las Huellas
  ATLAS / AZAR
  XII · El Resonador
  XIII · La última sala
  EPÍLOGO · La Habitación Número Cero
*/
const HEADINGS=new Map([
  ['## XI. LA MÁQUINA DE LAS HUELLAS',{chapter:'trace-machine',title:'XI. LA MÁQUINA DE LAS HUELLAS'}],
  ['# ATLAS / AZAR',{chapter:'atlas',title:'ATLAS / AZAR'}],
  ['## XII. EL RESONADOR',{chapter:'resonator',title:'XII. EL RESONADOR'}],
  ['## XIII. La última sala',{chapter:'last-room',title:'XIII. LA ÚLTIMA SALA'}],
  ['## XIII. LA ÚLTIMA SALA',{chapter:'last-room',title:'XIII. LA ÚLTIMA SALA'}]
]);

function normalizeR8Headings(){
  let changed=false;

  /* X sí lo reconoce el compositor antiguo como encabezado, pero aún no conoce
     la identidad semántica Archivo Profundo. La fijamos aquí sin depender del número. */
  for(const h of [...book.querySelectorAll('h3[data-chapter]')]){
    const text=(h.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
    if(/^X\.?\s+EL ARCHIVO PROFUNDO\b/.test(text)){
      h.dataset.chapter='deep-archive';
      h.dataset.chapterWorld='city';
      h.textContent='X. EL ARCHIVO PROFUNDO';
      changed=true;
    }
  }

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
  if(
    book.querySelector('[data-chapter="deep-archive"]')&&
    book.querySelector('[data-chapter="trace-machine"]')&&
    book.querySelector('[data-chapter="atlas"]')&&
    book.querySelector('[data-chapter="resonator"]')&&
    book.querySelector('[data-chapter="last-room"]')
  )mo.disconnect();
});
mo.observe(book,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});

})();
