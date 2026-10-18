(()=>{
'use strict';
if(window.__orasCanonicalControlsR2)return;
window.__orasCanonicalControlsR2=true;
const BASE='/solo-la-tarjeta';

/* En iframes hijos no se crea una segunda botonera. */
try{if(window.parent!==window&&window.parent.location.origin===location.origin)return;}catch(_){}

const style=document.createElement('style');
style.textContent=`
#orasCanonicalNav{position:fixed;z-index:2147483644;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(520px,calc(100vw - 126px));height:48px;display:grid;grid-template-columns:1fr 1.18fr 1fr;border:1px solid rgba(255,255,255,.16);border-radius:11px;overflow:hidden;background:rgba(8,8,8,.82);box-shadow:0 8px 28px rgba(0,0,0,.24);backdrop-filter:blur(12px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasCanonicalNav button{border:0;background:transparent;color:rgba(255,255,255,.93);font:600 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}
#orasCanonicalNav button+button{border-left:1px solid rgba(255,255,255,.12)}
#orasCanonicalNav button:disabled{opacity:.28;cursor:default}
.journey-nav,.ou-solo-endnav,.oras-mirror-nav,.ou-reading-window-r2{display:none!important}
#orasSunoVolume{z-index:2147483646!important}
@media(max-width:700px){#orasCanonicalNav{width:min(430px,calc(100vw - 112px));height:44px}}
`;
document.head.appendChild(style);

let nav=document.getElementById('orasCanonicalNav');
if(!nav){
 nav=document.createElement('nav');nav.id='orasCanonicalNav';nav.setAttribute('aria-label','Navegación canónica ORAS');
 nav.innerHTML='<button type="button" data-back>← Atrás</button><button type="button" data-index>Índice ORAS</button><button type="button" data-forward>Adelante →</button>';
 document.body.appendChild(nav);
}
const back=nav.querySelector('[data-back]'),index=nav.querySelector('[data-index]'),forward=nav.querySelector('[data-forward]');

function openIndex(){
 if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
 let s=document.querySelector('script[data-oras-master-index-global]');
 if(!s){s=document.createElement('script');s.dataset.orasMasterIndexGlobal='1';s.src=BASE+'/oras-master-index-r1.js?v=20261014-master-index-15';document.head.appendChild(s);}
 s.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
}

const anaOrder=['estrella','elegia','ojos','sonrisa','cabello','piel','interludio','epilogo'];
const anaIds={estrella:'anaEstrella',elegia:'anaRead',ojos:'anaOjos',sonrisa:'anaSonrisa',cabello:'anaCabello',piel:'anaPiel',interludio:'anaInterlude',epilogo:'anaEpilogue'};
function anaPiece(){
 const h=location.hash.slice(1);
 if(anaOrder.includes(h))return h;
 if(location.pathname.includes('/elegia-breve'))return 'elegia';
 return null;
}
function clickAna(piece){const el=document.getElementById(anaIds[piece]);if(el){el.click();return true}return false;}
function currentPath(){return location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');}

function go(dir){
 const p=currentPath();
 if(p==='/solo-la-tarjeta/elegia-breve'){
   const cur=anaPiece(),i=anaOrder.indexOf(cur),j=dir==='back'?i-1:i+1;
   if(j>=0&&j<anaOrder.length){clickAna(anaOrder[j]);return;}
   if(dir==='back'&&i===0){location.assign(BASE+'/');return;}
   return;
 }
 const map={
  '/solo-la-tarjeta':{forward:BASE+'/elegia-breve/#estrella'},
  '/solo-la-tarjeta/ceniciento':{back:BASE+'/elegia-breve/'},
  '/solo-la-tarjeta/inventario-del-aire':{back:BASE+'/',forward:BASE+'/museo-de-las-sombras/'},
  '/solo-la-tarjeta/museo-de-las-sombras':{back:BASE+'/inventario-del-aire/',forward:BASE+'/museo-de-las-sombras/atlas.html'},
  '/solo-la-tarjeta/museo-de-las-sombras/atlas.html':{back:BASE+'/museo-de-las-sombras/'}
 };
 const href=map[p]?.[dir];if(href)location.assign(href);
}
function refresh(){
 const p=currentPath();
 if(p==='/solo-la-tarjeta/elegia-breve'){
  const i=anaOrder.indexOf(anaPiece());back.disabled=false;forward.disabled=i<0||i===anaOrder.length-1;return;
 }
 const map={
  '/solo-la-tarjeta':{back:false,forward:true},
  '/solo-la-tarjeta/ceniciento':{back:true,forward:false},
  '/solo-la-tarjeta/inventario-del-aire':{back:true,forward:true},
  '/solo-la-tarjeta/museo-de-las-sombras':{back:true,forward:true},
  '/solo-la-tarjeta/museo-de-las-sombras/atlas.html':{back:true,forward:false}
 };
 const s=map[p]||{back:true,forward:true};back.disabled=!s.back;forward.disabled=!s.forward;
}
back.onclick=()=>go('back');forward.onclick=()=>go('forward');index.onclick=openIndex;
addEventListener('hashchange',refresh);addEventListener('pageshow',refresh);
refresh();
window.ORASCanonicalControls={refresh,openIndex};
})();
