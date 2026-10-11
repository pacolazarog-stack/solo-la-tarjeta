from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# ANA KLAUDYA is a composite reading. It is complete only after all eight
# canonical sections have been completed in the current reading cycle.
old_empty="""function emptyState(){
  return {journeyStartedAt:0,cardFound:false,soloComplete:false,anaComplete:false,cenicientoComplete:false,cenicientoUnlocked:false,mirrorReadComplete:false,returnedFromCeniciento:false,ghosts:{}};
}
"""
new_empty="""const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta'],
  ['elegia','Elegía breve para Ana Klaudya'],
  ['ojos','En tus ojos'],
  ['labios','En tus labios'],
  ['cabello','Tu cabello'],
  ['piel','Tu piel'],
  ['interludio','Interludio · Iba a llevarte flores'],
  ['epilogo','Epílogo · A fuego lento · Flores']
]);
function emptyAnaParts(){return Object.fromEntries(ANA_PARTS.map(([key])=>[key,false]));}
function anaPartsComplete(parts){return ANA_PARTS.every(([key])=>parts&&parts[key]===true);}
function emptyState(){
  return {journeyStartedAt:0,cardFound:false,soloComplete:false,anaComplete:false,anaParts:emptyAnaParts(),cenicientoComplete:false,cenicientoUnlocked:false,mirrorReadComplete:false,returnedFromCeniciento:false,ghosts:{}};
}
"""
if old_empty not in s: raise RuntimeError('No se encontró emptyState base')
s=s.replace(old_empty,new_empty,1)

old_read="""  for(const key of ['cardFound','soloComplete','anaComplete','cenicientoComplete','cenicientoUnlocked','mirrorReadComplete','returnedFromCeniciento'])current[key]=saved[key]===true;
  current.ghosts=saved.ghosts&&typeof saved.ghosts==='object'?saved.ghosts:{};
  return current;
"""
new_read="""  for(const key of ['cardFound','soloComplete','cenicientoComplete','cenicientoUnlocked','mirrorReadComplete','returnedFromCeniciento'])current[key]=saved[key]===true;
  current.anaParts=emptyAnaParts();
  if(saved.anaParts&&typeof saved.anaParts==='object')for(const [key] of ANA_PARTS)current.anaParts[key]=saved.anaParts[key]===true;
  current.anaComplete=anaPartsComplete(current.anaParts);
  current.ghosts=saved.ghosts&&typeof saved.ghosts==='object'?saved.ghosts:{};
  return current;
"""
if old_read not in s: raise RuntimeError('No se encontró normalización de readState')
s=s.replace(old_read,new_read,1)

