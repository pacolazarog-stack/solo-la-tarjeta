const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const page=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const mirror=fs.readFileSync(path.join(__dirname,'el-espejo.js'),'utf8');
const shared=fs.readFileSync(path.join(__dirname,'../narrative-universe.js'),'utf8');
const ana=fs.readFileSync(path.join(__dirname,'../elegia-breve/index.html'),'utf8');
const sceneBlock=mirror.slice(mirror.indexOf('const scenes=['),mirror.indexOf('];\nconst pauseAt'));
assert.equal((sceneBlock.match(/^`/gm)||[]).length,32,'EL ESPEJO contains exactly 32 narrative scenes');
assert(mirror.includes('new Set([14,15,17,26,30])'),'Five convergence scenes pause for reader action');
assert(mirror.includes("next.textContent='seguir'")&&mirror.includes('if(!locked||lockedScene!==scene)return'),'The reader controls each key-scene pause');
assert(mirror.includes("scene.dataset.pauseConsumed='true'")&&mirror.includes('pauseObserver.unobserve(scene)'),'Each Seguir consumes and unobserves its pause before advancing');
assert(mirror.includes("entry.target.dataset.pauseConsumed!=='true'")&&mirror.includes('oras-mirror-explicit-follow-gates')&&mirror.includes('mirror-pause-locked')&&mirror.includes('blockWhilePaused'),'Each pause is one-shot and remains locked until its Seguir button is pressed');
assert(mirror.includes('body.mirror .ou-ceniciento-endnav')&&mirror.includes('display:none!important'),'The normal button bar stays hidden throughout Mirror reading');
assert(mirror.includes("flag.textContent='flag'")&&mirror.includes("finale.className='mirror-flag-finale'"),'EL ESPEJO has one autonomous full-screen flag finale');
assert(mirror.includes('finale.append(flag);'),'The final screen contains only flag');
assert(!mirror.includes("restart.textContent='Reinicio'")&&!mirror.includes("exit.textContent='Salir'")&&!mirror.includes("question.textContent='?'"),'No final navigation controls survive');
assert(mirror.includes('FINALE_BLACK_MS=5000')&&mirror.includes('FINALE_FLAG_MS=4500')&&mirror.includes('FINALE_DISSOLVE_MS=3000'),'The silent finale keeps the intended timing');
assert(mirror.includes("window.dispatchEvent(new CustomEvent('oras:mirror-end'))")&&mirror.includes("ROOT+'elegia-breve/'"),'EL ESPEJO returns automatically to ANA KLAUDYA after flag');
assert(mirror.includes("document.body.classList.add('mirror-finale-active')")&&mirror.includes("window.addEventListener('wheel',blockFinaleInput,{passive:false,capture:true})")&&mirror.includes("window.addEventListener('touchmove',blockFinaleInput,{passive:false,capture:true})"),'The silent finale blocks interaction');
assert(page.includes('<main id="mirror" aria-label="EL ESPEJO" hidden></main>'),'The convergence remains hidden until its narrative condition');
assert(/data-oras-mirror="true" src="(?:\/solo-la-tarjeta\/ceniciento\/)?el-espejo\.js\?v=20261010-29"/.test(page),'The mirror script is registered for shared startup');
assert(shared.includes('state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&state.cenicientoUnlocked&&!state.mirrorReadComplete'),'The convergence waits for all three complete first readings');
assert(shared.includes("completeAnaPart('elegia')")&&shared.includes('anaPartsComplete(current.anaParts)')&&shared.includes("completePiece('cenicientoComplete'")&&shared.includes('maybeStartMirror();'),'ANA is composite and every completed work still checks the convergence gate');
assert(shared.includes("function resetReadingCycle()")&&shared.includes('anaParts:emptyAnaParts()')&&shared.includes('soloComplete:false')&&shared.includes('cenicientoComplete:false'),'The reset function clears the full reading cycle including ANA parts');
assert(shared.includes("box.className='ou-reading-checklist'")&&shared.includes('ANA KLAUDYA · ${anaDone}/${ANA_PARTS.length}')&&shared.includes('data-piece="solo"><span>SOLO LA TARJETA</span>'),'The compact checklist exposes ANA internal progress and the three works');
assert(shared.includes('oras-ceniciento-mirror-transition-style')&&shared.includes("follow.textContent='Seguir'")&&shared.includes('readyTimer=setTimeout')&&shared.includes('2200'),'CENICIENTO enters EL ESPEJO through a timed transition and explicit Seguir');
assert(!page.includes('id="continue"')&&!page.includes('cont.onclick'),'Read and Voice have no second start button');
assert(page.includes("voice.play().then(loop)"),'Voice playback starts directly from the mode selection');
assert.equal((shared.match(/Hay historias que empiezan antes\.|El origen suele parecer insignificante\.|Falta una versión de la historia\.|Nadie regresa al mismo lugar\./g)||[]).length,4,'The four ghost phrases remain unchanged');
const pages=['../index.html','../elegia-breve/index.html','../ojos/index.html','../sonrisa/index.html','../estrella/index.html','../epilogo/index.html','index.html'];
for(const f of pages){const s=fs.readFileSync(path.join(__dirname,f),'utf8');assert(/narrative-universe\.js\?v=202610(?:10-29|11-(?:30|31|32|33|34|35|36|37|39|40|41|42)|12-ceniciento-observer-v2)/.test(s),`${f} points to an approved shared module version`)}
assert(!/\n\s*main\s*\{/.test(ana),'Ana reading visibility is scoped to #reading, not every main');
assert(shared.includes('body.mirror #mirror{opacity:1;visibility:visible;width:100%;max-width:none;margin:0;padding:0;'),'Mirror overrides host visibility and dimensions');
assert(shared.includes('body.mirror{touch-action:pan-y}'),'Base Mirror touch scrolling remains available between explicit pause gates');
console.log('PASS: 32-scene convergence, one-shot explicit pause gates, silent flag finale, automatic return, completion gate, and checklist');

// Exercise the emitted gate with DOMTokenList mutation semantics: even removing
// an absent class queues a class mutation. The callback must reach idle.
const gateStart=shared.lastIndexOf(';(()=>{',shared.indexOf('// oras-ceniciento-direct-mirror-gate-v1'));
const gateEnd=shared.indexOf('})();',gateStart)+5;
assert(gateStart>=0&&gateEnd>gateStart,'Published CENICIENTO gate exists');
const gate=shared.slice(gateStart,gateEnd);
for(const [label,complete,initial] of [['2/3',false,false],['reset',false,true],['3/3 finale',true,false]]){
  let callback,queued=0,deliveries=0;
  const frames=[],timers=[],classes=new Set(initial?['ou-ceniciento-direct-mirror']:[]);
  if(complete)classes.add('ou-ceniciento-finale-ready');
  const classList={contains:x=>classes.has(x),add(...xs){xs.forEach(x=>classes.add(x));if(callback)queued++},remove(...xs){xs.forEach(x=>classes.delete(x));if(callback)queued++}};
  const dummy={classList:{add(){},remove(){}},setAttribute(){},focus(){},querySelector(){return this}};
  const state={anaComplete:true,soloComplete:true,cenicientoComplete:complete,cenicientoUnlocked:complete};
  require('node:vm').runInNewContext(gate,{
    location:{pathname:'/solo-la-tarjeta/ceniciento/'},localStorage:{getItem:()=>JSON.stringify(state)},
    document:{body:{classList},head:{appendChild(){}},createElement:()=>({...dummy}),querySelector:()=>dummy},
    MutationObserver:class{constructor(cb){callback=cb}observe(){}},addEventListener(){},
    requestAnimationFrame:f=>frames.push(f),setTimeout:f=>timers.push(f),clearTimeout(){}
  });
  while(frames.length)frames.shift()();
  while(queued&&deliveries<100){queued=0;deliveries++;callback()}
  assert.equal(queued,0,label+': class observer settles without starving input');
  assert.equal(classes.has('ou-ceniciento-direct-mirror'),complete,label+': convergence gate remains correct');
  assert.equal(timers.length,complete?1:0,label+': only the completed finale schedules Seguir');
}
console.log('PASS: CENICIENTO observer settles at 2/3, after reset and at the 3/3 finale');
