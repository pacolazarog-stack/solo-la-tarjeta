from pathlib import Path


def replace_required(text: str, old: str, new: str, label: str) -> str:
    if old in text:
        return text.replace(old, new)
    if new in text:
        return text
    raise RuntimeError(f"No se encontró patrón para {label}")


# Índice maestro: CENICIENTO no tiene acceso directo; EL ESPEJO sí abre su pantalla.
p = Path("oras-master-index-r1.js")
s = p.read_text(encoding="utf-8")
s = replace_required(s, "const VERSION='20261014-master-index-9';", "const VERSION='20261014-master-index-10';", "versión índice")
s = replace_required(s, ".oras-mi-card.is-locked{opacity:.46}", ".oras-mi-card.is-locked{opacity:.46}.oras-mi-card.is-locked .oras-mi-card-action{pointer-events:none;cursor:default}", "bloqueo tarjeta")
s = replace_required(s, "!cen&&`${ROOT}/ceniciento/`,", "!cen&&`${ROOT}/elegia-breve/#epilogo`,", "continuar Ceniciento")
s = replace_required(s, "mirrorReady&&!mirror&&`${ROOT}/ceniciento/`,", "mirrorReady&&!mirror&&`${ROOT}/ceniciento/?mirror=1`,", "continuar Espejo")
s = replace_required(
    s,
    "${card({id:'ceniciento',mark:'3',title:'Ceniciento',meta:cen?'completa':'pendiente',done:cen,href:`${ROOT}/ceniciento/`})}",
    "${card({id:'ceniciento',mark:'3',title:'Ceniciento',meta:'acceso únicamente por el interrogante',done:cen,href:'',locked:true})}",
    "tarjeta Ceniciento",
)
s = replace_required(
    s,
    "${card({id:'mirror',mark:'◇',title:'El Espejo',meta:'32 fragmentos',done:mirror,href:`${ROOT}/ceniciento/`,locked:!mirrorReady&&!mirror})}",
    "${card({id:'mirror',mark:'◇',title:'El Espejo',meta:'32 fragmentos',done:mirror,href:`${ROOT}/ceniciento/?mirror=1`,locked:!mirrorReady&&!mirror})}",
    "tarjeta Espejo",
)
p.write_text(s, encoding="utf-8")

# Loader: romper caché del índice.
p = Path("oras-reading-window-r2.js")
s = p.read_text(encoding="utf-8")
s = replace_required(s, "oras-master-index-r1.js?v=20261014-master-index-9", "oras-master-index-r1.js?v=20261014-master-index-10", "loader índice")
p.write_text(s, encoding="utf-8")

# EL ESPEJO: ?mirror=1 abre directamente la pantalla de EL ESPEJO si está desbloqueado.
p = Path("ceniciento/el-espejo.js")
s = p.read_text(encoding="utf-8")
s = replace_required(s, "const VERSION='20261012-mirror-gates-4';", "const VERSION='20261014-mirror-direct-5';", "versión Espejo")
if "directMirrorRequested" not in s:
    needle = "window.addEventListener('oras:mirror-reset',()=>{\n  clearInterval(silenceTimer);\n  started=false;finished=false;finalReady=false;locked=false;lockedScene=null;\n  clearedPauses.clear();\n  mirror.style.transition='';mirror.style.opacity='';mirror.hidden=true;document.body.classList.remove('mirror');\n});\n})();"
    insert = "window.addEventListener('oras:mirror-reset',()=>{\n  clearInterval(silenceTimer);\n  started=false;finished=false;finalReady=false;locked=false;lockedScene=null;\n  clearedPauses.clear();\n  mirror.style.transition='';mirror.style.opacity='';mirror.hidden=true;document.body.classList.remove('mirror');\n});\n\n/* Acceso exacto desde el índice: abre EL ESPEJO, no CENICIENTO. */\nconst directMirrorRequested=new URLSearchParams(location.search).get('mirror')==='1';\nif(directMirrorRequested){\n  let state={};\n  try{state=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch(_){}\n  const allowed=state.anaComplete===true&&state.soloComplete===true&&state.cenicientoComplete===true;\n  if(allowed){\n    requestAnimationFrame(()=>requestAnimationFrame(start));\n  }else{\n    location.replace(ROOT+'?indice=1');\n  }\n}\n})();"
    if needle not in s:
        raise RuntimeError("No se encontró cierre de el-espejo.js")
    s = s.replace(needle, insert)
