from pathlib import Path


def replace_exact(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if old not in text:
        raise RuntimeError(f"No se encontró el bloque esperado en {path}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


# EN TUS OJOS · eliminar el verso de una versión anterior.
replace_exact(
    "ojos/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="3000">Te miro.</span>\n</p>\n''',
    "",
)

# EN TUS LABIOS · versión canónica completa.
replace_exact(
    "sonrisa/index.html",
    '''<article class="poem" aria-label="En tus labios">\n<p class="stanza">\n<span class="line" data-wait="2400">Tu sonrisa comienza en las comisuras:</span>\n''',
    '''<article class="poem" aria-label="En tus labios">\n<p class="stanza">\n<span class="line" data-wait="3000">Iba a decirte algo.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Tu sonrisa comienza en las comisuras:</span>\n''',
)
replace_exact(
    "sonrisa/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="2400">Cuando voy a decirte</span>\n<span class="line" data-wait="4800">lo hermosa que eres…</span>\n<span class="line" data-wait="2400">vuelves a sonreír</span>\n<span class="line" data-wait="2400">y me quedo en tus labios,</span>\n<span class="line ending" data-wait="4200">sin llegar a las palabras.</span>\n</p>''',
    '''<p class="stanza">\n<span class="line" data-wait="3000">Busco la frase.</span>\n<span class="line" data-wait="2400">Vuelves a sonreír</span>\n<span class="line" data-wait="2400">y me quedo en tus labios,</span>\n<span class="line ending" data-wait="4200">sin llegar a las palabras.</span>\n</p>''',
)

# TU CABELLO · cierre canónico.
replace_exact(
    "cabello/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="2400">Sigues hablando.</span>\n<span class="line" data-wait="2400">El mechón vuelve a su sitio.</span>\n<span class="line" data-wait="2400">Yo tardo</span>\n<span class="line ending" data-wait="4200">un poco más.</span>\n</p>''',
    '''<p class="stanza">\n<span class="line" data-wait="2400">Lo sueltas.</span>\n<span class="line" data-wait="2400">El mechón vuelve a su sitio.</span>\n<span class="line ending" data-wait="4200">Sigues hablando.</span>\n</p>''',
)

# TU PIEL · incorporar el verso de contención antes del deseo táctil.
replace_exact(
    "piel/index.html",
    '''<p class="stanza">\n<span class="line" data-wait="2400">Quisiera conocer esa tersura</span>''',
    '''<p class="stanza">\n<span class="line ending" data-wait="4200">Mi mano sigue quieta.</span>\n</p>\n<p class="stanza">\n<span class="line" data-wait="2400">Quisiera conocer esa tersura</span>''',
)

# PRÓLOGO · texto canónico.
replace_exact(
    "estrella/index.html",
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Siguiendo una tarjeta,<br>\nencontré un lugar.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="3200">Iba a recogerla.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Antes de irme,<br>\nya quería volver.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Siguiendo a un ángel,<br>\nllegué hasta ti.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6500">Cuando era <em>yang</em>,<br>\nbuscaba el <em>yin</em>.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="6200">Ahora que soy <em>yin</em>,<br>\npuedo quedarme.</p>\n<p class="phrase hidden-phrase ending final-stanza" aria-hidden="true" data-wait="7000">Me basta con mirarte.</p>''',
    '''<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5200">Siguiendo una tarjeta,<br>\nencontré un lugar.<br>\nAl detenerme allí,<br>\nempezó a ser mi hogar.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5200">Siguiendo a mi ángel,<br>\nllegué hasta ti.</p>\n<p class="phrase hidden-phrase" aria-hidden="true" data-wait="5200">Cuando era <em>yang</em>,<br>\nbuscaba el <em>yin</em>.</p>\n<p class="phrase hidden-phrase ending final-stanza" aria-hidden="true" data-wait="6200">Ahora que soy <em>yin</em>,<br>\nme basta con mirarte.</p>''',
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

# ANA KLAUDYA · CENICIENTO deja de formar parte de la obra.
# Se conserva CENICIENTO como obra autónoma en el repositorio, pero se elimina
# de la navegación, del cierre interrogativo y de las rutas internas de ANA.
replace_exact(
    "elegia-breve/index.html",
    '    <button class="entry-button" id="anaCeniciento" type="button">Ceniciento</button>\n',
    "",
)
replace_exact(
    "elegia-breve/index.html",
    '        <a id="cenicientoLink" class="portrait-question" href="../ceniciento/" aria-label="Descubrir Ceniciento"><span class="question-beat" aria-hidden="true">?</span></a>',
    '        <span id="anaQuestion" class="portrait-question" aria-hidden="true"><span class="question-beat" aria-hidden="true">?</span></span>',
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

# CIERRE DE ANA · al aparecer la fotografía y el interrogante deben aparecer
# simultáneamente todos los botones de navegación propios de ANA KLAUDYA.
replace_exact(
    "elegia-breve/index.html",
    '''          portraitFinale.setAttribute('aria-hidden','false');\n          body.classList.add('portrait-revealed');\n          clearTimeout(portraitRevealTimer);''',
    '''          portraitFinale.setAttribute('aria-hidden','false');\n          body.classList.add('portrait-revealed');\n          const finalNavigation=document.getElementById('anaNavigation');\n          finalNavigation.hidden=false;\n          body.classList.add('ana-navigation-ready');\n          clearTimeout(portraitRevealTimer);''',
)
replace_exact(
    "elegia-breve/index.html",
    '''        body.classList.remove('portrait-revealed');\n        portraitFinale.setAttribute('aria-hidden','true');\n        listenedRanges=[];listeningStart=null;''',
    '''        body.classList.remove('portrait-revealed');\n        portraitFinale.setAttribute('aria-hidden','true');\n        document.getElementById('anaNavigation').hidden=true;\n        body.classList.remove('ana-navigation-ready');\n        listenedRanges=[];listeningStart=null;''',
)

print("ANA KLAUDYA: canon aplicado; CENICIENTO queda fuera; foto + interrogante muestran toda la navegación")
