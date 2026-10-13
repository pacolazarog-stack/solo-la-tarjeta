(()=>{
'use strict';

/* =======================================================
   ARCHIVO PROFUNDO
   MOTOR ACÚSTICO CONTEXTUAL
   ======================================================= */

const ARCHIVE_CHAPTERS=new Set(['deep-archive','trace-machine','atlas','resonator']);
const FOUNDATION_NODES=new Set(['tarjeta','nombre','reloj']);
const OBJECTS=[
  'botón de nácar','tarjeta usada','fotografía doblada','silla desplazada','llave sin puerta','reloj detenido',
  'vaso vacío','carta incompleta','espejo pequeño','fragmento de mapa','entrada de cine','etiqueta arrancada',
  'pañuelo olvidado','plato sin pareja','cuaderno húmedo','nombre borrado','planta crecida','puerta azul',
  'ventana cerrada','maleta antigua','billete perforado','miga de pan','caja anónima','señal oxidada',
  'archivo perdido','lámpara apagada','huella irreconocible'
];
const RELATIONS=['ECO','CONTRADICCION','SUSTITUCION','PROCEDENCIA','TESTIMONIO','BORRADO','ERROR','ESPEJO','CONTAGIO','AUSENCIA','REAPARICION','DUPLICADO','SOMBRA'];

const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const slug=s=>normalize(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

function nodeIdForX(x){
  if(x===2)return 'tarjeta';
  if(x===6)return 'reloj';
  if(x===16)return 'nombre';
  return slug(OBJECTS[x-1]||`huella-${x}`);
}
function relationFor(x,y,z){return RELATIONS[(x+y+z-3)%RELATIONS.length];}

class ArchiveAcoustics{
  constructor(audioCtx){
    this.ctx=audioCtx;
    this.enabled=false;
    this.active=false;
    this.lastNavigation=Date.now();
    this.lastResonance=0;
    this.lastAmbientEvent=0;
    this.openNodes=new Set();
    this.events=[];
    this.fatigue=0;
    this.activeMs=0;
    this.lastLoopAt=Date.now();
    this.shadowDepth=14;
    this.roomTone=null;
    this.master=this.ctx.createGain();
    this.master.gain.value=0;
    this.master.connect(this.ctx.destination);
    this.startRoomTone();
    this.startBehaviourLoop();
  }

  setEnabled(on){
    this.enabled=!!on;
    if(this.enabled&&this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
    this.syncMaster();
  }

  setActive(on){
    const next=!!on;
    if(next&&!this.active)this.lastNavigation=Date.now();
    this.active=next;
    this.syncMaster();
    this.updateRoomTone();
  }

  syncMaster(){
    const target=this.enabled&&this.active?.72:0;
    const now=this.ctx.currentTime;
    const gain=this.master.gain;
    gain.cancelScheduledValues(now);
    gain.setTargetAtTime(target,now,target?0.28:0.12);
  }

  startRoomTone(){
    const osc=this.ctx.createOscillator();
    const gain=this.ctx.createGain();
    osc.type='sine';
    osc.frequency.value=46;
    gain.gain.value=0.0001;
    osc.connect(gain).connect(this.master);
    osc.start();
    this.roomTone={osc,gain};
    this.roomTimer=setInterval(()=>{
      if(!this.roomTone)return;
      const depth=(this.shadowDepth-1)/26;
      const fatigueDrop=this.fatigue*3.5;
      const target=50-depth*7-fatigueDrop+(Math.random()*2-1)*1.7;
      osc.frequency.setTargetAtTime(target,this.ctx.currentTime,9+Math.random()*5);
      this.updateRoomTone();
    },20000);
  }

  updateRoomTone(){
    if(!this.roomTone)return;
    const depth=(this.shadowDepth-1)/26;
    const level=this.active&&this.enabled?(0.0026-depth*0.0007)*(1-this.fatigue*0.42):0.0001;
    this.roomTone.gain.gain.setTargetAtTime(Math.max(0.0001,level),this.ctx.currentTime,1.8);
  }

  registerNode(nodeId,meta={}){
    const id=normalize(nodeId);
    if(!id)return;
    this.lastNavigation=Date.now();
    this.openNodes.add(id);
    if(Number.isFinite(Number(meta.z)))this.shadowDepth=clamp(Number(meta.z),1,27);
    this.events.push({type:'node',node:id,time:Date.now(),meta:{...meta}});
    if(this.events.length>100)this.events.shift();
    this.updateRoomTone();
    this.detectFundationalPattern();
  }

  detectFundationalPattern(){
    const recent=this.events.slice(-10).filter(e=>e.type==='node').map(e=>e.node);
    const hasTarjeta=recent.includes('tarjeta');
    const hasNombre=recent.includes('nombre');
    const hasReloj=recent.includes('reloj');
    if(hasTarjeta&&hasNombre&&hasReloj)this.fireBN01();
  }

  paperFlip(intensity=1){
    if(!this.active||!this.enabled)return;
    const duration=0.18+Math.random()*0.11;
    const buffer=this.ctx.createBuffer(1,Math.floor(duration*this.ctx.sampleRate),this.ctx.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++){
      const t=i/data.length;
      const env=Math.pow(1-t,1.7)*(0.55+0.45*Math.sin(Math.PI*t));
      data[i]=(Math.random()*2-1)*env*0.032*intensity;
    }
    const source=this.ctx.createBufferSource();
    const high=this.ctx.createBiquadFilter();
    const band=this.ctx.createBiquadFilter();
    const gain=this.ctx.createGain();
    source.buffer=buffer;
    high.type='highpass';
    high.frequency.value=2200+Math.random()*1100;
    band.type='bandpass';
    band.frequency.value=3100+Math.random()*1700;
    band.Q.value=0.55+Math.random()*0.55;
    gain.gain.value=0.72;
    source.connect(high).connect(band).connect(gain).connect(this.master);
    source.start();
  }

  woodKnock(intensity=1){
    if(!this.active||!this.enabled)return;
    const osc=this.ctx.createOscillator();
    const gain=this.ctx.createGain();
    const filter=this.ctx.createBiquadFilter();
    const now=this.ctx.currentTime;
    osc.type='triangle';
    osc.frequency.setValueAtTime(145+Math.random()*55,now);
    osc.frequency.exponentialRampToValueAtTime(92+Math.random()*24,now+0.16);
    filter.type='lowpass';
    filter.frequency.value=1150+Math.random()*450;
    gain.gain.setValueAtTime(0.045*intensity,now);
    gain.gain.exponentialRampToValueAtTime(0.0001,now+0.24);
    osc.connect(filter).connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now+0.26);
  }

  playInterference(kind){
    if(!this.active||!this.enabled)return;
    const k=normalize(kind).toUpperCase();
    switch(k){
      case 'ESPEJO':
        this.paperFlip(0.78);
        setTimeout(()=>this.paperFlip(0.58),140);
        break;
      case 'AUSENCIA':
        this.paperFlip(0.52);
        break;
      case 'CONTRADICCION':
        this.woodKnock(0.76);
        setTimeout(()=>this.paperFlip(0.62),120);
        break;
      case 'ERROR':
        this.woodKnock(0.42);
        break;
      case 'ECO':
        this.paperFlip(0.44);
        setTimeout(()=>this.paperFlip(0.25),210);
        break;
      default:
        this.paperFlip(0.46);
    }
  }

  fireBN01(){
    const nowMs=Date.now();
    if(nowMs-this.lastResonance<120000)return;
    this.lastResonance=nowMs;
    if(this.active&&this.enabled){
      this.woodKnock(0.82);
      setTimeout(()=>{
        if(!this.active||!this.enabled)return;
        const osc=this.ctx.createOscillator();
        const gain=this.ctx.createGain();
        const now=this.ctx.currentTime;
        osc.type='sine';
        osc.frequency.setValueAtTime(1180+Math.random()*80,now);
        gain.gain.setValueAtTime(0.024,now);
        gain.gain.exponentialRampToValueAtTime(0.0001,now+0.14);
        osc.connect(gain).connect(this.master);
        osc.start(now);
        osc.stop(now+0.15);
      },30);
    }
    document.dispatchEvent(new CustomEvent('oras:bn01',{detail:{nodes:['tarjeta','nombre','reloj'],time:nowMs}}));
  }

  updateFatigue(dt){
    if(this.active)this.activeMs+=Math.max(0,dt);
    this.fatigue=clamp(this.activeMs/(1000*60*20));
    this.updateRoomTone();
  }

  startBehaviourLoop(){
    this.behaviourTimer=setInterval(()=>{
      const now=Date.now();
      const dt=now-this.lastLoopAt;
      this.lastLoopAt=now;
      this.updateFatigue(dt);
      if(!this.active||!this.enabled)return;
      const dwell=now-this.lastNavigation;
      if(dwell<12000||now-this.lastAmbientEvent<9000)return;
      const chance=0.15*(1-this.fatigue*0.78);
      if(Math.random()>=chance)return;
      this.lastAmbientEvent=now;
      const depth=(this.shadowDepth-1)/26;
      if(Math.random()<0.72-depth*0.18)this.paperFlip(0.26+Math.random()*0.22);
      else this.woodKnock(0.22+Math.random()*0.2);
    },4500);
  }
}

window.ArchiveAcoustics=ArchiveAcoustics;

const toggle=document.getElementById('ambientToggle');
let archive=null;
let framePending=false;

function soundIsOn(){return toggle?.getAttribute('aria-pressed')==='true';}
function archivePanelInView(){
  const candidates=[...document.querySelectorAll('.story-panel')].filter(p=>ARCHIVE_CHAPTERS.has(p.dataset.chapter));
  if(!candidates.length)return null;
  const y=innerHeight*0.5;
  let chosen=null,best=Infinity;
  for(const panel of candidates){
    const r=panel.getBoundingClientRect();
    const d=Math.abs((r.top+r.height*0.5)-y);
    if(d<best){best=d;chosen=panel;}
  }
  if(!chosen)return null;
  const r=chosen.getBoundingClientRect();
  if(r.bottom<innerHeight*0.08||r.top>innerHeight*0.92)return null;
  return chosen;
}
function isArchiveActive(){return !!archivePanelInView();}
function ensureArchive(){
  if(archive)return archive;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  try{
    archive=new ArchiveAcoustics(new AC());
    window.archiveAcoustics=archive;
    archive.setEnabled(soundIsOn());
    archive.setActive(isArchiveActive());
    return archive;
  }catch(_){return null;}
}
function syncArchiveState(){
  if(!archive)return;
  archive.setActive(isArchiveActive());
  archive.setEnabled(soundIsOn());
}
function scheduleSync(){
  if(framePending)return;
  framePending=true;
  requestAnimationFrame(()=>{framePending=false;syncArchiveState();});
}
function atlasState(){
  const x=Number(document.getElementById('atlasR5X')?.value);
  const y=Number(document.getElementById('atlasR5Y')?.value);
  const z=Number(document.getElementById('atlasR5Z')?.value);
  if(![x,y,z].every(Number.isFinite))return null;
  return{x,y,z,relation:relationFor(x,y,z)};
}
function registerCurrentNode(){
  const state=atlasState();
  if(!state)return;
  const a=ensureArchive();
  if(!a)return;
  a.setActive(true);
  a.registerNode(nodeIdForX(state.x),state);
}

addEventListener('scroll',scheduleSync,{passive:true});
addEventListener('resize',scheduleSync,{passive:true});
addEventListener('pageshow',scheduleSync,{passive:true});

document.addEventListener('input',e=>{
  if(!e.target?.matches?.('#atlasR5X,#atlasR5Y,#atlasR5Z'))return;
  registerCurrentNode();
});

document.addEventListener('click',e=>{
  const button=e.target?.closest?.('[data-atlas-act]');
  if(!button)return;
  const act=button.dataset.atlasAct;
  registerCurrentNode();
  const a=archive;
  if(!a)return;
  if(act==='mirror'){
    a.playInterference('ESPEJO');
    return;
  }
  if(act==='resonate'){
    const state=atlasState();
    if(!state)return;
    const center=state.x===14&&state.y===14&&state.z===14;
    a.playInterference(center?'CONTRADICCION':state.relation);
  }
});

if(toggle){
  toggle.addEventListener('click',()=>{
    const a=ensureArchive();
    if(a?.ctx.state==='suspended')a.ctx.resume().catch(()=>{});
  });
  new MutationObserver(syncArchiveState).observe(toggle,{attributes:true,attributeFilter:['aria-pressed']});
}

new MutationObserver(scheduleSync).observe(document.body,{subtree:true,childList:true});

})();