old_check="""function ensureChecklist(){
  if(window.parent!==window)return;
  let box=document.querySelector('.ou-reading-checklist');
  if(!box){box=document.createElement('details');box.className='ou-reading-checklist';box.setAttribute('aria-label','Estado de las lecturas');box.innerHTML='<summary>Lecturas</summary><ul><li data-piece=\"ana\"><span>ANA KLAUDYA</span></li><li data-piece=\"solo\"><span>SOLO LA TARJETA</span></li><li data-piece=\"ceniciento\"><span>CENICIENTO</span></li></ul>';document.body.appendChild(box);}
  const current=readState();
  for(const [piece,key,label] of [['ana','anaComplete','ANA KLAUDYA'],['solo','soloComplete','SOLO LA TARJETA'],['ceniciento','cenicientoComplete','CENICIENTO']]){const row=box.querySelector(`[data-piece=\"${piece}\"]`);row.dataset.done=String(!!current[key]);row.textContent=`${label} · ${current[key]?'completa':'pendiente'}`;row.setAttribute('aria-label',`${label}: ${current[key]?'lectura completa':'pendiente'}`);}
  const completed=['anaComplete','soloComplete','cenicientoComplete'].filter(key=>current[key]).length;
  box.querySelector('summary').textContent=`Lecturas · ${completed}/3`;
  box.hidden=!current.journeyStartedAt;
}
"""
new_check="""function ensureChecklist(){
  if(window.parent!==window)return;
  let box=document.querySelector('.ou-reading-checklist');
  if(!box){box=document.createElement('details');box.className='ou-reading-checklist';box.setAttribute('aria-label','Estado de las lecturas');box.innerHTML='<summary>Lecturas</summary><ul><li data-piece=\"ana\"><span>ANA KLAUDYA</span></li><li data-piece=\"solo\"><span>SOLO LA TARJETA</span></li><li data-piece=\"ceniciento\"><span>CENICIENTO</span></li></ul>';document.body.appendChild(box);}
  const current=readState();
  const anaRow=box.querySelector('[data-piece=\"ana\"]');
  const anaDone=ANA_PARTS.filter(([key])=>current.anaParts[key]).length;
  anaRow.dataset.done=String(!!current.anaComplete);
  anaRow.textContent=`ANA KLAUDYA · ${anaDone}/${ANA_PARTS.length}`;
  const anaStatus=ANA_PARTS.map(([key,label])=>`${current.anaParts[key]?'✓':'·'} ${label}`).join(' · ');
  anaRow.setAttribute('aria-label',`ANA KLAUDYA: ${anaDone} de ${ANA_PARTS.length}. ${anaStatus}`);
  if(anaRow.ownerDocument){
    const parts=document.createElement('div');parts.className='ou-ana-parts';
    for(const [key,label] of ANA_PARTS){const item=document.createElement('span');item.dataset.done=String(!!current.anaParts[key]);item.textContent=`${current.anaParts[key]?'✓':'·'} ${label}`;parts.appendChild(item);}
    anaRow.appendChild(parts);
  }
  for(const [piece,key,label] of [['solo','soloComplete','SOLO LA TARJETA'],['ceniciento','cenicientoComplete','CENICIENTO']]){const row=box.querySelector(`[data-piece=\"${piece}\"]`);row.dataset.done=String(!!current[key]);row.textContent=`${label} · ${current[key]?'completa':'pendiente'}`;row.setAttribute('aria-label',`${label}: ${current[key]?'lectura completa':'pendiente'}`);}
  const completed=['anaComplete','soloComplete','cenicientoComplete'].filter(key=>current[key]).length;
  box.querySelector('summary').textContent=`Lecturas · ${completed}/3`;
  box.hidden=!current.journeyStartedAt;
}
"""
if old_check not in s: raise RuntimeError('No se encontró ensureChecklist base')
s=s.replace(old_check,new_check,1)

css_anchor='.ou-reading-checklist li{white-space:nowrap}.ou-reading-checklist li+li{margin-top:5px}'
css_extra='''.ou-reading-checklist li{white-space:nowrap}.ou-reading-checklist li+li{margin-top:5px}
  .ou-reading-checklist{color:#fff!important;text-shadow:0 1px 2px rgba(0,0,0,.9)}
  .ou-reading-checklist summary{color:#fff!important;background:rgba(10,12,11,.78)!important;border-color:rgba(255,255,255,.28)!important;box-shadow:0 5px 18px rgba(0,0,0,.22)!important}
  .ou-reading-checklist ul{background:rgba(10,12,11,.90)!important;color:#fff!important;border:1px solid rgba(255,255,255,.22)!important;box-shadow:0 10px 30px rgba(0,0,0,.34)!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  .ou-reading-checklist li{color:#fff!important;font-weight:600}
  .ou-reading-checklist li[data-done="true"]{color:#f5e2a8!important}
  .ou-reading-checklist .ou-ana-parts{display:grid;gap:3px;margin:7px 0 3px 14px;font:11px/1.4 system-ui,sans-serif;letter-spacing:.01em;white-space:normal;max-width:min(360px,76vw)}
  .ou-reading-checklist .ou-ana-parts span[data-done="true"]{color:#fff4cf!important;font-weight:600}.ou-reading-checklist .ou-ana-parts span[data-done="false"]{color:#e0e0dc!important;font-weight:500}'''
if css_anchor not in s: raise RuntimeError('No se encontró CSS del contador')
s=s.replace(css_anchor,css_extra,1)

