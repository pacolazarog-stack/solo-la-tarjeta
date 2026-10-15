(()=>{
'use strict';
if(window.__orasUnifiedNavR1)return;
window.__orasUnifiedNavR1=true;

const BASE='/solo-la-tarjeta/';
const isPreview=()=>location.pathname.includes('/oras-raiz-limpia-preview/');
const q=()=>new URLSearchParams(location.search);

const style=document.createElement('style');
style.id='oras-unified-nav-r1-style';
style.textContent=`
#orasUnifiedNav{position:fixed;z-index:2147483645;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;grid-template-columns:1fr 1.12fr 1fr;width:min(560px,calc(100vw - 120px));min-width:320px;min-height:44px;border:1px solid rgba(36,31,26,.16);border-radius:14px;overflow:hidden;background:rgba(244,241,234,.86);color:#2a251f;box-shadow:0 8px 30px rgba(0,0,0,.10);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasUnifiedNav button{appearance:none;border:0;border-right:1px solid rgba(36,31,26,.12);background:transparent;color:inherit;min-height:44px;padding:0 12px;font:600 11px/1.1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.045em;cursor:pointer}
#orasUnifiedNav button:last-child{border-right:0}
#orasUnifiedNav button:hover{background:rgba(255,255,255,.38)}
#orasUnifiedNav button:focus-visible{outline:2px solid rgba(52,44,35,.42);outline-offset:-2px}
#orasUnifiedNav button[disabled]{opacity:.34;cursor:default}
body.oras-solo-reading #orasUnifiedNav,body.oras-ceniciento-reading #orasUnifiedNav,body.oras-mirror-reading #orasUnifiedNav{background:rgba(14,13,12,.78);color:#fff8ee;border-color:rgba(255,255,255,.22);box-shadow:0 8px 30px rgba(0,0,0,.32)}
body.oras-solo-reading #orasUnifiedNav button,body.oras-ceniciento-reading #orasUnifiedNav button,body.oras-mirror-reading #orasUnifiedNav button{border-color:rgba(255,255,255,.18)}
#orasSoloPrevNext,.ou-reading-window-r2,.oras-reader-nav{display:none!important}
.oras-reader-head [data-index],.oras-reader-head [data-back-ana],.oras-mirror-head [data-index]{display:none!important}
@media(max-width:700px){#orasUnifiedNav{width:calc(100vw - 24px);min-width:0;bottom:max(8px,env(safe-area-inset-bottom));border-radius:12px}#orasUnifiedNav button{font-size:10px;padding:0 7px;min-height:42px}}
`;
document.head.appendChild(style);

const nav=document.createElement('nav');
nav.id='orasUnifiedNav';
nav.setAttribute('aria-label','Navegación ORAS');
nav.innerHTML='<button type="button" data-oras-prev>Anterior</button><button type="button" data-oras-index>Índice ORAS</button><button type="button" data-oras-next>Siguiente</button>';
document.body.appendChild(nav);
const prev=nav.querySelector('[data-oras-prev]'),next=nav.querySelector('[data-oras-next]'),index=nav.querySelector('[data-oras-index]');

function openIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  const existing=[...document.querySelectorAll('[data-index],.ou-reading-window-r2 summary')].find(el=>!el.closest('#orasUnifiedNav'));
  if(existing){existing.click();return;}
  location.href=BASE+'?indice=1';
}

function rootSolo(){
  const clean=location.pathname.replace(/\/index\.html$/i,'/');
  return clean===BASE;
}
function scrollRoot(dir){
  const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const atTop=scrollY<=8,atBottom=scrollY>=max-12;
  if(dir>0&&atBottom){location.href=BASE+'estrella/';return;}
  if(dir<0&&atTop){openIndex();return;}
  scrollBy({top:dir*innerHeight*.82,behavior:'smooth'});
}
function visibleCandidate(selectors){
  for(const sel of selectors){
    const nodes=[...document.querySelectorAll(sel)].filter(el=>!el.closest('#orasUnifiedNav'));
    const found=nodes.find(el=>!el.hidden&&getComputedStyle(el).display!=='none');
    if(found)return found;
  }
  return null;
}
function underlying(dir){
  const selectors=dir<0
    ?['[data-prev-expansion]','[data-prev]','[data-back-ana]']
    :['[data-next-expansion]','[data-next]','[data-follow-mirror]','[data-mirror-final]'];
  return visibleCandidate(selectors);
}
function previewFallback(dir){
  const id=q().get('read')||'';
  if(id==='espejo'){
    if(dir<0){history.pushState({},'','?read=ceniciento&via=interrogante&mode=read');window.dispatchEvent(new CustomEvent('oras:route'));return;}
    const fin=document.querySelector('[data-mirror-final]');
    if(fin&&!fin.disabled){fin.click();return;}
    document.querySelector('[data-mirror-scroll]')?.scrollBy({top:innerHeight*.86,behavior:'smooth'});return;
  }
  if(id==='solo'){scrollBy({top:dir*innerHeight*.82,behavior:'smooth'});return;}
}
function move(dir){
  if(rootSolo()){scrollRoot(dir);return;}
  const button=underlying(dir);
  if(button&&!button.disabled){button.click();return;}
  if(button&&button.disabled){
    const scroller=document.querySelector('[data-mirror-scroll]');
    if(scroller)scroller.scrollBy({top:dir*scroller.clientHeight*.84,behavior:'smooth'});
    else scrollBy({top:dir*innerHeight*.82,behavior:'smooth'});
    return;
  }
  if(isPreview()){previewFallback(dir);return;}
  const labels=dir<0?['anterior','atrás','atras']:['siguiente','seguir','continuar'];
  const candidate=[...document.querySelectorAll('a,button')].find(el=>{
    if(el.closest('#orasUnifiedNav'))return false;
    const t=(el.textContent||'').trim().toLowerCase();return labels.includes(t)&&!el.disabled;
  });
  if(candidate){candidate.click();return;}
  scrollBy({top:dir*innerHeight*.82,behavior:'smooth'});
}

index.addEventListener('click',openIndex);
prev.addEventListener('click',()=>move(-1));
next.addEventListener('click',()=>move(1));

function update(){
  if(rootSolo()){
    const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
    prev.disabled=false;next.disabled=false;
    prev.title=scrollY<=8?'Abrir Índice ORAS':'Retroceder en la lectura';
    next.title=scrollY>=max-12?'Continuar a ANA KLAUDYA':'Avanzar en la lectura';
    return;
  }
  const p=underlying(-1),n=underlying(1);
  prev.disabled=!!(p&&p.disabled);
  next.disabled=!!(n&&n.disabled);
}

let raf=0;
const schedule=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;update();});};
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','hidden','class']});
addEventListener('scroll',schedule,{passive:true});
addEventListener('popstate',schedule);
addEventListener('oras:route',()=>setTimeout(schedule,0));
update();
})();
