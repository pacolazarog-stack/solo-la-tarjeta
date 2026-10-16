(()=>{
'use strict';
if(window.__orasReadingWindowStable)return;
window.__orasReadingWindowStable=true;

const STORAGE='oras.universe.v2';
const BASE='/solo-la-tarjeta';
const MASTER_VERSION='20261014-master-index-15';
const VERSION='20261016-root-stable-5';
const ANA_DOC=`${BASE}/elegia-breve/?v=20261016-ana-route-4`;
const CURRENT_PATH=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
const params=new URLSearchParams(location.search);
const STAR_STANDALONE=`${BASE}/estrella/?music=parent&standalone=1&from=ana`;
const STAR_MUSIC_STATE='oras.ana.star.music.v1';

function leaveForStandaloneStar(){
  if(window.parent!==window)return false;
  if(!CURRENT_PATH.endsWith('/elegia-breve'))return false;
  if(location.hash.toLowerCase()!=='#estrella')return false;
  location.replace(STAR_STANDALONE);
  return true;
}
if(leaveForStandaloneStar())return;
addEventListener('hashchange',leaveForStandaloneStar);

function resumeAnaAfterPrologue(){
  if(!CURRENT_PATH.endsWith('/elegia-breve')||params.get('afterPrologue')!=='1')return;
  const clean=new URL(location.href);
  clean.searchParams.delete('afterPrologue');
  try{history.replaceState(null,'',clean.pathname+clean.search+clean.hash);}catch(_){ }

  const forceCleanAna=()=>{
    const root=document.documentElement;
    const body=document.body;
    root?.classList.remove('poem-route-loading','ceniciento-open');
    body?.classList.remove('ceniciento-open','sonrisa-open','eyes-open','locked','prelude','voice-open','portrait-revealed');
    body?.classList.add('journey-started','sound-ready','reading-ready');
    const backdrop=document.getElementById('poemBackdrop');
    if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
    const frame=document.getElementById('cenicientoFrame');
    if(frame){
      frame.hidden=true;
      frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');
      frame.removeAttribute('aria-busy');
      frame.removeAttribute('src');
      for(const prop of ['display','opacity','visibility','pointer-events','z-index','background'])frame.style.removeProperty(prop);
    }
    const entry=document.getElementById('entry');
    entry?.classList.add('is-open');
    const reading=document.getElementById('reading');
    if(reading){reading.style.removeProperty('visibility');reading.style.removeProperty('opacity');reading.style.removeProperty('display');}
    const finale=document.getElementById('portraitFinale');
    finale?.setAttribute('aria-hidden','true');
  };

  const restoreMusic=()=>{
    const music=document.getElementById('voiceMusic');
    if(!music)return;
    try{
      const saved=JSON.parse(sessionStorage.getItem(STAR_MUSIC_STATE)||'null');
      if(saved&&Number.isFinite(saved.time))music.currentTime=Math.max(0,saved.time);
      if(saved&&Number.isFinite(saved.volume))music.volume=Math.max(0,Math.min(1,saved.volume));
      if(saved?.playing){
        music.muted=false;
        music.play().catch(()=>{});
      }
      sessionStorage.removeItem(STAR_MUSIC_STATE);
    }catch(_){ }
  };

  const resume=()=>{
    const read=document.getElementById('anaRead');
    if(!read)return false;
    forceCleanAna();
    read.click();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      forceCleanAna();
      window.scrollTo({top:Math.max(0,window.innerHeight*.25),left:0,behavior:'auto'});
      restoreMusic();
    }));
    setTimeout(()=>{forceCleanAna();restoreMusic();},240);
    return true;
  };
  if(!resume())addEventListener('DOMContentLoaded',()=>setTimeout(resume,0),{once:true});
}

