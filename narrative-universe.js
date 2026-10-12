(()=>{
'use strict';

const STORAGE='oras.universe.v2';
const ROOT='/solo-la-tarjeta/';
const anaPage=location.pathname.includes('/elegia-breve/');
const epilogueDocument=location.pathname.includes('/epilogo/');

if(epilogueDocument)document.documentElement.classList.add('ou-epilogue-document');

const syncJourneyNav=()=>{
  const hideJourneyNav=anaPage&&location.hash.toLowerCase()==='#ceniciento';
  document.documentElement.classList.toggle('ou-hide-journey-nav',hideJourneyNav);
};

const syncEpilogueForward=()=>{
  if(!anaPage)return;
  const button=document.getElementById('journeyNext');
  if(!button)return;
  const epilogue=location.hash.toLowerCase()==='#epilogo';
  if(epilogue){
    button.disabled=false;
    button.textContent='Delante';
    button.title='SOLO LA TARJETA';
    button.setAttribute('aria-label','Continuar a SOLO LA TARJETA');
    button.dataset.ouSoloForward='true';
  }else if(button.dataset.ouSoloForward==='true'){
    button.textContent='Siguiente';
    button.title='';
    delete button.dataset.ouSoloForward;
  }
};

const syncRouteChrome=()=>{
  syncJourneyNav();
  syncEpilogueForward();
};

syncRouteChrome();
window.addEventListener('hashchange',syncRouteChrome);
window.addEventListener('popstate',syncRouteChrome);

if(anaPage){
  const originalPushState=history.pushState.bind(history);
  history.pushState=(...args)=>{
    const result=originalPushState(...args);
    queueMicrotask(syncRouteChrome);
    return result;
  };
  const originalReplaceState=history.replaceState.bind(history);
  history.replaceState=(...args)=>{
    const result=originalReplaceState(...args);
    queueMicrotask(syncRouteChrome);
    return result;
  };
}

function readUniverseState(){
  try{
    const raw=localStorage.getItem(STORAGE);
    return raw?JSON.parse(raw):{};
  }catch(_){return {}}
}

function markCardFound(){
  try{
    const state=readUniverseState();
    state.cardFound=true;
    localStorage.setItem(STORAGE,JSON.stringify(state));
  }catch(_){}
}

function goToSoloFromEpilogue(){
  const card=document.querySelector('.ou-card');
  if(card){card.click();return;}
  markCardFound();
  const url=ROOT+'?origen=tarjeta&auto=1&v=20261012-epilogo';
  try{window.top.location.href=url}catch(_){location.href=url}
}

function trilogyCompleteForMirror(){
  const state=readUniverseState();
  return state.soloComplete===true&&state.anaComplete===true&&state.cenicientoComplete===true&&state.mirrorReadComplete!==true;
}

function launchMirrorFromAna(){
  if(document.body.classList.contains('mirror'))return;
  let mirror=document.getElementById('mirror');
  if(!mirror){
    mirror=document.createElement('main');
    mirror.id='mirror';
    mirror.setAttribute('aria-label','EL ESPEJO');
    mirror.hidden=true;
    document.body.appendChild(mirror);
  }
  const start=()=>window.dispatchEvent(new CustomEvent('oras:mirror-start'));
  const existing=document.querySelector('script[data-oras-mirror]');
  if(existing){start();return;}
  const script=document.createElement('script');
  script.dataset.orasMirror='true';
  script.src='/solo-la-tarjeta/ceniciento/el-espejo.js?v=20261012-last-ana-piece';
  script.onload=start;
  document.body.appendChild(script);
}

document.addEventListener('click',event=>{
  const button=event.target.closest?.('#journeyNext');
  if(!button||!anaPage)return;
  const hash=location.hash.toLowerCase();
  if(hash==='#epilogo'){
    event.preventDefault();
    event.stopImmediatePropagation();
    goToSoloFromEpilogue();
    return;
  }
  if(hash!=='#estrella')return;
  if(!trilogyCompleteForMirror())return;
  event.preventDefault();
  event.stopImmediatePropagation();
  launchMirrorFromAna();
},true);

const base=document.createElement('script');
base.src='https://cdn.jsdelivr.net/gh/pacolazarog-stack/solo-la-tarjeta@80866cb8ae17d31356462edf408a4d7f099e1241/narrative-universe.js';
base.async=false;
base.onload=()=>{
  const style=document.createElement('style');
  style.id='mobile-portrait-layout-fix';
  style.textContent=`
html.ou-hide-journey-nav .journey-nav{
  display:none!important;
}
html.ou-epilogue-document .ou-card{
  display:none!important;
}
.ou-card{
  right:max(16px,env(safe-area-inset-right))!important;
  left:auto!important;
  transform:rotate(4deg)!important;
}
.ou-reading-checklist{
  left:max(10px,env(safe-area-inset-left))!important;
  right:auto!important;
}
.ou-reading-checklist summary{margin-left:0!important}
.ou-reading-checklist ul{left:0!important;right:auto!important}

@media(max-width:700px) and (orientation:portrait){
  .ou-card{
    right:max(10px,env(safe-area-inset-right))!important;
    left:auto!important;
    bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;
    width:94px!important;
    height:58px!important;
    transform:rotate(4deg)!important;
  }
  .ou-card::before{left:13px!important;top:12px!important;width:23px!important;height:17px!important}
  .ou-card::after{left:13px!important;right:13px!important;bottom:11px!important}

  .ou-reading-checklist{
    left:max(10px,env(safe-area-inset-left))!important;
    right:auto!important;
    bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important;
  }
  .ou-reading-checklist summary{
    margin-left:0!important;
    padding:5px 8px!important;
    border-color:rgba(255,255,255,.20)!important;
    background:rgba(12,12,12,.38)!important;
    backdrop-filter:blur(3px)!important;
    -webkit-backdrop-filter:blur(3px)!important;
  }
  .ou-reading-checklist ul{left:0!important;right:auto!important}

  .journey-nav{
    left:112px!important;
    right:112px!important;
    bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;
    transform:none!important;
    width:auto!important;
    max-width:none!important;
    height:48px!important;
    padding:0!important;
    border:0!important;
    border-top:1px solid rgba(255,250,241,.46)!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    backdrop-filter:none!important;
    -webkit-backdrop-filter:none!important;
  }
  .journey-nav button{
    min-width:0!important;
    min-height:48px!important;
    padding:7px 3px!important;
    border:0!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    font-size:12px!important;
    text-shadow:0 1px 4px rgba(0,0,0,.9)!important;
  }
  .journey-nav button+button{
    border-left:1px solid rgba(255,250,241,.26)!important;
  }
}
`;
  document.head.appendChild(style);
  syncRouteChrome();
};
base.onerror=()=>console.error('No se pudo cargar el módulo base del universo narrativo.');
document.head.appendChild(base);
})();
