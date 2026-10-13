(()=>{
'use strict';

/* ATLAS / AZAR · R6
   El visitante cree que juega con una máquina de azar.
   La máquina selecciona huellas, produce resonancias y deja consecuencias.
*/

const STORAGE='oras.atlas-azar.v2';
const MIRROR_STORAGE='oras.atlas.mirror.v1';
const MAX_SPINS=72;
const FOUNDATION=['tarjeta','nombre','reloj'];
const TRACES=[
  {id:'boton',label:'botón de nácar'},
  {id:'tarjeta',label:'tarjeta usada'},
  {id:'fotografia',label:'fotografía doblada'},
  {id:'silla',label:'silla desplazada'},
  {id:'llave',label:'llave sin puerta'},
  {id:'reloj',label:'reloj detenido'},
  {id:'vaso',label:'vaso vacío'},
  {id:'carta',label:'carta incompleta'},
  {id:'espejo',label:'espejo pequeño'},
  {id:'mapa',label:'fragmento de mapa'},
  {id:'entrada',label:'entrada de cine'},
  {id:'etiqueta',label:'etiqueta arrancada'},
  {id:'panuelo',label:'pañuelo olvidado'},
  {id:'plato',label:'plato sin pareja'},
  {id:'cuaderno',label:'cuaderno húmedo'},
  {id:'nombre',label:'nombre borrado'},
  {id:'planta',label:'planta crecida'},
  {id:'puerta',label:'puerta azul'},
  {id:'ventana',label:'ventana cerrada'},
  {id:'maleta',label:'maleta antigua'},
  {id:'billete',label:'billete perforado'},
  {id:'miga',label:'miga de pan'},
  {id:'caja',label:'caja anónima'},
  {id:'senal',label:'señal oxidada'},
  {id:'archivo',label:'archivo perdido'},
  {id:'lampara',label:'lámpara apagada'},
  {id:'huella',label:'huella irreconocible'}
];
const RELATIONS=['ECO','CONTRADICCIÓN','SUSTITUCIÓN','PROCEDENCIA','TESTIMONIO','BORRADO','ERROR','ESPEJO','CONTAGIO','AUSENCIA','REAPARICIÓN','DUPLICADO','SOMBRA'];
const TEXTS={
  RESONANCIA:[
    'La relación apareció antes que la explicación.',
    'Dos huellas que no se conocían comenzaron a decir lo mismo.',
    'Nada fue recuperado. Algo, sin embargo, volvió a tener sentido.'
  ],
  INTERFERENCIA:[
    'Tres versiones coinciden. Ninguna describe la misma cosa.',
    'La coincidencia aumentó la duda.',
    'La señal se hizo más clara justo cuando dejó de ser fiable.'
  ],
  ORA:[
    'Casi todo había desaparecido. La capacidad de relación no.',
    'La procedencia se perdió. La huella siguió diciendo cosas.',
    'Lo que quedaba era insuficiente para explicar y suficiente para resonar.'
  ],
  AUSENCIA:[
    'Algo falta. Todavía queda bastante para saber que falta.',
    'La ausencia conserva un borde.',
    'No apareció el objeto. Apareció el lugar que había dejado.'
  ],
  'CONTRADICCIÓN':[
    'Dos testimonios se excluyen y sobreviven juntos.',
    'La corrección no eliminó el error.',
    'Una versión niega a la otra. Las dos dejan huella.'
  ],
  ESPEJO:[
    'La misma huella permite una lectura inversa.',
    'Lo que el archivo afirma puede regresar cambiado.',
    'La relación vuelve desde el otro lado.'
  ],
  ERROR:[
    'El error fue registrado antes que la cosa.',
    'Una equivocación sobrevivió a su causa.',
    'Nadie corrigió la ficha. La ficha siguió trabajando.'
  ]
};

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const rand=n=>Math.floor(Math.random()*n)+1;
const choice=a=>a[Math.floor(Math.random()*a.length)];
const mirror=p=>({x:28-p.x,y:28-p.y,z:28-p.z});
const relationFor=p=>RELATIONS[(p.x+p.y+p.z-3)%RELATIONS.length];
const band=z=>z<=4?'PRESENTE':z<=8?'ATENUADO':z<=12?'DOCUMENTAL':z<=16?'INDIRECTO':z<=20?'RESIDUAL':'UMBRAL';

function loadState(){
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE)||'null');
    if(raw&&raw.version===2&&Array.isArray(raw.spins))return raw;
  }catch(_){}
  return{version:2,spins:[],consequences:[],lastBn01:0,lastSpinAt:0};
}
function saveState(state){
  state.spins=state.spins.slice(-MAX_SPINS);
  state.consequences=state.consequences.slice(-MAX_SPINS);
  try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(_){}
}