function installStandaloneStarContinuation(){
  if(window.parent!==window||!CURRENT_PATH.endsWith('/estrella')||params.get('standalone')!=='1')return;
  const install=()=>{
    if(document.getElementById('orasStarContinue'))return;
    const style=document.createElement('style');
    style.id='oras-star-standalone-style';
    style.textContent=`
#orasStarContinue{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;display:none;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border:1px solid rgba(234,213,165,.52);border-radius:999px;background:rgba(9,14,25,.82);color:#f8eee4;text-decoration:none;font:600 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.28)}
#orasStarContinue.is-ready{display:inline-flex}
#orasStarContinue:focus-visible{outline:2px solid #ead5a5;outline-offset:3px}
`;
    document.head.appendChild(style);

    const localMusic=document.createElement('audio');
    localMusic.id='orasStarLocalMusic';
    localMusic.src=`${BASE}/elegia-breve/ana-klaudya.m4a`;
    localMusic.preload='auto';
    localMusic.loop=true;
    localMusic.volume=.30;
    localMusic.setAttribute('playsinline','');
    localMusic.style.display='none';
    document.body.appendChild(localMusic);

    const musicStart=document.getElementById('musicStart');
    const musicEnabled=document.getElementById('musicEnabled');
    const musicLevel=document.getElementById('musicLevel');
    const musicValue=document.getElementById('musicValue');

    const syncLocalVolume=()=>{
      const level=musicLevel?Number(musicLevel.value)/100:.30;
      localMusic.volume=Math.max(0,Math.min(.8,Number.isFinite(level)?level:.30));
      localMusic.muted=musicEnabled?!musicEnabled.checked:false;
      if(musicValue&&musicLevel)musicValue.textContent=musicLevel.value+' %';
    };
    const startLocalMusic=()=>{
      syncLocalVolume();
      localMusic.muted=false;
      if(musicEnabled)musicEnabled.checked=true;
      const play=localMusic.play();
      if(play&&typeof play.then==='function'){
        play.then(()=>{if(musicStart)musicStart.hidden=true;}).catch(()=>{if(musicStart){musicStart.hidden=false;musicStart.textContent='Activar música';}});
      }
    };
    syncLocalVolume();
    localMusic.play().then(()=>{if(musicStart)musicStart.hidden=true;}).catch(()=>{if(musicStart){musicStart.hidden=false;musicStart.textContent='Activar música';}});
    musicStart?.addEventListener('click',startLocalMusic);
    musicEnabled?.addEventListener('change',()=>{
      syncLocalVolume();
      if(musicEnabled.checked)startLocalMusic();
      else localMusic.pause();
    });
    musicLevel?.addEventListener('input',syncLocalVolume);
    document.addEventListener('pointerdown',()=>{
      if(musicEnabled?.checked&&localMusic.paused)startLocalMusic();
    },{once:true,capture:true});

    const a=document.createElement('a');
    a.id='orasStarContinue';
    a.href=`${ANA_DOC}&afterPrologue=1`;
    a.textContent='Continuar · Ana Klaudya →';
    a.setAttribute('aria-label','Continuar a Ana Klaudya');
    a.addEventListener('click',()=>{
      try{sessionStorage.setItem(STAR_MUSIC_STATE,JSON.stringify({time:localMusic.currentTime||0,volume:localMusic.volume,playing:!localMusic.paused&&!localMusic.muted}));}catch(_){ }
    });
    document.body.appendChild(a);

    const final=[...document.querySelectorAll('.phrase')].at(-1);
    if(!final){a.classList.add('is-ready');return;}
    const reveal=()=>{
      if(!final.classList.contains('hidden-phrase')&&final.getAttribute('aria-hidden')!=='true'){
        a.classList.add('is-ready');
        completeAnaPart('estrella');
        return true;
      }
      return false;
    };
    if(reveal())return;
    new MutationObserver((_,obs)=>{if(reveal())obs.disconnect();}).observe(final,{attributes:true,attributeFilter:['class','aria-hidden']});
  };
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',install,{once:true});
  else install();
}

if(CURRENT_PATH===BASE){
  window.__orasSoloPrevNextR1=true;
  window.__orasSoloAutoIntroInstalled=true;
}

const ANA_PARTS=Object.freeze([
  ['estrella','Siguiendo una tarjeta',STAR_STANDALONE],
  ['elegia','Elegía breve para Ana Klaudya',ANA_DOC],
  ['ojos','En tus ojos',`${ANA_DOC}#ojos`],
  ['labios','En tus labios',`${ANA_DOC}#sonrisa`],
  ['cabello','Tu cabello',`${ANA_DOC}#cabello`],
  ['piel','Tu piel',`${ANA_DOC}#piel`],
  ['interludio','Interludio · Iba a llevarte flores',`${ANA_DOC}#interludio`],
  ['epilogo','Epílogo · A fuego lento · Flores',`${ANA_DOC}#epilogo`]
]);

