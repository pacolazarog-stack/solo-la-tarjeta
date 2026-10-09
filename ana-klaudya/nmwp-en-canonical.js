(() => {
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
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
