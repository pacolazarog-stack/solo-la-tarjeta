from pathlib import Path

p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')
old = "    nav.replaceChildren();"
new = "    while(nav.firstChild)nav.removeChild(nav.firstChild);"
if old not in s:
    raise RuntimeError('No se encontró replaceChildren en la navegación final de CENICIENTO')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
print('PASS: navegación final compatible con el entorno de pruebas')
