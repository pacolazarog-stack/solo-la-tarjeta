const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const nodes=new Map(),frames=new Map(),timers=new Map(),messages=[];let id=0;
class Node{
 constructor(){this.handlers={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
 addEventListener(event,fn){this.handlers[event]=fn;}
 fire(event){this.handlers[event]?.();}
}
const shots=Array.from({length:6},()=>new Node()),doc=new Node(),win=new Node();
doc.querySelectorAll=()=>shots;doc.getElementById=key=>{if(!nodes.has(key))nodes.set(key,new Node());return nodes.get(key)};
doc.hidden=false;win.parent={postMessage:data=>messages.push(data)};
const image=new Node(),origin='https://example.test';
const context={document:doc,window:win,location:{origin,search:'?music=parent'},URLSearchParams,Image:function(){return image;},requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(key){frames.delete(key);},setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(key){timers.delete(key);}};
vm.runInNewContext(source.match(/<script>\s*const shots=[\s\S]*?<\/script>/)[0].replace(/^<script>|<\/script>$/g,''),context);
const step=time=>{const [key,fn]=[...frames][0];frames.delete(key);fn(time);};
const active=()=>shots.findIndex(shot=>shot.classes.has('active'));
image.fire('load');const intro=[...timers.values()].find(t=>t.ms===850);assert(intro);intro.fn();
step(1000);assert.equal(active(),0);
step(3500);assert.equal(active(),1);
nodes.get('pause').fire('click');assert.equal(frames.size,0);
nodes.get('pause').fire('click');step(20000);assert.equal(active(),1);
step(22500);assert.equal(active(),2);
doc.hidden=true;step(24000);assert.equal(active(),2);
doc.hidden=false;doc.fire('visibilitychange');step(30000);assert.equal(active(),2);
step(32000);assert.equal(active(),3);
step(35000);assert.equal(active(),4);
step(37500);assert.equal(active(),5);
step(40000);assert.equal(frames.size,0);
assert.equal(messages.filter(m=>m.type==='interlude-ended').length,1);
nodes.get('replay').fire('click');step(50000);assert.equal(active(),0);
win.fire('pagehide');assert.equal(frames.size,0);
assert.equal((source.match(/href="storyboard.png"/g)||[]).length,6);
assert(!/<audio|\.play\(/.test(source),'Music stays in the parent player');
assert(source.includes('transition:opacity .5s ease-in-out'));
console.log('PASS: six cues over 15 seconds, brief fades, pause/resume, hidden tab pause, replay, cleanup and one guarded completion message');
