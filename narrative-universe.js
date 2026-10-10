(()=>{
'use strict';

const VERSION='20261010-8';
const STORAGE='oras.universe.v1';
const rootPath='/solo-la-tarjeta/';
const GHOSTS=Object.freeze({
  before:'Hay historias que empiezan antes.',
  origin:'El origen suele parecer insignificante.',
  absence:'Falta una versión de la historia.',
  return:'Nadie regresa al mismo lugar.'
});
const path=location.pathname.replace(/\/+$/,'') || '/';
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

function readState(){
  try{return Object.assign({cardFound:false,soloComplete:false,anaComplete:false,cenicientoComplete:false,returnedFromCeniciento:false,ghosts:{}},JSON.parse(localStorage.getItem(STORAGE)||'{}'));}
  catch(_){return {cardFound:false,soloComplete:false,anaComplete:false,cenicientoComplete:false,returnedFromCeniciento:false,ghosts:{}};}
}
let state=readState();
function save(patch={}){
  state=Object.assign({},state,patch);
  if(!state.ghosts)state.ghosts={};
  try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(_){}
  return state;
}
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
  .ou-card{position:fixed;z-index:74;left:max(26px,4.2vw);bottom:10.5vh;width:116px;height:72px;padding:0;border:1px solid rgba(255,255,255,.26);border-radius:9px;background:linear-gradient(145deg,rgba(62,68,77,.99),rgba(20,24,30,.99));box-shadow:0 15px 38px rgba(0,0,0,.36),0 0 0 1px rgba(0,0,0,.22),inset 0 0 0 1px rgba(255,255,255,.11),0 0 30px rgba(192,151,65,.25);opacity:.98;transform:rotate(-5deg);cursor:pointer;transition:opacity .45s ease,transform .45s ease,box-shadow .45s ease;animation:ouCardHint 5.3s ease-in-out infinite}
  .ou-card::before{content:"";position:absolute;left:16px;top:16px;width:27px;height:20px;border-radius:4px;background:linear-gradient(135deg,#b98b2e,#f1d98b 48%,#9e7220);box-shadow:inset 0 0 0 1px rgba(70,49,13,.48),0 1px 5px rgba(0,0,0,.25)}
  .ou-card::after{content:"";position:absolute;left:16px;right:16px;bottom:15px;height:3px;border-radius:3px;background:rgba(246,244,238,.88);box-shadow:0 -10px 0 rgba(246,244,238,.33),0 -20px 0 rgba(246,244,238,.13)}
  .ou-card:hover,.ou-card:focus-visible{opacity:1;transform:rotate(-2deg) translateY(-4px) scale(1.065);box-shadow:0 18px 46px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.15),0 0 40px rgba(213,174,91,.40);outline:none;animation:none}
  @keyframes ouCardHint{0%,70%,100%{transform:rotate(-5deg) scale(1)}82%{transform:rotate(-4deg) scale(1.045)}}
  .ou-transition{position:fixed;inset:0;z-index:9999;background:rgba(16,15,14,0);pointer-events:none;transition:background 1.25s ease}.ou-transition.ou-on{background:rgba(16,15,14,.95)}
  .ou-symbolic{cursor:pointer;font:inherit;font-weight:inherit;color:inherit;text-decoration-line:underline;text-decoration-style:solid;text-decoration-thickness:.055em;text-underline-offset:.20em;text-decoration-color:transparent;transition:color .5s ease,text-decoration-color .5s ease,text-shadow .5s ease,opacity .5s ease}
  .ou-symbolic:hover,.ou-symbolic:focus-visible{color:rgba(92,67,47,.92);text-decoration-color:rgba(92,67,47,.28);text-shadow:0 0 12px rgba(112,72,38,.08);outline:none}
  .ou-return{position:fixed;z-index:80;left:50%;bottom:6.2svh;transform:translateX(-50%);appearance:none;border:0;background:none;color:#fffaf1;padding:.5em 1em;font:italic 400 clamp(1.05rem,2.4vw,1.35rem)/1 Georgia,"Times New Roman",serif;letter-spacing:.035em;opacity:0;visibility:hidden;cursor:pointer;transition:opacity 2.4s ease,visibility 2.4s ease;text-shadow:0 2px 18px rgba(0,0,0,.9)}.ou-return.ou-visible{opacity:.72;visibility:visible}.ou-return:hover,.ou-return:focus-visible{opacity:1;outline:none}
  .ou-solo-endnav{position:fixed;z-index:82;left:50%;bottom:6.2svh;transform:translateX(-50%) translateY(8px);display:flex;align-items:center;justify-content:center;gap:clamp(1.1rem,3vw,2.4rem);max-width:min(92vw,760px);opacity:0;visibility:hidden;transition:opacity 2s ease,transform 2s ease,visibility 2s ease;text-align:center}.ou-solo-endnav.ou-visible{opacity:.76;visibility:visible;transform:translateX(-50%) translateY(0)}.ou-solo-endnav a{color:#fffaf1;text-decoration:none;font:italic 400 clamp(.92rem,1.8vw,1.14rem)/1.25 Georgia,"Times New Roman",serif;letter-spacing:.025em;text-shadow:0 2px 18px rgba(0,0,0,.9);opacity:.78;transition:opacity .4s ease,text-shadow .4s ease}.ou-solo-endnav a:hover,.ou-solo-endnav a:focus-visible{opacity:1;text-shadow:0 2px 22px rgba(0,0,0,1);outline:none}.ou-solo-endnav .ou-sep{color:rgba(255,250,241,.34);font-size:.8em;pointer-events:none}
  @media(max-width:700px){.ou-card{left:18px;bottom:9vh;width:92px;height:57px}.ou-card::before{left:13px;top:13px;width:22px;height:16px}.ou-card::after{left:13px;right:13px;bottom:12px}.ou-ghost{max-width:68vw}.ou-ghost.ou-left{left:16px;top:14vh}.ou-ghost.ou-right{right:16px;top:21vh}.ou-ghost.ou-low{right:16px;bottom:13vh}}
  @media(prefers-reduced-motion:reduce){.ou-card{animation:none}.ou-transition{transition:none}}
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
  card.setAttribute('aria-label','Solo la tarjeta');
  card.title='Solo la tarjeta';
  card.addEventListener('click',requestSoloTransition);
  document.body.appendChild(card);
}

function finishSolo(){
  if(!state.soloComplete){
    save({soloComplete:true});
    state=readState();
  }
  ghost(GHOSTS.origin,'after-card-origin',{where:'right',delay:1800,hold:6200});
}

function setupSolo(){
  after(30,()=>{
    const enter=document.getElementById('enterButton');
    if(enter && !document.body.classList.contains('entered'))enter.click();
  });
  if(state.cardFound)ghost(GHOSTS.before,'before-story',{where:'left',delay:2500,hold:6500});
  let armed=false;
  const checkEnd=()=>{
    if(armed)return;
    const d=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    if(scrollY+innerHeight>=d-180){armed=true;finishSolo();}
  };
  addEventListener('scroll',checkEnd,{passive:true});
  after(1200,checkEnd);
}

function setupAna(){
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
  const finale=document.getElementById('portraitFinale');
  const markAna=()=>{
    if(!state.anaComplete){save({anaComplete:true});state=readState();}
  };
  if(finale){
    if(finale.classList.contains('is-visible'))markAna();
    new MutationObserver(()=>{if(finale.classList.contains('is-visible'))markAna();}).observe(finale,{attributes:true,attributeFilter:['class']});
  }else{
    new MutationObserver(()=>{if(document.body.classList.contains('portrait-revealed'))markAna();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  }
  if(state.returnedFromCeniciento)ghost(GHOSTS.return,'after-ceniciento-return',{where:'left',delay:1800,hold:7500});
  else if(state.cardFound)ghost(GHOSTS.before,'before-story',{where:'left',delay:2500,hold:6500});
}

function setupCeniciento(){
  const oldBack=document.getElementById('back');
  if(oldBack)oldBack.style.display='none';
  const ret=document.createElement('button');
  ret.type='button';ret.className='ou-return';ret.textContent='volver';ret.setAttribute('aria-label','volver');
  ret.addEventListener('click',()=>{save({cenicientoComplete:true,returnedFromCeniciento:true});topGo(rootPath+'elegia-breve/?v='+VERSION);});
  document.body.appendChild(ret);
  let returnTimer=0;
  const complete=()=>{
    if(!state.cenicientoComplete){save({cenicientoComplete:true});state=readState();}
    clearTimeout(returnTimer);returnTimer=after(6200,()=>ret.classList.add('ou-visible'));
  };
  const voice=document.getElementById('voice');
  if(voice)voice.addEventListener('ended',complete);
  let readDone=false;
  const readCheck=()=>{
    if(readDone || !document.body.classList.contains('read'))return;
    const d=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    if(scrollY+innerHeight>=d-120){readDone=true;complete();}
  };
  addEventListener('scroll',readCheck,{passive:true});
}

function init(){
  installBaseStyles();
  state=readState();
  if(page.ana||page.ojos||page.sonrisa||page.epilogo||page.estrella||page.cabello||page.piel||page.interludio)addCard();
  if(page.solo)setupSolo();
  if(page.ana)setupAna();
  if(page.ceniciento)setupCeniciento();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();