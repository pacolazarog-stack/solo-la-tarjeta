(()=>{
'use strict';

const params=new URLSearchParams(location.search);
if(params.get('from')==='mirror')document.body.classList.add('from-mirror');
requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('ready')));

const source='../EL_INVENTARIO_DEL_AIRE_TRILOGIA_CANONICA.md?v=20261012-r4-av1';
const loading=document.getElementById('loading');
const book=document.getElementById('book');
const returnZone=document.getElementById('returnZone');
const soundToggle=document.getElementById('ambientToggle');
const dustField=document.getElementById('dustField');

const esc=s=>s.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const plain=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));

function normalize(raw){
  return raw
    .replace(/^\uFEFF/,'')
    .replace(/\r/g,'')
    .replace(/\s+VOLUMEN IIEL OFICIO DE LAS SOMBRAS/g,'\n\n# VOLUMEN II\n\n# EL OFICIO DE LAS SOMBRAS\n\n')
    .replace(/\s+VOLUMEN IIILA CIUDAD QUE APRENDIÓ A OLVIDAR/g,'\n\n# VOLUMEN III\n\n# LA CIUDAD QUE APRENDIÓ A OLVIDAR\n\n')
    .replace(/\s+EpílogoLa habitación número cero/g,'\n\n# EPÍLOGO\n\n# La habitación número cero\n\n')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function prose(block){
  return block
    .replace(/\n+/g,' ')
    .replace(/\s{2,}/g,' ')
    .replace(/([.!?])(?=[A-ZÁÉÍÓÚÜÑ¿¡—])/g,'$1 ')
    .replace(/([:;])(?=[A-ZÁÉÍÓÚÜÑ¿¡—])/g,'$1 ')
    .trim();
}

function chapterKey(title,world){
  const t=plain(title);
  if(world==='house'){
    if(t.includes('recibidor'))return 'entry';
    if(t.includes('reloj'))return 'clock';
    if(t.includes('cocina'))return 'kitchen';
    if(t.includes('pasillo'))return 'corridor';
    if(t.includes('dormitorio'))return 'bedroom';
    if(t.includes('jardin'))return 'garden';
    if(t.includes('inventario'))return 'inventory';
    if(t.includes('salida'))return 'exit';
  }
  if(world==='train'){
    if(t.includes('estacion'))return 'station';
    if(t.includes('revisor'))return 'inspector';
    if(t.includes('sombras'))return 'shadows';
    if(t.includes('fila siete'))return 'row-seven';
    if(t.includes('conversacion'))return 'conversation';
    if(t.includes('ausencias moviles'))return 'mobile-inventory';
    if(t.includes('taller'))return 'workshop';
    if(t.includes('oficio'))return 'office';
    if(t.includes('ultimo recorrido'))return 'last-journey';
  }
  if(world==='city'){
    if(t.includes('plaza'))return 'plaza';
    if(t.includes('archivero'))return 'archivist';
    if(t.includes('fuente'))return 'fountain';
    if(t.includes('resistentes'))return 'resisters';
    if(t.includes('mapa'))return 'map';
    if(t.includes('teoria'))return 'theory';
    if(t.includes('museo'))return 'museum';
    if(t.includes('visitante'))return 'visitor';
    if(t.includes('invierno'))return 'winter';
    if(t.includes('ultima sala'))return 'last-room';
  }
  return world;
}

function compose(raw){
  const blocks=normalize(raw).split(/\n\n+/).map(s=>s.trim()).filter(Boolean);
  const html=[];
  let world='house';

  for(const block of blocks){
    if(block==='# EL INVENTARIO DEL AIRE'||block==='EL INVENTARIO DEL AIRE'){
      world='house';
      html.push('<h1 data-world-marker="house">EL INVENTARIO DEL AIRE</h1>');
      continue;
    }
    if(block==='# VOLUMEN II'||block==='VOLUMEN II'||block==='# VOLUMEN III'||block==='VOLUMEN III'){
      html.push('<div class="volume-label">'+esc(block.replace(/^#\s*/,''))+'</div>');
      continue;
    }
    if(block==='# EPÍLOGO'||block==='EPÍLOGO'){
      html.push('<div class="volume-label epilogue">EPÍLOGO</div>');
      continue;
    }
    if(block==='# EL OFICIO DE LAS SOMBRAS'||block==='EL OFICIO DE LAS SOMBRAS'){
      world='train';
      html.push('<h2 data-world-marker="train">EL OFICIO DE LAS SOMBRAS</h2>');
      continue;
    }
    if(block==='# LA CIUDAD QUE APRENDIÓ A OLVIDAR'||block==='LA CIUDAD QUE APRENDIÓ A OLVIDAR'){
      world='city';
      html.push('<h2 data-world-marker="city">LA CIUDAD QUE APRENDIÓ A OLVIDAR</h2>');
      continue;
    }
    if(block==='# La habitación número cero'||block==='La habitación número cero'){
      world='zero';
      html.push('<h2 data-world-marker="zero">La habitación número cero</h2>');
      continue;
    }
    if(/^##\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s/.test(block)||/^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s/.test(block)){
      const title=block.replace(/^##\s+/,'');
      html.push('<h3 data-chapter="'+chapterKey(title,world)+'" data-chapter-world="'+world+'">'+esc(title)+'</h3>');
      continue;
    }

    const text=prose(block);
    const classes=[];
    if(text.includes('la encargada encontró un botón en el suelo de la habitación'))classes.push('pearl-arrival');
    if(text.includes('«Una mujer encontró un botón de nácar»'))classes.push('story-card');
    if(text.includes('el botón ya no estaba'))classes.push('pearl-departure');
    html.push('<p'+(classes.length?' class="'+classes.join(' ')+'"':'')+'>'+esc(text)+'</p>');
  }

  book.innerHTML=html.join('\n');
  loading.remove();
  book.classList.add('ready');
  buildDust();
  setupDirection();
  setupFinalObjects();
  setupReturn();
}

function buildDust(){
  if(!dustField)return;
  const count=44;
  for(let i=0;i<count;i++){
    const d=document.createElement('i');
    d.className='dust';
    d.style.left=(5+Math.random()*90).toFixed(2)+'%';
    d.style.top=(12+Math.random()*82).toFixed(2)+'%';
    d.style.setProperty('--dur',(15+Math.random()*22).toFixed(2)+'s');
    d.style.setProperty('--delay',(-Math.random()*24).toFixed(2)+'s');
    d.style.setProperty('--drift',(-35+Math.random()*70).toFixed(1)+'px');
    dustField.appendChild(d);
  }
}

let worldMarkers=[];
let chapterMarkers=[];
let currentWorld='house';
let currentProgress=0;
let framePending=false;

function setupDirection(){
  worldMarkers=[...book.querySelectorAll('[data-world-marker]')];
  chapterMarkers=[...book.querySelectorAll('[data-chapter]')];
  syncDirection();
  addEventListener('scroll',scheduleDirection,{passive:true});
  addEventListener('resize',scheduleDirection,{passive:true});
}

function scheduleDirection(){
  if(framePending)return;
  framePending=true;
  requestAnimationFrame(()=>{framePending=false;syncDirection()});
}

function activeBefore(nodes,y){
  let active=nodes[0]||null;
  for(const node of nodes){
    if(node.offsetTop<=y)active=node;
    else break;
  }
  return active;
}

function syncDirection(){
  if(!worldMarkers.length)return;
  const y=scrollY+innerHeight*.48;
  const marker=activeBefore(worldMarkers,y)||worldMarkers[0];
  const world=marker.dataset.worldMarker||'house';
  const wi=worldMarkers.indexOf(marker);
  const next=worldMarkers[wi+1];
  const end=next?next.offsetTop:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  const progress=clamp((y-marker.offsetTop)/Math.max(1,end-marker.offsetTop));

  let chapter=world;
  const candidates=chapterMarkers.filter(n=>n.dataset.chapterWorld===world&&n.offsetTop<=y);
  if(candidates.length)chapter=candidates[candidates.length-1].dataset.chapter;

  currentWorld=world;
  currentProgress=progress;
  document.body.dataset.world=world;
  document.body.dataset.chapter=chapter;
  document.documentElement.style.setProperty('--world-progress',progress.toFixed(4));

  const erosion=world==='city'?clamp((progress-.44)/.56):0;
  const zero=world==='zero'?clamp(progress):0;
  document.documentElement.style.setProperty('--erosion',erosion.toFixed(4));
  document.documentElement.style.setProperty('--zero-progress',zero.toFixed(4));
  document.body.classList.toggle('final-withdrawal',world==='zero'&&progress>.78);

  updateAudio(world,progress);
  syncPearl(y);
}

function setupFinalObjects(){
  const card=book.querySelector('.story-card');
  if(card){
    const observer=new IntersectionObserver(entries=>{
      for(const e of entries)e.target.classList.toggle('is-near',e.isIntersecting);
    },{threshold:.42});
    observer.observe(card);
  }
}

function syncPearl(y=scrollY+innerHeight*.48){
  const arrival=book.querySelector('.pearl-arrival');
  const departure=book.querySelector('.pearl-departure');
  if(!arrival)return;
  const arrived=y>=arrival.offsetTop;
  const gone=departure&&y>=departure.offsetTop;
  document.body.classList.toggle('pearl-visible',arrived&&!gone);
  document.body.classList.toggle('pearl-gone',!!gone);
}

function setupReturn(){
  const watcher=new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)){
      returnZone.classList.add('visible');
      watcher.disconnect();
    }
  },{threshold:.2});
  watcher.observe(returnZone);
}

/* AUDIO PROCEDURAL: aire → hierro → ciudad erosionada → resto */
let ctx=null;
let master=null;
let noiseGain=null;
let noiseFilter=null;
let hum=null;
let humGain=null;
let airOn=false;

function initAudio(){
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return false;
  ctx=new AC();
  master=ctx.createGain();
  noiseGain=ctx.createGain();
  noiseFilter=ctx.createBiquadFilter();
  humGain=ctx.createGain();
  hum=ctx.createOscillator();

  const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.7;
  const noise=ctx.createBufferSource();
  noise.buffer=buffer;
  noise.loop=true;
  noiseFilter.type='lowpass';
  noiseFilter.frequency.value=520;
  noiseGain.gain.value=0;
  hum.type='sine';
  hum.frequency.value=48;
  humGain.gain.value=0;
  master.gain.value=0;

  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  hum.connect(humGain).connect(master);
  master.connect(ctx.destination);
  noise.start();
  hum.start();
  return true;
}

function ramp(param,value,time=.9){
  if(!ctx||!param)return;
  const now=ctx.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value,now);
  param.linearRampToValueAtTime(value,now+time);
}

