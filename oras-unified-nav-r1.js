(()=>{
'use strict';
if(window.__orasUnifiedNavR4)return;
window.__orasUnifiedNavR4=true;

const ROOT='/solo-la-tarjeta';
const ANA_DOC=`${ROOT}/elegia-breve/?v=20261016-ana-route-1`;
const qs=()=>new URLSearchParams(location.search);
const cleanPath=()=>location.pathname.replace(/\/index\.html$/i,'').replace(/\/+$/,'');
const hash=()=>location.hash.replace(/^#/,'').toLowerCase();

const ANA_ORDER=['ana-estrella','ana-elegia','ana-ojos','ana-labios','ana-cabello','ana-piel','ana-interludio','ana-epilogo'];
const EXP_ORDER=[
 'inv-1','inv-2','inv-3','inv-4','inv-5','inv-6','inv-7','inv-8',
 'som-1','som-2','som-3','som-4','som-5','som-6','som-7','som-8','som-9',
 'ciu-1','ciu-2','ciu-3','ciu-4','ciu-5','ciu-6','ciu-7','ciu-8','ciu-9',
 'ciu-11','ciu-12','ciu-13','ciu-10','atlas','zero'
];
const ORDER=['solo',...ANA_ORDER,'ceniciento','mirror',...EXP_ORDER];

const ROUTES={
 solo:`${ROOT}/?read=solo`,
 'ana-estrella':`${ANA_DOC}#estrella`,
 'ana-elegia':ANA_DOC,
 'ana-ojos':`${ANA_DOC}#ojos`,
 'ana-labios':`${ANA_DOC}#sonrisa`,
 'ana-cabello':`${ANA_DOC}#cabello`,
 'ana-piel':`${ANA_DOC}#piel`,
 'ana-interludio':`${ANA_DOC}#interludio`,
 'ana-epilogo':`${ANA_DOC}#epilogo`,
 ceniciento:`${ROOT}/ceniciento/`,
 mirror:`${ROOT}/ceniciento/?mirror=1`,
 ...Object.fromEntries(EXP_ORDER.map(id=>[id,`${ROOT}/inventario-del-aire/?go=${encodeURIComponent(id)}`]))
};

function current(){
 const p=cleanPath();
 const s=qs();
 const h=hash();

 if(p.includes('/oras-raiz-limpia-preview')){
   const read=s.get('read');
   if(read==='solo')return 'solo';
   if(read==='ceniciento')return 'ceniciento';
   if(read==='espejo')return 'mirror';
   const go=s.get('go');
   if(go&&EXP_ORDER.includes(go))return go;
 }

 if(p===ROOT)return s.get('read')==='solo'?'solo':null;

 if(p===`${ROOT}/elegia-breve`){
   if(h==='estrella')return 'ana-estrella';
   if(h==='ojos')return 'ana-ojos';
   if(h==='sonrisa')return 'ana-labios';
   if(h==='cabello')return 'ana-cabello';
   if(h==='piel')return 'ana-piel';
   if(h==='interludio')return 'ana-interludio';
   if(h==='epilogo')return 'ana-epilogo';
   return 'ana-elegia';
 }

 const anaLegacy={
  [`${ROOT}/estrella`]:'ana-estrella',
  [`${ROOT}/ojos`]:'ana-ojos',
  [`${ROOT}/sonrisa`]:'ana-labios',
  [`${ROOT}/cabello`]:'ana-cabello',
  [`${ROOT}/piel`]:'ana-piel',
  [`${ROOT}/interludio`]:'ana-interludio',
  [`${ROOT}/epilogo`]:'ana-epilogo'
 };
 if(anaLegacy[p])return anaLegacy[p];

 if(p===`${ROOT}/ceniciento`)return s.get('mirror')==='1'?'mirror':'ceniciento';
 if(p===`${ROOT}/inventario-del-aire`){
   const go=s.get('go');
   return EXP_ORDER.includes(go)?go:'inv-1';
 }
 return null;
}

const style=document.createElement('style');
style.id='oras-unified-nav-r4-style';
style.textContent=`
#orasUnifiedNav{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483645;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;width:min(560px,calc(100vw - 24px));height:48px;border:1px solid rgba(255,255,255,.14);border-radius:14px;overflow:hidden;background:rgba(10,10,10,.88);color:#f3eee6;box-shadow:0 8px 30px rgba(0,0,0,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasUnifiedNav[hidden]{display:none!important}
#orasUnifiedNav button{appearance:none;border:0;background:transparent;color:inherit;height:48px;padding:0 14px;font:500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;white-space:nowrap}
#orasUnifiedNav button+button{border-left:1px solid rgba(255,255,255,.10)}
#orasUnifiedNav button:hover:not(:disabled){background:rgba(255,255,255,.06)}
#orasUnifiedNav button:focus-visible{outline:2px solid rgba(255,255,255,.45);outline-offset:-2px}
#orasUnifiedNav button:disabled{opacity:.32;cursor:default}
#orasUnifiedNav [data-oras-index]{font-weight:700;letter-spacing:.02em;padding-inline:18px}
#orasSoloPrevNext,.ou-reading-window-r2,.oras-reader-nav,.ana-navigation{display:none!important}
.oras-reader-head [data-index],.oras-reader-head [data-back-ana],.oras-mirror-head [data-index]{display:none!important}
@media(max-width:620px){#orasUnifiedNav{bottom:max(8px,env(safe-area-inset-bottom));height:44px;border-radius:12px}#orasUnifiedNav button{height:44px;font-size:11px;padding:0 9px}#orasUnifiedNav [data-oras-index]{padding-inline:11px}}
`;
document.head.appendChild(style);

document.getElementById('orasUnifiedNav')?.remove();
const nav=document.createElement('nav');
nav.id='orasUnifiedNav';
nav.setAttribute('aria-label','Navegación ORAS');
nav.innerHTML='<button type="button" data-oras-prev>← Anterior</button><button type="button" data-oras-index>Índice ORAS</button><button type="button" data-oras-next>Siguiente →</button>';
document.body.appendChild(nav);

const prev=nav.querySelector('[data-oras-prev]');
const index=nav.querySelector('[data-oras-index]');
const next=nav.querySelector('[data-oras-next]');

function openIndex(){
 if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
 location.href=`${ROOT}/?indice=1`;
}

function go(id){
 const href=ROUTES[id];
 if(!href)return;
 location.href=href;
}

function soloMove(dir){
 const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
 const atTop=scrollY<=8;
 const atBottom=scrollY>=max-12;
 if(dir<0&&atTop)return;
 if(dir>0&&atBottom){go('ana-estrella');return;}
 scrollBy({top:dir*innerHeight*.82,behavior:'smooth'});
}

function nativeAnaMove(dir,id){
 if(!ANA_ORDER.includes(id))return false;
 if(id==='ana-estrella'&&dir<0)return false;
 if(id==='ana-epilogo'&&dir>0)return false;
 const native=document.getElementById(dir<0?'journeyPrevious':'journeyNext');
 if(native&&!native.disabled){native.click();return true;}
 return false;
}

function epilogueNext(){
 const candidates=[...document.querySelectorAll('button,a,[role="button"]')].filter(el=>{
   if(el.closest('#orasUnifiedNav'))return false;
   if(el.hidden)return false;
   const cs=getComputedStyle(el);
   return cs.display!=='none'&&cs.visibility!=='hidden';
 });
 const qmark=candidates.find(el=>{
   const text=(el.textContent||'').trim();
   const aria=(el.getAttribute('aria-label')||'').toLowerCase();
   return text==='?'||aria.includes('interrogante')||aria.includes('ceniciento');
 });
 if(qmark){qmark.click();return;}
 const portrait=document.querySelector('.portrait-finale');
 if(portrait){portrait.scrollIntoView({block:'end',behavior:'smooth'});}
}

function move(dir){
 const id=current();
 if(!id)return;
 if(id==='solo'){soloMove(dir);return;}
 if(id==='ana-epilogo'&&dir>0){epilogueNext();return;}
 if(nativeAnaMove(dir,id)){setTimeout(update,0);return;}
 const i=ORDER.indexOf(id);
 if(i<0)return;
 const target=i+dir;
 if(target<0||target>=ORDER.length)return;
 go(ORDER[target]);
}

function update(){
 const id=current();
 if(!id){nav.hidden=true;return;}
 nav.hidden=false;

 if(id==='solo'){
   const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
   prev.disabled=scrollY<=8;
   next.disabled=false;
   prev.title=prev.disabled?'Comienzo de ORAS':'Retroceder en SOLO LA TARJETA';
   next.title=scrollY>=max-12?'Continuar a Siguiendo una tarjeta':'Avanzar en SOLO LA TARJETA';
   return;
 }

 const i=ORDER.indexOf(id);
 prev.disabled=i<=0;
 next.disabled=i<0||i>=ORDER.length-1;
 prev.title='Anterior';
 next.title='Siguiente';

 if(id==='ana-epilogo'){
   next.disabled=false;
   next.title='Mostrar fotografía e interrogante';
 }
 if(id==='zero'){
   next.disabled=true;
   next.title='Final de ORAS';
 }
}

index.addEventListener('click',openIndex);
prev.addEventListener('click',()=>move(-1));
next.addEventListener('click',()=>move(1));
addEventListener('load',update,{once:true});
addEventListener('pageshow',update);
addEventListener('popstate',update);
addEventListener('hashchange',()=>setTimeout(update,0));
addEventListener('oras:route',()=>setTimeout(update,0));
addEventListener('scroll',()=>{if(current()==='solo')update();},{passive:true});
update();
})();