const emptyParts=()=>Object.fromEntries(ANA_PARTS.map(([k])=>[k,false]));
function readState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
    saved.anaParts=Object.assign(emptyParts(),saved.anaParts&&typeof saved.anaParts==='object'?saved.anaParts:{});
    return saved;
  }catch(_){return {anaParts:emptyParts()};}
}
function writeState(patch){
  try{
    const next=Object.assign({},readState(),patch);
    localStorage.setItem(STORAGE,JSON.stringify(next));
    return next;
  }catch(_){return readState();}
}
const anaCount=parts=>ANA_PARTS.filter(([k])=>parts?.[k]===true).length;
const anaComplete=parts=>anaCount(parts)===ANA_PARTS.length;
function completeAnaPart(key){
  if(!ANA_PARTS.some(([k])=>k===key))return;
  const state=readState();
  if(state.anaParts[key]===true)return;
  const parts=Object.assign(emptyParts(),state.anaParts,{[key]:true});
  writeState({anaParts:parts,anaComplete:anaComplete(parts)});
}

const style=document.createElement('style');
style.id='oras-reading-window-stable-r8';
style.textContent=`
.ou-reading-checklist,.ou-reading-window-r2{display:none!important}
body.mirror .ou-reading-window-r2{display:none!important}
`;
document.head.appendChild(style);
document.querySelector('.ou-reading-window-r2')?.remove();

function openIndex(){
  if(window.ORASMasterIndex?.open){window.ORASMasterIndex.open();return;}
  let script=document.querySelector('script[data-oras-master-index-global]');
  if(!script){
    script=document.createElement('script');
    script.dataset.orasMasterIndexGlobal='1';
    script.src=`${BASE}/oras-master-index-r1.js?v=${MASTER_VERSION}`;
    script.addEventListener('load',()=>window.ORASMasterIndex?.open?.(),{once:true});
    document.head.appendChild(script);
  }
}

function ensureUnifiedNav(){
  const isAnaChild=['/estrella','/ojos','/sonrisa','/cabello','/piel','/interludio','/epilogo'].some(s=>CURRENT_PATH.endsWith(s));
  if(isAnaChild)return;
  if(window.__orasUnifiedNavR4||document.querySelector('script[data-oras-unified-nav-core]'))return;
  const script=document.createElement('script');
  script.dataset.orasUnifiedNavCore='1';
  script.src=`${BASE}/oras-unified-nav-r1.js?v=20261016-unified-nav-8`;
  script.defer=true;
  document.body.appendChild(script);
}

function observeEnd(selector,key,ratio=.55){
  const target=[...document.querySelectorAll(selector)].at(-1);
  if(!target||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>{
    if(entries.some(x=>x.isIntersecting&&x.intersectionRatio>=ratio)){
      io.disconnect();completeAnaPart(key);
    }
  },{threshold:[ratio,.8,1]});
  io.observe(target);
}
function setupTracking(){
  const path=CURRENT_PATH;
  if(path.endsWith('/estrella'))observeEnd('.phrase','estrella');
  if(path.endsWith('/ojos'))observeEnd('.line','ojos');
  if(path.endsWith('/sonrisa'))observeEnd('.line','labios');
  if(path.endsWith('/cabello'))observeEnd('.line','cabello');
  if(path.endsWith('/piel'))observeEnd('.line','piel');
  if(path.endsWith('/epilogo')){
    const flowers=document.getElementById('flowerCoda');
    if(flowers){
      const mark=()=>{if(!flowers.hidden)completeAnaPart('epilogo');};
      new MutationObserver(mark).observe(flowers,{attributes:true,attributeFilter:['hidden','class','style']});
      mark();
    }
  }
  if(path.endsWith('/elegia-breve')){
    const markElegia=()=>{
      const b=document.body;if(!b)return;
      if(b.classList.contains('portrait-revealed'))completeAnaPart('elegia');
    };
    new MutationObserver(markElegia).observe(document.body,{attributes:true,attributeFilter:['class']});
    markElegia();
  }
  addEventListener('message',e=>{
    if(e.origin!==location.origin)return;
    if(e.data?.channel==='ceniciento-music-v1'&&e.data?.type==='interlude-ended')completeAnaPart('interludio');
  });
  addEventListener('oras:ana-part-complete',e=>completeAnaPart(e.detail?.part));
}

resumeAnaAfterPrologue();
installStandaloneStarContinuation();
setupTracking();
ensureUnifiedNav();
window.ORASReadingWindowR2={version:VERSION,completeAnaPart,openIndex};
})();
