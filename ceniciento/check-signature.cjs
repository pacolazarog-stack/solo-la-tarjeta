const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const script=[...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
assert.equal((source.match(/>flag</g)||[]).length,1,'Only the final signature exists');
assert(!/Ceniciento · flag|cuento · flag|flag · 2026/.test(source));
const nodes=new Map(),listeners={},timers=new Map();let id=0;
class Element{
 constructor(){this.hidden=true;this.children=[];this.events={};this.paused=true;this.currentTime=0;this.duration=864.156735;this.style={setProperty(){}};const classes=new Set();this.classList={add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)};this.parentElement=null;}
 appendChild(child){if(child.parentElement)child.parentElement.children=child.parentElement.children.filter(x=>x!==child);this.children.push(child);child.parentElement=this;}
 addEventListener(k,fn){this.events[k]=fn} removeAttribute(){}
 pause(){this.paused=true} play(){this.paused=false;return Promise.resolve()}
 load(){queueMicrotask(()=>this.onloadedmetadata?.())}
}
const get=k=>{if(!nodes.has(k)){const el=new Element();el.value=k==='cenMusicLevel'?'80':'';el.checked=k==='cenMusicEnabled';nodes.set(k,el)}return nodes.get(k)};
const karaoke=new Element();karaoke.appendChild(get('current'));karaoke.appendChild(get('storySignature'));
const doc={body:new Element(),documentElement:new Element(),getElementById:get,createElement:()=>new Element(),querySelector:()=>new Element()};
const parent={postMessage(){}};
const context={document:doc,window:{location:{origin:'https://example.test',search:'?music=parent'},parent,addEventListener(){}},URLSearchParams,Image:class{set src(v){queueMicrotask(()=>this.onload())}},fetch:async()=>({ok:true,text:async()=>'# CENICIENTO\n\nPaco miró el reloj antes de sentarse.\n\nAl hombre que era.'}),setTimeout(fn,ms){timers.set(++id,{fn,ms});return id},clearTimeout:k=>timers.delete(k),requestAnimationFrame:()=>1,cancelAnimationFrame(){},performance:{now:()=>0},scrollTo(){},innerHeight:800,scrollY:0,matchMedia:()=>({matches:false}),addEventListener(k,fn){listeners[k]=fn}};
vm.runInNewContext(script,context);
(async()=>{
 for(let i=0;i<15;i++)await Promise.resolve();
 const signature=get('storySignature');assert(signature.hidden,'No signature on the entry screen');
 get('read').onclick();assert.equal(signature.parentElement,get('readerText'));assert.equal(signature.hidden,false);
 assert.equal(get('readerText').children.at(-1),signature,'Reading signature follows the final paragraph');
 get('modeSwitch').onclick();assert.equal(signature.hidden,true);
 get('listen').onclick();assert.equal(signature.parentElement,karaoke);assert.equal(signature.hidden,true);
 get('narrator').currentTime=864.156735;get('narrator').events.timeupdate();assert.equal(signature.hidden,false,'Final voice cue reveals the signature');
 get('narrator').currentTime=30;get('narrator').events.timeupdate();assert.equal(signature.hidden,true,'Seeking backwards removes the final signature');
 get('modeSwitch').onclick();assert.equal(signature.hidden,true);
 for(const path of ['../ana-klaudya/acerca/index.html','../ana-klaudya-festival/index.html']){
  const credits=fs.readFileSync(__dirname+'/'+path,'utf8');
  for(const tool of ['Suno','ChatGPT','Gemini','Copilot'])assert(credits.includes(tool),'Credit missing: '+tool);
 }
 console.log('PASS: one signature, entry hidden, final reading/voice placement, mode changes, backwards seeking and declared tool credits');
})().catch(e=>{console.error(e);process.exitCode=1});
