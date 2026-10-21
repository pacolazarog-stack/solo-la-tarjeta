(()=>{
'use strict';
if(window.__cenicientoEntryR46)return;
window.__cenicientoEntryR46=true;

const $=id=>document.getElementById(id);
const entry=$('entry'),listen=$('listen'),read=$('read'),readerText=$('readerText'),status=$('status');
const voice=$('voice'),pause=$('pause'),restart=$('restart'),switchBtn=$('switch'),back=$('back');
if(!entry||!listen||!read||!readerText)return;

const body=document.body;
const params=new URLSearchParams(location.search);
const fromAna=/^ana-r\d+$/i.test(params.get('from')||'');

function installCanonicalStyle(){
  if($('ceniciento-entry-r46-style'))return;
  const style=document.createElement('style');
  style.id='ceniciento-entry-r46-style';
  style.textContent=`
    .entry .mode{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0!important;width:min(360px,calc(100vw - 64px))!important;margin:0 auto!important;border-top:1px solid rgba(255,250,241,.44)!important;border-bottom:1px solid rgba(255,250,241,.20)!important}
    .entry .mode button{min-height:46px!important;margin:0!important;padding:10px 18px!important;border:0!important;border-radius:0!important;background:transparent!important;color:rgba(255,250,241,.88)!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;font:500 .68rem/1 Arial,Helvetica,sans-serif!important;letter-spacing:.12em!important;text-transform:uppercase!important;opacity:1!important;cursor:pointer!important}
    .entry .mode button+button{border-left:1px solid rgba(255,250,241,.24)!important}
    .entry .mode button:hover,.entry .mode button:focus-visible{background:rgba(255,255,255,.055)!important;color:#fffaf1!important;outline:0!important}
    .entry .mode button:disabled{opacity:1!important;cursor:pointer!important}
  `;
  document.head.appendChild(style);
}
installCanonicalStyle();

let textReady=false;
async function ensureText(){
  if(textReady&&readerText.childElementCount)return;
  const res=await fetch('texto.md?v=20261021-ceniciento-r46',{cache:'no-store'});
  if(!res.ok)throw new Error('texto');
  let raw=(await res.text()).replace(/^#\s*CENICIENTO\s*/i,'').trim();
  readerText.innerHTML='';
  raw.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).forEach(block=>{
    const p=document.createElement('p');
    p.textContent=block;
    readerText.appendChild(p);
  });
  textReady=true;
}

function ready(){
  listen.disabled=false;
  read.disabled=false;
  entry.classList.remove('open');
  entry.style.opacity='1';
  entry.style.visibility='visible';
  entry.style.pointerEvents='auto';
  if(status)status.textContent='listo';
}

function enter(mode){
  body.classList.remove('voice','read','revealing','mirror');
  body.classList.add(mode);
  entry.classList.add('open');
  entry.style.opacity='';
  entry.style.visibility='';
  entry.style.pointerEvents='';
  if(switchBtn)switchBtn.hidden=false;
  window.scrollTo(0,0);
}

ready();

listen.addEventListener('click',async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  try{await ensureText();}catch(_){}
  enter('voice');
  if(!voice){if(status)status.textContent='voz no disponible';return;}
  if(!voice.getAttribute('src'))voice.src='ceniciento-voz-completa.mp3?v=20261010-audio-restored';
  try{voice.currentTime=0;}catch(_){}
  if(status)status.textContent='preparando voz';
  voice.play().then(()=>{
    if(status)status.textContent='narración completa';
    if(pause){pause.disabled=false;pause.textContent='Pausa';}
  }).catch(()=>{if(status)status.textContent='Pulsa Inicio para activar la voz.';});
},{capture:true});

read.addEventListener('click',async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  try{
    await ensureText();
    enter('read');
    if(voice)voice.pause();
    if(status)status.textContent='lectura sin voz';
  }catch(_){if(status)status.textContent='texto no disponible';}
},{capture:true});

if(pause)pause.addEventListener('click',e=>{
  if(!body.classList.contains('voice')||!voice)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(voice.paused){voice.play().catch(()=>{});pause.textContent='Pausa';}
  else{voice.pause();pause.textContent='Seguir';}
},{capture:true});

if(restart)restart.addEventListener('click',e=>{
  e.preventDefault();e.stopImmediatePropagation();
  if(!voice)return;
  try{voice.currentTime=0;}catch(_){}
  voice.play().catch(()=>{});
  if(pause)pause.textContent='Pausa';
},{capture:true});

if(switchBtn)switchBtn.addEventListener('click',e=>{
  e.preventDefault();e.stopImmediatePropagation();
  if(voice)voice.pause();
  body.classList.remove('voice','read','revealing','mirror');
  switchBtn.hidden=true;
  ready();
},{capture:true});

if(back)back.addEventListener('click',e=>{
  e.preventDefault();e.stopImmediatePropagation();
  if(voice)voice.pause();
  location.href='../elegia-breve/?from=ceniciento-r46';
},{capture:true});

if(fromAna){
  setTimeout(()=>{
    try{history.replaceState(null,'',location.pathname+'?v=20261021-ceniciento-r46')}catch(_){}
  },1800);
}
})();
