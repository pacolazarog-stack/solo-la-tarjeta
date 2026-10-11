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

# 2) EL ESPEJO: during reading there is no button bar. At each pause the page is
# completely locked until the visible Seguir button is pressed.
p = Path('ceniciento/el-espejo.js')
s = p.read_text(encoding='utf-8')
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
    body.mirror.mirror-pause-locked #mirror{overflow:hidden!important;touch-action:none!important;overscroll-behavior:none!important}
    body.mirror .mirror-continue{z-index:2147482000!important;background:rgba(12,12,12,.72)!important;color:#fffaf1!important;-webkit-text-fill-color:#fffaf1!important;border:1px solid rgba(255,250,241,.30)!important;border-radius:999px!important;padding:10px 22px!important;min-width:104px!important;text-shadow:0 2px 14px rgba(0,0,0,.9)!important}
  `;
  document.head.appendChild(style);

  const buttons=[...mirror.querySelectorAll('.mirror-continue')];
  const visibleButton=()=>buttons.find(button=>!button.hidden);
  const syncLock=()=>document.body.classList.toggle('mirror-pause-locked',document.body.classList.contains('mirror')&&!!visibleButton());
  buttons.forEach(button=>new MutationObserver(syncLock).observe(button,{attributes:true,attributeFilter:['hidden']}));
  new MutationObserver(syncLock).observe(document.body,{attributes:true,attributeFilter:['class']});
  syncLock();

  const blockWhilePaused=event=>{
    if(!document.body.classList.contains('mirror-pause-locked'))return;
    const button=visibleButton();
    if(event.type==='keydown'&&button&&event.target===button&&['Enter',' '].includes(event.key))return;
    if(event.type==='keydown'&&event.key==='Tab'){
      event.preventDefault();event.stopPropagation();button?.focus({preventScroll:true});return;
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

print('PASS: CENICIENTO transition and EL ESPEJO explicit follow gates applied')
