(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR5)return;
window.__orasAnaEntryFailsafeR5=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();
let directRouteTimer=0;
let directObserver=null;

function forceFrameVisible(frame){
  frame.hidden=false;
  frame.classList.add('sonrisa-transition','sonrisa-visible');
  frame.classList.remove('sonrisa-leaving');
  frame.removeAttribute('aria-busy');
  frame.style.setProperty('display','block','important');
  frame.style.setProperty('opacity','1','important');
  frame.style.setProperty('visibility','visible','important');
  frame.style.setProperty('pointer-events','auto','important');
  frame.style.setProperty('z-index','2147482000','important');
}

function releaseFrameOverride(frame){
  if(!frame)return;
  for(const prop of ['display','opacity','visibility','pointer-events','z-index'])frame.style.removeProperty(prop);
  frame.classList.add('sonrisa-visible');
}

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
      setTimeout(()=>{
        try{
          if(!isAnaRoot()||route()!=='estrella')return;
          const win=frame.contentWindow;
          const childDoc=frame.contentDocument;
          if(childDoc?.documentElement)childDoc.documentElement.classList.remove('publication-pending');
          if(childDoc?.body){
            childDoc.body.style.setProperty('visibility','visible','important');
            childDoc.body.style.setProperty('opacity','1','important');
          }
          const childPoem=childDoc?.getElementById('poem');
          if(childPoem?.hidden){
            if(typeof win?.completeMoon==='function')win.completeMoon();
            else childPoem.hidden=false;
          }
        }catch(_){}
      },15000);
    }
    return true;
  }catch(_){return false;}
}

function stopDirectGuard(frame){
  if(directRouteTimer){clearInterval(directRouteTimer);directRouteTimer=0;}
  if(directObserver){directObserver.disconnect();directObserver=null;}
  releaseFrameOverride(frame);
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
  root.classList.add('ceniciento-open');
  body.classList.add('journey-started','ceniciento-open','sonrisa-open');
  body.classList.toggle('eyes-open',piece==='ojos');
  body.classList.remove('locked');

  if(entry)entry.classList.add('is-open');
  if(backdrop)backdrop.hidden=false;

  forceFrameVisible(frame);
  frame.classList.toggle('interlude-transition',piece==='interludio');

  const expected=`../${piece}/?music=parent&v=20261016-ana-direct-route-r5`;
  const current=frame.getAttribute('src')||'';
  if(!current || !current.includes(`/${piece}/`))frame.src=expected;

  if(directRouteTimer)clearInterval(directRouteTimer);
  if(directObserver)directObserver.disconnect();

  directObserver=new MutationObserver(()=>{
    if(!isAnaRoot()||route()!==piece)return;
    forceFrameVisible(frame);
  });
  directObserver.observe(frame,{attributes:true,attributeFilter:['hidden','class','style','src','aria-busy']});

  directRouteTimer=setInterval(()=>{
    if(!isAnaRoot()||route()!==piece){stopDirectGuard(frame);return;}
    forceFrameVisible(frame);
    releaseChildGate(frame,piece);
  },160);

  const keepAlive=()=>{
    if(!isAnaRoot()||route()!==piece)return;
    forceFrameVisible(frame);
    releaseChildGate(frame,piece);
  };
  frame.addEventListener('load',keepAlive);
  keepAlive();
  setTimeout(keepAlive,80);
  setTimeout(keepAlive,350);
  setTimeout(keepAlive,1200);

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

  if(frame)stopDirectGuard(frame);

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
addEventListener('popstate',()=>schedule(0));
schedule(450);
schedule(1000);
schedule(2200);
})();
