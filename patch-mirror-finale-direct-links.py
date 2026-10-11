from pathlib import Path

p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')

old_question = "question.onclick=()=>go(ROOT+'elegia-breve/#ceniciento');"
new_question = "question.onclick=()=>go(ROOT+'ceniciento/');"
if old_question not in s:
    raise RuntimeError('No se encontró el enlace final del interrogante')
s = s.replace(old_question, new_question, 1)

# La tarjeta ya debe abrir directamente SOLO LA TARJETA. Se reafirma aquí para
# impedir que otro parche la redirija a ANA o a una ruta intermedia.
old_card = "card.onclick=()=>go(ROOT+'?origen=tarjeta&auto=1');"
new_card = "card.onclick=()=>go(ROOT+'?origen=tarjeta&auto=1');"
if old_card not in s:
    raise RuntimeError('No se encontró el enlace final de la tarjeta')
s = s.replace(old_card, new_card, 1)

p.write_text(s, encoding='utf-8')
print('PASS: ? abre CENICIENTO y la tarjeta abre SOLO LA TARJETA directamente')
