#!/usr/bin/env python3
"""EL ESPEJO: cierre desnudo.

Tras la escena 32 y el último Seguir:
  fundido -> negro (sin controles) -> «flag» -> disolución -> negro -> regreso
  automático a ANA KLAUDYA, con el ciclo de lecturas reiniciado.
Se eliminan Atrás, Adelante, Reinicio, Salir, la tarjeta y el «?» del final.
Se elimina también el contador «Lecturas» durante el cierre.
"""
import re, sys, pathlib

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
js_path = root / 'ceniciento' / 'el-espejo.js'
ck_path = root / 'ceniciento' / 'check-mirror.cjs'
s = js_path.read_text(encoding='utf-8')

def once(old, new, label):
    global s
    assert s.count(old) == 1, f'{label}: se esperaba 1 coincidencia, hay {s.count(old)}'
    s = s.replace(old, new)

# 1. Fuera la botonera, la tarjeta y el «?» (bloque entero, de «back» a finale.append).
a = s.index("const back=document.createElement('button');")
b_marker = "finale.append(flag,finaleNav,card,question);"
b = s.index(b_marker) + len(b_marker)
s = s[:a] + "finale.append(flag);" + s[b:]

# 2. Cronología del cierre.
old_timers = re.search(r"  // flag permanece solo varios segundos;.*?show-question'\),6200\)\);\n", s, re.S)
assert old_timers, 'timers del cierre no encontrados'
new_timers = """  // Cierre desnudo: negro -> flag -> disolución -> negro -> regreso. Sin interfaz.
  finaleTimers.push(setTimeout(()=>finale.classList.add('show-flag'),FINALE_BLACK_MS));
  finaleTimers.push(setTimeout(()=>finale.classList.add('flag-dissolve'),FINALE_BLACK_MS+FINALE_FLAG_MS));
  finaleTimers.push(setTimeout(returnToUniverse,FINALE_BLACK_MS+FINALE_FLAG_MS+FINALE_DISSOLVE_MS+FINALE_TAIL_MS));
"""
s = s[:old_timers.start()] + new_timers + s[old_timers.end():]
once("  finale.classList.remove('show-options','show-card','show-question');\n  requestAnimationFrame",
     "  finale.classList.remove('show-flag','flag-dissolve');\n  requestAnimationFrame", 'enterFinale reset')

# 3. Constantes, regreso y fundido de la escena 32 (antes de enterFinale).
once("let finaleTimers=[];",
"""const FINALE_BLACK_MS=5000, FINALE_FLAG_MS=4500, FINALE_DISSOLVE_MS=3000, FINALE_TAIL_MS=2000, SCENE_FADE_MS=1800;
function returnToUniverse(){
  clearFinaleTimers();
  // El módulo compartido escucha este evento y reinicia el ciclo completo de lecturas.
  window.dispatchEvent(new CustomEvent('oras:mirror-end'));
  const url=ROOT+'elegia-breve/';
  try{window.top.location.href=url;}catch(_){location.href=url;}
}
function fadeToFinale(){
  mirror.style.transition='opacity '+SCENE_FADE_MS+'ms ease';
  mirror.style.opacity='0';
  finaleTimers.push(setTimeout(enterFinale,SCENE_FADE_MS+100));
}
let finaleTimers=[];""", 'constantes')
once("  finalFollow.hidden=true;\n  locked=false;lockedScene=null;\n  document.body.classList.remove('mirror-final-wait-locked');\n  enterFinale();",
     "  finalFollow.hidden=true;\n  locked=false;lockedScene=null;\n  document.body.classList.remove('mirror-final-wait-locked');\n  fadeToFinale();", 'click final')
once("mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;",
     "mirror.style.transition='';mirror.style.opacity='';mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;", 'start')
s = s.replace("finale.classList.remove('is-active','show-options','show-card','show-question')",
              "finale.classList.remove('is-active','show-flag','flag-dissolve')")

# 4. CSS: flag diminuta, sin animación al aparecer; fuera estilos de botonera/tarjeta/«?».
lines = s.split('\n'); out = []
for ln in lines:
    if re.match(r"^body \.mirror-finale-(nav|card|question)", ln) or \
       re.match(r"^body \.mirror-flag-finale\.show-(options|card|question)", ln) or \
       ln.startswith("@media(max-width:700px){body .mirror-finale-nav"):
        continue
    out.append(ln)
s = '\n'.join(out)
once("body .mirror-flag-finale.is-active .mirror-flag-word{opacity:1;transform:scale(1)}",
"""body .mirror-flag-finale.show-flag .mirror-flag-word{opacity:1;transform:none;transition:none}
body .mirror-flag-finale.show-flag.flag-dissolve .mirror-flag-word{opacity:0;transition:opacity 3s ease}
html:root body.mirror-finale-active .ou-reading-checklist,
html:root body.mirror-finale-active .ou-card,
html:root body.mirror-finale-active .ou-ceniciento-endnav,
html:root body.mirror-finale-active .ou-solo-endnav{display:none!important;visibility:hidden!important;pointer-events:none!important}""",
     'css flag')
once("font:italic 400 clamp(1.15rem,2.5vw,1.6rem)/1 Georgia", "font:italic 400 clamp(.82rem,1.6vw,1rem)/1 Georgia", 'tamaño flag')
once("opacity:0;transform:scale(.985);transition:opacity 1.8s ease,transform 1.8s ease}", "opacity:0;transform:none}", 'flag base')

js_path.write_text(s, encoding='utf-8')

# 5. check-mirror.cjs: sustituir las aserciones del cierre antiguo.
if ck_path.exists():
    c = ck_path.read_text(encoding='utf-8').split('\n')
    c = [l for l in c if "restart.textContent='Reinicio'" not in l and "show-options'),4200" not in l]
    ck_path.write_text('\n'.join(c), encoding='utf-8')
print('OK: cierre desnudo aplicado')
