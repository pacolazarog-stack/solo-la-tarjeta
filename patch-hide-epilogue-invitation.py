from pathlib import Path

p = Path('elegia-breve/index.html')
s = p.read_text(encoding='utf-8')

marker = '.epilogue-invitation[hidden]{display:none}'
replacement = '.epilogue-invitation{display:none!important}\n    .epilogue-invitation[hidden]{display:none}'

if replacement not in s:
    if marker not in s:
        raise RuntimeError('No se encontró el estilo de la invitación flotante al epílogo')
    s = s.replace(marker, replacement, 1)

p.write_text(s, encoding='utf-8')
print('PASS: floating A fuego lento invitation hidden; index entry preserved')
