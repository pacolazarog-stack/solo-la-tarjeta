(()=>{
'use strict';
if(window.__cenicientoEntryR44)return;
window.__cenicientoEntryR44=true;

const entry=document.getElementById('entry');
const listen=document.getElementById('listen');
const read=document.getElementById('read');
const status=document.getElementById('status');
const voice=document.getElementById('voice');
const body=document.body;
if(!entry||!listen||!read||!voice)return;

let released=false;
let ticks=0;
let timer=0;

const entryIsVisible=()=>!entry.classList.contains('open');

const normalize=()=>{
  if(released||!entryIsVisible())return;

  /* Ningún modo puede estar activo antes de que el lector lo elija.
     Esto corrige restauraciones fantasma de Edge / scripts globales que
     dejaban body.voice y mostraban PAUSA/INICIO con la portada aún cerrada. */
  body.classList.remove('voice','read','revealing','mirror');

  listen.disabled=false;
  read.disabled=false;
  listen.removeAttribute('aria-disabled');
  read.removeAttribute('aria-disabled');
  entry.style.opacity='1';
  entry.style.visibility='visible';
  entry.style.pointerEvents='auto';
  if(status)status.textContent='listo';
};

const release=()=>{
  released=true;
  if(timer){clearInterval(timer);timer=0;}
  entry.style.opacity='';
  entry.style.visibility='';
  entry.style.pointerEvents='';
};

/* Debe funcionar aunque texto, voz o fotogramas sigan cargando: la propia
   lógica de Ceniciento gestiona esas cargas después de elegir modo. */
normalize();

timer=setInterval(()=>{
  if(!entryIsVisible())return release();
  normalize();
  ticks+=1;
  if(ticks>=20){clearInterval(timer);timer=0;}
},200);

listen.addEventListener('click',release,{capture:true,once:true});
read.addEventListener('click',release,{capture:true,once:true});

/* La portada no debe descargar el audio entero. */
voice.preload='metadata';
// R44 activation marker
})();