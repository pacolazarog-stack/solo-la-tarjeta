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
const VERSION='20261013-master-index-cover-4';

const ANA=[
  ['estrella','Prólogo · Siguiendo una tarjeta',`${ROOT}/estrella/`],
  ['elegia','Elegía breve para Ana Klaudya',`${ROOT}/elegia-breve/`],
  ['ojos','En tus ojos',`${ROOT}/ojos/`],
  ['labios','En tus labios',`${ROOT}/sonrisa/`],
  ['cabello','Tu cabello',`${ROOT}/cabello/`],
  ['piel','Tu piel',`${ROOT}/piel/`],
  ['afuego','Epílogo · A fuego lento',`${ROOT}/epilogo/`]
];

const EXPANSION=[
  ['inv-1','I. El recibidor'],['inv-2','II. La habitación del reloj'],['inv-3','III. La cocina'],['inv-4','IV. El pasillo'],
  ['inv-5','V. El dormitorio'],['inv-6','VI. El jardín'],['inv-7','VII. Inventario'],['inv-8','VIII. Salida'],
  ['som-1','I. La estación'],['som-2','II. El revisor'],['som-3','III. Las sombras'],['som-4','IV. El hombre de la fila siete'],
  ['som-5','V. Conversación'],['som-6','VI. Inventario de ausencias móviles'],['som-7','VII. El taller'],['som-8','VIII. El oficio'],['som-9','IX. Último recorrido'],
  ['ciu-1','I. La plaza'],['ciu-2','II. El archivero'],['ciu-3','III. La fuente'],['ciu-4','IV. Los resistentes'],
  ['ciu-5','V. El mapa imposible'],['ciu-6','VI. Teoría'],['ciu-7','VII. El museo'],['ciu-8','VIII. El visitante'],['ciu-9','IX. Invierno'],
  ['ciu-10','X. La última sala'],['ciu-11','XI. El Archivo Profundo'],['ciu-12','XII. La Máquina de las Huellas'],['atlas','ATLAS / AZAR'],['ciu-13','XIII. El Resonador'],['zero','Epílogo · La Habitación Número Cero']
];

const readJSON=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(_){return fallback}};
const life=()=>readJSON(UKEY,{});
const general=()=>readJSON(GKEY,{done:{}});
const bool=v=>v===true;

function anaDone(key,state){
  if(key==='afuego')return bool(state.anaComplete)||((state.anaParts?.interludio===true)&&(state.anaParts?.epilogo===true));
  return state.anaParts?.[key]===true;
}
function expansionDone(id){const g=general();return g.done?.[id]?.done===true||g.done?.[id]===true;}
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
function progress(){const leaves=allLeaves();return{done:leaves.filter(x=>x.done).length,total:leaves.length};}

