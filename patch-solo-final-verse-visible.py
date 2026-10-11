from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

old="""      finalPhrase.classList.add('visible');
      finalPhrase.style.opacity='1';
      finalPhrase.style.visibility='visible';
      finalPhrase.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});
"""
new="""      finalPhrase.classList.add('visible');
      document.documentElement.style.setProperty('--final-phrase','1');
      finalPhrase.style.setProperty('opacity','1','important');
      finalPhrase.style.setProperty('visibility','visible','important');
      finalPhrase.style.setProperty('display','block','important');
      finalPhrase.style.setProperty('filter','none','important');
      finalPhrase.style.setProperty('transform','none','important');
      finalPhrase.style.setProperty('color','#fffaf1','important');
      const finalWrap=finalPhrase.closest('.dusk-final-wrap');
      const finalEnding=finalPhrase.closest('.dusk-ending');
      const finalPassage=finalPhrase.closest('.dusk-passage');
      for(const el of [finalWrap,finalEnding,finalPassage]){
        if(!el)continue;
        el.style.setProperty('opacity','1','important');
        el.style.setProperty('visibility','visible','important');
        el.style.setProperty('filter','none','important');
      }
      finalPhrase.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});
"""
if old not in s:
    raise RuntimeError('No se encontró el bloque de visibilidad de la frase final de SOLO')
s=s.replace(old,new,1)

old_css="""      body.ou-solo-final-locked #duskFinalPhrase{opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important}
"""
new_css="""      body.ou-solo-final-locked .dusk-passage,body.ou-solo-final-locked .dusk-ending,body.ou-solo-final-locked .dusk-final-wrap{opacity:1!important;visibility:visible!important;filter:none!important}
      body.ou-solo-final-locked #duskFinalPhrase{display:block!important;opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;color:#fffaf1!important;text-shadow:0 1px 4px rgba(0,0,0,.82)!important}
"""
if old_css not in s:
    raise RuntimeError('No se encontró la regla CSS de la frase final de SOLO')
s=s.replace(old_css,new_css,1)

p.write_text(s,encoding='utf-8')
