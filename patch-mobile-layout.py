from pathlib import Path

VERSIONS_OLD = (
    "20261010-29",
    "20261011-30",
    "20261011-31",
    "20261011-32",
    "20261011-33",
)
VERSION_NEW = "20261011-34"

p = Path("narrative-universe.js")
s = p.read_text(encoding="utf-8")

# The Pages workflow restores the stable universe first, whose canonical version is 20261010-29.
s = s.replace("const VERSION='20261010-29';", f"const VERSION='{VERSION_NEW}';")

# Canonical side placement: card right / reading counter left.
s = s.replace(
    ".ou-card{position:fixed;z-index:74;left:max(26px,4.2vw);",
    ".ou-card{position:fixed;z-index:74;right:max(26px,4.2vw);left:auto;",
)
s = s.replace(
    ".ou-reading-checklist{position:fixed;z-index:90;right:max(10px,env(safe-area-inset-right));",
    ".ou-reading-checklist{position:fixed;z-index:90;left:max(10px,env(safe-area-inset-left));right:auto;",
)
s = s.replace(
    ".ou-reading-checklist ul{position:absolute;right:0;",
    ".ou-reading-checklist ul{position:absolute;left:0;right:auto;",
)
s = s.replace(
    ".ou-card{left:max(16px,env(safe-area-inset-left));bottom:calc(env(safe-area-inset-bottom,0px) + 88px);width:112px;height:70px}",
    ".ou-card{right:max(16px,env(safe-area-inset-right));left:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 88px);width:112px;height:70px}",
)

# Permanent visual canon: no control surface may become an opaque block over text or imagery.
global_translucency = """  /* ORAS visual canon: permanent translucency for card and control surfaces */
  .ou-card{
    background:rgba(255,255,255,.025)!important;
    opacity:.52!important;
    box-shadow:0 3px 12px rgba(0,0,0,.12)!important;
    backdrop-filter:none!important;
    -webkit-backdrop-filter:none!important;
  }
  .ou-card::before{opacity:.68!important}.ou-card::after{opacity:.58!important}
  .ou-reading-checklist summary,
  .ou-reading-checklist ul{
    background:rgba(12,12,12,.18)!important;
    border-color:rgba(255,255,255,.18)!important;
    box-shadow:0 2px 10px rgba(0,0,0,.10)!important;
    backdrop-filter:blur(3px)!important;
    -webkit-backdrop-filter:blur(3px)!important;
  }
  button,
  [role=\"button\"]{
    background:rgba(12,12,12,.14)!important;
    border-color:rgba(255,255,255,.18)!important;
    box-shadow:0 2px 9px rgba(0,0,0,.10)!important;
    backdrop-filter:blur(3px)!important;
    -webkit-backdrop-filter:blur(3px)!important;
  }
"""
marker = "  @media(hover:none) and (pointer:coarse){"
if global_translucency not in s:
    if marker not in s:
        raise RuntimeError("No se encontró el anclaje CSS del universo narrativo")
    s = s.replace(marker, global_translucency + marker, 1)

portrait = """  @media(max-width:700px) and (orientation:portrait){
    .ou-card{right:max(10px,env(safe-area-inset-right))!important;left:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;width:94px!important;height:58px!important;transform:rotate(4deg)!important;opacity:.46!important;background:rgba(255,255,255,.018)!important;box-shadow:0 3px 10px rgba(0,0,0,.08)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    .ou-card::before{left:13px!important;top:12px!important;width:23px!important;height:17px!important;opacity:.62!important}.ou-card::after{left:13px!important;right:13px!important;bottom:11px!important;opacity:.55!important}
    .ou-reading-checklist{left:max(10px,env(safe-area-inset-left))!important;right:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important}
    .ou-reading-checklist summary{margin-left:0!important;padding:5px 8px!important;background:rgba(12,12,12,.14)!important}
    .ou-reading-checklist ul{left:0!important;right:auto!important;background:rgba(12,12,12,.14)!important}
  }
"""
if portrait not in s:
    if marker not in s:
        raise RuntimeError("No se encontró el anclaje CSS del universo narrativo")
    s = s.replace(marker, portrait + marker, 1)

p.write_text(s, encoding="utf-8")

# Update the shared module URL on every public reading surface so no browser keeps the opaque controls cached.
pages = [
    Path("index.html"),
    Path("elegia-breve/index.html"),
    Path("ojos/index.html"),
    Path("sonrisa/index.html"),
    Path("estrella/index.html"),
    Path("epilogo/index.html"),
    Path("ceniciento/index.html"),
]

for q in pages:
    if not q.exists():
        continue
    t = q.read_text(encoding="utf-8")
    for old in VERSIONS_OLD:
        t = t.replace(f"narrative-universe.js?v={old}", f"narrative-universe.js?v={VERSION_NEW}")
        t = t.replace(f"../narrative-universe.js?v={old}", f"../narrative-universe.js?v={VERSION_NEW}")

    if q == Path("elegia-breve/index.html"):
        nav_global = """/* ORAS visual canon: every ANA KLAUDYA button bar remains translucent */
.journey-nav{background:rgba(12,12,12,.10)!important;border-color:rgba(255,250,241,.20)!important;box-shadow:0 2px 10px rgba(0,0,0,.08)!important;backdrop-filter:blur(3px)!important;-webkit-backdrop-filter:blur(3px)!important}
.journey-nav button{background:transparent!important;box-shadow:none!important}
"""
        nav_anchor = ".journey-nav button[hidden]{display:none}\n"
        if nav_global not in t:
            if nav_anchor not in t:
                raise RuntimeError("No se encontró el anclaje de journey-nav")
            t = t.replace(nav_anchor, nav_anchor + nav_global, 1)

        nav_portrait = """@media(max-width:700px) and (orientation:portrait){
  .journey-nav{left:112px;right:112px;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:none;width:auto;max-width:none;height:48px;padding:0;border:0;border-top:1px solid rgba(255,250,241,.34);border-radius:0;background:rgba(12,12,12,.06)!important;box-shadow:none;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important}
  .journey-nav button{min-width:0;min-height:48px;padding:7px 3px;border:0;border-radius:0;background:transparent!important;box-shadow:none!important;font-size:12px;text-shadow:0 1px 4px rgba(0,0,0,.9)}
  .journey-nav button+button{border-left:1px solid rgba(255,250,241,.22)}
}
"""
        if nav_portrait not in t:
            if nav_anchor not in t:
                raise RuntimeError("No se encontró el anclaje de journey-nav")
            t = t.replace(nav_anchor, nav_anchor + nav_portrait, 1)

    q.write_text(t, encoding="utf-8")
