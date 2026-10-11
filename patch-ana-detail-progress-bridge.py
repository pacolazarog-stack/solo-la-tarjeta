from pathlib import Path

# Bridge completion from the detail poem iframes back to ANA KLAUDYA.
# Tu cabello and Tu piel live in their own same-origin documents, while the
# reading counter belongs to the parent ANA page. They therefore must report
# completion explicitly.

p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')

# The listener must be injected INSIDE setupAnaPartTracking(), where page and
# completeAnaPart are in scope. Appending a second IIFE after the main universe
# closure leaves those identifiers out of scope and the message is lost.
old = """  if(page.ana)addEventListener('message',event=>{\n    if(event.origin!==location.origin)return;\n    if(event.data?.channel==='ceniciento-music-v1'&&event.data.type==='interlude-ended'){completeAnaPart('interludio');return;}\n    if(event.data?.channel==='oras-universe-v2'&&event.data.type==='ana-progress'){\n      state=readState();ensureChecklist();maybeStartMirror();\n    }\n  });\n"""
new = """  if(page.ana)addEventListener('message',event=>{\n    if(event.origin!==location.origin)return;\n    if(event.data?.channel==='ceniciento-music-v1'&&event.data.type==='interlude-ended'){completeAnaPart('interludio');return;}\n    if(event.data?.channel==='oras-universe-v2'&&event.data.type==='ana-part-complete'){\n      const part=event.data?.part;\n      if(part==='cabello'||part==='piel'){completeAnaPart(part);return;}\n    }\n    if(event.data?.channel==='oras-universe-v2'&&event.data.type==='ana-progress'){\n      state=readState();ensureChecklist();maybeStartMirror();\n    }\n  });\n"""
if old not in s:
    raise RuntimeError('No se encontró el listener de progreso de ANA')
s=s.replace(old,new,1)
p.write_text(s, encoding='utf-8')

child_script = r'''
<script data-oras-ana-detail-progress>
(()=>{
  const part=__PART__;
  const last=[...document.querySelectorAll('.line')].at(-1);
  if(!last)return;
  let sent=false;
  const report=()=>{
    if(sent)return;
    sent=true;
    try{window.parent.postMessage({channel:'oras-universe-v2',type:'ana-part-complete',part},location.origin);}catch(_){}
  };

  // Reading the final verse on screen is sufficient to count the piece.
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      const entry=entries.find(e=>e.target===last);
      if(entry?.isIntersecting && entry.intersectionRatio>=.6){io.disconnect();report();}
    },{threshold:[.6,.85,1]});
    io.observe(last);
  }else{
    const check=()=>{
      const r=last.getBoundingClientRect();
      const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
      if(r.height>0 && visible/r.height>=.6){removeEventListener('scroll',check);report();}
    };
    addEventListener('scroll',check,{passive:true});
    setTimeout(check,500);
  }

  // These explicit reading modes also report completion reliably.
  document.getElementById('full')?.addEventListener('click',()=>requestAnimationFrame(report));
  const paced=document.getElementById('paced');
  if(paced){
    new MutationObserver(()=>{
      if(paced.textContent.trim().toLowerCase()==='volver a leer')report();
    }).observe(paced,{childList:true,subtree:true,characterData:true});
  }
})();
</script>
'''

for path, part in [(Path('cabello/index.html'),'cabello'),(Path('piel/index.html'),'piel')]:
    t=path.read_text(encoding='utf-8')
    if 'data-oras-ana-detail-progress' in t:
        continue
    script=child_script.replace('__PART__', repr(part))
    if '</body>' not in t:
        raise RuntimeError(f'No se encontró </body> en {path}')
    t=t.replace('</body>',script+'\n</body>',1)
    path.write_text(t,encoding='utf-8')

print('PASS: Tu cabello and Tu piel report completion to ANA KLAUDYA inside parent scope')
