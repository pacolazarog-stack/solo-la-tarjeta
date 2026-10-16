(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR6)return;
window.__orasAnaEntryFailsafeR6=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();

const style=document.createElement('style');
style.id='oras-ana-direct-route-r6';
style.textContent=`
html[data-oras-ana-route="estrella"] #cenicientoFrame,
html[data-oras-ana-route="estrella"] #cenicientoFrame[hidden]{
 display:block!important;
 opacity:1!important;
 visibility:visible!important;
 pointer-events:auto!important;
 z-index:2147482000!important;
 background:#090e19!important;
}
html[data-oras-ana-route="estrella"] #poemBackdrop{display:block!important;}
`;
document.head.appendChild(style);

function unlockChild(frame,piece){
  try{
    const doc=frame.contentDocument;
    if(!doc?.documentElement||!doc.body)return;
    doc.documentElement.classList.remove('publication-pending');
    doc.body.style.setProperty('visibility','visible','important');
    doc.body.style.setProperty('opacity','1','important');
    if(piece==='estrella'){
      const main=doc.querySelector('main');
      if(main){
        main.style.setProperty('visibility','visible','important');
        main.style.setProperty('opacity','1','important');
      }
      const intro=doc.querySelector('.intro');
      if(intro){
        intro.style.setProperty('visibility','visible','important');
        intro.style.setProperty('opacity','1','important');
      }
    }
  }catch(_){}
}

function applyDirectRoute(){
  if(!isAnaRoot())return;
  const piece=route();
  const root=document.documentElement;
  if(!POEM_ROUTES.has(piece)){
    root.removeAttribute('data-oras-ana-route');
    return;
  }
  root.setAttribute('data-oras-ana-route',piece);
  root.classList.remove('publication-pending','poem-route-loading','oras-master-entry');
  root.classList.add('ceniciento-open');

  const body=document.body;
  const frame=document.getElementById('cenicientoFrame');
  const backdrop=document.getElementById('poemBackdrop');
  if(!body||!frame)return;

  body.classList.add('journey-started','ceniciento-open','sonrisa-open');
  body.classList.toggle('eyes-open',piece==='ojos');
  body.classList.remove('locked');
  if(backdrop)backdrop.hidden=false;

  frame.hidden=false;
  frame.classList.add('sonrisa-transition','sonrisa-visible');
  frame.classList.remove('sonrisa-leaving');
  frame.removeAttribute('aria-busy');

  const expected=`../${piece}/?music=parent&v=20261016-ana-direct-route-r6`;
  const current=frame.getAttribute('src')||'';
  if(!current.includes(`/${piece}/`))frame.src=expected;

  unlockChild(frame,piece);
  frame.addEventListener('load',()=>unlockChild(frame,piece),{once:true});
}

function schedule(){
  applyDirectRoute();
  setTimeout(applyDirectRoute,120);
  setTimeout(applyDirectRoute,700);
  setTimeout(applyDirectRoute,1800);
}

addEventListener('DOMContentLoaded',schedule,{once:true});
addEventListener('pageshow',applyDirectRoute);
addEventListener('hashchange',applyDirectRoute);
addEventListener('popstate',applyDirectRoute);
if(document.readyState!=='loading')schedule();
})();
