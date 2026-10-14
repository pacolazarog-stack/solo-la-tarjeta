from pathlib import Path
import re

MASTER='20261014-master-index-14'
READING='20261014-global-index-window-2'
MIRROR='20261014-persistent-reading-2'
UNIVERSE='20261014-manual-reset-only-1'

# --- índice maestro global -------------------------------------------------
p=Path('oras-master-index-r1.js')
s=p.read_text(encoding='utf-8')
old="""const PATH=location.pathname.replace(/\\/index\\.html$/i,'/').replace(/\\/+$/,'');
if(PATH!=='/solo-la-tarjeta')return;

const qs=new URLSearchParams(location.search);
if(qs.has('read')||qs.has('origen')||qs.get('auto')==='1'||qs.has('from'))return;"""
new="""const PATH=location.pathname.replace(/\\/index\\.html$/i,'/').replace(/\\/+$/,'');
if(!PATH.startsWith('/solo-la-tarjeta'))return;
const IS_ROOT=PATH==='/solo-la-tarjeta';

const qs=new URLSearchParams(location.search);
const COVER_ENTRY=IS_ROOT&&!qs.has('read')&&!qs.has('origen')&&qs.get('auto')!=='1'&&!qs.has('from')&&qs.get('indice')!=='1';"""
if old in s:s=s.replace(old,new,1)
elif 'const COVER_ENTRY=' not in s:raise SystemExit('No se encontró cabecera del índice maestro')
s=re.sub(r"const VERSION='[^']+';",f"const VERSION='{MASTER}';",s,count=1)
s=s.replace("document.documentElement.classList.add('oras-master-entry');","if(COVER_ENTRY)document.documentElement.classList.add('oras-master-entry');")

css_anchor='@media(prefers-reduced-motion:reduce){.oras-master-button::before,.oras-mi-card-action .chev{transition:none}}'
extra_css=r'''
/* ORAS · ventana canónica móvil + umbral de portada */
.oras-entry-bridge{position:fixed;z-index:2147483646;inset:0;background:#fff;opacity:0;visibility:hidden;pointer-events:none}.oras-entry-bridge.is-active{visibility:visible;animation:orasWhiteBreath 2.9s ease-in-out forwards}
@keyframes orasWhiteBreath{0%{opacity:0}18%{opacity:1}38%{opacity:.92}52%{opacity:1}68%{opacity:.88}82%{opacity:1}100%{opacity:.22}}
.oras-master-cover-frame{transform:scale(1);transform-origin:50% 50.4%;transition:transform 1.05s cubic-bezier(.56,.02,.2,1),filter 1.05s ease}.oras-master-cover.is-entering .oras-master-cover-frame{transform:scale(7.8);filter:blur(1.8px) brightness(1.28)}
.oras-master-cover.is-entering .oras-master-button{transform:translate(-50%,-50%) perspective(700px) rotateY(86deg) scale(.62);opacity:.05;transition:transform .82s cubic-bezier(.5,.02,.18,1),opacity .62s ease}.oras-master-cover.is-entering .oras-master-button::before{border-color:rgba(255,255,255,.78);background:rgba(255,255,255,.12);box-shadow:0 0 70px rgba(255,255,255,.58)}
.oras-master-index{align-items:center;justify-content:center;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:rgba(5,5,5,.70);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden}.oras-master-index.is-open{display:flex}.oras-master-index.from-entry{background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none}.oras-master-index.from-entry .oras-mi-shell{animation:orasIndexAppear 1.55s .38s both cubic-bezier(.22,.65,.28,1)}
@keyframes orasIndexAppear{0%{opacity:0;transform:translateY(24px) scale(.965);filter:blur(7px)}100%{opacity:1;transform:none;filter:none}}
.oras-mi-shell{position:relative;width:min(900px,calc(100vw - 24px));height:min(92svh,880px);max-height:calc(100svh - 22px);margin:0;padding:max(22px,env(safe-area-inset-top)) 18px calc(94px + env(safe-area-inset-bottom));overflow:auto;border:1px solid rgba(224,194,129,.34);border-radius:22px;background:radial-gradient(circle at 50% -8%,rgba(104,77,37,.16),transparent 26%),linear-gradient(180deg,#0f0e0c,#060606 62%);box-shadow:0 28px 90px rgba(0,0,0,.58),inset 0 1px rgba(255,255,255,.025);overscroll-behavior:contain}.oras-mi-bottom{grid-template-columns:minmax(0,.8fr) minmax(0,.95fr) minmax(0,1.25fr);width:min(860px,calc(100vw - 42px))}
.oras-mi-reset{border:1px solid rgba(255,77,77,.75);background:linear-gradient(180deg,rgba(128,12,12,.96),rgba(79,7,7,.98));color:#fff1ee;box-shadow:0 0 16px rgba(190,18,18,.18)}.oras-mi-reset:hover,.oras-mi-reset:focus-visible{background:linear-gradient(180deg,#a61212,#700909);outline:none}
@media(max-width:700px){.oras-master-index{padding:6px}.oras-mi-shell{width:calc(100vw - 12px);height:calc(100svh - 12px);max-height:none;border-radius:18px;padding:14px 9px calc(86px + env(safe-area-inset-bottom))}.oras-mi-bottom{width:calc(100vw - 20px);grid-template-columns:.78fr .9fr 1.2fr;gap:5px}.oras-mi-bottom a,.oras-mi-bottom button{font-size:.76rem;min-height:46px;padding:0 8px}}
@media(max-width:390px){.oras-mi-bottom a,.oras-mi-bottom button{font-size:.7rem;gap:4px}.oras-mi-bottom-icon{font-size:.82rem}}
'''
if 'oras-entry-bridge' not in s:
    if css_anchor not in s:raise SystemExit('No se encontró ancla CSS')
    s=s.replace(css_anchor,css_anchor+extra_css,1)

