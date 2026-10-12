(()=>{
'use strict';

const STORAGE='oras.universe.v2';
const MIRROR_AUDIO_STORAGE='oras.mirror.audio.v1';
const ROOT='/solo-la-tarjeta/';
const VERSION='20261012-epilogue-unread-forward-1';
const anaPage=location.pathname.includes('/elegia-breve/');
const soloPage=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'')==='/solo-la-tarjeta';
const epilogueDocument=location.pathname.includes('/epilogo/');
const returnedFromInventory=anaPage&&new URLSearchParams(location.search).get('from')==='inventario';

if(epilogueDocument)document.documentElement.classList.add('ou-epilogue-document');
if(soloPage)document.documentElement.classList.add('ou-solo-document');

const ANA_FORWARD_TARGETS=[
  {state:'estrella',route:'estrella',label:'Prólogo · Siguiendo una tarjeta',id:'anaEstrella'},
  {state:'elegia',route:'elegia',label:'Elegía breve para Ana Klaudya',id:'anaRead'},
  {state:'ojos',route:'ojos',label:'En tus ojos',id:'anaOjos'},
  {state:'labios',route:'sonrisa',label:'En tus labios',id:'anaSonrisa'},
  {state:'cabello',route:'cabello',label:'Tu cabello',id:'anaCabello'},
  {state:'piel',route:'piel',label:'Tu piel',id:'anaPiel'},
  {state:'interludio',route:'interludio',label:'Interludio · Iba a llevarte flores',id:'anaInterlude'},
  {state:'epilogo',route:'epilogo',label:'Epílogo · A fuego lento',id:'anaEpilogue'}
];
function firstUnreadAnaTarget(){
  const parts=readUniverseState().anaParts;
  if(!parts||typeof parts!=='object')return null;
  return ANA_FORWARD_TARGETS.find(target=>target.route!=='epilogo'&&parts[target.state]===false)||null;
}
function openAnaTarget(target){
  if(!target)return false;
  if(target.route==='elegia'){
    try{history.replaceState(history.state,'',location.pathname+location.search)}catch(_){}
  }
  const control=document.getElementById(target.id);
  if(!control)return false;
  control.click();
  return true;
}

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
    const target=firstUnreadAnaTarget();
    button.disabled=false;
    button.textContent='Delante';
    if(target){
      button.title=target.label;
      button.setAttribute('aria-label','Continuar a '+target.label);
      button.dataset.ouAnaUnreadForward=target.route;
      delete button.dataset.ouSoloForward;
    }else{
      button.title='SOLO LA TARJETA';
      button.setAttribute('aria-label','Continuar a SOLO LA TARJETA');
      button.dataset.ouSoloForward='true';
      delete button.dataset.ouAnaUnreadForward;
    }
  }else if(button.dataset.ouSoloForward==='true'||button.dataset.ouAnaUnreadForward){
    button.textContent='Siguiente';
    button.title='';
    delete button.dataset.ouSoloForward;
    delete button.dataset.ouAnaUnreadForward;
  }
};
const syncRouteChrome=()=>{syncJourneyNav();syncEpilogueForward()};
syncRouteChrome();
addEventListener('hashchange',syncRouteChrome);
addEventListener('popstate',syncRouteChrome);

if(anaPage){
  const push=history.pushState.bind(history),replace=history.replaceState.bind(history);
  history.pushState=(...args)=>{const out=push(...args);queueMicrotask(syncRouteChrome);return out};
  history.replaceState=(...args)=>{const out=replace(...args);queueMicrotask(syncRouteChrome);return out};
}