function updateAudio(world,progress){
  if(!ctx)return;
  let noise=.012,filter=500,humLevel=.001,humHz=46,masterLevel=airOn?.7:0;

  if(world==='house'){
    noise=.014;
    filter=420;
    humLevel=.0008;
    humHz=43;
  }else if(world==='train'){
    noise=.027;
    filter=270;
    humLevel=.009;
    humHz=52;
  }else if(world==='city'){
    const sonicLoss=1-clamp((progress-.04)/.51);
    noise=.019*sonicLoss+.0015;
    filter=760-(sonicLoss?0:280);
    humLevel=.0035*sonicLoss;
    humHz=67;
  }else if(world==='zero'){
    const residue=1-clamp(progress/.64);
    noise=.0045*residue;
    filter=310;
    humLevel=.00045*residue;
    humHz=39;
    masterLevel=(airOn?.7:0)*residue;
  }

  ramp(noiseGain.gain,noise,1.4);
  ramp(noiseFilter.frequency,filter,1.5);
  ramp(hum.frequency,humHz,1.5);
  ramp(humGain.gain,humLevel,1.4);
  ramp(master.gain,masterLevel,airOn?.9:.35);
}

if(soundToggle){
  soundToggle.addEventListener('click',async()=>{
    if(!ctx&&!initAudio()){
      soundToggle.hidden=true;
      return;
    }
    if(ctx.state==='suspended')await ctx.resume();
    airOn=!airOn;
    soundToggle.setAttribute('aria-pressed',airOn?'true':'false');
    soundToggle.textContent=airOn?'Silencio':'Sonido';
    updateAudio(currentWorld,currentProgress);
  });
}

fetch(source,{cache:'no-store'})
  .then(r=>{if(!r.ok)throw new Error(String(r.status));return r.text()})
  .then(compose)
  .catch(()=>{
    loading.className='error';
    loading.innerHTML='No se ha podido cargar el texto canónico.<br><a href="../EL_INVENTARIO_DEL_AIRE_TRILOGIA_CANONICA.md">Abrir EL INVENTARIO DEL AIRE.</a>';
  });
})();
