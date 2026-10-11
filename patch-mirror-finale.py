from pathlib import Path

p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')

# Quitar el antiguo flag incrustado en la coda. La coda conserva solo su texto.
old_mark = """  if(number===32){const mark=document.createElement('p');mark.className='mirror-end-mark';mark.textContent='flag';copy.append(mark);const end=document.createElement('span');end.className='mirror-end-sentinel';end.setAttribute('aria-hidden','true');scene.append(end)}
  mirror.append(scene);sceneNodes.push(scene);
});"""
new_mark = """  if(number===32){const end=document.createElement('span');end.className='mirror-end-sentinel';end.setAttribute('aria-hidden','true');scene.append(end)}
  mirror.append(scene);sceneNodes.push(scene);
});

// FINAL AUTÓNOMO DE EL ESPEJO: capa fija que sustituye por completo al flujo anterior.
const finale=document.createElement('section');
finale.className='mirror-flag-finale';
finale.hidden=true;
finale.setAttribute('role','region');
finale.setAttribute('aria-label','Final de EL ESPEJO');

const flag=document.createElement('div');
flag.className='mirror-flag-word';
flag.textContent='flag';

const finaleNav=document.createElement('nav');
finaleNav.className='mirror-finale-nav';
finaleNav.setAttribute('aria-label','Opciones finales');

const back=document.createElement('button');
back.type='button';back.textContent='Atrás';
back.setAttribute('aria-label','Volver al último fragmento de EL ESPEJO');
back.onclick=()=>leaveFinale(()=>{
  mirror.hidden=false;
  document.body.classList.add('mirror');
  const prev=sceneNodes[sceneNodes.length-1];
  mirror.scrollTop=prev.offsetTop;
  prev.focus({preventScroll:true});
});

const index=document.createElement('a');
index.textContent='Índice';index.href='../elegia-breve/?indice=1';index.target='_top';

const forward=document.createElement('a');
forward.textContent='Adelante';forward.href='../elegia-breve/#interludio';forward.target='_top';

const restart=document.createElement('button');
restart.type='button';restart.textContent='Reinicio';restart.setAttribute('aria-label','Reiniciar ANA KLAUDYA');
restart.onclick=()=>{
  try{
    const key='oras.universe.v2';
    const st=JSON.parse(localStorage.getItem(key)||'{}');
    Object.assign(st,{journeyStartedAt:Date.now(),soloComplete:false,anaComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:false});
    localStorage.setItem(key,JSON.stringify(st));
  }catch(_){}
  try{window.top.location.href='../elegia-breve/';}catch(_){location.href='../elegia-breve/';}
};
finaleNav.append(back,index,forward,restart);

const card=document.createElement('button');
card.type='button';card.className='mirror-finale-card';card.setAttribute('aria-label','Ir a SOLO LA TARJETA');
card.onclick=()=>{try{window.top.location.href='../?origen=tarjeta&auto=1';}catch(_){location.href='../?origen=tarjeta&auto=1';}};

const question=document.createElement('button');
question.type='button';question.className='mirror-finale-question';question.textContent='?';question.setAttribute('aria-label','Entrar en CENICIENTO');
question.onclick=()=>{try{window.top.location.href='../elegia-breve/#ceniciento';}catch(_){location.href='../elegia-breve/#ceniciento';}};

finale.append(flag,finaleNav,card,question);
document.body.append(finale);

let finaleTimers=[];
function clearFinaleTimers(){finaleTimers.forEach(clearTimeout);finaleTimers=[]}
function leaveFinale(next){
  clearFinaleTimers();
  document.body.classList.remove('mirror-finale-active');
  finale.classList.remove('is-active','show-nav','show-card','show-question');
  finale.hidden=true;
  if(typeof next==='function')next();
}
function enterFinale(){
  if(finale.classList.contains('is-active'))return;
  clearFinaleTimers();
  mirror.hidden=true;
  document.body.classList.remove('mirror');
  document.body.classList.add('mirror-finale-active');
  finale.hidden=false;
  requestAnimationFrame(()=>requestAnimationFrame(()=>finale.classList.add('is-active')));
  finaleTimers.push(setTimeout(()=>finale.classList.add('show-nav'),4200));
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
body .mirror-flag-word{position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,250,241,.76);font:italic 400 clamp(1.08rem,2.4vw,1.5rem)/1 Georgia,'Times New Roman',serif;letter-spacing:.24em;opacity:0;transform:scale(.985);transition:opacity 1.8s ease,transform 1.8s ease}
body .mirror-flag-finale.is-active .mirror-flag-word{opacity:1;transform:scale(1)}
body .mirror-finale-nav{position:absolute;z-index:5;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translate(-50%,12px);width:min(620px,calc(100% - 224px));height:48px;display:flex;align-items:stretch;border-top:1px solid rgba(255,250,241,.42);opacity:0;visibility:hidden;pointer-events:none;transition:opacity 1.8s ease,transform 1.8s ease,visibility 0s linear 1.8s}
body .mirror-flag-finale.show-nav .mirror-finale-nav{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%,0);transition-delay:0s}
body .mirror-finale-nav a,body .mirror-finale-nav button{flex:1 1 0;display:grid;place-items:center;min-width:0;min-height:48px;padding:7px 4px;border:0;border-radius:0;background:rgba(12,12,12,.06);color:#fffaf1;text-decoration:none;font:14px/1.2 system-ui,sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.9);cursor:pointer;backdrop-filter:blur(1.5px);-webkit-backdrop-filter:blur(1.5px)}
body .mirror-finale-nav>*+*{border-left:1px solid rgba(255,250,241,.24)}
body .mirror-finale-card{position:absolute;z-index:5;right:max(16px,env(safe-area-inset-right));bottom:calc(env(safe-area-inset-bottom,0px) + 12px);width:94px;height:58px;border:1px solid rgba(255,255,255,.23);border-radius:8px;background:linear-gradient(145deg,rgba(62,68,77,.18),rgba(20,24,30,.11));box-shadow:0 9px 26px rgba(0,0,0,.16),inset 0 0 0 1px rgba(255,255,255,.07);opacity:0;visibility:hidden;pointer-events:none;transform:rotate(4deg) translateY(10px);transition:opacity 1.9s ease,transform 1.9s ease,visibility 0s linear 1.9s;cursor:pointer;backdrop-filter:blur(1px)}
body .mirror-finale-card::before{content:'';position:absolute;left:13px;top:12px;width:23px;height:17px;border-radius:3px;background:linear-gradient(135deg,rgba(185,139,46,.70),rgba(241,217,139,.72) 48%,rgba(158,114,32,.65))}
body .mirror-finale-card::after{content:'';position:absolute;left:13px;right:13px;bottom:11px;height:2px;background:rgba(246,244,238,.65);box-shadow:0 -8px 0 rgba(246,244,238,.24),0 -16px 0 rgba(246,244,238,.10)}
body .mirror-flag-finale.show-card .mirror-finale-card{opacity:.72;visibility:visible;pointer-events:auto;transform:rotate(4deg) translateY(0);transition-delay:0s}
body .mirror-finale-question{position:absolute;z-index:6;right:max(26px,6vw);top:max(26px,8vh);width:62px;height:62px;border:1px solid rgba(255,250,241,.38);border-radius:50%;background:rgba(238,241,233,.08);color:#fffaf1;font:400 1.75rem/1 Georgia,serif;display:grid;place-items:center;opacity:0;visibility:hidden;pointer-events:none;transform:scale(.84);transition:opacity 2s ease,transform 2s ease,visibility 0s linear 2s;cursor:pointer;backdrop-filter:blur(1.5px)}
body .mirror-flag-finale.show-question .mirror-finale-question{opacity:.78;visibility:visible;pointer-events:auto;transform:scale(1);transition-delay:0s}
@media(max-width:700px){body .mirror-finale-nav{left:112px;right:112px;width:auto;transform:translateY(12px)}body .mirror-flag-finale.show-nav .mirror-finale-nav{transform:none}body .mirror-finale-card{right:max(10px,env(safe-area-inset-right));bottom:calc(env(safe-area-inset-bottom,0px) + 10px)}body .mirror-finale-question{right:18px;top:22px;width:54px;height:54px}}
`;
document.head.appendChild(finaleStyle);"""
if old_mark not in s:
    raise RuntimeError('No se encontró el cierre canónico de la escena 32 de EL ESPEJO')
