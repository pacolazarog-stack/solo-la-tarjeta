const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(process.argv[2]||__dirname+'/index.html','utf8');
const script=source.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes=new Map(),timers=new Map(),events={};let sequence=0,reduced=false;
class Element{
 constructor(id){this.id=id;this.handlers={};this.paused=true;this.currentTime=0;this.value=id==='musicLevel'?'80':'';this.checked=id==='musicEnabled';this.hidden=id==='cenicientoFrame';this.style={setProperty(){}};const classes=new Set();this.classList={add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},contains:v=>classes.has(v),toggle(v,on){if(on)classes.add(v);else classes.delete(v);}};}
 addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
 emit(type,data={}){for(const fn of this.handlers[type]??[])fn(data);}
 click(){this.emit('click',{button:0,preventDefault(){}});}
 setAttribute(k,v){this[k]=v;}
 getAttribute(k){return this[k]??null;}
 removeAttribute(k){delete this[k];}
 getBoundingClientRect(){return{top:10000,bottom:10100};}
 play(){this.playCalls=(this.playCalls||0)+1;this.paused=false;return Promise.resolve();}
 pause(){this.paused=true;}
 show(){this.open=true;}
 close(){this.open=false;this.emit('close');}
}
const get=id=>{if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);};
const root=get('root'),frame=get('cenicientoFrame'),body=get('body'),nav=get('anaNavigation');
root.scrollHeight=2000;frame.contentWindow={postMessage(){}};
const location={origin:'https://example.test',pathname:'/elegia-breve/',search:'',hash:''};
const fire=type=>{for(const fn of events[type]??[])fn();};
const context={document:{documentElement:root,body,getElementById:get,querySelectorAll(){return[get('finalHeat')];}},window:{location,innerHeight:640,scrollY:0,matchMedia:()=>({matches:reduced}),history:{pushState(s,t,hash){location.hash=hash;},replaceState(){location.hash='';}},addEventListener(type,fn){(events[type]??=[]).push(fn);},scrollTo(){}},URLSearchParams,Math,Promise,Float32Array,requestAnimationFrame(){return 1;},cancelAnimationFrame(){},setTimeout(fn,ms){const id=++sequence;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
const message=(type,origin=location.origin)=>{for(const fn of events.message)fn({origin,source:frame.contentWindow,data:{channel:'ceniciento-music-v1',type}});};
const run=ms=>{const match=[...timers].find(([,t])=>t.ms===ms);assert(match,'Missing timer '+ms);timers.delete(match[0]);match[1].fn();};
const route=(piece,type='popstate')=>{location.hash=piece?'#'+piece:'';fire(type);};
const assertPiece=piece=>{assert.equal(frame.hidden,false);assert.equal(get('poemBackdrop').hidden,false,'Ana is covered throughout navigation between pieces');assert(!get('poemBackdrop').classList.contains('is-leaving'),'No fading cover can expose Ana during a child route');assert(frame.src.includes('../'+piece+'/?music=parent'));assert.equal(location.hash,'#'+piece);};
vm.runInNewContext(script,context);

get('anaPortrait').complete=true;get('anaPortrait').naturalWidth=1228;
get('anaRead').click();
assert(!get('finalHeat').classList.contains('is-shown'),'The closing verses wait until reached');
get('finalHeat').getBoundingClientRect=()=>({top:-300,bottom:-200});
get('anaRead').click();
assert(get('finalHeat').classList.contains('is-shown'),'Jumping past the last line still reveals el');
assert(!get('finalHeat').classList.contains('show-calor'),'calor has its own pause');
run(4500);assert(get('finalHeat').classList.contains('show-calor'));
get('recording').emit('ended');
assert(!body.classList.contains('portrait-revealed'),'The photograph cannot hide the closing verses immediately');
run(4000);assert(body.classList.contains('portrait-revealed'));
get('finalHeat').getBoundingClientRect=()=>({top:10000,bottom:10100});
get('anaRead').click();get('recording').emit('ended');
const pending=[...timers.values()].find(t=>t.ms===8500).fn;
get('anaCabello').click();
assert(![...timers.values()].some(t=>t.ms===8500),'Navigating away cancels the pending photograph');
pending();assert(!body.classList.contains('portrait-revealed'),'An obsolete callback cannot cover another poem');
console.log('PASS: final scroll jump, el/calor pause, photograph delay, replay reset and cancellation');