function hostWindow(){try{return window.top||window}catch(_){return window}}
function hostDocument(){try{return hostWindow().document}catch(_){return document}}
function hostAudio(){return [...hostDocument().querySelectorAll('audio')]}
function readUniverseState(){try{const raw=localStorage.getItem(STORAGE);return raw?JSON.parse(raw):{}}catch(_){return {}}}
function resetCycleAfterInventoryReturn(){
  if(!returnedFromInventory)return;
  try{
    const saved=readUniverseState();
    const next=Object.assign({},saved,{
      anaComplete:false,
      anaParts:{estrella:false,elegia:false,ojos:false,labios:false,cabello:false,piel:false,interludio:false,epilogo:false},
      soloComplete:false,
      cenicientoComplete:false,
      mirrorReadComplete:false,
      returnedFromCeniciento:false
    });
    localStorage.setItem(STORAGE,JSON.stringify(next));
    sessionStorage.removeItem(MIRROR_AUDIO_STORAGE);
  }catch(_){}
  try{history.replaceState(history.state,'',location.pathname+(location.hash||''))}catch(_){}
}
resetCycleAfterInventoryReturn();
function markCardFound(){try{const state=readUniverseState();state.cardFound=true;localStorage.setItem(STORAGE,JSON.stringify(state))}catch(_){}}
function veil(){
  const doc=hostDocument();
  let node=doc.getElementById('ou-transition-v2');
  if(node)return node;
  node=doc.createElement('div');node.id='ou-transition-v2';node.setAttribute('aria-hidden','true');
  node.style.cssText='position:fixed;inset:0;z-index:2147483646;pointer-events:none;background:#100f0e;opacity:0;transition:opacity 2.2s ease';
  doc.body.appendChild(node);return node;
}
function fadeAudio(duration=2200){
  const tracks=hostAudio().map(audio=>({audio,start:Number.isFinite(audio.volume)?audio.volume:1}));
  const began=performance.now();
  return new Promise(resolve=>{
    const step=now=>{
      const p=Math.min(1,(now-began)/duration);
      tracks.forEach(({audio,start})=>{try{audio.volume=Math.max(0,start*(1-p))}catch(_){}});
      if(p<1){requestAnimationFrame(step);return}
      tracks.forEach(({audio})=>{try{audio.volume=0;audio.pause()}catch(_){}});resolve();
    };
    requestAnimationFrame(step);
  });
}
function hardSilence(){
  hostAudio().forEach(audio=>{
    try{
      audio.autoplay=false;
      audio.removeAttribute('autoplay');
      audio.volume=0;
      audio.muted=true;
      audio.pause();
    }catch(_){}
  });
}
async function darkAndSilence(){
  const node=veil();
  requestAnimationFrame(()=>{node.style.opacity='1'});
  await fadeAudio(2200);
  hardSilence();
  return node;
}
function revealMirror(node){if(!node)return;node.style.transition='opacity .95s ease';requestAnimationFrame(()=>{node.style.opacity='0'});setTimeout(()=>node.remove(),1100)}
function saveMirrorAudioState(){
  const win=hostWindow(),doc=hostDocument(),drone=doc.getElementById('soundtrack');
  const path=win.location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
  const origin=path==='/solo-la-tarjeta'?'solo':'ana';
  const state={origin,route:win.location.hash||'',droneTime:origin==='solo'&&drone?drone.currentTime||0:0,droneVolume:origin==='solo'&&drone&&drone.volume>0?drone.volume:.14};
  try{win.sessionStorage.setItem(MIRROR_AUDIO_STORAGE,JSON.stringify(state))}catch(_){}
}

let navTransitioning=false;
async function goToSolo(origin='tarjeta'){
  if(navTransitioning)return;
  navTransitioning=true;
  markCardFound();
  await darkAndSilence();
  const url=ROOT+'?origen='+encodeURIComponent(origin)+'&auto=1&v='+VERSION;
  try{hostWindow().location.href=url}catch(_){location.href=url}
}

let mirrorTransitioning=false,permitMirrorStart=false,mirrorSilenceTimer=0;
function guardMirrorSilence(){
  hardSilence();
  clearInterval(mirrorSilenceTimer);
  mirrorSilenceTimer=setInterval(hardSilence,90);
}
function syncMirrorSilenceFromBody(){
  const doc=hostDocument();
  if(doc.body?.classList.contains('mirror'))guardMirrorSilence();
}
addEventListener('oras:mirror-silence',guardMirrorSilence,true);
addEventListener('oras:mirror-start',event=>{
  if(permitMirrorStart){permitMirrorStart=false;guardMirrorSilence();return}
  event.stopImmediatePropagation();
  if(mirrorTransitioning)return;
  mirrorTransitioning=true;
  saveMirrorAudioState();
  darkAndSilence().then(node=>{
    guardMirrorSilence();
    permitMirrorStart=true;
    dispatchEvent(new CustomEvent('oras:mirror-start'));
    setTimeout(()=>revealMirror(node),80);
    mirrorTransitioning=false;
  });
},true);

if(document.body){
  new MutationObserver(syncMirrorSilenceFromBody).observe(document.body,{attributes:true,attributeFilter:['class']});
  syncMirrorSilenceFromBody();
}else{
  addEventListener('DOMContentLoaded',()=>{
    new MutationObserver(syncMirrorSilenceFromBody).observe(document.body,{attributes:true,attributeFilter:['class']});
    syncMirrorSilenceFromBody();
  },{once:true});
}
addEventListener('pageshow',syncMirrorSilenceFromBody);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncMirrorSilenceFromBody()});

