from pathlib import Path

p=Path('elegia-breve/index.html')
s=p.read_text(encoding='utf-8')

marker='oras-flores-convergence-v1'
if marker in s:
    print('PASS: convergencia de Flores ya presente')
    raise SystemExit(0)

anchor='''<script data-oras-universe="v1" src="../narrative-universe.js'''
pos=s.rfind(anchor)
if pos < 0:
    raise RuntimeError('No se encontró la carga de narrative-universe.js en ANA KLAUDYA')

addon=r'''
<script id="oras-flores-convergence-v1">
;(()=>{
  const STORAGE='oras.universe.v2';
  const FOLLOW_CLASS='ou-flores-mirror-follow';
  let timer=0;

  const readState=()=>{
    try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch(_){return {}}
  };
  const isFlores=()=>location.hash.toLowerCase()==='#epilogo';
  const shouldConverge=()=>{
    const st=readState();
    return isFlores() && st.anaComplete===true && st.soloComplete===true &&
      st.cenicientoComplete===true && st.mirrorReadComplete!==true;
  };

  const style=document.createElement('style');
  style.id='oras-flores-convergence-style';
  style.textContent=`
    body.ou-flores-convergence #journeyNav,
    body.ou-flores-convergence .journey-nav,
    body.ou-flores-convergence .ou-card,
    body.ou-flores-convergence .ana-navigation,
    body.ou-flores-convergence #journeyIndex{display:none!important;visibility:hidden!important;pointer-events:none!important}
    .${FOLLOW_CLASS}{
      position:fixed!important;z-index:2147483200!important;left:50%!important;
      bottom:calc(34px + env(safe-area-inset-bottom,0px))!important;
      transform:translateX(-50%)!important;min-width:108px!important;min-height:50px!important;
      padding:11px 24px!important;border:1px solid rgba(32,29,25,.24)!important;border-radius:999px!important;
      background:rgba(238,241,233,.92)!important;color:#201d19!important;-webkit-text-fill-color:#201d19!important;
      font:italic 400 1rem/1.2 Georgia,'Times New Roman',serif!important;letter-spacing:.025em!important;
      box-shadow:0 8px 28px rgba(0,0,0,.12)!important;cursor:pointer!important;
    }
  `;
  document.head.appendChild(style);

  const removeFollow=()=>document.querySelector('.'+FOLLOW_CLASS)?.remove();
  const clear=()=>{
    clearTimeout(timer);timer=0;
    document.body.classList.remove('ou-flores-convergence');
    removeFollow();
  };

  const showFollow=()=>{
    if(!shouldConverge()||document.querySelector('.'+FOLLOW_CLASS))return;
    const follow=document.createElement('button');
    follow.type='button';follow.className=FOLLOW_CLASS;follow.textContent='Seguir';
    follow.setAttribute('aria-label','Continuar hacia EL ESPEJO');
    follow.addEventListener('click',()=>{
      if(!shouldConverge())return;
      follow.disabled=true;
      document.body.classList.add('ou-mirror-explicit-enter');
      window.dispatchEvent(new CustomEvent('oras:mirror-explicit-start'));
    },{once:true});
    document.body.appendChild(follow);
    requestAnimationFrame(()=>follow.focus({preventScroll:true}));
  };

  const apply=()=>{
    clearTimeout(timer);timer=0;
    removeFollow();
    if(!shouldConverge()){
      document.body.classList.remove('ou-flores-convergence');
      return;
    }
    document.body.classList.add('ou-flores-convergence');
    timer=window.setTimeout(showFollow,10000);
  };

  window.addEventListener('hashchange',apply);
  window.addEventListener('storage',event=>{if(event.key===STORAGE)apply()});
  window.addEventListener('oras:ana-part-complete',apply);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
</script>
'''

s=s[:pos]+addon+s[pos:]
p.write_text(s,encoding='utf-8')

check=p.read_text(encoding='utf-8')
required=[
    'oras-flores-convergence-v1',
    "location.hash.toLowerCase()==='#epilogo'",
    "st.anaComplete===true",
    "st.soloComplete===true",
    "st.cenicientoComplete===true",
    "st.mirrorReadComplete!==true",
    "window.setTimeout(showFollow,10000)",
    "follow.textContent='Seguir'",
    "new CustomEvent('oras:mirror-explicit-start')",
    "body.ou-flores-convergence #journeyNav",
    "body.ou-flores-convergence .ou-card",
]
for token in required:
    if token not in check: raise RuntimeError('Falta contrato de convergencia en Flores: '+token)
print('PASS: Flores decide al entrar; 3/3 oculta tarjeta y navegación, espera 10 s y muestra solo Seguir hacia EL ESPEJO')
