from pathlib import Path

p=Path('elegia-breve/index.html')
s=p.read_text(encoding='utf-8')

old_set="""      function setJourney(piece){
        if(piece==='ceniciento'){journeyNav.hidden=true;return;}
        const i=journeyPieces.indexOf(piece);if(i<0)return;
        journeyPiece=piece;journeyNav.hidden=false;
        journeyPrevious.disabled=i===0;journeyNext.disabled=i===journeyPieces.length-1;
        journeyPrevious.setAttribute('aria-label',i>0?'Anterior: '+journeyTitles[i-1]:'Principio del recorrido');
        journeyNext.setAttribute('aria-label',i<journeyPieces.length-1?'Siguiente: '+journeyTitles[i+1]:'Final del recorrido');
        journeyNav.setAttribute('aria-label','Recorrido · '+journeyTitles[i]);
      }
"""
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
if old_set not in s:
    raise RuntimeError('No se encontró setJourney de ANA KLAUDYA')
s=s.replace(old_set,new_set,1)

old_next="""      journeyNext.addEventListener('click',()=>goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)+1]));
"""
new_next="""      journeyNext.addEventListener('click',()=>{
        if(journeyPiece==='epilogo'){
          const target=anaEpilogueForwardTarget();
          if(target){try{window.top.location.href=target.href}catch(_){location.href=target.href}return;}
        }
        goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)+1]);
      });
"""
if old_next not in s:
    raise RuntimeError('No se encontró acción Siguiente de ANA KLAUDYA')
s=s.replace(old_next,new_next,1)

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
