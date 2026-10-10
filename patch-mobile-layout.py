from pathlib import Path

VERSIONS_OLD = (
    "20261010-29",
    "20261011-30",
    "20261011-31",
    "20261011-32",
    "20261011-33",
    "20261011-34",
    "20261011-35",
    "20261011-36",
)
VERSION_NEW = "20261011-37"

p = Path("narrative-universe.js")
s = p.read_text(encoding="utf-8")

# Pages restores the stable universe before this patch.
s = s.replace("const VERSION='20261010-29';", f"const VERSION='{VERSION_NEW}';")

# Canonical placement: card right / reading counter left.
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

# Shared module controls: permanently translucent.
global_translucency = """  /* ORAS visual canon: permanent translucency */
  .ou-card{background:rgba(255,255,255,.025)!important;opacity:.52!important;box-shadow:0 3px 12px rgba(0,0,0,.12)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
  .ou-card::before{opacity:.68!important}.ou-card::after{opacity:.58!important}
  .ou-reading-checklist summary,.ou-reading-checklist ul{background:rgba(12,12,12,.14)!important;border-color:rgba(255,255,255,.16)!important;box-shadow:0 2px 10px rgba(0,0,0,.08)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important}
  button,[role=\"button\"]{background:rgba(12,12,12,.10)!important;border-color:rgba(255,255,255,.16)!important;box-shadow:0 2px 8px rgba(0,0,0,.08)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important}
"""
marker = "  @media(hover:none) and (pointer:coarse){"
if global_translucency not in s:
    if marker not in s:
        raise RuntimeError("No se encontró el anclaje CSS del universo narrativo")
    s = s.replace(marker, global_translucency + marker, 1)

portrait = """  @media(max-width:700px) and (orientation:portrait){
    .ou-card{right:max(10px,env(safe-area-inset-right))!important;left:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;width:94px!important;height:58px!important;transform:rotate(4deg)!important;opacity:.46!important;background:rgba(255,255,255,.018)!important;box-shadow:0 3px 10px rgba(0,0,0,.06)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    .ou-card::before{left:13px!important;top:12px!important;width:23px!important;height:17px!important;opacity:.62!important}.ou-card::after{left:13px!important;right:13px!important;bottom:11px!important;opacity:.55!important}
    .ou-reading-checklist{left:max(10px,env(safe-area-inset-left))!important;right:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important}
    .ou-reading-checklist summary{margin-left:0!important;padding:5px 8px!important;background:rgba(12,12,12,.10)!important}
    .ou-reading-checklist ul{left:0!important;right:auto!important;background:rgba(12,12,12,.10)!important}
  }
"""
if portrait not in s:
    if marker not in s:
        raise RuntimeError("No se encontró el anclaje CSS del universo narrativo")
    s = s.replace(marker, portrait + marker, 1)

