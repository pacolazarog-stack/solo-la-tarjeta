from pathlib import Path

STYLE = '''
<style id="oras-read-pause-contrast">
button[data-oras-read-pause],
.oras-read-pause,
.read-pause-button,
.pause-read-button{
  color:#fff!important;
  fill:#fff!important;
  stroke:#fff!important;
  text-shadow:0 1px 2px rgba(0,0,0,.45)!important;
}
button[data-oras-read-pause] *,
.oras-read-pause *,
.read-pause-button *,
.pause-read-button *{
  color:#fff!important;
  fill:#fff!important;
  stroke:#fff!important;
}
</style>
<script id="oras-read-pause-marker">
(()=>{
  const normalize=s=>(s||'').trim().toLowerCase().replace(/\s+/g,' ');
  const mark=()=>{
    document.querySelectorAll('button,[role="button"]').forEach(el=>{
      const text=normalize(el.textContent);
      const aria=normalize(el.getAttribute('aria-label'));
      const title=normalize(el.getAttribute('title'));
      if(text.includes('leer con pausa')||aria.includes('leer con pausa')||title.includes('leer con pausa')){
        el.setAttribute('data-oras-read-pause','true');
      }
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});else mark();
  new MutationObserver(mark).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
})();
</script>
'''

for p in Path('.').rglob('*.html'):
    s=p.read_text(encoding='utf-8')
    if 'oras-read-pause-contrast' in s:
        continue
    anchor='</head>'
    if anchor in s:
        s=s.replace(anchor,STYLE+'\n'+anchor,1)
        p.write_text(s,encoding='utf-8')

print('PASS: botones Leer con pausa marcados y forzados a texto blanco')
