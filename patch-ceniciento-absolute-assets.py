from pathlib import Path

p=Path('ceniciento/index.html')
s=p.read_text(encoding='utf-8')

marker='oras-ceniciento-absolute-assets-v1'
if marker in s:
    print('PASS: rutas absolutas de CENICIENTO ya presentes')
    raise SystemExit(0)

replacements={
    "const EXPECTED=864.156735,MASTER='ceniciento-voz-completa.mp3?v=20261010-audio-restored';":
    "const EXPECTED=864.156735,MASTER='/solo-la-tarjeta/ceniciento/ceniciento-voz-completa.mp3?v=20261010-audio-restored'; // oras-ceniciento-absolute-assets-v1",
    "const u='frames-stable/'+String(i+1).padStart(2,'0')+'.webp?v=20261010-stable-sequence';":
    "const u='/solo-la-tarjeta/ceniciento/frames-stable/'+String(i+1).padStart(2,'0')+'.webp?v=20261010-stable-sequence';",
    "fetch('texto.md?v=16',{cache:'no-store'})":
    "fetch('/solo-la-tarjeta/ceniciento/texto.md?v=16',{cache:'no-store'})",
    "music.src='../elegia-breve/ana-klaudya.m4a'":
    "music.src='/solo-la-tarjeta/elegia-breve/ana-klaudya.m4a'",
    "src=\"el-espejo.js?v=20261010-29\"":
    "src=\"/solo-la-tarjeta/ceniciento/el-espejo.js?v=20261010-29\"",
    "src=\"../narrative-universe.js?v=20261010-29\"":
    "src=\"/solo-la-tarjeta/narrative-universe.js?v=20261010-29\"",
}

for old,new in replacements.items():
    if old not in s:
        raise RuntimeError('Falta anclaje de CENICIENTO: '+old)
    s=s.replace(old,new,1)

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
