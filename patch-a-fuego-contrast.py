from pathlib import Path

p = Path('elegia-breve/index.html')
s = p.read_text(encoding='utf-8')

style = '''<style id="oras-a-fuego-contrast">
#anaEpilogue,
#readEpilogue{
  color:#fffaf1!important;
  text-shadow:0 1px 3px rgba(0,0,0,.88),0 0 1px rgba(0,0,0,.72)!important;
}
</style>'''

if 'id="oras-a-fuego-contrast"' not in s:
    s = s.replace('</head>', style + '\n</head>', 1)

p.write_text(s, encoding='utf-8')
