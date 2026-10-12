(()=>{
'use strict';

const STORAGE='oras.universe.v2';
const VERSION='20261012-reading-window-r2';
const ANA_PARTS=Object.freeze([
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
function readState(){
  try{
    const raw=localStorage.getItem(STORAGE);
    const saved=raw?JSON.parse(raw):{};
    const parts=Object.assign(emptyAnaParts(),saved.anaParts&&typeof saved.anaParts==='object'?saved.anaParts:{});
    return Object.assign({},saved,{anaParts:parts});
  }catch(_){return {anaParts:emptyAnaParts()};}
}
function writeState(patch){
  try{
    const current=readState();
    const next=Object.assign({},current,patch);
    localStorage.setItem(STORAGE,JSON.stringify(next));
    return next;
  }catch(_){return readState();}
}
function anaDone(parts){return ANA_PARTS.filter(([key])=>parts?.[key]===true).length;}
function anaComplete(parts){return anaDone(parts)===ANA_PARTS.length;}
function completeAnaPart(key){
  if(!ANA_PARTS.some(([part])=>part===key))return;
  const current=readState();
  if(current.anaParts[key]===true){render();return;}
  const parts=Object.assign(emptyAnaParts(),current.anaParts,{[key]:true});
  writeState({anaParts:parts,anaComplete:anaComplete(parts)});
  render(true);
}

const style=document.createElement('style');
style.id='oras-reading-window-r2-style';
style.textContent=`
.ou-reading-checklist{display:none!important}
.ou-reading-window-r2{position:fixed;z-index:2147483000;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));font-family:Georgia,"Times New Roman",serif;color:#f7f1e8}
.ou-reading-window-r2>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:7px;min-height:31px;padding:6px 11px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(13,13,13,.68);box-shadow:0 5px 18px rgba(0,0,0,.14);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);font:500 12px/1.2 Georgia,"Times New Roman",serif;color:#f7f1e8;text-shadow:0 1px 4px rgba(0,0,0,.55)}
.ou-reading-window-r2>summary::-webkit-details-marker{display:none}
.ou-reading-window-r2>summary::before{content:"";width:5px;height:5px;border-radius:50%;background:rgba(244,225,177,.82);box-shadow:0 0 8px rgba(244,225,177,.35)}
.ou-reading-window-r2[open]>summary::before{background:#f4e1b1}
.ou-reading-window-r2 .ou-rw-panel{position:absolute;left:0;bottom:calc(100% + 8px);width:min(340px,calc(100vw - 24px));max-height:min(54vh,430px);overflow:auto;padding:11px 12px 12px;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:rgba(13,13,13,.76);box-shadow:0 12px 40px rgba(0,0,0,.24);backdrop-filter:blur(11px);-webkit-backdrop-filter:blur(11px);scrollbar-width:thin}
.ou-reading-window-r2 .ou-rw-piece{padding:5px 0;font-size:12px;line-height:1.35;color:rgba(247,241,232,.78)}
.ou-reading-window-r2 .ou-rw-piece+.ou-rw-piece{border-top:1px solid rgba(255,255,255,.08)}
.ou-reading-window-r2 .ou-rw-piece[data-done="true"]{color:#fff5dd}
.ou-reading-window-r2 .ou-rw-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.ou-reading-window-r2 .ou-rw-name{font-weight:600;letter-spacing:.015em}
.ou-reading-window-r2 .ou-rw-state{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:rgba(247,241,232,.56);white-space:nowrap}
.ou-reading-window-r2 .ou-rw-piece[data-done="true"] .ou-rw-state{color:#f0d998}
.ou-reading-window-r2 .ou-rw-parts{display:grid;gap:2px;margin:6px 0 2px 13px;font:10.5px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;color:rgba(247,241,232,.54)}
.ou-reading-window-r2 .ou-rw-part{display:grid;grid-template-columns:12px 1fr;gap:3px;align-items:start}
.ou-reading-window-r2 .ou-rw-part[data-done="true"]{color:rgba(255,246,221,.91)}
.ou-reading-window-r2 .ou-rw-mark{font-family:Georgia,"Times New Roman",serif;color:#d9be72}
body.mirror .ou-reading-window-r2{display:none!important}
@media(max-width:700px){
  .ou-reading-window-r2{left:max(9px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom))}
  .ou-reading-window-r2>summary{font-size:11px;min-height:29px;padding:5px 9px}
  .ou-reading-window-r2 .ou-rw-panel{width:min(318px,calc(100vw - 18px));max-height:48vh;padding:9px 10px 10px}
  .ou-reading-window-r2 .ou-rw-piece{font-size:11px}.ou-reading-window-r2 .ou-rw-parts{font-size:9.8px}
}
`;
document.head.appendChild(style);

let box=document.querySelector('.ou-reading-window-r2');
if(!box){
  box=document.createElement('details');
  box.className='ou-reading-window-r2';
  box.setAttribute('aria-label','Estado completo de las lecturas');
  box.innerHTML='<summary>Lecturas</summary><div class="ou-rw-panel" role="status" aria-live="polite"></div>';
  document.body.appendChild(box);
}

let lastSignature='';
function render(force=false){
  const state=readState();
  const parts=state.anaParts||emptyAnaParts();
  const anaCount=anaDone(parts);
  const computedAna=anaComplete(parts);
  if(state.anaComplete!==computedAna){
    try{writeState({anaComplete:computedAna});state.anaComplete=computedAna;}catch(_){}
  }
  const solo=state.soloComplete===true;
  const ceniciento=state.cenicientoComplete===true;
  const completed=[computedAna,solo,ceniciento].filter(Boolean).length;
  const signature=JSON.stringify([anaCount,parts,solo,ceniciento,completed]);
  if(!force&&signature===lastSignature)return;
  lastSignature=signature;
  const summary=box.querySelector('summary');
  const panel=box.querySelector('.ou-rw-panel');
  summary.textContent=`Lecturas · ${completed}/3`;
  const partRows=ANA_PARTS.map(([key,label])=>`<span class="ou-rw-part" data-done="${parts[key]===true}"><span class="ou-rw-mark">${parts[key]===true?'✓':'·'}</span><span>${label}</span></span>`).join('');
  panel.innerHTML=`
    <div class="ou-rw-piece" data-done="${computedAna}">
      <div class="ou-rw-head"><span class="ou-rw-name">${computedAna?'✓':'·'} ANA KLAUDYA</span><span class="ou-rw-state">${anaCount}/8</span></div>
      <div class="ou-rw-parts">${partRows}</div>
    </div>
    <div class="ou-rw-piece" data-done="${solo}"><div class="ou-rw-head"><span class="ou-rw-name">${solo?'✓':'·'} SOLO LA TARJETA</span><span class="ou-rw-state">${solo?'completa':'pendiente'}</span></div></div>
    <div class="ou-rw-piece" data-done="${ceniciento}"><div class="ou-rw-head"><span class="ou-rw-name">${ceniciento?'✓':'·'} CENICIENTO</span><span class="ou-rw-state">${ceniciento?'completa':'pendiente'}</span></div></div>`;
}

function observeEnd(selector,key,ratio=.58){
  const nodes=[...document.querySelectorAll(selector)];
  const target=nodes.at(-1);
  if(!target)return;
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.target===target&&entry.isIntersecting&&entry.intersectionRatio>=ratio)){
        io.disconnect();completeAnaPart(key);
      }
    },{threshold:[ratio,.8,1]});
    io.observe(target);
  }
}
function setupTracking(){
  const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
  if(path.endsWith('/estrella'))observeEnd('.phrase','estrella',.55);
  if(path.endsWith('/ojos'))observeEnd('.line','ojos',.55);
  if(path.endsWith('/sonrisa'))observeEnd('.line','labios',.55);
  if(path.endsWith('/cabello'))observeEnd('.line','cabello',.55);
  if(path.endsWith('/piel'))observeEnd('.line','piel',.55);
  if(path.endsWith('/elegia-breve')){
    const markElegia=()=>{if(document.body.classList.contains('portrait-revealed'))completeAnaPart('elegia');};
    new MutationObserver(markElegia).observe(document.body,{attributes:true,attributeFilter:['class']});
    markElegia();
  }
  if(path.endsWith('/epilogo')){
    const flowers=document.getElementById('flowerCoda');
    if(flowers){
      const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};
      new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});mark();
    }
  }
  addEventListener('message',event=>{
    if(event.origin!==location.origin)return;
    if(event.data?.channel==='ceniciento-music-v1'&&event.data?.type==='interlude-ended')completeAnaPart('interludio');
  });
  addEventListener('oras:ana-part-complete',event=>completeAnaPart(event.detail?.part));
}

render(true);
setupTracking();
addEventListener('pageshow',()=>render(true));
addEventListener('hashchange',()=>render(true));
addEventListener('storage',event=>{if(event.key===STORAGE)render(true)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render(true)});
setInterval(render,600);

window.ORASReadingWindowR2={version:VERSION,render,completeAnaPart};
})();
