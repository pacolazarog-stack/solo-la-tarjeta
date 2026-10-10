(()=>{
'use strict';

const VERSION='20261010-29';
const STORAGE='oras.universe.v2';
const rootPath='/solo-la-tarjeta/';
const GHOSTS=Object.freeze({
  before:'Hay historias que empiezan antes.',
  origin:'El origen suele parecer insignificante.',
  absence:'Falta una versión de la historia.',
  return:'Nadie regresa al mismo lugar.'
});
const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'') || '/';
const page={
  solo:path==='/solo-la-tarjeta' || path==='/solo-la-tarjeta/index.html',
  ana:path.endsWith('/elegia-breve'),
  ojos:path.endsWith('/ojos'),
  sonrisa:path.endsWith('/sonrisa'),
  epilogo:path.endsWith('/epilogo'),
  estrella:path.endsWith('/estrella'),
  cabello:path.endsWith('/cabello'),
  piel:path.endsWith('/piel'),
  interludio:path.endsWith('/interludio'),
  ceniciento:path.endsWith('/ceniciento')
};

function emptyState(){
  return {journeyStartedAt:0,cardFound:false,soloComplete:false,anaComplete:false,cenicientoComplete:false,cenicientoUnlocked:false,mirrorReadComplete:false,returnedFromCeniciento:false,ghosts:{}};
}
let memoryState=null;
function readState(){
  let saved;
  try{const raw=localStorage.getItem(STORAGE);saved=raw?JSON.parse(raw):memoryState;}
  catch(_){saved=memoryState;}
  if(!saved||!Number.isFinite(saved.journeyStartedAt)||saved.journeyStartedAt<=0)return emptyState();
  const current=Object.assign(emptyState(),saved);
  for(const key of ['cardFound','soloComplete','anaComplete','cenicientoComplete','cenicientoUnlocked','mirrorReadComplete','returnedFromCeniciento'])current[key]=saved[key]===true;
  current.ghosts=saved.ghosts&&typeof saved.ghosts==='object'?saved.ghosts:{};
  return current;
}
let state=readState();
function save(patch={}){
  state=Object.assign({},readState(),patch);
  if(!state.ghosts)state.ghosts={};
  memoryState=state;
  try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(_){}
  return state;
}
function beginJourney(){
  state=readState();
  if(!state.journeyStartedAt)save(Object.assign(emptyState(),{journeyStartedAt:Date.now()}));
  ensureChecklist();
}
window.addEventListener('oras:reading-start',()=>{if(page.ana)beginJourney();});
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE&&event.key!==null)return;
  state=readState();ensureChecklist();
  if(page.ana)addUnlockedAnaDoors();
});
window.addEventListener('pageshow',()=>{state=readState();ensureChecklist();});

function markGhost(key){save({ghosts:Object.assign({},state.ghosts||{}, {[key]:true})});}
function seenGhost(key){return !!(state.ghosts&&state.ghosts[key]);}
function topGo(url){try{window.top.location.href=url;}catch(_){location.href=url;}}
function after(ms,fn){return setTimeout(fn,ms);}

