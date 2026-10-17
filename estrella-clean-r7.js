(()=>{
'use strict';
if(window.__orasStarCleanR7)return;
window.__orasStarCleanR7=true;
window.__orasStarInlineInstalled=true;
window.__orasStarR6=true;

const UI_SELECTOR=[
  '.controls',
  '.music-controls',
  '#orasStarInlineNav',
  '#orasStarRuntimeNavR6',
  '#musicStart',
  '#musicStop',
  '#musicToggle',
  '#musicEnabled',
  '#musicVolume',
  '#volume',
  '#status'
].join(',');

function kill(el){
  if(!el)return;
  try{el.hidden=true;}catch(_){ }
  try{
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('pointer-events','none','important');
  }catch(_){ }
}

function silence(audio){
  if(!audio)return;
  try{audio.pause();}catch(_){ }
  try{audio.currentTime=0;}catch(_){ }
  try{audio.muted=true;audio.volume=0;}catch(_){ }
  try{audio.removeAttribute('autoplay');audio.removeAttribute('loop');audio.removeAttribute('src');}catch(_){ }
  try{while(audio.firstChild)audio.removeChild(audio.firstChild);audio.load();}catch(_){ }
}

function installLastStyle(){
  let style=document.getElementById('orasStarAbsoluteCleanR7');
  if(style)style.remove();
  style=document.createElement('style');
  style.id='orasStarAbsoluteCleanR7';
  style.textContent=`
html body .controls,
html body .music-controls,
html body #orasStarInlineNav,
html body #orasStarRuntimeNavR6,
html body #musicStart,
html body #musicStop,
html body #musicToggle,
html body #musicEnabled,
html body #musicVolume,
html body #volume,
html body #status{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}
html body main{padding-bottom:80px!important}
@media(max-width:760px){html body main{padding-bottom:40px!important}}
`;
  (document.body||document.documentElement).appendChild(style);
}

function clean(){
  document.querySelectorAll(UI_SELECTOR).forEach(kill);
  document.querySelectorAll('audio').forEach(silence);
  document.body?.classList.add('oras-star-clean-r7');
}

function hardClean(){
  clean();
  installLastStyle();
  clean();
}

hardClean();
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',hardClean,{once:true});
}else{
  hardClean();
}
addEventListener('load',hardClean,{once:true});
addEventListener('pageshow',hardClean);

// La página histórica añade controles después de este script. Se eliminan también
// esas inserciones para que la escena quede canónicamente sin interfaz ni audio.
const observer=new MutationObserver(()=>{
  clean();
  if(document.body && document.getElementById('orasStarAbsoluteCleanR7')?.parentNode!==document.body){
    installLastStyle();
  }
});
observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','hidden','class']});

[0,50,150,300,600,1200,2500].forEach(ms=>setTimeout(hardClean,ms));
})();
