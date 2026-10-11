from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

marker='oras-solo-narrative-entropy-v1'
if marker in s:
    print('PASS: entropía narrativa de SOLO ya presente')
    raise SystemExit(0)

required=[
    "let machineLayer = null;",
    "let busLayer = null;",
    "let paymentPlayed = false;",
    "fadeGain(machineLayer.gain, 0.025, 4);",
    "fadeGain(busLayer.gain, 0.015, 4);",
    "fadeGain(machineLayer.gain, 0, 6);",
    "fadeGain(busLayer.gain, 0, 6);",
]
for token in required:
    if token not in s:
        raise RuntimeError('Falta anclaje sonoro para entropía narrativa: '+token)

entropy=r'''  // oras-solo-narrative-entropy-v1
  // Después de EL ESPEJO, cada retorno reduce discretamente el ruido exterior.
  // No se añade contenido ni se atenúa el golpe de 200,79 €: sólo retroceden
  // máquina, autobús y la duración de su desaparición en París.
  let memoryDepth = 0;
  const clampDepth=value=>Math.max(0,Math.min(3,Number(value)||0));
  const entropyGain=layer=>{
    const levels={
      machine:[0.025,0.020,0.016,0.012],
      bus:[0.015,0.012,0.009,0.006]
    };
    return levels[layer][clampDepth(memoryDepth)];
  };
  const entropyFade=base=>{
    if(memoryDepth<=0)return base;
    if(memoryDepth===1)return Math.max(2.8,base*0.88);
    if(memoryDepth===2)return Math.max(2.4,base*0.72);
    return Math.max(2.0,base*0.58);
  };
  window.addEventListener('oras:memory-active',event=>{
    if(event?.detail?.route!=='solo')return;
    memoryDepth=clampDepth(event.detail.depth);
    document.documentElement.classList.add('oras-solo-entropy-'+memoryDepth);
  });
'''

anchor="  let paymentPlayed = false;\n"
if anchor not in s:
    raise RuntimeError('No se encontró punto estable de inserción para entropía narrativa')
s=s.replace(anchor, anchor+"\n"+entropy+"\n", 1)

s=s.replace("fadeGain(machineLayer.gain, 0.025, 4);", "fadeGain(machineLayer.gain, entropyGain('machine'), entropyFade(4));", 1)
s=s.replace("fadeGain(busLayer.gain, 0.015, 4);", "fadeGain(busLayer.gain, entropyGain('bus'), entropyFade(4));", 1)
s=s.replace("fadeGain(machineLayer.gain, 0, 6);", "fadeGain(machineLayer.gain, 0, entropyFade(6));", 1)
s=s.replace("stopLayer(machineLayer, 6.2);", "stopLayer(machineLayer, entropyFade(6)+0.2);", 1)
s=s.replace("fadeGain(busLayer.gain, 0, 6);", "fadeGain(busLayer.gain, 0, entropyFade(6));", 1)
s=s.replace("stopLayer(busLayer, 6.2);", "stopLayer(busLayer, entropyFade(6)+0.2);", 1)

p.write_text(s,encoding='utf-8')

check=p.read_text(encoding='utf-8')
checks=[
    'oras-solo-narrative-entropy-v1',
    "machine:[0.025,0.020,0.016,0.012]",
    "bus:[0.015,0.012,0.009,0.006]",
    "window.addEventListener('oras:memory-active'",
    "event?.detail?.route!=='solo'",
    "entropyGain('machine')",
    "entropyGain('bus')",
    "osc.frequency.value = 1040",
]
for token in checks:
    if token not in check:
        raise RuntimeError('Falta contrato de entropía narrativa: '+token)
print('PASS: SOLO reduce máquina y autobús en relecturas post-Espejo sin alterar texto, pago ni silencio final')
