(()=>{
'use strict';
if(window.__orasStarStandaloneGuardR1)return;
window.__orasStarStandaloneGuardR1=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

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
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',release,{once:true});
else release();
addEventListener('pageshow',release);
setTimeout(release,120);
setTimeout(release,900);
// r1.1: cambio intencional para activar la inyección única del guardia.
})();
