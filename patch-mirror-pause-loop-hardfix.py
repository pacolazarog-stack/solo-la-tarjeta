from pathlib import Path

p=Path('ceniciento/el-espejo.js')
s=p.read_text(encoding='utf-8')

old="""    next.addEventListener('click',()=>{
      if(!locked||lockedScene!==scene)return;
      releasePause();
      const following=sceneNodes[index+1];
      if(following){
        mirror.scrollTo({top:following.offsetTop,left:0,behavior:'smooth'});
        setTimeout(()=>following.focus({preventScroll:true}),420);
      }
    });scene.append(next);"""
new="""    next.addEventListener('click',()=>{
      if(!locked||lockedScene!==scene)return;
      /* Esta pausa queda definitivamente consumida en esta lectura antes de
         liberar el bloqueo o iniciar cualquier scroll. Así el observer no
         puede rearmarla durante la propia transición. */
      scene.dataset.pauseConsumed='true';
      try{pauseObserver.unobserve(scene)}catch(_){}
      releasePause();
      const following=sceneNodes[index+1];
      if(following){
        mirror.scrollTo({top:following.offsetTop,left:0,behavior:'smooth'});
        setTimeout(()=>following.focus({preventScroll:true}),420);
      }
    });scene.append(next);"""

if old not in s:
    raise RuntimeError('No se encontró el manejador actual de Seguir en EL ESPEJO')
s=s.replace(old,new,1)

# Refuerzo: aunque por cualquier motivo una escena consumida siga observada,
# nunca debe volver a convertirse en pausa activa.
old_trigger="""if(entry.isIntersecting&&entry.intersectionRatio>=.68&&entry.target.dataset.pause==='true'&&entry.target.dataset.pauseConsumed!=='true'){"""
if old_trigger not in s:
    raise RuntimeError('No se encontró el filtro de pausas consumidas de EL ESPEJO')

p.write_text(s,encoding='utf-8')
print('PASS: cada Seguir consume y desobserva su pausa antes de avanzar')
