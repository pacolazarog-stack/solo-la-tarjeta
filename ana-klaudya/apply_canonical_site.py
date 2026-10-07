from pathlib import Path


def replace_exact(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if old not in text:
        raise RuntimeError(f"No se encontró el bloque esperado en {path}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


# EN TUS OJOS · versión canónica actual.
replace_exact(
    "ojos/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="3000">Te miro.</span>\n</p>\n''',
    "",
)
replace_exact(
    "ojos/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="2400">Tus párpados se entornan.</span>\n<span class="line" data-wait="2400">No sé cuánto de mí</span>\n<span class="line" data-wait="4200">has visto ya.</span>\n</p>\n<p class="stanza">\n<span class="line ending" data-wait="4200">Y no bajo los ojos.</span>\n</p>''',
    '''<p class="stanza">\n<span class="line" data-wait="2400">Tus párpados se entornan.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Algo mío</span>\n<span class="line" data-wait="4200">queda a la vista.</span>\n</p>\n<p class="stanza">\n<span class="line ending" data-wait="4200">Y no bajo los ojos.</span>\n</p>''',
)

# EN TUS LABIOS · versión canónica actual.
replace_exact(
    "sonrisa/index.html",
    '''<article class="poem" aria-label="En tus labios">\n<p class="stanza">\n<span class="line" data-wait="2400">Tu sonrisa comienza en las comisuras:</span>\n<span class="line" data-wait="2400">un leve movimiento</span>\n<span class="line" data-wait="2400">y ya te estoy mirando</span>\n<span class="line" data-wait="4200">más allá de toda prudencia.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">El gesto se extiende por tu rostro.</span>\n<span class="line" data-wait="2400">Yo también sonrío.</span>\n<span class="line" data-wait="4200">Todavía no has dicho nada.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Cuando voy a decirte</span>\n<span class="line" data-wait="4800">lo hermosa que eres…</span>\n<span class="line" data-wait="2400">vuelves a sonreír</span>\n<span class="line" data-wait="2400">y me quedo en tus labios,</span>\n<span class="line ending" data-wait="4200">sin llegar a las palabras.</span>\n</p>''',
    '''<article class="poem" aria-label="En tus labios">\n<p class="stanza">\n<span class="line" data-wait="3000">Iba a decirte algo.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Tu sonrisa empieza en las comisuras:</span>\n<span class="line" data-wait="2400">apenas un movimiento</span>\n<span class="line" data-wait="2400">y ya te estoy mirando</span>\n<span class="line" data-wait="4200">más allá de la prudencia.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Yo también sonrío.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="4200">Todavía no has dicho nada.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="3000">Busco la frase.</span>\n<span class="line" data-wait="3000">Vuelves a sonreír.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Me quedo en tus labios,</span>\n<span class="line ending" data-wait="4200">sin llegar a las palabras.</span>\n</p>''',
)

# TU CABELLO · versión canónica actual.
replace_exact(
    "cabello/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="2400">Sigues hablando.</span>\n<span class="line" data-wait="2400">El mechón vuelve a su sitio.</span>\n<span class="line" data-wait="2400">Yo tardo</span>\n<span class="line ending" data-wait="4200">un poco más.</span>\n</p>''',
    '''<p class="stanza">\n<span class="line" data-wait="2400">Lo sueltas.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">El mechón vuelve a su sitio.</span>\n</p>\n<p class="stanza">\n<span class="line ending" data-wait="4200">Sigues hablando.</span>\n</p>''',
)
replace_exact(
    "cabello/index.html",
    'la luz resbala por él<br>\nsin llegar a aclararlo.',
    'la luz resbala por él<br>\nsin aclararlo.',
)
replace_exact(
    "cabello/index.html",
    'Tú regresas a tus palabras;<br>\npero un mechón prolonga',
    'Tú vuelves a tus palabras,<br>\npero un mechón prolonga',
)

# TU PIEL · nueva contención final canónica y depuración verbal.
replace_exact(
    "piel/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="2400">Quisiera conocer esa tersura</span>\n<span class="line" data-wait="2400">con algo más que los ojos:</span>\n<span class="line" data-wait="2400">posar despacio la mano,</span>\n<span class="line" data-wait="2400">dejarla allí</span>\n<span class="line" data-wait="2400">y sentir cómo tu piel</span>\n<span class="line ending" data-wait="4200">va entibiando la mía.</span>\n</p>''',
    '''<p class="stanza">\n<span class="line" data-wait="4200">Mi mano sigue quieta.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Entre tu piel y la mía</span>\n<span class="line" data-wait="4200">queda apenas el aire.</span>\n</p>\n<p class="stanza">\n<span class="line ending" data-wait="5200">No lo atravieso.</span>\n</p>''',
)
replace_exact(
    "piel/index.html",
    '<span class="line" data-wait="2400">y alcanza la mano</span>',
    '<span class="line" data-wait="2400">y llega hasta la mano</span>',
)
replace_exact(
    "piel/index.html",
    '<span class="line" data-wait="4200">se desliza por tus nudillos.</span>',
    '<span class="line" data-wait="4200">resbala por tus nudillos.</span>',
)
replace_exact(
    "piel/index.html",
    '<p class="subtitle">Va entibiando la mía.</p>',
    '<p class="subtitle">No lo atravieso.</p>',
)

# EPÍLOGO · depuración canónica actual.
replace_exact(
    "epilogo/index.html",
    'Tarareas algo en portugués<br>\nmientras el aceite se calienta.<br>',
    'Tarareas algo en portugués<br>\nmientras se calienta el aceite.<br>',
)
replace_exact(
    "epilogo/index.html",
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5500">Se me había olvidado el puchero.<br>\nEstaba buscando una palabra<br>\npara el modo en que sonríes.</p>''',
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5500">Se me olvidó el puchero.<br>\nBuscaba una palabra<br>\npara el modo en que sonríes.</p>''',
)
replace_exact(
    "epilogo/index.html",
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Tú pones dos platos.<br>\nYo llevo el puchero a la mesa.<br>\nApartas los papeles<br>\npara que quepa.</p>''',
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Tú pones dos platos.<br>\nYo llevo el puchero a la mesa.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="4200">Apartas los papeles<br>\npara que quepa.</p>''',
)

# PRÓLOGO · texto canónico.
replace_exact(
    "estrella/index.html",
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Siguiendo una tarjeta,<br>\nencontré un lugar.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="3200">Iba a recogerla.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Antes de irme,<br>\nya quería volver.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Siguiendo a un ángel,<br>\nllegué hasta ti.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6500">Cuando era <em>yang</em>,<br>\nbuscaba el <em>yin</em>.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Ahora que soy <em>yin</em>,<br>\npuedo quedarme.</p>\n<p class="phrase hidden-phrase ending final-stanza" aria-hidden="true" data-wait="7000">Me basta con mirarte.</p>''',
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5200">Siguiendo una tarjeta,<br>\nencontré un lugar.<br>\nAl detenerme allí,<br>\nempezó a ser mi hogar.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5200">Siguiendo a un ángel,<br>\nllegué hasta ti.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5200">Cuando era <em>yang</em>,<br>\nbuscaba el <em>yin</em>.</p>\n<p class="phrase hidden-phrase ending final-stanza" aria-hidden="true" data-wait="6200">Ahora que soy <em>yin</em>,<br>\nme basta con mirarte.</p>''',
)

# PRÓLOGO · ciclo celeste aproximadamente a la mitad de duración.
p = Path("estrella/index.html")
text = p.read_text(encoding="utf-8")
replacements = {
    "12.8s": "6.4s",
    "9.5s": "4.75s",
    "8.7s": "4.35s",
    "ease .8s": "ease .4s",
    "transform 14s ease": "transform 7s ease",
    "box-shadow 20s ease": "box-shadow 10s ease",
    "setTimeout(completeMoon,20100)": "setTimeout(completeMoon,10050)",
    "function beginCelestialJourney(delay=7200)": "function beginCelestialJourney(delay=3600)",
}
for old, new in replacements.items():
    if old not in text:
        raise RuntimeError(f"No se encontró temporización esperada en estrella/index.html: {old}")
    text = text.replace(old, new)
p.write_text(text, encoding="utf-8")

# ANA KLAUDYA · CENICIENTO no forma parte de la obra.
# No aparece como botón de navegación ni como sección interna de ANA.
# Sin embargo, el interrogante final se conserva como enlace directo a la obra autónoma CENICIENTO.
replace_exact(
    "elegia-breve/index.html",
    '    <button class="entry-button" id="anaCeniciento" type="button">Ceniciento</button>\n',
    "",
)
replace_exact(
    "elegia-breve/index.html",
    '''      document.getElementById('cenicientoLink').addEventListener('click',event=>{\n        if(event.button>0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;\n        event.preventDefault();openPoem('ceniciento');\n      });\n''',
    "",
)
replace_exact(
    "elegia-breve/index.html",
    "      document.getElementById('anaCeniciento').addEventListener('click',()=>document.getElementById('cenicientoLink').click());\n",
    "",
)
replace_exact(
    "elegia-breve/index.html",
    "        if(['epilogo','estrella','cabello','piel','ojos','sonrisa','ceniciento'].includes(piece))openPoem(piece);",
    "        if(['epilogo','estrella','cabello','piel','ojos','sonrisa'].includes(piece))openPoem(piece);",
)

# CIERRE DE ANA · al aparecer el retrato y el interrogante, mostrar toda la navegación.
replace_exact(
    "elegia-breve/index.html",
    "          body.classList.add('portrait-revealed');\n          clearTimeout(portraitRevealTimer);",
    "          body.classList.add('portrait-revealed');\n          anaNavigation.hidden=false;body.classList.add('ana-navigation-ready');\n          clearTimeout(portraitRevealTimer);",
)
replace_exact(
    "elegia-breve/index.html",
    "        body.classList.remove('portrait-revealed');\n        portraitFinale.setAttribute('aria-hidden','true');",
    "        body.classList.remove('portrait-revealed');\n        anaNavigation.hidden=true;body.classList.remove('ana-navigation-ready');\n        portraitFinale.setAttribute('aria-hidden','true');",
)

# CIERRE DE ANA · evitar duplicar el botón de Epílogo cuando ya está visible en la navegación final.
replace_exact(
    "elegia-breve/index.html",
    '    <button class="entry-button portrait-epilogue flambe-button" id="portraitEpilogue" type="button">Epílogo · A fuego lento →</button>\n',
    "",
)
replace_exact(
    "elegia-breve/index.html",
    "      for(const id of ['anaEpilogue','readEpilogue','portraitEpilogue'])document.getElementById(id).addEventListener('click',openEpilogue);",
    "      for(const id of ['anaEpilogue','readEpilogue'])document.getElementById(id).addEventListener('click',openEpilogue);",
)

print("ANA KLAUDYA: nueva depuración canónica aplicada; interrogante final enlazado a CENICIENTO autónomo")
