(() => {
  const setText=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text;};
  const setAttr=(el,name,value)=>{if(el&&el.getAttribute(name)!==value)el.setAttribute(name,value);};

  const localizeRoot=()=>{
    if(!location.pathname.includes('/elegia-breve/'))return;
    const byId=id=>document.getElementById(id);

    setAttr(byId('cenicientoLink'),'aria-label','Discover Ceniciento');
    setAttr(byId('journeyIndex'),'aria-label','Ana Klaudya index');
    setAttr(byId('journeyIndexClose'),'aria-label','Close index');
    setAttr(byId('anaNavigation'),'aria-label','Ana Klaudya pieces');
    setAttr(byId('journeyNav'),'aria-label',byId('journeyNav')?.getAttribute('aria-label')?.replace(/^Recorrido ·\s*/,'Journey · ')||'Work journey');
    setAttr(byId('entry'),'aria-label','Enter Ana Klaudya');
    setAttr(byId('recording'),'aria-label','Ana Klaudya recitation');

    const voiceLabel=byId('anaVoice')?.querySelector('.piece-label');
    setText(voiceLabel,'▶ Listen to the elegy');

    const musicEnabled=byId('musicEnabled');
    const musicWrap=musicEnabled?.closest('label');
    if(musicWrap){
      for(const node of musicWrap.childNodes){
        if(node.nodeType===Node.TEXT_NODE&&node.nodeValue.trim())node.nodeValue=' Accompany with music';
      }
    }

    const soundToggle=byId('soundToggle');
    if(soundToggle){
      setAttr(soundToggle,'title','Sound');
      const current=soundToggle.getAttribute('aria-label');
      if(current==='Silenciar sonido')setAttr(soundToggle,'aria-label','Mute sound');
      else if(current==='Activar sonido')setAttr(soundToggle,'aria-label','Enable sound');
    }
  };

  const run=()=>{
    const path=location.pathname;
    const h1=document.querySelector('h1#title,h1');
    if(path.includes('/ojos/')){
      document.title='In Your Eyes';
      if(h1)h1.innerHTML='In Your<br><em>Eyes.</em>';
      const lines=[...document.querySelectorAll('.poem .line')];
      const canonical=[
        'Your eyelids half-close.',
        'Under your gaze,',
        'the face I came in with',
        'falls out of order.',
        'I do not know how much of me',
        'you have already seen.',
        'And I do not lower my eyes.'
      ];
      if(lines.length===canonical.length)lines.forEach((line,i)=>line.textContent=canonical[i]);
      const poem=document.querySelector('.poem');if(poem)poem.setAttribute('aria-label','In Your Eyes');
    }else if(path.includes('/sonrisa/')){
      document.title='On Your Lips';
      if(h1)h1.innerHTML='On Your<br><em>Lips.</em>';
      const poem=document.querySelector('.poem');if(poem)poem.setAttribute('aria-label','On Your Lips');
    }else if(path.includes('/cabello/')){
      document.title='Your Hair';
      if(h1)h1.innerHTML='Your<br><em>Hair.</em>';
      const poem=document.querySelector('.poem');if(poem)poem.setAttribute('aria-label','Your Hair');
    }else if(path.includes('/piel/')){
      document.title='Your Skin';
      if(h1)h1.innerHTML='Your<br><em>Skin.</em>';
      const poem=document.querySelector('.poem');if(poem)poem.setAttribute('aria-label','Your Skin');
    }else if(path.includes('/epilogo/')){
      document.title='Over a Low Flame · Epilogue of Ana Klaudya';
      if(h1)h1.innerHTML='Over a<br><em>Low Flame.</em>';
    }else if(path.includes('/estrella/')){
      document.title='Following a Card';
    }
    localizeRoot();

    if(path.includes('/elegia-breve/')){
      const observer=new MutationObserver(()=>localizeRoot());
      observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
