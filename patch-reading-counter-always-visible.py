from pathlib import Path

# El contador de lecturas debe permanecer visible en todo momento y en todas
# las superficies del recorrido, incluidas Flores, EL ESPEJO y la pantalla flag.

p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')

# El contador existe incluso antes de que se haya iniciado formalmente el recorrido.
s = s.replace("  box.hidden=!current.journeyStartedAt;", "  box.hidden=false;")

# EL ESPEJO no debe ocultar el contador del documento superior.
s = s.replace(
    "  body.mirror .ou-reading-checklist{display:none}",
    "  body.mirror .ou-reading-checklist{display:block!important}",
)
s = s.replace(
    "  body.mirror>:not(#mirror):not(script):not(style){display:none!important}",
    "  body.mirror>:not(#mirror):not(.ou-reading-checklist):not(script):not(style){display:none!important}",
)

# La puerta Flores -> EL ESPEJO tampoco debe borrar el contador.
s = s.replace(
    "body.ou-ana-third-mirror-gate > *:not(#cenicientoFrame):not(.ou-ana-third-follow):not(script):not(style){display:none!important}",
    "body.ou-ana-third-mirror-gate > *:not(#cenicientoFrame):not(.ou-ana-third-follow):not(.ou-reading-checklist):not(script):not(style){display:none!important}",
)

# Regla visual canónica: siempre fijo, siempre visible, por encima de marcos,
# transiciones y pantallas finales; mantiene la posición izquierda ya fijada.
marker = "  @media(hover:none) and (pointer:coarse){"
always = """  /* ORAS: contador de lecturas siempre visible */
  html body .ou-reading-checklist,
  html body.read .ou-reading-checklist,
  html body.mirror .ou-reading-checklist,
  html body.ou-ana-third-mirror-gate .ou-reading-checklist,
  html body.mirror-finale-active .ou-reading-checklist{
    display:block!important;
    visibility:visible!important;
    opacity:1!important;
    position:fixed!important;
    z-index:2147483646!important;
    left:max(10px,env(safe-area-inset-left))!important;
    right:auto!important;
    bottom:calc(18px + env(safe-area-inset-bottom,0px))!important;
    width:max-content!important;
    max-width:calc(100% - 20px)!important;
    margin:0!important;
    pointer-events:auto!important;
  }
  html body .ou-reading-checklist[hidden]{display:block!important}
  html body .ou-reading-checklist summary{margin-left:0!important}
  html body .ou-reading-checklist ul{left:0!important;right:auto!important}
"""
if always not in s:
    if marker not in s:
        raise RuntimeError('No se encontró el anclaje CSS para el contador')
    s = s.replace(marker, always + marker, 1)

p.write_text(s, encoding='utf-8')

# La pantalla final flag de EL ESPEJO ocultaba todos sus hermanos. Excluir el
# contador para que siga visible también en esa pantalla.
p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')
s = s.replace(
    "body.mirror-finale-active>:not(.mirror-flag-finale):not(script):not(style){visibility:hidden!important;pointer-events:none!important}",
    "body.mirror-finale-active>:not(.mirror-flag-finale):not(.ou-reading-checklist):not(script):not(style){visibility:hidden!important;pointer-events:none!important}",
)
p.write_text(s, encoding='utf-8')

print('PASS: contador de lecturas siempre visible en todas las pantallas')
