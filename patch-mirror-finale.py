from pathlib import Path

p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')

# Eliminar cualquier flag incrustado en el último fragmento: flag tendrá pantalla propia.
old_mark = """  if(number===32){const mark=document.createElement('p');mark.className='mirror-end-mark';mark.textContent='flag';copy.append(mark);const end=document.createElement('span');end.className='mirror-end-sentinel';end.setAttribute('aria-hidden','true');scene.append(end)}
  mirror.append(scene);sceneNodes.push(scene);
});"""
new_mark = """  if(number===32){const end=document.createElement('span');end.className='mirror-end-sentinel';end.setAttribute('aria-hidden','true');scene.append(end)}
  mirror.append(scene);sceneNodes.push(scene);
});

// PANTALLA FINAL AUTÓNOMA DE EL ESPEJO.
const finale=document.createElement('section');
finale.className='mirror-flag-finale';
finale.hidden=true;
finale.setAttribute('role','region');
finale.setAttribute('aria-label','Final de EL ESPEJO');

const flag=document.createElement('div');
flag.className='mirror-flag-word';
flag.textContent='flag';

const restart=document.createElement('button');
restart.type='button';restart.className='mirror-finale-restart';restart.textContent='Reinicio';
restart.setAttribute('aria-label','Reiniciar todo el recorrido desde ANA KLAUDYA');
restart.onclick=()=>{
  clearFinaleTimers();
  try{
    const key='oras.universe.v2';
    const st=JSON.parse(localStorage.getItem(key)||'{}');
    Object.assign(st,{journeyStartedAt:Date.now(),soloComplete:false,anaComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:false});
    localStorage.setItem(key,JSON.stringify(st));
  }catch(_){}
  try{window.top.location.href='../elegia-breve/';}catch(_){location.href='../elegia-breve/';}
};

const exit=document.createElement('button');
exit.type='button';exit.className='mirror-finale-exit';exit.textContent='Salir';
exit.setAttribute('aria-label','Salir de EL ESPEJO y volver a ANA KLAUDYA');
exit.onclick=()=>{
  clearFinaleTimers();
  try{window.top.location.href='../elegia-breve/';}catch(_){location.href='../elegia-breve/';}
};

const finaleNav=document.createElement('nav');
finaleNav.className='mirror-finale-nav';
finaleNav.setAttribute('aria-label','Opciones finales');
finaleNav.append(restart,exit);

const card=document.createElement('button');
card.type='button';card.className='mirror-finale-card';card.setAttribute('aria-label','Ir a SOLO LA TARJETA');
card.onclick=()=>{clearFinaleTimers();try{window.top.location.href='../?origen=tarjeta&auto=1';}catch(_){location.href='../?origen=tarjeta&auto=1';}};

const question=document.createElement('button');
question.type='button';question.className='mirror-finale-question';question.textContent='?';question.setAttribute('aria-label','Entrar en CENICIENTO');
question.onclick=()=>{clearFinaleTimers();try{window.top.location.href='../elegia-breve/#ceniciento';}catch(_){location.href='../elegia-breve/#ceniciento';}};

finale.append(flag,finaleNav,card,question);
document.body.append(finale);

let finaleTimers=[];
function clearFinaleTimers(){finaleTimers.forEach(clearTimeout);finaleTimers=[]}
function enterFinale(){
  if(finale.classList.contains('is-active'))return;
  clearFinaleTimers();
  finished=true;
  locked=false;lockedScene=null;
  mirror.hidden=true;
  document.body.classList.remove('mirror');
  document.body.classList.add('mirror-finale-active');
  finale.hidden=false;
  finale.classList.remove('show-options','show-card','show-question');
  requestAnimationFrame(()=>requestAnimationFrame(()=>finale.classList.add('is-active')));
  // flag permanece solo varios segundos; después entran las opciones de forma progresiva.
  finaleTimers.push(setTimeout(()=>finale.classList.add('show-options'),4200));
  finaleTimers.push(setTimeout(()=>finale.classList.add('show-card'),5200));
  finaleTimers.push(setTimeout(()=>finale.classList.add('show-question'),6200));
}

const finaleStyle=document.createElement('style');
finaleStyle.id='mirror-fullscreen-flag-finale';
finaleStyle.textContent=`
html:has(body.mirror-finale-active),body.mirror-finale-active{overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important;background:#100e0d!important}
body.mirror-finale-active>:not(.mirror-flag-finale):not(script):not(style){visibility:hidden!important;pointer-events:none!important}
body .mirror-flag-finale[hidden]{display:none!important}
body .mirror-flag-finale{position:fixed!important;z-index:2147483000!important;inset:0!important;width:100vw!important;height:100svh!important;overflow:hidden!important;background:#100e0d!important;color:#fffaf1!important;isolation:isolate!important;touch-action:none!important;overscroll-behavior:none!important}
body .mirror-flag-word{position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,250,241,.82);font:italic 400 clamp(1.15rem,2.5vw,1.6rem)/1 Georgia,'Times New Roman',serif;letter-spacing:.24em;opacity:0;transform:scale(.985);transition:opacity 1.8s ease,transform 1.8s ease}
body .mirror-flag-finale.is-active .mirror-flag-word{opacity:1;transform:scale(1)}
body .mirror-finale-nav{position:absolute;z-index:5;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translate(-50%,12px);width:min(330px,calc(100% - 224px));height:48px;display:flex;align-items:stretch;border-top:1px solid rgba(255,250,241,.42);opacity:0;visibility:hidden;pointer-events:none;transition:opacity 1.8s ease,transform 1.8s ease,visibility 0s linear 1.8s}
body .mirror-flag-finale.show-options .mirror-finale-nav{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%,0);transition-delay:0s}
body .mirror-finale-nav button{flex:1 1 0;display:grid;place-items:center;min-width:0;min-height:48px;padding:7px 4px;border:0;border-radius:0;background:rgba(12,12,12,.06);color:#fffaf1;font:14px/1.2 system-ui,sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.9);cursor:pointer;backdrop-filter:blur(1.5px);-webkit-backdrop-filter:blur(1.5px)}
body .mirror-finale-nav>*+*{border-left:1px solid rgba(255,250,241,.24)}
body .mirror-finale-card{position:absolute;z-index:5;right:max(16px,env(safe-area-inset-right));bottom:calc(env(safe-area-inset-bottom,0px) + 12px);width:94px;height:58px;border:1px solid rgba(255,255,255,.23);border-radius:8px;background:linear-gradient(145deg,rgba(62,68,77,.18),rgba(20,24,30,.11));box-shadow:0 9px 26px rgba(0,0,0,.16),inset 0 0 0 1px rgba(255,255,255,.07);opacity:0;visibility:hidden;pointer-events:none;transform:rotate(4deg) translateY(10px);transition:opacity 1.9s ease,transform 1.9s ease,visibility 0s linear 1.9s;cursor:pointer;backdrop-filter:blur(1px)}
body .mirror-finale-card::before{content:'';position:absolute;left:13px;top:12px;width:23px;height:17px;border-radius:3px;background:linear-gradient(135deg,rgba(185,139,46,.70),rgba(241,217,139,.72) 48%,rgba(158,114,32,.65))}
body .mirror-finale-card::after{content:'';position:absolute;left:13px;right:13px;bottom:11px;height:2px;background:rgba(246,244,238,.65);box-shadow:0 -8px 0 rgba(246,244,238,.24),0 -16px 0 rgba(246,244,238,.10)}
body .mirror-flag-finale.show-card .mirror-finale-card{opacity:.72;visibility:visible;pointer-events:auto;transform:rotate(4deg) translateY(0);transition-delay:0s}
body .mirror-finale-question{position:absolute;z-index:6;right:max(26px,6vw);top:max(26px,8vh);width:62px;height:62px;border:1px solid rgba(255,250,241,.38);border-radius:50%;background:rgba(238,241,233,.08);color:#fffaf1;font:400 1.75rem/1 Georgia,serif;display:grid;place-items:center;opacity:0;visibility:hidden;pointer-events:none;transform:scale(.84);transition:opacity 2s ease,transform 2s ease,visibility 0s linear 2s;cursor:pointer;backdrop-filter:blur(1.5px)}
body .mirror-flag-finale.show-question .mirror-finale-question{opacity:.78;visibility:visible;pointer-events:auto;transform:scale(1);transition-delay:0s}
@media(max-width:700px){body .mirror-finale-nav{left:112px;right:112px;width:auto;transform:translateY(12px)}body .mirror-flag-finale.show-options .mirror-finale-nav{transform:none}body .mirror-finale-card{right:max(10px,env(safe-area-inset-right));bottom:calc(env(safe-area-inset-bottom,0px) + 10px)}body .mirror-finale-question{right:18px;top:22px;width:54px;height:54px}}
`;
document.head.appendChild(finaleStyle);"""
if old_mark not in s:
    raise RuntimeError('No se encontró el cierre canónico de la escena 32 de EL ESPEJO')