function installBaseStyles(){
  if(document.getElementById('oras-universe-style'))return;
  const style=document.createElement('style');
  style.id='oras-universe-style';
  style.textContent=`
  .ou-ghost{position:fixed;z-index:72;max-width:min(35rem,72vw);margin:0;padding:0;color:currentColor;font:italic 400 clamp(.72rem,1.25vw,.93rem)/1.45 Georgia,"Times New Roman",serif;letter-spacing:.015em;opacity:0;pointer-events:none;filter:blur(.08px);transition:opacity 1.8s ease;mix-blend-mode:normal}
  .ou-ghost.ou-on{opacity:.32}.ou-ghost.ou-fade{opacity:0}.ou-ghost.ou-left{left:max(18px,3.5vw);top:18vh;text-align:left}.ou-ghost.ou-right{right:max(18px,3.5vw);top:28vh;text-align:right}.ou-ghost.ou-low{right:max(18px,4vw);bottom:15vh;text-align:right}
  .ou-card{position:fixed;z-index:74;left:max(26px,4.2vw);bottom:calc(env(safe-area-inset-bottom,0px) + 88px);width:116px;height:72px;padding:0;border:1px solid rgba(255,255,255,.26);border-radius:9px;background:linear-gradient(145deg,rgba(62,68,77,.99),rgba(20,24,30,.99));box-shadow:0 15px 38px rgba(0,0,0,.36),0 0 0 1px rgba(0,0,0,.22),inset 0 0 0 1px rgba(255,255,255,.11),0 0 30px rgba(192,151,65,.25);opacity:.98;transform:rotate(-5deg);cursor:pointer;touch-action:manipulation;transition:opacity .45s ease,transform .45s ease,box-shadow .45s ease;animation:ouCardHint 5.3s ease-in-out infinite}
  .ou-card::before{content:"";position:absolute;left:16px;top:16px;width:27px;height:20px;border-radius:4px;background:linear-gradient(135deg,#b98b2e,#f1d98b 48%,#9e7220);box-shadow:inset 0 0 0 1px rgba(70,49,13,.48),0 1px 5px rgba(0,0,0,.25)}
  .ou-card::after{content:"";position:absolute;left:16px;right:16px;bottom:15px;height:3px;border-radius:3px;background:rgba(246,244,238,.88);box-shadow:0 -10px 0 rgba(246,244,238,.33),0 -20px 0 rgba(246,244,238,.13)}
  .ou-card:hover,.ou-card:focus-visible{opacity:1;transform:rotate(-2deg) translateY(-4px) scale(1.065);box-shadow:0 18px 46px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.15),0 0 40px rgba(213,174,91,.40);outline:none;animation:none}
  @keyframes ouCardHint{0%,70%,100%{transform:rotate(-5deg) scale(1)}82%{transform:rotate(-4deg) scale(1.045)}}
  .ou-transition{position:fixed;inset:0;z-index:9999;background:rgba(16,15,14,0);pointer-events:none;transition:background 1.25s ease}.ou-transition.ou-on{background:rgba(16,15,14,.95)}
  .ou-symbolic{cursor:pointer;font:inherit;font-weight:inherit;color:inherit;text-decoration-line:underline;text-decoration-style:solid;text-decoration-thickness:.055em;text-underline-offset:.20em;text-decoration-color:transparent;transition:color .5s ease,text-decoration-color .5s ease,text-shadow .5s ease,opacity .5s ease}
  .ou-symbolic:hover,.ou-symbolic:focus-visible{color:rgba(92,67,47,.92);text-decoration-color:rgba(92,67,47,.28);text-shadow:0 0 12px rgba(112,72,38,.08);outline:none}
  .ou-solo-endnav{position:relative;z-index:82;left:auto;bottom:auto;transform:translateY(8px);display:flex;align-items:center;justify-content:center;gap:12px;width:max-content;max-width:92vw;margin:2rem auto max(28px,env(safe-area-inset-bottom));opacity:0;visibility:hidden;transition:opacity .7s ease,transform .7s ease,visibility .7s ease;text-align:center}.ou-solo-endnav.ou-visible{opacity:1;visibility:visible;transform:translateY(0)}
  .ou-ceniciento-endnav{position:fixed;z-index:82;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 20px);transform:translateX(-50%) translateY(8px);display:flex;align-items:center;justify-content:center;gap:12px;width:max-content;max-width:92vw;opacity:0;visibility:hidden;transition:opacity .7s ease,transform .7s ease,visibility .7s ease;text-align:center}.ou-ceniciento-endnav.ou-visible{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
  .ou-ceniciento-endnav[hidden]{display:none!important}
  .reading-end{display:block;height:1px;width:100%}
  .ou-reading-checklist{position:fixed;z-index:90;right:max(10px,env(safe-area-inset-right));bottom:calc(78px + env(safe-area-inset-bottom));color:#f7f1e8;font:.78rem/1.4 Georgia,"Times New Roman",serif}
  body.read .ou-reading-checklist{position:relative;right:auto;bottom:auto;display:block;width:max-content;max-width:calc(100% - 24px);margin:0 auto 5rem}
  .ou-reading-checklist summary{width:max-content;margin-left:auto;cursor:pointer;list-style:none;padding:7px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(12,12,12,.84);touch-action:manipulation}
  .ou-reading-checklist summary::-webkit-details-marker{display:none}
  .ou-reading-checklist ul{position:absolute;right:0;bottom:calc(100% + 8px);margin:0;padding:9px 12px;list-style:none;border:1px solid rgba(255,255,255,.18);border-radius:9px;background:rgba(12,12,12,.92)}
  .ou-reading-checklist li{white-space:nowrap}.ou-reading-checklist li+li{margin-top:5px}.ou-reading-checklist [data-done="true"]::before{content:"✓ ";color:#d8c18d}.ou-reading-checklist [data-done="false"]::before{content:"· ";opacity:.55}
  .ou-reading-checklist[hidden]{display:none!important}
  .ou-reading-checklist [data-done="false"]{color:#c8c5bf}
  body.mirror .ou-reading-checklist{display:none}
  body.mirror>:not(#mirror):not(script):not(style){display:none!important}
  body.mirror{touch-action:pan-y}
  body.mirror #mirror{opacity:1;visibility:visible;width:100%;max-width:none;margin:0;padding:0;transform:none;transition:none;touch-action:pan-y;position:fixed;z-index:100;inset:0;display:block;height:100svh;overflow-y:auto;overscroll-behavior:contain;scroll-snap-type:y mandatory;background:#100e0d;color:#f7f1e8;scrollbar-width:none}
  body.mirror #mirror::-webkit-scrollbar{display:none}
  body.mirror .mirror-scene{position:relative;display:grid;place-items:center;min-height:100svh;padding:clamp(32px,8svh,76px) clamp(24px,7vw,90px);scroll-snap-align:start;scroll-snap-stop:always}
  body.mirror .mirror-copy{width:min(100%,65ch);margin:0 auto;text-align:center;font-size:clamp(1.22rem,3.4vw,2rem);line-height:1.5;white-space:pre-line;text-wrap:balance}
  body.mirror .mirror-copy p{margin:.45em 0}body.mirror .mirror-scene[data-pause="true"]{padding-bottom:104px}
  body.mirror .mirror-continue{position:absolute;left:50%;bottom:max(20px,env(safe-area-inset-bottom));transform:translateX(-50%);min-width:64px;min-height:48px;border:0;border-bottom:1px solid rgba(255,250,241,.32);padding:8px 18px;background:transparent;color:rgba(255,250,241,.72);font:italic 1rem Georgia,"Times New Roman",serif;cursor:pointer;touch-action:manipulation}
  body.mirror .mirror-continue[hidden]{display:none}body.mirror .mirror-end-sentinel{display:block;width:100%;height:1px}
  body.mirror .ou-ceniciento-endnav{position:relative;left:auto;bottom:auto;transform:none;z-index:auto;flex-wrap:wrap;width:min(100%,34rem);margin:clamp(24px,5vh,46px) auto 0;opacity:1;visibility:visible;gap:12px}
  body.mirror .ou-ceniciento-endnav.ou-visible{transform:none}
  .ou-ceniciento-endnav .ou-card-exit{min-width:180px;min-height:58px;padding:13px 22px;border:1px solid rgba(71,57,37,.42);border-radius:9px 5px 10px 6px;background:linear-gradient(145deg,#f1e6d2,#d9c9a9);color:#29231c;text-shadow:none;box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.4);letter-spacing:.045em}
  .ou-ceniciento-endnav .ou-card-exit:hover,.ou-ceniciento-endnav .ou-card-exit:focus-visible{background:linear-gradient(145deg,#fff2db,#e5d3b1);border-color:#f1dfbc;outline:2px solid rgba(255,250,241,.82);outline-offset:3px}
  body.mirror .mirror-scene.mirror-finished{display:flex;flex-direction:column;justify-content:center;align-items:center}
  body.mirror .mirror-scene.mirror-finished .mirror-copy{margin:auto auto 0}
  body.read .ou-ceniciento-endnav{position:relative;left:auto;bottom:auto;transform:translateY(8px);margin:1rem auto 2rem}
  body.read .ou-ceniciento-endnav.ou-visible{transform:translateY(0)}
  body.voice.ou-ceniciento-navigation-visible .screen.final{bottom:calc(8.5svh + 84px)}
  body.voice.ou-ceniciento-navigation-visible .status{bottom:calc(env(safe-area-inset-bottom,0px) + 84px)}
  .ou-solo-endnav a,.ou-ceniciento-endnav a{box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-width:48px;min-height:48px;padding:12px 20px;border:1px solid rgba(255,250,241,.28);border-radius:999px;background:rgba(12,12,12,.82);color:#fffaf1;text-decoration:none;font:italic 400 clamp(.96rem,1.8vw,1.14rem)/1.25 Georgia,"Times New Roman",serif;letter-spacing:.025em;text-shadow:0 2px 18px rgba(0,0,0,.9);opacity:.94;transition:opacity .25s ease,background-color .25s ease,border-color .25s ease}
  .ou-solo-endnav a:hover,.ou-solo-endnav a:focus-visible,.ou-ceniciento-endnav a:hover,.ou-ceniciento-endnav a:focus-visible{opacity:1;background:rgba(28,26,23,.98);border-color:rgba(255,250,241,.72);outline:2px solid rgba(255,250,241,.82);outline-offset:3px}.ou-solo-endnav a:active,.ou-ceniciento-endnav a:active{background:rgba(58,51,42,.98)}
  @media(max-width:700px){.ou-solo-endnav,.ou-ceniciento-endnav{gap:8px}.ou-solo-endnav a,.ou-ceniciento-endnav a{padding:11px 13px}.ou-card{left:max(16px,env(safe-area-inset-left));bottom:calc(env(safe-area-inset-bottom,0px) + 88px);width:112px;height:70px}.ou-card::before{left:16px;top:15px;width:27px;height:19px}.ou-card::after{left:16px;right:16px;bottom:14px}.ou-ghost{max-width:68vw}.ou-ghost.ou-left{left:16px;top:14vh}.ou-ghost.ou-right{right:16px;top:21vh}.ou-ghost.ou-low{right:16px;bottom:13vh}}
  @media(max-width:520px){.ou-solo-endnav,.ou-ceniciento-endnav{max-width:92vw;gap:8px}.ou-solo-endnav a,.ou-ceniciento-endnav a{min-height:52px;padding:10px 12px}.ou-card{bottom:calc(env(safe-area-inset-bottom,0px) + 88px)}}
  @media(hover:none) and (pointer:coarse){.ou-solo-endnav a,.ou-ceniciento-endnav a{min-height:52px}.ou-card{animation:none;box-shadow:0 15px 38px rgba(0,0,0,.4),0 0 0 2px rgba(241,217,139,.45),inset 0 0 0 1px rgba(255,255,255,.14)}.ou-card:active{transform:rotate(-2deg) scale(.97)}}
  @media(prefers-reduced-motion:reduce){.ou-card{animation:none}.ou-transition,.ou-solo-endnav,.ou-solo-endnav a,.ou-ceniciento-endnav,.ou-ceniciento-endnav a{transition:none}}
  `;
  document.head.appendChild(style);
}

