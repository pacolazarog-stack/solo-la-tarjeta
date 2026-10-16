(()=>{
'use strict';
if(window.__orasStarStandaloneGuardR2)return;
window.__orasStarStandaloneGuardR2=true;

const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const MASTER_VOLUME_STORE='oras.master.volume.v1';

const style=document.createElement('style');
style.id='oras-star-standalone-guard-r2';
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
    const stored=localStorage.getItem(MASTER_VOLUME_STORE);
    if(stored===null||stored==='')return 80;
    const raw=Number(stored);
    return Number.isFinite(raw)?Math.max(0,Math.min(100,raw)):80;
  }catch(_){return 80;}
}

function syncVolumePassive(){
  const level=masterVolume();
  const slider=document.getElementById('musicLevel');
  const output=document.getElementById('musicValue');
  const enabled=document.getElementById('musicEnabled');
  let effective=level;
  if(slider){
    const min=Number(slider.min||0),max=Number(slider.max||100);
    effective=Math.max(min,Math.min(max,level));
    slider.value=String(effective);
  }
  if(output)output.textContent=Math.round(effective)+' %';
  if(enabled)enabled.checked=effective>0;
  const local=document.getElementById('orasStarLocalMusic');
  if(local){
    local.volume=Math.max(0,Math.min(1,effective/100));
    local.muted=effective===0;
  }
}

function release(){
  document.documentElement.classList.remove('publication-pending');
  document.documentElement.style.setProperty('visibility','visible','important');
  document.documentElement.style.setProperty('opacity','1','important');
  if(!document.body)return;
  document.body.style.setProperty('visibility','visible','important');
  document.body.style.setProperty('opacity','1','important');
  document.body.style.setProperty('display','block','important');
  document.body.removeAttribute('aria-hidden');
  for(const selector of ['main','.intro','.controls','.status','.music-controls','.detail-background','.celestial-scene']){
    const el=document.querySelector(selector);
    if(!el)continue;
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
  }
  syncVolumePassive();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',release,{once:true});
else release();
addEventListener('pageshow',release);
setTimeout(release,100);
setTimeout(release,700);
setTimeout(syncVolumePassive,1400);
})();
