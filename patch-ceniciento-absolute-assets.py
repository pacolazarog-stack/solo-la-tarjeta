from pathlib import Path
import re

p=Path('ceniciento/index.html')
s=p.read_text(encoding='utf-8')

marker='oras-ceniciento-absolute-assets-v2'
if marker in s:
    print('PASS: rutas absolutas de CENICIENTO ya presentes')
    raise SystemExit(0)

# Los parches previos pueden cambiar versiones/cache-busters de los scripts.
# Aquí no dependemos de una cadena exacta: normalizamos por recurso.
replacements=[
    (
        r"const EXPECTED=864\.156735,MASTER='(?:/solo-la-tarjeta/ceniciento/)?ceniciento-voz-completa\.mp3\?v=[^']+';(?:\s*//\s*oras-ceniciento-absolute-assets-v1)?",
        "const EXPECTED=864.156735,MASTER='/solo-la-tarjeta/ceniciento/ceniciento-voz-completa.mp3?v=20261010-audio-restored'; // oras-ceniciento-absolute-assets-v2",
        'voz completa',
    ),
    (
        r"const u='(?:/solo-la-tarjeta/ceniciento/)?frames-stable/'\+String\(i\+1\)\.padStart\(2,'0'\)\+'\.webp\?v=[^']+';",
        "const u='/solo-la-tarjeta/ceniciento/frames-stable/'+String(i+1).padStart(2,'0')+'.webp?v=20261010-stable-sequence';",
        'fotogramas',
    ),
    (
        r"fetch\('(?:/solo-la-tarjeta/ceniciento/)?texto\.md\?v=[^']+',\{cache:'no-store'\}\)",
        "fetch('/solo-la-tarjeta/ceniciento/texto.md?v=16',{cache:'no-store'})",
        'texto',
    ),
    (
        r"music\.src='(?:\.\./elegia-breve/|/solo-la-tarjeta/elegia-breve/)ana-klaudya\.m4a(?:\?[^']*)?'",
        "music.src='/solo-la-tarjeta/elegia-breve/ana-klaudya.m4a'",
        'música',
    ),
    (
        r'src="(?:/solo-la-tarjeta/ceniciento/)?el-espejo\.js\?v=[^"]+"',
        'src="/solo-la-tarjeta/ceniciento/el-espejo.js?v=20261010-29"',
        'EL ESPEJO',
    ),
    (
        r'src="(?:\.\./|/solo-la-tarjeta/)?narrative-universe\.js\?v=[^"]+"',
        'src="/solo-la-tarjeta/narrative-universe.js?v=20261010-29"',
        'universo narrativo',
    ),
]

for pattern,new,label in replacements:
    s2,n=re.subn(pattern,new,s,count=1)
    if n != 1:
        # Si el recurso ya quedó absoluto con otra versión, se acepta y normaliza.
        if label == 'EL ESPEJO' and '/solo-la-tarjeta/ceniciento/el-espejo.js' in s:
            continue
        if label == 'universo narrativo' and '/solo-la-tarjeta/narrative-universe.js' in s:
            continue
        raise RuntimeError('Falta anclaje de CENICIENTO para '+label)
    s=s2

p.write_text(s,encoding='utf-8')

check=p.read_text(encoding='utf-8')
required=[
    marker,
    "/solo-la-tarjeta/ceniciento/ceniciento-voz-completa.mp3",
    "/solo-la-tarjeta/ceniciento/frames-stable/",
    "/solo-la-tarjeta/ceniciento/texto.md?v=16",
    "/solo-la-tarjeta/elegia-breve/ana-klaudya.m4a",
    "/solo-la-tarjeta/ceniciento/el-espejo.js",
    "/solo-la-tarjeta/narrative-universe.js",
]
for token in required:
    if token not in check:
        raise RuntimeError('Falta ruta absoluta publicada: '+token)

print('PASS: CENICIENTO carga texto, voz, fotogramas, música y scripts desde rutas absolutas bajo cualquier hash contenedor')
