from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# Cuando ANA KLAUDYA completa 3/3, Flores queda sola durante diez segundos.
# Después aparece únicamente Seguir; solo esa acción explícita abre EL ESPEJO.
start=s.find("  let follow=document.querySelector('.ou-ana-third-follow');")
if start < 0:
    raise RuntimeError('No se encontró el control Seguir del cierre 3/3 de ANA')
end_marker="  return true;\n}\n\n"
end=s.find(end_marker,start)
if end < 0:
    raise RuntimeError('No se encontró el final de showAnaThirdMirrorGate')
end += len("  return true;\n")

replacement=r'''  let follow=null;

  const isFollowTarget=event=>!!(follow&&(event.target===follow||event.target?.closest?.('.ou-ana-third-follow')));
  const block=event=>{
    if(!anaThirdGateOpen)return;
    if(isFollowTarget(event)){
      if(event.type==='click'||event.type==='pointerdown')return;
      if(event.type==='keydown'&&['Enter',' '].includes(event.key))return;
    }
    if(event.type==='keydown'&&event.key==='Tab'&&follow){
      event.preventDefault();follow.focus({preventScroll:true});return;
    }
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
    follow?.remove();follow=null;
    save({anaThirdGatePending:false});state=readState();ensureChecklist();
    document.body.classList.add('ou-mirror-explicit-enter');
    maybeStartMirror();
  };

  const showAnaMirrorFollow=()=>{
    if(!anaThirdGateOpen||follow)return;
    follow=document.createElement('button');
    follow.type='button';
    follow.className='ou-ana-third-follow';
    follow.textContent='Seguir';
    follow.setAttribute('aria-label','Continuar hacia EL ESPEJO');
    follow.addEventListener('click',enterMirrorAfterFlowers,{once:true});
    document.body.appendChild(follow);
    requestAnimationFrame(()=>follow?.focus({preventScroll:true}));
  };

  window.setTimeout(showAnaMirrorFollow,10000);
  return true;
'''

s=s[:start]+replacement+s[end:]

scope=s[s.find('function showAnaThirdMirrorGate'):s.find('function showAnaThirdMirrorGate')+10000]
for needle in (
    "window.setTimeout(showAnaMirrorFollow,10000)",
    "follow.textContent='Seguir'",
    "follow.addEventListener('click',enterMirrorAfterFlowers,{once:true})",
    "document.body.classList.add('ou-mirror-explicit-enter')",
):
    if needle not in scope:
        raise RuntimeError('Falta contrato del cierre Flores -> Seguir -> EL ESPEJO: '+needle)
if "setTimeout(enterMirrorAfterFlowers,10000)" in scope:
    raise RuntimeError('EL ESPEJO no debe arrancar automáticamente tras Flores')

p.write_text(s,encoding='utf-8')
print('PASS: Flores espera 10 s, muestra solo Seguir y Seguir activa explícitamente EL ESPEJO')
