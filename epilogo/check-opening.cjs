const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const script=[...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
class Element{
 constructor(){this.hidden=true;this.handlers={};this.attrs={};this.classes=new Set(['hidden-phrase']);this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c)};}
 setAttribute(k,v){this.attrs[k]=v} removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,fn){this.handlers[k]=fn} click(){this.handlers.click?.({preventDefault(){}})}
}
function scenario(continuing){
 const nodes=new Map(),timers=new Map(),messages=[];let id=0;
 const get=k=>{if(!nodes.has(k))nodes.set(k,new Element());return nodes.get(k)};
 const phrases=[...source.matchAll(/<p class="phrase[^>]*data-wait="(\d+)"/g)].map(m=>{const el=new Element();el.dataset={wait:m[1]};return el});
 const parent={postMessage:m=>messages.push(m)};
 const context={document:{getElementById:get,querySelector:()=>new Element(),querySelectorAll:()=>phrases},window:{parent,addEventListener(){}},location:{origin:'https://example.test',search:'?music=parent'+(continuing?'&opening=seen':'')},URLSearchParams,requestAnimationFrame:()=>1,setTimeout(fn,ms){timers.set(++id,{fn,ms});return id},clearTimeout:key=>timers.delete(key)};
 vm.runInNewContext(script,context);
 assert(!phrases[0].classes.has('hidden-phrase'),'Opening remains readable in the poem');
 assert.equal(phrases[1].classes.has('hidden-phrase'),!continuing);
 assert.equal([...timers.values()][0].ms,continuing?3200:4800,'Continue at the next phrase, without replaying the onion opening');
 assert(!messages.some(m=>m.type==='start'),'The shared music is never restarted at the handoff');
 get('full').click();assert.equal(timers.size,0);assert.equal(get('flowerCoda').hidden,false);
 get('paced').click();assert.equal([...timers.values()][0].ms,4800,'A deliberate replay restores the opening');
 assert(phrases[1].classes.has('hidden-phrase'));assert.equal(get('flowerCoda').hidden,true);
}
scenario(false);scenario(true);
assert(/filter 7\.5s/.test(fs.readFileSync(__dirname+'/../piel/index.html','utf8')));
console.log('PASS: direct entry, interlude continuation, opening retained on page, no duplicate timing or music restart, replay and 7.5-second skin clarity');
