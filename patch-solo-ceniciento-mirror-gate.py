from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# SOLO abierto desde CENICIENTO debe volver a completarse en esta pasada y
# detenerse obligatoriamente en su última frase hasta pulsar «Seguir».
if "const soloFromCeniciento=" not in s:
    end="};\n\nfunction emptyState()"
    if end not in s:
        raise RuntimeError('No se encontró el final del mapa de páginas')
    s=s.replace(end,"};\nconst soloFromCeniciento=page.solo&&new URLSearchParams(location.search).get('origen')==='ceniciento';\n\nfunction emptyState()",1)

old_mirror="""function maybeStartMirror(){
  state=readState();ensureChecklist();
  if(state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete)launchMirror();
}
"""
new_mirror="""function maybeStartMirror(){
  state=readState();ensureChecklist();
  /* En la cadena CENICIENTO -> SOLO -> EL ESPEJO nunca se entra automáticamente.
     Hace falta completar SOLO, pulsar Seguir y después pulsar Adelante. */
  if(soloFromCeniciento&&!document.body.classList.contains('ou-solo-mirror-enter'))return;
  if(state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete)launchMirror();
}
"""
if old_mirror not in s:
    raise RuntimeError('No se encontró maybeStartMirror base')
s=s.replace(old_mirror,new_mirror,1)

