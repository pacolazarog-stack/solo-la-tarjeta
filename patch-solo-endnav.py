from pathlib import Path

VERSION_OLD='20261011-37'
VERSION_NEW='20261011-39'

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')
s=s.replace(f"const VERSION='{VERSION_OLD}';",f"const VERSION='{VERSION_NEW}';")

old="""function showSoloEndNav(){
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Navegación al terminar SOLO LA TARJETA');

  const forward=document.createElement('button');
  forward.type='button';
  forward.textContent='Adelante';
  forward.setAttribute('aria-label','Ir adelante');
  forward.addEventListener('click',()=>history.forward());

  const home=document.createElement('a');
  home.href=rootPath+'elegia-breve/?v='+VERSION;
  home.target='_top';
  home.textContent='Inicio';
  home.setAttribute('aria-label','Volver al inicio de ANA KLAUDYA');

  nav.append(forward,home);
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""
new="""function showSoloEndNav(){
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Navegación al terminar SOLO LA TARJETA');

  const back=document.createElement('button');
  back.type='button';back.textContent='Atrás';back.setAttribute('aria-label','Ir atrás');
  back.addEventListener('click',()=>history.back());

  const index=document.createElement('a');
  index.href=rootPath+'elegia-breve/?indice=1&v='+VERSION;index.target='_top';index.textContent='Índice';
  index.setAttribute('aria-label','Abrir el índice de ANA KLAUDYA');

  const forward=document.createElement('button');
  forward.type='button';forward.textContent='Adelante';forward.setAttribute('aria-label','Ir adelante');
  forward.addEventListener('click',()=>history.forward());

  nav.append(back,index,forward);
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""
if old not in s:
    raise RuntimeError('No se encontró la navegación final base de SOLO LA TARJETA')
s=s.replace(old,new,1)

# Igualar la barra final de SOLO al patrón lineal transparente de ANA.
anchor="  .ou-solo-endnav a,.ou-solo-endnav button,.ou-ceniciento-endnav a{"
style="""  .ou-solo-endnav{position:fixed!important;z-index:160!important;left:50%!important;bottom:calc(12px + env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%) translateY(8px)!important;width:min(480px,calc(100% - 24px))!important;height:48px!important;margin:0!important;display:flex!important;align-items:stretch!important;justify-content:center!important;gap:0!important;border:0!important;border-top:1px solid rgba(255,250,241,.42)!important;background:rgba(12,12,12,.045)!important;box-shadow:none!important;backdrop-filter:blur(1.5px)!important;-webkit-backdrop-filter:blur(1.5px)!important}.ou-solo-endnav.ou-visible{transform:translateX(-50%) translateY(0)!important}.ou-solo-endnav a,.ou-solo-endnav button{flex:1 1 0!important;min-width:0!important;min-height:48px!important;margin:0!important;padding:8px 6px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#fffaf1!important;font:14px/1.2 system-ui,sans-serif!important;font-style:normal!important;text-shadow:0 1px 3px rgba(0,0,0,.85)!important}.ou-solo-endnav>*+*{border-left:1px solid rgba(255,250,241,.24)!important}\n"""
if style not in s and anchor in s:
    s=s.replace(anchor,style+anchor,1)
p.write_text(s,encoding='utf-8')

# Renovar referencias al módulo compartido.
for q in Path('.').rglob('*.html'):
    if '.git' in q.parts: continue
    t=q.read_text(encoding='utf-8')
    for oldv in ('20261011-37','20261011-38'):
        t=t.replace(f'narrative-universe.js?v={oldv}',f'narrative-universe.js?v={VERSION_NEW}')
    q.write_text(t,encoding='utf-8')

# Extender el índice canónico de ANA KLAUDYA con las dos obras relacionadas.
ana=Path('elegia-breve/index.html')
t=ana.read_text(encoding='utf-8')
index_style="""<style id="oras-related-works-index">
.journey-index .ou-related-work{width:100%;min-height:44px;margin:0;padding:8px 12px;text-align:left;border-radius:8px;color:#fff7e9;background:rgba(12,12,12,.10);border:1px solid rgba(255,255,255,.18);font:14px/1.3 system-ui,sans-serif;letter-spacing:0;text-transform:none;box-shadow:none}
.journey-index .ou-related-work[disabled]{opacity:.36;cursor:not-allowed;filter:saturate(.45)}
.journey-index .ou-related-separator{height:1px;margin:7px 0;background:rgba(255,255,255,.16)}
</style>"""
if 'id="oras-related-works-index"' not in t:
    t=t.replace('</head>',index_style+'\n</head>',1)

index_script="""<script id="oras-related-works-index-script">
(()=>{
  const STORAGE='oras.universe.v2';
  const ROOT='/solo-la-tarjeta/';
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return {}}};
  const write=patch=>{const st=Object.assign({},read(),patch);try{localStorage.setItem(STORAGE,JSON.stringify(st))}catch(_){};return st};
  const unlock=()=>{write({cenicientoUnlocked:true});refresh();};
  let cenBtn=null;
  const refresh=()=>{if(!cenBtn)return;const unlocked=read().cenicientoUnlocked===true;cenBtn.disabled=!unlocked;cenBtn.textContent=unlocked?'CENICIENTO':'CENICIENTO · bloqueado';cenBtn.setAttribute('aria-disabled',String(!unlocked));};
  const init=()=>{
    const nav=document.getElementById('anaNavigation');
    if(nav&&!document.getElementById('anaSoloWork')){
      const sep=document.createElement('div');sep.className='ou-related-separator';sep.setAttribute('aria-hidden','true');
      const solo=document.createElement('button');solo.type='button';solo.id='anaSoloWork';solo.className='entry-button ou-related-work';solo.textContent='SOLO LA TARJETA';solo.addEventListener('click',()=>{location.href=ROOT+'?origen=indice&v=20261011-39'});
      cenBtn=document.createElement('button');cenBtn.type='button';cenBtn.id='anaCenicientoWork';cenBtn.className='entry-button ou-related-work';
      cenBtn.addEventListener('click',()=>{if(!cenBtn.disabled)location.href=ROOT+'ceniciento/?v=20261011-39'});
      nav.append(sep,solo,cenBtn);refresh();
    }else cenBtn=document.getElementById('anaCenicientoWork');
    const q=document.getElementById('cenicientoLink');
    if(q){q.addEventListener('click',unlock,true);q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){unlock();}},true);}
    if(new URLSearchParams(location.search).get('indice')==='1'){
      const dlg=document.getElementById('journeyIndex');
      if(dlg&&!dlg.open){try{dlg.showModal()}catch(_){dlg.setAttribute('open','')}}
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  addEventListener('storage',e=>{if(e.key===STORAGE)refresh()});
})();
</script>"""
if 'id="oras-related-works-index-script"' not in t:
    t=t.replace('</body>',index_script+'\n</body>',1)
ana.write_text(t,encoding='utf-8')