if "cover.hidden=!COVER_ENTRY;" not in s:
    s=s.replace("document.body.appendChild(cover);","cover.hidden=!COVER_ENTRY;\ndocument.body.appendChild(cover);\nconst entryBridge=document.createElement('div');\nentryBridge.className='oras-entry-bridge';\nentryBridge.hidden=true;\ndocument.body.appendChild(entryBridge);",1)

old_bottom='''  index.querySelector('.oras-mi-bottom').innerHTML=`\n    <button class="oras-mi-home" type="button" data-home><span class="oras-mi-bottom-icon">⌂</span><span>Inicio</span></button>\n    <a class="oras-mi-continue" href="${firstUnread}"><span class="oras-mi-bottom-icon">▤</span><span>${p.done===p.total?'Volver a leer':'Continuar'}</span></a>`;'''
new_bottom='''  index.querySelector('.oras-mi-bottom').innerHTML=`\n    <button class="oras-mi-reset" type="button" data-reset><span class="oras-mi-bottom-icon">●</span><span>Reiniciar</span></button>\n    <button class="oras-mi-home" type="button" data-home><span class="oras-mi-bottom-icon">×</span><span>Cerrar</span></button>\n    <a class="oras-mi-continue" href="${firstUnread}"><span class="oras-mi-bottom-icon">▤</span><span>${p.done===p.total?'Volver a leer':'Continuar'}</span></a>`;'''
if old_bottom in s:s=s.replace(old_bottom,new_bottom,1)
elif 'data-reset' not in s:raise SystemExit('No se encontró botonera inferior')

hook="  index.querySelector('[data-home]')?.addEventListener('click',closeIndex);"
reset_code=r'''  index.querySelector('[data-reset]')?.addEventListener('click',()=>{
    try{localStorage.removeItem(UKEY)}catch(_){}
    try{localStorage.removeItem(GKEY)}catch(_){}
    try{sessionStorage.removeItem(OPENKEY)}catch(_){}
    try{localStorage.setItem(UKEY,JSON.stringify({soloComplete:false,anaComplete:false,anaParts:Object.fromEntries(ANA.map(([id])=>[id,false])),cenicientoComplete:false,cenicientoUnlocked:false,mirrorReadComplete:false,mirrorCrossed:false,realityDeformed:false,returnedFromCeniciento:false}))}catch(_){}
    try{window.dispatchEvent(new CustomEvent('oras:manual-reset'))}catch(_){}
    location.href=ROOT+'/?indice=1&reinicio=1';
  });
'''
if 'oras:manual-reset' not in s:s=s.replace(hook,reset_code+hook,1)

