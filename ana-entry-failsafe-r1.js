(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR1)return;
window.__orasAnaEntryFailsafeR1=true;

const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')==='/solo-la-tarjeta/elegia-breve';

function restoreAnaEntry(){
  if(!isAnaRoot())return;
  if(location.hash)return;
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

addEventListener('DOMContentLoaded',()=>setTimeout(restoreAnaEntry,0),{once:true});
addEventListener('pageshow',()=>setTimeout(restoreAnaEntry,80));
addEventListener('load',()=>setTimeout(restoreAnaEntry,180),{once:true});
setTimeout(restoreAnaEntry,700);
setTimeout(restoreAnaEntry,1800);
})();
