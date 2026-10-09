const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const nodes=new Map(),frames=new Map(),timers=new Map(),messages=[],openingMessages=[];let id=0;
class Node{
 constructor(){this.handlers={};this.style={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
 setAttribute(name,value){this[name]=value;}
 removeAttribute(name){delete this[name];}
 addEventListener(event,fn){this.handlers[event]=fn;}
 fire(event,data){this.handlers[event]?.(data);}
}
const shots=Array.from({length:6},()=>new Node()),doc=new Node(),win=new Node();
doc.querySelectorAll=()=>shots;doc.getElementById=key=>{if(!nodes.has(key)){const node=new Node();if(key==='epilogueOpening')node.contentWindow={postMessage:data=>openingMessages.push(data)};nodes.set(key,node)}return nodes.get(key)};
doc.hidden=false;win.matchMedia=()=>({matches:false});win.parent={postMessage:data=>messages.push(data)};
const images=[],origin='https://example.test';
const context={document:doc,window:win,location:{origin,search:'?music=parent'},URLSearchParams,Image:function(){const image=new Node();images.push(image);return image;},requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(key){frames.delete(key);},setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(key){timers.delete(key);}};
vm.runInNewContext(source.match(/<script>\s*const shots=[\s\S]*?<\/script>/)[0].replace(/^<script>|<\/script>$/g,''),context);
const step=time=>{const [key,fn]=[...frames][0];frames.delete(key);fn(time);};
const active=()=>shots.findIndex(shot=>shot.classes.has('active'));
images[0].fire('load');assert.equal(timers.size,0,'Wait for the new planet before starting');images[1].fire('load');assert.equal(timers.size,0,'Wait for the onion before starting');images[2].fire('load');assert([...timers.values()].some(t=>t.ms===850));
nodes.get('pause').fire('click');assert.equal(timers.size,0,'Pause cancels the pending intro');
assert.equal(frames.size,0);nodes.get('pause').fire('click');
step(1000);assert.equal(active(),0);
step(3800);assert.equal(active(),1);
nodes.get('pause').fire('click');assert.equal(frames.size,0);
nodes.get('pause').fire('click');step(20000);assert.equal(active(),1);
step(21800);assert.equal(active(),2);
doc.hidden=true;step(24000);assert.equal(active(),2);
doc.hidden=false;doc.fire('visibilitychange');step(30000);assert.equal(active(),2);
step(31700);assert.equal(active(),3);
step(34700);assert.equal(active(),4);
step(37400);assert.equal(active(),4);
step(38700);assert.equal(active(),5);
step(41300);assert.equal(frames.size,1,'The final image remains for the opening verses');
assert.equal(messages.filter(m=>m.type==='interlude-ended').length,0);
const levels=()=>Array.from(openingMessages.filter(m=>m.type==='progress').at(-1).levels);
const fire=()=>openingMessages.filter(m=>m.type==='progress').at(-1).ignition;
assert.deepEqual(levels(),[0,0]);
step(42400);assert.deepEqual(levels(),[0,0]);
step(44000);assert.deepEqual(levels(),[1,0]);
assert.equal(Number(shots[5].style.opacity),1,'The first verse is printed over the onion and bread');
step(49400);assert.deepEqual(levels(),[1,0]);
step(51000);assert.deepEqual(levels(),[1,1]);
assert.equal(fire(),0,'Both verses remain black before ignition');
nodes.get('pause').fire('click');assert.equal(frames.size,0,'The two verses can be held together');
nodes.get('pause').fire('click');step(51000);
step(53400);assert.equal(fire(),0);
step(56400);assert.equal(Number(shots[5].style.opacity),1);assert.equal(fire(),.5,'Letters ignite while the photograph is still present');
step(58400);assert.equal(Number(shots[5].style.opacity),1);
step(59400);assert.equal(fire(),1);assert.equal(frames.size,1);
step(60900);assert.equal(Number(shots[5].style.opacity),.5);assert.equal(Number(nodes.get('epilogueOpening').style.opacity),1,'Letters stay lit while only the background fades');
step(63400);assert.equal(frames.size,0);assert.equal(Number(shots[5].style.opacity),0);assert.deepEqual(levels(),[1,1]);assert.equal(fire(),1);
const completion=messages.filter(m=>m.type==='interlude-ended');assert.equal(completion.length,1);assert.equal(completion[0].openingShown,true);
nodes.get('replay').fire('click');assert.deepEqual(levels(),[0,0]);step(50000);assert.equal(active(),0);
step(50600);assert.equal(Number(shots[0].style.opacity),1);
step(52710);assert(shots.every(shot=>Number(shot.style.opacity)===0),'Previous shot is fully dark before the next cue');
step(52800);assert.equal(active(),1);assert(shots.every(shot=>Number(shot.style.opacity)===0),'No image overlaps the cut through darkness');
step(53000);assert(Number(shots[1].style.opacity)>0);assert.equal(Number(shots[0].style.opacity),0);
step(60700);assert.equal(Number(shots[4].style.opacity),1);assert.equal(Number(shots[5].style.opacity),0);step(63300);assert.equal(Number(shots[4].style.opacity),1,'World remains opaque under the dissolve');assert.equal(Number(shots[5].style.opacity),0.5,'Onion appears without darkening the world');assert.equal(nodes.get('moonBridge').transform,'translate(-27 131)','The moon lands on the bread position');step(65900);assert.equal(Number(shots[4].style.opacity),0);assert.equal(Number(shots[5].style.opacity),1);
win.fire('pagehide');assert.equal(frames.size,0);
assert.equal((source.match(/href="mundo-flores.png"/g)||[]).length,4);
assert.equal((source.match(/clipPathUnits="userSpaceOnUse"/g)||[]).length,7,'Every shot clips the artwork at its own image bounds');
assert(!source.includes('<header>'),'No signature over the film');
assert(source.includes('aria-label="Volver a ver"'),'Icon controls keep their accessible names');
assert(!/<audio|\.play\(/.test(source),'Music stays in the parent player');
assert(source.includes('const fadeIn=[600,260,100,380,450,500]'));
assert(source.includes('const outgoing=(until-90)/fadeOut[index]'));
assert(source.includes('viewBox="15 541 487 322"'), 'The caption scene excludes layout and timing labels');
assert.equal(images[2].src,'cebolla-pan.png');assert(source.includes('matrix(1.24 0 0 1.32 -260 -190)'),'The onion is matched to the world silhouette');assert.equal(images[0].src,'mundo-flores.png');assert.equal(images[1].src,'mundo-flores-yin-yang.png');assert.equal((source.match(/href="mundo-flores-yin-yang.png"/g)||[]).length,2);
assert(source.includes('clip-path:inset(50%)'), 'Title is available to screen readers without staying on screen');
assert(source.includes('morphStart=10700,morphEnd=15900'));assert(source.includes('openingStarts=[17000,24000]'),'The verses enter seven seconds apart');
assert(source.includes('id="worldWithoutMoon"'),'The moon moves independently of the world');
assert(source.includes('opening=preview'),'Opening uses the real epilogue layout and typography');
assert(!source.includes('opening-lines'),'No independently positioned or styled text overlay');
const previousMessages=openingMessages.length,state={channel:'ceniciento-music-v1',type:'state',playing:true,level:.8,enabled:true};
win.fire('message',{origin:'https://other.test',source:win.parent,data:state});assert.equal(openingMessages.length,previousMessages);
win.fire('message',{origin,source:{},data:state});assert.equal(openingMessages.length,previousMessages);
win.fire('message',{origin,source:win.parent,data:state});assert.equal(openingMessages.at(-1),state,'Preview inherits the exact music-control state and layout');
console.log('PASS: matched world/onion dissolve, black opening verses, gradual ignition, lit text through a five-second background fade, pause/resume, hidden tab pause, replay and continuation');
