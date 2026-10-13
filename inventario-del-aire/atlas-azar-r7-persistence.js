(()=>{
'use strict';

/* ATLAS / AZAR · R7
   La partida desaparece. La huella no.
   Esta capa no sustituye la mecánica ritual R6: la convierte en ArchivoPersistente.
*/

const R6_STORAGE='oras.atlas-azar.v2';
const STORAGE='oras.atlas-persistent.v3';
const MIRROR_STORAGE='oras.atlas.mirror.v1';
const VERSION=3;
const POLL_MS=420;
const MAX_TRACES=320;

const COPY={
  RESONANCIA:[
    'La relación sobrevivió al hecho.',
    'Una frase volvió sin que nadie recordara haberla escrito.',
    'Dos huellas conservaron una relación que el documento ya no explicaba.'
  ],
  INTERFERENCIA:[
    'Tres versiones coinciden. Ninguna describe la misma cosa.',
    'La coincidencia introdujo una contradicción nueva.',
    'La ficha parecía correcta hasta que fue comparada con otra también correcta.'
  ],
  ESPEJO:[
    'La misma huella regresó desde una versión incompatible.',
    'El documento no fue corregido. Fue duplicado en otra lectura.',
    'La relación reapareció invertida.'
  ],
  AUSENCIA:[
    'Una línea dejó de estar visible. Quedó la referencia que demostraba que había existido.',
    'Faltaba una palabra. La frase seguía conservando su hueco.',
    'El Archivo registró una ausencia sin poder restituirla.'
  ],
  'CONTRADICCIÓN':[
    'Ambas versiones permanecen activas.',
    'La corrección no eliminó el error.',
    'Una segunda ficha negó a la primera sin sustituirla.'
  ],
  ORA:[
    'Lo que quedaba continuó produciendo relaciones.',
    'La procedencia desapareció. La capacidad de sentido no.',
    'La huella sobrevivió a casi todo lo que permitía explicarla.'
  ],
  ERROR:[
    'El error fue archivado y comenzó a producir relaciones propias.',
    'Una fecha incorrecta persistió más que su corrección.',
    'Nadie pudo determinar cuándo el registro dejó de ser fiable.'
  ]
};

const MIRROR_VARIANTS=[
  {sceneIndex:0,text:'No era exactamente la misma historia.\nLa otra versión también permanecía.'},
  {sceneIndex:3,text:'Otra con un reloj que no marcaba la misma hora.\nNinguna de las dos fue anulada.'},
  {sceneIndex:20,text:'La tarjeta fue lo único que permaneció.\nLa otra versión afirma lo contrario.'},
  {sceneIndex:28,text:'En una presencia.\nO en la huella que dejó.\nAmbas siguen activas.'}
];

const choice=a=>a[Math.floor(Math.random()*a.length)];
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const now=()=>Date.now();
const coordArray=s=>[Number(s?.coords?.x)||14,Number(s?.coords?.y)||14,Number(s?.coords?.z)||14];
const idFor=n=>`AZ-${String(n).padStart(3,'0')}`;

function readJSON(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)||'null')||fallback;}catch(_){return fallback;}
}
function writeJSON(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));}catch(_){}
}

function readR6(){
  const s=readJSON(R6_STORAGE,{version:2,spins:[]});
  if(!Array.isArray(s.spins))s.spins=[];
  return s;
}

function newState(){
  const r6=readR6();
  return{
    version:VERSION,
    createdAt:now(),
    visit:1,
    baselineR6Ids:r6.spins.map(s=>s.id).filter(Boolean),
    processedR6Ids:r6.spins.map(s=>s.id).filter(Boolean),
    totalActivations:0,
    nextSerial:1,
    traces:[],
    bn01:[],
    echoes:[],
    contamination:{interference:0,ora:0,contradiction:0},
    machineWin:{at:rand(20,30),occurred:false,traceId:null,revealed:false}
  };
}

function loadState(){
  const s=readJSON(STORAGE,null);
  if(!s||s.version!==VERSION||!Array.isArray(s.traces)){
    const fresh=newState();
    writeJSON(STORAGE,fresh);
    return fresh;
  }
  s.visit=(Number(s.visit)||0)+1;
  s.processedR6Ids=Array.isArray(s.processedR6Ids)?s.processedR6Ids:[];
  s.echoes=Array.isArray(s.echoes)?s.echoes:[];
  s.bn01=Array.isArray(s.bn01)?s.bn01:[];
  s.contamination=s.contamination||{interference:0,ora:0,contradiction:0};
  s.machineWin=s.machineWin||{at:rand(20,30),occurred:false,traceId:null,revealed:false};
  writeJSON(STORAGE,s);
  return s;
}

