(()=>{
'use strict';
const KEY='oras.reading.index.v1';
const GO=new URLSearchParams(location.search).get('go');
const VERSION=2;

/* Los identificadores ciu-10…ciu-13 conservan la identidad histórica de cada
   capítulo para no perder checks ya almacenados. Cambia el número visible, no
   la huella persistente asociada al capítulo. */
const MAP=[
  ['inv-1',/\bI\.?\s+EL RECIBIDOR\b/],['inv-2',/\bII\.?\s+LA HABITACI[ÓO]N DEL RELOJ\b/],['inv-3',/\bIII\.?\s+LA COCINA\b/],['inv-4',/\bIV\.?\s+EL PASILLO\b/],
  ['inv-5',/\bV\.?\s+EL DORMITORIO\b/],['inv-6',/\bVI\.?\s+EL JARD[ÍI]N\b/],['inv-7',/\bVII\.?\s+INVENTARIO\b/],['inv-8',/\bVIII\.?\s+SALIDA\b/],
  ['som-1',/\bI\.?\s+LA ESTACI[ÓO]N\b/],['som-2',/\bII\.?\s+EL REVISOR\b/],['som-3',/\bIII\.?\s+LAS SOMBRAS\b/],['som-4',/\bIV\.?\s+EL HOMBRE DE LA FILA SIETE\b/],
  ['som-5',/\bV\.?\s+CONVERSACI[ÓO]N\b/],['som-6',/\bVI\.?\s+INVENTARIO DE AUSENCIAS M[ÓO]VILES\b/],['som-7',/\bVII\.?\s+EL TALLER\b/],['som-8',/\bVIII\.?\s+EL OFICIO\b/],['som-9',/\bIX\.?\s+[ÚU]LTIMO RECORRIDO\b/],
  ['ciu-1',/\bI\.?\s+LA PLAZA\b/],['ciu-2',/\bII\.?\s+EL ARCHIVERO\b/],['ciu-3',/\bIII\.?\s+LA FUENTE\b/],['ciu-4',/\bIV\.?\s+LOS RESISTENTES\b/],
  ['ciu-5',/\bV\.?\s+EL MAPA IMPOSIBLE\b/],['ciu-6',/\bVI\.?\s+TEOR[ÍI]A\b/],['ciu-7',/\bVII\.?\s+EL MUSEO\b/],['ciu-8',/\bVIII\.?\s+EL VISITANTE\b/],['ciu-9',/\bIX\.?\s+INVIERNO\b/],
  ['ciu-11',/\bX\.?\s+EL ARCHIVO PROFUNDO\b/],
  ['ciu-12',/\bXI\.?\s+LA M[ÁA]QUINA DE LAS HUELLAS\b/],
  ['ciu-13',/\bXII\.?\s+EL RESONADOR\b/],
  ['ciu-10',/\bXIII\.?\s+LA [ÚU]LTIMA SALA\b/],
  ['zero',/HABITACI[ÓO]N N[ÚU]MERO CERO/]
];

const norm=s=>(s||'').replace(/\s+/g,' ').trim().toUpperCase();
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:VERSION,done:{}}}catch(_){return{version:VERSION,done:{}}}};
const write=s=>{try{localStorage.setItem(KEY,JSON.stringify(s));dispatchEvent(new CustomEvent('oras:general-progress',{detail:s}))}catch(_){}};
function mark(id){
  if(!id)return;
  const s=read();s.version=VERSION;s.done=s.done&&typeof s.done==='object'?s.done:{};
  if(s.done[id]?.done===true||s.done[id]===true)return;
  s.done[id]={done:true,at:Date.now()};write(s);
}
function idForPanel(panel){
  if(panel.classList.contains('atlas-panel')||panel.classList.contains('atlas-panel-r6'))return'atlas';
  const heading=panel.querySelector('h1,h2,h3,.volume-label');
  const title=norm(heading?.textContent||'');
  return MAP.find(([,re])=>re.test(title))?.[0]||null;
}
function panelForId(id){
  if(id==='atlas')return document.querySelector('.story-panel.atlas-panel-r6,.story-panel.atlas-panel');
  return [...document.querySelectorAll('.story-panel')].find(p=>idForPanel(p)===id)||null;
}

const wired=new WeakSet();
function wirePanel(panel){
  if(wired.has(panel))return;wired.add(panel);
  const id=idForPanel(panel);if(!id)return;
  const copy=panel.querySelector('.panel-copy')||panel;
  let timer=0,visible=false;
  const nearBottom=()=>copy.scrollHeight<=copy.clientHeight+28||copy.scrollTop+copy.clientHeight>=copy.scrollHeight-36;
  const consider=()=>{
    if(!visible)return;
    clearTimeout(timer);
    timer=setTimeout(()=>{if(visible&&nearBottom())mark(id)},1150);
  };
  copy.addEventListener('scroll',consider,{passive:true});
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      const e=entries[0];visible=!!e?.isIntersecting&&e.intersectionRatio>=.52;
      if(visible)consider();else clearTimeout(timer);
    },{threshold:[.3,.52,.75]});io.observe(panel);
  }else{
    visible=true;consider();
  }
}
function wireAtlas(){
  document.querySelectorAll('.atlas-r6-spin,[data-atlas-spin],.atlas-r5-spin').forEach(btn=>{
    if(btn.dataset.orasGeneralProgress)return;
    btn.dataset.orasGeneralProgress='1';btn.addEventListener('click',()=>mark('atlas'),{once:true});
  });
}
function scan(){document.querySelectorAll('.story-panel').forEach(wirePanel);wireAtlas();}

let goDone=false;
function goToRequested(){
  if(goDone||!GO)return;
  const panel=panelForId(GO);if(!panel)return;
  goDone=true;
  requestAnimationFrame(()=>panel.scrollIntoView({block:'start',behavior:'auto'}));
  setTimeout(()=>panel.focus?.({preventScroll:true}),120);
}

const mo=new MutationObserver(()=>{scan();goToRequested()});
mo.observe(document.documentElement,{childList:true,subtree:true});
scan();goToRequested();
setTimeout(()=>{scan();goToRequested()},650);
setTimeout(()=>{scan();goToRequested()},1800);

window.ORASGeneralProgress={read,mark,panelForId};
})();
