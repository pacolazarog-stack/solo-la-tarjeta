(()=>{
'use strict';
if(window.__orasCanonicalControlsR1)return;
window.__orasCanonicalControlsR1=true;

const BASE='/solo-la-tarjeta';
const VERSION='20261018-canonical-controls-1';
const cleanPath=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');

/* Un solo mando visual: los hijos embebidos ceden el control al documento padre. */
try{
  if(window.parent!==window && window.parent.location.origin===location.origin){
    window.parent.postMessage({channel:'oras-canonical-controls-v1',type:'child-context',path:cleanPath(),hash:location.hash},location.origin);
    return;
  }
}catch(_){}

const style=document.createElement('style');
style.id='oras-canonical-controls-style-r1';
style.textContent=`
#orasCanonicalNav{position:fixed;z-index:2147483644;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(520px,calc(100vw - 126px));height:48px;display:grid;grid-template-columns:1fr 1.18fr 1fr;align-items:stretch;border:1px solid rgba(255,255,255,.16);border-radius:11px;overflow:hidden;background:rgba(8,8,8,.82);box-shadow:0 8px 28px rgba(0,0,0,.24);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasCanonicalNav button{appearance:none;border:0;background:transparent;color:rgba(255,255,255,.91);min-width:0;padding:0 10px;font:600 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;touch-action:manipulation;white-space:nowrap}
#orasCanonicalNav button+button{border-left:1px solid rgba(255,255,255,.12)}
#orasCanonicalNav button:hover,#orasCanonicalNav button:focus-visible{background:rgba(255,255,255,.07);color:#fff;outline:none}
#orasCanonicalNav button:disabled{opacity:.30;cursor:default;background:transparent}
.ou-reading-window-r2,.ou-solo-endnav,.journey-nav,.oras-mirror-nav{display:none!important;visibility:hidden!important;pointer-events:none!important}
body.oras-canonical-controls-ready .oras-ceniciento-mirror-gate,body.oras-canonical-controls-ready .oras-solo-mirror-gate{opacity:0!important;visibility:hidden!important;pointer-events:none!important;position:fixed!important;left:-10000px!important;top:-10000px!important}
#orasSunoVolume{z-index:2147483646!important}
@media(max-width:700px){#orasCanonicalNav{bottom:max(10px,env(safe-area-inset-bottom));width:min(430px,calc(100vw - 112px));height:44px;border-radius:9px}#orasCanonicalNav button{font-size:11px;padding:0 6px}}
@media(max-width:420px){#orasCanonicalNav{left:auto;right:max(8px,env(safe-area-inset-right));transform:none;width:calc(100vw - 68px);grid-template-columns:1fr 1.15fr 1fr}}
`;
document.head.appendChild(style);

document.body?.classList.add('oras-canonical-controls-ready');
const nav=document.createElement('nav');
nav.id='orasCanonicalNav';
nav.setAttribute('aria-label','Navegación canónica ORAS');
nav.innerHTML='<button type="button" data-oras-back aria-label="Atrás">← Atrás</button><button type="button" data-oras-index aria-label="Índice ORAS">Índice ORAS</button><button type="button" data-oras-forward aria-label="Adelante">Adelante →</button>';
document.body.appendChild(nav);
const back=nav.querySelector('[data-oras-back]');
const index=nav.querySelector('[data-oras-index]');
const forward=nav.querySelector('[data-oras-forward]');

let override={back:null,forward:null};
let childContext=null;

function openIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  let script=document.querySelector('script[data-oras-master-index-global],script[data-oras-canonical-master-index]');
  if(!script){
    script=document.createElement('script');script.dataset.orasCanonicalMasterIndex='1';
    script.src=`${BASE}/oras-master-index-r1.js?v=20261014-master-index-15`;
    script.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
    document.head.appendChild(script);
  }else script.addEventListener?.('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
}

const routeMap={
  '/solo-la-tarjeta':{back:null,forward:`${BASE}/estrella/`},
  '/solo-la-tarjeta/estrella':{back:`${BASE}/`,forward:`${BASE}/elegia-breve/`},
  '/solo-la-tarjeta/elegia-breve':{back:`${BASE}/estrella/`,forward:`${BASE}/ojos/`},
  '/solo-la-tarjeta/ojos':{back:`${BASE}/elegia-breve/`,forward:`${BASE}/sonrisa/`},
  '/solo-la-tarjeta/sonrisa':{back:`${BASE}/ojos/`,forward:`${BASE}/cabello/`},
  '/solo-la-tarjeta/cabello':{back:`${BASE}/sonrisa/`,forward:`${BASE}/piel/`},
  '/solo-la-tarjeta/piel':{back:`${BASE}/cabello/`,forward:`${BASE}/interludio/`},
  '/solo-la-tarjeta/interludio':{back:`${BASE}/piel/`,forward:`${BASE}/epilogo/`},
  '/solo-la-tarjeta/epilogo':{back:`${BASE}/interludio/`,forward:null},
  '/solo-la-tarjeta/ceniciento':{back:`${BASE}/elegia-breve/`,forward:null},
  '/solo-la-tarjeta/inventario-del-aire':{back:`${BASE}/`,forward:`${BASE}/museo-de-las-sombras/`},
  '/solo-la-tarjeta/museo-de-las-sombras':{back:`${BASE}/inventario-del-aire/`,forward:`${BASE}/museo-de-las-sombras/atlas.html`},
  '/solo-la-tarjeta/museo-de-las-sombras/atlas.html':{back:`${BASE}/museo-de-las-sombras/`,forward:null},
  '/solo-la-tarjeta/ana-klaudya-el-espejo-el-inventario':{back:`${BASE}/`,forward:`${BASE}/inventario-del-aire/`}
};

function existingButton(direction){
  const selectors=direction==='back'
    ? ['#journeyPrevious','[data-oras-prev]','[data-oras-back]','.oras-mirror-nav button:first-child']
    : ['#journeyNext','[data-oras-next]','[data-oras-forward]','.oras-mirror-nav button:last-child'];
  for(const sel of selectors){
    for(const el of document.querySelectorAll(sel)){
      if(el===back||el===forward||el.closest?.('#orasCanonicalNav'))continue;
      if(!el.disabled)return el;
    }
  }
  return null;
}
function mirrorGateButton(){
  const el=document.querySelector('.oras-ceniciento-mirror-gate .mirror-continue,.oras-solo-mirror-gate button');
  if(!el||el.disabled)return null;
  const gate=el.closest('.oras-ceniciento-mirror-gate,.oras-solo-mirror-gate');
  if(gate && (gate.hidden||!gate.classList.contains('is-visible')))return null;
  return el;
}
function currentRoute(){return routeMap[cleanPath()]||{back:null,forward:null};}
function available(direction){
  if(override[direction])return true;
  if(existingButton(direction))return true;
  if(direction==='forward'&&cleanPath().includes('/ceniciento')&&mirrorGateButton())return true;
  if(document.body.classList.contains('mirror')&&existingButton(direction))return true;
  return !!currentRoute()[direction];
}
function refresh(){
  back.disabled=!available('back');
  forward.disabled=!available('forward');
  document.body?.classList.add('oras-canonical-controls-ready');
}
function invoke(direction){
  const custom=override[direction];if(custom){typeof custom==='function'?custom():location.assign(custom);return;}
  const native=existingButton(direction);if(native){native.click();setTimeout(refresh,80);return;}
  if(direction==='forward'&&cleanPath().includes('/ceniciento')){const gate=mirrorGateButton();if(gate){gate.click();setTimeout(refresh,100);return;}}
  const href=currentRoute()[direction];if(href)location.assign(href);
}

back.addEventListener('click',()=>invoke('back'));
forward.addEventListener('click',()=>invoke('forward'));
index.addEventListener('click',openIndex);
addEventListener('hashchange',()=>setTimeout(refresh,0));
addEventListener('popstate',()=>setTimeout(refresh,0));
addEventListener('pageshow',()=>setTimeout(refresh,80));
addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.channel!=='oras-canonical-controls-v1')return;childContext=e.data;refresh();});
new MutationObserver(()=>refresh()).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','disabled','class']});

window.ORASCanonicalControls={
  version:VERSION,
  refresh,
  openIndex,
  setAdjacent(next={}){override.back=next.back??null;override.forward=next.forward??null;refresh();},
  clearAdjacent(){override={back:null,forward:null};refresh();},
  get childContext(){return childContext;}
};
refresh();setTimeout(refresh,350);setTimeout(refresh,1200);
})();
