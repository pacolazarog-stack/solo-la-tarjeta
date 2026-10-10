const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(process.argv[2]||__dirname+'/index.html','utf8');
const script=source.match(/<script>([\s\S]*?)<\/script>/)[1];
const universe=fs.readFileSync(path.join(__dirname,'../narrative-universe.js'),'utf8');
const nodes=new Map(),timers=new Map(),events={},frameMessages=[];let sequence=0,reduced=false;
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
 showModal(){this.open=true;}
 focus(){}
 close(){this.open=false;this.emit('close');}
}
const get=id=>{if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);};
const root=get('root'),frame=get('cenicientoFrame'),body=get('body'),nav=get('anaNavigation');
root.scrollHeight=2000;frame.contentWindow={postMessage:data=>frameMessages.push(data)};
const location={origin:'https://example.test',pathname:'/elegia-breve/',search:'',hash:''};
const fire=type=>{for(const fn of events[type]??[])fn();};
const context={document:{documentElement:root,body,getElementById:get,querySelectorAll(){return[];}},window:{location,innerHeight:640,scrollY:0,matchMedia:()=>({matches:reduced}),history:{pushState(s,t,hash){location.hash=hash;},replaceState(){location.hash='';}},addEventListener(type,fn){(events[type]??=[]).push(fn);},scrollTo(){}},URLSearchParams,Math,Promise,Float32Array,requestAnimationFrame(){return 1;},cancelAnimationFrame(){},setTimeout(fn,ms){const id=++sequence;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
const message=(type,origin=location.origin,details={},sender=frame.contentWindow)=>{for(const fn of events.message)fn({origin,source:sender,data:{channel:'ceniciento-music-v1',type,...details}});};
const run=ms=>{const match=[...timers].find(([,t])=>t.ms===ms);assert(match,'Missing timer '+ms);timers.delete(match[0]);match[1].fn();};
const route=(piece,type='popstate')=>{location.hash=piece?'#'+piece:'';fire(type);};
const assertPiece=piece=>{assert.equal(frame.hidden,false);assert.equal(get('poemBackdrop').hidden,false,'Ana is covered throughout navigation between pieces');assert(!get('poemBackdrop').classList.contains('is-leaving'),'No fading cover can expose Ana during a child route');assert(frame.src.includes('../'+piece+'/?music=parent'));assert.equal(location.hash,'#'+piece);};
vm.runInNewContext(script,context);
const music=get('voiceMusic');music.currentTime=51;music.paused=false;const plays=music.playCalls;
// The full navigation returns when the final photograph finishes fading in.
nav.hidden=true;get('anaPortrait').complete=true;get('anaPortrait').naturalWidth=1228;
body.classList.add('reading-ready');
assert(source.includes('.poem::after{content:"";display:block;height:120svh'),'Final verses remain reachable without an end marker');
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
assert(!source.includes('Acerca del proyecto')&&!source.includes('Jurados y festivales'),'Critical and festival documentation stays outside the reading interface');
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
// Only a completed active interlude can navigate automatically to the epilogue.
get('anaInterlude').click();assertPiece('interludio');
assert(frame.classList.contains('interlude-transition'));
message('interlude-ended','https://other.test');assertPiece('interludio');
message('interlude-ended',location.origin,{openingShown:true},{});assertPiece('interludio');
message('interlude-ended',location.origin,{openingShown:true});assertPiece('epilogo');
assert(frame.src.includes('&opening=seen'),'A completed opening continues after its two verses');
get('anaInterlude').click();message('interlude-ended');assertPiece('epilogo');
assert(!frame.src.includes('opening=seen'),'Skipping the opening keeps the normal epilogue entry');
assert.equal(music.paused,false);assert.equal(music.currentTime,51);assert.equal(music.playCalls,plays);
get('anaPiel').click();message('interlude-ended');assertPiece('piel');
// The interlude keeps its narrative place with only the three navigation controls.
get('anaInterlude').click();assert(!frame.classList.contains('sonrisa-visible'));
message('interlude-preview-ready');get('journeyNext').click();
assert(frame.classList.contains('sonrisa-visible'),'A quick manual advance reveals the preserved frame even before its initial fade timer');
for(const manual of [false,true]){
 get('anaInterlude').click();frame.emit('load');run(350);
 const existingSource=frame.src,continuations=frameMessages.filter(m=>m.type==='continue-epilogue').length;
 message('interlude-preview-ready');
 if(manual)get('journeyNext').click();else message('interlude-ended',location.origin,{openingShown:true,persistentOpening:true});
 assert.equal(location.hash,'#epilogo');assert.equal(frame.src,existingSource,'Both automatic and manual handoff preserve the actual opening document');
 assert(frame.classList.contains('sonrisa-visible'),'No opacity transition can extinguish the verses');
 assert.equal(frameMessages.filter(m=>m.type==='continue-epilogue').length,continuations+1);
 assert.equal(music.currentTime,51);assert.equal(music.paused,false);
 get('journeyPrevious').click();assertPiece('interludio');
}
get('anaPiel').click();assertPiece('piel');
assert(!source.includes('journeySkipInterlude'),'No extra epilogue shortcut');
get('journeyNext').click();assertPiece('interludio');
get('journeyNext').click();assertPiece('epilogo');
assert.equal(music.paused,false);assert.equal(music.currentTime,51);assert.equal(music.playCalls,plays);
assert(source.includes('entry-button petal-button'));
// Every relation between subpages is direct and keeps Ana behind an opaque cover.
for(const from of ['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']){
 route(from);assertPiece(from);
 for(const to of ['estrella','ojos','sonrisa','cabello','piel','interludio','epilogo','ceniciento']){
  route(to);assertPiece(to);assert.equal(music.currentTime,51);assert.equal(music.paused,false);
 }
}
// Going back, then immediately forward, cancels the obsolete return.
reduced=false;get('anaOjos').click();route('');const interrupted=[...timers.values()].find(t=>t.ms===2100).fn;
route('ojos');interrupted();assertPiece('ojos');
message('home');run(2100);get('anaRead').click();assert(body.classList.contains('reading-ready'));assert(get('entry').classList.contains('is-open'));
assert(source.includes('.ceniciento-frame.sonrisa-leaving{pointer-events:none}'));
assert(source.includes('min-height:44px;touch-action:manipulation'));
// The sequential route covers the seven poems without including Ceniciento.
get('journeyIndexOpen').click();assert.equal(get('journeyIndex').open,true);
get('anaEstrella').click();assertPiece('estrella');
assert.equal(get('journeyPrevious').disabled,true);
get('journeyNext').click();run(2100);assert.equal(frame.hidden,true);
assert(body.classList.contains('reading-ready'));
for(const piece of ['ojos','sonrisa','cabello','piel','interludio','epilogo']){
 get('journeyNext').click();assertPiece(piece);
}
assert.equal(get('journeyNext').disabled,true);
for(const piece of ['interludio','piel','cabello','sonrisa','ojos']){
 get('journeyPrevious').click();assertPiece(piece);
}
get('journeyPrevious').click();run(2100);assert.equal(frame.hidden,true);
const narrationPlays=get('recording').playCalls||0;
(async()=>{
get('anaVoice').click();assert.equal(get('voiceDialog').open,true);
assert.equal(get('recording').playCalls,narrationPlays+1,'Choosing voice primes playback in the same gesture');
get('voiceLaunch').click();
assert.equal(get('recording').playCalls,narrationPlays+1,'A repeated voice click does not queue another start');
await Promise.resolve();
assert.equal(get('recording').paused,true,'The first word waits for the music fade');
assert.equal(get('recording').currentTime,0,'The first word is preserved');
assert.equal([...timers.values()].filter(t=>t.ms===4000).length,1,'One four-second fade before narration');
run(4000);await Promise.resolve();
assert.equal(get('recording').paused,false,'One voice selection starts narration after the fade');
assert.equal(get('recording').playCalls,narrationPlays+2);
get('recording').emit('play');assert.equal(get('voicePlay').textContent,'Pausar');
get('voiceClose').click();
assert.equal(get('recording').paused,true);
const launchPlays=get('recording').playCalls;
get('voiceLaunch').click();await Promise.resolve();
assert.equal(get('recording').playCalls,launchPlays+1,'The central Voice button also starts the fade');
assert.equal([...timers.values()].filter(t=>t.ms===4000).length,1);
get('voiceClose').click();
assert.equal([...timers.values()].filter(t=>t.ms===4000).length,0,'Closing cancels pending narration');
const musicPlays=music.playCalls||0;
get('entryButton').click();assertPiece('estrella');
assert.equal(music.playCalls||0,musicPlays,'Begin does not start sound');
assert.equal(music.currentTime,51);
assert(!source.includes('entry-flag')&&!source.includes('poemas de Paco Olmo de Males'),'The ANA KLAUDYA cover carries no byline');
assert(source.includes('▶ Comenzar'));
assert(!source.includes("renderWorld();\\n      ensureAmbientMusic();"));
const phraseInventory=[...universe.matchAll(/^\s*(before|origin|absence|return):'([^']+)'/gm)].map(m=>m[2]);
assert.deepEqual(phraseInventory,['Hay historias que empiezan antes.','El origen suele parecer insignificante.','Falta una versión de la historia.','Nadie regresa al mismo lugar.'],'The shared system keeps exactly the four approved ghost phrases');
assert(!/ghost\(['\"]/.test(universe),'All ghost copy comes from the four-item phrase inventory');
assert(!/function (?:makeSymbolic|wrapToken|activateSoloSymbols)/.test(universe),'Narrative echoes remain outside navigation controls');
assert(/function showSoloEndNav\(\)[\s\S]*?ana\.href=rootPath\+'elegia-breve\/'[\s\S]*?nav\.append\(ana\)/.test(universe),'The Solo ending offers only the return to Ana');
assert(/function showSoloEndNav\(\)\{\s*if\(!state\.cenicientoComplete\|\|!state\.cenicientoUnlocked\)return/.test(universe),'Solo shows no cross-piece exit until Ceniciento is fully read from the interrogante route');
assert(/function showSoloEndNav\(\)[\s\S]*?if\(state\.cenicientoComplete\)\{[\s\S]*?ceniciento\.href/.test(universe),'Solo opens Ceniciento only after its qualified first completion');
assert(/if\(state\.cenicientoComplete\)\{[\s\S]*?ceniciento\.href=rootPath\+'ceniciento\//.test(universe),'Solo gains direct cross-navigation only after qualified Ceniciento completion');
assert(/function addUnlockedAnaDoors\(\)[\s\S]*?if\(!state\.cenicientoComplete\|\|!state\.cenicientoUnlocked\)return[\s\S]*?textContent='SOLO LA TARJETA'[\s\S]*?textContent='CENICIENTO'/.test(universe),'Ana gains reciprocal work buttons only after qualified Ceniciento completion');
assert(universe.includes('if(state.cenicientoComplete&&state.cenicientoUnlocked)showSoloEndNav();'),'Qualified cross-navigation remains available on later Solo visits');
assert(universe.includes('if(state.cenicientoComplete&&state.cenicientoUnlocked&&!(state.soloComplete&&state.anaComplete&&!state.mirrorReadComplete))requestAnimationFrame(()=>requestAnimationFrame(revealNav))'),'Ceniciento cross-navigation appears after qualified completion, except while Mirror is pending');
assert(universe.includes("new URLSearchParams(location.search).get('via')==='question'")&&universe.includes("unlock?{cenicientoUnlocked:true}:{}"),'Only a completed Ceniciento visit carrying the interrogante origin can create the first unlock');
assert(/const openCeniciento=\(\)=>openPoem\('ceniciento',false,false,false,'question'\)/.test(fs.readFileSync(path.join(__dirname,'index.html'),'utf8')),'The ANA question-mark route explicitly marks its Ceniciento entry');
assert(universe.includes('min-height:52px'),'End buttons have thumb-sized mobile targets');
assert(universe.includes("nav.setAttribute('aria-label','Continuar desde SOLO LA TARJETA')"),'The ending navigation has an accessible label');
assert(universe.includes("ana.textContent='Volver a ANA KLAUDYA'")&&!universe.includes("ceniciento.textContent='Ir a CENICIENTO'"),'The Solo ending contains no Ceniciento exit');
assert(source.includes("document.getElementById('cenicientoLink').addEventListener('click',openCeniciento)"),'The question mark remains the sole visible entry to Ceniciento from Ana');
assert(universe.includes("width:112px;height:70px"),'The card has a clear mobile-sized target');
assert(universe.includes('@media(hover:none) and (pointer:coarse){.ou-solo-endnav a,.ou-ceniciento-endnav a{min-height:52px}.ou-card{animation:none'),'End navigation and card are touch-friendly without hover');
assert(universe.includes('.ou-ceniciento-endnav a{box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-width:48px;min-height:48px'),'Ceniciento exits have clear touch targets');
assert(universe.includes("nav.setAttribute('aria-label','Continuar después de CENICIENTO')"),'The Ceniciento exit navigation has an accessible label');
assert(source.includes('width:80px;height:80px;transition:opacity 2.5s ease 10s'),'The question is visible and easy to tap on mobile');
assert(source.includes('aria-label="Interrogante"'),'The question keeps its ambiguity in the accessible name');
assert(source.includes('@media(hover:none) and (pointer:coarse){.question-beat{animation:none}}'),'The question does not depend on an animated cue on touch devices');
assert(universe.includes('new IntersectionObserver(entries=>{')&&universe.includes("const lastLine=document.querySelector('main article p.story-line:last-of-type')"),'Solo completion follows the last observed line');
console.log('PASS: sequential navigation, eight return routes, repeated touches, Back/Forward, index, one-click voice with four-second fade, cancellation, reduced motion and uninterrupted music');
})().catch(error=>{console.error(error);process.exitCode=1;});
