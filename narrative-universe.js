(()=>{
'use strict';

/*
  ORAS · puente de compatibilidad del contador de lecturas.
  Conserva íntegra la versión publicada inmediatamente anterior y corrige tres
  desajustes de estado: el cierre real de CENICIENTO, el reinicio de ANA tras
  EL ESPEJO y el borrado total de huellas al comenzar un nuevo ciclo.
*/
const STORAGE='oras.universe.v2';
const GENERAL='oras.reading.index.v1';
const LEGACY='https://cdn.jsdelivr.net/gh/pacolazarog-stack/solo-la-tarjeta@ab1f9b3574c94da479674391c14e2908f7247048/narrative-universe.js';
const VERSION='20261014-manual-reset-only-1';
const ANA_KEYS=Object.freeze(['estrella','elegia','ojos','labios','cabello','piel','interludio','epilogo']);

function readState(){
  try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch(_){return {}}
}
function readGeneral(){
  try{return JSON.parse(localStorage.getItem(GENERAL)||'{}')||{}}catch(_){return {}}
}
function writeState(patch={}){
  try{
    const current=readState();
    const next=Object.assign({},current,patch);
    localStorage.setItem(STORAGE,JSON.stringify(next));
    queueMicrotask(()=>{try{window.ORASReadingWindowR2?.render?.(true)}catch(_){}});
    return next;
  }catch(_){return readState()}
}
function emptyAnaParts(){return Object.fromEntries(ANA_KEYS.map(key=>[key,false]));}
function clearGeneralVisits(){
  try{
    const current=readGeneral();
    localStorage.setItem(GENERAL,JSON.stringify(Object.assign({},current,{done:{}})));
  }catch(_){
    try{localStorage.setItem(GENERAL,JSON.stringify({done:{}}))}catch(__){}
  }
}

/*
  CANON ORAS · REINICIO TOTAL DE LECTURA
  Un reinicio abre un ciclo completamente nuevo: ninguna de las 43 huellas
  anteriores puede continuar marcada como visitada. Se limpia LA VIDA, el
  estado contable de EL ESPEJO, toda LA EXPANSIÓN y EL CERO. La posible huella
  conceptual de haber atravesado antes el espejo (realityDeformed) puede
  conservarse, pero nunca cuenta como lectura ni desbloquea rutas.
*/
function clearStaleVisitsAfterRestart(){return;}

/*
  CENICIENTO no debe depender exclusivamente del evento `ended`: el reproductor
  puede mostrar FIN / duración completa tras un seek o por redondeo sin que ese
  evento llegue a dispararse. La lectura se marca completa sólo cuando existe
  un recorrido iniciado y se alcanza realmente el final de voz o la señal FIN.
*/
function installCenicientoFinishBridge(){
  const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
  if(!path.endsWith('/ceniciento'))return;

  const markComplete=()=>{
    const state=readState();
    if(!Number.isFinite(state.journeyStartedAt)||state.journeyStartedAt<=0)return;
    if(state.cenicientoComplete===true)return;
    const viaQuestion=new URLSearchParams(location.search).get('via')==='question';
    const patch={cenicientoComplete:true};
    if(state.cenicientoUnlocked===true||viaQuestion)patch.cenicientoUnlocked=true;
    writeState(patch);
  };

  const hook=()=>{
    const status=document.getElementById('status');
    if(status&&!status.dataset.orasCounterFinishHook){
      status.dataset.orasCounterFinishHook='1';
      const check=()=>{if(status.textContent.trim().toUpperCase()==='FIN')markComplete();};
      new MutationObserver(check).observe(status,{childList:true,subtree:true,characterData:true});
      check();
    }

    const voice=document.getElementById('voice');
    if(voice&&!voice.dataset.orasCounterFinishHook){
      voice.dataset.orasCounterFinishHook='1';
      voice.addEventListener('ended',markComplete);
      voice.addEventListener('timeupdate',()=>{
        if(Number.isFinite(voice.duration)&&voice.duration>0&&voice.currentTime>=voice.duration-.35)markComplete();
      },{passive:true});
      if(voice.ended)markComplete();
    }
  };

  hook();
  setInterval(hook,500);
}

function installFixes(){
  clearStaleVisitsAfterRestart();
  addEventListener('oras:mirror-returned',clearStaleVisitsAfterRestart);
  addEventListener('pageshow',clearStaleVisitsAfterRestart);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)clearStaleVisitsAfterRestart()});
  setTimeout(clearStaleVisitsAfterRestart,0);
  setTimeout(clearStaleVisitsAfterRestart,650);
  installCenicientoFinishBridge();
}

const legacy=document.createElement('script');
legacy.src=LEGACY+'?v='+VERSION;
legacy.async=false;
legacy.addEventListener('load',installFixes,{once:true});
document.head.appendChild(legacy);
})();
