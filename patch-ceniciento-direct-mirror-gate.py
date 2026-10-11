from pathlib import Path
import runpy

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

addon=r'''

;(()=>{
  // oras-ceniciento-direct-mirror-gate-v1
  const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
  if(!path.endsWith('/ceniciento'))return;

  const STORAGE='oras.universe.v2';
  const readState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return {}}};
  const mirrorPending=()=>{
    const st=readState();
    return st.anaComplete===true &&
      st.soloComplete===true &&
      st.cenicientoComplete===true &&
      st.cenicientoUnlocked===true &&
      st.mirrorReadComplete!==true;
  };

  const style=document.createElement('style');
  style.id='oras-ceniciento-direct-mirror-gate-style';
  style.textContent=`
    body.ou-ceniciento-direct-mirror .ou-ceniciento-endnav,
    body.ou-ceniciento-direct-mirror .journey-nav{
      display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important
    }
    body.ou-ceniciento-direct-mirror .ou-card,
    body.ou-ceniciento-direct-mirror .ou-reading-checklist{
      pointer-events:none!important
    }
  `;
  document.head.appendChild(style);

  let armed=false,readyTimer=0;
  const arm=()=>{
    if(armed || !document.body.classList.contains('ou-ceniciento-finale-ready') || !mirrorPending())return false;
    const nav=document.querySelector('.ou-ceniciento-endnav');
    const overlay=document.querySelector('.ou-mirror-transition');
    const follow=overlay?.querySelector('button');
    if(!overlay || !follow)return false;

    armed=true;
    document.body.classList.add('ou-ceniciento-direct-mirror');
    document.body.classList.remove('ou-ceniciento-navigation-visible');
    if(nav){nav.hidden=true;nav.classList.remove('ou-visible','ou-two-button-nav')}

    follow.textContent='Seguir';
    follow.setAttribute('aria-label','Seguir hacia EL ESPEJO');
    follow.disabled=false;
    overlay.classList.remove('is-ready','is-leaving');
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('is-open')));
    clearTimeout(readyTimer);
    readyTimer=setTimeout(()=>{
      if(!armed || !mirrorPending())return;
      overlay.classList.add('is-ready');
      follow.focus({preventScroll:true});
    },2200);
    return true;
  };

  const sync=()=>{
    if(!mirrorPending()){
      armed=false;clearTimeout(readyTimer);
      document.body.classList.remove('ou-ceniciento-direct-mirror');
      return;
    }
    arm();
  };

  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  addEventListener('storage',sync);
  requestAnimationFrame(sync);
})();
'''

if 'oras-ceniciento-direct-mirror-gate-v1' not in s:
    s += addon

p.write_text(s,encoding='utf-8')
print('PASS: CENICIENTO 3/3 hides ordinary navigation and exposes only Seguir into EL ESPEJO')

# El contenedor ANA puede mostrar CENICIENTO conservando /elegia-breve/#ceniciento
# en la barra de direcciones. En ese contexto, los recursos relativos de CENICIENTO
# se resolverían contra /elegia-breve/ y dejarían VOZ y LEER permanentemente desactivados.
# Aplicamos el endurecimiento de rutas en el mismo paso ya autoritativo de Pages.
runpy.run_path('patch-ceniciento-absolute-assets.py',run_name='__main__')

# VOZ y LEER no deben permanecer bloqueados por una espera de metadatos, fotogramas
# o una petición de texto que no concluya. El texto canónico se embebe como respaldo,
# VOZ deja de depender de los fotogramas para habilitarse y se fuerza una URL nueva
# del iframe para evitar reutilizar una portada cacheada anterior.
runpy.run_path('patch-ceniciento-entry-startup.py',run_name='__main__')
