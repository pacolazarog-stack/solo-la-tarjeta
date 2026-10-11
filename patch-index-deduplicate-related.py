from pathlib import Path

p=Path('elegia-breve/index.html')
s=p.read_text(encoding='utf-8')

marker='oras-index-deduplicate-related'
script=r'''<script id="oras-index-deduplicate-related">
(()=>{
  const keepIds=new Set(['anaSoloWork','anaCenicientoWork']);
  const purge=()=>{
    const nav=document.getElementById('anaNavigation');
    if(!nav)return;

    // El módulo base puede volver a crear estos accesos antiguos.
    nav.querySelectorAll('[data-ou-crosspiece]').forEach(node=>node.remove());

    // Respaldo: conservar únicamente los dos botones ilustrados canónicos.
    for(const node of [...nav.querySelectorAll('button,a')]){
      if(keepIds.has(node.id))continue;
      const text=(node.textContent||'').trim().replace(/\s+/g,' ').toUpperCase();
      if(text==='SOLO LA TARJETA'||text==='CENICIENTO'||text==='CENICIENTO · BLOQUEADO'){
        node.remove();
      }
    }
  };

  const start=()=>{
    purge();
    const nav=document.getElementById('anaNavigation');
    if(!nav)return;
    const mo=new MutationObserver(purge);
    mo.observe(nav,{childList:true,subtree:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
</script>'''

if marker not in s:
    if '</body>' not in s:
        raise RuntimeError('No se encontró </body> en elegia-breve/index.html')
    s=s.replace('</body>',script+'\n</body>',1)

p.write_text(s,encoding='utf-8')
