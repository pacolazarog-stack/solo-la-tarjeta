from pathlib import Path

VERSION_OLD='20261011-37'
VERSION_NEW='20261011-41'

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

  const forward=document.createElement('a');
  forward.href=rootPath+'elegia-breve/?v='+VERSION;forward.target='_top';forward.textContent='Adelante';
  forward.setAttribute('aria-label','Continuar a ANA KLAUDYA');

  nav.append(back,index,forward);
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""
if old not in s:
    raise RuntimeError('No se encontró la navegación final base de SOLO LA TARJETA')
s=s.replace(old,new,1)

anchor="  .ou-solo-endnav a,.ou-solo-endnav button,.ou-ceniciento-endnav a{"
style="""  .ou-solo-endnav{position:fixed!important;z-index:160!important;left:50%!important;bottom:calc(12px + env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%) translateY(8px)!important;width:min(480px,calc(100% - 24px))!important;height:48px!important;margin:0!important;display:flex!important;align-items:stretch!important;justify-content:center!important;gap:0!important;border:0!important;border-top:1px solid rgba(255,250,241,.42)!important;background:rgba(12,12,12,.045)!important;box-shadow:none!important;backdrop-filter:blur(1.5px)!important;-webkit-backdrop-filter:blur(1.5px)!important}.ou-solo-endnav.ou-visible{transform:translateX(-50%) translateY(0)!important}.ou-solo-endnav a,.ou-solo-endnav button{flex:1 1 0!important;min-width:0!important;min-height:48px!important;margin:0!important;padding:8px 6px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#fffaf1!important;font:14px/1.2 system-ui,sans-serif!important;font-style:normal!important;text-shadow:0 1px 3px rgba(0,0,0,.85)!important}.ou-solo-endnav>*+*{border-left:1px solid rgba(255,250,241,.24)!important}\n"""
if style not in s and anchor in s:
    s=s.replace(anchor,style+anchor,1)
p.write_text(s,encoding='utf-8')

for q in Path('.').rglob('*.html'):
    if '.git' in q.parts: continue
    t=q.read_text(encoding='utf-8')
    for oldv in ('20261011-37','20261011-38','20261011-39','20261011-40'):
        t=t.replace(f'narrative-universe.js?v={oldv}',f'narrative-universe.js?v={VERSION_NEW}')
    q.write_text(t,encoding='utf-8')

