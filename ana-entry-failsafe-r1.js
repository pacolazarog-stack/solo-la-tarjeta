(()=>{
'use strict';
if(window.__orasAnaEntryFailsafeR11)return;
window.__orasAnaEntryFailsafeR11=true;

const ANA_ROOT='/solo-la-tarjeta/elegia-breve';
const POEM_ROUTES=new Set(['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']);
const STAR_MUSIC_STATE='oras.ana.star.music.v1';
const MASTER_VOLUME='oras.master.volume.v1';
const isAnaRoot=()=>location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')===ANA_ROOT;
const route=()=>location.hash.replace(/^#/,'').toLowerCase();

/* Las URLs antiguas de ANA #estrella podían quedar en un lienzo claro sin iframe visible.
   Se redirigen una sola vez al prólogo autónomo válido. */
const params=new URLSearchParams(location.search);
const legacyVersion=(params.get('v')||'').toLowerCase();
if(isAnaRoot()&&route()==='estrella'&&legacyVersion.includes('20261016-ana-route')){
  location.replace('/solo-la-tarjeta/estrella/?music=parent&standalone=1&from=ana&v=20261018-legacy-star-r11');
  return;
}

const style=document.createElement('style');
style.id='oras-ana-direct-route-r11';
style.textContent=`
html[data-oras-ana-route] #cenicientoFrame,
html[data-oras-ana-route] #cenicientoFrame[hidden]{display:block!important;position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border:0!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;z-index:2147482000!important;background:#090e19!important;}
html[data-oras-ana-route] #poemBackdrop{display:block!important;position:fixed!important;inset:0!important;z-index:2147481900!important;background:#090e19!important;}
html[data-oras-ana-resumed="1"] #reading{display:block!important;visibility:visible!important;opacity:1!important;}
html[data-oras-ana-resumed="1"] body{overflow:auto!important;touch-action:auto!important;}
html[data-oras-ana-resumed="1"] .entry{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}
html[data-oras-ana-resumed="1"] #poemBackdrop,html[data-oras-ana-resumed="1"] #cenicientoFrame{display:none!important;visibility:hidden!important;pointer-events:none!important;}
html[data-oras-ana-fallback="1"] #reading .line{opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;}
html[data-oras-ana-after-star="1"] body{background:#eef1e9!important;color:#201d19!important;}
html[data-oras-ana-after-star="1"] .world{display:block!important;visibility:visible!important;opacity:1!important;}
html[data-oras-ana-after-star="1"] .entry{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;background:#eef1e9!important;z-index:2147482500!important;}
html[data-oras-ana-after-star="1"] .entry-title{display:block!important;visibility:visible!important;opacity:1!important;color:#201d19!important;}
html[data-oras-ana-after-star="1"] #entryButton,html[data-oras-ana-after-star="1"] .entry-actions{display:none!important;}
html[data-oras-ana-after-star="1"] .entry-inner{gap:0!important;}
html[data-oras-ana-after-star="1"] #poemBackdrop,html[data-oras-ana-after-star="1"] #cenicientoFrame{display:none!important;visibility:hidden!important;}
html[data-oras-ana-after-star="1"] #orasUnifiedNav{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483646!important;}
html[data-oras-ana-after-star="1"] #soundToggle{display:grid!important;visibility:visible!important;opacity:1!important;z-index:2147483646!important;}
`;
document.head.appendChild(style);

function unlockChild(frame,piece){
  try{
    const doc=frame.contentDocument;
    if(!doc?.documentElement||!doc.body)return;
    doc.documentElement.classList.remove('publication-pending');
    doc.body.style.setProperty('visibility','visible','important');
    doc.body.style.setProperty('opacity','1','important');
    if(piece==='estrella'){
      const main=doc.querySelector('main');
      if(main){main.style.setProperty('visibility','visible','important');main.style.setProperty('opacity','1','important');}
      const intro=doc.querySelector('.intro');
      if(intro){intro.style.setProperty('visibility','visible','important');intro.style.setProperty('opacity','1','important');}
    }
  }catch(_){}
}

function releaseDirectRoute(){
  if(!isAnaRoot())return;
  const root=document.documentElement,body=document.body,frame=document.getElementById('cenicientoFrame'),backdrop=document.getElementById('poemBackdrop');
  root.removeAttribute('data-oras-ana-route');root.classList.remove('poem-route-loading','ceniciento-open');
  if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}
  if(frame){frame.hidden=true;frame.classList.remove('sonrisa-transition','sonrisa-visible','sonrisa-leaving','interlude-transition');frame.removeAttribute('aria-busy');for(const prop of ['display','opacity','visibility','pointer-events','z-index','background','position','inset','width','height'])frame.style.removeProperty(prop);}
  if(body){body.classList.remove('ceniciento-open','sonrisa-open','eyes-open');if(body.classList.contains('reading-ready'))body.classList.remove('locked');}
}

function applyDirectRoute(){
  if(!isAnaRoot())return;
  const piece=route(),root=document.documentElement;
  if(!POEM_ROUTES.has(piece)){releaseDirectRoute();return;}
  root.setAttribute('data-oras-ana-route',piece);root.classList.remove('publication-pending','poem-route-loading','oras-master-entry');root.classList.add('ceniciento-open');
  const body=document.body,frame=document.getElementById('cenicientoFrame'),backdrop=document.getElementById('poemBackdrop');if(!body||!frame)return;
  body.classList.add('journey-started','ceniciento-open','sonrisa-open');body.classList.toggle('eyes-open',piece==='ojos');body.classList.remove('locked');
  if(backdrop){backdrop.hidden=false;backdrop.style.setProperty('display','block','important');}
  frame.hidden=false;frame.classList.add('sonrisa-transition','sonrisa-visible');frame.classList.remove('sonrisa-leaving');frame.removeAttribute('aria-busy');
  const expected=`../${piece}/?music=parent&v=20261018-ana-direct-route-r11`,current=frame.getAttribute('src')||'';
  if(!current.includes(`/${piece}/`)||!current.includes('r11'))frame.src=expected;
  unlockChild(frame,piece);
  frame.addEventListener('load',()=>{unlockChild(frame,piece);frame.style.setProperty('opacity','1','important');frame.style.setProperty('visibility','visible','important');},{once:true});
  setTimeout(()=>{if(route()===piece){frame.hidden=false;frame.style.setProperty('display','block','important');frame.style.setProperty('opacity','1','important');frame.style.setProperty('visibility','visible','important');unlockChild(frame,piece);}},700);
}

function readStarState(){try{return JSON.parse(sessionStorage.getItem(STAR_MUSIC_STATE)||'null');}catch(_){return null;}}
function masterLevel(saved){try{const raw=Number(localStorage.getItem(MASTER_VOLUME));if(Number.isFinite(raw)&&raw>=0)return Math.max(0,Math.min(1,raw/100));}catch(_){}if(saved&&Number.isFinite(saved.volume))return Math.max(0,Math.min(1,saved.volume));return 1;}
function restoreAnaMusic(saved){const music=document.getElementById('voiceMusic');if(!music)return;const level=masterLevel(saved);try{if(saved&&Number.isFinite(saved.time))music.currentTime=Math.max(0,saved.time);music.volume=level;music.muted=level<=0;const enabled=document.getElementById('musicEnabled');if(enabled)enabled.checked=level>0;const slider=document.getElementById('musicLevel');if(slider){slider.max='100';slider.value=String(Math.round(level*100));slider.dispatchEvent(new Event('input',{bubbles:true}));}if(saved?.playing!==false&&level>0)music.play().catch(()=>{});}catch(_){}}
function ensureUnifiedNavVisible(){const install=()=>{let nav=document.getElementById('orasUnifiedNav');if(nav){nav.hidden=false;nav.style.removeProperty('display');nav.style.removeProperty('visibility');nav.style.removeProperty('opacity');return;}if(!document.querySelector('script[data-oras-hotfix-nav]')){const s=document.createElement('script');s.dataset.orasHotfixNav='1';s.src='/solo-la-tarjeta/oras-unified-nav-r1.js?v=20261018-after-star-r11';s.defer=true;document.body.appendChild(s);}};install();setTimeout(install,100);setTimeout(install,600);setTimeout(install,1500);}
function forceAnaReading(saved=null,fallback=false){if(!isAnaRoot()||route())return false;const root=document.documentElement,body=document.body;if(!body)return false;root.removeAttribute('data-oras-ana-route');root.removeAttribute('data-oras-ana-after-star');root.classList.remove('publication-pending','poem-route-loading','ceniciento-open','oras-master-entry');root.setAttribute('data-oras-ana-resumed','1');if(fallback)root.setAttribute('data-oras-ana-fallback','1');body.classList.remove('locked','prelude','ceniciento-open','sonrisa-open','eyes-open','voice-open','portrait-revealed');body.classList.add('journey-started','sound-ready','reading-ready');const entry=document.getElementById('entry');if(entry)entry.classList.add('is-open');const backdrop=document.getElementById('poemBackdrop');if(backdrop){backdrop.hidden=true;backdrop.classList.remove('is-leaving');}const frame=document.getElementById('cenicientoFrame');if(frame){frame.hidden=true;frame.removeAttribute('src');frame.removeAttribute('aria-busy');}const reading=document.getElementById('reading');if(reading){reading.hidden=false;reading.style.removeProperty('display');reading.style.removeProperty('visibility');reading.style.removeProperty('opacity');}restoreAnaMusic(saved);ensureUnifiedNavVisible();requestAnimationFrame(()=>{window.scrollTo({top:0,left:0,behavior:'auto'});restoreAnaMusic(saved);window.dispatchEvent(new Event('scroll'));window.dispatchEvent(new Event('resize'));});return true;}
function resumeFromStar(){if(!isAnaRoot()||route())return false;const saved=readStarState(),qs=new URLSearchParams(location.search),v=(qs.get('v')||'').toLowerCase();const requested=qs.get('afterPrologue')==='1'||qs.get('afterStar')==='1'||qs.get('from')==='star'||v.includes('after-star');if(!saved&&!requested)return false;if(window.__orasAnaAfterStarActive)return true;window.__orasAnaAfterStarActive=true;const root=document.documentElement,body=document.body;root.setAttribute('data-oras-ana-after-star','1');root.classList.remove('publication-pending','poem-route-loading','oras-master-entry','ceniciento-open');body?.classList.add('locked','journey-started','sound-ready');body?.classList.remove('reading-ready','prelude','ceniciento-open','sonrisa-open','eyes-open','voice-open','portrait-revealed');const entry=document.getElementById('entry');if(entry){entry.classList.remove('is-open');entry.hidden=false;}const entryButton=document.getElementById('entryButton');if(entryButton)entryButton.hidden=true;const backdrop=document.getElementById('poemBackdrop');if(backdrop)backdrop.hidden=true;const frame=document.getElementById('cenicientoFrame');if(frame){frame.hidden=true;frame.removeAttribute('src');}restoreAnaMusic(saved);ensureUnifiedNavVisible();window.__orasAnaAfterStarTimer=setTimeout(()=>{window.__orasAnaAfterStarTimer=null;window.__orasAnaAfterStarActive=false;forceAnaReading(saved,false);try{sessionStorage.removeItem(STAR_MUSIC_STATE);}catch(_){}},5000);return true;}
function installStartFallback(){if(!isAnaRoot())return;const button=document.getElementById('entryButton');if(!button||button.dataset.orasFallback==='1')return;button.dataset.orasFallback='1';button.addEventListener('click',()=>{setTimeout(()=>{const entry=document.getElementById('entry'),body=document.body;const failed=(!!entry&&!entry.classList.contains('is-open'))||!!body?.classList.contains('locked');if(failed)forceAnaReading(null,true);restoreAnaMusic(null);},900);},true);}
function schedule(){if(resumeFromStar())return;applyDirectRoute();installStartFallback();setTimeout(()=>{if(!resumeFromStar()){applyDirectRoute();installStartFallback();}},120);setTimeout(()=>{if(!resumeFromStar()){applyDirectRoute();installStartFallback();}},700);setTimeout(()=>{if(!resumeFromStar()){applyDirectRoute();installStartFallback();}},1800);}
addEventListener('DOMContentLoaded',schedule,{once:true});addEventListener('pageshow',()=>{if(!resumeFromStar())applyDirectRoute();installStartFallback();});addEventListener('hashchange',applyDirectRoute);addEventListener('popstate',()=>{if(!resumeFromStar())applyDirectRoute();});if(document.readyState!=='loading')schedule();
})();