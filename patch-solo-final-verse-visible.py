from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# El control actual CENICIENTO -> SOLO ya incorpora visibilidad, centrado y
# bloqueo de la frase final. Este parche se mantiene como verificación
# idempotente para no romper despliegues cuando cambie la implementación.
if '#duskFinalPhrase' not in s or 'ou-solo-final-locked' not in s:
    raise RuntimeError('No se encontró la pausa final obligatoria de SOLO LA TARJETA')

# Si la implementación vigente ya fuerza la frase final a visible y centrada,
# no hay nada adicional que parchear.
if "place-items:center" in s and "#duskFinalPhrase" in s:
    p.write_text(s, encoding='utf-8')
    raise SystemExit(0)

# Compatibilidad con una variante anterior: reforzar visibilidad sin exigir
# coincidencias textuales frágiles.
marker = "body.ou-solo-final-locked #duskFinalPhrase{"
if marker in s and 'opacity:1!important' not in s[s.index(marker):s.index(marker)+320]:
    s = s.replace(marker, marker + 'opacity:1!important;visibility:visible!important;filter:none!important;', 1)

p.write_text(s, encoding='utf-8')