let state=loadState();

function save(){
  state.traces=state.traces.slice(-MAX_TRACES);
  state.echoes=state.echoes.slice(-MAX_TRACES*3);
  state.processedR6Ids=state.processedR6Ids.slice(-MAX_TRACES*2);
  writeJSON(STORAGE,state);
}

function rarity(){
  const r=Math.random()*100;
  if(r<60)return{level:'I',name:'HUELLA'};
  if(r<85)return{level:'II',name:'RESONANCIA_PERSISTENTE'};
  if(r<95)return{level:'III',name:'ALTERACIÓN'};
  if(r<99)return{level:'IV',name:'EVENTO_SINGULAR'};
  return{level:'V',name:'IRRUPCIÓN'};
}

function canonicalResult(spin){
  const [x,y,z]=coordArray(spin);
  if(x===14&&y===14&&z===14)return'INTERFERENCIA';
  return String(spin?.kind||spin?.resultado||'RESONANCIA').toUpperCase();
}

function chooseTargets(result,rar){
  if(result==='ESPEJO')return['Espejo'];
  if(result==='INTERFERENCIA')return rar.level==='I'?['XI']:['XI','XIII'];
  if(result==='AUSENCIA')return rar.level==='IV'?['XI','XII']:['XI'];
  if(result==='CONTRADICCIÓN')return rar.level==='I'?['XIII']:['XIII','Espejo'];
  if(result==='ORA')return rar.level==='I'?['XII']:['XI','XIII','Espejo'];
  if(result==='ERROR')return rar.level==='III'||rar.level==='IV'?['XII','XIII']:['XII'];
  return rar.level==='I'?['XIII']:rar.level==='IV'?['XIII','Espejo']:['XIII'];
}

function echoText(trace,target){
  const id=trace.id;
  const base=choice(COPY[trace.tipo]||COPY.RESONANCIA);
  if(target==='XI'){
    if(trace.tipo==='INTERFERENCIA')return`Observación añadida posteriormente (${id}): La relación seguía activa, pero dos descripciones ya no coincidían.`;
    if(trace.tipo==='AUSENCIA')return`Anotación posterior (${id}): ${base}`;
    return`Nota marginal (${id}): ${base}`;
  }
  if(target==='XII'){
    if(trace.tipo==='ORA')return`Referencia ${id}: clasificación modificada. La huella continúa produciendo relaciones.`;
    return`Referencia ${id}: se añadió un registro que no figuraba en la secuencia anterior. ${base}`;
  }
  if(target==='XIII'){
    if(trace.tipo==='CONTRADICCIÓN')return`${base} El Resonador conserva las dos versiones.`;
    return`Eco ${id}: ${base}`;
  }
  return base;
}

function scheduleEchoes(trace){
  trace.ecosPendientes.forEach((target,i)=>{
    state.echoes.push({
      id:`${trace.id}:${target}:${i}`,
      source:trace.id,
      target,
      text:echoText(trace,target),
      dueSpin:state.totalActivations+rand(2,7)+i,
      dueVisit:state.visit+rand(0,2),
      manifested:false,
      incorporated:false,
      createdAt:now()
    });
  });
}

function applyContamination(trace){
  if(trace.tipo==='INTERFERENCIA')state.contamination.interference=2;
  if(trace.tipo==='ORA')state.contamination.ora=Math.min(6,(state.contamination.ora||0)+2);
  if(trace.tipo==='CONTRADICCIÓN')state.contamination.contradiction=Math.min(6,(state.contamination.contradiction||0)+2);

  if(state.contamination.interference>0&&trace.tipo!=='INTERFERENCIA'){
    trace.contaminaciones.push('INTERFERENCIA');
    trace.ecosPendientes=[...new Set([...trace.ecosPendientes,'XI','XIII'])];
    state.contamination.interference--;
  }
  if(state.contamination.ora>0&&trace.tipo!=='ORA'){
    if(Math.random()<.34){
      trace.contaminaciones.push('ORA');
      trace.ecosPendientes=[...new Set([...trace.ecosPendientes,'XIII'])];
    }
    state.contamination.ora--;
  }
  if(state.contamination.contradiction>0&&trace.tipo!=='CONTRADICCIÓN'){
    if(Math.random()<.38){
      trace.contaminaciones.push('CONTRADICCIÓN');
      trace.ecosPendientes=[...new Set([...trace.ecosPendientes,'Espejo'])];
    }
    state.contamination.contradiction--;
  }
}

