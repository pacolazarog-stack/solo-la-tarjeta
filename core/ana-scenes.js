import {lifeScene} from '../content/life-scenes.js';
import {markVisited,loadState} from './state.js';
import {isUnlocked} from './progress.js';
import {mountAudioDock,clearAudioDock} from './audio.js';

let timers=[];
let frame=0;
let runningCleanup=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const htmlText=s=>String(s??'').split('\n').map(esc).join('<br>');
const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t;};

function stageMarkup(scene){
  const style=`--scene-clear:${scene.clearMs||15000}ms`;
  if(scene.background==='image')return `<div class="oras-ana-stage" data-scene="${esc(scene.scene)}" data-bg="image" style="${style}"><img src="${esc(scene.asset)}" alt="" aria-hidden="true"><i class="oras-prologue-comet" aria-hidden="true"></i></div>`;
  if(scene.background==='heartbeat')return `<div class="oras-ana-stage" data-scene="${esc(scene.scene)}" data-bg="heartbeat"><img src="${esc(scene.asset)}" alt="" aria-hidden="true"></div>`;
  if(scene.background==='crop')return `<div class="oras-ana-stage" data-scene="${esc(scene.scene)}" data-bg="crop" style="${style}"><svg viewBox="${esc(scene.viewBox)}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${esc(scene.asset)}" width="1228" height="2048"/></svg></div>`;
  if(scene.background==='elegia')return `<div class="oras-ana-stage" data-scene="elegia" data-bg="elegia"><div class="oras-elegia-layer oras-elegia-green"></div><div class="oras-elegia-layer oras-elegia-deep"></div><div class="oras-elegia-layer oras-elegia-pulse"></div></div>`;
  if(scene.background==='cotan')return `<div class="oras-ana-stage" data-scene="epilogo" data-bg="cotan"><img src="${esc(scene.asset)}" alt="" aria-hidden="true"></div>`;
  return '<div class="oras-ana-stage"></div>';
}

function scheduleClear(host,scene){
  const stage=host.querySelector('.oras-ana-stage');
  if(!stage)return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.add('is-clear')));
  if(scene.scene==='epilogo')later(()=>stage.classList.add('is-cotan'),7200);
}

function portrait(host,navigate){
  const wrap=document.createElement('div');
  wrap.className='oras-ana-portrait';
  wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML='<img src="./elegia-breve/ana-klaudya-fotografia.jpg" alt="Ana Klaudya"><button class="oras-question" type="button" aria-label="Abrir Ceniciento desde el interrogante">?</button>';
  host.appendChild(wrap);
  wrap.querySelector('.oras-question').addEventListener('click',()=>navigate('ceniciento','interrogante'));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{wrap.classList.add('is-visible');wrap.setAttribute('aria-hidden','false');}));
}

function lineWait(line,index){
  const n=Number(line?.wait);
  if(Number.isFinite(n)&&n>0)return n;
  return index===0?3000:2600;
}

export function cleanupAnaScene(){
  timers.forEach(clearTimeout);timers=[];
  cancelAnimationFrame(frame);frame=0;
  runningCleanup.forEach(fn=>{try{fn()}catch(_){}});runningCleanup=[];
  clearAudioDock();
}

export function renderAnaScene(host,{id,item,lines,prev,nextCandidate,next,openIndex,navigate}){
  cleanupAnaScene();
  const scene=lifeScene(id);
  if(!scene)return false;
  document.body.classList.add('oras-reading','oras-ana-reading');
  host.hidden=false;
  if(scene.kind==='interlude'){
    renderInterlude(host,{id,item,scene,prev,nextCandidate,next,openIndex,navigate});
    return true;
  }
  const rendered=lines.map((line,i)=>`<p class="oras-ana-line${i===lines.length-1?' is-ending':''}" data-line="${i}">${htmlText(line.text??line)}</p>`).join('');
  host.innerHTML=`<section class="oras-ana-shell" data-scene="${esc(scene.scene)}">${stageMarkup(scene)}<header class="oras-reader-head"><span>ANA KLAUDYA</span><button data-index>Índice ORAS</button></header><main class="oras-ana-layout"><section class="oras-ana-intro"><div class="oras-ana-kicker">${esc(scene.kicker)}</div><h1>${esc(scene.title||item.title)}</h1><p class="oras-ana-subtitle">${esc(scene.subtitle||'')}</p><div class="oras-ana-controls"><button class="primary" data-paced>Pausar</button><button data-full>Poema completo</button></div><p class="oras-ana-status" data-status>Deja respirar cada verso.</p></section><article class="oras-ana-poem" aria-label="${esc(item.title)}">${rendered}<div class="oras-read-end" data-read-end></div></article></main><nav class="oras-reader-nav oras-reader-nav-dark" aria-label="Navegación de lectura"><button data-prev>Anterior</button><button data-index>Índice</button><button data-next ${next?'':'disabled'} data-target="${esc(nextCandidate||'')}">Siguiente</button></nav></section>`;
  host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
  host.querySelector('[data-prev]').addEventListener('click',()=>prev?navigate(prev):openIndex());
  host.querySelector('[data-next]').addEventListener('click',e=>{if(e.currentTarget.disabled)return;navigate(e.currentTarget.dataset.target);});
  scheduleClear(host,scene);
  mountAudioDock(host,id,{label:'ANA KLAUDYA',autoplay:true});

  const els=[...host.querySelectorAll('.oras-ana-line')];
  const paced=host.querySelector('[data-paced]'),full=host.querySelector('[data-full]'),status=host.querySelector('[data-status]'),nextButton=host.querySelector('[data-next]');
  let index=0,mode='playing',timer=null,completed=false;
  const stop=()=>{if(timer){clearTimeout(timer);timer=null;}};
  const complete=()=>{
    if(completed)return;completed=true;markVisited(id);status.textContent='Silencio.';
    if(nextCandidate){const targetItem={id:nextCandidate,section:nextCandidate.startsWith('ana-')?'ana':undefined};if(isUnlocked(targetItem,loadState())){nextButton.disabled=false;nextButton.dataset.target=nextCandidate;}}
    if(id==='ana-epilogo')later(()=>portrait(host,navigate),6000);
  };
  const reveal=()=>{
    if(mode!=='playing')return;
    if(index>=els.length){mode='done';paced.textContent='Volver a leer';complete();return;}
    els[index].classList.add('is-visible');
    const wait=lineWait(lines[index],index);index+=1;timer=setTimeout(reveal,wait);timers.push(timer);
  };
  paced.addEventListener('click',()=>{
    if(mode==='playing'){stop();mode='paused';paced.textContent='Continuar';status.textContent='Una pausa, a tu elección.';return;}
    if(mode==='paused'){mode='playing';paced.textContent='Pausar';status.textContent='Deja respirar cada verso.';reveal();return;}
    stop();index=0;completed=false;els.forEach(x=>x.classList.remove('is-visible'));mode='playing';paced.textContent='Pausar';status.textContent='Deja respirar cada verso.';reveal();
  });
  full.addEventListener('click',()=>{stop();mode='full';els.forEach(x=>x.classList.add('is-visible'));paced.textContent='Leer con pausas';status.textContent='A tu ritmo.';complete();});
  later(reveal,500);
  runningCleanup.push(stop);
  return true;
}

