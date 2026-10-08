const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const nodes=new Map(),frames=new Map(),timers=new Map(),messages=[];let id=0;
class Node{
 constructor(){this.handlers={};this.style={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
 setAttribute(name,value){this[name]=value;}
 addEventListener(event,fn){this.handlers[event]=fn;}
 fire(event){this.handlers[event]?.();}
}
const shots=Array.from({length:6},()=>new Node()),doc=new Node(),win=new Node();
doc.querySelectorAll=()=>shots;doc.getElementById=key=>{if(!nodes.has(key))nodes.set(key,new Node());return nodes.get(key)};
doc.hidden=false;win.matchMedia=()=>({matches:false});win.parent={postMessage:data=>messages.push(data)};
const images=[],origin='https://example.test';
const context={document:doc,window:win,location:{origin,search:'?music=parent'},URLSearchParams,Image:function(){const image=new Node();images.push(image);return image;},requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(key){frames.delete(key);},setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(key){timers.delete(key);}};
vm.runInNewContext(source.match(/<script>\s*const shots=[\s\S]*?<\/script>/)[0].replace(/^<script>|<\/script>$/g,''),context);
const step=time=>{const [key,fn]=[...frames][0];frames.delete(key);fn(time);};
const active=()=>shots.findIndex(shot=>shot.classes.has('active'));
images[0].fire('load');assert.equal(timers.size,0,'Wait for the new planet before starting');images[1].fire('load');assert([...timers.values()].some(t=>t.ms===850));
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
step(37400);assert.equal(active(),5);
step(40400);assert.equal(frames.size,0);
assert.equal(messages.filter(m=>m.type==='interlude-ended').length,1);
nodes.get('replay').fire('click');step(50000);assert.equal(active(),0);
step(50600);assert.equal(Number(shots[0].style.opacity),1);
step(52710);assert(shots.every(shot=>Number(shot.style.opacity)===0),'Previous shot is fully dark before the next cue');
step(52800);assert.equal(active(),1);assert(shots.every(shot=>Number(shot.style.opacity)===0),'No image overlaps the cut through darkness');
step(53000);assert(Number(shots[1].style.opacity)>0);assert.equal(Number(shots[0].style.opacity),0);
win.fire('pagehide');assert.equal(frames.size,0);
assert.equal((source.match(/href="mundo-flores.png"/g)||[]).length,5);
assert.equal((source.match(/clipPathUnits="userSpaceOnUse"/g)||[]).length,6,'Every shot clips the artwork at its own image bounds');
assert(!source.includes('<header>'),'No signature over the film');
assert(source.includes('aria-label="Volver a ver"'),'Icon controls keep their accessible names');
assert(!/<audio|\.play\(/.test(source),'Music stays in the parent player');
assert(source.includes('const fadeIn=[600,260,100,380,450,500]'));
assert(source.includes('const outgoing=(until-90)/fadeOut[index]'));
assert(source.includes('viewBox="15 541 487 322"'), 'The caption scene excludes layout and timing labels');
assert.equal(images[0].src,'mundo-flores.png');assert.equal(images[1].src,'mundo-flores-yin-yang.png');assert.equal((source.match(/href="mundo-flores-yin-yang.png"/g)||[]).length,1);
assert(source.includes('clip-path:inset(50%)'), 'Title is available to screen readers without staying on screen');
console.log('PASS: six cues over 15 seconds, fades through darkness, pause/resume, hidden tab pause, replay, cleanup and one guarded completion message');
