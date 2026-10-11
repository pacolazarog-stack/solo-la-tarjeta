from pathlib import Path

# 1) Hold EL ESPEJO on its final flag before announcing the end.
p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')
old = """new IntersectionObserver(entries=>{\n  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;\n  finished=true;window.dispatchEvent(new CustomEvent('oras:mirror-end'));\n},{root:mirror,threshold:.5}).observe(endSentinel);"""
new = """new IntersectionObserver(entries=>{\n  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;\n  finished=true;\n  // Dejar respirar el cierre: el único 'flag' de EL ESPEJO debe verse antes del retorno.\n  setTimeout(()=>window.dispatchEvent(new CustomEvent('oras:mirror-end')),4200);\n},{root:mirror,threshold:.5}).observe(endSentinel);"""
if old not in s:
    raise RuntimeError('No se encontró el observador final de EL ESPEJO')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# 2) Return from EL ESPEJO through the flower/interlude route of ANA KLAUDYA.
p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')
old = """window.addEventListener('oras:mirror-end',()=>{\n  resetReadingCycle();\n  if(page.ana){topGo(rootPath+'elegia-breve/?v='+VERSION);return;}\n  if(window.parent!==window){window.parent.postMessage({channel:'oras-universe-v2',type:'mirror-return'},location.origin);return;}\n  topGo(rootPath+'elegia-breve/?v='+VERSION);\n});"""
new = """window.addEventListener('oras:mirror-end',()=>{\n  resetReadingCycle();\n  const flowers=rootPath+'elegia-breve/?v='+VERSION+'#interludio';\n  if(page.ana){topGo(flowers);return;}\n  if(window.parent!==window){\n    window.parent.postMessage({channel:'oras-universe-v2',type:'mirror-return',target:'interludio'},location.origin);\n    // Salvaguarda: si el padre antiguo no reconoce target, forzar la ruta de flores.\n    setTimeout(()=>topGo(flowers),180);\n    return;\n  }\n  topGo(flowers);\n});"""
if old not in s:
    raise RuntimeError('No se encontró el cierre del universo para EL ESPEJO')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
