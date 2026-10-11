#!/usr/bin/env python3
"""Blindaje de la respiración sonora de SOLO LA TARJETA.

Verifica la firma y los anclajes reales del index canónico y elimina la
competencia entre el fundido HTML ya existente y el motor Web Audio añadido.
"""
from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else "index.html")
s = path.read_text(encoding="utf-8")

# Contrato real del index: si cambia, fallar en construcción en vez de publicar
# un parche basado en una firma supuesta.
required = {
    'fadeSoundTo(target,duration=900,done)': "const fadeSoundTo=(target,duration=900,done)=>",
    '#duskPreFinal': 'id="duskPreFinal"',
    '#duskFinalPhrase': 'id="duskFinalPhrase"',
    '#entryGate': 'id="entryGate"',
    '#enterButton': 'id="enterButton"',
    '#soundtrack': 'id="soundtrack"',
}
missing = [label for label, needle in required.items() if needle not in s]
if missing:
    raise SystemExit("Faltan prerequisitos sonoros: " + ", ".join(missing))

if 'oras-sonic-breath-engine' not in s:
    raise SystemExit('El motor de respiración sonora no fue insertado')

# 1) Referencia defensiva al botón de entrada. En el HTML actual es hijo directo
# de .entry-gate, pero el fallback tolera cambios de marcado futuros.
s = s.replace(
    "  const enterButton = document.getElementById('enterButton');",
    "  const entryGate = document.getElementById('entryGate') || document.querySelector('.entry-gate');\n"
    "  const enterButton = document.getElementById('enterButton') || entryGate?.querySelector('button');",
    1,
)

# 2) El index canónico YA posee fadeSoundTo() y su observer final. No añadimos un
# segundo temporizador que compita por soundtrack.volume. El motor añadido solo
# funde sus capas Web Audio y, al terminar el fundido canónico, fuerza el estado
# irreversible de silencio como red de seguridad.
start = s.find("  function fadeHtmlAudio(target, duration = 2.5, done){")
if start >= 0:
    end = s.find("\n  function stopLayer", start)
    if end < 0:
        raise SystemExit('No se pudo aislar fadeHtmlAudio')
    s = s[:start] + s[end+1:]

s = s.replace("  let htmlAudioFade = 0;\n", "", 1)

old = """    fadeHtmlAudio(0, 5, () => {
      try{ soundtrack?.pause(); }catch(_){}
      if(soundtrack) soundtrack.muted = true;
      stopLayer(machineLayer);
      stopLayer(busLayer);
    });"""
new = """    // El <audio> principal se funde mediante fadeSoundTo(0,5000) en el
    // observer canónico del propio index. Aquí no competimos por volume.
    window.setTimeout(() => {
      if(soundtrack){
        soundtrack.volume = 0;
        soundtrack.muted = true;
        try{ soundtrack.pause(); }catch(_){}
      }
      stopLayer(machineLayer);
      stopLayer(busLayer);
    }, 5200);"""
if old not in s:
    raise SystemExit('No se encontró el bloque de fundido HTML duplicado')
s = s.replace(old, new, 1)

# 3) Cada marca se consume antes de ejecutar su acción: no existe una segunda
# oportunidad de disparo aunque la acción produzca cambios de layout.
old_order = """        seen.add(entry.target);
        const action = actions.get(entry.target);
        if(action) action();
        observer.unobserve(entry.target);"""
new_order = """        seen.add(entry.target);
        observer.unobserve(entry.target);
        const action = actions.get(entry.target);
        if(action) action();"""
if old_order not in s:
    raise SystemExit('No se encontró el orden del observer sonoro')
s = s.replace(old_order, new_order, 1)

# 4) El motor se inserta al final del body ya construido. No necesita un segundo
# DOMContentLoaded ni window.load; esta aserción evita introducirlos aquí.
engine = s[s.find('<script id="oras-sonic-breath-engine">'):]
engine = engine[:engine.find('</script>')]
if 'DOMContentLoaded' in engine or "addEventListener('load'" in engine or 'addEventListener("load"' in engine:
    raise SystemExit('El motor sonoro no debe crear una segunda inicialización global')

path.write_text(s, encoding="utf-8")
print('PASS: firma real verificada; anclajes presentes; sin doble fundido ni doble inicialización')
