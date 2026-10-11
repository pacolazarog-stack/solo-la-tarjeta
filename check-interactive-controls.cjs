const fs=require('node:fs');

function read(path){return fs.readFileSync(path,'utf8');}
function requireAll(label,source,tokens){
  for(const token of tokens){
    if(!source.includes(token))throw new Error(`${label}: falta ${token}`);
  }
}

const solo=read('index.html');
const ana=read('elegia-breve/index.html');
const cen=read('ceniciento/index.html');
const universe=read('narrative-universe.js');
const mirror=read('ceniciento/el-espejo.js');

// SOLO LA TARJETA: el botón debe poder reanudar un audio pausado, no limitarse a muted.
requireAll('SOLO LA TARJETA / sonido',solo,[
  'id="soundToggle"',
  'const syncSoundToggle=()=>',
  'if(soundtrack.muted||soundtrack.paused)',
  'await soundtrack.play()',
  "for(const eventName of ['play','pause','volumechange'])soundtrack.addEventListener(eventName,syncSoundToggle)",
  "if(audio.finalSilenced) return;",
  "event.stopImmediatePropagation();"
]);
if(solo.includes("const willMute=!soundtrack.muted;")){
  throw new Error('SOLO LA TARJETA / sonido: reapareció el toggle que solo cambia muted');
}

// ANA KLAUDYA: su control general ya tiene camino de arranque/rearranque real.
requireAll('ANA KLAUDYA / sonido',ana,[
  'id="soundToggle"',
  "soundToggle.addEventListener('click',async()=>",
  'if(!soundStarted || soundtrack.paused)',
  'const started=await startSound();',
  'syncSoundToggle();'
]);

// CENICIENTO: activar música debe intentar reproducir si está pausada, y conservar
// un botón de recuperación cuando el navegador rechaza el primer play().
requireAll('CENICIENTO / música',cen,[
  'id="musicEnabled"',
  'id="musicStart"',
  'if(musicEnabled.checked&&music.paused)music.play()',
  'musicEnabled.onchange=()=>',
  'musicStart.onclick=startMusic'
]);

// Cierre Flores: tras 10 s aparece Seguir y solo ese control autoriza la entrada
// explícita en EL ESPEJO.
requireAll('ANA KLAUDYA / Flores -> EL ESPEJO',universe,[
  'window.setTimeout(showAnaMirrorFollow,10000)',
  "follow.textContent='Seguir'",
  "follow.addEventListener('click',enterMirrorAfterFlowers,{once:true})",
  "document.body.classList.add('ou-mirror-explicit-enter')"
]);
if(universe.includes('setTimeout(enterMirrorAfterFlowers,10000)')){
  throw new Error('ANA KLAUDYA / Flores: EL ESPEJO vuelve a arrancar automáticamente');
}

// Los Seguir internos de EL ESPEJO usan la variable `next` y texto en minúscula.
// Se exige que el mismo control tenga clase, rótulo, click y liberación de pausa.
requireAll('EL ESPEJO / Seguir',mirror,[
  "next.className='mirror-continue'",
  "next.textContent='seguir'",
  "next.addEventListener('click'",
  'releasePause();'
]);

// Barrido defensivo de controles sonoros publicados: si aparece un control conocido,
// debe existir también un manejador en el mismo documento.
for(const [path,source] of [['index.html',solo],['elegia-breve/index.html',ana],['ceniciento/index.html',cen]]){
  if(source.includes('id="soundToggle"')&&!/(soundToggle\??\.addEventListener|soundToggle\.addEventListener)/.test(source)){
    throw new Error(`${path}: #soundToggle existe pero no tiene manejador click`);
  }
  if(source.includes('id="musicEnabled"')&&!source.includes('musicEnabled.onchange')){
    throw new Error(`${path}: #musicEnabled existe pero no tiene manejador change`);
  }
  if(source.includes('id="musicStart"')&&!source.includes('musicStart.onclick')){
    throw new Error(`${path}: #musicStart existe pero no tiene manejador click`);
  }
}

console.log('PASS: controles sonoros y Seguir narrativos auditados en SOLO, ANA KLAUDYA, CENICIENTO y EL ESPEJO');