function chooseTrace(state){
  const recent=state.spins.slice(-8).map(s=>s.trace?.id).filter(Boolean);
  const present=new Set(recent.filter(id=>FOUNDATION.includes(id)));
  const missing=FOUNDATION.filter(id=>!present.has(id));
  if(present.size===2&&missing.length===1&&Math.random()<.34){
    return TRACES.find(t=>t.id===missing[0]);
  }
  const last=state.spins.at(-1)?.trace?.id;
  if(last&&Math.random()<.18){
    const i=TRACES.findIndex(t=>t.id===last);
    const j=clamp(i+(Math.random()<.5?-1:1),0,TRACES.length-1);
    return TRACES[j];
  }
  return choice(TRACES);
}

function chooseCoordinates(state){
  const previous=state.spins.at(-1)?.coords;
  if(state.spins.length>4&&Math.random()<.018)return{x:14,y:14,z:14};
  if(previous&&Math.random()<.18)return mirror(previous);
  if(previous&&Math.random()<.22){
    return{
      x:clamp(previous.x+choice([-2,-1,1,2]),1,27),
      y:clamp(previous.y+choice([-2,-1,1,2]),1,27),
      z:clamp(previous.z+choice([-2,-1,1,2]),1,27)
    };
  }
  return{x:rand(27),y:rand(27),z:rand(27)};
}

function classify(trace,coords,state){
  if(coords.x===14&&coords.y===14&&coords.z===14)return'INTERFERENCIA';
  if(trace.id==='boton'&&Math.random()<.64)return'ORA';
  const rel=relationFor(coords);
  if(rel==='ESPEJO'&&Math.random()<.72)return'ESPEJO';
  if(rel==='CONTRADICCIÓN'&&Math.random()<.72)return'CONTRADICCIÓN';
  if(rel==='ERROR'&&Math.random()<.7)return'ERROR';
  if(rel==='AUSENCIA'||coords.z>=24)return'AUSENCIA';
  const since=Date.now()-(state.lastSpinAt||0);
  if(state.lastSpinAt&&since<4200&&Math.random()<.34)return'CONTRADICCIÓN';
  if(state.lastSpinAt&&since>18000&&Math.random()<.30)return'AUSENCIA';
  if(Math.random()<.12)return'INTERFERENCIA';
  return'RESONANCIA';
}

function consequenceFor(spin,state){
  let target;
  if(spin.kind==='ESPEJO')target='mirror';
  else if(spin.kind==='ORA'&&spin.trace.id==='boton')target='xii';
  else target=['xi','xii','xiii'][state.spins.length%3];

  let text='';
  if(target==='xi'){
    text=spin.kind==='ORA'
      ?'Al margen de una ficha apareció una frase nueva: «Lo que queda todavía puede relacionarse». '
      :`Nota marginal: «${choice(TEXTS[spin.kind]||TEXTS.RESONANCIA)}»`;
  }else if(target==='xii'){
    text=spin.trace.id==='boton'
      ?'Una ficha nueva apareció entre las anteriores. Sólo decía: BOTÓN DE NÁCAR.'
      :`Una ficha nueva apareció entre las anteriores: ${spin.trace.label}. Nadie recordó haberla añadido.`;
  }else if(target==='xiii'){
    text=`En una prueba posterior, el Resonador devolvió una palabra que no figuraba en el cuaderno: ${spin.kind}.`;
  }else{
    text='Una lectura del Espejo quedó alterada para la próxima vez.';
  }
  return{id:spin.id,target,text,trace:spin.trace,kind:spin.kind,coords:spin.coords,time:Date.now()};
}

function mirrorVariant(spin){
  const variants=[
    {sceneIndex:0,text:'No era exactamente la misma historia.'},
    {sceneIndex:3,text:'Otra con un reloj que no marcaba la misma hora.'},
    {sceneIndex:20,text:'No porque duren más.\nSino porque regresan en otro lugar.'},
    {sceneIndex:28,text:'En una presencia.\nO en la huella que dejó.'}
  ];
  const v=choice(variants);
  return{active:true,sourceSpin:spin.id,createdAt:Date.now(),sceneIndex:v.sceneIndex,text:v.text};
}

