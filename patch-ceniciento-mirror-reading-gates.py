from pathlib import Path

# 1) CENICIENTO -> EL ESPEJO: a real transition screen, then an explicit Seguir.
p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')
addon = r'''
;(()=>{
  const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
  if(!path.endsWith('/ceniciento'))return;

  const style=document.createElement('style');
  style.id='oras-ceniciento-mirror-transition-style';
  style.textContent=`
    .ou-mirror-transition{position:fixed;z-index:2147482500;inset:0;display:grid;place-items:center;background:rgba(16,14,13,0);opacity:0;visibility:hidden;pointer-events:none;transition:background 1.65s ease,opacity 1.65s ease,visibility 0s linear 1.65s}
    .ou-mirror-transition.is-open{background:rgba(16,14,13,.985);opacity:1;visibility:visible;pointer-events:auto;transition-delay:0s}
    .ou-mirror-transition button{min-width:108px;min-height:50px;padding:11px 24px;border:1px solid rgba(255,250,241,.28);border-radius:999px;background:rgba(12,12,12,.76)!important;color:#fffaf1!important;-webkit-text-fill-color:#fffaf1!important;font:italic 400 1.05rem/1.2 Georgia,'Times New Roman',serif;letter-spacing:.03em;text-shadow:0 2px 14px rgba(0,0,0,.88);opacity:0;transform:translateY(8px);visibility:hidden;pointer-events:none;transition:opacity 1s ease,transform 1s ease,visibility 0s linear 1s;cursor:pointer}
    .ou-mirror-transition.is-ready button{opacity:1;transform:none;visibility:visible;pointer-events:auto;transition-delay:0s}
    .ou-mirror-transition.is-leaving{background:rgba(16,14,13,1);opacity:0;transition:opacity .72s ease}
  `;
  document.head.appendChild(style);

  const overlay=document.createElement('div');
  overlay.className='ou-mirror-transition';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Transición a EL ESPEJO');
  const follow=document.createElement('button');
  follow.type='button';follow.textContent='Seguir';follow.setAttribute('aria-label','Seguir hacia EL ESPEJO');
  overlay.appendChild(follow);document.body.appendChild(overlay);

  let readyTimer=0,starting=false;
  function openTransition(){
    if(starting||overlay.classList.contains('is-open'))return;
    clearTimeout(readyTimer);
    overlay.classList.remove('is-ready','is-leaving');
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('is-open')));
    readyTimer=setTimeout(()=>{overlay.classList.add('is-ready');follow.focus({preventScroll:true});},2200);
  }
  function startMirror(){
    if(starting||!overlay.classList.contains('is-ready'))return;
    starting=true;clearTimeout(readyTimer);follow.disabled=true;
    overlay.classList.remove('is-ready');overlay.classList.add('is-leaving');
    setTimeout(()=>{
      overlay.classList.remove('is-open','is-leaving');
      starting=false;follow.disabled=false;
      window.dispatchEvent(new CustomEvent('oras:mirror-start'));
    },760);
  }
  follow.addEventListener('click',startMirror);

  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('.ou-ceniciento-endnav button');
    if(!button||!document.body.classList.contains('ou-ceniciento-finale-ready'))return;
    if(button.textContent.trim().toLowerCase()!=='adelante')return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    openTransition();
  },true);

  window.addEventListener('keydown',event=>{
    if(!overlay.classList.contains('is-open'))return;
    if(overlay.classList.contains('is-ready')&&event.target===follow&&['Enter',' '].includes(event.key))return;
    if(event.key==='Tab'&&overlay.classList.contains('is-ready')){event.preventDefault();follow.focus();return;}
    event.preventDefault();event.stopPropagation();
  },true);
  window.addEventListener('wheel',event=>{if(overlay.classList.contains('is-open')){event.preventDefault();event.stopPropagation()}},{passive:false,capture:true});
  window.addEventListener('touchmove',event=>{if(overlay.classList.contains('is-open')){event.preventDefault();event.stopPropagation()}},{passive:false,capture:true});
})();
'''
if 'oras-ceniciento-mirror-transition-style' not in s:
    s += addon
p.write_text(s, encoding='utf-8')