function ensureMirrorEngine(){
  if(window.parent!==window||(!soloPage&&!anaPage))return;
  let mirror=document.getElementById('mirror');
  if(!mirror){mirror=document.createElement('main');mirror.id='mirror';mirror.setAttribute('aria-label','EL ESPEJO');mirror.hidden=true;document.body.appendChild(mirror)}
  if(document.querySelector('script[data-oras-mirror]'))return;
  const script=document.createElement('script');
  script.dataset.orasMirror='true';
  script.src=ROOT+'ceniciento/el-espejo.js?v='+VERSION;
  script.addEventListener('load',()=>{script.dataset.loaded='true'},{once:true});
  document.body.appendChild(script);
}
ensureMirrorEngine();

function trilogyCompleteForMirror(){const state=readUniverseState();return state.soloComplete===true&&state.anaComplete===true&&state.cenicientoComplete===true&&state.mirrorReadComplete!==true}
function launchMirrorFromAna(){
  ensureMirrorEngine();
  const script=document.querySelector('script[data-oras-mirror]');
  if(script?.dataset.loaded==='true'){dispatchEvent(new CustomEvent('oras:mirror-start'));return}
  if(script)script.addEventListener('load',()=>{script.dataset.loaded='true';dispatchEvent(new CustomEvent('oras:mirror-start'))},{once:true});
}

document.addEventListener('click',event=>{
  const card=event.target.closest?.('.ou-card');
  if(card&&anaPage){
    event.preventDefault();
    event.stopImmediatePropagation();
    goToSolo('ana-nav');
    return;
  }
  const button=event.target.closest?.('#journeyNext');
  if(!button||!anaPage)return;
  const hash=location.hash.toLowerCase();
  if(hash==='#epilogo'){
    event.preventDefault();
    event.stopImmediatePropagation();
    const target=firstUnreadAnaTarget();
    if(target&&openAnaTarget(target)){
      syncRouteChrome();
      return;
    }
    goToSolo('tarjeta');
    return;
  }
  if(hash==='#estrella'&&trilogyCompleteForMirror()){
    event.preventDefault();
    event.stopImmediatePropagation();
    launchMirrorFromAna();
  }
},true);

const base=document.createElement('script');
base.src='https://cdn.jsdelivr.net/gh/pacolazarog-stack/solo-la-tarjeta@80866cb8ae17d31356462edf408a4d7f099e1241/narrative-universe.js';
base.async=false;
base.onload=()=>{
  const style=document.createElement('style');
  style.id='mobile-portrait-layout-fix';
  style.textContent=`
html.ou-hide-journey-nav .journey-nav{display:none!important}
html.ou-epilogue-document .ou-card{display:none!important}
html.ou-solo-document .work-subtitle{display:none!important}
.ou-card{right:max(16px,env(safe-area-inset-right))!important;left:auto!important;transform:rotate(4deg)!important}
.ou-reading-checklist{left:max(70px,calc(env(safe-area-inset-left) + 56px))!important;right:auto!important}
.ou-reading-checklist summary{margin-left:0!important}.ou-reading-checklist ul{left:0!important;right:auto!important}
@media(max-width:700px) and (orientation:portrait){
.ou-card{right:max(10px,env(safe-area-inset-right))!important;left:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;width:94px!important;height:58px!important;transform:rotate(4deg)!important}
.ou-card::before{left:13px!important;top:12px!important;width:23px!important;height:17px!important}.ou-card::after{left:13px!important;right:13px!important;bottom:11px!important}
.ou-reading-checklist{left:max(70px,calc(env(safe-area-inset-left) + 56px))!important;right:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important}
.ou-reading-checklist summary{margin-left:0!important;padding:5px 8px!important;border-color:rgba(255,255,255,.20)!important;background:rgba(12,12,12,.38)!important;backdrop-filter:blur(3px)!important;-webkit-backdrop-filter:blur(3px)!important}.ou-reading-checklist ul{left:0!important;right:auto!important}
.journey-nav{left:112px!important;right:112px!important;bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;transform:none!important;width:auto!important;max-width:none!important;height:48px!important;padding:0!important;border:0!important;border-top:1px solid rgba(255,250,241,.46)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.journey-nav button{min-width:0!important;min-height:48px!important;padding:7px 3px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;font-size:12px!important;text-shadow:0 1px 4px rgba(0,0,0,.9)!important}.journey-nav button+button{border-left:1px solid rgba(255,250,241,.26)!important}
}`;
  document.head.appendChild(style);
  syncRouteChrome();
};
base.onerror=()=>console.error('No se pudo cargar el módulo base del universo narrativo.');
document.head.appendChild(base);
})();
