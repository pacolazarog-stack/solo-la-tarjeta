(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR2)return;
window.__orasAnaEntryFailsafeR2=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();

function revealPoemRoute(){
  if(!isAnaRoot())return false;
  const piece=route();
  if(!POEM_ROUTES.has(piece))return false;

  const root=document.documentElement;
  const body=document.body;
  const entry=document.getElementById('entry');
  const frame=document.getElementById('cenicientoFrame');
  const backdrop=document.getElementById('poemBackdrop');
  if(!body||!frame)return false;

  root.classList.remove('publication-pending','poem-route-loading','oras-master-entry');
  root.classList.add('ceniciento-open');
  body.classList.add('journey-started','ceniciento-open','sonrisa-open');
  body.classList.toggle('eyes-open',piece==='ojos');
  body.classList.remove('locked');

  if(entry)entry.classList.add('is-open');
  if(backdrop)backdrop.hidden=false;

  frame.hidden=false;
  frame.classList.add('sonrisa-transition','sonrisa-visible');
  frame.classList.toggle('interlude-transition',piece==='interludio');
  frame.removeAttribute('aria-busy');

  if(!frame.getAttribute('src')){
    frame.src=`../${piece}/?music=parent&v=20261016-ana-direct-route-r2`;
  }

  return true;
}

function restoreAnaEntry(){
  if(!isAnaRoot())return;
  if(revealPoemRoute())return;

  const body=document.body;
  const entry=document.getElementById('entry');
  const button=document.getElementById('entryButton');
  const frame=document.getElementById('cenicientoFrame');
  if(!body||!entry)return;

  const genuineReading=
    body.classList.contains('journey-started')||
    body.classList.contains('reading-ready')||
    body.classList.contains('prelude')||
    body.classList.contains('voice-open')||
    body.classList.contains('ceniciento-open')||
    body.classList.contains('eyes-open')||
    (frame&&frame.hidden===false);

  if(genuineReading)return;

  document.documentElement.classList.remove('publication-pending','poem-route-loading','oras-master-entry');
  body.classList.add('locked');
  body.classList.remove('portrait-revealed');
  entry.classList.remove('is-open');
  entry.removeAttribute('hidden');
  entry.style.removeProperty('opacity');
  entry.style.removeProperty('visibility');
  entry.style.removeProperty('pointer-events');
  if(button){
    button.disabled=false;
    button.textContent='▶ Comenzar';
  }
}

const schedule=delay=>setTimeout(restoreAnaEntry,delay);
addEventListener('DOMContentLoaded',()=>schedule(0),{once:true});
addEventListener('pageshow',()=>schedule(80));
addEventListener('load',()=>schedule(180),{once:true});
addEventListener('hashchange',()=>schedule(0));
schedule(500);
schedule(1200);
schedule(2500);
})();
