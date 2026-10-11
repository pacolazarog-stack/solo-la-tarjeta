from pathlib import Path

p=Path('ceniciento/index.html')
s=p.read_text(encoding='utf-8')

# El cierre nativo no debe escribir «fin» en pantalla.
s=s.replace("status.textContent='fin'", "status.textContent=''", 1)

marker='oras-ceniciento-purge-native-exits'
script=r'''<script id="oras-ceniciento-purge-native-exits">
(()=>{
  const purge=()=>{
    // CENICIENTO no conserva ninguna botonera final propia: el recorrido general
    // se encarga de la continuación narrativa.
    document.querySelectorAll('.ou-ceniciento-endnav').forEach(node=>node.remove());

    for(const node of [...document.querySelectorAll('a,button')]){
      const text=(node.textContent||'').trim().replace(/\s+/g,' ').toUpperCase();
      if(text==='ANA KLAUDYA'||text==='SOLO LA TARJETA') node.remove();
    }

    const status=document.getElementById('status');
    if(status&&/^fin$/i.test((status.textContent||'').trim())) status.textContent='';
  };
  const start=()=>{
    purge();
    const mo=new MutationObserver(purge);
    mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
</script>'''

if marker not in s:
    if '</body>' not in s:
        raise RuntimeError('No se encontró </body> en ceniciento/index.html')
    s=s.replace('</body>',script+'\n</body>',1)

p.write_text(s,encoding='utf-8')

# La navegación común del documento padre debe permanecer visible sobre
# CENICIENTO: ATRÁS · ÍNDICE · DELANTE. Sustituye a las antiguas salidas
# nominales y funciona tanto durante la lectura como al llegar al cierre.
parent=Path('elegia-breve/index.html')
t=parent.read_text(encoding='utf-8')

t=t.replace(
    '<button id="journeyPrevious" type="button">Anterior</button>',
    '<button id="journeyPrevious" type="button">Atrás</button>',
    1,
)
t=t.replace(
    '<button id="journeyNext" type="button">Siguiente</button>',
    '<button id="journeyNext" type="button">Delante</button>',
    1,
)

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
new_set="""      function setJourney(piece){
        if(piece==='ceniciento'){
          journeyPiece='ceniciento';journeyNav.hidden=false;
          journeyPrevious.disabled=false;journeyNext.disabled=false;
          journeyPrevious.setAttribute('aria-label','Atrás · volver a ANA KLAUDYA');
          journeyNext.setAttribute('aria-label','Delante · continuar a SOLO LA TARJETA');
          journeyNav.setAttribute('aria-label','Recorrido · CENICIENTO');
          return;
        }
        const i=journeyPieces.indexOf(piece);if(i<0)return;
        journeyPiece=piece;journeyNav.hidden=false;
        journeyPrevious.disabled=i===0;journeyNext.disabled=i===journeyPieces.length-1;
        journeyPrevious.setAttribute('aria-label',i>0?'Atrás: '+journeyTitles[i-1]:'Principio del recorrido');
        journeyNext.setAttribute('aria-label',i<journeyPieces.length-1?'Delante: '+journeyTitles[i+1]:'Final del recorrido');
        journeyNav.setAttribute('aria-label','Recorrido · '+journeyTitles[i]);
      }
"""
if old_set not in t:
    raise RuntimeError('No se encontró setJourney base en elegia-breve/index.html')
t=t.replace(old_set,new_set,1)

old_handlers="""      journeyPrevious.addEventListener('click',()=>goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)-1]));
      journeyNext.addEventListener('click',()=>goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)+1]));
"""
new_handlers="""      journeyPrevious.addEventListener('click',()=>{
        if(journeyPiece==='ceniciento'){returnToAna('home');return;}
        goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)-1]);
      });
      journeyNext.addEventListener('click',()=>{
        if(journeyPiece==='ceniciento'){
          window.top.location.href='../?origen=ceniciento';
          return;
        }
        goJourney(journeyPieces[journeyPieces.indexOf(journeyPiece)+1]);
      });
"""
if old_handlers not in t:
    raise RuntimeError('No se encontraron los manejadores de recorrido base')
t=t.replace(old_handlers,new_handlers,1)

parent.write_text(t,encoding='utf-8')
