from pathlib import Path

p=Path('ceniciento/index.html')
s=p.read_text(encoding='utf-8')

# El cierre nativo no debe escribir «fin» en pantalla.
s=s.replace("status.textContent='fin'", "status.textContent=''", 1)

marker='oras-ceniciento-purge-native-exits'
script=r'''<script id="oras-ceniciento-purge-native-exits">
(()=>{
  const purge=()=>{
    // CENICIENTO no conserva ninguna botonera final propia: el recorrido general
    // o EL ESPEJO se encargan de la continuación narrativa.
    document.querySelectorAll('.ou-ceniciento-endnav').forEach(node=>node.remove());

    for(const node of [...document.querySelectorAll('a,button')]){
      const text=(node.textContent||'').trim().replace(/\s+/g,' ').toUpperCase();
      if(text==='ANA KLAUDYA'||text==='SOLO LA TARJETA') node.remove();
    }

    const status=document.getElementById('status');
    if(status&&/^fin$/i.test((status.textContent||'').trim())) status.textContent='';
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