function ghost(text,key,{where='right',delay=0,hold=6800,force=false}={}){
  if(!force && seenGhost(key))return;
  after(delay,()=>{
    if(!force && seenGhost(key))return;
    const el=document.createElement('p');
    el.className='ou-ghost '+(where==='left'?'ou-left':where==='low'?'ou-low':'ou-right');
    el.textContent=text;
    document.body.appendChild(el);
    markGhost(key);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('ou-on')));
    after(hold,()=>el.classList.add('ou-fade'));
    after(hold+2200,()=>el.remove());
  });
}

function transitionVeil(){
  let veil=document.querySelector('.ou-transition');
  if(!veil){veil=document.createElement('div');veil.className='ou-transition';veil.setAttribute('aria-hidden','true');document.body.appendChild(veil);}
  requestAnimationFrame(()=>requestAnimationFrame(()=>veil.classList.add('ou-on')));
}
function fadeAudioElement(audio,duration=1400){
  if(!audio || audio.paused || audio.muted || audio.volume<=.001)return Promise.resolve();
  const start=audio.volume, begun=performance.now();
  return new Promise(resolve=>{
    const tick=now=>{
      const p=Math.min(1,(now-begun)/duration);
      audio.volume=Math.max(0,start*(1-p));
      if(p<1)requestAnimationFrame(tick);else{try{audio.pause();}catch(_){}resolve();}
    };
    requestAnimationFrame(tick);
  });
}
function fadeCurrentAudio(duration=1400){return Promise.allSettled([...document.querySelectorAll('audio')].map(a=>fadeAudioElement(a,duration)));}
function soloUrl(){return rootPath+'?origen=tarjeta&auto=1&v='+VERSION;}
function performSoloTransition(url=soloUrl()){
  save({cardFound:true});
  transitionVeil();
  fadeCurrentAudio(1400);
  after(1250,()=>topGo(url));
}
function requestSoloTransition(){
  save({cardFound:true});
  if(window.parent!==window){
    try{window.parent.postMessage({channel:'oras-universe-v2',type:'solo-transition',url:soloUrl()},location.origin);return;}catch(_){}
  }
  performSoloTransition();
}
addEventListener('message',event=>{
  if(!page.ana || event.origin!==location.origin || event.data?.channel!=='oras-universe-v2' || event.data.type!=='solo-transition')return;
  performSoloTransition(event.data.url||soloUrl());
});

