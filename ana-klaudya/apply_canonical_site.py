"""Publish the current Spanish canonical poems into the interactive site.

Run from the repository root. This script changes poem text only: screen
navigation, music, voice recordings and lunar animation retain their timing.
"""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parent.parent
CANON = ROOT / "ana-klaudya/TEXTO_CANONICO_ES.md"
ROUTES = {
    "Prólogo · Siguiendo una tarjeta": "estrella",
    "Elegía breve para Ana Klaudya": "elegia-breve",
    "En tus ojos": "ojos",
    "En tus labios": "sonrisa",
    "Tu cabello": "cabello",
    "Tu piel": "piel",
    "Epílogo · A fuego lento": "epilogo",
}

def read_poems():
    source = CANON.read_text(encoding="utf-8")
    poems = {}
    for match in re.finditer(r"^## (.+)\n([\s\S]*?)(?=^## |\Z)", source, re.M):
        title, body = match.groups()
        body = re.sub(r"\n---\s*$", "", body.strip())
        body = re.sub(r"\n\s*\*flag\*\s*$", "", body)
        poems[title] = [
            [line.strip().removesuffix("\\\\").rstrip() for line in stanza.splitlines()]
            for stanza in re.split(r"\n\s*\n", body.strip())
            if stanza.strip()
        ]
    if list(poems) != list(ROUTES):
        raise ValueError("Expected the seven canonical sections, in order")
    return poems

def phrase_html(stanzas, prologue=False):
    groups = stanzas
    if prologue:
        # Complete verse sentences, with separate space for the home image.
        first = stanzas[0]
        if len(first) != 7:
            raise ValueError("The prologue opening must have seven canonical verses")
        last = stanzas[-1]
        if len(last) != 2:
            raise ValueError("The prologue ending must have two canonical verses")
        middle = stanzas[1:-1]
        groups = [first[:2], first[2:], *middle, last[:1], last[1:]]
        waits = [6200, 12000] + [
            4000 if len(stanza) == 1 else
            6500 if stanza[0].startswith("Cuando era ") else 6200
            for stanza in middle
        ] + [3200, 7000]
    blocks = []
    for index, lines in enumerate(groups):
        final = index == len(groups) - 1
        classes = "phrase hidden-phrase" + (" ending final-stanza" if prologue and final else "")
        if prologue:
            delay = waits[index]
            text = "<br>\n".join(escape(line).replace("yang", "<em>yang</em>").replace("yin", "<em>yin</em>") for line in lines)
        else:
            # Retain the epilogue's existing individual phrase waits below.
            delay = 4200
            text = "<br>\n".join(escape(line) for line in lines)
        blocks.append(f'<p class="{classes}" aria-hidden="true" data-wait="{delay}">{text}</p>')
    return blocks

def line_html(stanzas):
    blocks = []
    for si, lines in enumerate(stanzas):
        spans = []
        for li, line in enumerate(lines):
            ending = si == len(stanzas) - 1 and li == len(lines) - 1
            classes = "line ending" if ending else "line"
            wait = 4200 if li == len(lines) - 1 else 2400
            if len(lines) == 1:
                wait = 3000
            spans.append(f'<span class="{classes}" data-wait="{wait}">{escape(line)}</span>')
        blocks.append('<p class="stanza">\n' + "\n".join(spans) + "\n</p>")
    return "\n".join(blocks)

def apply():
    poems = read_poems()
    for title, slug in ROUTES.items():
        path = ROOT / slug / "index.html"
        source = path.read_text(encoding="utf-8")
        if slug == "elegia-breve":
            # The unaltered Elegy is laid out with scene anchors and voice cues.
            continue
        match = re.search(r'(<article class="poem"[^>]*>)([\s\S]*?)(</article>)', source)
        if not match:
            raise ValueError(f"Missing poem article in {path}")
        if slug == "estrella":
            content = "\n" + "\n".join(phrase_html(poems[title], prologue=True)) + "\n"
        elif slug == "epilogo":
            # Its text is already canonical; preserve comic timings and the final signature.
            continue
        else:
            content = "\n" + line_html(poems[title]) + "\n"
        result = source[:match.start(2)] + content + source[match.end(2):]
        path.write_text(result, encoding="utf-8")
    print("ANA KLAUDYA: current Spanish poems applied; audiovisual settings preserved")

if __name__ == "__main__":
    apply()