# 2) EL ESPEJO: durante la lectura no hay barra de botones. En cada pausa la página
# queda completamente bloqueada hasta pulsar Seguir. Además, antes de la pantalla
# final con flag, el último fragmento debe permanecer íntegro 10 segundos; sólo
# entonces aparece Seguir. Al pulsarlo se abre flag con la botonera final.
p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')

# Cada pausa sólo puede dispararse una vez por lectura. Al pulsar Seguir se marca
# como consumida y se avanza automáticamente al fragmento siguiente.
pause_click_old = """next.addEventListener('click',()=>{if(!locked||lockedScene!==scene)return;releasePause();scene.focus({preventScroll:true})});"""
pause_click_new = """next.addEventListener('click',()=>{
      if(!locked||lockedScene!==scene)return;
      scene.dataset.pauseConsumed='true';
      releasePause();
      const nextScene=sceneNodes[index+1];
      if(nextScene){
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          mirror.scrollTo({top:nextScene.offsetTop,behavior:'smooth'});
          nextScene.focus({preventScroll:true});
        }));
      }
    });"""
if pause_click_old in s:
    s = s.replace(pause_click_old, pause_click_new, 1)

pause_trigger_old = """if(entry.isIntersecting&&entry.intersectionRatio>=.68&&entry.target.dataset.pause==='true'){"""
pause_trigger_new = """if(entry.isIntersecting&&entry.intersectionRatio>=.68&&entry.target.dataset.pause==='true'&&entry.target.dataset.pauseConsumed!=='true'){"""
if pause_trigger_old in s:
    s = s.replace(pause_trigger_old, pause_trigger_new, 1)

sentinel_anchor = "const endSentinel=mirror.querySelector('.mirror-end-sentinel');\n"
final_gate = r'''const endSentinel=mirror.querySelector('.mirror-end-sentinel');
let finalGateArmed=false,finalGateReady=false,finalGateTimer=0;
const finalScene=sceneNodes[sceneNodes.length-1];
const finalFollow=document.createElement('button');
finalFollow.type='button';
finalFollow.className='mirror-continue mirror-final-continue';
finalFollow.textContent='seguir';
finalFollow.setAttribute('aria-label','Continuar a la pantalla final de EL ESPEJO');
finalFollow.hidden=true;
finalScene.append(finalFollow);
function resetMirrorFinalGate(){
  clearTimeout(finalGateTimer);finalGateTimer=0;
  finalGateArmed=false;finalGateReady=false;
  finalFollow.hidden=true;
  document.body.classList.remove('mirror-final-wait-locked');
}
function armMirrorFinalGate(){
  if(finished||!started||finalGateArmed)return;
  finalGateArmed=true;finalGateReady=false;
  locked=true;lockedScene=finalScene;
  finalFollow.hidden=true;
  document.body.classList.add('mirror-final-wait-locked');
  mirror.scrollTop=finalScene.offsetTop;
  finalGateTimer=setTimeout(()=>{
    if(!finalGateArmed||finished)return;
    finalGateReady=true;
    finalFollow.hidden=false;
    finalFollow.focus({preventScroll:true});
  },10000);
}
finalFollow.addEventListener('click',()=>{
  if(!finalGateArmed||!finalGateReady)return;
  clearTimeout(finalGateTimer);finalGateTimer=0;
  finalGateReady=false;finalGateArmed=false;
  finalFollow.hidden=true;
  locked=false;lockedScene=null;
  document.body.classList.remove('mirror-final-wait-locked');
  enterFinale();
});
'''
if 'mirror-final-wait-locked' not in s:
    if sentinel_anchor not in s:
        raise RuntimeError('No se encontró el centinela final de EL ESPEJO')
    s = s.replace(sentinel_anchor, final_gate, 1)

s = s.replace(
"""const finishObserver=new IntersectionObserver(entries=>{
  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;
  enterFinale();
},{root:mirror,threshold:.35});""",
"""const finishObserver=new IntersectionObserver(entries=>{
  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;
  armMirrorFinalGate();
},{root:mirror,threshold:.35});""",
1)
s = s.replace("if(remaining<=8)enterFinale();", "if(remaining<=8)armMirrorFinalGate();", 1)

