import fs from 'node:fs';
import {LEAVES,TOTAL,ANA_IDS,EXPANSION_IDS} from '../content/manifest.js';
import {isUnlocked,anaComplete,mirrorReady,progress} from '../core/progress.js';
import {MIRROR_SCENES} from '../content/mirror-scenes.js';

const fail=m=>{throw new Error(m)};
const assert=(v,m)=>{if(!v)fail(m)};
const leaf=id=>LEAVES.find(x=>x.id===id);
const state=()=>({version:1,cycleId:1,visited:{},mirror:{available:false,completed:false,crossed:false},realityDeformed:false,audio:{enabled:true,volume:.8}});

assert(TOTAL===43,'TOTAL debe ser 43');
assert(LEAVES.length===43,'El manifiesto debe contener 43 hojas');
assert(new Set(LEAVES.map(x=>x.id)).size===43,'Los ids deben ser únicos');
assert(ANA_IDS.length===8,'ANA debe contener 8 hojas');
assert(EXPANSION_IDS.length===32,'La expansión debe contener 32 hojas');
assert(MIRROR_SCENES.length===32,'EL ESPEJO debe contener 32 fragmentos');
assert(leaf('ceniciento')?.exclusive==='interrogante','CENICIENTO debe seguir siendo exclusivo del interrogante');
assert(LEAVES.at(-1)?.id==='zero','La Habitación Número Cero debe ser la hoja final');
assert(LEAVES.findIndex(x=>x.id==='ciu-14')>LEAVES.findIndex(x=>x.id==='ciu-13'),'ATLAS/AZAR debe ir después de La Última Sala');

let s=state();
assert(isUnlocked(leaf('solo'),s),'Solo la tarjeta debe estar abierto en 0/43');
assert(!isUnlocked(leaf('ana-prologo'),s),'ANA no puede abrirse antes de Solo');
assert(!isUnlocked(leaf('espejo'),s),'El Espejo no puede abrirse al inicio');
assert(!isUnlocked(leaf('inv-1'),s),'La expansión no puede abrirse al inicio');

s.visited.solo=true;
for(const id of ANA_IDS)assert(isUnlocked(leaf(id),s),`ANA debe abrirse tras Solo: ${id}`);
for(const id of ANA_IDS)s.visited[id]=true;
assert(anaComplete(s),'ANA debe quedar completa con sus ocho hojas');
assert(!isUnlocked(leaf('ceniciento'),s),'Ceniciento nunca debe abrirse directamente desde el índice');
assert(!mirrorReady(s),'El Espejo no debe abrirse antes de completar Ceniciento y pulsar Seguir');

s.visited.ceniciento=true;
assert(!mirrorReady(s),'Leer Ceniciento no basta: debe existir el gesto Seguir');
s.mirror.available=true;
assert(mirrorReady(s),'El Espejo debe abrirse después de Ceniciento + Seguir');
assert(isUnlocked(leaf('espejo'),s),'El Espejo debe estar desbloqueado');

s.visited.espejo=true;s.mirror.completed=true;s.mirror.crossed=true;s.realityDeformed=true;
assert(isUnlocked(leaf(EXPANSION_IDS[0]),s),'La primera hoja de expansión debe abrirse al cruzar El Espejo');
for(let i=1;i<EXPANSION_IDS.length;i++)assert(!isUnlocked(leaf(EXPANSION_IDS[i]),s),`No debe saltarse la secuencia en ${EXPANSION_IDS[i]}`);

for(let i=0;i<EXPANSION_IDS.length;i++){
  const id=EXPANSION_IDS[i];
  assert(isUnlocked(leaf(id),s),`Debe poder abrirse ${id} cuando le toca`);
  s.visited[id]=true;
  if(i+1<EXPANSION_IDS.length)assert(isUnlocked(leaf(EXPANSION_IDS[i+1]),s),`Completar ${id} debe abrir ${EXPANSION_IDS[i+1]}`);
}
assert(progress(s).done===43,'El recorrido completo debe terminar en 43/43');

const corpus=fs.readFileSync('EL_INVENTARIO_DEL_AIRE_TRILOGIA_CANONICA.md','utf8').trimEnd();
assert(corpus.endsWith('Nadie supo decir desde cuándo.'),'La última frase canónica ha cambiado');
const revised=fs.readFileSync('inventario-del-aire/CAPITULOS_XI_XIII_ORAS.md','utf8');
for(const h of ['XI. LA MÁQUINA DE LAS HUELLAS','XII. EL RESONADOR','XIII. La última sala'])assert(revised.includes(h),`Falta capítulo revisado: ${h}`);
for(const path of ['index.html','oras.js','oras.css','reader.css','expansion.css','core/reader.js','core/index-modal.js','core/audio.js','core/ceniciento.js','core/mirror.js','core/expansion.js','ceniciento/texto.md','ceniciento/CENICIENTO_completo.m4a','assets/oras-el-espejo-centro-de-datos.m4a'])assert(fs.existsSync(path),`Falta recurso esencial: ${path}`);

console.log('ORAS audit OK: continuidad 0/43, exclusividad, umbral, expansión y final canónico.');
