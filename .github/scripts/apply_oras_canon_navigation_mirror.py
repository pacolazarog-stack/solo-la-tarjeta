from pathlib import Path
import re


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f"No se encontró patrón: {label}")
    return text.replace(old, new, 1)


# 1) ÍNDICE CANÓNICO: bloquear EXPANSIÓN y CERO hasta mirrorCrossed
p = Path("oras-master-index-r1.js")
t = p.read_text(encoding="utf-8")
t = t.replace("const VERSION='20261014-master-index-10';", "const VERSION='20261014-master-index-11';")
t = replace_once(
    t,
    "  const mirror=bool(u.mirrorReadComplete);\n  const mirrorReady=solo&&cen&&anaComplete;",
    "  const mirror=bool(u.mirrorReadComplete);\n  const mirrorCrossed=u.mirrorCrossed===true;\n  const mirrorReady=solo&&cen&&anaComplete;",
    "estado mirrorCrossed en índice",
)
t = replace_once(
    t,
    "  const action=hasParts\n    ? `<button class=\"oras-mi-card-action\" type=\"button\" data-toggle=\"${id}\" aria-expanded=\"${open}\" aria-label=\"${open?'Cerrar':'Abrir'} ${title}\"><span class=\"chev\">⌄</span></button>`\n    : `<a class=\"oras-mi-card-action\" href=\"${locked?'#':href}\" ${locked?'aria-disabled=\"true\" tabindex=\"-1\"':''} aria-label=\"Abrir ${title}\"><span>›</span></a>`;",
    "  const action=locked\n    ? `<button class=\"oras-mi-card-action\" type=\"button\" disabled aria-label=\"${title}: bloqueado hasta atravesar EL ESPEJO\"><span>⌁</span></button>`\n    : hasParts\n      ? `<button class=\"oras-mi-card-action\" type=\"button\" data-toggle=\"${id}\" aria-expanded=\"${open}\" aria-label=\"${open?'Cerrar':'Abrir'} ${title}\"><span class=\"chev\">⌄</span></button>`\n      : `<a class=\"oras-mi-card-action\" href=\"${href}\" aria-label=\"Abrir ${title}\"><span>›</span></a>`;",
    "acción bloqueada de tarjetas",
)
t = t.replace(
    "${hasParts?`<div class=\"oras-mi-parts\" id=\"parts-${id}\">${parts}</div>`:''}",
    "${hasParts&&!locked?`<div class=\"oras-mi-parts\" id=\"parts-${id}\">${parts}</div>`:''}",
)
old_unread = """    ...INVENTARIO.map(([id])=>!expansionDone(id)&&invHref(id)),
    ...OFICIO.map(([id])=>!expansionDone(id)&&invHref(id)),
    ...CIUDAD.map(([id])=>!expansionDone(id)&&invHref(id)),
    !zeroDone&&invHref('zero')"""
new_unread = """    ...(mirrorCrossed?INVENTARIO.map(([id])=>!expansionDone(id)&&invHref(id)):[]),
    ...(mirrorCrossed?OFICIO.map(([id])=>!expansionDone(id)&&invHref(id)):[]),
    ...(mirrorCrossed?CIUDAD.map(([id])=>!expansionDone(id)&&invHref(id)):[]),
    mirrorCrossed&&!zeroDone&&invHref('zero')"""
t = replace_once(t, old_unread, new_unread, "Continuar no salta el Espejo")
t = t.replace(
    "${sectionHead('III · LA EXPANSIÓN',`${expansionCount}/${INVENTARIO.length+OFICIO.length+CIUDAD.length}`)}",
    "${sectionHead('III · LA EXPANSIÓN',mirrorCrossed?`${expansionCount}/${INVENTARIO.length+OFICIO.length+CIUDAD.length}`:'bloqueada')}",
)
t = t.replace(
    "${card({id:'inventario',mark:'4',title:'El inventario del aire',meta:`${invCount}/${INVENTARIO.length} huellas`,done:invCount===INVENTARIO.length,parts:invParts,open:open.has('inventario')})}",
    "${card({id:'inventario',mark:'4',title:'El inventario del aire',meta:mirrorCrossed?`${invCount}/${INVENTARIO.length} huellas`:'atraviesa EL ESPEJO',done:invCount===INVENTARIO.length,parts:invParts,open:open.has('inventario'),locked:!mirrorCrossed})}",
)
t = t.replace(
    "${card({id:'oficio',mark:'5',title:'El oficio de las sombras',meta:`${oficioCount}/${OFICIO.length} huellas`,done:oficioCount===OFICIO.length,parts:oficioParts,open:open.has('oficio')})}",
    "${card({id:'oficio',mark:'5',title:'El oficio de las sombras',meta:mirrorCrossed?`${oficioCount}/${OFICIO.length} huellas`:'atraviesa EL ESPEJO',done:oficioCount===OFICIO.length,parts:oficioParts,open:open.has('oficio'),locked:!mirrorCrossed})}",
)
t = t.replace(
    "${card({id:'ciudad',mark:'6',title:'La ciudad que aprendió a olvidar',meta:`${ciudadCount}/${CIUDAD.length} huellas`,done:ciudadCount===CIUDAD.length,parts:ciudadParts,open:open.has('ciudad')})}",
    "${card({id:'ciudad',mark:'6',title:'La ciudad que aprendió a olvidar',meta:mirrorCrossed?`${ciudadCount}/${CIUDAD.length} huellas`:'atraviesa EL ESPEJO',done:ciudadCount===CIUDAD.length,parts:ciudadParts,open:open.has('ciudad'),locked:!mirrorCrossed})}",
)
t = t.replace(
    "${sectionHead('IV · EL CERO',zeroDone?'1/1':'0/1')}",
    "${sectionHead('IV · EL CERO',mirrorCrossed?(zeroDone?'1/1':'0/1'):'bloqueado')}",
)
t = t.replace(
    "${card({id:'zero',mark:'0',title:'La Habitación Número Cero',meta:zeroDone?'completa':'pendiente',done:zeroDone,href:invHref('zero')})}",
    "${card({id:'zero',mark:'0',title:'La Habitación Número Cero',meta:mirrorCrossed?(zeroDone?'completa':'pendiente'):'atraviesa EL ESPEJO',done:zeroDone,href:invHref('zero'),locked:!mirrorCrossed})}",
)
p.write_text(t, encoding="utf-8")


