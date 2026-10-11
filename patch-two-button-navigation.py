from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

addon=r'''

;(()=>{
  const ROOT='/solo-la-tarjeta/';
  const NAV_SELECTOR='.journey-nav,.ou-solo-endnav,.ou-ceniciento-endnav';
  const normalize=text=>(text||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const go=href=>{try{window.top.location.href=href}catch(_){location.href=href}};
  const currentPath=()=>location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');

  const routeForward=nav=>{
    const path=currentPath();
    const children=[...nav.children];
    const forward=children.find(child=>['adelante','delante'].includes(normalize(child.textContent)));
    if(!forward)return;

    /* La navegación ordinaria forma un recorrido legible, no una puerta automática a EL ESPEJO. */
    if(path.endsWith('/ceniciento')){
      forward.setAttribute('aria-label','Ir a SOLO LA TARJETA');
      if(forward.tagName==='A'){
        forward.href=ROOT+'?origen=ceniciento-nav&auto=1';
        forward.target='_top';
      }else{
        forward.onclick=event=>{event.preventDefault();event.stopPropagation();go(ROOT+'?origen=ceniciento-nav&auto=1');};
      }
    }else if(path==='/solo-la-tarjeta' || path.endsWith('/solo-la-tarjeta')){
      forward.setAttribute('aria-label','Ir a Siguiendo una tarjeta');
      if(forward.tagName==='A'){
        forward.href=ROOT+'elegia-breve/#estrella';
        forward.target='_top';
      }else{
        forward.onclick=event=>{event.preventDefault();event.stopPropagation();go(ROOT+'elegia-breve/#estrella');};
      }
    }
  };

  const stripIndex=nav=>{
    if(!nav||!nav.matches?.(NAV_SELECTOR))return;
    for(const child of [...nav.children]){
      const text=normalize(child.textContent);
      if(text==='indice'||text==='ana klaudya')child.remove();
    }
    nav.classList.add('ou-two-button-nav');
    routeForward(nav);
  };
  const scan=root=>{
    if(root?.matches?.(NAV_SELECTOR))stripIndex(root);
    root?.querySelectorAll?.(NAV_SELECTOR).forEach(stripIndex);
  };
  scan(document);
  new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)scan(node);
  }).observe(document.documentElement,{childList:true,subtree:true});

  const style=document.createElement('style');
  style.id='oras-two-button-navigation';
  style.textContent=`
    .journey-nav.ou-two-button-nav,
    .ou-solo-endnav.ou-two-button-nav,
    .ou-ceniciento-endnav.ou-two-button-nav{
      grid-template-columns:repeat(2,minmax(0,1fr))!important;
      display:grid!important;
      background:rgba(12,12,12,.14)!important;
      border:0!important;
      border-top:1px solid rgba(255,250,241,.34)!important;
      box-shadow:none!important;
      backdrop-filter:blur(3px)!important;
      -webkit-backdrop-filter:blur(3px)!important;
    }
    .journey-nav.ou-two-button-nav>* ,
    .ou-solo-endnav.ou-two-button-nav>* ,
    .ou-ceniciento-endnav.ou-two-button-nav>*{
      color:#fff!important;
      -webkit-text-fill-color:#fff!important;
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
      min-width:0!important;
    }
    .journey-nav.ou-two-button-nav>*+*,
    .ou-solo-endnav.ou-two-button-nav>*+*,
    .ou-ceniciento-endnav.ou-two-button-nav>*+*{
      border-left:1px solid rgba(255,250,241,.22)!important;
    }
  `;
  document.head.appendChild(style);
})();
'''

if 'oras-two-button-navigation' not in s:
    s+=addon
p.write_text(s,encoding='utf-8')
print('PASS: SOLO y CENICIENTO comparten botonera Atrás/Adelante; CENICIENTO -> SOLO -> Siguiendo una tarjeta')
