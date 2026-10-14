(()=>{
'use strict';

const PATH=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(PATH!=='/solo-la-tarjeta')return;

const qs=new URLSearchParams(location.search);
if(qs.has('read')||qs.has('origen')||qs.get('auto')==='1'||qs.has('from'))return;
if(window.__orasMasterIndexR1)return;
window.__orasMasterIndexR1=true;

const ROOT='/solo-la-tarjeta';
const UKEY='oras.universe.v2';
const GKEY='oras.reading.index.v1';
const OPENKEY='oras.master.index.open.v1';
/* Se conserva master-index-8 para no romper la validación actual de Pages. */
const VERSION='20261014-master-index-8';

const ANA=[
  ['estrella','Prólogo · Siguiendo una tarjeta',`${ROOT}/estrella/`],
  ['elegia','Elegía breve para Ana Klaudya',`${ROOT}/elegia-breve/`],
  ['ojos','En tus ojos',`${ROOT}/ojos/`],
  ['labios','En tus labios',`${ROOT}/sonrisa/`],
  ['cabello','Tu cabello',`${ROOT}/cabello/`],
  ['piel','Tu piel',`${ROOT}/piel/`],
  ['interludio','Interludio · Iba a llevarte flores',`${ROOT}/interludio/`],
  ['epilogo','Epílogo · A fuego lento · Flores',`${ROOT}/epilogo/`]
];

const INVENTARIO=[
  ['inv-1','I. El recibidor'],
  ['inv-2','II. La habitación del reloj'],
  ['inv-3','III. La cocina'],
  ['inv-4','IV. El pasillo'],
  ['inv-5','V. El dormitorio'],
  ['inv-6','VI. El jardín'],
  ['inv-7','VII. Inventario'],
  ['inv-8','VIII. Salida']
];

const OFICIO=[
  ['som-1','I. La estación'],
  ['som-2','II. El revisor'],
  ['som-3','III. Las sombras'],
  ['som-4','IV. El hombre de la fila siete'],
  ['som-5','V. Conversación'],
  ['som-6','VI. Inventario de ausencias móviles'],
  ['som-7','VII. El taller'],
  ['som-8','VIII. El oficio'],
  ['som-9','IX. Último recorrido']
];

/* Los ids ciu-10…ciu-13 conservan la identidad histórica del checklist. */
const CIUDAD=[
  ['ciu-1','I. La plaza'],
  ['ciu-2','II. El archivero'],
  ['ciu-3','III. La fuente'],
  ['ciu-4','IV. Los resistentes'],
  ['ciu-5','V. El mapa imposible'],
  ['ciu-6','VI. Teoría'],
  ['ciu-7','VII. El museo'],
  ['ciu-8','VIII. El visitante'],
  ['ciu-9','IX. Invierno'],
  ['ciu-11','X. El Archivo Profundo'],
  ['ciu-12','XI. La Máquina de las Huellas'],
  ['atlas','ATLAS / AZAR'],
  ['ciu-13','XII. El Resonador'],
  ['ciu-10','XIII. La última sala']
];

const ZERO=['zero','Epílogo · La Habitación Número Cero'];
const EXPANSION=[...INVENTARIO,...OFICIO,...CIUDAD,ZERO];

const readJSON=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(_){return fallback}};
const life=()=>readJSON(UKEY,{});
const general=()=>readJSON(GKEY,{done:{}});
const bool=v=>v===true;

function anaDone(key,state){
  const parts=state.anaParts&&typeof state.anaParts==='object'?state.anaParts:null;
  if(parts)return parts[key]===true;
  return bool(state.anaComplete);
}
function expansionDone(id){
  const g=general();
  return g.done?.[id]?.done===true||g.done?.[id]===true;
}
function invHref(id){
  return `${ROOT}/inventario-del-aire/?go=${encodeURIComponent(id)}&v=${VERSION}`;
}
function countDone(list){return list.filter(([id])=>expansionDone(id)).length;}
function allLeaves(){
  const u=life();
  return [
    {id:'solo',done:bool(u.soloComplete)},
    ...ANA.map(([id])=>({id:'ana-'+id,done:anaDone(id,u)})),
    {id:'ceniciento',done:bool(u.cenicientoComplete)},
    {id:'mirror',done:bool(u.mirrorReadComplete)},
    ...EXPANSION.map(([id])=>({id,done:expansionDone(id)}))
  ];
}
function progress(){
  const leaves=allLeaves();
  return {done:leaves.filter(x=>x.done).length,total:leaves.length};
}
function getOpen(){
  try{
    const parsed=JSON.parse(sessionStorage.getItem(OPENKEY)||'[]');
    return new Set(Array.isArray(parsed)?parsed:[]);
  }catch(_){return new Set();}
}
function saveOpen(set){
  try{sessionStorage.setItem(OPENKEY,JSON.stringify([...set]));}catch(_){}
}

const style=document.createElement('style');
style.id='oras-master-index-r1-style';
style.textContent=`
:root{
  --oras-bg:#060606;
  --oras-panel:#0d0c0a;
  --oras-panel-2:#13110e;
  --oras-line:rgba(224,194,129,.28);
  --oras-line-soft:rgba(237,226,204,.11);
  --oras-ink:#f3e7cf;
  --oras-muted:rgba(243,231,207,.58);
  --oras-gold:#dfc58a;
  --oras-gold-2:#f1dba5;
  --oras-dark:#17120a;
  --oras-radius:18px;
  --oras-control:42px;
}
html.oras-master-entry,html.oras-master-entry body{overflow:hidden!important;background:#070706!important}
.oras-master-cover{position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;background:#070706;color:#f4ecdc;font-family:Georgia,"Times New Roman",serif}
.oras-master-cover[hidden]{display:none!important}
.oras-master-cover-frame{position:relative;height:min(100svh,calc(100vw * 1.5));width:min(100vw,calc(100svh * .6666667));aspect-ratio:2/3;box-shadow:0 0 80px rgba(0,0,0,.5);overflow:hidden;background:#0b0a09}
.oras-master-cover-img{display:block;width:100%;height:100%;object-fit:cover}
.oras-master-button{position:absolute;left:50%;top:50.4%;width:31%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);border:0;background:transparent;cursor:pointer;touch-action:manipulation;outline:none}
.oras-master-button::before{content:"";position:absolute;inset:-4%;border-radius:50%;border:1px solid transparent;box-shadow:0 0 0 rgba(248,239,215,0);transition:.24s ease}
.oras-master-button:hover::before,.oras-master-button:focus-visible::before{border-color:rgba(248,239,215,.42);box-shadow:0 0 28px rgba(248,239,215,.18);transform:scale(1.025)}
.oras-master-button span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

.oras-master-index{position:fixed;z-index:2147483647;inset:0;display:none;background:radial-gradient(circle at 50% -12%,rgba(80,61,33,.16),transparent 30%),var(--oras-bg);color:var(--oras-ink);font-family:Georgia,"Times New Roman",serif;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(223,197,138,.32) transparent}
.oras-master-index.is-open{display:block}
.oras-mi-shell{width:min(920px,calc(100vw - 28px));margin:0 auto;padding:max(22px,env(safe-area-inset-top)) 0 calc(92px + env(safe-area-inset-bottom))}
.oras-mi-close{position:fixed;z-index:20;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));width:var(--oras-control);height:var(--oras-control);display:grid;place-items:center;border:1px solid var(--oras-line);border-radius:50%;background:rgba(8,8,8,.86);color:var(--oras-ink);font:300 1.35rem/1 system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(10px)}

.oras-mi-hero{padding:2px 54px 16px 2px}
.oras-mi-kicker{font:600 .63rem/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.21em;text-transform:uppercase;color:rgba(243,231,207,.48)}
.oras-mi-title{margin:.28rem 0 0;font:400 clamp(2.25rem,7vw,4rem)/.94 Georgia,"Times New Roman",serif;letter-spacing:.012em}
.oras-mi-sub{margin:.5rem 0 0;font:italic clamp(.92rem,2.3vw,1.08rem)/1.25 Georgia,serif;color:var(--oras-muted)}
.oras-mi-progress-card{margin-top:15px;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:13px 15px;border:1px solid var(--oras-line);border-radius:var(--oras-radius);background:linear-gradient(135deg,rgba(24,20,14,.9),rgba(10,10,9,.94));box-shadow:inset 0 1px rgba(255,255,255,.025)}
.oras-mi-progress-num{font:400 1.9rem/1 Georgia,serif;color:#f7ecd7;white-space:nowrap}.oras-mi-progress-num small{display:block;margin-top:4px;font:600 .57rem/1.1 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--oras-muted)}
.oras-mi-progress-track{height:6px;border-radius:999px;background:rgba(243,231,207,.13);overflow:hidden}.oras-mi-progress-fill{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#c9aa68,#efd89f);box-shadow:0 0 10px rgba(223,197,138,.22)}
.oras-mi-progress-pct{font:400 .92rem/1 Georgia,serif;color:var(--oras-muted)}

.oras-mi-section{margin-top:20px}
.oras-mi-section-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}.oras-mi-section-name{font:500 .78rem/1.1 system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(243,231,207,.72);white-space:nowrap}.oras-mi-section-line{height:1px;flex:1;background:var(--oras-line-soft)}.oras-mi-section-count{font:500 .68rem/1 system-ui,sans-serif;color:rgba(243,231,207,.5);white-space:nowrap}

.oras-mi-card{margin:8px 0;border:1px solid var(--oras-line);border-radius:var(--oras-radius);overflow:hidden;background:linear-gradient(180deg,rgba(18,16,13,.95),rgba(10,10,9,.97));box-shadow:0 8px 28px rgba(0,0,0,.12)}
.oras-mi-card.is-locked{opacity:.46}
.oras-mi-card-main{display:grid;grid-template-columns:54px 22px minmax(0,1fr) var(--oras-control);gap:11px;align-items:center;min-height:68px;padding:7px 9px 7px 8px}
.oras-mi-card-mark{width:54px;height:54px;border-radius:13px;display:grid;place-items:center;border:1px solid rgba(223,197,138,.16);background:radial-gradient(circle at 30% 25%,rgba(235,205,143,.14),transparent 45%),linear-gradient(145deg,#19150f,#090908);font:400 1.1rem/1 Georgia,serif;letter-spacing:.03em;color:rgba(241,219,165,.86)}
.oras-mi-state{width:18px;height:18px;border:1px solid rgba(241,219,165,.45);border-radius:50%;display:grid;place-items:center;color:#161109;background:transparent;font:800 11px/1 system-ui,sans-serif}
.oras-mi-state.is-done{background:var(--oras-gold-2);border-color:var(--oras-gold-2)}.oras-mi-state.is-done::after{content:"✓"}
.oras-mi-card-copy{min-width:0}.oras-mi-card-title{display:block;color:var(--oras-ink);font:400 clamp(1rem,2.7vw,1.22rem)/1.08 Georgia,serif;text-decoration:none;white-space:normal}.oras-mi-card-meta{display:block;margin-top:4px;font:500 .64rem/1.1 system-ui,sans-serif;letter-spacing:.045em;color:var(--oras-muted)}
.oras-mi-card-action{width:var(--oras-control);height:var(--oras-control);border:1px solid var(--oras-line);border-radius:50%;display:grid;place-items:center;background:rgba(8,8,8,.42);color:var(--oras-gold-2);cursor:pointer;text-decoration:none;font:400 1rem/1 system-ui,sans-serif;transition:.18s ease}.oras-mi-card-action:hover,.oras-mi-card-action:focus-visible{background:rgba(223,197,138,.09);border-color:rgba(223,197,138,.56);outline:none}.oras-mi-card-action .chev{display:block;transform:rotate(0);transition:transform .18s ease}.oras-mi-card[data-open="true"] .oras-mi-card-action .chev{transform:rotate(180deg)}

.oras-mi-parts{display:none;padding:0 9px 10px 95px}.oras-mi-card[data-open="true"] .oras-mi-parts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.oras-mi-chip{min-height:39px;display:grid;grid-template-columns:16px minmax(0,1fr);gap:8px;align-items:center;padding:7px 10px;border:1px solid rgba(223,197,138,.28);border-radius:999px;background:rgba(8,8,8,.52);color:rgba(243,231,207,.88);text-decoration:none;font:400 .79rem/1.14 Georgia,serif;transition:.16s ease}.oras-mi-chip:hover,.oras-mi-chip:focus-visible{background:rgba(223,197,138,.08);border-color:rgba(223,197,138,.5);color:#fff3dc;outline:none}.oras-mi-chip-state{width:15px;height:15px;border:1px solid rgba(241,219,165,.42);border-radius:50%;display:grid;place-items:center;color:#161109;font:800 9px/1 system-ui,sans-serif}.oras-mi-chip[data-done="true"] .oras-mi-chip-state{background:var(--oras-gold-2);border-color:var(--oras-gold-2)}.oras-mi-chip[data-done="true"] .oras-mi-chip-state::after{content:"✓"}.oras-mi-chip.is-atlas .oras-mi-chip-state{border-radius:3px;transform:rotate(45deg)}.oras-mi-chip.is-atlas .oras-mi-chip-state::after{transform:rotate(-45deg)}

.oras-mi-bottom{position:fixed;z-index:15;left:50%;bottom:0;transform:translateX(-50%);width:min(920px,calc(100vw - 18px));display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:9px;padding:10px 0 calc(10px + env(safe-area-inset-bottom));background:linear-gradient(to top,#060606 58%,rgba(6,6,6,.88) 76%,rgba(6,6,6,0));pointer-events:none}.oras-mi-bottom a,.oras-mi-bottom button{pointer-events:auto;min-height:52px;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:9px;font:500 .94rem/1 system-ui,sans-serif;text-decoration:none;cursor:pointer}.oras-mi-home{border:1px solid var(--oras-line);background:rgba(12,11,9,.95);color:var(--oras-ink)}.oras-mi-continue{border:1px solid var(--oras-gold);background:linear-gradient(135deg,#efd8a1,#d6b66f);color:#17120b;box-shadow:0 0 18px rgba(223,197,138,.09)}.oras-mi-bottom-icon{font-size:1rem}

@media(max-width:700px){
  :root{--oras-radius:15px;--oras-control:38px}
  .oras-mi-shell{width:min(100% - 18px,920px);padding-top:max(14px,env(safe-area-inset-top));padding-bottom:calc(86px + env(safe-area-inset-bottom))}
  .oras-mi-close{width:38px;height:38px;right:max(9px,env(safe-area-inset-right));top:max(9px,env(safe-area-inset-top))}
  .oras-mi-hero{padding-right:43px}.oras-mi-title{font-size:clamp(2rem,10vw,3rem)}
  .oras-mi-progress-card{grid-template-columns:auto 1fr;gap:10px;padding:11px 12px}.oras-mi-progress-pct{display:none}.oras-mi-progress-num{font-size:1.6rem}
  .oras-mi-section{margin-top:15px}.oras-mi-section-head{margin-bottom:6px}
  .oras-mi-card{margin:6px 0}.oras-mi-card-main{grid-template-columns:45px 18px minmax(0,1fr) 38px;gap:9px;min-height:59px;padding:6px 7px 6px 6px}.oras-mi-card-mark{width:45px;height:45px;border-radius:11px;font-size:.92rem}.oras-mi-state{width:16px;height:16px;font-size:9px}.oras-mi-card-title{font-size:1rem}.oras-mi-card-meta{font-size:.58rem}
  .oras-mi-parts{padding:0 7px 8px 77px}.oras-mi-card[data-open="true"] .oras-mi-parts{grid-template-columns:1fr;gap:5px}.oras-mi-chip{min-height:36px;padding:6px 9px;font-size:.76rem}
  .oras-mi-bottom{width:calc(100vw - 12px);gap:7px;padding-top:8px}.oras-mi-bottom a,.oras-mi-bottom button{min-height:48px;font-size:.88rem}
}
@media(max-width:390px){
  .oras-mi-card-main{grid-template-columns:40px 16px minmax(0,1fr) 36px}.oras-mi-card-mark{width:40px;height:40px}.oras-mi-parts{padding-left:68px}.oras-mi-card-title{font-size:.94rem}
}
@media(prefers-reduced-motion:reduce){.oras-master-button::before,.oras-mi-card-action .chev{transition:none}}
`;
document.head.appendChild(style);
document.documentElement.classList.add('oras-master-entry');

const cover=document.createElement('section');
cover.className='oras-master-cover';
cover.setAttribute('aria-label','Portada de ORAS');
cover.innerHTML=`<div class="oras-master-cover-frame"><img class="oras-master-cover-img" src="${ROOT}/assets/oras-portada-final.jpg?v=${VERSION}" alt="ORAS · El archivo profundo"><button class="oras-master-button" type="button" aria-label="Abrir índice general de lectura"><span>Abrir índice general de lectura</span></button></div>`;
document.body.appendChild(cover);

const index=document.createElement('section');
index.className='oras-master-index';
index.setAttribute('role','dialog');
index.setAttribute('aria-modal','true');
index.setAttribute('aria-label','Índice general de ORAS');
index.innerHTML='<button class="oras-mi-close" type="button" aria-label="Volver a la portada">×</button><div class="oras-mi-shell"></div><nav class="oras-mi-bottom" aria-label="Navegación del índice"></nav>';
document.body.appendChild(index);

function chip(id,label,href,done,extra=''){
  return `<a class="oras-mi-chip ${extra}" data-id="${id}" data-done="${done}" href="${href}"><span class="oras-mi-chip-state" aria-hidden="true"></span><span>${label}</span></a>`;
}
function card({id,mark,title,meta,done,href='',parts='',open=false,locked=false}){
  const hasParts=Boolean(parts);
  const action=hasParts
    ? `<button class="oras-mi-card-action" type="button" data-toggle="${id}" aria-expanded="${open}" aria-label="${open?'Cerrar':'Abrir'} ${title}"><span class="chev">⌄</span></button>`
    : `<a class="oras-mi-card-action" href="${locked?'#':href}" ${locked?'aria-disabled="true" tabindex="-1"':''} aria-label="Abrir ${title}"><span>›</span></a>`;
  const titleNode=href&&!hasParts&&!locked?`<a class="oras-mi-card-title" href="${href}">${title}</a>`:`<span class="oras-mi-card-title">${title}</span>`;
  return `<article class="oras-mi-card ${locked?'is-locked':''}" data-card="${id}" data-open="${open}"><div class="oras-mi-card-main"><div class="oras-mi-card-mark" aria-hidden="true">${mark}</div><span class="oras-mi-state ${done?'is-done':''}" aria-hidden="true"></span><div class="oras-mi-card-copy">${titleNode}<span class="oras-mi-card-meta">${meta}</span></div>${action}</div>${hasParts?`<div class="oras-mi-parts" id="parts-${id}">${parts}</div>`:''}</article>`;
}
function sectionHead(label,count){
  return `<div class="oras-mi-section-head"><span class="oras-mi-section-name">${label}</span><span class="oras-mi-section-line"></span><span class="oras-mi-section-count">${count}</span></div>`;
}

function render(){
  const u=life();
  const p=progress();
  const open=getOpen();
  const anaCount=ANA.filter(([id])=>anaDone(id,u)).length;
  const anaComplete=anaCount===ANA.length||bool(u.anaComplete);
  const solo=bool(u.soloComplete);
  const cen=bool(u.cenicientoComplete);
  const mirror=bool(u.mirrorReadComplete);
  const mirrorReady=solo&&cen&&anaComplete;
  const invCount=countDone(INVENTARIO);
  const oficioCount=countDone(OFICIO);
  const ciudadCount=countDone(CIUDAD);
  const zeroDone=expansionDone('zero');
  const lifeWorks=[solo,anaComplete,cen].filter(Boolean).length;
  const expansionCount=invCount+oficioCount+ciudadCount;
  const pct=Math.round((p.done/p.total)*100);

  const anaParts=ANA.map(([id,label,href])=>chip('ana-'+id,label,href,anaDone(id,u))).join('');
  const invParts=INVENTARIO.map(([id,label])=>chip(id,label,invHref(id),expansionDone(id))).join('');
  const oficioParts=OFICIO.map(([id,label])=>chip(id,label,invHref(id),expansionDone(id))).join('');
  const ciudadParts=CIUDAD.map(([id,label])=>chip(id,label,invHref(id),expansionDone(id),id==='atlas'?'is-atlas':'')).join('');

  const firstUnread=[
    !solo&&`${ROOT}/?read=solo`,
    ...ANA.map(([id,,href])=>!anaDone(id,u)&&href),
    !cen&&`${ROOT}/ceniciento/`,
    mirrorReady&&!mirror&&`${ROOT}/ceniciento/`,
    ...INVENTARIO.map(([id])=>!expansionDone(id)&&invHref(id)),
    ...OFICIO.map(([id])=>!expansionDone(id)&&invHref(id)),
    ...CIUDAD.map(([id])=>!expansionDone(id)&&invHref(id)),
    !zeroDone&&invHref('zero')
  ].find(Boolean)||`${ROOT}/?read=solo`;

  index.querySelector('.oras-mi-shell').innerHTML=`
    <header class="oras-mi-hero">
      <div class="oras-mi-kicker">ORAS · Lo que queda de las horas</div>
      <h1 class="oras-mi-title">Índice de lectura</h1>
      <p class="oras-mi-sub">Cada lectura deja una huella.</p>
      <div class="oras-mi-progress-card" aria-label="${p.done} de ${p.total} huellas leídas">
        <div class="oras-mi-progress-num">${p.done}/${p.total}<small>huellas leídas</small></div>
        <div class="oras-mi-progress-track"><span class="oras-mi-progress-fill" style="width:${pct}%"></span></div>
        <div class="oras-mi-progress-pct">${pct}%</div>
      </div>
    </header>

    <section class="oras-mi-section">
      ${sectionHead('I · LA VIDA',`${lifeWorks}/3`)}
      ${card({id:'solo',mark:'1',title:'Solo la tarjeta',meta:solo?'completa':'pendiente',done:solo,href:`${ROOT}/?read=solo`})}
      ${card({id:'ana',mark:'AK',title:'Ana Klaudya',meta:`${anaCount}/8 huellas`,done:anaComplete,parts:anaParts,open:open.has('ana')})}
      ${card({id:'ceniciento',mark:'3',title:'Ceniciento',meta:cen?'completa':'pendiente',done:cen,href:`${ROOT}/ceniciento/`})}
    </section>

    <section class="oras-mi-section">
      ${sectionHead('II · EL UMBRAL',mirror?'1/1':'0/1')}
      ${card({id:'mirror',mark:'◇',title:'El Espejo',meta:'32 fragmentos',done:mirror,href:`${ROOT}/ceniciento/`,locked:!mirrorReady&&!mirror})}
    </section>

    <section class="oras-mi-section">
      ${sectionHead('III · LA EXPANSIÓN',`${expansionCount}/${INVENTARIO.length+OFICIO.length+CIUDAD.length}`)}
      ${card({id:'inventario',mark:'4',title:'El inventario del aire',meta:`${invCount}/${INVENTARIO.length} huellas`,done:invCount===INVENTARIO.length,parts:invParts,open:open.has('inventario')})}
      ${card({id:'oficio',mark:'5',title:'El oficio de las sombras',meta:`${oficioCount}/${OFICIO.length} huellas`,done:oficioCount===OFICIO.length,parts:oficioParts,open:open.has('oficio')})}
      ${card({id:'ciudad',mark:'6',title:'La ciudad que aprendió a olvidar',meta:`${ciudadCount}/${CIUDAD.length} huellas`,done:ciudadCount===CIUDAD.length,parts:ciudadParts,open:open.has('ciudad')})}
    </section>

    <section class="oras-mi-section">
      ${sectionHead('IV · EL CERO',zeroDone?'1/1':'0/1')}
      ${card({id:'zero',mark:'0',title:'La Habitación Número Cero',meta:zeroDone?'completa':'pendiente',done:zeroDone,href:invHref('zero')})}
    </section>`;

  index.querySelector('.oras-mi-bottom').innerHTML=`
    <button class="oras-mi-home" type="button" data-home><span class="oras-mi-bottom-icon">⌂</span><span>Inicio</span></button>
    <a class="oras-mi-continue" href="${firstUnread}"><span class="oras-mi-bottom-icon">▤</span><span>${p.done===p.total?'Volver a leer':'Continuar'}</span></a>`;

  index.querySelectorAll('[data-toggle]').forEach(button=>{
    button.addEventListener('click',()=>{
      const id=button.dataset.toggle;
      const cardNode=index.querySelector(`[data-card="${id}"]`);
      if(!cardNode)return;
      const next=cardNode.dataset.open!=='true';
      cardNode.dataset.open=String(next);
      button.setAttribute('aria-expanded',String(next));
      button.setAttribute('aria-label',`${next?'Cerrar':'Abrir'} ${cardNode.querySelector('.oras-mi-card-title')?.textContent||id}`);
      const set=getOpen();
      next?set.add(id):set.delete(id);
      saveOpen(set);
      if(next&&matchMedia('(max-width:700px)').matches){
        setTimeout(()=>cardNode.scrollIntoView({block:'nearest',behavior:'smooth'}),40);
      }
    });
  });
  index.querySelector('[data-home]')?.addEventListener('click',closeIndex);
}

function openIndex(){
  render();
  index.classList.add('is-open');
  cover.hidden=true;
  index.scrollTop=0;
  index.querySelector('.oras-mi-close')?.focus({preventScroll:true});
}
function closeIndex(){
  index.classList.remove('is-open');
  cover.hidden=false;
  cover.querySelector('.oras-master-button')?.focus({preventScroll:true});
}

cover.querySelector('.oras-master-button').addEventListener('click',openIndex);
index.querySelector('.oras-mi-close').addEventListener('click',closeIndex);
addEventListener('keydown',event=>{if(event.key==='Escape'&&index.classList.contains('is-open'))closeIndex();});
addEventListener('storage',event=>{if((event.key===UKEY||event.key===GKEY)&&index.classList.contains('is-open'))render();});
addEventListener('pageshow',()=>{if(index.classList.contains('is-open'))render();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&index.classList.contains('is-open'))render();});
if(qs.get('indice')==='1')openIndex();
})();