s = s.replace(old_mark, new_mark, 1)

old_observer = """new IntersectionObserver(entries=>{\n  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;\n  finished=true;window.dispatchEvent(new CustomEvent('oras:mirror-end'));\n},{root:mirror,threshold:.5}).observe(endSentinel);"""
new_observer = """new IntersectionObserver(entries=>{\n  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;\n  finished=true;\n  enterFinale();\n},{root:mirror,threshold:.5}).observe(endSentinel);"""
if old_observer not in s:
    raise RuntimeError('No se encontró el observador final canónico de EL ESPEJO')
s = s.replace(old_observer, new_observer, 1)

anchor = """mirror.addEventListener('keydown',event=>{\n  if(!locked)return;\n  if(['ArrowUp','PageUp','Home'].includes(event.key)){releasePause();return}\n  if(['ArrowDown','PageDown',' ','End'].includes(event.key)){event.preventDefault();event.stopPropagation()}\n});"""
extra = anchor + """\nfunction blockFinaleInput(event){\n  if(!document.body.classList.contains('mirror-finale-active'))return;\n  event.preventDefault();event.stopPropagation();\n}\nwindow.addEventListener('wheel',blockFinaleInput,{passive:false,capture:true});\nwindow.addEventListener('touchmove',blockFinaleInput,{passive:false,capture:true});\nwindow.addEventListener('keydown',event=>{\n  if(!document.body.classList.contains('mirror-finale-active'))return;\n  if(['Tab'].includes(event.key))return;\n  event.preventDefault();event.stopPropagation();\n},{capture:true});"""
if anchor not in s:
    raise RuntimeError('No se encontró el bloque de teclado de EL ESPEJO')
s = s.replace(anchor, extra, 1)

old_reset = """window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;locked=false;lockedScene=null;mirror.hidden=true;document.body.classList.remove('mirror')});"""
new_reset = """window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;locked=false;lockedScene=null;clearFinaleTimers();finale.classList.remove('is-active','show-nav','show-card','show-question');finale.hidden=true;document.body.classList.remove('mirror','mirror-finale-active');mirror.hidden=true});"""
if old_reset in s:
    s = s.replace(old_reset, new_reset, 1)

p.write_text(s, encoding='utf-8')

# Se conserva el reset del ciclo por compatibilidad y coherencia de estado, pero nunca se navega automáticamente.
p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')
old = """window.addEventListener('oras:mirror-end',()=>{\n  resetReadingCycle();\n  if(page.ana){topGo(rootPath+'elegia-breve/?v='+VERSION);return;}\n  if(window.parent!==window){window.parent.postMessage({channel:'oras-universe-v2',type:'mirror-return'},location.origin);return;}\n  topGo(rootPath+'elegia-breve/?v='+VERSION);\n});"""
new = """window.addEventListener('oras:mirror-end',()=>{\n  resetReadingCycle();\n  // Sin salida automática: la pantalla final de EL ESPEJO exige una opción explícita.\n});"""
if old not in s:
    raise RuntimeError('No se encontró el retorno automático canónico de EL ESPEJO')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
