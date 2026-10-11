from pathlib import Path
import re

p=Path('elegia-breve/index.html')
s=p.read_text(encoding='utf-8')

# 1) Mantener Adelante activo en Flores mientras quede alguna lectura pendiente.
if 'function anaEpilogueForwardTarget()' not in s:
    pattern=r"(?ms)^\s*function setJourney\(piece\)\{.*?^\s*\}\n(?=\s*function goJourney\(piece\))"
    m=re.search(pattern,s)
    if not m:
        raise RuntimeError('No se encontró setJourney de ANA KLAUDYA')

    new_set="""      function anaUniverseState(){
        try{return JSON.parse(localStorage.getItem('oras.universe.v2')||'null')||{}}catch(_){return {}}
      }
      function anaEpilogueForwardTarget(){
        const saved=anaUniverseState();
        if(saved.soloComplete!==true)return {href:'../?origen=ana-nav&auto=1',label:'Adelante: SOLO LA TARJETA'};
        if(saved.cenicientoComplete!==true)return {href:'../ceniciento/?origen=ana-nav',label:'Adelante: CENICIENTO'};
        return null;
      }
      function setJourney(piece){
        if(piece==='ceniciento'){journeyNav.hidden=true;return;}
        const i=journeyPieces.indexOf(piece);if(i<0)return;
        journeyPiece=piece;journeyNav.hidden=false;
        const epilogueTarget=piece==='epilogo'?anaEpilogueForwardTarget():null;
        journeyPrevious.disabled=i===0;
        journeyNext.disabled=i===journeyPieces.length-1&&!epilogueTarget;
        journeyPrevious.setAttribute('aria-label',i>0?'Anterior: '+journeyTitles[i-1]:'Principio del recorrido');
        journeyNext.setAttribute('aria-label',epilogueTarget?epilogueTarget.label:(i<journeyPieces.length-1?'Siguiente: '+journeyTitles[i+1]:'Final del recorrido'));
        journeyNav.setAttribute('aria-label','Recorrido · '+journeyTitles[i]);
      }
"""
    s=s[:m.start()]+new_set+s[m.end():]

# 2) No dependemos de la forma textual del listener canónico de journeyNext.
#    Un listener en captura intercepta únicamente Flores cuando queda una lectura pendiente.
marker='oras-ana-epilogue-forward-v2'
if marker not in s:
    anchor='''<script data-oras-universe="v1" src="../narrative-universe.js'''
    pos=s.rfind(anchor)
    if pos < 0:
        raise RuntimeError('No se encontró la carga de narrative-universe.js en ANA KLAUDYA')

    addon=r'''
<script id="oras-ana-epilogue-forward-v2">
;(()=>{
  const STORAGE='oras.universe.v2';
  const readState=()=>{
    try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch(_){return {}}
  };
  const pendingHref=()=>{
    const saved=readState();
    if(saved.soloComplete!==true)return '../?origen=ana-nav&auto=1';
    if(saved.cenicientoComplete!==true)return '../ceniciento/?origen=ana-nav';
    return '';
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#journeyNext');
    if(!button || location.hash.toLowerCase()!=='#epilogo')return;
    const href=pendingHref();
    if(!href)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    try{window.top.location.href=href}catch(_){location.href=href}
  },true);
})();
</script>
'''
    s=s[:pos]+addon+s[pos:]

p.write_text(s,encoding='utf-8')

check=p.read_text(encoding='utf-8')
required=[
    "function anaEpilogueForwardTarget()",
    "saved.soloComplete!==true",
    "saved.cenicientoComplete!==true",
    "journeyNext.disabled=i===journeyPieces.length-1&&!epilogueTarget",
    "oras-ana-epilogue-forward-v2",
    "event.stopImmediatePropagation()",
    "#journeyNext",
    "location.hash.toLowerCase()!=='#epilogo'",
]
for token in required:
    if token not in check: raise RuntimeError('Falta blindaje de navegación: '+token)
print('PASS: Flores conserva Adelante hacia la primera lectura pendiente sin depender del formato del listener canónico')
