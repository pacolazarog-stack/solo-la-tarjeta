(()=>{
'use strict';
if(window.__orasStarStandaloneGuardR1)return;
window.__orasStarStandaloneGuardR1=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const MASTER_VOLUME_STORE='oras.master.volume.v1';

const style=document.createElement('style');
style.id='oras-star-standalone-guard-r1';
style.textContent=`
html,body{visibility:visible!important;opacity:1!important}
body{display:block!important}
main,.intro,.controls,.status,.music-controls{visibility:visible!important;opacity:1!important}
.detail-background,.celestial-scene{visibility:visible!important;opacity:1!important}
main{pointer-events:auto!important}
`;
document.head.appendChild(style);

function masterVolume(){
  try{
    const raw=Number(localStorage.getItem(MASTER_VOLUME_STORE));
    return Number.isFinite(raw)&&raw>=0?Math.max(0,Math.min(100,raw)):80;
  }catch(_){return 80;}
}

function syncMasterVolume(){
  const level=masterVolume();
  const slider=document.getElementById('musicLevel');
  const output=document.getElementById('musicValue');
  const enabled=document.getElementById('musicEnabled');
  if(slider){
    const min=Number(slider.min||0),max=Number(slider.max||100);
    slider.value=String(Math.max(min,Math.min(max,level)));
    slider.dispatchEvent(new Event('input',{bubbles:true}));
    slider.dispatchEvent(new Event('change',{bubbles:true}));
  }
  if(output)output.textContent=Math.round(level)+' %';
  if(enabled){
    enabled.checked=level>0;
    enabled.dispatchEvent(new Event('change',{bubbles:true}));
  }
  const local=document.getElementById('orasStarLocalMusic');
  if(local){
    local.volume=Math.max(0,Math.min(1,level/100));
    local.muted=level===0;
    if(level>0&&local.paused)local.play().catch(()=>{});
  }
  try{window.ORASVolume?.set?.(level);}catch(_){ }
}

function release(){
  document.documentElement.classList.remove('publication-pending');
  document.documentElement.style.setProperty('visibility','visible','important');
  document.documentElement.style.setProperty('opacity','1','important');
  if(!document.body)return;
  document.body.style.setProperty('visibility','visible','important');
  document.body.style.setProperty('opacity','1','important');
  document.body.removeAttribute('aria-hidden');
  for(const selector of ['main','.intro','.controls','.status','.music-controls']){
    const el=document.querySelector(selector);
    if(!el)continue;
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
  }
  syncMasterVolume();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',release,{once:true});
else release();
addEventListener('pageshow',release);
setTimeout(release,120);
setTimeout(release,900);
setTimeout(syncMasterVolume,1600);
})();