function maybeBN01(currentTrace){
  if(state.traces.length<3||Math.random()>=.0075)return;
  const candidates=state.traces.filter(t=>t.id!==currentTrace.id);
  if(!candidates.length)return;
  const target=choice(candidates);
  target.versiones=Array.isArray(target.versiones)?target.versiones:[];
  target.versiones.push({timestamp:now(),texto:target.texto,tipo:target.tipo});
  const mutation=choice([
    'desplazó una coordenada',
    'modificó una resonancia',
    'insertó una ficha',
    'alteró una lectura previa',
    'eliminó una palabra sin eliminar su hueco'
  ]);
  const event={
    id:`BN-${String(state.bn01.length+1).padStart(2,'0')}`,
    kind:'BN-01',
    timestamp:now(),
    targetTraceId:target.id,
    mutation,
    revealVisit:state.visit+rand(1,3),
    revealed:false
  };
  target.alteraciones=Array.isArray(target.alteraciones)?target.alteraciones:[];
  target.alteraciones.push(event.id);
  target.texto=target.texto.replace(/\b(una|un|la|el)\b/i,'').replace(/\s{2,}/g,' ').trim();
  state.bn01.push(event);
  state.echoes.push({
    id:`${event.id}:XII`,source:event.id,target:'XII',
    text:`Una ficha presentaba una modificación mínima. Referencia probable: BN-01.`,
    dueSpin:state.totalActivations+rand(3,8),dueVisit:event.revealVisit,
    manifested:false,incorporated:false,createdAt:now(),bn01:true
  });
  hideLegacyBN();
}

function maybeMachineWin(trace){
  if(state.machineWin.occurred||state.totalActivations<state.machineWin.at)return false;
  state.machineWin.occurred=true;
  state.machineWin.traceId=trace.id;
  trace.latente=true;
  trace.visibleImmediate=false;
  trace.ecosPendientes=['XI','XII','XIII','Espejo'];
  state.echoes=state.echoes.filter(e=>e.source!==trace.id);
  trace.ecosPendientes.forEach((target,i)=>{
    state.echoes.push({
      id:`${trace.id}:WIN:${target}`,
      source:trace.id,target,
      text:target==='XI'?'Una relación apareció en el Archivo sin constar su incorporación.':
           target==='XII'?'Una ficha nueva ocupaba una posición que antes estaba vacía.':
           target==='XIII'?'El Resonador devolvió una frase que no procedía de ninguna ficha visible.':
           'Una versión alternativa apareció sin sustituir a la anterior.',
      dueSpin:state.totalActivations+rand(4,9)+i,
      dueVisit:state.visit+1,
      manifested:false,incorporated:false,createdAt:now(),machineWin:true
    });
  });
  setTimeout(showMachineWin,1250);
  return true;
}

function createTrace(spin){
  state.totalActivations++;
  const serial=state.nextSerial++;
  const tipo=canonicalResult(spin);
  const rar=rarity();
  const trace={
    id:idFor(serial),
    sourceSpinId:spin.id||null,
    origen:'ATLAS_AZAR',
    timestamp:now(),
    coordenada:coordArray(spin),
    tipo,
    resultado:tipo,
    texto:choice(COPY[tipo]||COPY.RESONANCIA),
    rareza:rar.level,
    categoria:rar.name,
    persistente:true,
    ecosPendientes:chooseTargets(tipo,rar),
    ecos:[],
    contaminaciones:[],
    visibleImmediate:true,
    incorporada:false
  };
  applyContamination(trace);
  state.traces.push(trace);
  scheduleEchoes(trace);
  const won=maybeMachineWin(trace);
  if(!won)maybeBN01(trace);
  if(tipo==='INTERFERENCIA'&&trace.coordenada.every(n=>n===14))forceCanonicalCenter();
  save();
  return trace;
}

function hideLegacyBN(){
  document.querySelectorAll('.atlas-r6-bn').forEach(el=>el.classList.remove('is-visible'));
}

function forceCanonicalCenter(){
  const kind=document.querySelector('.atlas-r6-kind');
  const trace=document.querySelector('.atlas-r6-trace');
  if(kind){kind.textContent='INTERFERENCIA';kind.classList.add('is-visible');}
  if(trace){trace.textContent='Tres versiones coinciden. Ninguna describe la misma cosa.';}
}

