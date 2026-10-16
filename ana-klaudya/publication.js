(() => {
  const script=document.currentScript;
  const root=new URL('./',script.src);

  /*
   * La política de publicación se comprueba en segundo plano.
   * Nunca ocultamos el body mientras esperamos: dentro de iframes esa
   * compuerta podía dejar SIGUIENDO UNA TARJETA permanentemente en negro.
   */
  document.documentElement.classList.remove('publication-pending');
  const style=document.createElement('style');
  style.textContent='.publication-notice button{display:block;margin:1rem auto 0;padding:.75rem 1.2rem;min-height:44px;font:inherit;cursor:pointer}.without-images .portrait-finale img,.without-images .detail-background svg,.without-images .detail-background img{display:none!important}.without-name .name-prelude{display:none!important}.publication-notice{max-width:42rem;margin:15vh auto;padding:30px;font:18px/1.6 system-ui;background:#f5f3ed;color:#201d19}body:has(.heat-final.is-shown) .pulse-field,body:has(.heat-final.is-shown) .pulse-field::before,body:has(.heat-final.is-shown) .pulse-field::after,body:has(.heat-final.is-shown) .layer-warm{animation:none!important;will-change:auto!important}body:has(.heat-final.is-shown) .layer-warm{filter:none!important}';
  document.head.append(style);

  const releaseGate=()=>document.documentElement.classList.remove('publication-pending');
  releaseGate();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',releaseGate,{once:true});

  const controller=new AbortController();
  let deadline;
  const timeout=new Promise((_,reject)=>{
    deadline=setTimeout(()=>{controller.abort();reject(new Error('publication-timeout'));},8000);
  });
  const ready=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
  const settings=fetch(new URL('publication-settings.json',root),{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw Error('settings');return r.json();});
  Promise.race([Promise.all([settings,ready]),timeout]).then(([policy])=>{
    if(!policy||typeof policy.web!=='boolean'||typeof policy.images!=='boolean'||typeof policy.publicName!=='boolean')throw Error('invalid-settings');
    window.anaPublication=policy;
    if(document.body.dataset.publication==='web'&&!policy.web){
      for(const a of document.querySelectorAll('audio'))a.pause();
      document.body.replaceChildren();const notice=document.createElement('p');notice.className='publication-notice';notice.textContent='La obra no está disponible públicamente en este momento.';document.body.append(notice);document.title='Obra no disponible';return;
    }
    document.documentElement.classList.toggle('without-images',!policy.images);
    document.documentElement.classList.toggle('without-name',!policy.publicName);
    if(!policy.publicName){
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      let node;while(node=walker.nextNode()){if(!['SCRIPT','STYLE'].includes(node.parentElement.tagName))node.textContent=node.textContent.replace(/Ana\s+Klaudya/gi,'Una presencia');}
      document.title=document.title.replace(/Ana\s+Klaudya/gi,'Una presencia');
      for(const el of document.querySelectorAll('[aria-label],[alt]'))for(const attr of ['aria-label','alt'])if(el.hasAttribute(attr))el.setAttribute(attr,el.getAttribute(attr).replace(/Ana\s+Klaudya/gi,'Una presencia'));
      for(const id of ['voiceLaunch','anaVoice','voicePlay']){const button=document.getElementById(id);if(button){button.hidden=true;button.disabled=true;}}
      for(const a of document.querySelectorAll('audio:not(#voiceMusic)')){a.pause();a.removeAttribute('src');}
    }
    for(const el of document.querySelectorAll('[data-requires]')){const allowed=!!policy[el.dataset.requires];el.hidden=!allowed;}
    for(const el of document.querySelectorAll('[data-status]'))el.textContent=policy[el.dataset.status]?'Habilitado para el uso indicado.':'Pendiente de autorización expresa.';
    if(policy.contact)for(const el of document.querySelectorAll('[data-contact]'))el.textContent=policy.contact;
    for(const [key,label] of [['videoUrl','Ver la versión audiovisual'],['subtitlesUrl','Subtítulos definitivos']]){
      if(!policy[key])continue;
      let url;try{url=new URL(policy[key],location.href);}catch{continue;}
      if(url.protocol!=='https:')continue;
      for(const box of document.querySelectorAll('[data-resource="'+key+'"]')){
        if(!policy.jury)continue;
        const link=document.createElement('a');link.href=url.href;link.textContent=label;box.replaceChildren(link);
      }
    }
  }).catch(()=>{
    /* Si falla la política, no se bloquea la obra: se mantiene la lectura pública actual. */
    releaseGate();
  }).finally(()=>{clearTimeout(deadline);releaseGate();});
})();