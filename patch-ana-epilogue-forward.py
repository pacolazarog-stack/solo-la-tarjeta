from pathlib import Path
import re

p=Path('elegia-breve/index.html')
s=p.read_text(encoding='utf-8')

# Idempotencia: si ya está aplicada, solo verificamos el contrato.
if 'function anaEpilogueForwardTarget()' not in s:
    pattern=r"(?ms)^\s*function setJourney\(piece\)\{.*?^\s*\}\n(?=\s*function goJourney\(piece\))"
    m=re.search(pattern,s)
    if not m:
        raise RuntimeError('No se encontró setJourney de ANA KLAUDYA')

    indent=re.match(r"\s*",m.group(0)).group(0)
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

if "if(journeyPiece==='epilogo')" not in s:
    pattern=r"journeyNext\.addEventListener\('click',\(\)=>goJourney\(journeyPieces\[journeyPieces\.indexOf\(journeyPiece\)\+1\]\)\);"
    new_next="""journeyNext.addEventListener('click',()=>{
        if(journeyPiece==='epilogo'){
          const target=anaEpilogueForwardTarget();
          if(target){try{window.top.location.href=target.href}catch(_){location.href=target.href}return;}
        }
        goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)+1]);
      });"""
    s,count=re.subn(pattern,new_next,s,count=1)
    if count!=1:
        raise RuntimeError('No se encontró acción Siguiente de ANA KLAUDYA')

p.write_text(s,encoding='utf-8')

check=p.read_text(encoding='utf-8')
required=[
    "function anaEpilogueForwardTarget()",
    "saved.soloComplete!==true",
    "saved.cenicientoComplete!==true",
    "journeyNext.disabled=i===journeyPieces.length-1&&!epilogueTarget",
    "if(journeyPiece==='epilogo')",
    "window.top.location.href=target.href",
]
for token in required:
    if token not in check: raise RuntimeError('Falta blindaje de navegación: '+token)
print('PASS: Flores conserva Adelante hacia la primera lectura pendiente; EL ESPEJO sigue reservado al cierre 3/3')
