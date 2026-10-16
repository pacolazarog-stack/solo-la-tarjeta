(()=>{
'use strict';
if(window.__orasUnifiedNavR2)return;
window.__orasUnifiedNavR2=true;

const ROOT='/solo-la-tarjeta';
const q=()=>new URLSearchParams(location.search);
const cleanPath=()=>location.pathname.replace(/\/index\.html$/i,'').replace(/\/+$/,'');
const visible=el=>!!el&&!el.hidden&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';

const ANA=[
 ['ana-estrella',`${ROOT}/estrella/`],
 ['ana-elegia',`${ROOT}/elegia-breve/`],
 ['ana-ojos',`${ROOT}/ojos/`],
 ['ana-labios',`${ROOT}/sonrisa/`],
 ['ana-cabello',`${ROOT}/cabello/`],
 ['ana-piel',`${ROOT}/piel/`],
 ['ana-interludio',`${ROOT}/interludio/`],
 ['ana-epilogo',`${ROOT}/elegia-breve/#epilogo`]
];
const EXP=[
 'inv-1','inv-2','inv-3','inv-4','inv-5','inv-6','inv-7','inv-8',
 'som-1','som-2','som-3','som-4','som-5','som-6','som-7','som-8','som-9',
 'ciu-1','ciu-2','ciu-3','ciu-4','ciu-5','ciu-6','ciu-7','ciu-8','ciu-9',
 'ciu-11','ciu-12','ciu-13','ciu-10','atlas','zero'
];
const ORDER=['solo',...ANA.map(x=>x[0]),'ceniciento','mirror',...EXP];
const ROUTES=Object.fromEntries([
 ['solo',`${ROOT}/?read=solo`],...ANA,
 ['ceniciento',`${ROOT}/ceniciento/`],
 ['mirror',`${ROOT}/ceniciento/?mirror=1`],
 ...EXP.map(id=>[id,`${ROOT}/inventario-del-aire/?go=${encodeURIComponent(id)}`])
]);

function current(){
 const p=cleanPath(),s=q();
 if(p.includes('/oras-raiz-limpia-preview')){
   const r=s.get('read');
   if(r==='solo')return 'solo';
   if(r==='ceniciento')return 'ceniciento';
   if(r==='espejo')return 'mirror';
   const go=s.get('go');if(go&&EXP.includes(go))return go;
 }
 if(p===ROOT){return s.get('read')==='solo'?'solo':null;}
 if(p===`${ROOT}/ceniciento`)return s.get('mirror')==='1'?'mirror':'ceniciento';
 if(p===`${ROOT}/inventario-del-aire`)return EXP.includes(s.get('go'))?s.get('go'):'inv-1';
 const h=location.hash.replace(/^#/,'');
 if(p===`${ROOT}/elegia-breve`&&['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo'].includes(h)){
   return ({estrella:'ana-estrella',ojos:'ana-ojos',sonrisa:'ana-labios',cabello:'ana-cabello',piel:'ana-piel',interludio:'ana-interludio',epilogo:'ana-epilogo'})[h];
 }
 const map={
  [`${ROOT}/estrella`]:'ana-estrella',[`${ROOT}/elegia-breve`]:'ana-elegia',[`${ROOT}/ojos`]:'ana-ojos',
  [`${ROOT}/sonrisa`]:'ana-labios',[`${ROOT}/cabello`]:'ana-cabello',[`${ROOT}/piel`]:'ana-piel',
  [`${ROOT}/interludio`]:'ana-interludio',[`${ROOT}/epilogo`]:'ana-epilogo'
 };
 return map[p]||null;
}

const style=document.createElement('style');style.id='oras-unified-nav-r2-style';style.textContent=`
#orasUnifiedNav{position:fixed;z-index:2147483645;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;grid-template-columns:1fr 1.12fr 1fr;width:min(560px,calc(100vw - 120px));min-width:320px;min-height:44px;border:1px solid rgba(36,31,26,.16);border-radius:14px;overflow:hidden;background:rgba(244,241,234,.88);color:#2a251f;box-shadow:0 8px 30px rgba(0,0,0,.10);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasUnifiedNav button{appearance:none;border:0;border-right:1px solid rgba(36,31,26,.12);background:transparent;color:inherit;min-height:44px;padding:0 12px;font:600 11px/1.1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.045em;cursor:pointer}#orasUnifiedNav button:last-child{border-right:0}#orasUnifiedNav button:hover:not(:disabled){background:rgba(255,255,255,.38)}#orasUnifiedNav button:focus-visible{outline:2px solid rgba(52,44,35,.42);outline-offset:-2px}#orasUnifiedNav button:disabled{opacity:.28;cursor:default}
#orasSoloPrevNext,.ou-reading-window-r2,.oras-reader-nav,.ana-navigation{display:none!important}.oras-reader-head [data-index],.oras-reader-head [data-back-ana],.oras-mirror-head [data-index]{display:none!important}
@media(max-width:700px){#orasUnifiedNav{width:calc(100vw - 24px);min-width:0;bottom:max(8px,env(safe-area-inset-bottom));border-radius:12px}#orasUnifiedNav button{font-size:10px;padding:0 7px;min-height:42px}}
`;
document.head.appendChild(style);
const old=document.getElementById('orasUnifiedNav');if(old)old.remove();
const nav=document.createElement('nav');nav.id='orasUnifiedNav';nav.setAttribute('aria-label','Navegación ORAS');nav.innerHTML='<button type="button" data-oras-prev>Anterior</button><button type="button" data-oras-index>Índice ORAS</button><button type="button" data-oras-next>Siguiente</button>';document.body.appendChild(nav);
const prev=nav.querySelector('[data-oras-prev]'),next=nav.querySelector('[data-oras-next]'),index=nav.querySelector('[data-oras-index]');

function openIndex(){if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}location.href=`${ROOT}/?indice=1`;}
function go(id){const href=ROUTES[id];if(href)location.href=href;}
function soloMove(dir){
 const max=Math.max(0,document.documentElement.scrollHeight-innerHeight),top=scrollY<=8,bottom=scrollY>=max-12;
 if(dir<0&&top)return;
 if(dir>0&&bottom){go('ana-estrella');return;}
 scrollBy({top:dir*innerHeight*.82,behavior:'smooth'});
}
function epilogueNext(){
 const candidates=[...document.querySelectorAll('button,a,[role="button"]')].filter(visible);
 const qmark=candidates.find(el=>{const t=(el.textContent||'').trim();const a=(el.getAttribute('aria-label')||'').toLowerCase();return t==='?'||a.includes('ceniciento')||a.includes('interrogante');});
 if(qmark){qmark.click();return;}
 const photo=document.querySelector('.portrait-finale');if(photo){photo.scrollIntoView?.({block:'end',behavior:'smooth'});return;}
 location.href=`${ROOT}/elegia-breve/#epilogo`;
}
function embeddedControl(dir,id){
 const selectors=id==='mirror'?(dir<0?['[data-prev]']:['[data-next]','[data-mirror-final]']):id==='ceniciento'?(dir<0?['[data-prev]','[data-back-ana]']:['[data-next]','[data-follow-mirror]']):(EXP.includes(id)?(dir<0?['[data-prev-expansion]','[data-prev]']:['[data-next-expansion]','[data-next]']):[]);
 for(const sel of selectors){const el=[...document.querySelectorAll(sel)].find(x=>visible(x)&&!x.closest('#orasUnifiedNav'));if(el){if(!el.disabled){el.click();return true;}return true;}}
 return false;
}
function move(dir){
 const id=current();if(!id)return;
 if(id==='solo'){soloMove(dir);return;}
 if(id==='ana-epilogo'&&dir>0){epilogueNext();return;}
 if((id==='ceniciento'||id==='mirror'||EXP.includes(id))&&embeddedControl(dir,id))return;
 const i=ORDER.indexOf(id);if(i<0)return;
 const target=i+dir;
 if(target<0||target>=ORDER.length)return;
 if(id==='ana-epilogo'&&dir>0)return;
 go(ORDER[target]);
}
function update(){
 const id=current();if(!id){nav.hidden=true;return;}nav.hidden=false;
 if(id==='solo'){
   const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);prev.disabled=scrollY<=8;next.disabled=false;
   prev.title=prev.disabled?'Comienzo de ORAS':'Retroceder en SOLO LA TARJETA';next.title=scrollY>=max-12?'Continuar al Prólogo de ANA KLAUDYA':'Avanzar en SOLO LA TARJETA';return;
 }
 const i=ORDER.indexOf(id);prev.disabled=i<=0;next.disabled=i===ORDER.length-1;
 if(id==='ana-epilogo'){next.disabled=false;next.title='Mostrar la fotografía y el interrogante de acceso a CENICIENTO';}
 else if(id==='ceniciento')next.title='Continuar a EL ESPEJO';
 else if(id==='mirror')next.title='Continuar a EL INVENTARIO DEL AIRE';
 else if(id==='zero')next.title='Final de ORAS';
 else next.title='Siguiente';
 prev.title='Anterior';
}
index.addEventListener('click',openIndex);prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
let raf=0;const schedule=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;update();});};addEventListener('scroll',schedule,{passive:true});addEventListener('popstate',schedule);addEventListener('hashchange',schedule);addEventListener('oras:route',schedule);new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','hidden','class']});update();
})();
