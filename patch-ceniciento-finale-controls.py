from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

addon=r'''
;(()=>{
  const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
  if(!path.endsWith('/ceniciento'))return;
  const ROOT='/solo-la-tarjeta/';
  const STORAGE='oras.universe.v2';
  const go=u=>{try{window.top.location.href=u}catch(_){location.href=u}};
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return {}}};

  const style=document.createElement('style');
  style.id='oras-ceniciento-finale-common-controls';
  style.textContent=`
  body.ou-ceniciento-navigation-visible .status{display:none!important}
  .ou-ceniciento-endnav{
    position:fixed!important;z-index:160!important;left:50%!important;right:auto!important;
    bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;
    transform:translateX(-50%) translateY(8px)!important;
    width:min(620px,calc(100% - 224px))!important;height:48px!important;
    display:flex!important;align-items:stretch!important;justify-content:center!important;gap:0!important;
    margin:0!important;padding:0!important;border:0!important;
    border-top:1px solid rgba(255,250,241,.42)!important;border-radius:0!important;
    background:rgba(12,12,12,.045)!important;box-shadow:none!important;
    backdrop-filter:blur(1.5px)!important;-webkit-backdrop-filter:blur(1.5px)!important;
  }
  .ou-ceniciento-endnav.ou-visible{transform:translateX(-50%) translateY(0)!important}
  .ou-ceniciento-endnav a,.ou-ceniciento-endnav button{
    flex:1 1 0!important;display:grid!important;place-items:center!important;min-width:0!important;min-height:48px!important;
    margin:0!important;padding:7px 4px!important;border:0!important;border-radius:0!important;
    background:transparent!important;box-shadow:none!important;color:#fffaf1!important;text-decoration:none!important;
    font:14px/1.2 system-ui,sans-serif!important;font-style:normal!important;text-shadow:0 1px 4px rgba(0,0,0,.9)!important;
    cursor:pointer!important;
  }
  .ou-ceniciento-endnav>*+*{border-left:1px solid rgba(255,250,241,.24)!important}
  .ou-ceniciento-endnav .ou-card-exit{min-width:0!important;min-height:48px!important;padding:7px 4px!important;background:transparent!important;color:#fffaf1!important;border:0!important;border-radius:0!important;box-shadow:none!important}
  .ou-ceniciento-endnav::before{display:none!important}
  .ou-card{right:max(16px,env(safe-area-inset-right))!important;left:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 12px)!important;background:linear-gradient(145deg,rgba(62,68,77,.18),rgba(20,24,30,.11))!important;opacity:.72!important;box-shadow:0 9px 26px rgba(0,0,0,.16),inset 0 0 0 1px rgba(255,255,255,.07)!important;animation:none!important;backdrop-filter:blur(1px)!important;-webkit-backdrop-filter:blur(1px)!important}
  .ou-reading-checklist{left:max(10px,env(safe-area-inset-left))!important;right:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important}
  .ou-reading-checklist summary{margin-left:0!important;background:rgba(12,12,12,.18)!important;border-color:rgba(255,255,255,.20)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important}
  .ou-reading-checklist ul{left:0!important;right:auto!important;background:rgba(12,12,12,.36)!important}
  @media(max-width:700px){
    .ou-ceniciento-endnav{left:112px!important;right:112px!important;width:auto!important;transform:translateY(8px)!important}
    .ou-ceniciento-endnav.ou-visible{transform:none!important}
    .ou-ceniciento-endnav a,.ou-ceniciento-endnav button{font-size:12px!important;padding:7px 3px!important}
    .ou-card{right:max(10px,env(safe-area-inset-right))!important;width:94px!important;height:58px!important}
  }
  `;
  document.head.appendChild(style);

  const ensureChecklist=()=>{
    let box=document.querySelector('.ou-reading-checklist');
    if(!box){
      box=document.createElement('details');box.className='ou-reading-checklist';box.setAttribute('aria-label','Estado de las lecturas');
      box.innerHTML='<summary>Lecturas</summary><ul><li data-piece="ana"></li><li data-piece="solo"></li><li data-piece="ceniciento"></li></ul>';
      document.body.appendChild(box);
    }
    const st=read();
    const items=[['ana','anaComplete','ANA KLAUDYA'],['solo','soloComplete','SOLO LA TARJETA'],['ceniciento','cenicientoComplete','CENICIENTO']];
    let done=0;
    for(const [piece,key,label] of items){
      const row=box.querySelector(`[data-piece="${piece}"]`);if(!row)continue;
      const ok=st[key]===true;if(ok)done++;
      row.dataset.done=String(ok);row.textContent=`${label} · ${ok?'completa':'pendiente'}`;
    }
    const summary=box.querySelector('summary');if(summary)summary.textContent=`Lecturas · ${done}/3`;
  };

  const ensureCard=()=>{
    if(document.querySelector('.ou-card'))return;
    const card=document.createElement('button');card.type='button';card.className='ou-card';
    card.setAttribute('aria-label','Abrir SOLO LA TARJETA');
    card.addEventListener('click',()=>go(ROOT+'?origen=ceniciento'));
    document.body.appendChild(card);
  };

  const normalizeNav=()=>{
    const nav=document.querySelector('.ou-ceniciento-endnav');
    if(!nav||nav.dataset.commonFinale==='1')return !!nav;
    nav.dataset.commonFinale='1';
    nav.setAttribute('aria-label','Navegación final de CENICIENTO');
    nav.replaceChildren();

    const back=document.createElement('button');back.type='button';back.textContent='Atrás';back.setAttribute('aria-label','Ir atrás');back.onclick=()=>history.back();
    const index=document.createElement('a');index.textContent='Índice';index.href=ROOT+'elegia-breve/?indice=1';index.target='_top';index.setAttribute('aria-label','Abrir índice de ANA KLAUDYA');
    const forward=document.createElement('button');forward.type='button';forward.textContent='Adelante';forward.setAttribute('aria-label','Continuar a EL ESPEJO');forward.onclick=()=>window.dispatchEvent(new CustomEvent('oras:mirror-start'));
    const ana=document.createElement('a');ana.textContent='ANA KLAUDYA';ana.href=ROOT+'elegia-breve/';ana.target='_top';ana.setAttribute('aria-label','Volver a ANA KLAUDYA');
    nav.append(back,index,forward,ana);
    return true;
  };

  const cleanFin=()=>{const st=document.getElementById('status');if(st&&/^fin$/i.test(st.textContent.trim()))st.textContent=''};
  const apply=()=>{normalizeNav();ensureChecklist();ensureCard();cleanFin()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  const mo=new MutationObserver(apply);mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  addEventListener('storage',ensureChecklist);
})();
'''

if 'oras-ceniciento-finale-common-controls' not in s:
    s += addon
p.write_text(s,encoding='utf-8')
