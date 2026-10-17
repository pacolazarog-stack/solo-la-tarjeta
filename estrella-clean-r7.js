(()=>{
'use strict';
if(window.__orasStarCleanR7)return;
window.__orasStarCleanR7=true;
/* Esta escena queda deliberadamente limpia: sin música y sin botones. */
window.__orasStarInlineInstalled=true;
window.__orasStarR6=true;

const hide=el=>{if(!el)return;el.hidden=true;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');};

function clean(){
  document.querySelectorAll('.controls,.music-controls,#orasStarInlineNav,#orasStarRuntimeNavR6').forEach(hide);
  document.querySelectorAll('audio').forEach(audio=>{
    try{audio.pause();audio.currentTime=0;}catch(_){ }
    try{audio.removeAttribute('autoplay');audio.removeAttribute('src');audio.load();}catch(_){ }
  });
  const status=document.getElementById('status');
  if(status) hide(status);
  document.body?.classList.add('oras-star-clean-r7');
}

const style=document.createElement('style');
style.id='orasStarCleanR7Style';
style.textContent=`
.controls,.music-controls,#orasStarInlineNav,#orasStarRuntimeNavR6{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
#status{display:none!important}
main{padding-bottom:80px!important}
@media(max-width:760px){main{padding-bottom:40px!important}}
`;
document.head.appendChild(style);

clean();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
addEventListener('pageshow',clean);
setTimeout(clean,0);
setTimeout(clean,300);
})();
