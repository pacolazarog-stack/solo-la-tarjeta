from pathlib import Path

p=Path('ceniciento/el-espejo.js')
s=p.read_text(encoding='utf-8')

marker='})();\n'
if marker not in s:
    raise RuntimeError('No se encontró el cierre de EL ESPEJO')

inject=r'''

/* ORAS — cierre mínimo definitivo de EL ESPEJO.
   Tras la escena 32: negro -> flag -> negro -> retorno automático a ANA KLAUDYA.
   No existen controles ni posibilidad de interacción durante este cierre. */
finaleNav?.remove();
card?.remove();
question?.remove();

const minimalFinaleStyle=document.createElement('style');
minimalFinaleStyle.id='oras-mirror-minimal-finale';
minimalFinaleStyle.textContent=`
html:has(body.mirror-finale-active),body.mirror-finale-active{background:#000!important;overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important}
body.mirror-finale-active>:not(.mirror-flag-finale):not(script):not(style){visibility:hidden!important;display:none!important;pointer-events:none!important}
body.mirror-finale-active .ou-reading-checklist,
body.mirror-finale-active .sound-toggle,
body.mirror-finale-active .journey-nav,
body.mirror-finale-active .ou-solo-endnav{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
body .mirror-flag-finale{background:#000!important;color:#fff!important}
body .mirror-flag-finale .mirror-finale-nav,
body .mirror-flag-finale .mirror-finale-card,
body .mirror-flag-finale .mirror-finale-question{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
body .mirror-flag-word{opacity:0!important;transform:none!important;transition:none!important;color:rgba(255,255,255,.78)!important;font:italic 400 clamp(.78rem,1.15vw,.96rem)/1 Georgia,'Times New Roman',serif!important;letter-spacing:.30em!important}
body .mirror-flag-finale.ou-flag-visible .mirror-flag-word{opacity:1!important;transition:none!important}
body .mirror-flag-finale.ou-flag-fading .mirror-flag-word{opacity:0!important;transition:opacity 2.2s ease!important}
`;
document.head.appendChild(minimalFinaleStyle);

function swallowMinimalFinaleInput(event){
  if(!document.body.classList.contains('mirror-finale-active'))return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
}
window.addEventListener('wheel',swallowMinimalFinaleInput,{passive:false,capture:true});
window.addEventListener('touchmove',swallowMinimalFinaleInput,{passive:false,capture:true});
window.addEventListener('pointerdown',swallowMinimalFinaleInput,{passive:false,capture:true});
window.addEventListener('click',swallowMinimalFinaleInput,{capture:true});
window.addEventListener('keydown',swallowMinimalFinaleInput,{capture:true});
window.addEventListener('contextmenu',swallowMinimalFinaleInput,{capture:true});

enterFinale=function(){
  if(finale.classList.contains('is-active'))return;
  clearFinaleTimers();
  finished=true;
  locked=false;
  lockedScene=null;
  mirror.hidden=true;
  document.body.classList.remove('mirror');
  document.body.classList.add('mirror-finale-active');
  finale.hidden=false;
  finale.classList.remove('show-options','show-card','show-question','ou-flag-visible','ou-flag-fading');
  flag.style.visibility='visible';
  requestAnimationFrame(()=>requestAnimationFrame(()=>finale.classList.add('is-active')));

  // Movimiento 1: negro absoluto durante cinco segundos.
  finaleTimers.push(setTimeout(()=>{
    // Movimiento 2: aparición seca, sin animación, de flag.
    finale.classList.add('ou-flag-visible');
  },5000));

  // flag permanece cuatro segundos y medio.
  finaleTimers.push(setTimeout(()=>{
    finale.classList.remove('ou-flag-visible');
    finale.classList.add('ou-flag-fading');
  },9500));

  // Movimiento 3: disolución y regreso al negro.
  finaleTimers.push(setTimeout(()=>{
    flag.style.visibility='hidden';
    finale.classList.remove('ou-flag-fading');
  },11700));

  // Un breve negro final y retorno automático al universo principal.
  finaleTimers.push(setTimeout(()=>{
    window.dispatchEvent(new CustomEvent('oras:mirror-end'));
    const target=ROOT+'elegia-breve/';
    try{window.top.location.replace(target);}catch(_){location.replace(target);}
  },13000));
};
'''

s=s.rsplit(marker,1)[0]+inject+'\n'+marker
p.write_text(s,encoding='utf-8')
print('PASS: EL ESPEJO termina sin controles: negro -> flag -> negro -> ANA KLAUDYA')