old_open=r'''function openIndex(){
  render();
  index.classList.add('is-open');
  cover.hidden=true;
  index.scrollTop=0;
  index.querySelector('.oras-mi-close')?.focus({preventScroll:true});
}
function closeIndex(){
  index.classList.remove('is-open');
  cover.hidden=false;
  cover.querySelector('.oras-master-button')?.focus({preventScroll:true});
}

cover.querySelector('.oras-master-button').addEventListener('click',openIndex);'''
new_open=r'''function openIndex(options={}){
  render();cover.hidden=true;document.documentElement.classList.remove('oras-master-entry');
  if(options.fromEntry)index.classList.add('from-entry');index.classList.add('is-open');index.scrollTop=0;
  setTimeout(()=>index.querySelector('.oras-mi-close')?.focus({preventScroll:true}),options.fromEntry?900:0);
  if(options.fromEntry)setTimeout(()=>index.classList.remove('from-entry'),2700);
}
function closeIndex(){index.classList.remove('is-open','from-entry');document.documentElement.classList.remove('oras-master-entry');}
function enterFromCover(){
  if(cover.classList.contains('is-entering'))return;const button=cover.querySelector('.oras-master-button');if(button)button.disabled=true;
  cover.classList.add('is-entering');entryBridge.hidden=false;requestAnimationFrame(()=>entryBridge.classList.add('is-active'));
  setTimeout(()=>{cover.hidden=true;openIndex({fromEntry:true})},920);
  setTimeout(()=>{entryBridge.classList.remove('is-active');entryBridge.hidden=true},3200);
}
window.ORASMasterIndex={open:()=>openIndex(),close:closeIndex,render,reset:()=>index.querySelector('[data-reset]')?.click()};
cover.querySelector('.oras-master-button').addEventListener('click',enterFromCover);'''
if old_open in s:s=s.replace(old_open,new_open,1)
elif 'window.ORASMasterIndex=' not in s:raise SystemExit('No se encontró openIndex')

if "if(qs.get('indice')==='1')" not in s:
    s=s.replace("document.addEventListener('visibilitychange',()=>{if(!document.hidden&&index.classList.contains('is-open'))render();});","document.addEventListener('visibilitychange',()=>{if(!document.hidden&&index.classList.contains('is-open'))render();});\nif(qs.get('indice')==='1')requestAnimationFrame(()=>openIndex());",1)
p.write_text(s,encoding='utf-8')

# --- ventana Lecturas abre índice in situ ----------------------------------
p=Path('oras-reading-window-r2.js');s=p.read_text(encoding='utf-8')
s=re.sub(r"const VERSION='[^']+';",f"const VERSION='{READING}';",s,count=1)
if 'const MASTER_VERSION=' not in s:s=s.replace("const BASE='/solo-la-tarjeta';",f"const BASE='/solo-la-tarjeta';\nconst MASTER_VERSION='{MASTER}';",1)
old=r'''const canonicalSummary=box.querySelector('summary');
if(canonicalSummary&&!canonicalSummary.dataset.orasCanonicalIndex){
  canonicalSummary.dataset.orasCanonicalIndex='1';
  canonicalSummary.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    location.href=BASE+'/?indice=1';
  });
}'''
new=r'''function openCanonicalIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  let script=document.querySelector('script[data-oras-master-index-global]');
  if(!script){script=document.createElement('script');script.dataset.orasMasterIndexGlobal='1';script.src=BASE+'/oras-master-index-r1.js?v='+MASTER_VERSION;script.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});document.head.appendChild(script)}
}
const canonicalSummary=box.querySelector('summary');
if(canonicalSummary&&!canonicalSummary.dataset.orasCanonicalIndex){
  canonicalSummary.dataset.orasCanonicalIndex='1';
  canonicalSummary.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openCanonicalIndex();});
}'''
if old in s:s=s.replace(old,new,1)
elif 'function openCanonicalIndex()' not in s:raise SystemExit('No se encontró listener Lecturas')
s=s.replace("if(label==='índice'||label==='indice'||label==='índice oras'||label==='indice oras')a.href=BASE+'/?indice=1';","if(label==='índice'||label==='indice'||label==='índice oras'||label==='indice oras'){a.href='#oras-index';a.dataset.orasIndexOpen='1';}")
if "a[data-oras-index-open]" not in s:
    s=s.replace("enforceCanonicalIndexLinks();\nnew MutationObserver(enforceCanonicalIndexLinks).observe(document.body,{childList:true,subtree:true});","enforceCanonicalIndexLinks();\nnew MutationObserver(enforceCanonicalIndexLinks).observe(document.body,{childList:true,subtree:true});\ndocument.addEventListener('click',event=>{const a=event.target.closest?.('a[data-oras-index-open]');if(!a)return;event.preventDefault();openCanonicalIndex();});",1)