# SOLO LA TARJETA: its end navigation must always become available when the text is finished.
old_endnav = """function showSoloEndNav(){
  if(!state.cenicientoComplete||!state.cenicientoUnlocked)return;
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Continuar desde SOLO LA TARJETA');
  const ana=document.createElement('a');
  ana.href=rootPath+'elegia-breve/';
  ana.textContent='Volver a ANA KLAUDYA';
  nav.append(ana);
  if(state.cenicientoComplete){
    const ceniciento=document.createElement('a');
    ceniciento.href=rootPath+'ceniciento/?v='+VERSION;
    ceniciento.textContent='CENICIENTO';
    nav.append(ceniciento);
  }
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""
new_endnav = """function showSoloEndNav(){
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Navegación al terminar SOLO LA TARJETA');

  const forward=document.createElement('button');
  forward.type='button';
  forward.textContent='Adelante';
  forward.setAttribute('aria-label','Ir adelante');
  forward.addEventListener('click',()=>history.forward());

  const home=document.createElement('a');
  home.href=rootPath+'elegia-breve/?v='+VERSION;
  home.target='_top';
  home.textContent='Inicio';
  home.setAttribute('aria-label','Volver al inicio de ANA KLAUDYA');

  nav.append(forward,home);
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""
if old_endnav not in s:
    raise RuntimeError("No se encontró showSoloEndNav canónico")
s = s.replace(old_endnav, new_endnav, 1)
s = s.replace("  if(state.cenicientoComplete&&state.cenicientoUnlocked)showSoloEndNav();\n", "", 1)

# End-navigation buttons should visually match its links.
s = s.replace(
    ".ou-solo-endnav a,.ou-ceniciento-endnav a{",
    ".ou-solo-endnav a,.ou-solo-endnav button,.ou-ceniciento-endnav a{",
)
s = s.replace(
    ".ou-solo-endnav a:hover,.ou-solo-endnav a:focus-visible,.ou-ceniciento-endnav a:hover,.ou-ceniciento-endnav a:focus-visible{",
    ".ou-solo-endnav a:hover,.ou-solo-endnav a:focus-visible,.ou-solo-endnav button:hover,.ou-solo-endnav button:focus-visible,.ou-ceniciento-endnav a:hover,.ou-ceniciento-endnav a:focus-visible{",
)
s = s.replace(
    ".ou-solo-endnav a:active,.ou-ceniciento-endnav a:active{",
    ".ou-solo-endnav a:active,.ou-solo-endnav button:active,.ou-ceniciento-endnav a:active{",
)
s = s.replace(
    ".ou-solo-endnav a,.ou-ceniciento-endnav a{padding:11px 13px}",
    ".ou-solo-endnav a,.ou-solo-endnav button,.ou-ceniciento-endnav a{padding:11px 13px}",
)

p.write_text(s, encoding="utf-8")

# This style is injected AFTER each page's local CSS, so local opaque definitions cannot win.
UNIVERSAL_STYLE = """<style id="oras-global-translucency">
/* ORAS: todas las botoneras y tarjetas deben dejar ver imagen y texto de fondo */
button,
[role="button"],
input[type="button"],
input[type="submit"],
summary{
  background:rgba(12,12,12,.10)!important;
  background-color:rgba(12,12,12,.10)!important;
  border-color:rgba(255,255,255,.16)!important;
  box-shadow:0 2px 8px rgba(0,0,0,.08)!important;
  backdrop-filter:blur(2px)!important;
  -webkit-backdrop-filter:blur(2px)!important;
}
[class*="controls"],
[class*="control-bar"],
[class*="toolbar"],
[class*="button-bar"],
[class*="buttonbar"],
[class*="buttons"],
[class*="actions"],
[class*="botonera"],
[class*="journey-nav"],
[class*="audio-panel"],
[class*="audio-controls"]{
  background:rgba(12,12,12,.075)!important;
  background-color:rgba(12,12,12,.075)!important;
  border-color:rgba(255,255,255,.14)!important;
  box-shadow:0 2px 10px rgba(0,0,0,.06)!important;
  backdrop-filter:blur(2px)!important;
  -webkit-backdrop-filter:blur(2px)!important;
}
[class~="card"],
[class*="-card"],
[class*="card-"],
[class*="tarjeta"]{
  background-color:rgba(12,12,12,.055)!important;
  box-shadow:0 2px 10px rgba(0,0,0,.06)!important;
  backdrop-filter:blur(1.5px)!important;
  -webkit-backdrop-filter:blur(1.5px)!important;
}
.ou-card{
  background:rgba(255,255,255,.018)!important;
  opacity:.50!important;
  box-shadow:0 3px 10px rgba(0,0,0,.06)!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
.ou-reading-checklist summary,
.ou-reading-checklist ul{
  background:rgba(12,12,12,.10)!important;
  border-color:rgba(255,255,255,.15)!important;
  box-shadow:0 2px 8px rgba(0,0,0,.06)!important;
}
.ou-solo-endnav button,
.ou-solo-endnav a{
  background:rgba(12,12,12,.10)!important;
  border-color:rgba(255,255,255,.18)!important;
  box-shadow:none!important;
  backdrop-filter:blur(2px)!important;
  -webkit-backdrop-filter:blur(2px)!important;
}
</style>"""

# Apply the canon to EVERY HTML surface in the repository, present and future.
pages = sorted(Path(".").rglob("*.html"))
for q in pages:
    if ".git" in q.parts:
        continue
    t = q.read_text(encoding="utf-8")

    # Bust caches for every shared-module reference.
    for old in VERSIONS_OLD:
        t = t.replace(f"narrative-universe.js?v={old}", f"narrative-universe.js?v={VERSION_NEW}")

    # Universal override comes after page-local styles.
    if 'id="oras-global-translucency"' not in t and "</head>" in t:
        t = t.replace("</head>", UNIVERSAL_STYLE + "\n</head>", 1)

    # ANA mobile vertical: linear transparent bar between counter and card.
    if q == Path("elegia-breve/index.html"):
        nav_portrait = """<style id="oras-ana-mobile-nav">
@media(max-width:700px) and (orientation:portrait){
  .journey-nav{left:112px!important;right:112px!important;bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;transform:none!important;width:auto!important;max-width:none!important;height:48px!important;padding:0!important;border:0!important;border-top:1px solid rgba(255,250,241,.28)!important;border-radius:0!important;background:rgba(12,12,12,.045)!important;box-shadow:none!important;backdrop-filter:blur(1.5px)!important;-webkit-backdrop-filter:blur(1.5px)!important}
  .journey-nav button{min-width:0!important;min-height:48px!important;padding:7px 3px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;font-size:12px!important;text-shadow:0 1px 4px rgba(0,0,0,.9)!important}
  .journey-nav button+button{border-left:1px solid rgba(255,250,241,.18)!important}
}
</style>"""
        if 'id="oras-ana-mobile-nav"' not in t and "</head>" in t:
            t = t.replace("</head>", nav_portrait + "\n</head>", 1)

    q.write_text(t, encoding="utf-8")