function detectBN01(state,currentTrace){
  const recent=state.spins.slice(-9).map(s=>s.trace?.id).filter(Boolean).concat(currentTrace.id);
  if(!FOUNDATION.every(id=>recent.includes(id)))return false;
  if(Date.now()-(state.lastBn01||0)<120000)return false;
  state.lastBn01=Date.now();
  return true;
}

class MachineAudio{
  constructor(){this.ctx=null;this.spinTimer=0;}
  on(){return document.getElementById('ambientToggle')?.getAttribute('aria-pressed')==='true';}
  ensure(){
    if(!this.on())return false;
    if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;this.ctx=new AC();}
    if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
    return true;
  }
  tick(level=.018){
    if(!this.ensure())return;
    const t=this.ctx.currentTime,osc=this.ctx.createOscillator(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();
    osc.type='square';osc.frequency.value=520+Math.random()*950;f.type='bandpass';f.frequency.value=1800+Math.random()*1600;f.Q.value=.8;
    g.gain.setValueAtTime(level,t);g.gain.exponentialRampToValueAtTime(.0001,t+.028);
    osc.connect(f).connect(g).connect(this.ctx.destination);osc.start(t);osc.stop(t+.03);
  }
  startSpin(){
    if(!this.ensure())return;
    clearInterval(this.spinTimer);
    let speed=62;
    this.spinTimer=setInterval(()=>this.tick(.006+Math.random()*.008),speed);
  }
  stopSpin(){clearInterval(this.spinTimer);this.spinTimer=0;}
  stopReel(i){
    if(!this.ensure())return;
    const t=this.ctx.currentTime,osc=this.ctx.createOscillator(),g=this.ctx.createGain();
    osc.type='triangle';osc.frequency.setValueAtTime(170-i*18,t);osc.frequency.exponentialRampToValueAtTime(92-i*7,t+.14);
    g.gain.setValueAtTime(.038,t);g.gain.exponentialRampToValueAtTime(.0001,t+.18);
    osc.connect(g).connect(this.ctx.destination);osc.start(t);osc.stop(t+.19);
  }
  outcome(kind){
    if(!this.ensure())return;
    const map={RESONANCIA:620,INTERFERENCIA:233,ORA:1040,AUSENCIA:96,'CONTRADICCIÓN':311,ESPEJO:740,ERROR:155};
    const base=map[kind]||440,t=this.ctx.currentTime;
    [1,kind==='ESPEJO'?1.012:1.5].forEach((m,i)=>{
      const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=i?'sine':'triangle';o.frequency.value=base*m;
      g.gain.setValueAtTime(i?.012:.018,t+i*.08);g.gain.exponentialRampToValueAtTime(.0001,t+.34+i*.09);
      o.connect(g).connect(this.ctx.destination);o.start(t+i*.08);o.stop(t+.38+i*.09);
    });
  }
  bn01(){
    if(!this.ensure())return;
    const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.value=1217;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.024,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.16);
    o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+.17);
  }
}
const audio=new MachineAudio();

function atlasSvg(spin,state){
  const history=state.spins.slice(-15).map(s=>s.coords).concat(spin?[spin.coords]:[]).filter(Boolean);
  const p=spin?.coords||history.at(-1)||{x:14,y:14,z:14};
  const g=7,o=10,w=o*2+27*g,c=v=>o+(v-1)*g+g/2,cy=v=>o+(27-v)*g+g/2;
  let s=`<svg viewBox="0 0 ${w} ${w}" role="img" aria-label="Atlas 27 por 27">`;
  for(let i=0;i<=27;i++){const q=o+i*g;s+=`<path d="M${o} ${q}H${o+27*g} M${q} ${o}V${o+27*g}" class="atlas-r6-line"/>`;}
  if(history.length>1)s+=`<polyline class="atlas-r6-history" points="${history.map(h=>`${c(h.x)},${cy(h.y)}`).join(' ')}"/>`;
  s+=`<circle class="atlas-r6-center" cx="${c(14)}" cy="${cy(14)}" r="3.4"/><circle class="atlas-r6-current" cx="${c(p.x)}" cy="${cy(p.y)}" r="5.2"/>`;
  return s+'</svg>';
}

