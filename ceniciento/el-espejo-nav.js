(()=>{
'use strict';
const STORAGE='oras.universe.v2';
const mirror=document.getElementById('mirror');
if(!mirror)return;
const normalizedPath=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'');
const isCenicientoPage=normalizedPath.includes('/ceniciento');
const isSoloPage=normalizedPath==='/solo-la-tarjeta';
const readState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return {}}};
const writeState=patch=>{try{localStorage.setItem(STORAGE,JSON.stringify(Object.assign({},readState(),patch)))}catch(_){}};
const style=document.createElement('style');
style.textContent=`
.oras-mirror-nav{display:none}
.oras-ceniciento-mirror-gate,.oras-solo-mirror-gate{display:none}
.oras-ceniciento-mirror-gate.is-visible,.oras-solo-mirror-gate.is-visible{display:flex;align-items:center;justify-content:center}
.oras-ceniciento-mirror-gate button,.oras-solo-mirror-gate button{min-width:88px;min-height:48px;border:0;border-bottom:1px solid rgba(255,250,241,.42);padding:8px 20px;background:transparent;color:rgba(255,250,241,.82);font:italic 1rem Georgia,"Times New Roman",serif;cursor:pointer;text-shadow:0 1px 4px rgba(0,0,0,.82)}
.oras-ceniciento-mirror-gate button:hover,.oras-solo-mirror-gate button:hover{color:#fffaf1;border-bottom-color:rgba(255,250,241,.82)}
.oras-ceniciento-mirror-gate button:focus-visible,.oras-solo-mirror-gate button:focus-visible{outline:2px solid rgba(255,250,241,.86);outline-offset:4px}
body.voice .oras-ceniciento-mirror-gate{position:fixed;z-index:210;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%)}
body.read .oras-ceniciento-mirror-gate{position:relative;z-index:20;width:max-content;margin:1rem auto 4rem}
body.mirror .oras-ceniciento-mirror-gate,body.mirror .oras-solo-mirror-gate{display:none!important}
body.ou-solo-final-locked{overflow:hidden!important;overscroll-behavior:none!important}
body.ou-solo-final-locked header,
body.ou-solo-final-locked main,
body.ou-solo-final-locked .dusk-sequence,
body.ou-solo-final-locked .progress,
body.ou-solo-final-locked .sound-toggle,
body.ou-solo-final-locked .ou-solo-endnav,
body.ou-solo-final-locked .journey-nav{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
body.ou-solo-final-locked .dusk-ending,
body.ou-solo-final-locked .dusk-final-wrap{position:fixed!important;z-index:168!important;inset:0!important;width:100vw!important;height:100svh!important;margin:0!important;padding:0!important;display:grid!important;place-items:center!important;opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;pointer-events:none!important;background:transparent!important}
body.ou-solo-final-locked #duskFinalPhrase{position:static!important;margin:0!important;padding:0 24px!important;width:auto!important;max-width:min(900px,90vw)!important;opacity:1!important;visibility:visible!important;filter:none!important;transform:none!important;color:#fffaf1!important;text-align:center!important;line-height:1.15!important;pointer-events:none!important}
.oras-solo-mirror-gate{position:fixed;z-index:170;left:50%;top:calc(50% + 110px);transform:translateX(-50%) translateY(8px);opacity:0;visibility:hidden;transition:opacity .9s ease,transform .9s ease,visibility .9s ease}
.oras-solo-mirror-gate.is-visible{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
body.mirror .oras-mirror-nav{position:fixed;z-index:220;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(460px,calc(100vw - 48px));display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(255,250,241,.28);background:rgba(8,9,14,.10);backdrop-filter:blur(3px)}
body.mirror .oras-mirror-nav.has-explicit-gate{display:none!important}
body.mirror .oras-mirror-nav button{border:0;background:transparent;color:rgba(255,250,241,.78);min-height:48px;padding:.72rem 1rem;font:italic 1rem Georgia,"Times New Roman",serif;cursor:pointer}
body.mirror .oras-mirror-nav button+button{border-left:1px solid rgba(255,250,241,.14)}
body.mirror .oras-mirror-nav button:disabled{opacity:.22;cursor:default}
body.mirror .oras-mirror-nav button:not(:disabled):hover{color:#fffaf1;background:rgba(255,255,255,.035)}
body.mirror .oras-mirror-nav button:focus-visible{outline:1px solid rgba(255,250,241,.8);outline-offset:3px}
@media(max-width:760px){body.mirror .oras-mirror-nav{width:min(380px,calc(100vw - 32px));bottom:max(12px,env(safe-area-inset-bottom))}.oras-solo-mirror-gate{top:calc(50% + 90px)}}
`;
document.head.append(style);

