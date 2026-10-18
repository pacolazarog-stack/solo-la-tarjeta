(()=>{
'use strict';
if(window.__orasCanonicalIndexR2)return;
window.__orasCanonicalIndexR2=true;
if(window.top!==window.self)return;
const ROOT='/solo-la-tarjeta';
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')||'/';
if(!path.startsWith(ROOT))return;

const ROUTE_KEY='oras.canonical.route.v1';
const POS_KEY='oras.canonical.route.pos.v1';
const qs=new URLSearchParams(location.search);
const isRoot=path===ROOT;
const coverEntry=isRoot&&!qs.has('read')&&qs.get('indice')!=='1'&&qs.get('auto')!=='1'&&!qs.has('from');
const exp=id=>`${ROOT}/inventario-del-aire/?go=${encodeURIComponent(id)}`;
const item=(label,href)=>({label,href});

const ROUTES=[
 {id:'emocional',n:'1',title:'Lectura emocional',subtitle:'El amor, la presencia y la mirada',question:'¿Qué ocurre cuando alguien nos ve de verdad?',culmination:'Ella nunca había visto al joven.',items:[
  item('Solo la tarjeta',`${ROOT}/?read=solo`),item('Prólogo · Siguiendo una tarjeta',`${ROOT}/estrella/`),item('Elegía breve para Ana Klaudya',`${ROOT}/elegia-breve/`),item('En tus ojos',`${ROOT}/ojos/`),item('En tus labios',`${ROOT}/sonrisa/`),item('Tu cabello',`${ROOT}/cabello/`),item('Tu piel',`${ROOT}/piel/`),item('Epílogo · A fuego lento',`${ROOT}/epilogo/`),item('Ceniciento',`${ROOT}/ceniciento/`),item('El espejo',`${ROOT}/ceniciento/?mirror=1`)
 ]},
 {id:'tiempo',n:'2',title:'El tiempo',subtitle:'El paso de las edades',question:'¿Qué permanece cuando el tiempo se lleva casi todo?',culmination:'A Ceniciento el prodigio le devolvió al hombre que fue para descubrir quién era.',items:[
  item('Solo la tarjeta',`${ROOT}/?read=solo`),item('Ceniciento',`${ROOT}/ceniciento/`),item('La habitación del reloj',exp('inv-2')),item('Inventario',exp('inv-7')),item('El hombre de la fila siete',exp('som-4')),item('Último recorrido',exp('som-9')),item('Invierno',exp('ciu-9')),item('Habitación Número Cero',exp('zero'))
 ]},
 {id:'huellas',n:'3',title:'Las huellas',subtitle:'De la tarjeta al botón de nácar',question:'¿Cómo sigue actuando algo cuando ya no está?',culmination:'Toda huella puede volver.',items:[
  item('Solo la tarjeta',`${ROOT}/?read=solo`),item('El inventario del aire',exp('inv-1')),item('El Archivo Profundo',exp('ciu-11')),item('La Máquina de las Huellas',exp('ciu-12')),item('Atlas / Azar',exp('atlas')),item('El Resonador',exp('ciu-13')),item('Habitación Número Cero',exp('zero')),item('El botón de nácar final',exp('zero'))
 ]},
 {id:'ausencias',n:'4',title:'Las ausencias',subtitle:'Lo que desaparece',question:'¿Qué forma tiene una ausencia?',culmination:'La Habitación Número Cero contiene la posibilidad de desaparecer.',items:[
  item('La tarjeta ya no hacía falta',`${ROOT}/?read=solo#duskPreFinal`),item('La habitación del reloj',exp('inv-2')),item('La fotografía rota',exp('inv-5')),item('Las sombras',exp('som-3')),item('La ciudad que aprendió a olvidar',exp('ciu-1')),item('El museo',exp('ciu-7')),item('La última sala',exp('ciu-10')),item('Habitación Número Cero',exp('zero'))
 ]},
 {id:'espejo',n:'5',title:'El espejo',subtitle:'Las versiones de una misma historia',question:'¿Cuántas lecturas puede tener una misma huella?',culmination:'Parecían tres. Lo eran. Y no lo eran.',items:[
  item('Solo la tarjeta',`${ROOT}/?read=solo`),item('Ceniciento',`${ROOT}/ceniciento/`),item('El espejo',`${ROOT}/ceniciento/?mirror=1`),item('Espejo · Atlas / Azar',exp('atlas')),item('Contradicción',exp('atlas')),item('Interferencia',exp('atlas')),item('Resonador',exp('ciu-13'))
 ]},
 {id:'museo',n:'6',title:'El museo',subtitle:'La construcción de ORAS como sistema',question:'¿Cómo recuerda una civilización?',culmination:'Las personas creen que recuerdan las ciudades. Es al revés.',items:[
  item('El Inventario del Aire',exp('inv-1')),item('El Oficio de las Sombras',exp('som-1')),item('La Ciudad que Aprendió a Olvidar',exp('ciu-1')),item('Archivo Profundo',exp('ciu-11')),item('Máquina de las Huellas',exp('ciu-12')),item('Resonador',exp('ciu-13')),item('Habitación Número Cero',exp('zero'))
 ]},
 {id:'transformacion',n:'7',title:'La transformación',subtitle:'Yang → Yin',question:'¿Cómo deja alguien de buscar para empezar a habitar?',culmination:'Cuando era yang, buscaba el yin. Ahora que soy yin, me basta con mirarte.',items:[
  item('Solo la tarjeta',`${ROOT}/?read=solo`),item('Prólogo · Siguiendo una tarjeta',`${ROOT}/estrella/`),item('Elegía breve para Ana Klaudya',`${ROOT}/elegia-breve/`),item('En tus ojos',`${ROOT}/ojos/`),item('En tus labios',`${ROOT}/sonrisa/`),item('Tu cabello',`${ROOT}/cabello/`),item('Tu piel',`${ROOT}/piel/`),item('A fuego lento',`${ROOT}/epilogo/`),item('Ceniciento',`${ROOT}/ceniciento/`),item('El espejo',`${ROOT}/ceniciento/?mirror=1`)
 ]},
 {id:'canonica',n:'8',title:'Lectura total',subtitle:'Recorrido canónico',question:'La vida se convierte en memoria; la memoria en sistema; el sistema en ausencia.',culmination:'Tarjeta → Encuentro → Mirada → Huella → Archivo → Resonancia → Ausencia → Cero → Huella.',canonical:true,items:[
  item('I · Solo la tarjeta',`${ROOT}/?read=solo`),item('Prólogo · Siguiendo una tarjeta',`${ROOT}/estrella/`),item('Elegía breve para Ana Klaudya',`${ROOT}/elegia-breve/`),item('En tus ojos',`${ROOT}/ojos/`),item('En tus labios',`${ROOT}/sonrisa/`),item('Tu cabello',`${ROOT}/cabello/`),item('Tu piel',`${ROOT}/piel/`),item('A fuego lento',`${ROOT}/epilogo/`),item('Ceniciento',`${ROOT}/ceniciento/`),item('II · El espejo',`${ROOT}/ceniciento/?mirror=1`),item('III · El inventario del aire',exp('inv-1')),item('El oficio de las sombras',exp('som-1')),item('La ciudad que aprendió a olvidar',exp('ciu-1')),item('El Archivo Profundo',exp('ciu-11')),item('La Máquina de las Huellas',exp('ciu-12')),item('Atlas / Azar',exp('atlas')),item('El Resonador',exp('ciu-13')),item('IV · Habitación Número Cero',exp('zero'))
 ]}
];

const style=document.createElement('style');
style.id='oras-canonical-index-r2-style';
style.textContent=`
:root{--oc-gold:#e2c989;--oc-ink:#f5ead4;--oc-muted:rgba(245,234,212,.62);--oc-line:rgba(226,201,137,.34)}
#orasSoloPrevNext,#journeyNav,.journey-nav,.ou-ceniciento-endnav,.oras-ceniciento-nav{display:none!important}
.oras-cover{position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;background:#070706}.oras-cover[hidden]{display:none!important}.oras-cover-frame{position:relative;height:min(100svh,calc(100vw*1.5));width:min(100vw,calc(100svh*.666667));aspect-ratio:2/3;overflow:hidden}.oras-cover img{width:100%;height:100%;object-fit:cover;display:block}.oras-cover-enter{position:absolute;left:50%;top:50.4%;width:31%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,247,226,.12);background:rgba(0,0,0,.02);cursor:pointer;box-shadow:0 0 0 0 rgba(255,240,200,0);transition:.35s}.oras-cover-enter:hover,.oras-cover-enter:focus-visible{outline:none;border-color:rgba(255,247,226,.48);box-shadow:0 0 42px rgba(255,235,190,.20);transform:translate(-50%,-50%) scale(1.035)}
.oras-index{position:fixed;z-index:2147483646;inset:0;display:none;place-items:center;padding:18px;background:radial-gradient(circle at 50% 48%,rgba(85,62,31,.18),transparent 42%),rgba(4,4,4,.94);color:var(--oc-ink);font-family:Georgia,'Times New Roman',serif;backdrop-filter:blur(12px)}.oras-index.is-open{display:grid}.oras-index-shell{position:relative;width:min(1180px,calc(100vw - 30px));height:min(900px,calc(100svh - 30px));overflow:auto;border:1px solid var(--oc-line);border-radius:34px;background:radial-gradient(circle at 50% 34%,rgba(117,83,38,.12),transparent 34%),linear-gradient(180deg,#0f0e0c,#060606 70%);box-shadow:0 30px 120px #000;padding:24px 28px 92px}.oras-index-close{position:sticky;z-index:4;float:right;top:0;width:42px;height:42px;border-radius:50%;border:1px solid var(--oc-line);background:#0b0a08;color:var(--oc-ink);font-size:20px;cursor:pointer}.oras-head{text-align:center;padding:4px 52px 8px}.oras-head small{display:block;font:600 .64rem/1.2 system-ui;letter-spacing:.22em;text-transform:uppercase;color:var(--oc-muted)}.oras-head h1{margin:.3rem 0 .15rem;font:400 clamp(2.25rem,6vw,4.4rem)/.95 Georgia}.oras-head p{margin:.4rem auto 0;max-width:62ch;color:var(--oc-muted);font-style:italic}
.oras-wheel-wrap{display:grid;grid-template-columns:minmax(520px,1.08fr) minmax(320px,.92fr);gap:24px;align-items:center;margin-top:8px}.oras-wheel{position:relative;width:min(62vw,610px);max-width:100%;aspect-ratio:1;margin:auto;border-radius:50%;border:1px solid rgba(226,201,137,.18);background:radial-gradient(circle,rgba(226,201,137,.06) 0 1px,transparent 2px),radial-gradient(circle,transparent 48%,rgba(226,201,137,.05) 49%,transparent 50%);box-shadow:inset 0 0 80px rgba(226,201,137,.025)}.oras-wheel::before,.oras-wheel::after{content:'';position:absolute;inset:13%;border:1px solid rgba(226,201,137,.10);border-radius:50%}.oras-wheel::after{inset:29%}.oras-center{position:absolute;left:50%;top:50%;width:31%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;text-align:center;border:1px solid rgba(226,201,137,.38);background:radial-gradient(circle at 40% 32%,#272015,#0b0907 72%);box-shadow:0 0 38px rgba(226,201,137,.09)}.oras-center strong{font:400 clamp(1.3rem,3vw,2.1rem)/1 Georgia;letter-spacing:.08em}.oras-center span{display:block;margin-top:.35rem;font:500 .55rem/1.25 system-ui;letter-spacing:.14em;text-transform:uppercase;color:var(--oc-muted)}.oras-route-node{--a:0deg;position:absolute;left:50%;top:50%;width:116px;min-height:72px;transform:translate(-50%,-50%) rotate(var(--a)) translateY(-235px) rotate(calc(-1*var(--a)));border:1px solid rgba(226,201,137,.28);border-radius:50%;padding:11px 9px;background:rgba(12,10,8,.92);color:var(--oc-ink);cursor:pointer;text-align:center;font:500 .68rem/1.15 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:.22s}.oras-route-node b{display:block;font:400 1rem/1 Georgia;color:var(--oc-gold);margin-bottom:3px}.oras-route-node:hover,.oras-route-node:focus-visible,.oras-route-node.is-selected{outline:none;border-color:rgba(240,215,157,.78);background:#1b160f;box-shadow:0 0 26px rgba(226,201,137,.14)}.oras-route-node.is-canonical{border-width:2px}.oras-route-node.is-canonical::after{content:'CANÓNICA';display:block;margin-top:4px;font-size:.48rem;letter-spacing:.11em;color:var(--oc-gold)}
.oras-route-panel{min-height:520px;border-left:1px solid rgba(226,201,137,.13);padding:12px 4px 12px 24px}.oras-route-panel h2{margin:.2rem 0;font:400 clamp(1.8rem,4vw,3rem)/1 Georgia}.oras-route-panel .sub{color:var(--oc-gold);font-style:italic;margin:.2rem 0 1rem}.oras-route-question{padding:12px 14px;border-left:2px solid rgba(226,201,137,.55);background:rgba(226,201,137,.035);font-style:italic;line-height:1.4}.oras-route-list{margin:15px 0 0;padding:0;list-style:none;display:grid;gap:5px;max-height:280px;overflow:auto}.oras-route-list li{display:grid;grid-template-columns:26px 1fr;gap:8px;align-items:baseline;padding:6px 7px;border-bottom:1px solid rgba(226,201,137,.09);font-size:.93rem}.oras-route-list .num{color:var(--oc-muted);font:600 .65rem/1 system-ui}.oras-route-start{margin-top:15px;width:100%;min-height:50px;border:1px solid var(--oc-gold);border-radius:999px;background:linear-gradient(135deg,#ecd59b,#cba85e);color:#171109;font:650 .86rem/1 system-ui;letter-spacing:.06em;cursor:pointer}.oras-route-coda{margin-top:12px;color:var(--oc-muted);font-size:.83rem;line-height:1.4}.oras-route-coda strong{color:var(--oc-ink);font-weight:400}
.oras-toolbar{position:fixed;z-index:2147483645;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;grid-template-columns:1fr 1.15fr 1fr;width:min(510px,calc(100vw - 132px));height:46px;border:1px solid rgba(226,201,137,.32);border-radius:999px;background:rgba(8,8,8,.78);backdrop-filter:blur(10px);box-shadow:0 10px 35px rgba(0,0,0,.28);overflow:hidden}.oras-toolbar[hidden]{display:none!important}.oras-toolbar button{border:0;background:transparent;color:#fff5e3;font:600 11px/1 system-ui;letter-spacing:.045em;cursor:pointer}.oras-toolbar button+button{border-left:1px solid rgba(226,201,137,.20)}.oras-toolbar button:disabled{opacity:.28;cursor:default}.oras-toolbar .index{color:var(--oc-gold)}
@media(max-width:900px){.oras-index{padding:7px}.oras-index-shell{width:calc(100vw - 14px);height:calc(100svh - 14px);padding:14px 12px 84px;border-radius:22px}.oras-wheel-wrap{grid-template-columns:1fr;gap:12px}.oras-wheel{width:min(92vw,520px)}.oras-route-node{width:100px;min-height:65px;transform:translate(-50%,-50%) rotate(var(--a)) translateY(-198px) rotate(calc(-1*var(--a)));font-size:.62rem}.oras-route-panel{min-height:0;border-left:0;border-top:1px solid rgba(226,201,137,.13);padding:15px 4px 4px}.oras-route-list{max-height:210px}.oras-toolbar{width:min(430px,calc(100vw - 118px));height:44px}}
@media(max-width:560px){.oras-head{padding:2px 42px 6px}.oras-head h1{font-size:2.2rem}.oras-head p{font-size:.87rem}.oras-wheel{width:min(92vw,390px)}.oras-route-node{width:78px;min-height:57px;padding:7px 5px;font-size:.54rem;transform:translate(-50%,-50%) rotate(var(--a)) translateY(-149px) rotate(calc(-1*var(--a)))}.oras-route-node b{font-size:.82rem}.oras-center{width:34%}.oras-center strong{font-size:1.25rem}.oras-toolbar{width:calc(100vw - 112px);min-width:230px;height:42px}.oras-toolbar button{font-size:10px}.oras-route-panel h2{font-size:1.8rem}}
@media(max-width:390px){.oras-wheel{width:350px;max-width:100%}.oras-route-node{width:72px;min-height:54px;transform:translate(-50%,-50%) rotate(var(--a)) translateY(-133px) rotate(calc(-1*var(--a)));font-size:.5rem}.oras-toolbar{width:calc(100vw - 96px);min-width:215px}}
@media(prefers-reduced-motion:reduce){.oras-route-node,.oras-cover-enter{transition:none}}
`;
document.head.appendChild(style);

const cover=document.createElement('section');
cover.className='oras-cover';cover.hidden=!coverEntry;cover.innerHTML=`<div class="oras-cover-frame"><img src="${ROOT}/assets/oras-portada-final.jpg" alt="ORAS · Lo que queda de las horas"><button class="oras-cover-enter" type="button" aria-label="Entrar en ORAS"></button></div>`;
document.body.appendChild(cover);

const index=document.createElement('section');
index.className='oras-index';index.setAttribute('aria-label','Índice ORAS · recorridos de lectura');index.innerHTML=`<div class="oras-index-shell"><button class="oras-index-close" type="button" aria-label="Cerrar">×</button><header class="oras-head"><small>ORAS · Lo que queda de las horas</small><h1>Recorridos de lectura</h1><p>Una obra, ocho trayectos. Elige una pregunta y atraviesa ORAS desde ella.</p></header><div class="oras-wheel-wrap"><div class="oras-wheel"><div class="oras-center"><div><strong>ORAS</strong><span>huella · tiempo · memoria</span></div></div></div><aside class="oras-route-panel" aria-live="polite"></aside></div></div>`;
document.body.appendChild(index);
const wheel=index.querySelector('.oras-wheel');
ROUTES.forEach((r,i)=>{const b=document.createElement('button');b.className='oras-route-node'+(r.canonical?' is-canonical':'');b.type='button';b.dataset.route=r.id;b.style.setProperty('--a',`${i*45}deg`);b.innerHTML=`<b>${r.n}</b>${r.title}`;wheel.appendChild(b)});

const toolbar=document.createElement('nav');toolbar.className='oras-toolbar';toolbar.setAttribute('aria-label','Navegación canónica ORAS');toolbar.innerHTML='<button type="button" data-prev>← Atrás</button><button class="index" type="button" data-index>Índice ORAS</button><button type="button" data-next>Adelante →</button>';document.body.appendChild(toolbar);

let selectedId=localStorage.getItem(ROUTE_KEY)||'canonica';
if(!ROUTES.some(r=>r.id===selectedId))selectedId='canonica';
const selected=()=>ROUTES.find(r=>r.id===selectedId)||ROUTES.at(-1);
const readPos=()=>{const n=Number(sessionStorage.getItem(POS_KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0};
const writePos=n=>{try{sessionStorage.setItem(POS_KEY,String(n))}catch(_){}};
const normHref=href=>{try{const u=new URL(href,location.origin);return u.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')+'|'+u.search+'|'+u.hash}catch(_){return href}};
const currentNorm=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')+'|'+location.search+'|'+location.hash;
function derivePos(route){const cur=currentNorm();let exact=route.items.findIndex(x=>normHref(x.href)===cur);if(exact>=0)return exact;const p=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');let byPath=route.items.findIndex(x=>{try{return new URL(x.href,location.origin).pathname.replace(/\/+$/,'')===p}catch(_){return false}});return byPath>=0?byPath:Math.min(readPos(),route.items.length-1)}
function syncToolbar(){const r=selected();let pos=derivePos(r);writePos(pos);toolbar.querySelector('[data-prev]').disabled=pos<=0;toolbar.querySelector('[data-next]').disabled=pos>=r.items.length-1;toolbar.title=`${r.n} · ${r.title} · ${pos+1}/${r.items.length}`}
function go(delta){const r=selected();let pos=derivePos(r)+delta;if(pos<0||pos>=r.items.length)return;writePos(pos);location.href=r.items[pos].href}
function selectRoute(id,openPanel=true){const r=ROUTES.find(x=>x.id===id)||ROUTES.at(-1);selectedId=r.id;try{localStorage.setItem(ROUTE_KEY,r.id)}catch(_){};index.querySelectorAll('.oras-route-node').forEach(n=>n.classList.toggle('is-selected',n.dataset.route===r.id));const panel=index.querySelector('.oras-route-panel');panel.innerHTML=`<div class="oras-mi-kicker">RECORRIDO ${r.n}${r.canonical?' · CANÓNICO':''}</div><h2>${r.title}</h2><div class="sub">${r.subtitle}</div><div class="oras-route-question">${r.question}</div><ol class="oras-route-list">${r.items.map((x,i)=>`<li><span class="num">${String(i+1).padStart(2,'0')}</span><span>${x.label}</span></li>`).join('')}</ol><button class="oras-route-start" type="button">Comenzar este recorrido</button><div class="oras-route-coda"><strong>Culminación:</strong> ${r.culmination}</div>`;panel.querySelector('.oras-route-start').addEventListener('click',()=>{writePos(0);closeIndex();location.href=r.items[0].href});if(openPanel)panel.scrollTop=0;syncToolbar()}
function openIndex(){index.classList.add('is-open');cover.hidden=true;selectRoute(selectedId,false);setTimeout(()=>index.querySelector('.oras-index-close')?.focus({preventScroll:true}),0)}
function closeIndex(){index.classList.remove('is-open')}

wheel.addEventListener('click',e=>{const b=e.target.closest('[data-route]');if(b)selectRoute(b.dataset.route)});
cover.querySelector('.oras-cover-enter').addEventListener('click',openIndex);
index.querySelector('.oras-index-close').addEventListener('click',closeIndex);
toolbar.querySelector('[data-index]').addEventListener('click',openIndex);
toolbar.querySelector('[data-prev]').addEventListener('click',()=>go(-1));
toolbar.querySelector('[data-next]').addEventListener('click',()=>go(1));
addEventListener('keydown',e=>{if(e.key==='Escape'&&index.classList.contains('is-open'))closeIndex()});
window.ORASMasterIndex={open:openIndex,close:closeIndex,selectRoute};
if(qs.get('indice')==='1')openIndex();
selectRoute(selectedId,false);syncToolbar();
})();