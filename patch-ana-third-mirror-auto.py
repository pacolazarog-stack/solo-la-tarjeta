from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# El cierre de ANA KLAUDYA cuando completa 3/3 no ofrece una botonera.
# Flores permanece sola durante diez segundos y después autoriza, de forma
# narrativa explícita, la entrada automática en EL ESPEJO.
start=s.find("  let follow=document.querySelector('.ou-ana-third-follow');")
if start < 0:
    raise RuntimeError('No se encontró el control Seguir del cierre 3/3 de ANA')
end_marker="  return true;\n}\n\n"
end=s.find(end_marker,start)
if end < 0:
    raise RuntimeError('No se encontró el final de showAnaThirdMirrorGate')
end += len("  return true;\n")

replacement=r'''  const block=event=>{
    if(!anaThirdGateOpen)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  };
  addEventListener('wheel',block,{passive:false,capture:true});
  addEventListener('touchmove',block,{passive:false,capture:true});
  addEventListener('pointerdown',block,{passive:false,capture:true});
  addEventListener('click',block,{capture:true});
  addEventListener('keydown',block,{capture:true});

  const enterMirrorAfterFlowers=()=>{
    if(!anaThirdGateOpen)return;
    anaThirdGateOpen=false;
    try{frame.contentDocument?.getElementById(childStyleId)?.remove();}catch(_){}
    document.body.classList.remove('ou-ana-third-mirror-gate');
    save({anaThirdGatePending:false});state=readState();ensureChecklist();
    document.body.classList.add('ou-mirror-explicit-enter');
    maybeStartMirror();
  };

  window.setTimeout(enterMirrorAfterFlowers,10000);
  return true;
'''

s=s[:start]+replacement+s[end:]

# No debe quedar ningún botón Seguir en esta transición concreta.
if "follow.textContent='Seguir'" in s[s.find('function showAnaThirdMirrorGate'):s.find('function showAnaThirdMirrorGate')+9000]:
    raise RuntimeError('Persistió un botón Seguir en el cierre 3/3 de ANA')

p.write_text(s,encoding='utf-8')
print('PASS: Flores espera 10 s sin botonera y entra automáticamente en EL ESPEJO cuando ANA completa 3/3')
