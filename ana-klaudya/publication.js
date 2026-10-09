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

/* Cotán is isolated to the epilogue. The existing interlude and opening typing are untouched. */
(() => {
  if(!/\/epilogo\/(?:index\.html)?$/.test(location.pathname))return;
  const script=document.currentScript;
  const imageUrl=new URL('../epilogo/cotan-imperative.webp?v=20261009-body-final',script.src).href;
  const ready=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
  ready.then(()=>{
    const imperative=document.getElementById('openingImperative');
    const phrase=imperative?.closest('.phrase');
    if(!imperative||!phrase)return;

    const css=document.createElement('style');
    css.textContent=`
      body.cotan-body-active{
        background-color:#000!important;
        background-image:url("${imageUrl}")!important;
        background-repeat:no-repeat!important;
        background-position:center bottom!important;
        background-size:100vw auto!important;
        background-attachment:fixed!important;
      }
      body.cotan-body-active>.detail-background{opacity:0!important;visibility:hidden!important;}
      body.cotan-body-active::before{opacity:.08!important;}
      @media(max-width:760px){body.cotan-body-active{background-size:auto 46vh!important;background-position:center bottom!important;}}
      @media print{body.cotan-body-active{background-image:none!important;}}
    `;
    document.head.append(css);

    let active=false;
    const activate=()=>{
      if(active)return;
      const visible=!phrase.classList.contains('hidden-phrase')&&phrase.getAttribute('aria-hidden')!=='true';
      const started=(imperative.style.opacity&&imperative.style.opacity!=='0') || (imperative.style.clipPath&&imperative.style.clipPath!=='inset(-24px 100% -24px -20px)');
      if(visible&&started){active=true;document.body.classList.add('cotan-body-active');}
    };
    new MutationObserver(activate).observe(phrase,{attributes:true,attributeFilter:['class','aria-hidden']});
    new MutationObserver(activate).observe(imperative,{attributes:true,attributeFilter:['style','aria-hidden']});
    requestAnimationFrame(activate);
  });
})();