# 2) EL ESPEJO: estado persistente + deformación visual progresiva
p = Path("ceniciento/el-espejo.js")
t = p.read_text(encoding="utf-8")
t = re.sub(r"const VERSION='[^']+';", "const VERSION='20261014-espejo-esperpento-1';", t, count=1)
t = replace_once(
    t,
    "if(!mirror)return;\nlet started=false,locked=false,lockedScene=null,finished=false,finalReady=false;",
    """if(!mirror)return;

const deformStyle=document.createElement('style');
deformStyle.id='oras-mirror-deformation-r1';
deformStyle.textContent=`
body.mirror #mirror{--mirror-shift:0px;--mirror-skew:0deg;--mirror-scale:1;--mirror-blur:0px;--mirror-shadow:0px;isolation:isolate;background:#080808!important}
body.mirror #mirror::before{content:\"\";position:fixed;z-index:1;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent 0 48.7%,rgba(242,236,222,.025) 49.45%,rgba(242,236,222,.13) 49.8%,rgba(255,255,255,.025) 50.15%,transparent 51.1% 100%);transform:translateX(var(--mirror-shift));mix-blend-mode:screen;opacity:.72}
body.mirror #mirror::after{content:\"\";position:fixed;z-index:1;inset:-8%;pointer-events:none;background:radial-gradient(58% 42% at 28% 50%,rgba(255,255,255,.035),transparent 68%),radial-gradient(52% 46% at 74% 52%,rgba(255,255,255,.022),transparent 72%),linear-gradient(96deg,transparent 43%,rgba(255,255,255,.018) 49%,rgba(0,0,0,.18) 50.6%,transparent 57%);filter:blur(1.2px);opacity:.8}
body.mirror .mirror-scene{z-index:2;perspective:900px}
body.mirror .mirror-copy{transform:translateX(var(--mirror-shift)) skewX(var(--mirror-skew)) scaleX(var(--mirror-scale));filter:blur(var(--mirror-blur));text-shadow:var(--mirror-shadow) 0 rgba(247,241,232,.16);transition:transform .18s linear,filter .18s linear,text-shadow .18s linear}
body.mirror #mirror[data-phase=\"deformacion\"] .mirror-copy{letter-spacing:.004em}
body.mirror #mirror[data-phase=\"salida\"]::before{opacity:.42}
@media(prefers-reduced-motion:reduce){body.mirror .mirror-copy{transform:none!important;filter:none!important;text-shadow:none!important}body.mirror #mirror::before,body.mirror #mirror::after{opacity:.16!important}}
`;
document.head.appendChild(deformStyle);

let warpRAF=0;
function updateMirrorDeformation(){
  warpRAF=0;
  const max=Math.max(1,mirror.scrollHeight-mirror.clientHeight);
  const p=Math.max(0,Math.min(1,mirror.scrollTop/max));
  const bell=Math.sin(Math.PI*p);
  const wave=Math.sin(p*Math.PI*8.5);
  mirror.style.setProperty('--mirror-shift',(wave*5.2*bell + p*.8).toFixed(2)+'px');
  mirror.style.setProperty('--mirror-skew',(wave*.72*bell + p*.10).toFixed(3)+'deg');
  mirror.style.setProperty('--mirror-scale',(1 + bell*.013 + p*.0015).toFixed(4));
  mirror.style.setProperty('--mirror-blur',(bell*.18).toFixed(2)+'px');
  mirror.style.setProperty('--mirror-shadow',(wave*2.1*bell).toFixed(2)+'px');
  mirror.dataset.phase=p<.24?'entrada':p<.76?'deformacion':'salida';
}
mirror.addEventListener('scroll',()=>{if(!warpRAF)warpRAF=requestAnimationFrame(updateMirrorDeformation)},{passive:true});

let started=false,locked=false,lockedScene=null,finished=false,finalReady=false;""",
    "instalación visual del espejo",
)
t = replace_once(
    t,
    "      mirrorReadComplete:false,\n      returnedFromCeniciento:true",
    "      mirrorReadComplete:true,\n      mirrorCrossed:true,\n      realityDeformed:true,\n      mirrorCrossedAt:saved.mirrorCrossedAt||Date.now(),\n      returnedFromCeniciento:true",
    "estado persistente al atravesar espejo",
)
t = t.replace(
    "  maintainSilence();\n  sceneNodes[0].focus({preventScroll:true});",
    "  maintainSilence();\n  updateMirrorDeformation();\n  sceneNodes[0].focus({preventScroll:true});",
)
p.write_text(t, encoding="utf-8")