start=s.index('function setupSolo(){')
end=s.index('\nfunction setupAna(){',start)
new_setup=r'''function setupSolo(){
  after(30,()=>{
    const enter=document.getElementById('enterButton');
    if(enter && !document.body.classList.contains('entered'))enter.click();
  });
  if(state.cardFound)ghost(GHOSTS.before,'before-story',{where:'left',delay:2500,hold:6500});

  if(soloFromCeniciento){
    if(state.soloComplete){save({soloComplete:false});state=readState();ensureChecklist();}
    document.querySelector('.ou-solo-endnav')?.remove();
    document.body.classList.remove('ou-solo-mirror-ready','ou-solo-mirror-enter','ou-solo-final-locked');
  }else if(state.cenicientoComplete&&state.cenicientoUnlocked){
    showSoloEndNav();
  }

  let armed=false;
  const showMirrorDoor=()=>{
    if(document.querySelector('.ou-solo-mirror-door'))return;
    const nav=document.createElement('nav');
    nav.className='ou-solo-endnav ou-solo-mirror-door';
    nav.setAttribute('aria-label','Puerta hacia EL ESPEJO');
    const back=document.createElement('button');
    back.type='button';back.textContent='Atrás';back.onclick=()=>history.back();
    const index=document.createElement('a');
    index.href=rootPath+'elegia-breve/?indice=1&v='+VERSION;index.target='_top';index.textContent='Índice';
    const forward=document.createElement('button');
    forward.type='button';forward.textContent='Adelante';forward.setAttribute('aria-label','Entrar en EL ESPEJO');
    forward.onclick=()=>{document.body.classList.add('ou-solo-mirror-enter');maybeStartMirror();};
    nav.append(back,index,forward);
    document.body.appendChild(nav);
    requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
  };

  const finish=()=>{
    if(armed)return;
    armed=true;
    if(soloFromCeniciento){
      document.body.classList.add('ou-solo-mirror-ready');
      /* Primero mostramos la puerta y después actualizamos 3/3 sin llamar a
         completePiece(), porque esa función puede lanzar EL ESPEJO al completar
         las tres lecturas. */
      showMirrorDoor();
      save({soloComplete:true});
      state=readState();
      ensureChecklist();
      return;
    }
    finishSolo();
  };

  if(soloFromCeniciento){
    const finalPhrase=document.getElementById('duskFinalPhrase');
    if(!finalPhrase)throw new Error('No se encontró #duskFinalPhrase');

    let locked=false;
    let lockY=0;
    let follow=null;

    const style=document.createElement('style');
    style.id='ou-solo-final-pause-style';
    style.textContent=`
      body.ou-solo-final-locked{overflow:hidden!important;overscroll-behavior:none!important}
      body.ou-solo-final-locked .dusk-ending,
      body.ou-solo-final-locked .dusk-final-wrap{position:fixed!important;z-index:168!important;inset:0!important;width:100vw!important;height:100svh!important;margin:0!important;padding:0!important;display:grid!important;place-items:center!important;opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;pointer-events:none!important;background:transparent!important}
      body.ou-solo-final-locked #duskFinalPhrase{position:static!important;margin:0!important;padding:0 24px!important;width:auto!important;max-width:min(900px,90vw)!important;opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;color:#fffaf1!important;text-align:center!important;line-height:1.15!important;pointer-events:none!important}
      .ou-solo-final-follow{position:fixed;z-index:170;left:50%;top:calc(50% + 110px);transform:translateX(-50%) translateY(8px);min-width:96px;min-height:48px;padding:10px 20px;border:0;border-top:1px solid rgba(255,250,241,.48);border-radius:0;background:rgba(12,12,12,.10);color:#fffaf1;font:14px/1.2 system-ui,sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.9);opacity:0;cursor:pointer;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);transition:opacity .9s ease,transform .9s ease}
      .ou-solo-final-follow.ou-visible{opacity:1;transform:translateX(-50%) translateY(0)}
      @media(max-width:700px){.ou-solo-final-follow{top:calc(50% + 90px)}}
    `;
    document.head.appendChild(style);

    const restoreLock=()=>{
      if(!locked)return;
      if(Math.abs(scrollY-lockY)>1)scrollTo({top:lockY,left:0,behavior:'auto'});
    };
    const blockAdvance=event=>{
      if(!locked)return;
      if(event.target===follow||event.target?.closest?.('.ou-solo-final-follow'))return;
      event.preventDefault();event.stopPropagation();requestAnimationFrame(restoreLock);
    };
    const blockKeys=event=>{
      if(!locked)return;
      if(event.target===follow&&(event.key==='Enter'||event.key===' '))return;
      if(['ArrowDown','ArrowUp','PageDown','PageUp','End','Home',' ','Enter'].includes(event.key)){
        event.preventDefault();event.stopPropagation();requestAnimationFrame(restoreLock);
      }
    };

    addEventListener('wheel',blockAdvance,{passive:false,capture:true});
    addEventListener('touchmove',blockAdvance,{passive:false,capture:true});
    addEventListener('keydown',blockKeys,{capture:true});
    addEventListener('scroll',restoreLock,{passive:true});

    const release=()=>{
      if(!locked)return;
      locked=false;
      document.body.classList.remove('ou-solo-final-locked');
      follow?.remove();follow=null;finish();
    };

    const lockFinal=()=>{
      if(locked||armed)return;
      finalPhrase.classList.add('visible');
      finalPhrase.style.opacity='1';
      finalPhrase.style.visibility='visible';
      locked=true;
      lockY=scrollY;
      document.body.classList.add('ou-solo-final-locked');
      follow=document.createElement('button');
      follow.type='button';
      follow.className='ou-solo-final-follow';
      follow.textContent='Seguir';
      follow.setAttribute('aria-label','Continuar después de la última frase');
      follow.addEventListener('click',release,{once:true});
      document.body.appendChild(follow);
      requestAnimationFrame(()=>requestAnimationFrame(()=>follow?.classList.add('ou-visible')));
      requestAnimationFrame(restoreLock);
    };

    if('IntersectionObserver' in window){
      const finalObserver=new IntersectionObserver(entries=>{
        const entry=entries.find(e=>e.target===finalPhrase);
        if(!entry||armed||locked)return;
        if(entry.isIntersecting&&entry.intersectionRatio>=.55){finalObserver.disconnect();lockFinal();}
      },{threshold:[.55,.82,1]});
      finalObserver.observe(finalPhrase);
    }else{
      const checkFinal=()=>{
        if(armed||locked)return;
        const r=finalPhrase.getBoundingClientRect();
        const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
        const ratio=r.height>0?visible/r.height:0;
        if(ratio>=.55)lockFinal();
      };
      addEventListener('scroll',checkFinal,{passive:true});
      addEventListener('resize',checkFinal);
      after(500,checkFinal);
    }
    return;
  }

  const lastLine=document.querySelector('main article p.story-line:last-of-type')||document.querySelector('main article p:last-of-type');
  if('IntersectionObserver' in window && lastLine){
    const endObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){endObserver.disconnect();finish();}
    },{rootMargin:'0px 0px -12% 0px',threshold:.12});
    endObserver.observe(lastLine);
  }else{
    const checkEnd=()=>{
      const d=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
      if(scrollY+innerHeight>=d-180)finish();
    };
    addEventListener('scroll',checkEnd,{passive:true});
    after(1200,checkEnd);
  }
}
'''
s=s[:start]+new_setup+s[end:]

p.write_text(s,encoding='utf-8')