s = s.replace(old_mark, new_mark, 1)

# Activación robusta: observador + llegada real al fondo del espejo.
old_observer = """const endSentinel=mirror.querySelector('.mirror-end-sentinel');
new IntersectionObserver(entries=>{
  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;
  finished=true;window.dispatchEvent(new CustomEvent('oras:mirror-end'));
},{root:mirror,threshold:.5}).observe(endSentinel);"""
new_observer = """const endSentinel=mirror.querySelector('.mirror-end-sentinel');
const finishObserver=new IntersectionObserver(entries=>{
  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;
  enterFinale();
},{root:mirror,threshold:.35});
finishObserver.observe(endSentinel);
function checkMirrorBottom(){
  if(finished||!started||locked||document.body.classList.contains('mirror-finale-active'))return;
  const remaining=mirror.scrollHeight-mirror.clientHeight-mirror.scrollTop;
  if(remaining<=8)enterFinale();
}
mirror.addEventListener('scroll',checkMirrorBottom,{passive:true});
mirror.addEventListener('wheel',()=>requestAnimationFrame(checkMirrorBottom),{passive:true});
mirror.addEventListener('touchend',()=>requestAnimationFrame(checkMirrorBottom),{passive:true});"""
if old_observer not in s:
    raise RuntimeError('No se encontró el observador final canónico de EL ESPEJO')
