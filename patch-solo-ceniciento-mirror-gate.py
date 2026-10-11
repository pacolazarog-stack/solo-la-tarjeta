from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# SOLO abierto desde CENICIENTO debe volver a completarse en esta pasada y
# mantener su última frase visible antes de permitir EL ESPEJO.
anchor="const page={\n"
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
  if(soloFromCeniciento&&!document.body.classList.contains('ou-solo-mirror-ready'))return;
  if(state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete)launchMirror();
}
"""
if old_mirror not in s:
    raise RuntimeError('No se encontró maybeStartMirror base')
s=s.replace(old_mirror,new_mirror,1)

start=s.index('function setupSolo(){')
end=s.index('\nfunction setupAna(){',start)
old_setup=s[start:end]
new_setup=r'''function setupSolo(){
  after(30,()=>{
    const enter=document.getElementById('enterButton');
    if(enter && !document.body.classList.contains('entered'))enter.click();
  });
  if(state.cardFound)ghost(GHOSTS.before,'before-story',{where:'left',delay:2500,hold:6500});

  if(soloFromCeniciento){
    /* Esta entrada forma parte del encadenado CENICIENTO -> SOLO -> EL ESPEJO.
       Aunque SOLO constase como leída antes, esta pasada debe completarse de nuevo. */
    if(state.soloComplete){save({soloComplete:false});state=readState();ensureChecklist();}
    document.querySelector('.ou-solo-endnav')?.remove();
    document.body.classList.remove('ou-solo-mirror-ready');
  }else if(state.cenicientoComplete&&state.cenicientoUnlocked){
    showSoloEndNav();
  }

  let armed=false;
  const finish=()=>{
    if(armed)return;
    armed=true;
    if(soloFromCeniciento)document.body.classList.add('ou-solo-mirror-ready');
    finishSolo();
  };

  if(soloFromCeniciento){
    const finalPhrase=document.getElementById('duskFinalPhrase');
    let holdTimer=0;
    const cancelHold=()=>{if(holdTimer){clearTimeout(holdTimer);holdTimer=0;}};
    const armHold=()=>{
      if(armed||holdTimer)return;
      holdTimer=after(4800,()=>{holdTimer=0;finish();});
    };
    if('IntersectionObserver' in window&&finalPhrase){
      const finalObserver=new IntersectionObserver(entries=>{
        const entry=entries.find(e=>e.target===finalPhrase);
        if(!entry||armed)return;
        /* La frase debe permanecer realmente legible, no solo rozar el viewport. */
        if(entry.isIntersecting&&entry.intersectionRatio>=.82)armHold();
        else cancelHold();
      },{threshold:[0,.82,1]});
      finalObserver.observe(finalPhrase);
    }else if(finalPhrase){
      const checkFinal=()=>{
        if(armed)return;
        const r=finalPhrase.getBoundingClientRect();
        const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
        const ratio=r.height>0?visible/r.height:0;
        if(ratio>=.82)armHold();else cancelHold();
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
