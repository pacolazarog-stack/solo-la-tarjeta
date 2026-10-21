(()=>{
'use strict';
if(window.__cenicientoEntryR41)return;
window.__cenicientoEntryR41=true;

const params=new URLSearchParams(location.search);
const from=params.get('from')||'';
const fromAna=/^ana-r\d+$/i.test(from);
if(!fromAna)return;

const entry=document.getElementById('entry');
const listen=document.getElementById('listen');
const read=document.getElementById('read');
const status=document.getElementById('status');
const voice=document.getElementById('voice');
if(!entry||!listen||!read||!voice)return;

const body=document.body;
let released=false;
let ticks=0;
let timer=0;

const ensureReady=()=>{
  if(released)return;
  if(body.classList.contains('voice')||body.classList.contains('read'))return;
  if(entry.classList.contains('open'))entry.classList.remove('open');
  if(entry.style.opacity!=='1')entry.style.opacity='1';
  if(entry.style.visibility!=='visible')entry.style.visibility='visible';
  if(entry.style.pointerEvents!=='auto')entry.style.pointerEvents='auto';
  if(listen.disabled)listen.disabled=false;
  if(read.disabled)read.disabled=false;
  if(status&&status.textContent!=='listo')status.textContent='listo';
};

ensureReady();

/* Sin MutationObserver sobre style/class: el rescate anterior se auto-disparaba
   al escribir los mismos atributos y podía saturar Edge. Solo comprobaciones
   finitas y espaciadas durante la precarga inicial. */
timer=setInterval(()=>{
  ensureReady();
  ticks+=1;
  if(ticks>=24||released){clearInterval(timer);timer=0;}
},250);

const release=(label)=>{
  if(released)return;
  released=true;
  if(timer){clearInterval(timer);timer=0;}
  entry.style.opacity='';
  entry.style.visibility='';
  entry.style.pointerEvents='';
  if(status)status.textContent=label;
};

listen.addEventListener('click',()=>release('preparando voz'),{capture:true,once:true});
read.addEventListener('click',()=>release('lectura sin voz'),{capture:true,once:true});

voice.preload='metadata';

/* Limpia el parámetro de tránsito una vez estabilizada la portada, sin recargar. */
setTimeout(()=>{
  try{history.replaceState(null,'',location.pathname+'?v=20261021-ceniciento-r41')}catch(_){}
},1800);
})();