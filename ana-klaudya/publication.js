(() => {
  const script=document.currentScript;
  const root=new URL('./',script.src);
  document.documentElement.classList.add('publication-pending');
  const style=document.createElement('style');
  style.textContent='.publication-pending body{visibility:hidden}.without-images .portrait-finale img,.without-images .detail-background svg,.without-images .detail-background img{display:none!important}.without-name .name-prelude{display:none!important}.publication-notice{max-width:42rem;margin:15vh auto;padding:30px;font:18px/1.6 system-ui;background:#f5f3ed;color:#201d19}';
  document.head.append(style);
  const ready=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
  Promise.all([fetch(new URL('publication-settings.json',root),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('settings');return r.json();}),ready]).then(([policy])=>{
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
    document.body.replaceChildren();const notice=document.createElement('p');notice.className='publication-notice';notice.textContent='La obra no está disponible. Vuelve a intentarlo más tarde.';document.body.append(notice);
  }).finally(()=>document.documentElement.classList.remove('publication-pending'));
})();

(() => {
  if(!/\/epilogo\/(?:index\.html)?$/.test(location.pathname))return;
  const script=document.currentScript;
  const cotanUrl=new URL('../epilogo/cotan-imperative.webp?v=20261009-empieza-visible',script.src);
  const ready=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
  ready.then(()=>{
    const imperative=document.getElementById('openingImperative');
    const phrase=imperative?.closest('.phrase');
    if(!phrase)return;
    const css=document.createElement('style');
    css.textContent=`
      #cotan-imperative-backdrop{
        position:fixed;
        inset:0;
        z-index:0;
        pointer-events:none;
        background-color:#000;
        background-image:url("${cotanUrl.href}");
        background-repeat:no-repeat;
        background-position:center bottom;
        background-size:100vw auto;
        opacity:0;
        visibility:hidden;
        transition:opacity 1800ms ease;
      }
      body.cotan-imperative-active #cotan-imperative-backdrop{
        opacity:1;
        visibility:visible;
      }
      body.cotan-imperative-active::before{opacity:.10!important;}
      body>main,
      body>nav,
      body>.flower-coda,
      body>.closing-signature{
        position:relative;
        z-index:2;
      }
      .without-images #cotan-imperative-backdrop{display:none!important;}
      @media(prefers-reduced-motion:reduce){#cotan-imperative-backdrop{transition:none;}}
      @media print{#cotan-imperative-backdrop{display:none!important;}}
    `;
    document.head.append(css);
    const backdrop=document.createElement('div');
    backdrop.id='cotan-imperative-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    document.body.append(backdrop);
    const sync=()=>{
      const visible=!phrase.classList.contains('hidden-phrase')&&phrase.getAttribute('aria-hidden')!=='true';
      document.body.classList.toggle('cotan-imperative-active',visible);
    };
    new MutationObserver(sync).observe(phrase,{attributes:true,attributeFilter:['class','aria-hidden']});
    sync();
  });
})();