let mirrorGate=null,mirrorGateUserRequested=false;
if(isCenicientoPage){
  mirrorGate=document.createElement('div');
  mirrorGate.className='oras-ceniciento-mirror-gate';
  mirrorGate.hidden=true;
  mirrorGate.setAttribute('role','navigation');
  mirrorGate.setAttribute('aria-label','Continuar hacia EL ESPEJO');
  const continueButton=document.createElement('button');
  continueButton.type='button';
  continueButton.textContent='seguir';
  continueButton.setAttribute('aria-label','Seguir hacia EL ESPEJO');
  mirrorGate.append(continueButton);
  const reader=document.getElementById('reader');
  if(reader?.parentNode)reader.insertAdjacentElement('afterend',mirrorGate);else document.body.append(mirrorGate);

  const showMirrorGate=()=>{
    if(document.body.classList.contains('mirror'))return;
    mirrorGate.hidden=false;
    requestAnimationFrame(()=>{
      mirrorGate.classList.add('is-visible');
      if(document.body.classList.contains('read'))setTimeout(()=>mirrorGate.scrollIntoView({block:'end',behavior:'smooth'}),80);
    });
  };
  const hideMirrorGate=()=>{mirrorGate.classList.remove('is-visible');mirrorGate.hidden=true;};

  addEventListener('oras:mirror-start',event=>{
    if(mirrorGateUserRequested)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showMirrorGate();
  },true);

  continueButton.addEventListener('click',()=>{
    mirrorGateUserRequested=true;
    hideMirrorGate();
    dispatchEvent(new CustomEvent('oras:mirror-start',{detail:{source:'ceniciento-seguir'}}));
  });

  addEventListener('oras:mirror-reset',()=>{
    mirrorGateUserRequested=false;
    hideMirrorGate();
  });
}

