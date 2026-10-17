(()=>{
'use strict';
if(window.__orasStarStandaloneCoreR1)return;
window.__orasStarStandaloneCoreR1=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const BASE='/solo-la-tarjeta';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261017-ana-route-1`;
const STORAGE='oras.universe.v2';
const MASTER_VOLUME='oras.master.volume.v1';
const MUSIC_STATE='oras.ana.star.music.v1';

const style=document.createElement('style');
style.textContent=`
html,body{visibility:visible!important;opacity:1!important}
body{display:block!important}
main,.intro,.controls,.status,.music-controls,.detail-background,.celestial-scene{visibility:visible!important;opacity:1!important}
main{display:grid!important;pointer-events:auto!important}
.controls,.music-controls{pointer-events:auto!important;position:relative;z-index:20}
.controls button,.music-controls button,.music-controls input,.music-controls label{pointer-events:auto!important}
@media(max-width:760px){main{display:block!important}}
#orasStarContinue{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;display:none;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border:1px solid rgba(234,213,165,.52);border-radius:999px;background:rgba(9,14,25,.82);color:#f8eee4;text-decoration:none;font:600 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.28)}
#orasStarContinue.is-ready{display:inline-flex}
`;
document.head.appendChild(style);

function masterVolume(){
  try{
    const n=Number(localStorage.getItem(MASTER_VOLUME));
    return Number.isFinite(n)&&n>=0?Math.max(0,Math.min(100,n)):80;
  }catch(_){return 80;}
}
function markRead(){
  try{
    const state=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
    state.anaParts=Object.assign({},state.anaParts||{}, {estrella:true});
    localStorage.setItem(STORAGE,JSON.stringify(state));
  }catch(_){ }
}
function install(){
  document.documentElement.classList.remove('publication-pending');
  document.documentElement.style.setProperty('visibility','visible','important');
  document.documentElement.style.setProperty('opacity','1','important');
  if(!document.body)return;
  document.body.style.setProperty('visibility','visible','important');
  document.body.style.setProperty('opacity','1','important');
  document.body.removeAttribute('aria-hidden');

  const paced=document.getElementById('paced');
  const full=document.getElementById('full');
  const status=document.getElementById('status');
  const poem=document.getElementById('poem');
  const phrases=[...document.querySelectorAll('.phrase')];
  const slider=document.getElementById('musicLevel');
  const output=document.getElementById('musicValue');
  const enabled=document.getElementById('musicEnabled');
  const start=document.getElementById('musicStart');
  const level=masterVolume();

  if(paced) paced.disabled=false;
  if(full) full.disabled=false;
  if(poem) poem.hidden=false;
  if(slider){slider.max='100';slider.value=String(level);}
  if(output)output.textContent=Math.round(level)+' %';
  if(enabled)enabled.checked=level>0;

  let audio=document.getElementById('orasStarLocalMusic');
  if(!audio){
    audio=document.createElement('audio');
    audio.id='orasStarLocalMusic';
    audio.src=`${BASE}/elegia-breve/ana-klaudya.m4a?v=20261017-star-audio-1`;
    audio.preload='auto';
    audio.loop=true;
    audio.playsInline=true;
    audio.style.display='none';
    document.body.appendChild(audio);
  }

  const syncAudio=()=>{
    const pct=slider?Math.max(0,Math.min(100,Number(slider.value)||0)):level;
    audio.volume=pct/100;
    audio.muted=enabled?!enabled.checked:pct===0;
    if(output)output.textContent=Math.round(pct)+' %';
    try{localStorage.setItem(MASTER_VOLUME,String(Math.round(pct)))}catch(_){ }
  };
  const showStart=()=>{if(start){start.hidden=false;start.textContent='Activar música';}};
  const hideStart=()=>{if(start)start.hidden=true;};
  const play=()=>{
    syncAudio();
    if(enabled)enabled.checked=true;
    audio.muted=false;
    return audio.play().then(hideStart).catch(err=>{showStart();throw err;});
  };
  const primeAudio=()=>{if(enabled?.checked&&audio.paused)play().catch(()=>{});};

  slider?.addEventListener('input',event=>{event.stopImmediatePropagation();syncAudio();},{capture:true});
  enabled?.addEventListener('change',event=>{
    event.stopImmediatePropagation();
    syncAudio();
    if(enabled.checked) play().catch(()=>{}); else {audio.pause();showStart();}
  },{capture:true});
  start?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();play().catch(()=>{});},{capture:true});
  syncAudio();
  showStart();
  play().catch(()=>{});
  document.addEventListener('pointerdown',primeAudio,{once:true,capture:true});
  document.addEventListener('keydown',primeAudio,{once:true,capture:true});

  let timer=null;
  let index=0;
  let mode='ready';
  const clearTimer=()=>{if(timer!==null)clearTimeout(timer);timer=null;};
  const setPhraseVisible=(phrase,visible)=>{
    phrase.classList.toggle('hidden-phrase',!visible);
    if(visible)phrase.removeAttribute('aria-hidden'); else phrase.setAttribute('aria-hidden','true');
  };
  const finish=()=>{
    clearTimer();mode='done';
    if(paced)paced.textContent='Volver a leer';
    if(status)status.textContent='Silencio.';
    markRead();
    document.getElementById('orasStarContinue')?.classList.add('is-ready');
  };
  const revealNext=()=>{
    if(mode!=='playing')return;
    if(index>=phrases.length){finish();return;}
    const phrase=phrases[index++];
    setPhraseVisible(phrase,true);
    timer=setTimeout(revealNext,Math.max(1000,Number(phrase.dataset.wait)||4500));
  };
  const startPaced=()=>{
    clearTimer();index=0;phrases.forEach(p=>setPhraseVisible(p,false));
    mode='playing';
    if(paced)paced.textContent='Pausar';
    if(status)status.textContent='Deja respirar cada frase.';
    revealNext();
  };
  const showFull=()=>{
    clearTimer();phrases.forEach(p=>setPhraseVisible(p,true));index=phrases.length;mode='full';
    if(paced)paced.textContent='Leer con pausas';
    if(status)status.textContent='A tu ritmo.';
    markRead();
    document.getElementById('orasStarContinue')?.classList.add('is-ready');
  };

  paced?.addEventListener('click',event=>{
    event.preventDefault();event.stopImmediatePropagation();primeAudio();
    if(mode==='playing'){
      clearTimer();mode='paused';paced.textContent='Continuar';if(status)status.textContent='Una pausa, a tu elección.';return;
    }
    if(mode==='paused'){
      mode='playing';paced.textContent='Pausar';if(status)status.textContent='Deja respirar cada frase.';revealNext();return;
    }
    startPaced();
  },{capture:true});
  full?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();primeAudio();showFull();},{capture:true});

  let cont=document.getElementById('orasStarContinue');
  if(!cont){
    cont=document.createElement('a');
    cont.id='orasStarContinue';
    cont.href=`${ANA_DOC}&afterPrologue=1`;
    cont.textContent='Continuar · Ana Klaudya →';
    cont.addEventListener('click',()=>{
      try{sessionStorage.setItem(MUSIC_STATE,JSON.stringify({time:audio.currentTime||0,volume:audio.volume,playing:!audio.paused&&!audio.muted}));}catch(_){ }
    });
    document.body.appendChild(cont);
  }

  // Si el script antiguo ya dejó el poema completo, respetamos ese estado y habilitamos el recorrido.
  const allVisible=phrases.length&&phrases.every(p=>!p.classList.contains('hidden-phrase'));
  if(allVisible)showFull();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
addEventListener('pageshow',install);
})();