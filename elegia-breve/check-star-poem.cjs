const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const star=fs.readFileSync(path.join(__dirname,'../estrella/index.html'),'utf8');
const ana=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const sharedCode=fs.readFileSync(path.join(__dirname,'../narrative-universe.js'),'utf8');
const match=star.match(/<article class="poem" id="poem"[^>]*>([\s\S]*?)<\/article>/);
assert(match,'The star poem has a distinct reading container');
const phrases=[...match[1].matchAll(/<p class="phrase hidden-phrase(?: ending(?: final-stanza)?)?"[^>]*>([\s\S]*?)<\/p>/g)]
 .map(m=>m[1].replace(/<br\s*\/?\s*>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
assert.deepEqual(phrases,[
 'Siguiendo una tarjeta, encontré un lugar.',
 'Al detenerme allí, empezó a ser mi hogar (todavía sin llave, pero ya imaginaba mis pasos al volver)',
 'Siguiendo a un ángel, llegué hasta ti.',
 'Todavía me sorprende.',
 'Cuando era yang, buscaba el yin.',
 'Ahora que soy yin,',
 'me basta con mirarte.'
],'The complete seven-part prologue remains in its intended order');
assert(match[0].includes('aria-label="Siguiendo una tarjeta" hidden'),'The poem waits behind its celestial opening');
assert(star.includes('function completeMoon()'),'The transition has an explicit completion gate');
assert(star.includes("poem.hidden=false;paced.disabled=false"),'Text is revealed only when the opening completes');
assert(star.includes("document.getElementById('backAna').addEventListener('click'"),'The prologue returns within Ana Klaudya');
assert(ana.includes('id="anaEstrella"'),'The prologue remains part of Ana Klaudya navigation');
assert(!/makeSymbolic|wrapToken|showSoloEndNav/.test(sharedCode),'The shared system does not turn this motif into a cross-work shortcut');
assert(!/Torre Eiffel|Ojos de estatua|tarjeta anulada|reloj/.test(star),'No secondary motif becomes a link from the prologue');
console.log('PASS: complete seven-part prologue, gated reveal and internal return');