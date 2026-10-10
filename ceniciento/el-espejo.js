(()=>{
'use strict';
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
let started=false,locked=false,lockedScene=null,finished=false,returning=false;
let lastTouchY=null;
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
scenes.forEach((text,index)=>{
  const number=index+1,scene=document.createElement('section');
  scene.className='mirror-scene';scene.tabIndex=-1;scene.setAttribute('role','group');
  scene.setAttribute('aria-roledescription','fragmento');scene.setAttribute('aria-label',`Fragmento ${number} de ${scenes.length}`);
  if(pauseAt.has(number)){scene.dataset.pause='true';scene.dataset.pauseNumber=String(number)}
  const copy=document.createElement('div');copy.className='mirror-copy'+(number===32?' mirror-coda':'');addText(copy,text);scene.append(copy);
  if(pauseAt.has(number)){
    const next=document.createElement('button');next.type='button';next.className='mirror-continue';next.textContent='seguir';next.setAttribute('aria-label',`Continuar después del fragmento ${number}`);next.hidden=true;
    next.addEventListener('click',()=>{if(!locked||lockedScene!==scene)return;releasePause();scene.focus({preventScroll:true})});scene.append(next);
  }
  if(number===32){const end=document.createElement('span');end.className='mirror-end-sentinel';end.setAttribute('aria-hidden','true');scene.append(end)}
  mirror.append(scene);sceneNodes.push(scene);
});
const pauseObserver=new IntersectionObserver(entries=>{
  if(!document.body.classList.contains('mirror')||locked)return;
  for(const entry of entries){
    if(entry.isIntersecting&&entry.intersectionRatio>=.68&&entry.target.dataset.pause==='true'){
      locked=true;lockedScene=entry.target;
      const button=entry.target.querySelector('.mirror-continue');button.hidden=false;
      mirror.scrollTop=entry.target.offsetTop;
      break;
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
  if(finished||!started||!entries.some(entry=>entry.isIntersecting))return;
  finished=true;window.dispatchEvent(new CustomEvent('oras:mirror-end'));
},{root:mirror,threshold:.5}).observe(endSentinel);
function start(){
  if(started)return;started=true;finished=false;locked=false;lockedScene=null;lastTouchY=null;
  mirror.hidden=false;document.body.classList.add('mirror');mirror.scrollTop=0;
  sceneNodes[0].focus({preventScroll:true});
}
window.addEventListener('oras:mirror-start',start);
function beginReturn(){
  if(returning)return;returning=true;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const veil=document.createElement('div');
  veil.className='mirror-exit-veil';veil.setAttribute('aria-hidden','true');
  Object.assign(veil.style,{position:'fixed',inset:'0',zIndex:'9999',background:'#000',opacity:'0',transition:reduced?'none':'opacity 1.25s ease'});
  document.body.append(veil);
  requestAnimationFrame(()=>{veil.style.opacity='1'});
  const delay=reduced?80:1350;
  window.setTimeout(()=>{
    if(window.parent!==window){
      window.parent.postMessage({channel:'ceniciento-music-v1',type:'mirror-return'},location.origin);
    }else{
      window.location.assign('/solo-la-tarjeta/elegia-breve/?v=20261010-19');
    }
  },delay);
}
window.addEventListener('oras:mirror-return',beginReturn,{once:true});
window.addEventListener('oras:mirror-reset',()=>{started=false;finished=false;returning=false;locked=false;lockedScene=null;mirror.hidden=true;document.body.classList.remove('mirror')});
})();