function addCard(){
  if(document.querySelector('.ou-card'))return;
  const card=document.createElement('button');
  card.type='button';
  card.className='ou-card';
  card.setAttribute('aria-label','Abrir SOLO LA TARJETA');
  card.title='Solo la tarjeta';
  card.addEventListener('click',requestSoloTransition);
  document.body.appendChild(card);
}

function showSoloEndNav(){
  if(!state.cenicientoComplete||!state.cenicientoUnlocked)return;
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Continuar desde SOLO LA TARJETA');
  const ana=document.createElement('a');
  ana.href=rootPath+'elegia-breve/';
  ana.textContent='Volver a ANA KLAUDYA';
  nav.append(ana);
  if(state.cenicientoComplete){
    const ceniciento=document.createElement('a');
    ceniciento.href=rootPath+'ceniciento/?v='+VERSION;
    ceniciento.textContent='CENICIENTO';
    nav.append(ceniciento);
  }
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}

function finishSolo(){
  if(!completePiece('soloComplete'))return;
  ghost(GHOSTS.origin,'after-card-origin',{where:'right',delay:1800,hold:6200});
  showSoloEndNav();
  maybeStartMirror();
}

function ensureChecklist(){
  if(window.parent!==window)return;
  let box=document.querySelector('.ou-reading-checklist');
  if(!box){box=document.createElement('details');box.className='ou-reading-checklist';box.setAttribute('aria-label','Estado de las lecturas');box.innerHTML='<summary>Lecturas</summary><ul><li data-piece="ana"><span>ANA KLAUDYA</span></li><li data-piece="solo"><span>SOLO LA TARJETA</span></li><li data-piece="ceniciento"><span>CENICIENTO</span></li></ul>';document.body.appendChild(box);}
  const current=readState();
  for(const [piece,key,label] of [['ana','anaComplete','ANA KLAUDYA'],['solo','soloComplete','SOLO LA TARJETA'],['ceniciento','cenicientoComplete','CENICIENTO']]){const row=box.querySelector(`[data-piece="${piece}"]`);row.dataset.done=String(!!current[key]);row.textContent=`${label} · ${current[key]?'completa':'pendiente'}`;row.setAttribute('aria-label',`${label}: ${current[key]?'lectura completa':'pendiente'}`);}
  const completed=['anaComplete','soloComplete','cenicientoComplete'].filter(key=>current[key]).length;
  box.querySelector('summary').textContent=`Lecturas · ${completed}/3`;
  box.hidden=!current.journeyStartedAt;
}

