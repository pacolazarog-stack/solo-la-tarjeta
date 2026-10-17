(()=>{
'use strict';
if(window.__orasStarStandaloneCoreR1)return;
window.__orasStarStandaloneCoreR1=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const BASE='/solo-la-tarjeta';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261017-ana-route-2`;
const STORAGE='oras.universe.v2';
const MASTER_VOLUME='oras.master.volume.v1';
const MUSIC_STATE='oras.ana.star.music.v1';

const style=document.createElement('style');
style.textContent=`
html,body{visibility:visible!important;opacity:1!important}
body{display:block!important}
main,.intro,.controls,.status,.music-controls,.detail-background,.celestial-scene{visibility:visible!important;opacity:1!important}
main{display:grid!important;pointer-events:auto!important}
.controls,.music-controls{pointer-events:auto!important;position:relative;z-index:40}
.controls button,.music-controls button,.music-controls input,.music-controls label{pointer-events:auto!important}
#musicStart{display:inline-flex!important;align-items:center;justify-content:center;min-height:40px}
@media(max-width:760px){main{display:block!important}}
#orasStarContinue{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:76px;z-index:2147483000;display:none;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border:1px solid rgba(234,213,165,.52);border-radius:999px;background:rgba(9,14,25,.82);color:#f8eee4;text-decoration:none;font:600 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.10em;text-transform:uppercase;backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.28)}
#orasStarContinue.is-ready{display:inline-flex}
#orasStarNav{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483645;display:grid!important;grid-template-columns:1fr auto 1fr;align-items:center;width:min(560px,calc(100vw - 24px));height:48px;border:1px solid rgba(255,255,255,.18);border-radius:14px;overflow:hidden;background:rgba(10,10,10,.9);color:#f3eee6;box-shadow:0 8px 30px rgba(0,0,0,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasStarNav button{appearance:none;border:0;background:transparent;color:inherit;height:48px;padding:0 14px;font:500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;white-space:nowrap;pointer-events:auto!important}
#orasStarNav button+button{border-left:1px solid rgba(255,255,255,.10)}
#orasStarNav button:hover{background:rgba(255,255,255,.06)}
#orasStarNav [data-index]{font-weight:700;letter-spacing:.02em;padding-inline:18px}
@media(max-width:620px){#orasStarNav{bottom:max(8px,env(safe-area-inset-bottom));height:44px;border-radius:12px}#orasStarNav button{height:44px;font-size:11px;padding:0 9px}#orasStarContinue{bottom:64px}}
`;
document.head.appendChild(style);

function masterVolume(){
  try{const n=Number(localStorage.getItem(MASTER_VOLUME));return Number.isFinite(n)&&n>=0?Math.max(0,Math.min(100,n)):80;}catch(_){return 80;}
}
function markRead(){
  try{const state=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};state.anaParts=Object.assign({},state.anaParts||{},{estrella:true});localStorage.setItem(STORAGE,JSON.stringify(state));}catch(_){}
}
function saveMusicState(audio){
  try{sessionStorage.setItem(MUSIC_STATE,JSON.stringify({time:audio&&Number.isFinite(audio.currentTime)?audio.currentTime:0,volume:audio&&Number.isFinite(audio.volume)?audio.volume:masterVolume()/100,playing:!!audio&&!audio.paused&&!audio.muted}));}catch(_){}
}
function install(){
  if(window.__orasStarInstalled||window.__orasStarInstalling)return;
  window.__orasStarInstalling=true;
  try{
    document.documentElement.classList.remove('publication-pending');
    document.documentElement.style.setProperty('visibility','visible','important');
    document.documentElement.style.setProperty('opacity','1','important');
    if(!document.body){window.__orasStarInstalling=false;return;}
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

    if(paced)paced.disabled=false;
    if(full)full.disabled=false;
    if(poem)poem.hidden=false;
    if(slider){slider.max='100';slider.value=String(level);}
    if(output)output.textContent=Math.round(level)+' %';
    if(enabled)enabled.checked=level>0;
    if(start){start.hidden=false;start.textContent='Reproducir música';}

    let nav=document.getElementById('orasStarNav');
    if(!nav){
      nav=document.createElement('nav');
      nav.id='orasStarNav';
      nav.setAttribute('aria-label','Navegación ORAS');
      nav.innerHTML='<button type="button" data-prev>← Anterior</button><button type="button" data-index>Índice ORAS</button><button type="button" data-next>Siguiente →</button>';
      document.body.appendChild(nav);
    }

    let audio=null;
    try{
      audio=document.getElementById('orasStarLocalMusic');
      if(!audio){
        audio=document.createElement('audio');
        audio.id='orasStarLocalMusic';
        audio.src=`${BASE}/elegia-breve/ana-klaudya.m4a?v=20261017-star-audio-3`;
        audio.preload='auto';
        audio.loop=true;
        audio.setAttribute('playsinline','');
        audio.style.display='none';
        document.body.appendChild(audio);
      }
      audio.volume=level/100;
      audio.muted=!(enabled?enabled.checked:level>0);
      try{audio.load();}catch(_){}
    }catch(_){audio=null;}

    const setMusicLabel=()=>{
      if(!start)return;
      start.hidden=false;
      if(!audio){start.textContent='Reproducir música';return;}
      start.textContent=(!audio.paused&&!audio.muted)?'Pausar música':'Reproducir música';
    };
    const syncAudio=()=>{
      const pct=slider?Math.max(0,Math.min(100,Number(slider.value)||0)):level;
      if(output)output.textContent=Math.round(pct)+' %';
      try{localStorage.setItem(MASTER_VOLUME,String(Math.round(pct)))}catch(_){}
      if(!audio)return;
      try{audio.volume=pct/100;audio.muted=enabled?!enabled.checked:pct===0;}catch(_){}
    };
    const play=()=>{
      syncAudio();
      if(enabled)enabled.checked=true;
      if(!audio){setMusicLabel();return Promise.resolve(false);}
      try{
        audio.muted=false;
        const result=audio.play();
        if(result&&typeof result.then==='function')return result.then(()=>{setMusicLabel();return true;}).catch(()=>{setMusicLabel();return false;});
        setMusicLabel();return Promise.resolve(!audio.paused);
      }catch(_){setMusicLabel();return Promise.resolve(false);}
    };
    const pause=()=>{if(audio){try{audio.pause();}catch(_){}}setMusicLabel();};

    slider?.addEventListener('input',event=>{event.stopImmediatePropagation();syncAudio();},{capture:true});
    enabled?.addEventListener('change',event=>{event.stopImmediatePropagation();syncAudio();if(enabled.checked)play();else pause();},{capture:true});
    start?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();if(audio&&!audio.paused&&!audio.muted)pause();else play();},{capture:true});
    if(audio){audio.addEventListener('playing',setMusicLabel);audio.addEventListener('pause',setMusicLabel);audio.addEventListener('error',setMusicLabel);}
    syncAudio();setMusicLabel();

    nav.querySelector('[data-prev]')?.addEventListener('click',()=>{location.href=`${BASE}/?read=solo`;});
    nav.querySelector('[data-index]')?.addEventListener('click',()=>{location.href=`${BASE}/?indice=1`;});
    nav.querySelector('[data-next]')?.addEventListener('click',()=>{saveMusicState(audio);location.href=`${ANA_DOC}&afterPrologue=1`;});

    let timer=null,index=0,mode='ready';
    const clearTimer=()=>{if(timer!==null)clearTimeout(timer);timer=null;};
    const setPhraseVisible=(phrase,visible)=>{phrase.classList.toggle('hidden-phrase',!visible);if(visible)phrase.removeAttribute('aria-hidden');else phrase.setAttribute('aria-hidden','true');};
    const ensureContinue=()=>{
      let cont=document.getElementById('orasStarContinue');
      if(!cont){cont=document.createElement('a');cont.id='orasStarContinue';cont.href=`${ANA_DOC}&afterPrologue=1`;cont.textContent='Continuar · Ana Klaudya →';cont.addEventListener('click',()=>saveMusicState(audio));document.body.appendChild(cont);}
      return cont;
    };
    ensureContinue();
    const finish=()=>{clearTimer();mode='done';if(paced)paced.textContent='Volver a leer';if(status)status.textContent='Silencio.';markRead();ensureContinue().classList.add('is-ready');};
    const revealNext=()=>{if(mode!=='playing')return;if(index>=phrases.length){finish();return;}const phrase=phrases[index++];setPhraseVisible(phrase,true);timer=setTimeout(revealNext,Math.max(1000,Number(phrase.dataset.wait)||4500));};
    const startPaced=()=>{clearTimer();index=0;phrases.forEach(p=>setPhraseVisible(p,false));mode='playing';if(paced)paced.textContent='Pausar';if(status)status.textContent='Deja respirar cada frase.';revealNext();};
    const showFull=()=>{clearTimer();phrases.forEach(p=>setPhraseVisible(p,true));index=phrases.length;mode='full';if(paced)paced.textContent='Leer con pausas';if(status)status.textContent='A tu ritmo.';markRead();ensureContinue().classList.add('is-ready');};

    paced?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();play();if(mode==='playing'){clearTimer();mode='paused';paced.textContent='Continuar';if(status)status.textContent='Una pausa, a tu elección.';return;}if(mode==='paused'){mode='playing';paced.textContent='Pausar';if(status)status.textContent='Deja respirar cada frase.';revealNext();return;}startPaced();},{capture:true});
    full?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();play();showFull();},{capture:true});

    const allVisible=phrases.length&&phrases.every(p=>!p.classList.contains('hidden-phrase'));
    if(allVisible)showFull();
    window.__orasStarInstalled=true;
    play();
  }catch(_){
    const start=document.getElementById('musicStart');
    if(start){start.hidden=false;start.textContent='Reproducir música';}
  }finally{
    window.__orasStarInstalling=false;
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
addEventListener('pageshow',install);
})();