let soloGate=null,soloGateUserRequested=false;
if(isSoloPage){
  const finalPhrase=document.getElementById('duskFinalPhrase');
  if(finalPhrase){
    soloGate=document.createElement('div');
    soloGate.className='oras-solo-mirror-gate';
    soloGate.hidden=true;
    soloGate.setAttribute('role','navigation');
    soloGate.setAttribute('aria-label','Continuar hacia EL ESPEJO');
    const continueButton=document.createElement('button');
    continueButton.type='button';
    continueButton.textContent='seguir';
    continueButton.setAttribute('aria-label','Seguir hacia EL ESPEJO');
    soloGate.append(continueButton);
    document.body.append(soloGate);

    const mirrorReady=()=>{
      const state=readState();
      return state.anaComplete===true&&state.cenicientoComplete===true;
    };
    const showSoloGate=()=>{
      if(soloGateUserRequested||document.body.classList.contains('mirror')||!mirrorReady())return;
      writeState({soloComplete:true});
      finalPhrase.classList.add('visible');
      finalPhrase.style.opacity='1';
      finalPhrase.style.visibility='visible';
      document.querySelectorAll('.ou-solo-endnav,.journey-nav').forEach(node=>node.remove());
      document.body.classList.add('ou-solo-mirror-ready','ou-solo-final-locked');
      soloGate.hidden=false;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        soloGate?.classList.add('is-visible');
        continueButton.focus({preventScroll:true});
      }));
    };
    const hideSoloGate=()=>{
      soloGate?.classList.remove('is-visible');
      if(soloGate)soloGate.hidden=true;
      document.body.classList.remove('ou-solo-final-locked');
    };
    const checkSoloEnd=()=>{
      if(!mirrorReady()||soloGateUserRequested)return;
      const r=finalPhrase.getBoundingClientRect();
      const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
      const ratio=r.height>0?visible/r.height:0;
      if(ratio>=.55)showSoloGate();
    };

    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        if(entries.some(entry=>entry.target===finalPhrase&&entry.isIntersecting&&entry.intersectionRatio>=.55))showSoloGate();
      },{threshold:[.55,.82,1]});
      observer.observe(finalPhrase);
    }else{
      addEventListener('scroll',checkSoloEnd,{passive:true});
      addEventListener('resize',checkSoloEnd);
      setTimeout(checkSoloEnd,500);
    }
    addEventListener('storage',event=>{if(event.key===STORAGE)checkSoloEnd()});
    addEventListener('pageshow',()=>setTimeout(checkSoloEnd,80));

    continueButton.addEventListener('click',()=>{
      soloGateUserRequested=true;
      hideSoloGate();
      writeState({soloComplete:true});
      document.body.classList.add('ou-solo-mirror-enter','ou-mirror-explicit-enter');
      dispatchEvent(new CustomEvent('oras:mirror-start',{detail:{source:'solo-seguir'}}));
    });

    addEventListener('oras:mirror-reset',()=>{
      soloGateUserRequested=false;
      hideSoloGate();
    });
  }
}

const nav=document.createElement('nav');nav.className='oras-mirror-nav';nav.setAttribute('aria-label','Navegación de EL ESPEJO');
const back=document.createElement('button');back.type='button';back.textContent='Atrás';
const next=document.createElement('button');next.type='button';next.textContent='Adelante';
nav.append(back,next);document.body.append(nav);
const scenes=()=>[...mirror.querySelectorAll('.mirror-scene')];
const current=()=>{
  const list=scenes();if(!list.length)return 0;
  const center=mirror.scrollTop+mirror.clientHeight*.5;let best=0,dist=Infinity;
  list.forEach((el,i)=>{const d=Math.abs(el.offsetTop+el.offsetHeight*.5-center);if(d<dist){dist=d;best=i}});return best;
};
const visibleGate=scene=>{
  if(!scene)return null;
  return [...scene.querySelectorAll('.mirror-continue')].find(button=>!button.hidden)||null;
};
const sync=()=>{
  const list=scenes(),i=current(),here=list[i],gate=visibleGate(here);
  nav.classList.toggle('has-explicit-gate',!!gate);
  back.disabled=i<=0;
  next.disabled=!list.length||i>=list.length-1;
};
const releasePause=()=>mirror.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}));
const go=(dir)=>{
  const list=scenes();if(!list.length)return;let i=current();
  if(dir<0){if(i<=0)return;releasePause();i--;mirror.scrollTo({top:list[i].offsetTop,left:0,behavior:'smooth'});setTimeout(sync,460);return}
  const here=list[i];const gate=visibleGate(here);
  if(gate){gate.click();setTimeout(sync,460);return}
  if(i>=list.length-1)return;
  i++;mirror.scrollTo({top:list[i].offsetTop,left:0,behavior:'smooth'});setTimeout(sync,460);
};
back.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
mirror.addEventListener('scroll',()=>requestAnimationFrame(sync),{passive:true});
new MutationObserver(()=>requestAnimationFrame(sync)).observe(mirror,{subtree:true,attributes:true,attributeFilter:['hidden','class']});
addEventListener('oras:mirror-start',()=>requestAnimationFrame(sync));
sync();
})();
