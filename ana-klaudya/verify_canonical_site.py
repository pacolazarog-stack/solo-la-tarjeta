"""Check published Spanish verse fidelity and the aligned translation shape."""
from html.parser import HTMLParser
from pathlib import Path
import importlib.util
import re

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("canonical", ROOT / "ana-klaudya/apply_canonical_site.py")
canonical = importlib.util.module_from_spec(spec)
spec.loader.exec_module(canonical)

class Verses(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.parts = []
        self.lines = []
        self.heat = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get("class", "").split()
        if self.depth:
            if tag == "br":
                self.parts.append("\n")
            else:
                self.depth += 1
        elif ("line" in classes or "phrase" in classes) and "signature" not in classes:
            self.depth = 1
            self.parts = []
            self.heat = attrs.get("id") == "finalHeat"

    def handle_endtag(self, tag):
        if not self.depth:
            return
        self.depth -= 1
        if self.depth == 0:
            text = "".join(self.parts)
            if self.heat:
                self.lines.extend(text.split())
            else:
                self.lines.extend(" ".join(line.split()) for line in text.split("\n") if line.strip())

    def handle_data(self, data):
        if self.depth:
            self.parts.append(data)

def verify():
    poems = canonical.read_poems()
    counts = []
    for title, slug in canonical.ROUTES.items():
        parser = Verses()
        parser.feed((ROOT / slug / "index.html").read_text(encoding="utf-8"))
        expected = [line for stanza in poems[title] for line in stanza]
        assert parser.lines == expected, (slug, parser.lines, expected)
        counts.append(len(expected))
        print(f"PASS {title}: {len(expected)} versos")
    assert counts == [13, 37, 10, 11, 17, 11, 29], counts
    assert sum(counts) == 128
    english = (ROOT / "ana-klaudya/TEXTO_CANONICO_EN.md").read_text(encoding="utf-8")
    english_counts = []
    for section in re.split(r"^## .+\n", english, flags=re.M)[1:]:
        lines = [line for line in section.splitlines() if line.strip() and line.strip() not in ("---", "*flag*")]
        english_counts.append(len(lines))
    assert english_counts == counts, (english_counts, counts)
    print("PASS 128 Spanish verses; seven aligned English sections")

if __name__ == "__main__":
    verify()

