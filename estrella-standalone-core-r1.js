(()=>{
'use strict';
if(window.__orasStarStandaloneCoreR1)return;
window.__orasStarStandaloneCoreR1=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const BASE='/solo-la-tarjeta';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261016-ana-route-5`;
const STORAGE='oras.universe.v2';
const MASTER_VOLUME='oras.master.volume.v1';
const MUSIC_STATE='oras.ana.star.music.v1';

const style=document.createElement('style');
style.textContent=`
html,body{visibility:visible!important;opacity:1!important}
body{display:block!important}
main,.intro,.controls,.status,.music-controls,.detail-background,.celestial-scene{visibility:visible!important;opacity:1!important}
main{display:grid!important;pointer-events:auto!important}
@media(max-width:760px){main{display:block!important}}
#orasStarContinue{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;display:none;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border:1px solid rgba(234,213,165,.52);border-radius:999px;background:rgba(9,14,25,.82);color:#f8eee4;text-decoration:none;font:600 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.28)}
#orasStarContinue.is-ready{display:inline-flex}
`;
document.head.appendChild(style);

function masterVolume(){
  try{
    const n=Number(localStorage.getItem(MASTER_VOLUME));
    return Number.isFinite(n)&&n>=0?Math.max(0,Math.min(100,n)):80;
  }catch(_){return 80;}
}
function markRead(){
  try{
    const state=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
    const parts=Object.assign({},state.anaParts||{}, {estrella:true});
    state.anaParts=parts;
    localStorage.setItem(STORAGE,JSON.stringify(state));
  }catch(_){ }
}
function install(){
  document.documentElement.classList.remove('publication-pending');
  document.documentElement.style.setProperty('visibility','visible','important');
  document.documentElement.style.setProperty('opacity','1','important');
  if(!document.body)return;
  document.body.style.setProperty('visibility','visible','important');
  document.body.style.setProperty('opacity','1','important');
  document.body.removeAttribute('aria-hidden');

  const level=masterVolume();
  const slider=document.getElementById('musicLevel');
  const output=document.getElementById('musicValue');
  const enabled=document.getElementById('musicEnabled');
  const start=document.getElementById('musicStart');
  if(slider){slider.max='100';slider.value=String(level);}
  if(output)output.textContent=Math.round(level)+' %';
  if(enabled)enabled.checked=level>0;

  let audio=document.getElementById('orasStarLocalMusic');
  if(!audio){
    audio=document.createElement('audio');
    audio.id='orasStarLocalMusic';
    audio.src=`${BASE}/elegia-breve/ana-klaudya.m4a`;
    audio.preload='auto';audio.loop=true;audio.playsInline=true;audio.style.display='none';
    document.body.appendChild(audio);
  }
  const sync=()=>{
    const pct=slider?Math.max(0,Math.min(100,Number(slider.value)||0)):level;
    audio.volume=pct/100;audio.muted=enabled?!enabled.checked:pct===0;
    if(output)output.textContent=Math.round(pct)+' %';
    try{localStorage.setItem(MASTER_VOLUME,String(Math.round(pct)))}catch(_){ }
  };
  const play=()=>{sync();audio.muted=false;if(enabled)enabled.checked=true;audio.play().then(()=>{if(start)start.hidden=true;}).catch(()=>{if(start){start.hidden=false;start.textContent='Activar música';}});};
  slider?.addEventListener('input',sync);
  enabled?.addEventListener('change',()=>{sync();if(enabled.checked)play();else audio.pause();});
  start?.addEventListener('click',play);
  sync();
  audio.play().then(()=>{if(start)start.hidden=true;}).catch(()=>{if(start){start.hidden=false;start.textContent='Activar música';}});
  document.addEventListener('pointerdown',()=>{if(enabled?.checked&&audio.paused)play();},{once:true,capture:true});

  let cont=document.getElementById('orasStarContinue');
  if(!cont){
    cont=document.createElement('a');cont.id='orasStarContinue';cont.href=`${ANA_DOC}&afterPrologue=1`;cont.textContent='Continuar · Ana Klaudya →';
    cont.addEventListener('click',()=>{try{sessionStorage.setItem(MUSIC_STATE,JSON.stringify({time:audio.currentTime||0,volume:audio.volume,playing:!audio.paused&&!audio.muted}));}catch(_){ }});
    document.body.appendChild(cont);
  }
  const final=[...document.querySelectorAll('.phrase')].at(-1);
  const reveal=()=>{
    if(!final||(!final.classList.contains('hidden-phrase')&&final.getAttribute('aria-hidden')!=='true')){cont.classList.add('is-ready');markRead();return true;}
    return false;
  };
  if(!reveal()&&final)new MutationObserver((_,obs)=>{if(reveal())obs.disconnect();}).observe(final,{attributes:true,attributeFilter:['class','aria-hidden']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
addEventListener('pageshow',install);
// isolation trigger r1.2
})();