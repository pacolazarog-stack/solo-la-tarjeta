from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

addon=r'''

;(()=>{
  const NAV_SELECTOR='.journey-nav,.ou-solo-endnav,.ou-ceniciento-endnav';
  const normalize=text=>(text||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const stripIndex=nav=>{
    if(!nav||!nav.matches?.(NAV_SELECTOR))return;
    for(const child of [...nav.children]){
      if(normalize(child.textContent)==='indice')child.remove();
    }
    nav.classList.add('ou-two-button-nav');
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
print('PASS: navegación ordinaria reducida a Atrás y Adelante; la barra de lecturas sustituye al Índice')
