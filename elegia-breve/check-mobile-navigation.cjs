const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(process.argv[2]||__dirname+'/index.html','utf8');
const shared=fs.readFileSync(path.join(__dirname,'../narrative-universe.js'),'utf8');
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
 getBoundingClientRect(){return{top:0,bottom:640};}
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
const context={document:{documentElement:root,body,getElementById:get,querySelectorAll(){return[];}},window:{location,innerHeight:640,scrollY:0,matchMedia:()=>({matches:reduced}),history:{pushState(s,t,hash){location.hash=hash;},replaceState(){location.hash='';}},addEventListener(type,fn){(events[type]??=[]).push(fn);},scrollTo(){}},URLSearchParams,Math,Promise,Float32Array,requestAnimationFrame(){return 1;},cancelAnimationFrame(){},setTimeout(fn,ms){const id=++sequence;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
const message=(type,origin=location.origin)=>{for(const fn of events.message)fn({origin,source:frame.contentWindow,data:{channel:'ceniciento-music-v1',type}});};
const run=ms=>{const match=[...timers].find(([,t])=>t.ms===ms);assert(match,'Missing timer '+ms);timers.delete(match[0]);match[1].fn();};
const route=(piece,type='popstate')=>{location.hash=piece?'#'+piece:'';fire(type);};
const assertPiece=piece=>{assert.equal(frame.hidden,false);assert.equal(get('poemBackdrop').hidden,false,'Ana is covered throughout navigation between pieces');assert(!get('poemBackdrop').classList.contains('is-leaving'),'No fading cover can expose Ana during a child route');assert(frame.src.includes('../'+piece+'/?music=parent'));assert.equal(location.hash,'#'+piece);};
vm.runInNewContext(script,context);
const music=get('voiceMusic');music.currentTime=51;music.paused=false;const plays=music.playCalls;
// The full navigation returns when the final photograph finishes fading in.
nav.hidden=true;get('anaPortrait').complete=true;get('anaPortrait').naturalWidth=1228;
body.classList.add('reading-ready');
assert(source.includes('.poem::after{content:"";display:block;height:120svh'),'Final verses remain reachable without the old signature');
get('recording').emit('ended');
assert(get('finalHeat').classList.contains('is-shown'),'el appears at the end of the recording');
assert(!get('finalHeat').classList.contains('show-calor'),'calor waits for its own pause');
assert(!body.classList.contains('portrait-revealed'),'The photograph waits for the final verses');
run(4500);assert(get('finalHeat').classList.contains('show-calor'),'calor appears after el');
assert(!body.classList.contains('portrait-revealed'),'calor stays visible before the photograph');
run(8500);assert(body.classList.contains('portrait-revealed'));
assert.equal(nav.hidden,true,'Controls wait for the portrait fade');
const stalePortrait=[...timers.values()].find(t=>t.ms===25000).fn;
run(25000);assert.equal(nav.hidden,false,'All poem controls appear on the final photograph');
assert(!source.includes('id="portraitEpilogue"'),'No duplicate epilogue button on the portrait');
assert(!source.includes('anaCeniciento'),'Ceniciento has no button or handler in Ana navigation');
const navigation=source.match(/<nav[^>]*id="anaNavigation"[\s\S]*?<\/nav>/)[0];
assert.equal((navigation.match(/<button\b/g)||[]).length,9,'Ana has nine controls for its seven poems and visual interlude');
// The portrait question works for touch/keyboard click events without mouse fields.
body.classList.add('portrait-revealed','voice-open');get('voiceDialog').show();
get('cenicientoLink').emit('click',{preventDefault(){}});assertPiece('ceniciento');
stalePortrait();assert.equal(nav.hidden,true,'A late portrait callback cannot show navigation over Ceniciento');
assert.equal(get('voiceDialog').open,false);
assert.equal(music.paused,false);assert.equal(music.currentTime,51);assert.equal(music.playCalls,plays);
message('close');run(2100);assert.equal(nav.hidden,false);
// Browser back/forward and fragment navigation must switch an already open iframe.
get('anaCabello').click();assertPiece('cabello');
route('piel');assertPiece('piel');
route('ojos','hashchange');assertPiece('ojos');
const active=frame.src;fire('popstate');fire('hashchange');assert.equal(frame.src,active);
// A queued fade callback must not reveal or unload a newer screen.
frame.emit('load');const staleReveal=[...timers.values()].find(t=>t.ms===350).fn;
message('home');const staleExit=[...timers.values()].find(t=>t.ms===2100).fn;
assert(frame.classList.contains('sonrisa-leaving'));
route('sonrisa');assertPiece('sonrisa');staleExit();staleReveal();assertPiece('sonrisa');
assert(!frame.classList.contains('sonrisa-visible'));
frame.emit('load');run(350);assert(frame.classList.contains('sonrisa-visible'));
// Repeated touch clicks cannot create multiple exit transitions.
for(const reducedMotion of [false,true]){
 reduced=reducedMotion;
 for(const [piece,id] of [['ojos','anaOjos'],['sonrisa','anaSonrisa'],['cabello','anaCabello'],['piel','anaPiel'],['estrella','anaEstrella'],['interludio','anaInterlude'],['epilogo','anaEpilogue'],['ceniciento','cenicientoLink']]){
  get(id).click();assertPiece(piece);frame.emit('load');run(piece==='epilogo'?0:350);
  message('home','https://other.test');assert(!frame.classList.contains('sonrisa-leaving'));
  message(piece==='ceniciento'?'close':'home');message('home');
  const delay=reduced?220:2100;
  assert.equal([...timers.values()].filter(t=>t.ms===delay).length,1);
  run(delay);assert.equal(get('poemBackdrop').hidden,true,'Ana returns only when requested');assert.equal(frame.hidden,true);assert.equal(nav.hidden,false);
  assert(!body.classList.contains('sonrisa-open'));assert(!root.classList.contains('ceniciento-open'));
  assert.equal(get('entryButton').disabled,false);
  assert.equal(music.currentTime,51);assert.equal(music.playCalls,plays);
  assert.equal(music.paused,false);
 }
}
// Going back, then immediately forward, cancels the obsolete return.
reduced=false;get('anaOjos').click();route('');const interrupted=[...timers.values()].find(t=>t.ms===2100).fn;
route('ojos');interrupted();assertPiece('ojos');
message('home');run(2100);get('anaRead').click();assert(body.classList.contains('reading-ready'));assert(get('entry').classList.contains('is-open'));
assert(source.includes('.ceniciento-frame.sonrisa-leaving{pointer-events:none}'));
assert(source.includes('min-height:44px;touch-action:manipulation'));
assert(source.includes('.journey-nav{box-sizing:border-box;width:min(calc(100% - 24px),420px);max-width:calc(100% - 24px);display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'),'Mobile reading controls stay in one compact, full-width row');
assert(source.includes('@media(max-width:760px){.journey-nav{box-sizing:border-box;width:min(calc(100% - 24px),420px);max-width:calc(100% - 24px);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));flex-wrap:nowrap'),'Mobile controls remain one row on wider phones too');
assert(source.includes('background:rgba(16,15,14,.18);color:#fffaf1')&&source.includes('-webkit-backdrop-filter:none;backdrop-filter:none'),'The navigation remains translucent and does not blur or cover the Cotán still life');
assert(source.includes('text-shadow:0 1px 3px rgba(0,0,0,.85)')&&source.includes('body.journey-started .ou-card{width:86px;height:54px;background:linear-gradient(145deg,rgba(62,68,77,.58),rgba(20,24,30,.52))'),'Navigation labels stay legible and the card remains compact');
assert(source.includes('body.journey-started main{padding-bottom:240px}'),'The poem reserves space below its last line for fixed mobile controls');
assert(shared.includes('@media(max-width:520px){.ou-solo-endnav{flex-direction:column;align-items:stretch;width:min(88vw,22rem)}.ou-solo-endnav a{width:100%;flex:none}.ou-card{bottom:calc(env(safe-area-inset-bottom,0px) + 88px)}}'),'The card sits above the mobile navigation controls');
console.log('PASS: eight return routes, repeated clicks, Back/Forward, hash changes, stale fades, reduced motion and uninterrupted music');
