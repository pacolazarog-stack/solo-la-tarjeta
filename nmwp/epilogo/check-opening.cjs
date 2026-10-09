const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/index.html','utf8');
const script=[...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
class Element{
 constructor(){this.hidden=true;this.handlers={};this.attrs={};this.style={setProperty(k,v){this[k]=v}};this.classes=new Set(['hidden-phrase']);this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),contains:c=>this.classes.has(c),toggle:(c,on)=>on?this.classes.add(c):this.classes.delete(c)};}
 setAttribute(k,v){this.attrs[k]=v} removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,fn){this.handlers[k]=fn} click(){this.handlers.click?.({preventDefault(){}})}
 getBoundingClientRect(){return this.rect||{top:600,height:100,bottom:700,left:620,width:500}}
 scrollIntoView(options){this.scrollOptions=options}
}
function scenario(openingMode){
 const continuing=openingMode==='seen',preview=openingMode==='preview';
 const nodes=new Map(),timers=new Map(),frames=new Map(),messages=[],handlers=[];let id=0;
 const get=k=>{if(!nodes.has(k)){const node=new Element();node.textContent=({openingFirst:'Yo iba a escribirte un poema.',openingSecond:'Tú me diste una cebolla.',openingImperative:'—Empieza por aquí.'})[k]||'';nodes.set(k,node)}return nodes.get(k)};
 const phrases=[...source.matchAll(/<p class="phrase[^>]*data-wait="(\d+)"/g)].map(m=>{const el=new Element();el.dataset={wait:m[1]};const key=m[0].match(/id="([^"]+)"/);if(key)nodes.set(key[1],el);return el});
 const parent={postMessage:m=>messages.push(m)};
 const scrolls=[];
 const uiEvents={};
 const context={document:{body:new Element(),getElementById:get,querySelector:()=>new Element(),querySelectorAll:()=>phrases},window:{parent,innerHeight:936,scrollY:0,scrollTo:options=>scrolls.push(options),matchMedia:()=>({matches:false}),addEventListener(type,fn){if(type==='message')handlers.push(fn);else uiEvents[type]=fn}},location:{origin:'https://example.test',search:'?music=parent'+(openingMode?'&opening='+openingMode:'')},URLSearchParams,getComputedStyle:()=>({top:'24px'}),requestAnimationFrame(fn){frames.set(++id,fn);return id},cancelAnimationFrame:key=>frames.delete(key),setTimeout(fn,ms){timers.set(++id,{fn,ms});return id},clearTimeout:key=>timers.delete(key)};
 vm.runInNewContext(script,context);
 const intro=get('epilogueIntro');
 assert.equal(Number(intro.style['--intro-progress']),continuing?2/(phrases.length-1):0,'The whole left column begins hidden and follows reading progress');
 assert.equal(intro.inert,true,'Invisible controls cannot receive focus or clicks');
 assert(!phrases[0].classes.has('hidden-phrase'),'Opening remains readable in the poem');
 if(preview){
  assert.equal(timers.size,0,'Preview never advances the poem behind the interlude');
  assert(context.document.body.classes.has('opening-preview'));
  assert.deepEqual([get('openingFirst').style?.opacity,get('openingSecond').style?.opacity],['0','0']);
  const emit=(origin,sender,levels,ignition=0)=>handlers.forEach(fn=>fn({origin,source:sender,data:{channel:'ana-opening-v1',type:'progress',levels,ignition}}));
  emit('https://other.test',parent,[1,1]);assert.equal(get('openingFirst').style.opacity,'0');
  emit(context.location.origin,{},[1,1]);assert.equal(get('openingFirst').style.opacity,'0');
  emit(context.location.origin,parent,[.5,0]);assert.equal(get('openingFirst').style.opacity,'1');assert.match(get('openingFirst').style.clipPath,/inset\(-24px 5\d/,'Characters are revealed from the left, without dimming the text');
  emit(context.location.origin,parent,[1,0]);assert.equal(get('openingFirst').style.opacity,'1');assert.equal(get('openingSecond').style.opacity,'0');
  emit(context.location.origin,parent,[1,1]);assert.equal(get('openingSecond').style.opacity,'1');
  assert.equal(context.document.body.style['--fire-high'],'rgb(19,11,7)','The photo starts with black letters');
  emit(context.location.origin,parent,[1,1],.5);
  assert(context.document.body.classes.has('opening-ignited'));
  assert.equal(context.document.body.style['--fire-high'],'rgb(137,127,95)','Ignition is gradual');
  emit(context.location.origin,parent,[1,1],1);
  assert.equal(context.document.body.style['--fire-high'],'rgb(255,242,182)','The final flame uses the same palette as the epilogue');
  emit(context.location.origin,parent,[0,0]);assert.equal(get('openingFirst').style.opacity,'1','Late progress cannot extinguish the anchor');
  assert(context.document.body.classes.has('opening-ignited'));
  const control=type=>handlers.forEach(fn=>fn({origin:context.location.origin,source:parent,data:{channel:'ana-opening-v1',type}}));
  control('reset');assert.equal(get('openingFirst').attrs['aria-hidden'],'true');assert(!context.document.body.classes.has('opening-ignited'),'Explicit replay restores charcoal letters');
  emit(context.location.origin,parent,[1,1],1);
  const opening=phrases[0];control('continue');
  const firstIntro=Number(intro.style['--intro-progress']);assert(firstIntro>0&&firstIntro<1,'The column begins a gradual reveal when the poem starts');
  assert(!context.document.body.classes.has('opening-preview'));
  assert.equal(phrases[0],opening,'The original opening node is reused');
  assert(!opening.classes.has('hidden-phrase'),'The anchor is never hidden during continuation');
  assert(!phrases[1].classes.has('hidden-phrase'),'Empieza por aquí is the first new phrase');
  assert.equal(get('openingImperative').style.opacity,'0','The imperative starts its own display reveal');
  const advance=time=>{for(const [key,fn] of [...frames]){frames.delete(key);fn(time)}};
  advance(100);advance(500);assert.equal(get('openingImperative').style.opacity,'1');assert.notEqual(get('openingImperative').style.clipPath,'none','Imperative is partially typed');
  advance(1500);assert.equal(get('openingImperative').style.clipPath,'none');
  assert.equal(context.document.body.style['--opening-background'],'1','The final backdrop is already complete when the epilogue takes over');
  assert.equal([...timers.values()][0].ms,3200);
  const activeTimer=[...timers.keys()][0];control('continue');assert.equal([...timers.keys()][0],activeTimer,'Duplicate continuation cannot restart the poem');
  const nextCue=[...timers][0];timers.delete(nextCue[0]);nextCue[1].fn();assert(Number(intro.style['--intro-progress'])>firstIntro);assert.equal(intro.inert,false,'Controls become accessible as the column emerges');
  get('full').click();assert.equal(Number(intro.style['--intro-progress']),1);get('paced').click();assert.equal(Number(intro.style['--intro-progress']),1,'Replaying does not extinguish the visible column');assert(!opening.classes.has('hidden-phrase'));assert.equal([...timers.values()][0].ms,3200,'Reading again preserves the opening anchor');
  while(scrolls.length===0){const [key,entry]=[...timers][0];assert(entry,'Closing cue must be reachable');timers.delete(key);entry.fn()}
  assert(get('closingScene').classes.has('is-pinned'),'The whole closing is fixed to the viewport before it appears');
  assert.equal(get('closingScene').style['--closing-top'],'220.32px');
  assert.equal(scrolls.length,1);assert.equal(scrolls[0].behavior,'instant','The closing is positioned before its first line fades in, with no drift');assert.equal(scrolls[0].top,363.68,'The closing preserves the photographed space beneath the anchor');
  assert(get('poem').classes.has('is-closing'),'Earlier stanzas, including para que quepa, are hidden during the closing');
  phrases[0].rect={top:24,bottom:124,height:100};get('poemFlow').rect={top:-1000};get('closingStart').rect={top:200};uiEvents.scroll();advance(2000);
  assert.equal(get('poemFlow').style['--reading-clip'],'1140px','All flowing text is clipped below the anchor, including text above its top edge');
  get('closingStart').rect={top:2000};uiEvents.scroll();advance(2100);assert(get('poem').classes.has('is-closing'),'Scrolling cannot move the pinned closing or restore earlier text during its reading');
  while(timers.size){const [key,entry]=[...timers][0];assert.equal(get('flowerCoda').hidden,true,'Closing holds intact until its last cue expires');timers.delete(key);entry.fn()}
  assert(!get('closingScene').classes.has('is-pinned'),'The fixed closing is released only at the cut to Flores');
  assert.equal(get('flowerCoda').scrollOptions.behavior,'instant','The last cue cuts directly to Flores without scrolling through another frame');
  assert.equal(get('flowerCoda').scrollOptions.block,'start');
  return;
 }
 assert.equal(phrases[1].classes.has('hidden-phrase'),!continuing);
 assert.equal([...timers.values()][0].ms,continuing?3200:4800,'Continue at the next phrase, without replaying the onion opening');
 assert(!messages.some(m=>m.type==='start'),'The shared music is never restarted at the handoff');
 get('full').click();assert.equal(timers.size,0);assert.equal(get('flowerCoda').hidden,false);
 get('paced').click();assert.equal([...timers.values()][0].ms,3200,'Reading again preserves the opening and starts at the imperative');
 assert(!phrases[1].classes.has('hidden-phrase'));assert.equal(get('flowerCoda').hidden,true);
}
scenario('');scenario('seen');scenario('preview');
assert(/filter 7\.5s/.test(fs.readFileSync(__dirname+'/../piel/index.html','utf8')));
assert(source.includes('h1,.phrase,.opening-verse{'),'Preview and poem share the warm typography');
assert(source.includes('animation:livingFlame 6.8s ease-in-out infinite'),'Flame persists throughout the poem');
assert(source.includes('color:#130b07;-webkit-text-fill-color:#130b07;background:none;text-shadow:none;'),'Charcoal letters use opaque black, without a light shadow masking the fill');
assert(!source.includes('background:transparent;overflow:hidden'),'Preview keeps the same scrollbar gutter as the complete poem');
assert(!source.includes('.poem>.phrase:not(:first-child){display:none}'),'Hidden phrases reserve the same layout in both screens');
assert(source.includes('.opening-verse,.imperative{font-weight:700}'),'Opening stays bold before and after ignition');
assert(source.includes('.imperative{transition:none}'),'The imperative types crisp letters without a paragraph fade');
assert(source.includes('.closing-scene .ending{font-size:calc(1em + 1pt);font-weight:700;font-style:italic;'),'The last line is one typographic point larger, bold and italic');
assert(!source.includes("detailBackground.classList.remove('is-clear')"),'Continuation never restarts or darkens the already completed backdrop');
assert(source.includes('.intro{opacity:var(--intro-progress,0);transition:opacity 2s linear}'),'The column fade takes half the previous time');
console.log('PASS: direct entry, continuation, exact epilogue preview, guarded sequential verse reveal, no duplicate timing or music restart, replay and skin clarity');