ana=Path('elegia-breve/index.html')
t=ana.read_text(encoding='utf-8')
index_style="""<style id="oras-related-works-index">
.journey-index .ou-related-work{width:100%;min-height:52px;margin:0!important;padding:8px 12px!important;text-align:left!important;border-radius:8px!important;font:14px/1.3 system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;box-shadow:none!important;color:#fff7e9!important;background:var(--piece-tone)!important;border:1px solid var(--piece-border)!important;text-shadow:0 1px 3px #0008!important;position:relative!important;isolation:isolate!important;overflow:hidden!important;display:flex!important;align-items:center!important}
.journey-index #anaSoloWork{--piece-tone:#493827;--piece-veil:#493827d9;--piece-border:#8d7153}
.journey-index #anaCenicientoWork{--piece-tone:#263d32;--piece-veil:#263d32d9;--piece-border:#657d69}
.journey-index .ou-related-work .piece-art{position:absolute;z-index:-2;inset:0 0 0 auto;width:60%;height:100%;pointer-events:none;opacity:.94}
.journey-index .ou-related-work .piece-art svg{display:block;width:100%;height:100%}
.journey-index .ou-related-work .piece-shade{position:absolute;z-index:-1;inset:0;pointer-events:none;background:linear-gradient(90deg,var(--piece-tone) 0%,var(--piece-tone) 35%,var(--piece-veil) 65%,transparent 100%)}
.journey-index .ou-related-work .piece-label{position:relative;max-width:82%;font-weight:500}
.journey-index .ou-related-work:hover,.journey-index .ou-related-work:focus-visible{background:var(--piece-tone)!important;border-color:#dfc69b!important;box-shadow:0 0 0 1px #dfc69b!important;transform:translateY(-1px)}
.journey-index .ou-related-work[disabled]{opacity:.34!important;cursor:not-allowed!important;filter:saturate(.28) brightness(.78)!important;transform:none!important;box-shadow:none!important}
.journey-index .ou-related-work[disabled]:hover{border-color:var(--piece-border)!important;box-shadow:none!important}
.journey-index .ou-related-work[disabled] .piece-art{opacity:.45}
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
  const unlockFromQuestion=()=>{write({cenicientoQuestionUnlocked:true,cenicientoUnlocked:true});refresh();};
  let cenBtn=null,cenLabel=null;
  const refresh=()=>{
    if(!cenBtn)return;
    const unlocked=read().cenicientoQuestionUnlocked===true;
    cenBtn.disabled=!unlocked;
    if(cenLabel)cenLabel.textContent=unlocked?'CENICIENTO':'CENICIENTO · bloqueado';
    cenBtn.setAttribute('aria-disabled',String(!unlocked));
  };
  const soloArt=`<span class="piece-art" aria-hidden="true"><svg viewBox="0 0 300 70" preserveAspectRatio="xMaxYMid meet"><g transform="translate(212 7) rotate(-7 34 24)"><rect x="0" y="0" width="70" height="48" rx="6" fill="#d8c49d" stroke="#fff0c9" stroke-opacity=".55"/><rect x="0" y="11" width="70" height="8" fill="#58412e" opacity=".9"/><rect x="9" y="28" width="22" height="8" rx="2" fill="#f4e7c7" opacity=".88"/><path d="M42 31h18M42 36h13" stroke="#6d5138" stroke-width="2" stroke-linecap="round"/></g><path d="M165 54h116" stroke="#d7c49f" stroke-opacity=".38" stroke-width="1"/></svg></span><span class="piece-shade" aria-hidden="true"></span><span class="piece-label">SOLO LA TARJETA</span>`;
  const cenArt=`<span class="piece-art" aria-hidden="true"><svg viewBox="0 0 300 70" preserveAspectRatio="xMaxYMid meet"><defs><linearGradient id="ashHair" x1="0" x2="1"><stop offset="0" stop-color="#303735"/><stop offset=".48" stop-color="#858b88"/><stop offset="1" stop-color="#d5d7d2"/></linearGradient></defs><g transform="translate(214 4)"><path d="M34 7c15 0 25 11 25 25 0 8-3 14-7 19-3 4-5 8-5 13H18c0-5-2-9-5-13-4-5-7-11-7-19C6 18 18 7 34 7Z" fill="#1c2421" stroke="#82908a" stroke-opacity=".65"/><path d="M11 27c4-15 14-22 27-20 10 1 18 7 22 17-9-5-17-6-25-4-8-5-15-2-24 7Z" fill="url(#ashHair)"/><path d="M24 36c2 2 5 3 8 3s6-1 8-3M25 29h3M40 29h3" fill="none" stroke="#c8d0cb" stroke-width="1.4" stroke-linecap="round"/><path d="M17 64c3-11 10-16 17-16s14 5 17 16" fill="#45514c" opacity=".9"/></g><circle cx="276" cy="15" r="1.7" fill="#d7ddd8" opacity=".5"/><circle cx="284" cy="25" r="1" fill="#d7ddd8" opacity=".35"/><circle cx="269" cy="31" r="1.2" fill="#d7ddd8" opacity=".4"/></svg></span><span class="piece-shade" aria-hidden="true"></span><span class="piece-label">CENICIENTO · bloqueado</span>`;
  const init=()=>{
    const nav=document.getElementById('anaNavigation');
    if(nav&&!document.getElementById('anaSoloWork')){
      const sep=document.createElement('div');sep.className='ou-related-separator';sep.setAttribute('aria-hidden','true');
      const solo=document.createElement('button');solo.type='button';solo.id='anaSoloWork';solo.className='entry-button piece-button ou-related-work';solo.innerHTML=soloArt;solo.addEventListener('click',()=>{location.href=ROOT+'?origen=indice&v=20261011-41'});
      cenBtn=document.createElement('button');cenBtn.type='button';cenBtn.id='anaCenicientoWork';cenBtn.className='entry-button piece-button ou-related-work';cenBtn.innerHTML=cenArt;cenLabel=cenBtn.querySelector('.piece-label');
      cenBtn.addEventListener('click',()=>{if(!cenBtn.disabled)location.href=ROOT+'ceniciento/?v=20261011-41'});
      nav.append(sep,solo,cenBtn);refresh();
    }else{cenBtn=document.getElementById('anaCenicientoWork');cenLabel=cenBtn&&cenBtn.querySelector('.piece-label');refresh();}
    const q=document.getElementById('cenicientoLink');
    if(q){
      q.addEventListener('click',unlockFromQuestion,true);
      q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){unlockFromQuestion();}},true);
    }
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
