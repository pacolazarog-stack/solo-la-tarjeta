// Comprueba el cierre desnudo de EL ESPEJO ejecutando el módulo con un DOM mínimo y reloj simulado.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const file=path.join(process.argv[2]||__dirname,'ceniciento','el-espejo.js');
const src=fs.readFileSync(file,'utf8');
for(const dead of ['Reinicio','Salir','mirror-finale-nav','mirror-finale-card','mirror-finale-question','returnToEntrySource'])
  assert(!src.includes(dead),`El cierre ya no contiene «${dead}»`);
assert.equal((src.match(/flag/g)||[]).filter(()=>true).length>0,true);
assert.equal((src.match(/flag\.textContent='flag'/g)||[]).length,1,'«flag» aparece una sola vez como texto');

let now=0;const timers=[];let nextId=1;
const fakeSetTimeout=(fn,ms)=>{const id=nextId++;timers.push({id,at:now+ms,fn});return id};
const fakeClear=id=>{const i=timers.findIndex(t=>t.id===id);if(i>=0)timers.splice(i,1)};
function advance(ms){const end=now+ms;for(;;){timers.sort((a,b)=>a.at-b.at);const t=timers[0];if(!t||t.at>end)break;timers.shift();now=t.at;t.fn();}now=end;}

function el(tag){const e={tag,children:[],dataset:{},style:{},attrs:{},listeners:{},hidden:false,
  classList:{s:new Set(),add(...c){c.forEach(x=>this.s.add(x))},remove(...c){c.forEach(x=>this.s.delete(x))},contains(c){return this.s.has(c)},toggle(c,f){f?this.s.add(c):this.s.delete(c)}},
  append(...n){n.forEach(x=>{if(typeof x!=='string')e.children.push(x)})},appendChild(n){e.children.push(n);return n},
  setAttribute(k,v){e.attrs[k]=v},addEventListener(t,f){(e.listeners[t]=e.listeners[t]||[]).push(f)},
  querySelector(sel){const want=sel.replace(/^[.#]/,'');const walk=n=>{for(const c of n.children){if(!c.classList)continue;if(c.className.split(' ').includes(want)||c.classList.s.has(want)||c.id===want)return c;const r=walk(c);if(r)return r}return null};return walk(e)},
  querySelectorAll(sel){const want=sel.replace(/^[.#]/,'');const out=[];const walk=n=>{for(const c of n.children){if(!c.classList)continue;if(c.className.split(' ').includes(want)||c.classList.s.has(want))out.push(c);walk(c)}};walk(e);return out},
  closest(){return null},focus(){},scrollTo(){},remove(){},unobserve(){},offsetTop:0,scrollTop:0,scrollHeight:1000,clientHeight:500,className:'',textContent:'',
  createTextNode(){return{}}};
  Object.defineProperty(e,'className',{get(){return e._c||''},set(v){e._c=v}});return e}
const mirror=el('main');mirror.id='mirror';
const body=el('body'),head=el('head');
let navigatedTo=null,mirrorEndFired=false;const wl={};
const observers=[];
const win={location:{href:'',pathname:'/solo-la-tarjeta/ceniciento/',origin:'https://x'},
  addEventListener(t,f){(wl[t]=wl[t]||[]).push(f)},dispatchEvent(ev){if(ev.type==='oras:mirror-end')mirrorEndFired=true;(wl[ev.type]||[]).forEach(f=>f(ev))},
  history:{length:3,back(){},go(){}}};
win.top=win;Object.defineProperty(win.location,'href',{get(){return ''},set(v){navigatedTo=v}});
const doc={getElementById:id=>id==='mirror'?mirror:null,createElement:el,body,head,documentElement:el('html'),
  createTextNode:()=>({}),addEventListener(){}};
const ctx={document:doc,window:win,addEventListener:win.addEventListener,dispatchEvent:win.dispatchEvent.bind(win),history:win.history,location:Object.assign(win.location,{search:''}),
  setTimeout:fakeSetTimeout,clearTimeout:fakeClear,requestAnimationFrame:f=>f(),CustomEvent:class{constructor(t,o){this.type=t;this.detail=o?.detail}},
  URLSearchParams,IntersectionObserver:class{constructor(cb){this.cb=cb;observers.push(this)}observe(){}unobserve(){}disconnect(){}},
  MutationObserver:class{observe(){}disconnect(){}},sessionStorage:{getItem(){return null}},localStorage:{getItem(){return null},setItem(){}},URL,console};
vm.createContext(ctx);vm.runInContext(src,ctx);

// Arranque explícito y llegada al final de la escena 32.
win.dispatchEvent(new ctx.CustomEvent('oras:mirror-start',{detail:{explicit:true}}));
assert(body.classList.contains('mirror'),'EL ESPEJO arranca');
const sentinelObserver=observers.find(o=>o.cb.toString().includes('armMirrorFinalGate'));
sentinelObserver.cb([{isIntersecting:true}]);
advance(9990);const follow=mirror.querySelectorAll('mirror-final-continue')[0];
assert(follow&&follow.hidden===true,'El último Seguir sigue sin aparecer antes de 10 s');
advance(20);assert(follow.hidden===false,'El último Seguir aparece a los 10 s');
follow.listeners.click[0]();

// Fundido de la escena 32 y entrada en el negro.
assert.equal(mirror.style.opacity,'0','La escena 32 se funde');
const finale=body.children.find(c=>c.className==='mirror-flag-finale');
assert.equal(finale.children.length,1,'La pantalla final contiene únicamente «flag»: sin Atrás, Adelante, Reinicio, Salir, tarjeta ni «?»');
advance(1900);assert(body.classList.contains('mirror-finale-active')&&!finale.hidden,'Entra la pantalla final');
advance(4900);assert(!finale.classList.contains('show-flag'),'Negro total durante 5 s: aún sin flag');
advance(200);assert(finale.classList.contains('show-flag'),'flag aparece tras el negro');
advance(4200);assert(!finale.classList.contains('flag-dissolve'),'flag permanece 4,5 s');
advance(400);assert(finale.classList.contains('flag-dissolve'),'flag se disuelve');
assert.equal(navigatedTo,null,'Aún no se ha salido');
advance(5000);
assert(mirrorEndFired,'Se emite oras:mirror-end (reinicio del ciclo de lecturas)');
assert.equal(navigatedTo,'/solo-la-tarjeta/elegia-breve/','Regreso automático al universo, sin mensajes');
console.log('PASS: cierre desnudo de EL ESPEJO (fundido, negro, flag, disolución, regreso y reinicio de ciclo)');
