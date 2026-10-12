(()=>{
'use strict';
const ROOT='/solo-la-tarjeta/';
const STORAGE='oras.universe.v2';
const VERSION='20261012-mirror-mechanical-2';
const INVENTORY_URL=ROOT+'inventario-del-aire/?from=mirror&v='+VERSION;
const scenes=[
`No era la misma historia.`,
`Parecían tres.`,
`Una empezaba con una tarjeta.`,
`Otra con un nombre.`,
`Otra con un reloj.`,
`Parecían distintas.\nLo eran.\nY no lo eran.`,
`Las misiones sencillas eran las que más miedo daban.`,
`Los ojos no cabían en una descripción.`,
`El tiempo había rectificado.`,
`Paco creyó durante mucho tiempo que las historias importantes empiezan cuando sucede algo extraordinario.\nNo era verdad.`,
`Una historia empezó porque una máquina no aceptó una tarjeta.`,
`Otra, porque una presencia no cabía dentro de las palabras.`,
`Otra, porque un hombre descubrió demasiado tarde quién lo había estado mirando.`,
`La tarjeta ya no hacía falta.`,
`La cita, en cambio, sí.`,
`Los ojos de estatua.`,
`Había estado viendo a Paco.`,
`El joven estaba desapareciendo.`,
`Hay cosas que sólo existen mientras duran.`,
`Un viaje.\nUna conversación.\nUna tarde.\nUna fotografía enviada desde París.\nUna voz.\nUna edad.`,
`Hay otras que permanecen.`,
`No porque duren más.\nSino porque cambian de lugar.`,
`La tarjeta dejó de servir.\nLa mirada no.`,
`El hechizo se extinguía.`,
`La noche no admitía trucos.`,
`Me pides el pan.`,
`La mesa.\nLa cebolla.\nLas migas.\nLas manos.`,
`Nada de aquello parecía extraordinario.\nY, sin embargo, allí terminaban las tres historias.`,
`No en la juventud.\nNo en el deseo.\nNo en la casualidad.\nNo en el prodigio.`,
`En una presencia.`,
`A veces, una persona entra en la vida de otra porque una máquina se niega a aceptar una tarjeta.\nA veces, una mirada tarda años en comprender lo que está viendo.\nA veces, un hombre recorre una ciudad entera para descubrir algo que siempre estuvo delante de él.`,
`El origen suele parecer insignificante.\n\nHabía pasado sesenta y dos años asistiendo a transformaciones que nadie le había consultado.\n\nElla nunca había visto al joven.\n\nLa cita, en cambio, sí.\n\nAl hombre que era.\n\nHay historias que empiezan antes.\nTodo esto ocurrió después.\n\nY, aun así, no era el final.\n\nPorque nadie regresa al mismo lugar.\nNi siquiera cuando vuelve.`
];
const pauseAt=new Set([14,15,17,26,30]);
const mirror=document.getElementById('mirror');
if(!mirror)return;
let started=false,locked=false,lockedScene=null,finished=false,finalReady=false;
let lastTouchY=null,finalContinue=null,silenceTimer=0;
const sceneNodes=[];

function addText(parent,text){
  text.split(/\n\n+/).forEach(block=>{
    const p=document.createElement('p');
    block.split('\n').forEach((line,index)=>{if(index)p.append(document.createElement('br'));p.append(document.createTextNode(line))});
    parent.append(p);
  });
}
function releasePause(){
  if(!locked)return;
  const button=lockedScene?.querySelector('.mirror-continue');
  if(button)button.hidden=true;
  locked=false;lockedScene=null;
}
function resetReadingCycleForInventory(){
  try{
    const raw=localStorage.getItem(STORAGE);
    const saved=raw?JSON.parse(raw):{};
    const next=Object.assign({},saved,{
      anaComplete:false,
      anaParts:{estrella:false,elegia:false,ojos:false,labios:false,cabello:false,piel:false,interludio:false,epilogo:false},
      soloComplete:false,
      cenicientoComplete:false,
      mirrorReadComplete:false,
      returnedFromCeniciento:true
    });
    localStorage.setItem(STORAGE,JSON.stringify(next));
  }catch(_){}
}
function enterInventory(){
  try{window.top.location.href=INVENTORY_URL}catch(_){location.href=INVENTORY_URL}
}

/* EL ESPEJO NO TIENE CAMA SONORA. Se silencian de forma continua todas las
   pistas HTML heredadas. El único sonido permitido aquí es el clac mecánico
   idéntico de los botones «seguir». */
function silenceMirror(){
  try{window.dispatchEvent(new CustomEvent('oras:mirror-silence'))}catch(_){}
  const docs=[document];
  try{if(window.top.document!==document)docs.push(window.top.document)}catch(_){}
  docs.forEach(doc=>{
    doc.querySelectorAll('audio').forEach(audio=>{
      try{
        audio.autoplay=false;
        audio.removeAttribute('autoplay');
        audio.volume=0;
        audio.muted=true;
        audio.pause();
      }catch(_){}
    });
  });
}
function maintainSilence(){
  silenceMirror();
  clearInterval(silenceTimer);
  silenceTimer=setInterval(silenceMirror,90);
}

let mechCtx=null,mechNoise=null;
function prepareMechanicalAudio(){
  if(mechCtx)return true;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return false;
  mechCtx=new AC();
  const length=Math.max(1,Math.floor(mechCtx.sampleRate*.028));
  mechNoise=mechCtx.createBuffer(1,length,mechCtx.sampleRate);
  const data=mechNoise.getChannelData(0);
  let seed=1977;
  for(let i=0;i<length;i++){
    seed=(seed*16807)%2147483647;
    data[i]=(seed/2147483647)*2-1;
  }
  return true;
}
function fireMechanicalClack(){
  if(!mechCtx||mechCtx.state!=='running')return;
  const t=mechCtx.currentTime+.002;

  const snap=mechCtx.createOscillator();
  const snapGain=mechCtx.createGain();
  snap.type='square';
  snap.frequency.setValueAtTime(690,t);
  snap.frequency.exponentialRampToValueAtTime(185,t+.052);
  snapGain.gain.setValueAtTime(.0001,t);
  snapGain.gain.exponentialRampToValueAtTime(.038,t+.003);
  snapGain.gain.exponentialRampToValueAtTime(.0001,t+.058);
  snap.connect(snapGain).connect(mechCtx.destination);
  snap.start(t);snap.stop(t+.062);

  const body=mechCtx.createOscillator();
  const bodyGain=mechCtx.createGain();
  body.type='triangle';
  body.frequency.setValueAtTime(118,t);
  body.frequency.exponentialRampToValueAtTime(82,t+.07);
  bodyGain.gain.setValueAtTime(.022,t);
  bodyGain.gain.exponentialRampToValueAtTime(.0001,t+.075);
  body.connect(bodyGain).connect(mechCtx.destination);
  body.start(t);body.stop(t+.08);

  if(mechNoise){
    const noise=mechCtx.createBufferSource();
    const filter=mechCtx.createBiquadFilter();
    const noiseGain=mechCtx.createGain();
    noise.buffer=mechNoise;
    filter.type='bandpass';filter.frequency.value=2350;filter.Q.value=.9;
    noiseGain.gain.setValueAtTime(.043,t);
    noiseGain.gain.exponentialRampToValueAtTime(.0001,t+.029);
    noise.connect(filter).connect(noiseGain).connect(mechCtx.destination);
    noise.start(t);noise.stop(t+.03);
  }
}
function playMechanicalStep(){
  silenceMirror();
  if(!prepareMechanicalAudio())return;
  if(mechCtx.state==='suspended'){
    mechCtx.resume().then(fireMechanicalClack).catch(()=>{});
  }else fireMechanicalClack();
}

function finishMirror(){
  if(finished||!finalReady)return;
  finished=true;
  resetReadingCycleForInventory();
  if(finalContinue){finalContinue.disabled=true;finalContinue.textContent='…'}
  mirror.style.transition='opacity 1.15s ease';
  mirror.style.opacity='0';
  setTimeout(enterInventory,1200);
}

scenes.forEach((text,index)=>{
  const number=index+1,scene=document.createElement('section');
  scene.className='mirror-scene';scene.tabIndex=-1;scene.setAttribute('role','group');
  scene.setAttribute('aria-roledescription','fragmento');scene.setAttribute('aria-label',`Fragmento ${number} de ${scenes.length}`);
  if(pauseAt.has(number)){scene.dataset.pause='true';scene.dataset.pauseNumber=String(number)}
  const copy=document.createElement('div');copy.className='mirror-copy'+(number===32?' mirror-coda':'');addText(copy,text);scene.append(copy);
  if(pauseAt.has(number)){
    const next=document.createElement('button');next.type='button';next.className='mirror-continue';next.textContent='seguir';next.setAttribute('aria-label',`Continuar después del fragmento ${number}`);next.hidden=true;
    next.addEventListener('click',()=>{
      if(!locked||lockedScene!==scene)return;
      playMechanicalStep();
      releasePause();
      const following=sceneNodes[index+1];
      if(following){mirror.scrollTo({top:following.offsetTop,left:0,behavior:'smooth'});setTimeout(()=>following.focus({preventScroll:true}),420)}
    });scene.append(next);
  }
  if(number===32){
    const mark=document.createElement('p');mark.className='mirror-end-mark';mark.textContent='flag';copy.append(mark);
    const end=document.createElement('span');end.className='mirror-end-sentinel';end.setAttribute('aria-hidden','true');scene.append(end);
    finalContinue=document.createElement('button');finalContinue.type='button';finalContinue.className='mirror-continue mirror-final-continue';finalContinue.textContent='seguir';finalContinue.setAttribute('aria-label','Seguir hacia EL INVENTARIO DEL AIRE');finalContinue.hidden=true;
    finalContinue.addEventListener('click',()=>{playMechanicalStep();finishMirror()});
    scene.append(finalContinue);
  }
  mirror.append(scene);sceneNodes.push(scene);
});

const pauseObserver=new IntersectionObserver(entries=>{
  if(!document.body.classList.contains('mirror')||locked)return;
  for(const entry of entries){
    if(entry.isIntersecting&&entry.intersectionRatio>=.68&&entry.target.dataset.pause==='true'){
      locked=true;lockedScene=entry.target;
      const button=entry.target.querySelector('.mirror-continue');button.hidden=false;
      mirror.scrollTop=entry.target.offsetTop;break;
    }
  }
},{root:mirror,threshold:[.68,.9]});
sceneNodes.filter(scene=>scene.dataset.pause==='true').forEach(scene=>pauseObserver.observe(scene));

mirror.addEventListener('wheel',event=>{
  if(!locked)return;
  if(event.deltaY<0){releasePause();return}
  event.preventDefault();event.stopPropagation();
},{passive:false});
mirror.addEventListener('touchstart',event=>{lastTouchY=event.touches[0]?.clientY??null},{passive:true});
mirror.addEventListener('touchmove',event=>{
  if(!locked){lastTouchY=event.touches[0]?.clientY??null;return}
  const y=event.touches[0]?.clientY??lastTouchY;
  if(lastTouchY!==null&&y>lastTouchY){releasePause();lastTouchY=y;return}
  event.preventDefault();event.stopPropagation();lastTouchY=y;
},{passive:false});
mirror.addEventListener('keydown',event=>{
  if(!locked)return;
  if(['ArrowUp','PageUp','Home'].includes(event.key)){releasePause();return}
  if(['ArrowDown','PageDown',' ','End'].includes(event.key)){event.preventDefault();event.stopPropagation()}
});

const endSentinel=mirror.querySelector('.mirror-end-sentinel');
new IntersectionObserver(entries=>{
  if(!started||finished||!entries.some(entry=>entry.isIntersecting))return;
  finalReady=true;
  const finalScene=sceneNodes[sceneNodes.length-1];
  finalScene.classList.add('mirror-finished');
  if(finalContinue)finalContinue.hidden=false;
},{root:mirror,threshold:.5}).observe(endSentinel);

function start(){
  if(started)return;
  started=true;finished=false;finalReady=false;locked=false;lockedScene=null;lastTouchY=null;
  if(finalContinue){finalContinue.hidden=true;finalContinue.disabled=false;finalContinue.textContent='seguir'}
  mirror.style.transition='';mirror.style.opacity='';mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;
  maintainSilence();
  sceneNodes[0].focus({preventScroll:true});
}
window.addEventListener('oras:mirror-start',start);
window.addEventListener('oras:mirror-reset',()=>{
  clearInterval(silenceTimer);
  started=false;finished=false;finalReady=false;locked=false;lockedScene=null;
  mirror.style.transition='';mirror.style.opacity='';mirror.hidden=true;document.body.classList.remove('mirror');
});
})();
