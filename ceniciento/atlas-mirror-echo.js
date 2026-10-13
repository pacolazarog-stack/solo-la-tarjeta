(()=>{
'use strict';
const STORAGE='oras.atlas.mirror.v1';
function apply(){
  let echo=null;
  try{echo=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch(_){}
  if(!echo?.active||!Number.isInteger(echo.sceneIndex)||typeof echo.text!=='string')return false;
  const scene=document.querySelectorAll('#mirror .mirror-scene')[echo.sceneIndex];
  const copy=scene?.querySelector('.mirror-copy');
  if(!copy)return false;
  copy.textContent='';
  echo.text.split(/\n\n+/).forEach(block=>{
    const p=document.createElement('p');
    block.split('\n').forEach((line,i)=>{if(i)p.append(document.createElement('br'));p.append(document.createTextNode(line));});
    copy.appendChild(p);
  });
  scene.dataset.atlasEcho='true';
  return true;
}
if(!apply()){
  const mo=new MutationObserver(()=>{if(apply())mo.disconnect();});
  mo.observe(document.documentElement,{subtree:true,childList:true});
}
})();