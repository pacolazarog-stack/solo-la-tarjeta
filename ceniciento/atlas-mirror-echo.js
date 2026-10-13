(()=>{
'use strict';
const STORAGE='oras.atlas.mirror.v1';

function ensureStyle(){
  if(document.getElementById('atlas-mirror-variant-style'))return;
  const style=document.createElement('style');
  style.id='atlas-mirror-variant-style';
  style.textContent=`#mirror .atlas-mirror-variant{margin-top:1rem;padding-top:.9rem;border-top:1px solid rgba(244,239,229,.14);opacity:.82}#mirror .atlas-mirror-variant::before{content:"versión persistente";display:block;margin-bottom:.5rem;font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;opacity:.45}#mirror .atlas-mirror-variant p{margin:.2rem 0;white-space:pre-line}`;
  document.head.appendChild(style);
}

function renderVariant(scene,echo){
  if(!scene)return false;
  const copy=scene.querySelector('.mirror-copy');
  if(!copy)return false;
  const key=(echo.sourceEcho||echo.sourceSpin||'atlas').replace(/[^a-z0-9_-]/gi,'-');
  if(scene.querySelector(`[data-atlas-variant="${key}"]`))return true;

  ensureStyle();
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
