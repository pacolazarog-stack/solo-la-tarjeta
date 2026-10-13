(()=>{
'use strict';
const STORAGE='oras.atlas.mirror.v1';

function renderVariant(scene,echo){
  if(!scene)return false;
  const copy=scene.querySelector('.mirror-copy');
  if(!copy)return false;
  const key=(echo.sourceEcho||echo.sourceSpin||'atlas').replace(/[^a-z0-9_-]/gi,'-');
  if(scene.querySelector(`[data-atlas-variant="${key}"]`))return true;

  const variant=document.createElement('div');
  variant.className='atlas-mirror-variant';
  variant.dataset.atlasVariant=key;

  echo.text.split(/\n\n+/).forEach(block=>{
    const p=document.createElement('p');
    block.split('\n').forEach((line,i)=>{
      if(i)p.append(document.createElement('br'));
      p.append(document.createTextNode(line));
    });
    variant.appendChild(p);
  });

  copy.appendChild(variant);
  scene.dataset.atlasEcho='true';
  return true;
}

function apply(){
  let echo=null;
  try{echo=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch(_){}
  if(!echo?.active||!Number.isInteger(echo.sceneIndex)||typeof echo.text!=='string')return false;
  const scene=document.querySelectorAll('#mirror .mirror-scene')[echo.sceneIndex];
  return renderVariant(scene,echo);
}

if(!apply()){
  const mo=new MutationObserver(()=>{if(apply())mo.disconnect();});
  mo.observe(document.documentElement,{subtree:true,childList:true});
}
})();