p.write_text(s, encoding="utf-8")

# Router semántico de la expansión: cada chip va a su pantalla/capítulo exacto.
p = Path("inventario-del-aire/oras-general-progress-r1.js")
s = p.read_text(encoding="utf-8")
s = replace_required(s, "const VERSION=3;", "const VERSION=4;", "versión router")
anchor = "const norm=s=>(s||'').replace(/\\s+/g,' ').trim().toUpperCase();"
targets = """const TARGET_KEYS={
  'inv-1':'entry','inv-2':'clock','inv-3':'kitchen','inv-4':'corridor','inv-5':'bedroom','inv-6':'garden','inv-7':'inventory','inv-8':'exit',
  'som-1':'station','som-2':'inspector','som-3':'shadows','som-4':'row-seven','som-5':'conversation','som-6':'mobile-inventory','som-7':'workshop','som-8':'office','som-9':'last-journey',
  'ciu-1':'plaza','ciu-2':'archivist','ciu-3':'fountain','ciu-4':'resisters','ciu-5':'map','ciu-6':'theory','ciu-7':'museum','ciu-8':'visitor','ciu-9':'winter',
  'ciu-11':'deep-archive','ciu-12':'trace-machine','atlas':'atlas','ciu-13':'resonator','ciu-10':'last-room'
};

const norm=s=>(s||'').replace(/\\s+/g,' ').trim().toUpperCase();"""
if "const TARGET_KEYS=" not in s:
    if anchor not in s:
        raise RuntimeError("No se encontró ancla TARGET_KEYS")
    s = s.replace(anchor, targets)
old = """function panelForId(id){
  if(id==='atlas')return document.querySelector('.story-panel.atlas-panel-r6,.story-panel.atlas-panel');
  if(id==='zero'){
    const marker=zeroTarget();
    return marker?.closest('.story-panel')||marker||null;
  }
  return [...document.querySelectorAll('.story-panel')].find(p=>idForPanel(p)===id)||null;
}"""
new = """function panelForId(id){
  if(id==='zero'){
    const marker=zeroTarget();
    return marker?.closest('.story-panel')||marker||null;
  }
  if(id==='atlas'){
    const atlas=document.querySelector('.story-panel.atlas-panel-r6,.story-panel.atlas-panel,[data-chapter=\"atlas\"]');
    return atlas?.closest('.story-panel')||atlas||null;
  }
  const key=TARGET_KEYS[id];
  if(key){
    const marker=document.querySelector(`[data-chapter=\"${key}\"]`);
    if(marker)return marker.closest('.story-panel')||marker;
  }
  return [...document.querySelectorAll('.story-panel')].find(p=>idForPanel(p)===id)||null;
}"""
s = replace_required(s, old, new, "panelForId")
p.write_text(s, encoding="utf-8")

# Cache del router de la expansión.
p = Path("inventario-del-aire/index.html")
s = p.read_text(encoding="utf-8")
s = replace_required(s, "oras-general-progress-r1.js?v=20261014-general-progress-3", "oras-general-progress-r1.js?v=20261014-general-progress-4", "cache router")
p.write_text(s, encoding="utf-8")

# Auditoría estática final.
master = Path("oras-master-index-r1.js").read_text(encoding="utf-8")
assert "title:'Ceniciento',meta:'acceso únicamente por el interrogante'" in master
assert "title:'El Espejo',meta:'32 fragmentos'" in master and "?mirror=1" in master
assert "!cen&&`${ROOT}/elegia-breve/#epilogo`" in master
assert "href:`${ROOT}/ceniciento/`" not in master
assert "master-index-10" in master
router = Path("inventario-del-aire/oras-general-progress-r1.js").read_text(encoding="utf-8")
for key in ['entry','clock','kitchen','corridor','bedroom','garden','inventory','exit','station','inspector','shadows','row-seven','conversation','mobile-inventory','workshop','office','last-journey','plaza','archivist','fountain','resisters','map','theory','museum','visitor','winter','deep-archive','trace-machine','atlas','resonator','last-room']:
    assert key in router
print('PASS: rutas ORAS corregidas y auditadas')
