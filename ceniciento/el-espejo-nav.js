(()=>{
'use strict';
const mirror=document.getElementById('mirror');
if(!mirror)return;
const isCenicientoPage=location.pathname.replace(/\/index\.html$/,'/').includes('/ceniciento/');
const style=document.createElement('style');
style.textContent=`
.oras-mirror-nav{display:none}
.oras-ceniciento-mirror-gate{display:none}
.oras-ceniciento-mirror-gate.is-visible{display:flex;align-items:center;justify-content:center}
.oras-ceniciento-mirror-gate button{min-width:88px;min-height:48px;border:0;border-bottom:1px solid rgba(255,250,241,.42);padding:8px 20px;background:transparent;color:rgba(255,250,241,.82);font:italic 1rem Georgia,"Times New Roman",serif;cursor:pointer;text-shadow:0 1px 4px rgba(0,0,0,.82)}
.oras-ceniciento-mirror-gate button:hover{color:#fffaf1;border-bottom-color:rgba(255,250,241,.82)}
.oras-ceniciento-mirror-gate button:focus-visible{outline:2px solid rgba(255,250,241,.86);outline-offset:4px}
body.voice .oras-ceniciento-mirror-gate{position:fixed;z-index:210;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%)}
body.read .oras-ceniciento-mirror-gate{position:relative;z-index:20;width:max-content;margin:1rem auto 4rem}
body.mirror .oras-ceniciento-mirror-gate{display:none!important}
body.mirror .mirror-continue{display:none!important}
body.mirror .oras-mirror-nav{position:fixed;z-index:220;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(460px,calc(100vw - 48px));display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(255,250,241,.28);background:rgba(8,9,14,.10);backdrop-filter:blur(3px)}
body.mirror .oras-mirror-nav button{border:0;background:transparent;color:rgba(255,250,241,.78);min-height:48px;padding:.72rem 1rem;font:italic 1rem Georgia,"Times New Roman",serif;cursor:pointer}
body.mirror .oras-mirror-nav button+button{border-left:1px solid rgba(255,250,241,.14)}
body.mirror .oras-mirror-nav button:disabled{opacity:.22;cursor:default}
body.mirror .oras-mirror-nav button:not(:disabled):hover{color:#fffaf1;background:rgba(255,255,255,.035)}
body.mirror .oras-mirror-nav button:focus-visible{outline:1px solid rgba(255,250,241,.8);outline-offset:3px}
@media(max-width:760px){body.mirror .oras-mirror-nav{width:min(380px,calc(100vw - 32px));bottom:max(12px,env(safe-area-inset-bottom))}}
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

  /*
    CENICIENTO ya no abre EL ESPEJO automáticamente. El intento de apertura
    que produce la finalización queda detenido aquí y se transforma en una
    puerta explícita: «seguir». Sólo ese gesto del lector deja pasar el
    evento que inicia EL ESPEJO.
  */
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
const sync=()=>{const i=current(),list=scenes();back.disabled=i<=0;next.disabled=!list.length};
const releasePause=()=>mirror.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}));
const go=(dir)=>{
  const list=scenes();if(!list.length)return;let i=current();
  if(dir<0){if(i<=0)return;releasePause();i--;mirror.scrollTo({top:list[i].offsetTop,left:0,behavior:'smooth'});setTimeout(sync,460);return}
  const here=list[i];const old=here.querySelector('.mirror-continue');
  if(old&&!old.hidden){old.click();setTimeout(sync,460);return}
  if(i>=list.length-1){const final=here.querySelector('.mirror-final-continue');if(final){final.hidden=false;final.click()}return}
  i++;mirror.scrollTo({top:list[i].offsetTop,left:0,behavior:'smooth'});setTimeout(sync,460);
};
back.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
mirror.addEventListener('scroll',()=>requestAnimationFrame(sync),{passive:true});
addEventListener('oras:mirror-start',()=>requestAnimationFrame(sync));
sync();
})();