const style=document.createElement('style');
style.id='oras-master-index-r1-style';
style.textContent=`
html.oras-master-entry,html.oras-master-entry body{overflow:hidden!important;background:#070706!important}
.oras-master-cover{position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;background:#070706;color:#f4ecdc;font-family:Georgia,"Times New Roman",serif}
.oras-master-cover[hidden]{display:none!important}
.oras-master-cover-frame{position:relative;height:min(100svh,calc(100vw * 1.491624));width:min(100vw,calc(100svh * .670410));aspect-ratio:1373/2048;box-shadow:0 0 80px rgba(0,0,0,.5);overflow:hidden;background:#0b0a09}
.oras-master-cover-img{display:block;width:100%;height:100%;object-fit:contain}
.oras-master-button{position:absolute;left:50%;top:49.6%;width:34%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);border:0;background:transparent;cursor:pointer;touch-action:manipulation;outline:none}
.oras-master-button::before{content:"";position:absolute;inset:-4%;border-radius:50%;border:1px solid transparent;box-shadow:0 0 0 0 rgba(248,239,215,0);transition:border-color .28s ease,box-shadow .28s ease,transform .28s ease}
.oras-master-button:hover::before,.oras-master-button:focus-visible::before{border-color:rgba(248,239,215,.42);box-shadow:0 0 28px rgba(248,239,215,.18);transform:scale(1.025)}
.oras-master-button span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.oras-master-index{position:fixed;z-index:2147483647;inset:0;display:none;background:rgba(5,5,5,.96);color:#eee4d2;font-family:Georgia,"Times New Roman",serif;overflow:auto;overscroll-behavior:contain}
.oras-master-index.is-open{display:block}
.oras-mi-shell{width:min(1120px,calc(100vw - 34px));margin:0 auto;padding:max(34px,env(safe-area-inset-top)) 0 max(54px,env(safe-area-inset-bottom))}
.oras-mi-top{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:end;padding:0 0 22px;border-bottom:1px solid rgba(238,228,210,.22);position:sticky;top:0;z-index:2;background:linear-gradient(#050505 76%,rgba(5,5,5,.88));backdrop-filter:blur(8px)}
.oras-mi-kicker{font:500 .68rem/1.2 system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(238,228,210,.52)}
.oras-mi-title{margin:.28rem 0 0;font-size:clamp(2.1rem,5vw,4.2rem);font-weight:400;line-height:.95;letter-spacing:.025em}
.oras-mi-sub{margin:.6rem 0 0;font-size:clamp(.95rem,1.8vw,1.15rem);font-style:italic;color:rgba(238,228,210,.68)}
.oras-mi-progress{min-width:118px;text-align:right;font:500 .76rem/1.35 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(238,228,210,.6)}
.oras-mi-progress strong{display:block;font:400 clamp(1.55rem,3vw,2.2rem)/1 Georgia,serif;color:#f5ead4;letter-spacing:0}
.oras-mi-close{position:fixed;z-index:5;right:max(15px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));width:42px;height:42px;border:1px solid rgba(238,228,210,.2);border-radius:50%;background:rgba(10,10,10,.7);color:#eee4d2;font-size:1.35rem;cursor:pointer}
.oras-mi-section{padding:32px 0 12px;border-bottom:1px solid rgba(238,228,210,.12)}
.oras-mi-section:last-child{border-bottom:0}
.oras-mi-section-head{display:flex;justify-content:space-between;gap:16px;align-items:baseline;margin-bottom:14px}
.oras-mi-roman{font-size:.72rem;letter-spacing:.18em;color:rgba(238,228,210,.45);text-transform:uppercase}
.oras-mi-section h2{margin:.2rem 0 0;font-weight:400;font-size:clamp(1.35rem,2.4vw,1.85rem)}
.oras-mi-work{margin:12px 0 0;padding:0;border-top:1px solid rgba(238,228,210,.08)}
.oras-mi-work-head{display:grid;grid-template-columns:30px 1fr auto;gap:10px;align-items:center;padding:14px 0 9px}
.oras-mi-num{font-size:.78rem;color:rgba(238,228,210,.45)}
.oras-mi-work-title{font-size:1.1rem;letter-spacing:.015em}
.oras-mi-status{font:500 .64rem/1 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:rgba(238,228,210,.4)}
.oras-mi-list{list-style:none;margin:0;padding:0 0 2px 40px}
.oras-mi-item{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:8px;align-items:center;min-height:35px;border-top:1px solid rgba(238,228,210,.055)}
.oras-mi-check{width:16px;height:16px;border:1px solid rgba(238,228,210,.28);border-radius:50%;display:grid;place-items:center;font:700 11px/1 system-ui,sans-serif;color:#19150f;background:transparent}
.oras-mi-item[data-done="true"] .oras-mi-check{background:#dfc98d;border-color:#dfc98d}
.oras-mi-item[data-done="true"] .oras-mi-check::after{content:"✓"}
.oras-mi-link{display:block;padding:8px 0;color:rgba(238,228,210,.83);text-decoration:none;transition:color .18s ease}
.oras-mi-link:hover,.oras-mi-link:focus-visible{color:#fff7e7;outline:none}
.oras-mi-item[data-done="true"] .oras-mi-link{color:#f4e8c9}
.oras-mi-meta{font:500 .61rem/1 system-ui,sans-serif;color:rgba(238,228,210,.32);letter-spacing:.06em;white-space:nowrap}
.oras-mi-machine .oras-mi-check{border-radius:2px;transform:rotate(45deg)}
.oras-mi-machine .oras-mi-check::after{transform:rotate(-45deg)}
.oras-mi-locked{opacity:.42}
.oras-mi-locked .oras-mi-link{pointer-events:none}
.oras-mi-continue{display:inline-flex;margin-top:23px;padding:11px 16px;border:1px solid rgba(238,228,210,.26);background:transparent;color:#f3ead8;text-decoration:none;font:italic 1rem Georgia,serif;cursor:pointer}
@media(max-width:700px){.oras-mi-shell{width:min(100% - 24px,1120px)}.oras-mi-top{padding-right:48px}.oras-mi-progress{display:none}.oras-mi-list{padding-left:18px}.oras-mi-item{grid-template-columns:22px minmax(0,1fr)}.oras-mi-meta{display:none}.oras-mi-work-head{grid-template-columns:24px 1fr}.oras-mi-status{display:none}.oras-master-button{width:34%}}
@media(prefers-reduced-motion:reduce){.oras-master-button::before{transition:none}}
`;
document.head.appendChild(style);
document.documentElement.classList.add('oras-master-entry');

