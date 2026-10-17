(()=>{
'use strict';
if(window.__orasStarCleanNoControls)return;
window.__orasStarCleanNoControls=true;

/* Siguiendo una tarjeta: escena limpia, sin música ni botones. */
window.__orasStarInlineInstalled=true;
window.__orasStarR6=true;

const hide=el=>{
  if(!el)return;
  el.hidden=true;
  el.style.setProperty('display','none','important');
  el.style.setProperty('visibility','hidden','important');
  el.style.setProperty('opacity','0','important');
  el.style.setProperty('pointer-events','none','important');
};

function clean(){
  document.querySelectorAll('.controls,.music-controls,#orasStarInlineNav,#orasStarRuntimeNavR6').forEach(hide);
  const status=document.getElementById('status');
  if(status)hide(status);
  document.querySelectorAll('audio').forEach(audio=>{
    try{audio.pause();audio.currentTime=0;}catch(_){ }
    try{audio.removeAttribute('autoplay');audio.removeAttribute('src');audio.load();}catch(_){ }
  });
}

const style=document.createElement('style');
style.id='orasStarCleanNoControlsStyle';
style.textContent=`
.controls,.music-controls,#orasStarInlineNav,#orasStarRuntimeNavR6,#status{
  display:none!important;
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
main{padding-bottom:80px!important}
@media(max-width:760px){main{padding-bottom:40px!important}}
`;
document.head.appendChild(style);

clean();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
addEventListener('pageshow',clean);
setTimeout(clean,0);
setTimeout(clean,250);
setTimeout(clean,1000);
})();