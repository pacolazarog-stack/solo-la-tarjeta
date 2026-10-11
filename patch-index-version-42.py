from pathlib import Path

# Se mantiene el nombre histórico del parche para no alterar el workflow,
# pero la versión pública sube para invalidar cachés que aún cargaban el
# contador anterior sin el desglose interno de ANA KLAUDYA.
CURRENT='20261012-43'

module=Path('narrative-universe.js')
s=module.read_text(encoding='utf-8')
for old in ('20261011-41','20261011-42'):
    s=s.replace(f"const VERSION='{old}';", f"const VERSION='{CURRENT}';")
module.write_text(s,encoding='utf-8')

# Renovar la URL del módulo compartido en todas las superficies para que el
# navegador no reutilice una copia antigua que sólo mostraba 0/3.
for page in Path('.').rglob('*.html'):
    if '.git' in page.parts:
        continue
    t=page.read_text(encoding='utf-8')
    for old in ('20261011-37','20261011-39','20261011-40','20261011-41','20261011-42'):
        t=t.replace(f'narrative-universe.js?v={old}',f'narrative-universe.js?v={CURRENT}')
    page.write_text(t,encoding='utf-8')

ana=Path('elegia-breve/index.html')
t=ana.read_text(encoding='utf-8')

# Todos los enlaces internos del índice relacionado apuntan también a la
# versión vigente.
for old in ('20261011-39','20261011-40','20261011-41','20261011-42'):
    t=t.replace(f'v={old}',f'v={CURRENT}')

# Una URL antigua del índice se autocorrige inmediatamente.
guard=f'''<script id="oras-index-version-guard">
(()=>{{
  const CURRENT='{CURRENT}';
  const u=new URL(location.href);
  if(u.searchParams.get('indice')==='1' && u.searchParams.get('v')!==CURRENT){{
    u.searchParams.set('v',CURRENT);
    location.replace(u.toString());
  }}
}})();
</script>'''
if 'id="oras-index-version-guard"' in t:
    import re
    t=re.sub(r'<script id="oras-index-version-guard">.*?</script>',guard,t,count=1,flags=re.S)
elif '</head>' in t:
    t=t.replace('</head>',guard+'\n</head>',1)

required=(
    'const soloArt=`',
    'rect x="0" y="0" width="70" height="48"',
    'const cenArt=`',
    'id="ashHair"',
    'cenicientoQuestionUnlocked',
)
missing=[item for item in required if item not in t]
if missing:
    raise RuntimeError('Faltan elementos del índice relacionado: '+', '.join(missing))

ana.write_text(t,encoding='utf-8')
print('PASS: versión 20261012-43 fuerza recarga del contador compuesto de ANA KLAUDYA')