s = s.replace(old_observer, new_observer, 1)

# Bloquear cualquier intento de abandonar la pantalla final salvo pulsación sobre sus controles.
anchor = """mirror.addEventListener('keydown',event=>{
  if(!locked)return;
  if(['ArrowUp','PageUp','Home'].includes(event.key)){releasePause();return}
  if(['ArrowDown','PageDown',' ','End'].includes(event.key)){event.preventDefault();event.stopPropagation()}
});"""
extra = anchor + """
function blockFinaleInput(event){
  if(!document.body.classList.contains('mirror-finale-active'))return;
  if(event.target && event.target.closest && event.target.closest('.mirror-flag-finale button'))return;
  event.preventDefault();event.stopPropagation();
}
window.addEventListener('wheel',blockFinaleInput,{passive:false,capture:true});
window.addEventListener('touchmove',blockFinaleInput,{passive:false,capture:true});
window.addEventListener('keydown',event=>{
  if(!document.body.classList.contains('mirror-finale-active'))return;
  if(['Tab','Enter',' '].includes(event.key))return;
  event.preventDefault();event.stopPropagation();
},{capture:true});
window.addEventListener('popstate',()=>{
  if(!document.body.classList.contains('mirror-finale-active'))return;
  history.pushState({mirrorFinale:true},'',location.href);
});"""
if anchor not in s:
    raise RuntimeError('No se encontró el bloque de teclado de EL ESPEJO')
s = s.replace(anchor, extra, 1)

old_start = """function start(){
  if(started)return;started=true;finished=false;locked=false;lockedScene=null;lastTouchY=null;
  mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;
  sceneNodes[0].focus({preventScroll:true});
}"""
new_start = """function start(){
  if(started)return;started=true;finished=false;locked=false;lockedScene=null;lastTouchY=null;
  clearFinaleTimers();
  finale.hidden=true;finale.classList.remove('is-active','show-options','show-card','show-question');
  document.body.classList.remove('mirror-finale-active');
  mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;
  sceneNodes[0].focus({preventScroll:true});
}"""
if old_start not in s:
    raise RuntimeError('No se encontró el arranque canónico de EL ESPEJO')
s = s.replace(old_start, new_start, 1)

old_reset = """window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;locked=false;lockedScene=null;mirror.hidden=true;document.body.classList.remove('mirror')});"""
new_reset = """window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;locked=false;lockedScene=null;clearFinaleTimers();finale.classList.remove('is-active','show-options','show-card','show-question');finale.hidden=true;document.body.classList.remove('mirror','mirror-finale-active');mirror.hidden=true});"""
if old_reset not in s:
    raise RuntimeError('No se encontró el reset canónico de EL ESPEJO')
s = s.replace(old_reset, new_reset, 1)

p.write_text(s, encoding='utf-8')

# Nunca debe existir salida automática desde EL ESPEJO.
p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')
old = """window.addEventListener('oras:mirror-end',()=>{
  resetReadingCycle();
  if(page.ana){topGo(rootPath+'elegia-breve/?v='+VERSION);return;}
  if(window.parent!==window){window.parent.postMessage({channel:'oras-universe-v2',type:'mirror-return'},location.origin);return;}
  topGo(rootPath+'elegia-breve/?v='+VERSION);
});"""
new = """window.addEventListener('oras:mirror-end',()=>{
  resetReadingCycle();
  // EL ESPEJO queda bloqueado en su pantalla final hasta una elección expresa.
});"""
if old in s:
    s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
