#!/usr/bin/env python3
"""Blindaje de la respiración sonora de SOLO LA TARJETA.

Unifica el motor nuevo con el fadeSoundTo canónico del index: no crea un segundo
fundido de <audio>, no añade otra inicialización global y mantiene un único
disparo narrativo de silencio en #duskPreFinal.
"""
from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else "index.html")
s = path.read_text(encoding="utf-8")

required = {
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

# 1) El index fuente real llega aquí con fadeSoundTo(target,duration=900).
# Lo ampliamos, en el mismo punto de definición, para aceptar callback y para
# conservar una cadencia fina también en el fundido largo de 5 segundos.
old_fade = """  const fadeSoundTo=(target,duration=900)=>{
    clearInterval(soundFade);
    const start=soundtrack.volume;
    const steps=30;
    let n=0;
    soundFade=setInterval(()=>{
      n++;
      const t=n/steps;
      soundtrack.volume=start+(target-start)*t;
      if(n>=steps){
        clearInterval(soundFade);
        soundtrack.volume=target;
      }
    },Math.max(16,duration/steps));
  };"""
new_fade = """  const fadeSoundTo=(target,duration=900,done)=>{
    clearInterval(soundFade);
    const start=soundtrack.volume;
    const steps=duration>2500?Math.round(duration/50):30;
    let n=0;
    soundFade=setInterval(()=>{
      n++;
      const t=n/steps;
      soundtrack.volume=start+(target-start)*t;
      if(n>=steps){
        clearInterval(soundFade);
        soundtrack.volume=target;
        if(typeof done==='function')done();
      }
    },Math.max(16,duration/steps));
  };"""
if old_fade in s:
    s = s.replace(old_fade, new_fade, 1)
elif "const fadeSoundTo=(target,duration=900,done)=>" not in s:
    raise SystemExit('No se encontró la firma real de fadeSoundTo para unificarla')

# 2) Referencia defensiva al botón de entrada dentro del motor añadido.
s = s.replace(
    "  const enterButton = document.getElementById('enterButton');",
    "  const entryGate = document.getElementById('entryGate') || document.querySelector('.entry-gate');\n"
    "  const enterButton = document.getElementById('enterButton') || entryGate?.querySelector('button');",
    1,
)

# 3) Eliminar el segundo temporizador que competía por soundtrack.volume.
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
new = """    // Un único fundido del <audio>: reutiliza el fadeSoundTo canónico.
    fadeSoundTo(0, 5000, () => {
      if(soundtrack){
        soundtrack.volume = 0;
        soundtrack.muted = true;
        try{ soundtrack.pause(); }catch(_){}
      }
      stopLayer(machineLayer);
      stopLayer(busLayer);
    });"""
if old not in s:
    raise SystemExit('No se encontró el bloque de fundido HTML duplicado')
s = s.replace(old, new, 1)

# 4) Consumir cada marca antes de ejecutar su acción, para que un cambio de layout
# provocado por la propia acción no pueda dispararla de nuevo.
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

# 5) El motor se inserta sobre DOM ya construido: no debe añadir otro arranque.
engine_start = s.find('<script id="oras-sonic-breath-engine">')
engine_end = s.find('</script>', engine_start)
if engine_start < 0 or engine_end < 0:
    raise SystemExit('No se pudo aislar el motor sonoro')
engine = s[engine_start:engine_end]
if 'DOMContentLoaded' in engine or "addEventListener('load'" in engine or 'addEventListener("load"' in engine:
    raise SystemExit('El motor sonoro no debe crear una segunda inicialización global')

# Contrato final que también exige el workflow.
for needle in (
    "const fadeSoundTo=(target,duration=900,done)=>",
    "fadeSoundTo(0, 5000, () => {",
):
    if needle not in s:
        raise SystemExit('No quedó aplicada la unificación sonora: ' + needle)
if 'function fadeHtmlAudio' in s:
    raise SystemExit('Sigue existiendo un segundo fundido HTML')

path.write_text(s, encoding="utf-8")
print('PASS: fadeSoundTo unificado; anclajes presentes; sin doble fundido ni doble inicialización')
