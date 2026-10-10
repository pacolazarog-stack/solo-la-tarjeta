(() => {
  const script=document.currentScript;
  const root=new URL('./',script.src);
  document.documentElement.classList.add('publication-pending');
  const style=document.createElement('style');
  style.textContent='.publication-pending body{visibility:hidden}.publication-pending::before{content:"Preparando la lectura…";position:fixed;inset:0;display:grid;place-items:center;background:#eef1e9;color:#201d19;z-index:2147483647;font:18px/1.5 Georgia,serif}.publication-notice button{display:block;margin:1rem auto 0;padding:.75rem 1.2rem;min-height:44px;font:inherit;cursor:pointer}.without-images .portrait-finale img,.without-images .detail-background svg,.without-images .detail-background img{display:none!important}.without-name .name-prelude{display:none!important}.publication-notice{max-width:42rem;margin:15vh auto;padding:30px;font:18px/1.6 system-ui;background:#f5f3ed;color:#201d19}';
  document.head.append(style);
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
    const showFailure=()=>{
      document.body.replaceChildren();
      const notice=document.createElement('section');notice.className='publication-notice';notice.setAttribute('role','alert');
      const message=document.createElement('p');message.textContent='No se ha podido cargar la lectura. Puedes volver a intentarlo.';
      const retry=document.createElement('button');retry.type='button';retry.textContent='Reintentar';retry.addEventListener('click',()=>location.reload());
      notice.append(message,retry);document.body.append(notice);
    };
    if(document.body)showFailure();else document.addEventListener('DOMContentLoaded',showFailure,{once:true});
  }).finally(()=>{clearTimeout(deadline);document.documentElement.classList.remove('publication-pending');});
})();