start_old = """function start(){
  if(started)return;started=true;finished=false;locked=false;lockedScene=null;lastTouchY=null;
  clearFinaleTimers();
  finale.hidden=true;finale.classList.remove('is-active','show-options','show-card','show-question');
  document.body.classList.remove('mirror-finale-active');
  mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;
  sceneNodes[0].focus({preventScroll:true});
}"""
start_new = """function start(){
  if(started)return;started=true;finished=false;locked=false;lockedScene=null;lastTouchY=null;
  sceneNodes.forEach(scene=>delete scene.dataset.pauseConsumed);
  resetMirrorFinalGate();
  clearFinaleTimers();
  finale.hidden=true;finale.classList.remove('is-active','show-options','show-card','show-question');
  document.body.classList.remove('mirror-finale-active');
  mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;
  sceneNodes[0].focus({preventScroll:true});
}"""
if start_old in s:
    s = s.replace(start_old, start_new, 1)

reset_old = """window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;locked=false;lockedScene=null;clearFinaleTimers();finale.classList.remove('is-active','show-options','show-card','show-question');finale.hidden=true;document.body.classList.remove('mirror','mirror-finale-active');mirror.hidden=true});"""
reset_new = """window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;locked=false;lockedScene=null;sceneNodes.forEach(scene=>delete scene.dataset.pauseConsumed);resetMirrorFinalGate();clearFinaleTimers();finale.classList.remove('is-active','show-options','show-card','show-question');finale.hidden=true;document.body.classList.remove('mirror','mirror-finale-active');mirror.hidden=true});"""
if reset_old in s:
    s = s.replace(reset_old, reset_new, 1)

addon = r'''

;(()=>{
  const mirror=document.getElementById('mirror');
  if(!mirror)return;
  const style=document.createElement('style');
  style.id='oras-mirror-explicit-follow-gates';
  style.textContent=`
    body.mirror .ou-ceniciento-endnav,
    body.mirror .ou-solo-endnav,
    body.mirror .ou-reading-checklist,
    body.mirror .ou-card,
    body.mirror .journey-nav{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}
    body.mirror.mirror-pause-locked #mirror,
    body.mirror.mirror-final-wait-locked #mirror{overflow:hidden!important;touch-action:none!important;overscroll-behavior:none!important}
    body.mirror .mirror-continue{z-index:2147482000!important;background:rgba(12,12,12,.72)!important;color:#fffaf1!important;-webkit-text-fill-color:#fffaf1!important;border:1px solid rgba(255,250,241,.30)!important;border-radius:999px!important;padding:10px 22px!important;min-width:104px!important;text-shadow:0 2px 14px rgba(0,0,0,.9)!important}
    body.mirror .mirror-final-continue{position:absolute!important;left:50%!important;bottom:max(7vh,52px)!important;transform:translateX(-50%)!important}
  `;
  document.head.appendChild(style);

  const buttons=[...mirror.querySelectorAll('.mirror-continue')];
  const visibleButton=()=>buttons.find(button=>!button.hidden);
  const syncLock=()=>document.body.classList.toggle('mirror-pause-locked',document.body.classList.contains('mirror')&&!!visibleButton()&&!document.body.classList.contains('mirror-final-wait-locked'));
  buttons.forEach(button=>new MutationObserver(syncLock).observe(button,{attributes:true,attributeFilter:['hidden']}));
  new MutationObserver(syncLock).observe(document.body,{attributes:true,attributeFilter:['class']});
  syncLock();

  const blockWhilePaused=event=>{
    const finalWait=document.body.classList.contains('mirror-final-wait-locked');
    if(!document.body.classList.contains('mirror-pause-locked')&&!finalWait)return;
    const button=visibleButton();
    if(event.type==='keydown'&&button&&event.target===button&&['Enter',' '].includes(event.key))return;
    if(event.type==='keydown'&&event.key==='Tab'&&button){
      event.preventDefault();event.stopPropagation();button.focus({preventScroll:true});return;
    }
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
  };
  window.addEventListener('wheel',blockWhilePaused,{passive:false,capture:true});
  window.addEventListener('touchmove',blockWhilePaused,{passive:false,capture:true});
  window.addEventListener('keydown',blockWhilePaused,{capture:true});
})();
'''
if 'oras-mirror-explicit-follow-gates' not in s:
    s += addon
p.write_text(s, encoding='utf-8')

print('PASS: CENICIENTO transition, EL ESPEJO gates, one-shot pauses and 10-second final hold applied')
