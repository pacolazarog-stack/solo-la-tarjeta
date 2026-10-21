(()=>{
'use strict';
if(window.__cenicientoEntryR38)return;
window.__cenicientoEntryR38=true;

const from=new URLSearchParams(location.search).get('from')||'';
const fromAna=/^ana-r\d+$/i.test(from);
if(!fromAna)return;

const entry=document.getElementById('entry');
const listen=document.getElementById('listen');
const read=document.getElementById('read');
const status=document.getElementById('status');
const voice=document.getElementById('voice');
if(!entry||!listen||!read||!voice)return;

/* Entrada de rescate: desde cualquier versión de ANA, Ceniciento debe mostrar
   inmediatamente su portada y no esperar a audio, texto o frames. */
const showEntry=()=>{
  if(document.body.classList.contains('voice')||document.body.classList.contains('read'))return;
  entry.classList.remove('open');
  entry.style.opacity='1';
  entry.style.visibility='visible';
  entry.style.pointerEvents='auto';
  listen.disabled=false;
  read.disabled=false;
  if(status)status.textContent='listo';
};
showEntry();

/* El código legado puede volver a marcar botones o portada durante la precarga.
   Hasta que el lector elija modo, mantenemos la portada operativa. */
const observer=new MutationObserver(showEntry);
observer.observe(entry,{attributes:true,attributeFilter:['class','style']});
observer.observe(listen,{attributes:true,attributeFilter:['disabled']});
observer.observe(read,{attributes:true,attributeFilter:['disabled']});

let rafCount=0;
const guard=()=>{
  showEntry();
  if(++rafCount<240&&!document.body.classList.contains('voice')&&!document.body.classList.contains('read'))requestAnimationFrame(guard);
};
requestAnimationFrame(guard);

const release=()=>{
  observer.disconnect();
  entry.style.opacity='';
  entry.style.visibility='';
  entry.style.pointerEvents='';
};
listen.addEventListener('click',()=>{release();if(status)status.textContent='preparando voz';},{capture:true,once:true});
read.addEventListener('click',()=>{release();if(status)status.textContent='lectura sin voz';},{capture:true,once:true});

voice.preload='metadata';

setTimeout(()=>{
  try{history.replaceState(null,'',location.pathname+'?v=20261021-ceniciento-r38')}catch(_){}
},1500);
})();