const cover=document.createElement('section');
cover.className='oras-master-cover';
cover.setAttribute('aria-label','Portada de ORAS · Lo que queda de las horas');
cover.innerHTML=`<div class="oras-master-cover-frame"><img class="oras-master-cover-img" src="${ROOT}/assets/oras-portada-final.jpg?v=${VERSION}" alt="ORAS · Lo que queda de las horas"><button class="oras-master-button" type="button" aria-label="Abrir índice general de lectura"><span>Abrir índice general de lectura</span></button></div>`;
document.body.appendChild(cover);

const index=document.createElement('section');
index.className='oras-master-index';
index.setAttribute('role','dialog');
index.setAttribute('aria-modal','true');
index.setAttribute('aria-label','Índice general de ORAS');
index.innerHTML='<button class="oras-mi-close" type="button" aria-label="Volver a la portada">×</button><div class="oras-mi-shell"></div>';
document.body.appendChild(index);

function row(id,label,href,done,meta='',extra=''){
  return `<li class="oras-mi-item ${extra}" data-id="${id}" data-done="${done}"><span class="oras-mi-check" aria-hidden="true"></span><a class="oras-mi-link" href="${href}">${label}</a>${meta?`<span class="oras-mi-meta">${meta}</span>`:''}</li>`;
}
function workBlock(num,title,rows,done,total){
  return `<div class="oras-mi-work"><div class="oras-mi-work-head"><span class="oras-mi-num">${num}</span><span class="oras-mi-work-title">${title}</span><span class="oras-mi-status">${done}/${total}</span></div><ul class="oras-mi-list">${rows}</ul></div>`;
}
function invHref(id){return `${ROOT}/inventario-del-aire/?go=${encodeURIComponent(id)}&v=${VERSION}`;}