function machineMarkup(){
  return `<div class="atlas-r6" aria-label="ATLAS / AZAR · máquina de selección de huellas">
    <div class="atlas-r6-title">ATLAS / AZAR</div>
    <div class="atlas-r6-body">
      <section class="atlas-r6-machine" aria-label="Máquina">
        <div class="atlas-r6-reels" aria-live="polite">
          <div class="atlas-r6-reel"><span>X</span><strong id="r6X">14</strong></div>
          <div class="atlas-r6-reel"><span>Y</span><strong id="r6Y">14</strong></div>
          <div class="atlas-r6-reel"><span>Z</span><strong id="r6Z">14</strong></div>
        </div>
        <button id="r6Spin" class="atlas-r6-spin" type="button">ACCIONAR AZAR</button>
        <div class="atlas-r6-breath" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>
      <section class="atlas-r6-result" id="r6Result" aria-live="polite">
        <div class="atlas-r6-kind" id="r6Kind">&nbsp;</div>
        <div class="atlas-r6-trace" id="r6Trace">La máquina ya estaba funcionando.</div>
        <div class="atlas-r6-coordinate" id="r6Coordinate" hidden></div>
        <div class="atlas-r6-ontology" id="r6Ontology" hidden>MATERIALIDAD · INSCRIPCIÓN · SOMBRA</div>
        <div class="atlas-r6-map" id="r6Map" aria-hidden="true"></div>
        <div class="atlas-r6-consequence" id="r6Consequence"></div>
      </section>
    </div>
    <div class="atlas-r6-bn" id="r6BN" aria-hidden="true">BN-01</div>
  </div>`;
}

function consequenceNodes(){
  return{
    xi:document.querySelector('.story-panel[data-chapter="deep-archive"] .panel-copy'),
    xii:document.querySelector('.story-panel[data-chapter="trace-machine"] .panel-copy'),
    xiii:document.querySelector('.story-panel[data-chapter="resonator"] .panel-copy')
  };
}
function applyPersistentConsequences(state){
  const nodes=consequenceNodes();
  Object.values(nodes).forEach(node=>node?.querySelectorAll('.atlas-r6-margin').forEach(n=>n.remove()));
  for(const key of ['xi','xii','xiii']){
    const c=[...state.consequences].reverse().find(x=>x.target===key);
    if(!c||!nodes[key])continue;
    const p=document.createElement('p');p.className='atlas-r6-margin';p.textContent=c.text;nodes[key].appendChild(p);
  }
}

function registerWithAcoustics(spin){
  try{
    const a=window.archiveAcoustics;
    if(a){
      a.setActive(true);
      a.registerNode(spin.trace.id,{...spin.coords,relation:relationFor(spin.coords)});
      a.playInterference(spin.kind==='INTERFERENCIA'?'CONTRADICCION':spin.kind);
    }
  }catch(_){}
  document.dispatchEvent(new CustomEvent('oras:atlas-selection',{detail:spin}));
}

