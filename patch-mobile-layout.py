from pathlib import Path

VERSION_OLD = "20261010-29"
VERSION_MID = "20261011-30"
VERSION_NEW = "20261011-32"

p = Path("narrative-universe.js")
s = p.read_text(encoding="utf-8")

s = s.replace("const VERSION='20261010-29';", "const VERSION='20261011-32';")

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

portrait = """  @media(max-width:700px) and (orientation:portrait){
    .ou-card{left:max(10px,env(safe-area-inset-left))!important;right:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;width:94px!important;height:58px!important;transform:rotate(4deg)!important}
    .ou-card::before{left:13px!important;top:12px!important;width:23px!important;height:17px!important}.ou-card::after{left:13px!important;right:13px!important;bottom:11px!important}
    .ou-reading-checklist{right:max(10px,env(safe-area-inset-right))!important;left:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important}
    .ou-reading-checklist summary{margin-left:0!important;padding:5px 8px!important;border-color:rgba(255,255,255,.20)!important;background:rgba(12,12,12,.38)!important;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
    .ou-reading-checklist ul{right:0!important;left:auto!important}
  }
"""
marker = "  @media(hover:none) and (pointer:coarse){"
if portrait not in s:
    if marker not in s:
        raise RuntimeError("No se encontró el anclaje CSS del universo narrativo")
    s = s.replace(marker, portrait + marker, 1)

p.write_text(s, encoding="utf-8")

q = Path("elegia-breve/index.html")
t = q.read_text(encoding="utf-8")
for old in (VERSION_OLD, VERSION_MID, "20261011-31"):
    t = t.replace(f"narrative-universe.js?v={old}", f"narrative-universe.js?v={VERSION_NEW}")

nav_portrait = """@media(max-width:700px) and (orientation:portrait){
  .journey-nav{left:112px;right:112px;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:none;width:auto;max-width:none;height:48px;padding:0;border:0;border-top:1px solid rgba(255,250,241,.46);border-radius:0;background:transparent;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}
  .journey-nav button{min-width:0;min-height:48px;padding:7px 3px;border:0;border-radius:0;background:transparent;box-shadow:none;font-size:12px;text-shadow:0 1px 4px rgba(0,0,0,.9)}
  .journey-nav button+button{border-left:1px solid rgba(255,250,241,.26)}
}
"""
nav_anchor = ".journey-nav button[hidden]{display:none}\n"
if nav_portrait not in t:
    if nav_anchor not in t:
        raise RuntimeError("No se encontró el anclaje de journey-nav")
    t = t.replace(nav_anchor, nav_anchor + nav_portrait, 1)

q.write_text(t, encoding="utf-8")
