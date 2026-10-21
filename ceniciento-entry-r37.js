(()=>{
'use strict';
if(window.__cenicientoEntryR37)return;
window.__cenicientoEntryR37=true;

const fromAna=new URLSearchParams(location.search).get('from')==='ana-r37';
if(!fromAna)return;

const listen=document.getElementById('listen');
const read=document.getElementById('read');
const status=document.getElementById('status');
const voice=document.getElementById('voice');
const entry=document.getElementById('entry');
if(!listen||!read||!voice)return;

/* La portada debe responder inmediatamente al llegar desde ANA.
   Las imágenes de edad pueden terminar de decodificarse en segundo plano. */
read.disabled=false;
listen.disabled=false;
if(status)status.textContent='listo';

let guard=0;
const keepReady=()=>{
  if(document.body.classList.contains('voice')||document.body.classList.contains('read'))return;
  read.disabled=false;
  listen.disabled=false;
  if(status&&/cargando voz|cargando/i.test(status.textContent||''))status.textContent='listo';
  if(++guard<120)requestAnimationFrame(keepReady);
};
requestAnimationFrame(keepReady);

/* Si el audio aún no tiene metadatos, no bloqueamos el botón: el propio play()
   resolverá en cuanto haya buffer suficiente. */
voice.preload='metadata';

listen.addEventListener('click',()=>{
  if(status)status.textContent='preparando voz';
},{capture:true,passive:true});

read.addEventListener('click',()=>{
  if(status)status.textContent='lectura sin voz';
},{capture:true,passive:true});

/* Elimina el parámetro de tránsito después de cargar, sin recargar la página. */
setTimeout(()=>{
  try{history.replaceState(null,'',location.pathname+'?v=20261021-r37') }catch(_){}
},1200);
})();