(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR7)return;
window.__orasAnaEntryFailsafeR7=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();

const style=document.createElement('style');
style.id='oras-ana-direct-route-r7';
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

function releaseDirectRoute(){
  if(!isAnaRoot())return;
  const root=document.documentElement;
  const body=document.body;
  const frame=document.getElementById('cenicientoFrame');
  const backdrop=document.getElementById('poemBackdrop');
  root.removeAttribute('data-oras-ana-route');
  root.classList.remove('poem-route-loading','ceniciento-open');
  if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
  if(frame){
    frame.hidden=true;
    frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');
    frame.removeAttribute('aria-busy');
    for(const prop of ['display','opacity','visibility','pointer-events','z-index','background'])frame.style.removeProperty(prop);
    const src=frame.getAttribute('src')||'';
    if(src.includes('/estrella/'))frame.removeAttribute('src');
  }
  if(body){
    body.classList.remove('ceniciento-open','sonrisa-open','eyes-open');
    if(body.classList.contains('reading-ready'))body.classList.remove('locked');
  }
}

function applyDirectRoute(){
  if(!isAnaRoot())return;
  const piece=route();
  const root=document.documentElement;
  if(!POEM_ROUTES.has(piece)){
    releaseDirectRoute();
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

  const expected=`../${piece}/?music=parent&v=20261016-ana-direct-route-r7`;
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