function setupMachine(panel){
  if(panel.dataset.atlasR6Ready==='1')return;
  panel.dataset.atlasR6Ready='1';
  const copy=panel.querySelector('.panel-copy');
  if(!copy)return;
  copy.innerHTML=machineMarkup();
  panel.classList.add('atlas-panel-r6');
  const $=s=>panel.querySelector(s);
  const els={x:$('#r6X'),y:$('#r6Y'),z:$('#r6Z'),spin:$('#r6Spin'),kind:$('#r6Kind'),trace:$('#r6Trace'),coord:$('#r6Coordinate'),ontology:$('#r6Ontology'),map:$('#r6Map'),consequence:$('#r6Consequence'),bn:$('#r6BN'),machine:panel.querySelector('.atlas-r6-machine')};
  const state=loadState();
  applyPersistentConsequences(state);
  const last=state.spins.at(-1);
  if(last){
    els.x.textContent=last.coords.x;els.y.textContent=last.coords.y;els.z.textContent=last.coords.z;
    els.map.innerHTML=atlasSvg(last,state);
  }
  let busy=false,timers=[];
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id;};
  const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];};

  function reveal(spin,bn01){
    els.kind.textContent=spin.kind;
    els.kind.classList.add('is-visible');
    els.trace.textContent=choice(TEXTS[spin.kind]||TEXTS.RESONANCIA);
    els.trace.classList.add('is-selected');
    audio.outcome(spin.kind);
    registerWithAcoustics(spin);

    later(()=>{
      els.coord.hidden=false;els.coord.textContent=`(${spin.coords.x},${spin.coords.y},${spin.coords.z})`;
      els.coord.classList.add('is-visible');
      els.map.innerHTML=atlasSvg(spin,state);els.map.classList.add('is-visible');
    },620);
    later(()=>{els.ontology.hidden=false;els.ontology.classList.add('is-visible');},980);

    const c=consequenceFor(spin,state);
    state.consequences.push(c);
    if(c.target==='mirror'){
      try{localStorage.setItem(MIRROR_STORAGE,JSON.stringify(mirrorVariant(spin)));}catch(_){}
    }
    saveState(state);
    applyPersistentConsequences(state);

    later(()=>{
      els.consequence.textContent=c.target==='mirror'
        ?'La consecuencia no está aquí.'
        :'La jugada ha dejado una huella.';
      els.consequence.classList.add('is-visible');
    },1350);

    if(bn01){
      later(()=>{
        const axis=choice(['x','y','z']);
        const before=spin.coords[axis];
        spin.coords[axis]=clamp(before+(Math.random()<.5?-1:1),1,27);
        spin.bn01={axis,before,after:spin.coords[axis]};
        els[axis].textContent=spin.coords[axis];
        els.coord.textContent=`(${spin.coords.x},${spin.coords.y},${spin.coords.z})`;
        els.map.innerHTML=atlasSvg(spin,state);
        const words=els.trace.textContent.trim().split(/\s+/);if(words.length>3){words.splice(Math.max(1,words.length-2),1);els.trace.textContent=words.join(' ');}
        audio.bn01();
        document.dispatchEvent(new CustomEvent('oras:bn01',{detail:{source:'atlas',spin}}));
        saveState(state);
      },1650);
      later(()=>{els.bn.classList.add('is-visible');},2400);
      later(()=>{els.bn.classList.remove('is-visible');},4300);
    }

    later(()=>{busy=false;els.spin.disabled=false;els.spin.textContent='ACCIONAR AZAR';els.machine.classList.remove('is-spinning');},2200);
  }

  function spin(){
    if(busy)return;
    busy=true;clearTimers();
    els.spin.disabled=true;els.spin.textContent='…';
    els.machine.classList.add('is-spinning');
    els.kind.textContent='';els.kind.classList.remove('is-visible');
    els.trace.textContent='';els.trace.classList.remove('is-selected');
    els.coord.hidden=true;els.coord.classList.remove('is-visible');
    els.ontology.hidden=true;els.ontology.classList.remove('is-visible');
    els.map.classList.remove('is-visible');
    els.consequence.textContent='';els.consequence.classList.remove('is-visible');
    els.bn.classList.remove('is-visible');

    const trace=chooseTrace(state);
    const coords=chooseCoordinates(state);
    const kind=classify(trace,coords,state);
    const spin={id:`az-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,time:Date.now(),trace,coords:{...coords},kind,relation:relationFor(coords),band:band(coords.z)};
    const bn01=detectBN01(state,trace);
    state.lastSpinAt=spin.time;
    state.spins.push(spin);
    saveState(state);

    audio.startSpin();
    const reelTimers=[];
    ['x','y','z'].forEach((axis,i)=>{
      const el=els[axis];
      reelTimers.push(setInterval(()=>{el.textContent=rand(27);},48+i*13));
    });
    later(()=>{clearInterval(reelTimers[0]);els.x.textContent=coords.x;audio.stopReel(0);},760);
    later(()=>{clearInterval(reelTimers[1]);els.y.textContent=coords.y;audio.stopReel(1);},1110);
    later(()=>{clearInterval(reelTimers[2]);els.z.textContent=coords.z;audio.stopReel(2);audio.stopSpin();},1490);
    later(()=>reveal(spin,bn01),1710);
  }

  els.spin.addEventListener('click',spin);
}

function mount(){
  const panel=document.querySelector('.story-panel[data-chapter="atlas"]');
  if(!panel)return false;
  setupMachine(panel);
  applyPersistentConsequences(loadState());
  return true;
}
if(!mount()){
  const mo=new MutationObserver(()=>{if(mount())mo.disconnect();});
  mo.observe(document.body,{subtree:true,childList:true});
}
addEventListener('storage',e=>{if(e.key===STORAGE)applyPersistentConsequences(loadState());});

})();