function launchMirror(){
  if(state.mirrorReadComplete||document.body.classList.contains('mirror'))return;
  let mirror=document.getElementById('mirror');
  if(!mirror){mirror=document.createElement('main');mirror.id='mirror';mirror.setAttribute('aria-label','EL ESPEJO');mirror.hidden=true;document.body.appendChild(mirror);}
  const start=()=>window.dispatchEvent(new CustomEvent('oras:mirror-start'));
  if(document.querySelector('script[data-oras-mirror]')){start();return;}
  const script=document.createElement('script');script.dataset.orasMirror='true';script.src=rootPath+'ceniciento/el-espejo.js?v='+VERSION;script.onload=start;document.body.appendChild(script);
}
function maybeStartMirror(){
  state=readState();ensureChecklist();
  if(state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete)launchMirror();
}
function completePiece(key,patch={}){
  state=readState();
  if(!state.journeyStartedAt)return false;
  if(!state[key]){save({[key]:true,...patch});state=readState();}
  else if(Object.keys(patch).some(k=>state[k]!==patch[k])){save(patch);state=readState();}
  ensureChecklist();maybeStartMirror();
  return true;
}

function resetReadingCycle(){
  save({anaComplete:false,soloComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:true});
  state=readState();ensureChecklist();
}