anchor="""function completePiece(key,patch={}){
  state=readState();
  if(!state.journeyStartedAt)return false;
  if(!state[key]){save({[key]:true,...patch});state=readState();}
  else if(Object.keys(patch).some(k=>state[k]!==patch[k])){save(patch);state=readState();}
  ensureChecklist();maybeStartMirror();
  return true;
}
"""
extra=anchor+"""
function completeAnaPart(key){
  state=readState();
  if(!state.journeyStartedAt||!ANA_PARTS.some(([part])=>part===key))return false;
  if(state.anaParts[key]){ensureChecklist();return true;}
  const parts=Object.assign(emptyAnaParts(),state.anaParts,{[key]:true});
  save({anaParts:parts,anaComplete:anaPartsComplete(parts)});
  state=readState();ensureChecklist();
  if(window.parent===window){
    maybeStartMirror();
  }else{
    window.parent.postMessage({channel:'oras-universe-v2',type:'ana-progress'},location.origin);
  }
  return true;
}
window.addEventListener('oras:ana-part-complete',event=>completeAnaPart(event.detail?.part));

function observeAnaEnd(selector,key){
  const items=[...document.querySelectorAll(selector)];
  const target=items.at(-1);if(!target)return;
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.target===target&&entry.isIntersecting&&entry.intersectionRatio>=.6)){io.disconnect();completeAnaPart(key);}},{threshold:[.6,.85,1]});
    io.observe(target);
  }else{
    const check=()=>{const r=target.getBoundingClientRect();const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));if(r.height>0&&visible/r.height>=.6){removeEventListener('scroll',check);completeAnaPart(key);}};
    addEventListener('scroll',check,{passive:true});after(600,check);
  }
}
function setupAnaPartTracking(){
  if(page.ojos)observeAnaEnd('.line','ojos');
  if(page.sonrisa)observeAnaEnd('.line','labios');
  if(page.cabello)observeAnaEnd('.line','cabello');
  if(page.piel)observeAnaEnd('.line','piel');
  if(page.estrella)observeAnaEnd('.phrase','estrella');
  if(page.epilogo)observeAnaEnd('#flowerCoda','epilogo');
  if(page.ana)addEventListener('message',event=>{
    if(event.origin!==location.origin)return;
    if(event.data?.channel==='ceniciento-music-v1'&&event.data.type==='interlude-ended'){completeAnaPart('interludio');return;}
    if(event.data?.channel==='oras-universe-v2'&&event.data.type==='ana-progress'){
      state=readState();ensureChecklist();maybeStartMirror();
    }
  });
}
"""
if anchor not in s: raise RuntimeError('No se encontró completePiece')
s=s.replace(anchor,extra,1)

old_mark="""  const markAna=()=>{
    if(document.body.classList.contains('portrait-revealed'))completePiece('anaComplete');
  };
"""
new_mark="""  const markAna=()=>{
    if(document.body.classList.contains('portrait-revealed'))completeAnaPart('elegia');
  };
"""
if old_mark not in s: raise RuntimeError('No se encontró markAna')
s=s.replace(old_mark,new_mark,1)

old_reset="""function resetReadingCycle(){
  save({anaComplete:false,soloComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:true});
  state=readState();ensureChecklist();
}
"""
new_reset="""function resetReadingCycle(){
  save({anaComplete:false,anaParts:emptyAnaParts(),soloComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:true});
  state=readState();ensureChecklist();
}
"""
if old_reset not in s: raise RuntimeError('No se encontró resetReadingCycle')
s=s.replace(old_reset,new_reset,1)

init_anchor="""  if(page.solo)setupSolo();
  if(page.ana)setupAna();
  if(page.ceniciento)setupCeniciento();
"""
init_new="""  if(page.solo)setupSolo();
  if(page.ana)setupAna();
  setupAnaPartTracking();
  if(page.ceniciento)setupCeniciento();
"""
if init_anchor not in s: raise RuntimeError('No se encontró bloque init')
s=s.replace(init_anchor,init_new,1)

p.write_text(s,encoding='utf-8')
print('PASS: ANA KLAUDYA requires all 8 canonical sections and Flores visibility')
