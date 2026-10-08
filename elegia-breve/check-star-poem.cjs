const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements=new Map(),timers=new Map(),gains=[];
let timerId=0;
class Element{
  constructor(id){this.id=id;this.handlers={};this.paused=true;this.volume=1;this.currentTime=0;this.muted=false;this.checked=id==='musicEnabled';this.value=id==='musicLevel'?'80':'';this.open=false;const classes=new Set();this.classList={add(...names){names.forEach(n=>classes.add(n));},remove(...names){names.forEach(n=>classes.delete(n));},toggle(n,on){if(on)classes.add(n);else classes.delete(n);},contains(n){return classes.has(n);}};}
  addEventListener(name,fn){(this.handlers[name]??=[]).push(fn);}
  emit(name,event={}){for(const fn of this.handlers[name]??[])fn(event);}
  getAttribute(name){return this[name]??null;}
  removeAttribute(name){delete this[name];}
  click(){this.emit('click',{button:0,preventDefault(){}});}
  setAttribute(name,value){this[name]=value;}
  play(){this.playCalls=(this.playCalls??0)+1;if(this.paused){this.paused=false;queueMicrotask(()=>{this.emit('play');this.emit('playing');});}return Promise.resolve();}
  pause(){if(!this.paused){this.paused=true;queueMicrotask(()=>this.emit('pause'));}}
  show(){this.open=true;}
  close(){this.open=false;this.emit('close');}
}
const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
const gainParam=()=>({value:0,ramps:[],cancelScheduledValues(){},cancelAndHoldAtTime(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v,t){this.ramps.push([v,t]);},setTargetAtTime(v){this.value=v;}});
const node=()=>({connect(next){return next;}});
class AudioContext{
  constructor(){this.state='running';this.currentTime=0;this.destination=node();}
  createAnalyser(){return {...node(),getFloatTimeDomainData(a){a.fill(.01);}};}
  createGain(){const result={...node(),gain:gainParam()};gains.push(result);return result;}
  createDelay(){return {...node(),delayTime:{value:0}};}
  createMediaElementSource(){return node();}
  resume(){return Promise.resolve();}
}
const root={style:{values:{},setProperty(name,value){this.values[name]=value;}},classList:get('root').classList,scrollHeight:1000};
const windowEvents={};const sentStates=[];get('cenicientoFrame').contentWindow={postMessage(data){sentStates.push(data);}};
const context={document:{documentElement:root,body:get('body'),getElementById:get,querySelectorAll(){return[];}},window:{AudioContext,location:{search:'?voz=1',origin:'https://example.test',pathname:'/elegia-breve/',hash:''},history:{replaceState(state,title,url){context.window.location.hash='';},pushState(state,title,hash){context.window.location.hash=hash;},back(){context.window.location.hash='';for(const fn of windowEvents.popstate??[])fn();}},innerHeight:800,addEventListener(name,fn){(windowEvents[name]??=[]).push(fn);},scrollTo(){}},URLSearchParams,Float32Array,Math,Promise,requestAnimationFrame(){return 1;},cancelAnimationFrame(){},setTimeout(fn,ms){const id=++timerId;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
const flush=()=>new Promise(resolve=>setImmediate(resolve));

context.window.matchMedia=()=>({matches:false});
Element.prototype.getBoundingClientRect=()=>({top:0,bottom:800});
get('cenicientoFrame').hidden=true;
(async()=>{
 vm.runInNewContext(script,context);await flush();
 const calls=get('voiceMusic').playCalls;get('voiceMusic').currentTime=47.5;
 for(const [piece,id,title] of [['cabello','anaCabello','TU CABELLO'],['piel','anaPiel','TU PIEL'],['estrella','anaEstrella','SIGUIENDO UNA TARJETA'],['epilogo','anaEpilogue','A FUEGO LENTO · EPÍLOGO']]){
  get(id).click();await flush();
  assert.equal(context.document.title,title);
  assert.equal(get('cenicientoFrame').hidden,false);
  assert(get('cenicientoFrame').src.includes('../'+piece+'/?music=parent'));
  assert.equal(context.window.location.hash,'#'+piece);
  assert.equal(get('voiceMusic').currentTime,47.5);
  assert.equal(get('voiceMusic').playCalls,calls,'Opening a poem never restarts the soundtrack');
  get('cenicientoFrame').emit('load');
  const reveal=[...timers.entries()].find(([,t])=>t.ms===350);assert(reveal);
  timers.delete(reveal[0]);reveal[1].fn();
  assert(get('cenicientoFrame').classList.contains('sonrisa-visible'));
  for(const fn of windowEvents.message)fn({origin:context.window.location.origin,source:get('cenicientoFrame').contentWindow,data:{channel:'ceniciento-music-v1',type:'home'}});
  const back=[...timers.entries()].find(([,t])=>t.ms===7100);assert(back);
  timers.delete(back[0]);back[1].fn();
  assert.equal(get('cenicientoFrame').hidden,true);
  assert.equal(get('anaNavigation').hidden,false);
  assert.equal(get('voiceMusic').currentTime,47.5);
  assert.equal(get('voiceMusic').playCalls,calls,'Returning also preserves the soundtrack');
  const child=fs.readFileSync(__dirname+'/../'+piece+'/index.html','utf8');
  assert(child.includes('class="detail-background"'));
  if(piece!=='epilogo'){
   assert(child.includes(piece==='estrella'?'umbral.jpg':'ana-klaudya-fotografia.jpg'));
   assert(child.includes('.detail-background.is-clear '+(piece==='estrella'?'img':'svg')+'{filter:blur(0)'));
   assert(child.includes('transition:filter '+(piece==='estrella'?'36':'60')+'s ease-in-out'));
  }else{assert(child.includes('Epílogo · Ana Klaudya'));assert(child.includes('transition:opacity 7s ease-in-out'));assert(!child.includes('Amor a fuego lento'));}
  assert(!child.includes('<audio'),'Both poems share the host music track');
  const childScript=[...child.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  const items=new Map(),childTimers=new Map(),messages=[];let seq=0;
  const node=id=>{if(!items.has(id))items.set(id,new Element(id));return items.get(id);};
  const pattern=['estrella','epilogo'].includes(piece)?/class="phrase hidden-phrase(?: ending(?: final-stanza)?)?" aria-hidden="true" data-wait="(\d+)">([\s\S]*?)<\/p>/g:/class="line(?: ending)?" data-wait="(\d+)">([^<]+)/g;
  const lines=[...child.matchAll(pattern)].map((m,i)=>{const e=node('line'+i);e.dataset={wait:m[1]};e.textContent=m[2].replace(/<br>\s*/g,' ').replace(/<[^>]+>/g,'');if(['estrella','epilogo'].includes(piece)){e.classList.add('hidden-phrase');e.setAttribute('aria-hidden','true');}return e;});
  assert.equal(lines.length,piece==='estrella'?6:piece==='cabello'?17:piece==='piel'?13:16);
  if(piece==='epilogo'){
   assert.equal(lines[0].textContent,'Yo iba a escribirte un poema. Tú me diste una cebolla.');
   assert.equal(lines[9].textContent,'—Al puchero, Paco.');
   assert.equal(lines.at(-1).textContent,'Lo alcanzo con la otra.');
   assert.equal([...child.matchAll(pattern)].reduce((n,m)=>n+1+(m[2].match(/<br>/g)||[]).length,0),29);
  }
  if(piece==='estrella'){
   assert.deepEqual(lines.map(l=>l.textContent),['Siguiendo una tarjeta, encontré un lugar.','Al detenerme allí, empezó a ser mi hogar: todavía sin llave, pero ya imaginaba mis pasos al volver.','Siguiendo a un ángel, llegué hasta ti.','Cuando era yang, buscaba el yin.','Ahora que soy yin,','me basta con mirarte.']);
   assert(child.includes('id="poem" aria-label="Siguiendo una tarjeta" hidden'));
   assert(!child.includes('id="full"'),'No full-poem button can bypass the lunar gate');
  }
  const parent={postMessage(data){messages.push(data);}},events={};
  class ImageMock{addEventListener(name,fn){this[name]=fn;}set src(value){this.load();}}
  const childContext={Image:ImageMock,URLSearchParams,location:{origin:'https://example.test',search:'?music=parent'},window:{parent,addEventListener(name,fn){events[name]=fn;}},document:{body:node('body'),documentElement:{style:{setProperty(){}}},querySelector(){return node('background');},querySelectorAll(){return lines;},getElementById:node},requestAnimationFrame(fn){fn();},setTimeout(fn,ms){const id=++seq;childTimers.set(id,{fn,ms});return id;},clearTimeout(id){childTimers.delete(id);}};
  vm.runInNewContext(childScript,childContext);
  if(piece==='estrella'){
   assert.equal(node('poem').hidden,true);assert.equal(node('paced').disabled,true);
   assert.equal(node('continueAna').hidden,true);node('continueAna').click();assert(!messages.some(m=>m.type==='ana'),'Continuation waits for the entire poem');
   node('paced').click();assert(lines.every(l=>l.classList.contains('hidden-phrase')),'Clicking early cannot expose text');
   const startCue=[...childTimers.values()].find(t=>t.ms===7200);assert(startCue);
   assert(!node('worldComet').classList.contains('is-active'));assert(!node('celestialScene').classList.contains('is-home'));
   startCue.fn();assert(node('worldComet').classList.contains('is-active'));
   assert(node('celestialScene').classList.contains('is-awake'));assert(node('celestialScene').classList.contains('is-home'),'One cue starts the star and lunar evolution together');
   assert.equal(node('poem').hidden,true,'Text remains hidden while the lunar transitions run');
   assert(child.includes('@keyframes cometField{0%{opacity:.85}'),'The star is visible from its first frame');
   assert(child.includes('.world-comet{position:absolute;inset:0;z-index:2;opacity:.85;'),'The upper-center star is already visible during entry');
   assert(child.includes('.world-comet{position:absolute;inset:0;z-index:2;'));
   assert(child.includes('aspect-ratio:1;border-radius:50%;z-index:3;'),'The moon occludes the comet');
   assert(child.includes('0%{left:50%;top:5%'));
   assert(child.includes('78%{left:82%;top:14%'));
   assert(!child.includes('left:-22%'));assert(child.includes('100%{left:90%;top:16%'));
   assert(child.includes('--comet-angle:30deg'));
   assert(child.includes('cx="50" cy="25" r="8" fill="#faf9ee"'));
   assert(child.includes('cx="50" cy="75" r="8" fill="#08101e"'));
  }
  assert.equal(messages[0].type,'ready');
  if(piece!=='epilogo'){const clear=[...childTimers.values()].find(t=>t.ms===350);clear.fn();}
  assert(node('background').classList.contains('is-clear'));
  if(piece==='estrella'){
   const moon=node('homeMoon');moon.emit('transitionend',{target:moon,currentTarget:moon,propertyName:'opacity'});
   assert.equal(node('poem').hidden,true,'The early opacity transition does not open the gate');
   moon.emit('transitionend',{target:moon,currentTarget:moon,propertyName:'box-shadow'});
   assert.equal(node('poem').hidden,false);assert.equal(node('paced').disabled,false);
   assert(!lines[0].classList.contains('hidden-phrase'));assert.equal(lines[0].getAttribute('aria-hidden'),null);
   assert(lines.slice(1).every(l=>l.classList.contains('hidden-phrase')));
   assert(lines.slice(1).every(l=>l.getAttribute('aria-hidden')==='true'));
   node('paced').click();assert.equal(node('paced').textContent,'Continuar');
   const runReading=()=>{const pending=[...childTimers.entries()].find(([,t])=>[3200,6200,6500,7000,12000].includes(t.ms));assert(pending);childTimers.delete(pending[0]);pending[1].fn();};
   node('paced').click();assert(!lines[1].classList.contains('hidden-phrase'));
   // The timer fallback must not reveal an extra phrase once transitionend opened the gate.
   [...childTimers.values()].find(t=>t.ms===20100).fn();assert(lines[2].classList.contains('hidden-phrase'));
   for(let i=2;i<lines.length;i++){runReading();assert(!lines[i].classList.contains('hidden-phrase'));}
   runReading();assert.equal(node('paced').textContent,'Volver a leer');assert.equal(node('signature').hidden,false);
   assert.equal(node('continueAna').hidden,false);node('continueAna').click();assert.equal(messages.at(-1).type,'ana');
   node('paced').click();assert.equal(node('poem').hidden,true);assert.equal(node('paced').disabled,true);
   assert(!node('celestialScene').classList.contains('is-home'));assert(!node('worldComet').classList.contains('is-active'));
   [...childTimers.values()].find(t=>t.ms===300).fn();
   [...childTimers.values()].find(t=>t.ms===20100).fn();
   assert.equal(node('poem').hidden,false,'The timer fallback opens the gate if transitionend is unavailable');
   assert(lines.slice(1).every(l=>l.classList.contains('hidden-phrase')));
  }else if(piece==='epilogo'){
   node('full').click();assert(lines.every(l=>l.classList.contains('hidden-phrase')),'Full reading cannot bypass the entry fade');
   [...childTimers.values()].find(t=>t.ms===7200).fn();
   assert.equal(node('poem').hidden,false);assert.equal(node('paced').disabled,false);
   assert(!lines[0].classList.contains('hidden-phrase'));assert(lines[1].classList.contains('hidden-phrase'));
   node('paced').click();assert.equal(node('paced').textContent,'Continuar');
   node('full').click();assert(lines.every(l=>!l.classList.contains('hidden-phrase')));assert.equal(node('signature').hidden,false);
  }else{
   node('paced').click();assert(!lines[0].classList.contains('hidden-line'));assert(lines[1].classList.contains('hidden-line'));
   node('paced').click();assert.equal(node('paced').textContent,'Continuar');
   node('full').click();assert(lines.every(l=>!l.classList.contains('hidden-line')));
  }
  node('backAna').click();assert.equal(messages.at(-1).type,'home');
 }
 // The main entry now opens the prologue before the spoken name or elegy.
 const musicCalls=get('voiceMusic').playCalls;
 get('entryButton').click();await flush();
 assert.equal(get('cenicientoFrame').hidden,false);
 assert(get('cenicientoFrame').src.includes('../estrella/?music=parent'));
 assert(get('cenicientoFrame').src.includes('&prologue=1'));
 assert.equal(get('cenicientoFrame').getAttribute('title'),'Prólogo de Ana Klaudya');
 assert.equal(get('nameAudio').paused,true,'The spoken name waits for the prologue');
 assert.equal(get('voiceMusic').currentTime,47.5);assert.equal(get('voiceMusic').playCalls,musicCalls);
 assert(![...timers.values()].some(t=>t.ms===2410),'No name timer runs behind the prologue');
 for(const fn of windowEvents.message)fn({origin:context.window.location.origin,source:get('cenicientoFrame').contentWindow,data:{channel:'ceniciento-music-v1',type:'ana'}});
 const transition=[...timers.entries()].find(([,t])=>t.ms===7100);assert(transition);
 timers.delete(transition[0]);transition[1].fn();
 assert.equal(get('cenicientoFrame').hidden,true);assert.equal(get('anaNavigation').hidden,true);
 assert(get('body').classList.contains('prelude'));
 assert.equal(get('voiceMusic').currentTime,47.5);assert.equal(get('voiceMusic').playCalls,musicCalls);
 const spokenName=[...timers.entries()].find(([,t])=>t.ms===2410);assert(spokenName);spokenName[1].fn();await flush();
 assert.equal(get('nameAudio').paused,false,'The name begins only after the prologue fades away');
 const anaReading=[...timers.entries()].find(([,t])=>t.ms===14000);assert(anaReading);anaReading[1].fn();
 assert(get('body').classList.contains('reading-ready'));
 get('entryButton').click();await flush();assert.equal(get('cenicientoFrame').hidden,true,'Returning to Ana does not force another prologue');
 get('readEpilogue').click();await flush();assert(get('cenicientoFrame').src.includes('../epilogo/?music=parent'));
 assert.equal(get('voiceMusic').currentTime,47.5);assert.equal(get('voiceMusic').playCalls,musicCalls);
 console.log('PASS: prologue → Ana → epilogue; four routes, uninterrupted music, lunar gate, verse sentences, pause, replay and return');
})().catch(error=>{console.error(error);process.exit(1);});
