from pathlib import Path

KEY = 'oras.entry.return.v1'

# Guardar el origen real de entrada al universo. Se actualiza cada vez que
# se entra desde fuera de /solo-la-tarjeta/, y se conserva durante toda la
# navegación interna de ANA / SOLO / CENICIENTO / EL ESPEJO.
p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')
marker = 'oras-return-to-entry-source-v1'
addon = rf'''

;(()=>{{
  // {marker}
  const KEY='{KEY}';
  try{{
    const ref=document.referrer||'';
    let cameFromOutside=false;
    if(ref){{
      const u=new URL(ref,location.href);
      const internal=u.origin===location.origin && u.pathname.startsWith('/solo-la-tarjeta/');
      cameFromOutside=!internal;
    }}
    if(cameFromOutside || !sessionStorage.getItem(KEY)){{
      sessionStorage.setItem(KEY,JSON.stringify({{
        url:cameFromOutside?ref:'',
        entryHistoryLength:history.length,
        entryHref:location.href,
        capturedAt:Date.now()
      }}));
    }}
  }}catch(_){{}}
}})();
'''
if marker not in s:
    s += addon
p.write_text(s, encoding='utf-8')

# La versión actual de EL ESPEJO desemboca en EL INVENTARIO DEL AIRE y ya no
# contiene la antigua botonera final con «Salir». En ese canon no hay nada que
# sustituir aquí; conservar sólo la memoria del origen para el resto del viaje.
p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')
if "INVENTORY_URL=ROOT+'inventario-del-aire/" in s:
    print('PASS: origen de visita conservado; EL ESPEJO continúa al Inventario sin botón Salir heredado')
    raise SystemExit(0)

# Canon anterior: en la pantalla final de EL ESPEJO, Salir vuelve a la página
# exacta desde la que comenzó la visita.
old = "exit.onclick=()=>go(ROOT+'elegia-breve/');"
new = rf"""function returnToEntrySource(){{
  clearFinaleTimers();
  try{{
    const raw=sessionStorage.getItem('{KEY}');
    if(raw){{
      const entry=JSON.parse(raw);
      const base=Number(entry.entryHistoryLength)||0;
      const current=window.top.history.length;
      const steps=current-base+1;
      if(base>1 && steps>=1){{
        window.top.history.go(-steps);
        return;
      }}
      if(entry.url){{
        window.top.location.href=entry.url;
        return;
      }}
    }}
  }}catch(_){{}}
  try{{
    if(window.opener && !window.opener.closed){{window.close();return;}}
  }}catch(_){{}}
  try{{
    if(window.top.history.length>1){{window.top.history.back();return;}}
  }}catch(_){{}}
  go(ROOT+'elegia-breve/');
}}
exit.onclick=returnToEntrySource;"""
if old not in s:
    raise RuntimeError('No se encontró la acción canónica del botón Salir de EL ESPEJO')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

print('PASS: Salir devuelve a la página de origen de la visita')