function interludeShots(){
  return `<svg class="oras-interlude-shot" data-shot viewBox="15 103 487 297" preserveAspectRatio="xMidYMid meet"><image href="./interludio/mundo-flores.png" width="1536" height="1024"/></svg>
  <svg class="oras-interlude-shot" data-shot viewBox="524 103 487 297" preserveAspectRatio="xMidYMid meet"><image href="./interludio/mundo-flores.png" width="1536" height="1024"/></svg>
  <svg class="oras-interlude-shot" data-shot viewBox="1034 103 487 297" preserveAspectRatio="xMidYMid meet"><image href="./interludio/mundo-flores.png" width="1536" height="1024"/></svg>
  <svg class="oras-interlude-shot" data-shot viewBox="15 541 487 322" preserveAspectRatio="xMidYMid meet"><image href="./interludio/mundo-flores.png" width="1536" height="1024"/></svg>
  <img class="oras-interlude-shot oras-interlude-yinyang" data-shot src="./interludio/mundo-flores-yin-yang.png" alt="">
  <img class="oras-interlude-shot oras-interlude-onion" data-shot src="./interludio/cebolla-pan.png" alt="">`;
}

function renderInterlude(host,{id,scene,prev,nextCandidate,next,openIndex,navigate}){
  host.innerHTML=`<section class="oras-interlude-shell"><header class="oras-reader-head oras-reader-head-dark"><span>ANA KLAUDYA · INTERLUDIO</span><button data-index>Índice ORAS</button></header><div class="oras-interlude-stage" aria-label="Iba a llevarte flores">${interludeShots()}</div><p class="oras-interlude-caption">Iba a llevarte flores.</p><div class="oras-interlude-controls"><button data-pause>Pausar</button><button data-replay>Volver a ver</button></div><nav class="oras-reader-nav oras-reader-nav-dark"><button data-prev>Anterior</button><button data-index>Índice</button><button data-next ${next?'':'disabled'} data-target="${esc(nextCandidate||'')}">Siguiente</button></nav></section>`;
  host.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',openIndex));
  host.querySelector('[data-prev]').addEventListener('click',()=>prev?navigate(prev):openIndex());
  const nextButton=host.querySelector('[data-next]');
  nextButton.addEventListener('click',e=>{if(!e.currentTarget.disabled)navigate(e.currentTarget.dataset.target);});
  mountAudioDock(host,id,{label:'ANA KLAUDYA',autoplay:true});
  const shots=[...host.querySelectorAll('[data-shot]')],pause=host.querySelector('[data-pause]'),replay=host.querySelector('[data-replay]');
  const cues=[0,2800,4600,6300,9300,13300],duration=30000;
  let elapsed=0,last=0,running=true,finished=false;
  const draw=()=>{const i=cues.reduce((a,v,k)=>elapsed>=v?k:a,0);shots.forEach((s,k)=>s.classList.toggle('is-active',k===i));};
  const complete=()=>{if(finished)return;finished=true;running=false;markVisited(id);pause.textContent='Continuar';if(nextCandidate){nextButton.disabled=false;nextButton.dataset.target=nextCandidate;}};
  const tick=now=>{if(!running)return;if(last)elapsed+=now-last;last=now;draw();if(elapsed>=duration){complete();return;}frame=requestAnimationFrame(tick);};
  const start=()=>{running=true;last=0;pause.textContent='Pausar';frame=requestAnimationFrame(tick);};
  pause.addEventListener('click',()=>{if(finished){if(nextCandidate)navigate(nextCandidate);return;}if(running){running=false;cancelAnimationFrame(frame);pause.textContent='Continuar';}else start();});
  replay.addEventListener('click',()=>{cancelAnimationFrame(frame);elapsed=0;finished=false;draw();start();});
  draw();later(start,850);
  runningCleanup.push(()=>cancelAnimationFrame(frame));
}