# 3) SEGUNDA TRILOGÍA: guardia de ruta + huella visual residual
p = Path("inventario-del-aire/oras-general-progress-r1.js")
t = p.read_text(encoding="utf-8")
t = t.replace("const VERSION=4;", "const VERSION=5;")
t = replace_once(
    t,
    "const VERSION=5;\n\n/* Los identificadores",
    """const VERSION=5;
const UNIVERSE='oras.universe.v2';
const universeState=()=>{try{return JSON.parse(localStorage.getItem(UNIVERSE)||'{}')||{}}catch(_){return {}}};
if(universeState().mirrorCrossed!==true){
  location.replace('/solo-la-tarjeta/?indice=1&bloqueado=expansion');
  return;
}
document.documentElement.classList.add('oras-after-mirror');
const residue=document.createElement('style');
residue.id='oras-after-mirror-residue-r1';
residue.textContent=`
html.oras-after-mirror body::after{content:\"\";position:fixed;z-index:2147480000;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent 0 49.15%,rgba(255,255,255,.016) 49.45%,rgba(15,14,13,.055) 50.05%,rgba(255,255,255,.012) 50.45%,transparent 50.8% 100%),radial-gradient(65% 90% at 50% 46%,transparent 72%,rgba(12,10,8,.055));mix-blend-mode:screen;opacity:.72}
`;
document.head.appendChild(residue);

/* Los identificadores""",
    "guardia de expansión",
)
p.write_text(t, encoding="utf-8")


# 4) ÍNDICE DE ANA -> botón al índice canónico general ORAS
p = Path("oras-reading-window-r2.js")
t = p.read_text(encoding="utf-8")
t = re.sub(r"const VERSION='[^']+';", "const VERSION='20261014-canonical-index-1';", t, count=1)
t = t.replace(
    ".ou-reading-window-r2 .ou-rw-panel{position:absolute;",
    ".ou-reading-window-r2 .ou-rw-panel{display:none!important;position:absolute;",
)
t = replace_once(
    t,
    "  document.body.appendChild(box);\n}\n\nlet lastSignature='';",
    """  document.body.appendChild(box);
}
box.setAttribute('aria-label','Índice canónico de ORAS');
const canonicalSummary=box.querySelector('summary');
if(canonicalSummary&&!canonicalSummary.dataset.orasCanonicalIndex){
  canonicalSummary.dataset.orasCanonicalIndex='1';
  canonicalSummary.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    location.href=BASE+'/?indice=1';
  });
}
function enforceCanonicalIndexLinks(){
  document.querySelectorAll('a').forEach(a=>{
    const label=(a.textContent||'').trim().toLowerCase();
    if(label==='índice'||label==='indice'||label==='índice oras'||label==='indice oras')a.href=BASE+'/?indice=1';
  });
}
enforceCanonicalIndexLinks();
new MutationObserver(enforceCanonicalIndexLinks).observe(document.body,{childList:true,subtree:true});

let lastSignature='';""",
    "índice canónico global",
)
t = t.replace("summary.textContent=`Lecturas · ${completed}/3`;", "summary.textContent='Índice ORAS';")
t = re.sub(
    r"oras-master-index-r1\.js\?v=[^'\"]+",
    "oras-master-index-r1.js?v=20261014-master-index-11",
    t,
)
p.write_text(t, encoding="utf-8")


# 5) Bumps de caché en HTML públicos
for hp in Path(".").rglob("*.html"):
    try:
        s = hp.read_text(encoding="utf-8")
    except Exception:
        continue
    s2 = re.sub(
        r"oras-reading-window-r2\.js\?v=[^'\"<>]+",
        "oras-reading-window-r2.js?v=20261014-canonical-index-1",
        s,
    )
    if hp.as_posix() == "ceniciento/index.html":
        s2 = re.sub(
            r"el-espejo\.js\?v=[^'\"<>]+",
            "el-espejo.js?v=20261014-espejo-esperpento-1",
            s2,
        )
    if hp.as_posix() == "inventario-del-aire/index.html":
        s2 = re.sub(
            r"oras-general-progress-r1\.js\?v=[^'\"<>]+",
            "oras-general-progress-r1.js?v=20261014-general-progress-5",
            s2,
        )
    if s2 != s:
        hp.write_text(s2, encoding="utf-8")

print("Canon de navegación y Espejo aplicado.")
