from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

old_maybe="""function maybeStartMirror(){
  state=readState();ensureChecklist();
  /* En la cadena CENICIENTO -> SOLO -> EL ESPEJO nunca se entra automáticamente.
     Solo se entra tras la acción explícita que corresponda al cierre de SOLO. */
  if(soloFromCeniciento&&!document.body.classList.contains('ou-solo-mirror-enter'))return;
  if(state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete)launchMirror();
}
"""
new_maybe="""function maybeStartMirror(){
  state=readState();ensureChecklist();
  /* EL ESPEJO nunca debe arrancar por el mero hecho de cargar una pieza con 3/3.
     Solo una acción narrativa explícita puede autorizar su entrada. */
  const explicit=document.body.classList.contains('ou-mirror-explicit-enter')||
    (soloFromCeniciento&&document.body.classList.contains('ou-solo-mirror-enter'));
  if(!explicit)return;
  if(state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete){
    document.body.classList.remove('ou-mirror-explicit-enter');
    launchMirror();
  }
}
"""
if old_maybe not in s:
    raise RuntimeError('No se encontró maybeStartMirror para blindar la entrada explícita')
s=s.replace(old_maybe,new_maybe,1)

# Incluso la señal interna que finalmente abre EL ESPEJO queda autenticada como
# explícita. Así cualquier emisión residual de oras:mirror-start queda ignorada.
old_launch="const start=()=>window.dispatchEvent(new CustomEvent('oras:mirror-start'));"
new_launch="const start=()=>window.dispatchEvent(new CustomEvent('oras:mirror-start',{detail:{explicit:true}}));"
if old_launch not in s:
    raise RuntimeError('No se encontró el disparo interno de EL ESPEJO')
s=s.replace(old_launch,new_launch,1)

old_ana="""    save({anaThirdGatePending:false});state=readState();ensureChecklist();
    maybeStartMirror();
"""
new_ana="""    save({anaThirdGatePending:false});state=readState();ensureChecklist();
    document.body.classList.add('ou-mirror-explicit-enter');
    maybeStartMirror();
"""
if old_ana not in s:
    raise RuntimeError('No se encontró el Seguir final de ANA KLAUDYA')
s=s.replace(old_ana,new_ana,1)

anchor="""window.addEventListener('oras:ana-part-complete',event=>completeAnaPart(event.detail?.part));

let anaThirdGateOpen=false;
"""
insert="""window.addEventListener('oras:ana-part-complete',event=>completeAnaPart(event.detail?.part));
window.addEventListener('oras:mirror-explicit-start',()=>{
  document.body.classList.add('ou-mirror-explicit-enter');
  maybeStartMirror();
});

let anaThirdGateOpen=false;
"""
if anchor not in s:
    raise RuntimeError('No se encontró el punto para instalar la entrada explícita de EL ESPEJO')
s=s.replace(anchor,insert,1)

# Los controles externos de CENICIENTO no pueden despachar directamente mirror-start,
# porque eso saltaría la carga controlada de el-espejo.js. Deben pedir la entrada explícita.
s=s.replace("forward.onclick=()=>window.dispatchEvent(new CustomEvent('oras:mirror-start'));",
            "forward.onclick=()=>window.dispatchEvent(new CustomEvent('oras:mirror-explicit-start'));",1)

old_transition="""      window.dispatchEvent(new CustomEvent('oras:mirror-start'));
    },760);
"""
new_transition="""      window.dispatchEvent(new CustomEvent('oras:mirror-explicit-start'));
    },760);
"""
if old_transition not in s:
    raise RuntimeError('No se encontró el Seguir de transición CENICIENTO -> EL ESPEJO')
s=s.replace(old_transition,new_transition,1)

p.write_text(s,encoding='utf-8')

# Segunda barrera dentro del propio lector de EL ESPEJO. El script puede estar
# cargado en CENICIENTO desde el inicio, pero jamás debe mostrar una escena salvo
# que reciba la señal autenticada anterior.
p=Path('ceniciento/el-espejo.js')
m=p.read_text(encoding='utf-8')
old_listener="window.addEventListener('oras:mirror-start',start);"
new_listener="window.addEventListener('oras:mirror-start',event=>{if(event.detail?.explicit===true)start();});"
if old_listener not in m:
    raise RuntimeError('No se encontró el listener de inicio de EL ESPEJO')
m=m.replace(old_listener,new_listener,1)

# Al cargar o volver a CENICIENTO por ?/Lecturas, se garantiza una pantalla limpia
# aunque el navegador restaure clases del documento desde bfcache.
reset_guard="""
;(()=>{
  const path=location.pathname.replace(/\\/index\\.html$/,'/').replace(/\\/+$/,'');
  if(!path.endsWith('/ceniciento'))return;
  const params=new URLSearchParams(location.search);
  if(!params.has('via')&&!params.has('origen'))return;
  const mirror=document.getElementById('mirror');
  if(mirror)mirror.hidden=true;
  document.body.classList.remove('mirror','mirror-finale-active','mirror-pause-locked','mirror-final-wait-locked');
})();
"""
if 'params.has(\'via\')' not in m:
    m += reset_guard
p.write_text(m,encoding='utf-8')

print('PASS: EL ESPEJO solo acepta una señal explícita autenticada y CENICIENTO entra limpio al releer')
