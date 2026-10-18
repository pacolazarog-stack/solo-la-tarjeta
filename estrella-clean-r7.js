(()=>{
'use strict';
if(window.__orasStarCleanR8)return;
window.__orasStarCleanR8=true;
document.body?.classList.add('oras-star-clean-r8-compatible');

const params=new URLSearchParams(location.search);
const parentMode=params.get('music')==='parent' && window.parent!==window;
if(!parentMode)return;

/* La música pertenece al documento ANA y no al iframe del prólogo. */
const local=document.getElementById('orasStarMusic');
if(local){
  try{local.pause();local.currentTime=0;}catch(_){}
  local.muted=true;
}

/* El botón Siguiente no navega: pide al padre la transición de 5 s. */
const next=document.getElementById('next');
if(next){
  next.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    window.parent.postMessage({channel:'oras-star-flow-v1',type:'complete'},location.origin);
  },true);
}

/* Anterior vuelve a SOLO desde el documento superior. */
const prev=document.getElementById('prev');
if(prev){
  prev.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    window.parent.location.href='/solo-la-tarjeta/?read=solo';
  },true);
}
})();