window.addEventListener('oras:mirror-end',()=>{
  resetReadingCycle();
  if(page.ana){topGo(rootPath+'elegia-breve/?v='+VERSION);return;}
  if(window.parent!==window){window.parent.postMessage({channel:'oras-universe-v2',type:'mirror-return'},location.origin);return;}
  topGo(rootPath+'elegia-breve/?v='+VERSION);
});
addEventListener('message',event=>{
  if(!page.ana||event.origin!==location.origin||event.source!==document.getElementById('cenicientoFrame')?.contentWindow||event.data?.channel!=='oras-universe-v2'||event.data.type!=='mirror-return')return;
  resetReadingCycle();
  ensureChecklist();ghost(GHOSTS.return,'after-mirror-return',{where:'left',delay:1200,hold:7500});
  window.dispatchEvent(new CustomEvent('oras:mirror-returned'));
});

function addUnlockedAnaDoors(){
  if(!state.cenicientoComplete||!state.cenicientoUnlocked)return;
  const nav=document.getElementById('anaNavigation');
  if(!nav||nav.querySelector('[data-ou-crosspiece]'))return;
  const solo=document.createElement('button');
  solo.type='button';solo.className='entry-button';solo.dataset.ouCrosspiece='solo';solo.textContent='SOLO LA TARJETA';
  solo.addEventListener('click',()=>topGo(rootPath+'?origen=ana&v='+VERSION));
  const ceniciento=document.createElement('button');
  ceniciento.type='button';ceniciento.className='entry-button';ceniciento.dataset.ouCrosspiece='ceniciento';ceniciento.textContent='CENICIENTO';
  ceniciento.addEventListener('click',()=>topGo(rootPath+'ceniciento/?v='+VERSION));
  nav.append(solo,ceniciento);
}

function setupSolo(){
  after(30,()=>{
    const enter=document.getElementById('enterButton');
    if(enter && !document.body.classList.contains('entered'))enter.click();
  });
  if(state.cardFound)ghost(GHOSTS.before,'before-story',{where:'left',delay:2500,hold:6500});
  if(state.cenicientoComplete&&state.cenicientoUnlocked)showSoloEndNav();
  let armed=false;
  const finish=()=>{if(armed)return;armed=true;finishSolo();};
  const lastLine=document.querySelector('main article p.story-line:last-of-type')||document.querySelector('main article p:last-of-type');
  if('IntersectionObserver' in window && lastLine){
    const endObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){endObserver.disconnect();finish();}
    },{rootMargin:'0px 0px -12% 0px',threshold:.12});
    endObserver.observe(lastLine);
  }else{
    const checkEnd=()=>{
      const d=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
      if(scrollY+innerHeight>=d-180)finish();
    };
    addEventListener('scroll',checkEnd,{passive:true});
    after(1200,checkEnd);
  }
}

function setupAna(){
  addUnlockedAnaDoors();
  const q=document.getElementById('cenicientoLink');
  if(q){
    let hinted=false;
    const hint=()=>{
      if(hinted)return;
      hinted=true;
      ghost(GHOSTS.absence,'before-ceniciento',{where:'right',delay:250,hold:5200});
    };
    q.addEventListener('mouseenter',hint,{once:true});
    q.addEventListener('focus',hint,{once:true});
    q.addEventListener('touchstart',hint,{once:true,passive:true});
  }
  const markAna=()=>{
    if(document.body.classList.contains('portrait-revealed'))completePiece('anaComplete');
  };
  new MutationObserver(markAna).observe(document.body,{attributes:true,attributeFilter:['class']});
  markAna();
  if(state.returnedFromCeniciento)ghost(GHOSTS.return,'after-ceniciento-return',{where:'left',delay:1800,hold:7500});
  else if(state.cardFound)ghost(GHOSTS.before,'before-story',{where:'left',delay:2500,hold:6500});
}

