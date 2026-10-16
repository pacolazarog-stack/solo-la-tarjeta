(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR6)return;
window.__orasAnaEntryFailsafeR6=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();

const style=document.createElement('style');
style.id='oras-ana-route-guard-r6';
style.textContent=`
html.oras-estrella-route #cenicientoFrame{
  display:block!important;
  opacity:1!important;
  visibility:visible!important;
  pointer-events:auto!important;
  z-index:2147482000!important;
  background:#090e19!important;
}
`;
document.head.appendChild(style);

function releaseChildGate(frame,piece){
  try{
    const doc=frame.contentDocument;
    if(!doc||!doc.documentElement||!doc.body)return false;
    doc.documentElement.classList.remove('publication-pending');
    doc.body.style.setProperty('visibility','visible','important');
    doc.body.style.setProperty('opacity','1','important');
    const main=doc.querySelector('main');
    if(main){
      main.style.setProperty('visibility','visible','important');
      main.style.setProperty('opacity','1','important');
    }
    if(piece==='estrella'){
      const intro=doc.querySelector('.intro');
      if(intro){
        intro.style.setProperty('visibility','visible','important');
        intro.style.setProperty('opacity','1','important');
      }
      const poem=doc.getElementById('poem');
      if(poem)poem.style.setProperty('visibility','visible','important');
    }
    return true;
  }catch(_){return false;}
}

function scheduleChildRelease(frame,piece){
  const keep=()=>{
    if(!isAnaRoot()||route()!==piece)return;
    releaseChildGate(frame,piece);
  };
  frame.addEventListener('load',keep,{once:true});
  keep();
  setTimeout(keep,100);
  setTimeout(keep,450);
  setTimeout(keep,1400);
}

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
  root.classList.toggle('oras-estrella-route',piece==='estrella');
  root.classList.add('ceniciento-open');
  body.classList.add('journey-started','ceniciento-open','sonrisa-open');
  body.classList.toggle('eyes-open',piece==='ojos');
  body.classList.remove('locked');

  if(entry)entry.classList.add('is-open');
  if(backdrop)backdrop.hidden=false;

  frame.hidden=false;
  frame.classList.add('sonrisa-transition','sonrisa-visible');
  frame.classList.remove('sonrisa-leaving');
  frame.removeAttribute('aria-busy');
  frame.classList.toggle('interlude-transition',piece==='interludio');

  const expected=`../${piece}/?music=parent&v=20261016-ana-direct-route-r6`;
  const current=frame.getAttribute('src')||'';
  if(!current || !current.includes(`/${piece}/`))frame.src=expected;

  scheduleChildRelease(frame,piece);
  return true;
}

function restoreAnaEntry(){
  if(!isAnaRoot())return;
  if(revealPoemRoute())return;

  const root=document.documentElement;
  const body=document.body;
  const entry=document.getElementById('entry');
  const button=document.getElementById('entryButton');
  const frame=document.getElementById('cenicientoFrame');
  if(!body||!entry)return;

  root.classList.remove('oras-estrella-route');

  const genuineReading=
    body.classList.contains('journey-started')||
    body.classList.contains('reading-ready')||
    body.classList.contains('prelude')||
    body.classList.contains('voice-open')||
    body.classList.contains('ceniciento-open')||
    body.classList.contains('eyes-open')||
    (frame&&frame.hidden===false);

  if(genuineReading)return;

  root.classList.remove('publication-pending','poem-route-loading','oras-master-entry');
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
addEventListener('pageshow',()=>schedule(60));
addEventListener('load',()=>schedule(120),{once:true});
addEventListener('hashchange',()=>schedule(0));
addEventListener('popstate',()=>schedule(0));
schedule(350);
schedule(900);
})();