function render(){
  const u=life(), p=progress();
  const anaRows=ANA.map(([id,label,href])=>row('ana-'+id,label,href,anaDone(id,u))).join('');
  const anaCount=ANA.filter(([id])=>anaDone(id,u)).length;
  const soloRows=row('solo','SOLO LA TARJETA',`${ROOT}/?read=solo`,bool(u.soloComplete),'texto continuo');
  const cenRows=row('ceniciento','CENICIENTO',`${ROOT}/ceniciento/`,bool(u.cenicientoComplete),'texto continuo');
  const mirrorReady=bool(u.soloComplete)&&bool(u.cenicientoComplete)&&(bool(u.anaComplete)||anaCount===ANA.length);
  const mirrorRows=row('mirror','EL ESPEJO',mirrorReady?`${ROOT}/ceniciento/`:'#',bool(u.mirrorReadComplete),'32 fragmentos · acceso desde Ceniciento',mirrorReady?'':'oras-mi-locked');

  const inv=EXPANSION.slice(0,8);
  const som=EXPANSION.slice(8,17);
  const cityPre=EXPANSION.slice(17,29);
  const atlas=EXPANSION[29];
  const city13=EXPANSION[30];
  const zero=EXPANSION[31];
  const rowsFor=list=>list.map(([id,label])=>row(id,label,invHref(id),expansionDone(id))).join('');
  const count=list=>list.filter(([id])=>expansionDone(id)).length;
  const atlasRow=row(atlas[0],atlas[1],invHref(atlas[0]),expansionDone(atlas[0]),'irrupción no numerada','oras-mi-machine');
  const cityRows=rowsFor(cityPre)+atlasRow+row(city13[0],city13[1],invHref(city13[0]),expansionDone(city13[0]));
  const cityCount=count(cityPre)+count([atlas])+count([city13]);
  const zeroRow=row(zero[0],zero[1],invHref(zero[0]),expansionDone(zero[0]));

  const firstUnread=[
    !bool(u.soloComplete)&&`${ROOT}/?read=solo`,
    ...ANA.map(([id,,href])=>!anaDone(id,u)&&href),
    !bool(u.cenicientoComplete)&&`${ROOT}/ceniciento/`,
    mirrorReady&&!bool(u.mirrorReadComplete)&&`${ROOT}/ceniciento/`,
    ...EXPANSION.map(([id])=>!expansionDone(id)&&invHref(id))
  ].find(Boolean)||`${ROOT}/?read=solo`;

  index.querySelector('.oras-mi-shell').innerHTML=`
    <header class="oras-mi-top"><div><div class="oras-mi-kicker">ORAS · Lo que queda de las horas</div><h1 class="oras-mi-title">Índice de lectura</h1><p class="oras-mi-sub">Cada lectura deja una huella.</p></div><div class="oras-mi-progress"><strong>${p.done}/${p.total}</strong>huellas leídas</div></header>
    <section class="oras-mi-section"><div class="oras-mi-section-head"><div><div class="oras-mi-roman">I · LA VIDA</div><h2>Trilogía I</h2></div></div>${workBlock('1','SOLO LA TARJETA',soloRows,bool(u.soloComplete)?1:0,1)}${workBlock('2','ANA KLAUDYA',anaRows,anaCount,ANA.length)}${workBlock('3','CENICIENTO',cenRows,bool(u.cenicientoComplete)?1:0,1)}</section>
    <section class="oras-mi-section"><div class="oras-mi-section-head"><div><div class="oras-mi-roman">II · EL UMBRAL</div><h2>EL ESPEJO</h2></div></div>${workBlock('','32 fragmentos',mirrorRows,bool(u.mirrorReadComplete)?1:0,1)}</section>
    <section class="oras-mi-section"><div class="oras-mi-section-head"><div><div class="oras-mi-roman">III · LA EXPANSIÓN</div><h2>Trilogía II</h2></div></div>${workBlock('4','EL INVENTARIO DEL AIRE',rowsFor(inv),count(inv),inv.length)}${workBlock('5','EL OFICIO DE LAS SOMBRAS',rowsFor(som),count(som),som.length)}${workBlock('6','LA CIUDAD QUE APRENDIÓ A OLVIDAR',cityRows,cityCount,14)}</section>
    <section class="oras-mi-section"><div class="oras-mi-section-head"><div><div class="oras-mi-roman">IV · EL CERO</div><h2>La Habitación Número Cero</h2></div></div>${workBlock('','EPÍLOGO',zeroRow,expansionDone('zero')?1:0,1)}<a class="oras-mi-continue" href="${firstUnread}">${p.done===p.total?'Volver a leer':'Continuar por la primera huella pendiente'}</a></section>`;
}

function openIndex(){render();index.classList.add('is-open');cover.hidden=true;index.querySelector('.oras-mi-close')?.focus({preventScroll:true});}
function closeIndex(){index.classList.remove('is-open');cover.hidden=false;cover.querySelector('.oras-master-button')?.focus({preventScroll:true});}
cover.querySelector('.oras-master-button').addEventListener('click',openIndex);
index.querySelector('.oras-mi-close').addEventListener('click',closeIndex);
addEventListener('keydown',e=>{if(e.key==='Escape'&&index.classList.contains('is-open'))closeIndex()});
addEventListener('storage',e=>{if((e.key===UKEY||e.key===GKEY)&&index.classList.contains('is-open'))render()});
addEventListener('pageshow',()=>{if(index.classList.contains('is-open'))render()});
if(qs.get('indice')==='1')openIndex();
})();