function setupCeniciento(){
  const oldBack=document.getElementById('back');
  if(oldBack)oldBack.style.display='none';
  const nav=document.createElement('nav');
  nav.className='ou-ceniciento-endnav';
  nav.hidden=!state.cenicientoUnlocked;
  nav.setAttribute('aria-label','Continuar después de CENICIENTO');
  const ret=document.createElement('a');
  ret.href=rootPath+'elegia-breve/?v='+VERSION;ret.target='_top';ret.textContent='ANA KLAUDYA';ret.setAttribute('aria-label','Abrir ANA KLAUDYA');
  ret.addEventListener('click',()=>save({returnedFromCeniciento:true}));
  const solo=document.createElement('a');
  solo.href=rootPath+'?origen=ceniciento&v='+VERSION;solo.target='_top';solo.textContent='SOLO LA TARJETA';solo.classList.add('ou-card-exit');solo.setAttribute('aria-label','Abrir SOLO LA TARJETA');
  solo.addEventListener('click',()=>save({returnedFromCeniciento:true}));
  nav.append(ret,solo);
  document.body.appendChild(nav);
  const revealNav=()=>{document.body.classList.add('ou-ceniciento-navigation-visible');nav.classList.add('ou-visible');};
  if(state.cenicientoComplete&&state.cenicientoUnlocked&&!(state.soloComplete&&state.anaComplete&&!state.mirrorReadComplete))requestAnimationFrame(()=>requestAnimationFrame(revealNav));
  let returnTimer=0;
  const arrivedByQuestion=new URLSearchParams(location.search).get('via')==='question';
  const complete=()=>{
    state=readState();
    if(!state.journeyStartedAt||(!state.cenicientoUnlocked&&!arrivedByQuestion))return;
    const wasUnlocked=state.cenicientoUnlocked;
    const unlock=wasUnlocked||arrivedByQuestion;
    completePiece('cenicientoComplete',unlock?{cenicientoUnlocked:true}:{});
    state=readState();
    if(state.cenicientoUnlocked&&state.soloComplete&&state.anaComplete&&!state.mirrorReadComplete){
      clearTimeout(returnTimer);
      nav.classList.remove('ou-visible');
      nav.hidden=true;
      return;
    }
    if(state.cenicientoUnlocked){
      nav.hidden=false;
      if(wasUnlocked){revealNav();return;}
      clearTimeout(returnTimer);returnTimer=after(6200,revealNav);
    }
  };
  const voice=document.getElementById('voice');
  if(voice)voice.addEventListener('ended',complete);
  let readDone=false;
  const readingEnd=document.querySelector('#readerText + .reading-end');
  if('IntersectionObserver' in window && readingEnd){
    const endObserver=new IntersectionObserver(entries=>{
      if(readDone || !document.getElementById('readerText')?.textContent.trim() || !document.body.classList.contains('read') || document.body.classList.contains('revealing'))return;
      if(entries.some(entry=>entry.isIntersecting)){readDone=true;endObserver.disconnect();complete();}
    },{rootMargin:'0px 0px -10% 0px',threshold:.25});
    endObserver.observe(readingEnd);
  }else{
    const readCheck=()=>{
      if(readDone || !document.body.classList.contains('read') || document.body.classList.contains('revealing'))return;
      const d=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
      if(scrollY+innerHeight>=d-120){readDone=true;complete();}
    };
    addEventListener('scroll',readCheck,{passive:true});
  }
}

function init(){
  installBaseStyles();
  state=readState();
  if(state.mirrorReadComplete)resetReadingCycle();
  if(page.ana||page.ojos||page.sonrisa||page.epilogo||page.estrella||page.cabello||page.piel||page.interludio)addCard();
  if(page.solo)setupSolo();
  if(page.ana)setupAna();
  if(page.ceniciento)setupCeniciento();
  ensureChecklist();
  maybeStartMirror();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
