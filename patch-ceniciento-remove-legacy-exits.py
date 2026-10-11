from pathlib import Path

p=Path('ceniciento/index.html')
s=p.read_text(encoding='utf-8')

marker='oras-ceniciento-purge-native-exits'
script=r'''<script id="oras-ceniciento-purge-native-exits">
(()=>{
  const purge=()=>{
    const nodes=[...document.querySelectorAll('a,button')];
    for(const node of nodes){
      if(node.closest('.ou-ceniciento-endnav')) continue;
      const text=(node.textContent||'').trim().replace(/\s+/g,' ').toUpperCase();
      if(text==='ANA KLAUDYA'||text==='SOLO LA TARJETA') node.remove();
    }
  };
  const start=()=>{
    purge();
    const mo=new MutationObserver(purge);
    mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
</script>'''

if marker not in s:
    if '</body>' not in s:
        raise RuntimeError('No se encontró </body> en ceniciento/index.html')
    s=s.replace('</body>',script+'\n</body>',1)

p.write_text(s,encoding='utf-8')
