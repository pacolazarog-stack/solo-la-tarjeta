(()=>{
'use strict';

const book=document.getElementById('book');
if(!book)return;

/*
  Orden canónico desde 2026-10-13:
  IX · Invierno
  X · El Archivo Profundo
  XI · La Máquina de las Huellas
  XII · El Resonador
  XIII · La última sala
  ATLAS / AZAR · interludio documental
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


function ensureAtlasLabel(atlas){
  if(atlas.nextElementSibling?.dataset?.orasAtlasDocument==='1')return;
  const p=document.createElement('p');
  p.dataset.orasAtlasDocument='1';
  p.textContent='Documento recuperado del Archivo Profundo.';
  p.style.cssText='margin:.2rem 0 1.35rem;font-style:italic;opacity:.62;letter-spacing:.03em';
  atlas.insertAdjacentElement('afterend',p);
}
function placeAtlasAfterLastRoom(){
  const atlas=book.querySelector('h3[data-chapter="atlas"]');
  const last=book.querySelector('h3[data-chapter="last-room"]');
  if(!atlas||!last)return false;
  const headings=[...book.querySelectorAll('h3[data-chapter]')];
  const ai=headings.indexOf(atlas), li=headings.indexOf(last);
  if(ai===li+1){ensureAtlasLabel(atlas);return false;}
  const block=[];
  let node=atlas;
  while(node){
    const next=node.nextSibling;
    block.push(node);
    node=next;
    if(node?.nodeType===1 && node.matches?.('h3[data-chapter]'))break;
  }
  const refreshed=[...book.querySelectorAll('h3[data-chapter]')];
  const lastNow=book.querySelector('h3[data-chapter="last-room"]');
  const anchor=refreshed[refreshed.indexOf(lastNow)+1]||null;
  for(const n of block)book.insertBefore(n,anchor);
  ensureAtlasLabel(atlas);
  return true;
}

function run(){normalizeR8Headings();placeAtlasAfterLastRoom();}

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
