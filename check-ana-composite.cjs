const fs=require('node:fs');
const source=fs.readFileSync('narrative-universe.js','utf8');
function assert(value,message){if(!value)throw Error(message);}
const required=[
  "['estrella','Siguiendo una tarjeta']",
  "['elegia','Elegía breve para Ana Klaudya']",
  "['ojos','En tus ojos']",
  "['labios','En tus labios']",
  "['cabello','Tu cabello']",
  "['piel','Tu piel']",
  "['interludio','Interludio · Iba a llevarte flores']",
  "['epilogo','Epílogo · A fuego lento · Flores']",
  'current.anaComplete=anaPartsComplete(current.anaParts)',
  "completeAnaPart('elegia')",
  "observeAnaEnd('.line','ojos')",
  "observeAnaEnd('.line','labios')",
  "observeAnaEnd('.line','cabello')",
  "observeAnaEnd('.line','piel')",
  "observeAnaEnd('.phrase','estrella')",
  "observeAnaEnd('#flowerCoda','epilogo')",
  "completeAnaPart('interludio')",
  "type:'ana-progress'",
  "event.data.type==='ana-progress'",
  'anaParts:emptyAnaParts()',
  'ANA KLAUDYA · ${anaDone}/${ANA_PARTS.length}'
];
for(const token of required)assert(source.includes(token),'Falta regla de progreso ANA: '+token);
assert(!source.includes("completePiece('anaComplete')"),'ANA no puede completarse como una sola pieza');
assert(!source.includes("if(!flowers.hidden)completeAnaPart('epilogo')"),'A fuego lento no puede completarse solo por mostrar el contenedor de Flores');
console.log('PASS: ANA KLAUDYA requires all 8 sections, visible Flores and parent progress sync');
