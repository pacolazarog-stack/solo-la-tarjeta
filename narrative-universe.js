(()=>{
'use strict';

const VERSION='20261010-1';
const STORAGE='oras.universe.v1';
const rootPath='/solo-la-tarjeta/';
const path=location.pathname.replace(/\/+$/,'') || '/';
const page={
  solo:path==='/solo-la-tarjeta' || path==='/solo-la-tarjeta/index.html',
  ana:path.endsWith('/elegia-breve'),
  ojos:path.endsWith('/ojos'),
  sonrisa:path.endsWith('/sonrisa'),
  epilogo:path.endsWith('/epilogo'),
  estrella:path.endsWith('/estrella'),
  ceniciento:path.endsWith('/ceniciento')
};

function readState(){
  try{return Object.assign({
    cardFound:false,
    soloComplete:false,
    anaComplete:false,
    cenicientoComplete:false,
    returnedFromCeniciento:false,
    ghosts:{}
  },JSON.parse(localStorage.getItem(STORAGE)||'{}'));}
  catch(_){return {cardFound:false,soloComplete:false,anaComplete:false,cenicientoComplete:false,returnedFromCeniciento:false,ghosts:{}};}
}
let state=readState();
function save(patch={}){
  state=Object.assign({},state,patch);
  if(!state.ghosts)state.ghosts={};
  try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(_){}
  return state;
}
function markGhost(key){
  const ghosts=Object.assign({},state.ghosts||{}, {[key]:true});
  save({ghosts});
}
function seenGhost(key){return !!(state.ghosts&&state.ghosts[key]);}
function topGo(url){
  try{window.top.location.href=url;}catch(_){location.href=url;}
}
function after(ms,fn){return setTimeout(fn,ms)}

function installBaseStyles(){
  if(document.getElementById('oras-universe-style'))return;
  const style=document.createElement('style');
  style.id='oras-universe-style';
  style.textContent=`
  .ou-ghost{position:fixed;z-index:72;max-width:min(35rem,72vw);margin:0;padding:0;color:currentColor;font:italic 400 clamp(.72rem,1.25vw,.93rem)/1.45 Georgia,"Times New Roman",serif;letter-spacing:.015em;opacity:0;pointer-events:none;filter:blur(.08px);text-shadow:none;transition:opacity 1.8s ease;mix-blend-mode:normal}
  .ou-ghost.ou-on{opacity:.32}.ou-ghost.ou-fade{opacity:0}.ou-ghost.ou-left{left:max(18px,3.5vw);top:18vh;text-align:left}.ou-ghost.ou-right{right:max(18px,3.5vw);top:28vh;text-align:right}.ou-ghost.ou-low{right:max(18px,4vw);bottom:15vh;text-align:right}
  .ou-card{position:fixed;z-index:68;left:max(17px,3.2vw);bottom:14vh;width:52px;height:32px;padding:0;border:0;border-radius:4px;background:linear-gradient(145deg,rgba(185,190,196,.25),rgba(83,91,101,.20));box-shadow:0 2px 12px rgba(0,0,0,.12),inset 0 0 0 1px rgba(255,255,255,.12);opacity:.13;filter:blur(.75px);transform:rotate(-7deg);cursor:pointer;transition:opacity .9s ease,filter .9s ease,transform .9s ease}
  .ou-card::before{content:"";position:absolute;left:9px;top:9px;width:12px;height:8px;border-radius:2px;background:rgba(218,195,136,.38);box-shadow:inset 0 0 0 1px rgba(80,67,42,.10)}
  .ou-card::after{content:"";position:absolute;left:9px;right:9px;bottom:7px;height:1px;background:rgba(255,255,255,.28)}
  .ou-card:hover,.ou-card:focus-visible{opacity:.34;filter:blur(.12px);transform:rotate(-5deg) translateY(-1px);outline:none}
  .ou-active-text{cursor:pointer;transition:opacity .45s ease,text-shadow .45s ease}.ou-active-text:hover,.ou-active-text:focus-visible{opacity:.78;text-shadow:0 0 14px currentColor;outline:none}
  .ou-eiffel{display:inline-grid;place-items:center;width:19px;height:28px;margin-left:.55em;padding:0;border:0;background:transparent;color:inherit;opacity:.19;vertical-align:-.55em;cursor:pointer;transition:opacity .6s ease,transform .6s ease}.ou-eiffel:hover,.ou-eiffel:focus-visible{opacity:.52;transform:translateY(-1px);outline:none}.ou-eiffel svg{width:100%;height:100%;display:block}
  .ou-return{position:fixed;z-index:80;left:50%;bottom:6.2svh;transform:translateX(-50%);appearance:none;border:0;background:none;color:#fffaf1;padding:.5em 1em;font:italic 400 clamp(1.05rem,2.4vw,1.35rem)/1 Georgia,"Times New Roman",serif;letter-spacing:.035em;opacity:0;visibility:hidden;cursor:pointer;transition:opacity 2.4s ease,visibility 2.4s ease;text-shadow:0 2px 18px rgba(0,0,0,.9)}.ou-return.ou-visible{opacity:.72;visibility:visible}.ou-return:hover,.ou-return:focus-visible{opacity:1;outline:none}
  @media(max-width:700px){.ou-card{left:16px;bottom:12vh;width:46px;height:29px}.ou-ghost{max-width:68vw}.ou-ghost.ou-left{left:16px;top:14vh}.ou-ghost.ou-right{right:16px;top:21vh}.ou-ghost.ou-low{right:16px;bottom:13vh}}
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

function addCard(){
  if(document.querySelector('.ou-card'))return;
  const card=document.createElement('button');
  card.type='button';
  card.className='ou-card';
  card.setAttribute('aria-label','Tarjeta');
  card.title='';
  card.addEventListener('click',()=>{
    save({cardFound:true});
    topGo(rootPath+'?origen=tarjeta&v='+VERSION);
  });
  document.body.appendChild(card);
}

function makeClickable(el,destination,label){
  if(!el || el.dataset.ouActive)return;
  el.dataset.ouActive='1';
  el.classList.add('ou-active-text');
  el.tabIndex=0;
  el.setAttribute('role','link');
  if(label)el.setAttribute('aria-label',label);
  const go=()=>topGo(destination);
  el.addEventListener('click',go);
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
}

function pByExact(text){
  return [...document.querySelectorAll('p,span')].find(el=>el.textContent.trim()===text) || null;
}
function psContaining(token){
  return [...document.querySelectorAll('p')].filter(el=>el.textContent.includes(token));
}

function installEiffel(){
  if(document.querySelector('.ou-eiffel'))return;
  const target=psContaining('París')[0];
  if(!target)return;
  const b=document.createElement('button');
  b.type='button';
  b.className='ou-eiffel';
  b.setAttribute('aria-label','Torre Eiffel');
  b.innerHTML='<svg viewBox="0 0 24 40" aria-hidden="true"><path d="M12 2 L5.2 34 M12 2 L18.8 34 M8.2 20 H15.8 M6.3 29 H17.7 M4 37 H20 M9.4 12 H14.6" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/><path d="M9.3 37 Q12 31.5 14.7 37" fill="none" stroke="currentColor" stroke-width="1.05"/></svg>';
  b.addEventListener('click',e=>{e.stopPropagation();topGo(rootPath+'elegia-breve/#estrella');});
  target.appendChild(b);
}

function activateSoloSymbols(){
  if(!state.soloComplete)return;
  makeClickable(pByExact('Los ojos de estatua.'),rootPath+'elegia-breve/#ojos','Ojos de estatua');
  psContaining('reloj').forEach(p=>makeClickable(p,rootPath+'elegia-breve/#ceniciento','Reloj'));
  installEiffel();
}

function finishSolo(){
  if(state.soloComplete)return;
  save({soloComplete:true});
  state=readState();
  activateSoloSymbols();
  ghost('Una casualidad rara vez termina donde parece.','after-solo',{where:'low',delay:2600,hold:6500});
}

function setupSolo(){
  if(state.cardFound){
    ghost('Hay historias que empiezan antes.','before-story',{where:'left',delay:2500,hold:6500});
  }
  if(state.soloComplete){
    activateSoloSymbols();
    if(state.anaComplete)ghost('Todo esto ocurrió después.','all-after',{where:'right',delay:6000,hold:6400});
  }
  let armed=false;
  const checkEnd=()=>{
    if(armed||state.soloComplete)return;
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
      if(hinted)return; hinted=true;
      ghost('Falta una versión de la historia.','before-ceniciento',{where:'right',delay:250,hold:5200});
    };
    q.addEventListener('mouseenter',hint,{once:true});
    q.addEventListener('focus',hint,{once:true});
    q.addEventListener('touchstart',hint,{once:true,passive:true});
  }

  const finale=document.getElementById('portraitFinale');
  const markAna=()=>{
    if(state.anaComplete)return;
    save({anaComplete:true}); state=readState();
    ghost('No todo lo que se mira puede describirse.','after-ana-gaze',{where:'left',delay:4200,hold:6200});
    if(state.soloComplete)ghost('Todo esto ocurrió después.','all-after',{where:'right',delay:12500,hold:6500});
  };
  if(finale){
    if(finale.classList.contains('is-visible'))markAna();
    new MutationObserver(()=>{if(finale.classList.contains('is-visible'))markAna();}).observe(finale,{attributes:true,attributeFilter:['class']});
  }else{
    new MutationObserver(()=>{if(document.body.classList.contains('portrait-revealed'))markAna();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  if(state.returnedFromCeniciento){
    ghost('Y también antes.','returned-before',{where:'left',delay:3500,hold:7500});
  }else if(state.cardFound){
    ghost('Hay historias que empiezan antes.','before-story',{where:'left',delay:4200,hold:6500});
  }
  if(state.soloComplete && !state.returnedFromCeniciento){
    ghost('Una casualidad rara vez termina donde parece.','after-solo',{where:'low',delay:9000,hold:6200});
  }
}

function setupCeniciento(){
  const oldBack=document.getElementById('back');
  if(oldBack)oldBack.style.display='none';

  const ret=document.createElement('button');
  ret.type='button';
  ret.className='ou-return';
  ret.textContent='volver';
  ret.setAttribute('aria-label','volver');
  ret.addEventListener('click',()=>{
    save({cenicientoComplete:true,returnedFromCeniciento:true});
    topGo(rootPath+'elegia-breve/?v='+VERSION);
  });
  document.body.appendChild(ret);

  let returnTimer=0;
  const complete=()=>{
    if(!state.cenicientoComplete){save({cenicientoComplete:true});state=readState();}
    clearTimeout(returnTimer);
    returnTimer=after(6200,()=>ret.classList.add('ou-visible'));
  };

  const voice=document.getElementById('voice');
  if(voice){
    let timeGhost=false,truthGhost=false;
    voice.addEventListener('timeupdate',()=>{
      const t=voice.currentTime||0;
      if(!timeGhost && t>=485){timeGhost=true;ghost('El tiempo nunca desaparece.','inside-time',{where:'left',delay:0,hold:5200});}
      if(!truthGhost && t>=674){truthGhost=true;ghost('No estaba ocurriendo lo que parecía.','inside-seeming',{where:'right',delay:0,hold:5200});}
    });
    voice.addEventListener('ended',complete);
  }

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
  if(page.ojos||page.sonrisa||page.epilogo)addCard();
  if(page.solo)setupSolo();
  if(page.ana)setupAna();
  if(page.ceniciento)setupCeniciento();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
