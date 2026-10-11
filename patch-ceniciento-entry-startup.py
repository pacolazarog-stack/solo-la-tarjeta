from pathlib import Path
import json

page=Path('ceniciento/index.html')
s=page.read_text(encoding='utf-8')
marker='oras-ceniciento-entry-startup-v1'

if marker not in s:
    raw=Path('ceniciento/texto.md').read_text(encoding='utf-8')
    embedded=json.dumps(raw,ensure_ascii=False).replace('</','<\\/')
    anchor='const AGE_FRAME_COUNT=9;'
    if anchor not in s:
        raise RuntimeError('No se encontró AGE_FRAME_COUNT en CENICIENTO')
    s=s.replace(anchor,anchor+"\nconst CENICIENTO_TEXT="+embedded+"; // "+marker,1)

    old_check="function check(){read.disabled=!readyText;listen.disabled=!(readyText&&readyVoice&&readyFrames);if(!mode&&readyText)status.textContent=listen.disabled?'texto listo · cargando voz e imágenes':'listo'}"
    new_check="function check(){read.disabled=!readyText;listen.disabled=!readyText;if(!mode&&readyText)status.textContent=readyVoice?'listo':'texto listo · voz cargando'}"
    if old_check not in s:
        raise RuntimeError('No se encontró el bloqueo de arranque de VOZ/LEER')
    s=s.replace(old_check,new_check,1)

    old_text="async function loadText(){const r=await fetch('/solo-la-tarjeta/ceniciento/texto.md?v=16',{cache:'no-store'});if(!r.ok)throw Error('texto');let raw=await r.text();raw=raw.replace(/^#\\s*CENICIENTO\\s*/i,'').trim();readerText.innerHTML='';raw.split(/\\n\\s*\\n/).map(s=>s.trim()).filter(Boolean).forEach(p=>{const el=document.createElement('p');el.textContent=p;readerText.appendChild(el)});readyText=true;check()}"
    new_text="function applyText(raw){raw=String(raw||'').replace(/^#\\s*CENICIENTO\\s*/i,'').trim();readerText.innerHTML='';raw.split(/\\n\\s*\\n/).map(s=>s.trim()).filter(Boolean).forEach(p=>{const el=document.createElement('p');el.textContent=p;readerText.appendChild(el)});readyText=true;check()}\nasync function loadText(){applyText(CENICIENTO_TEXT);try{const r=await fetch('/solo-la-tarjeta/ceniciento/texto.md?v=20261012-entry-v1',{cache:'no-store'});if(r.ok)applyText(await r.text())}catch(_){}}"
    if old_text not in s:
        raise RuntimeError('No se encontró el cargador de texto absoluto de CENICIENTO')
    s=s.replace(old_text,new_text,1)

    old_buttons='<button id="listen" disabled>Voz</button><button id="read" disabled>Leer</button>'
    new_buttons='<button id="listen">Voz</button><button id="read">Leer</button>'
    if old_buttons not in s:
        raise RuntimeError('No se encontraron los botones iniciales de CENICIENTO')
    s=s.replace(old_buttons,new_buttons,1)
    page.write_text(s,encoding='utf-8')

parent=Path('elegia-breve/index.html')
t=parent.read_text(encoding='utf-8')
old_version='v=20261010-ceniciento-score40-v3-audio'
new_version='v=20261012-ceniciento-entry-v1'
if old_version in t:
    t=t.replace(old_version,new_version)
elif new_version not in t:
    raise RuntimeError('No se encontró el cache-buster del iframe de CENICIENTO')
parent.write_text(t,encoding='utf-8')

check=page.read_text(encoding='utf-8')
required=[marker,'const CENICIENTO_TEXT=',"listen.disabled=!readyText",'id="listen">Voz</button><button id="read">Leer</button>',"applyText(CENICIENTO_TEXT)"]
for token in required:
    if token not in check:
        raise RuntimeError('Falta endurecimiento de arranque: '+token)
if 'listen.disabled=!(readyText&&readyVoice&&readyFrames)' in check:
    raise RuntimeError('VOZ sigue dependiendo de fotogramas/metadatos para habilitarse')
if new_version not in parent.read_text(encoding='utf-8'):
    raise RuntimeError('El iframe de CENICIENTO no fuerza la versión nueva')
print('PASS: CENICIENTO habilita LEER desde texto embebido y VOZ sin esperar fotogramas/metadatos; iframe cache-busted')
