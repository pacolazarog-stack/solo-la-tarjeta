from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

addon=r'''
;(()=>{
  const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
  if(!path.endsWith('/ceniciento'))return;

  const purgeLegacyExits=()=>{
    if(!document.querySelectorAll)return;
    const nodes=document.querySelectorAll('a,button');
    for(const node of nodes){
      if(node.closest&&node.closest('.ou-ceniciento-endnav'))continue;
      const text=(node.textContent||'').trim().replace(/\s+/g,' ').toUpperCase();
      if(text==='ANA KLAUDYA'||text==='SOLO LA TARJETA'){
        if(node.remove)node.remove();
        else if(node.parentNode)node.parentNode.removeChild(node);
      }
    }
  };

  const start=()=>{
    purgeLegacyExits();
    if('MutationObserver' in window){
      const mo=new MutationObserver(()=>purgeLegacyExits());
      mo.observe(document.documentElement,{subtree:true,childList:true});
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
'''

if 'purgeLegacyExits' not in s:
    s += addon
p.write_text(s,encoding='utf-8')
