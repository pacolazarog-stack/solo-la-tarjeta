from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

anchor="""function ensureChecklist(){
  if(window.parent!==window)return;
"""
helper="""function readingChecklistHref(piece,key){
  if(piece==='solo')return rootPath+'?origen=contador';
  if(piece==='ceniciento')return rootPath+'ceniciento/';
  if(piece!=='ana')return '';
  if(key==='elegia')return rootPath+'elegia-breve/';
  const hash={estrella:'estrella',ojos:'ojos',labios:'sonrisa',cabello:'cabello',piel:'piel',interludio:'interludio',epilogo:'epilogo'}[key];
  return hash?rootPath+'elegia-breve/#'+hash:rootPath+'elegia-breve/';
}
function wireReadingChecklist(box,current){
  const go=href=>{if(href)location.href=href;};
  const keyboard=(event,href)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();go(href);}};

  const anaRow=box.querySelector('[data-piece=\"ana\"]');
  if(anaRow){
    const href=readingChecklistHref('ana');
    anaRow.classList.add('ou-check-link');
    anaRow.tabIndex=0;anaRow.setAttribute('role','link');
    anaRow.onclick=event=>{if(event.target.closest('.ou-ana-part-link'))return;go(href);};
    anaRow.onkeydown=event=>{if(event.target.closest('.ou-ana-part-link'))return;keyboard(event,href);};
    for(const item of anaRow.querySelectorAll('.ou-ana-parts span')){
      const key=ANA_PARTS.find(([part,label])=>item.textContent.replace(/^[✓·]\s*/, '').trim()===label)?.[0];
      const partHref=readingChecklistHref('ana',key);
      if(!partHref)continue;
      item.classList.add('ou-ana-part-link');item.tabIndex=0;item.setAttribute('role','link');
      item.setAttribute('aria-label','Ir a '+item.textContent.replace(/^[✓·]\s*/,''));
      item.onclick=event=>{event.stopPropagation();go(partHref);};
      item.onkeydown=event=>{event.stopPropagation();keyboard(event,partHref);};
    }
  }

  const solo=box.querySelector('[data-piece=\"solo\"]');
  if(solo){const href=readingChecklistHref('solo');solo.classList.add('ou-check-link');solo.tabIndex=0;solo.setAttribute('role','link');solo.onclick=()=>go(href);solo.onkeydown=event=>keyboard(event,href);}

  const cen=box.querySelector('[data-piece=\"ceniciento\"]');
  if(cen){
    /* Antes de su primera lectura, CENICIENTO solo se alcanza desde el
       interrogante. Una vez completado por esa vía, pasa a ser accesible
       también desde el índice de lecturas. */
    const enabled=current.cenicientoComplete===true;
    cen.classList.toggle('ou-check-link',enabled);
    cen.classList.toggle('ou-check-locked',!enabled);
    if(enabled){
      const href=readingChecklistHref('ceniciento');
      cen.tabIndex=0;cen.setAttribute('role','link');cen.removeAttribute('aria-disabled');
      cen.setAttribute('title','Volver a leer CENICIENTO');
      cen.onclick=()=>go(href);cen.onkeydown=event=>keyboard(event,href);
    }else{
      cen.tabIndex=-1;cen.removeAttribute('role');
      cen.setAttribute('aria-disabled','true');
      cen.setAttribute('title','CENICIENTO se descubre desde el interrogante');
      cen.onclick=null;cen.onkeydown=null;
    }
  }
}

"""+anchor
if anchor not in s:
    raise RuntimeError('No se encontró ensureChecklist')
s=s.replace(anchor,helper,1)

needle="""  box.querySelector('summary').textContent=`Lecturas · ${completed}/3`;
  box.hidden=!current.journeyStartedAt;
}"""
replace="""  box.querySelector('summary').textContent=`Lecturas · ${completed}/3`;
  wireReadingChecklist(box,current);
  box.hidden=!current.journeyStartedAt;
}"""
if needle not in s:
    raise RuntimeError('No se encontró el final de ensureChecklist')
s=s.replace(needle,replace,1)

css_anchor="""  .ou-reading-checklist .ou-ana-parts span[data-done=\"true\"]{color:#fff4cf!important;font-weight:600}.ou-reading-checklist .ou-ana-parts span[data-done=\"false\"]{color:#e0e0dc!important;font-weight:500}"""
css_extra=css_anchor+"""
  .ou-reading-checklist .ou-check-link,.ou-reading-checklist .ou-ana-part-link{cursor:pointer}
  .ou-reading-checklist .ou-check-link:hover,.ou-reading-checklist .ou-check-link:focus-visible,.ou-reading-checklist .ou-ana-part-link:hover,.ou-reading-checklist .ou-ana-part-link:focus-visible{color:#fff!important;text-decoration:underline;text-underline-offset:2px;outline:none}
  .ou-reading-checklist .ou-check-locked{cursor:default;opacity:.76;text-decoration:none!important}
"""
if css_anchor not in s:
    raise RuntimeError('No se encontró CSS del listado ANA')
s=s.replace(css_anchor,css_extra,1)

p.write_text(s,encoding='utf-8')
print('PASS: barra de lecturas navegable; CENICIENTO se habilita solo después de su primera lectura completa')