p.write_text(s,encoding='utf-8')

# --- espejo conserva las lecturas -----------------------------------------
p=Path('ceniciento/el-espejo.js');s=p.read_text(encoding='utf-8')
s=re.sub(r"const VERSION='[^']+';",f"const VERSION='{MIRROR}';",s,count=1)
replacement=r'''function resetReadingCycleForInventory(){
  try{const raw=localStorage.getItem(STORAGE);const saved=raw?JSON.parse(raw):{};localStorage.setItem(STORAGE,JSON.stringify(Object.assign({},saved,{mirrorReadComplete:true,mirrorCrossed:true,realityDeformed:true,mirrorCrossedAt:saved.mirrorCrossedAt||Date.now(),returnedFromCeniciento:false})))}catch(_){}
}
function enterInventory(){'''
s,n=re.subn(r'''function resetReadingCycleForInventory\(\)\{.*?\n\}\nfunction enterInventory\(\)\{''',replacement,s,count=1,flags=re.S)
if n!=1 and 'anaComplete:false' in s:raise SystemExit('No se pudo anular reinicio del Espejo')
p.write_text(s,encoding='utf-8')

# --- reinicio automático heredado desactivado -----------------------------
p=Path('narrative-universe.js');s=p.read_text(encoding='utf-8')
s=re.sub(r"const VERSION='[^']+';",f"const VERSION='{UNIVERSE}';",s,count=1)
s,n=re.subn(r'''function clearStaleVisitsAfterRestart\(\)\{.*?\n\}\n\n/\*\n  CENICIENTO''',"function clearStaleVisitsAfterRestart(){return;}\n\n/*\n  CENICIENTO",s,count=1,flags=re.S)
if n!=1 and 'clearStaleVisitsAfterRestart(){return;}' not in s:raise SystemExit('No se pudo desactivar reset automático')
p.write_text(s,encoding='utf-8')

# --- índice disponible desde toda superficie narrativa --------------------
tag=f'<script data-oras-master-index-global="1" src="/solo-la-tarjeta/oras-master-index-r1.js?v={MASTER}"></script>'
for h in Path('.').rglob('*.html'):
    if '.git' in h.parts or '.github' in h.parts:continue
    t=h.read_text(encoding='utf-8')
    if h.as_posix()!='index.html' and 'narrative-universe.js' not in t and 'oras-reading-window-r2.js' not in t:continue
    t=re.sub(r'\n?<script[^>]*data-oras-master-index-global[^>]*>\s*</script>\n?','\n',t)
    t=re.sub(r'\n?<script[^>]*src=["\'][^"\']*oras-master-index-r1\.js\?v=[^"\']+["\'][^>]*>\s*</script>\n?','\n',t)
    t=t.replace('</body>',tag+'\n</body>',1)
    t=re.sub(r'el-espejo\.js\?v=[^"\']+',f'el-espejo.js?v={MIRROR}',t)
    t=re.sub(r'narrative-universe\.js\?v=[^"\']+',f'narrative-universe.js?v={UNIVERSE}',t)
    t=re.sub(r'oras-reading-window-r2\.js\?v=[^"\']+',f'oras-reading-window-r2.js?v={READING}',t)
    h.write_text(t,encoding='utf-8')

print('ORAS: índice móvil global, entrada inmersiva y reinicio manual aplicados')