function showMachineWin(){
  const kind=document.querySelector('.atlas-r6-kind');
  const trace=document.querySelector('.atlas-r6-trace');
  const consequence=document.querySelector('.atlas-r6-consequence');
  if(kind){kind.textContent='NO SE HA REGISTRADO';kind.classList.add('is-visible');}
  if(trace){trace.textContent='NINGUNA CONSECUENCIA';trace.classList.add('is-selected');}
  if(consequence){consequence.textContent='';consequence.classList.remove('is-visible');}
}

function eligibleEchoes(){
  return state.echoes.filter(e=>e.dueSpin<=state.totalActivations&&e.dueVisit<=state.visit);
}

function headingFor(target){
  const candidates=[...document.querySelectorAll('#book h1,#book h2,#book h3,#book h4,#book .chapter-title,#book .chapter-heading,#book [data-title]')];
  const text=e=>(e.textContent||'').toUpperCase().replace(/\s+/g,' ');
  if(target==='XI')return candidates.find(e=>/\bXI\b/.test(text(e))&&text(e).includes('ARCHIVO PROFUNDO'));
  if(target==='XII')return candidates.find(e=>/\bXII\b/.test(text(e))&&text(e).includes('MÁQUINA'));
  if(target==='XIII')return candidates.find(e=>/\bXIII\b/.test(text(e))&&text(e).includes('RESONADOR'));
  return null;
}

function renderEcho(echo){
  if(echo.target==='Espejo'){
    if(!echo.manifested){
      const v=choice(MIRROR_VARIANTS);
      writeJSON(MIRROR_STORAGE,{active:true,sourceSpin:echo.source,sourceEcho:echo.id,createdAt:now(),sceneIndex:v.sceneIndex,text:v.text,multiply:true});
      echo.manifested=true;
      echo.incorporated=true;
    }
    return;
  }
  const h=headingFor(echo.target);
  if(!h)return;
  const id=`atlas-r7-${echo.id.replace(/[^a-z0-9_-]/gi,'-')}`;
  if(document.getElementById(id)){
    echo.manifested=true;echo.incorporated=true;return;
  }
  const note=document.createElement('aside');
  note.id=id;
  note.className='atlas-r7-echo';
  note.dataset.source=echo.source;
  note.innerHTML=`<span>${echo.source}</span><p></p>`;
  note.querySelector('p').textContent=echo.text;
  const scope=h.closest('section,.chapter,.book-section')||h.parentElement;
  if(scope)scope.appendChild(note);else h.insertAdjacentElement('afterend',note);
  echo.manifested=true;
  echo.incorporated=true;
  const t=state.traces.find(x=>x.id===echo.source);
  if(t){t.incorporada=true;t.ecos=Array.isArray(t.ecos)?t.ecos:[];if(!t.ecos.includes(echo.id))t.ecos.push(echo.id);}
}

function revealBNReferences(){
  for(const ev of state.bn01){
    if(!ev.revealed&&state.visit>=ev.revealVisit){
      ev.revealed=true;
    }
  }
}

function renderPersistentArchive(){
  revealBNReferences();
  eligibleEchoes().forEach(renderEcho);
  if(state.machineWin.occurred&&!state.machineWin.revealed){
    const changed=state.echoes.filter(e=>e.machineWin&&e.manifested).length;
    if(changed){state.machineWin.revealed=true;}
  }
  save();
}

function processNewSpins(){
  const r6=readR6();
  let changed=false;
  for(const spin of r6.spins){
    if(!spin?.id||state.processedR6Ids.includes(spin.id))continue;
    state.processedR6Ids.push(spin.id);
    createTrace(spin);
    changed=true;
  }
  hideLegacyBN();
  if(changed)renderPersistentArchive();
}

const mo=new MutationObserver(()=>renderPersistentArchive());
if(document.documentElement)mo.observe(document.documentElement,{childList:true,subtree:true});

processNewSpins();
renderPersistentArchive();
setInterval(()=>{
  processNewSpins();
  renderPersistentArchive();
},POLL_MS);

window.ORAS_ATLAS_R7={
  getState:()=>JSON.parse(JSON.stringify(state)),
  getArchive:()=>JSON.parse(JSON.stringify(state.traces)),
  getEchoes:()=>JSON.parse(JSON.stringify(state.echoes))
};

})();
