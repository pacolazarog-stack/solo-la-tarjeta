const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const script=[...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
class Element{
 constructor(){this.hidden=true;this.handlers={};this.attrs={};this.style={setProperty(k,v){this[k]=v}};this.classes=new Set(['hidden-phrase']);this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c)};}
 setAttribute(k,v){this.attrs[k]=v} removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,fn){this.handlers[k]=fn} click(){this.handlers.click?.({preventDefault(){}})}
}
function scenario(openingMode){
 const continuing=openingMode==='seen',preview=openingMode==='preview';
 const nodes=new Map(),timers=new Map(),messages=[],handlers=[];let id=0;
 const get=k=>{if(!nodes.has(k))nodes.set(k,new Element());return nodes.get(k)};
 const phrases=[...source.matchAll(/<p class="phrase[^>]*data-wait="(\d+)"/g)].map(m=>{const el=new Element();el.dataset={wait:m[1]};return el});
 const parent={postMessage:m=>messages.push(m)};
 const context={document:{body:new Element(),getElementById:get,querySelector:()=>new Element(),querySelectorAll:()=>phrases},window:{parent,addEventListener(type,fn){if(type==='message')handlers.push(fn)}},location:{origin:'https://example.test',search:'?music=parent'+(openingMode?'&opening='+openingMode:'')},URLSearchParams,requestAnimationFrame:()=>1,setTimeout(fn,ms){timers.set(++id,{fn,ms});return id},clearTimeout:key=>timers.delete(key)};
 vm.runInNewContext(script,context);
 assert(!phrases[0].classes.has('hidden-phrase'),'Opening remains readable in the poem');
 if(preview){
  assert.equal(timers.size,0,'Preview never advances the poem behind the interlude');
  assert(context.document.body.classes.has('opening-preview'));
  assert.deepEqual([get('openingFirst').style?.opacity,get('openingSecond').style?.opacity],['0','0']);
  const emit=(origin,sender,levels,ignition=0)=>handlers.forEach(fn=>fn({origin,source:sender,data:{channel:'ana-opening-v1',type:'progress',levels,ignition}}));
  emit('https://other.test',parent,[1,1]);assert.equal(get('openingFirst').style.opacity,'0');
  emit(context.location.origin,{},[1,1]);assert.equal(get('openingFirst').style.opacity,'0');
  emit(context.location.origin,parent,[1,0]);assert.equal(get('openingFirst').style.opacity,'1');assert.equal(get('openingSecond').style.opacity,'0');
  emit(context.location.origin,parent,[1,1]);assert.equal(get('openingSecond').style.opacity,'1');
  assert.equal(context.document.body.style['--fire-high'],'rgb(19,11,7)','The photo starts with black letters');
  emit(context.location.origin,parent,[1,1],.5);
  assert(context.document.body.classes.has('opening-ignited'));
  assert.equal(context.document.body.style['--fire-high'],'rgb(137,127,95)','Ignition is gradual');
  emit(context.location.origin,parent,[1,1],1);
  assert.equal(context.document.body.style['--fire-high'],'rgb(255,242,182)','The final flame uses the same palette as the epilogue');
  emit(context.location.origin,parent,[0,0]);assert.equal(get('openingFirst').attrs['aria-hidden'],'true');
  assert(!context.document.body.classes.has('opening-ignited'),'Replay restores charcoal letters');
  return;
 }
 assert.equal(phrases[1].classes.has('hidden-phrase'),!continuing);
 assert.equal([...timers.values()][0].ms,continuing?3200:4800,'Continue at the next phrase, without replaying the onion opening');
 assert(!messages.some(m=>m.type==='start'),'The shared music is never restarted at the handoff');
 get('full').click();assert.equal(timers.size,0);assert.equal(get('flowerCoda').hidden,false);
 get('paced').click();assert.equal([...timers.values()][0].ms,4800,'A deliberate replay restores the opening');
 assert(phrases[1].classes.has('hidden-phrase'));assert.equal(get('flowerCoda').hidden,true);
}
scenario('');scenario('seen');scenario('preview');
assert(/filter 7\.5s/.test(fs.readFileSync(__dirname+'/../piel/index.html','utf8')));
assert(source.includes('h1,.phrase,.opening-verse{'),'Preview and poem share the warm typography');
assert(source.includes('animation:livingFlame 6.8s ease-in-out infinite'),'Flame persists throughout the poem');
assert(source.includes('color:#130b07;-webkit-text-fill-color:#130b07;background:none;text-shadow:none;'),'Charcoal letters use opaque black, without a light shadow masking the fill');
assert(!source.includes('background:transparent;overflow:hidden'),'Preview keeps the same scrollbar gutter as the complete poem');
assert(!source.includes('.poem>.phrase:not(:first-child){display:none}'),'Hidden phrases reserve the same layout in both screens');
console.log('PASS: direct entry, continuation, exact epilogue preview, guarded sequential verse reveal, no duplicate timing or music restart, replay and skin clarity');
