const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const nodes=new Map(),frames=new Map(),timers=new Map(),messages=[];let id=0;
class Node{
 constructor(){this.handlers={};this.style={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
 addEventListener(event,fn){this.handlers[event]=fn;}
 fire(event){this.handlers[event]?.();}
}
const shots=Array.from({length:6},()=>new Node()),doc=new Node(),win=new Node();
doc.querySelectorAll=()=>shots;doc.getElementById=key=>{if(!nodes.has(key))nodes.set(key,new Node());return nodes.get(key)};
doc.hidden=false;win.matchMedia=()=>({matches:false});win.parent={postMessage:data=>messages.push(data)};
const image=new Node(),origin='https://example.test';
const context={document:doc,window:win,location:{origin,search:'?music=parent'},URLSearchParams,Image:function(){return image;},requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(key){frames.delete(key);},setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(key){timers.delete(key);}};
vm.runInNewContext(source.match(/<script>\s*const shots=[\s\S]*?<\/script>/)[0].replace(/^<script>|<\/script>$/g,''),context);
const step=time=>{const [key,fn]=[...frames][0];frames.delete(key);fn(time);};
const active=()=>shots.findIndex(shot=>shot.classes.has('active'));
image.fire('load');assert([...timers.values()].some(t=>t.ms===850));
nodes.get('pause').fire('click');assert.equal(timers.size,0,'Pause cancels the pending intro');
assert.equal(frames.size,0);nodes.get('pause').fire('click');
step(1000);assert.equal(active(),0);
step(4600);assert.equal(active(),1);
nodes.get('pause').fire('click');assert.equal(frames.size,0);
nodes.get('pause').fire('click');step(20000);assert.equal(active(),1);
step(21400);assert.equal(active(),2);
doc.hidden=true;step(24000);assert.equal(active(),2);
doc.hidden=false;doc.fire('visibilitychange');step(30000);assert.equal(active(),2);
step(30800);assert.equal(active(),3);
step(34600);assert.equal(active(),4);
step(37000);assert.equal(active(),5);
step(40000);assert.equal(frames.size,0);
assert.equal(messages.filter(m=>m.type==='interlude-ended').length,1);
nodes.get('replay').fire('click');step(50000);assert.equal(active(),0);
step(50600);assert.equal(Number(shots[0].style.opacity),1);
step(53510);assert(shots.every(shot=>Number(shot.style.opacity)===0),'Previous shot is fully dark before the next cue');
step(53600);assert.equal(active(),1);assert(shots.every(shot=>Number(shot.style.opacity)===0),'No image overlaps the cut through darkness');
step(53800);assert(Number(shots[1].style.opacity)>0);assert.equal(Number(shots[0].style.opacity),0);
win.fire('pagehide');assert.equal(frames.size,0);
assert.equal((source.match(/href="storyboard.png"/g)||[]).length,6);
assert(!/<audio|\.play\(/.test(source),'Music stays in the parent player');
assert(source.includes('const fadeIn=[600,260,100,380,450,500]'));
assert(source.includes('const outgoing=(until-90)/fadeOut[index]'));
assert(source.includes('viewBox="18 622 483 197"'), 'The reaction shot excludes the face');
assert(source.includes('clip-path:inset(50%)'), 'Title is available to screen readers without staying on screen');
console.log('PASS: six cues over 15 seconds, fades through darkness, pause/resume, hidden tab pause, replay, cleanup and one guarded completion message');
