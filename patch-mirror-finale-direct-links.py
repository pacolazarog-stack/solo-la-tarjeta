from pathlib import Path

p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')

old_question = "question.onclick=()=>go(ROOT+'elegia-breve/#ceniciento');"
new_question = "question.onclick=()=>go(ROOT+'ceniciento/?via=question');"
if old_question in s:
    s = s.replace(old_question, new_question, 1)
elif "question.onclick=()=>go(ROOT+'ceniciento/');" in s:
    s = s.replace("question.onclick=()=>go(ROOT+'ceniciento/');", new_question, 1)
else:
    raise RuntimeError('No se encontró el enlace final del interrogante')

old_card = "card.onclick=()=>go(ROOT+'?origen=tarjeta&auto=1');"
if old_card not in s:
    raise RuntimeError('No se encontró el enlace final de la tarjeta')

# Añadimos además un enlace duro por pointerup/click/teclado. Esto evita que
# cualquier manejador global de la pantalla final o un iframe intermedio pueda
# neutralizar la navegación visual de los dos símbolos.
anchor = """finale.append(flag,finaleNav,card,question);
document.body.append(finale);
"""
hard = r'''function hardFinalNavigate(relative){
  const absolute=new URL(relative,location.origin).href;
  clearFinaleTimers();
  try{
    if(window.top&&window.top.location){window.top.location.assign(absolute);return;}
  }catch(_){}
  location.assign(absolute);
}
function bindHardFinalLink(node,relative){
  node.dataset.directHref=relative;
  const activate=event=>{
    if(event){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();}
    hardFinalNavigate(relative);
  };
  node.onclick=activate;
  node.addEventListener('pointerup',activate,{capture:true});
  node.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){activate(event);}
  },{capture:true});
}
bindHardFinalLink(question,ROOT+'ceniciento/?via=question');
bindHardFinalLink(card,ROOT+'?origen=tarjeta&auto=1');

finale.append(flag,finaleNav,card,question);
document.body.append(finale);
'''
if anchor not in s:
    raise RuntimeError('No se encontró el montaje de la pantalla final')
s = s.replace(anchor, hard, 1)

p.write_text(s, encoding='utf-8')
print('PASS: enlaces finales blindados: ? -> CENICIENTO; tarjeta -> SOLO LA TARJETA')
