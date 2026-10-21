(()=>{
'use strict';
const STORAGE='oras.atlas.mirror.v1';

function ensureStyle(){
  if(document.getElementById('atlas-mirror-variant-style'))return;
  const style=document.createElement('style');
  style.id='atlas-mirror-variant-style';
  style.textContent=`#mirror .atlas-mirror-variant{margin-top:1rem;padding-top:.9rem;border-top:1px solid rgba(244,239,229,.14);opacity:.82}#mirror .atlas-mirror-variant::before{content:"versión persistente";display:block;margin-bottom:.5rem;font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;opacity:.45}#mirror .atlas-mirror-variant p{margin:.2rem 0;white-space:pre-line}`;
  document.head.appendChild(style);
}

function renderVariant(scene,echo){
  if(!scene)return false;
  const copy=scene.querySelector('.mirror-copy');
  if(!copy)return false;
  const key=(echo.sourceEcho||echo.sourceSpin||'atlas').replace(/[^a-z0-9_-]/gi,'-');
  if(scene.querySelector(`[data-atlas-variant="${key}"]`))return true;

  ensureStyle();
  const variant=document.createElement('div');
  variant.className='atlas-mirror-variant';
  variant.dataset.atlasVariant=key;

  echo.text.split(/\n\n+/).forEach(block=>{
    const p=document.createElement('p');
    block.split('\n').forEach((line,i)=>{
      if(i)p.append(document.createElement('br'));
      p.append(document.createTextNode(line));
    });
    variant.appendChild(p);
  });

  copy.appendChild(variant);
  scene.dataset.atlasEcho='true';
  return true;
}

function apply(){
  let echo=null;
  try{echo=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch(_){}
  if(!echo?.active||!Number.isInteger(echo.sceneIndex)||typeof echo.text!=='string')return false;
  const scene=document.querySelectorAll('#mirror .mirror-scene')[echo.sceneIndex];
  return renderVariant(scene,echo);
}

if(!apply()){
  const mo=new MutationObserver(()=>{if(apply())mo.disconnect();});
  mo.observe(document.documentElement,{subtree:true,childList:true});
}

function installCenicientoFallback(){
  const listen=document.getElementById('listen');
  const read=document.getElementById('read');
  const entry=document.getElementById('entry');
  const readerText=document.getElementById('readerText');
  const status=document.getElementById('status');
  const voice=document.getElementById('voice');
  const pause=document.getElementById('pause');
  const restart=document.getElementById('restart');
  const switchBtn=document.getElementById('switch');
  const back=document.getElementById('back');
  if(!listen||!read||!entry||!readerText)return;
  if(!listen.disabled||!read.disabled)return;

  document.documentElement.dataset.cenicientoFallback='r46';

  if(!document.getElementById('ceniciento-r46-style')){
    const style=document.createElement('style');
    style.id='ceniciento-r46-style';
    style.textContent=`
      .entry .mode{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0!important;width:min(360px,calc(100vw - 64px))!important;margin:0 auto!important;border-top:1px solid rgba(255,250,241,.46)!important;border-bottom:1px solid rgba(255,250,241,.20)!important}
      .entry .mode button{min-height:46px!important;margin:0!important;padding:10px 18px!important;border:0!important;border-radius:0!important;background:transparent!important;color:rgba(255,250,241,.86)!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;font:500 .68rem/1 Arial,Helvetica,sans-serif!important;letter-spacing:.12em!important;text-transform:uppercase!important;opacity:.92!important;cursor:pointer!important}
      .entry .mode button+button{border-left:1px solid rgba(255,250,241,.24)!important}
      .entry .mode button:disabled{opacity:.92!important;cursor:pointer!important}
      .entry .mode button:hover,.entry .mode button:focus-visible{background:rgba(255,255,255,.055)!important;color:#fffaf1!important;outline:0!important}
    `;
    document.head.appendChild(style);
  }

  let loadedText=false;
  async function ensureText(){
    if(loadedText&&readerText.childElementCount)return;
    const r=await fetch('texto.md?v=20261021-r46',{cache:'no-store'});
    if(!r.ok)throw new Error('texto');
    let raw=(await r.text()).replace(/^#\s*CENICIENTO\s*/i,'').trim();
    readerText.innerHTML='';
    raw.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean).forEach(block=>{
      const p=document.createElement('p');
      p.textContent=block;
      readerText.appendChild(p);
    });
    loadedText=true;
  }

  function closeEntry(){entry.classList.add('open')}
  function openEntry(){entry.classList.remove('open')}
  function setMode(mode){
    document.body.classList.remove('voice','read','revealing','mirror');
    document.body.classList.add(mode);
    closeEntry();
    if(switchBtn)switchBtn.hidden=false;
    window.scrollTo(0,0);
  }

  listen.disabled=false;
  read.disabled=false;
  if(status)status.textContent='listo';

  listen.addEventListener('click',async e=>{
    e.preventDefault();
    try{await ensureText();}catch(_){}
    setMode('voice');
    if(voice){
      if(!voice.src)voice.src='ceniciento-voz-completa.mp3?v=20261010-audio-restored';
      voice.currentTime=0;
      voice.play().then(()=>{
        if(status)status.textContent='narración completa';
        if(pause){pause.disabled=false;pause.textContent='Pausa'}
      }).catch(()=>{if(status)status.textContent='Pulsa Inicio para activar la voz.'});
    }
  },true);

  read.addEventListener('click',async e=>{
    e.preventDefault();
    try{
      await ensureText();
      setMode('read');
      if(status)status.textContent='lectura sin voz';
    }catch(_){if(status)status.textContent='texto no disponible'}
  },true);

  if(pause)pause.addEventListener('click',e=>{
    if(!document.body.classList.contains('voice')||!voice)return;
    e.preventDefault();
    if(voice.paused){voice.play().catch(()=>{});pause.textContent='Pausa'}
    else{voice.pause();pause.textContent='Seguir'}
  },true);

  if(restart)restart.addEventListener('click',e=>{
    if(!voice)return;
    e.preventDefault();
    voice.currentTime=0;
    voice.play().catch(()=>{});
    if(pause)pause.textContent='Pausa';
  },true);

  if(switchBtn)switchBtn.addEventListener('click',e=>{
    e.preventDefault();
    if(voice)voice.pause();
    document.body.classList.remove('voice','read','revealing','mirror');
    switchBtn.hidden=true;
    openEntry();
    if(status)status.textContent='listo';
  },true);

  if(back)back.addEventListener('click',e=>{
    e.preventDefault();
    if(voice)voice.pause();
    location.href='../elegia-breve/?from=ceniciento-r46';
  },true);
}

setTimeout(installCenicientoFallback,900);
})();
