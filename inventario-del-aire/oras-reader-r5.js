(()=>{
'use strict';

const book=document.getElementById('book');
const stage=document.getElementById('photoStage');
if(!book||!stage)return;

const TRANSITIONS=['tr-down','tr-left','tr-fade','tr-up','tr-right','tr-flash'];
const PHOTOS={
  house:{
    house:'./assets-r2/i1-llegada.avif',
    entry:'./assets-r4/house/01-recibidor.webp',
    clock:'./assets-r4/house/02-reloj.webp',
    kitchen:'./assets-r4/house/03-cocina.webp',
    corridor:'./assets-r4/house/04-pasillo.webp',
    bedroom:'./assets-r4/house/05-dormitorio.webp',
    garden:'./assets-r4/house/06-jardin.webp',
    inventory:'./assets-r4/house/07-inventario.webp',
    exit:'./assets-r4/house/08-salida.webp'
  },
  train:{
    train:'./assets-r4/train/01-estacion.webp',
    station:'./assets-r4/train/01-estacion.webp',
    inspector:'./assets-r4/train/02-revisor.webp',
    shadows:'./assets-r4/train/03-sombras.webp',
    'row-seven':'./assets-r4/train/04-fila-siete.webp',
    conversation:'./assets-r4/train/05-conversacion.webp',
    'mobile-inventory':'./assets-r4/train/06-inventario-ausencias-moviles.webp',
    workshop:'./assets-r4/train/07-taller.webp',
    office:'./assets-r4/train/08-oficio.webp',
    'last-journey':'./assets-r4/train/09-ultimo-recorrido.webp'
  },
  city:{
    city:'./assets-r4/city/01-plaza.webp',
    plaza:'./assets-r4/city/01-plaza.webp',
    archivist:'./assets-r4/city/02-archivero.webp',
    fountain:'./assets-r4/city/03-fuente.webp',
    resisters:'./assets-r4/city/04-resistentes.webp',
    map:'./assets-r4/city/05-mapa-imposible.webp',
    theory:'./assets-r4/city/06-teoria.webp',
    museum:'./assets-r4/city/07-museo.webp',
    visitor:'./assets-r4/city/08-visitante.webp',
    winter:'./assets-r4/city/09-invierno.webp',
    'last-room':'./assets-r4/city/10-ultima-sala.webp',
    'deep-archive':'./assets-r4/city/10-ultima-sala.webp',
    'trace-machine':'./assets-r4/city/07-museo.webp',
    atlas:'./assets-r4/city/07-museo.webp',
    resonator:'./assets-r4/city/09-invierno.webp'
  },
  zero:{zero:'./assets-r4/zero/01-habitacion-cero.webp'}
};

const CHAPTERS=[
  {key:'deep-archive',title:'XI. EL ARCHIVO PROFUNDO',paragraphs:[
    'El problema de los archivos era sencillo. Conservaban las cosas. No conservaban aquello que las unía.',
    'Durante años, el museo había reunido fotografías, cuadernos, objetos domésticos, planos, cartas, testimonios grabados y listas de inventario. Las salas crecían. Los depósitos crecían. Los catálogos crecían. Y, sin embargo, algo seguía faltando. Nadie sabía exactamente qué.',
    'El archivero empezó a sospecharlo una tarde de invierno. Estaba revisando tres fichas aparentemente inconexas. La primera describía una silla desplazada unos centímetros respecto a una mesa. La segunda registraba una fotografía en la que aparecía una ventana cerrada. La tercera mencionaba un botón de nácar hallado en una caja sin identificar. No tenían relación. No compartían fecha. No compartían procedencia. No compartían contexto. Pero al leerlas seguidas tuvo la sensación de que estaban hablando de la misma ausencia. La intuición le pareció absurda. Intentó olvidarla. No pudo.',
    'Durante semanas revisó expedientes antiguos. Encontró referencias dispersas. Notas incompletas. Anotaciones marginales. Correcciones realizadas por personas que ya no trabajaban allí. En varias ocasiones apareció la misma expresión. Archivo Profundo. Nunca figuraba una localización. Nunca una descripción. Nunca un responsable. Al principio pensó que se trataba de una denominación provisional. Después creyó que era una sección desaparecida. Más tarde consideró que quizá nunca hubiera existido. Las tres hipótesis resultaron insuficientes. El Archivo Profundo aparecía con demasiada frecuencia para ser una invención. Y con demasiada ambigüedad para ser un lugar normal.',
    'Una madrugada encontró un memorando sin fecha. Sólo contenía seis líneas: El Museo conserva objetos. El Archivo Profundo conserva relaciones. No confundir ambos fondos. La diferencia es esencial. Las pérdidas comienzan cuando deja de comprenderse. No destruir.',
    'No había firma. El archivero leyó el documento varias veces. Después volvió a examinar las fichas. La silla. La ventana. El botón. De repente comprendió el problema. El museo catalogaba cosas. La memoria rara vez recordaba cosas. La memoria recordaba conexiones. Una silla junto a una mesa. Una ventana observada desde una cocina. Un botón cosido a una camisa. Cuando desaparecían las relaciones, los objetos sobrevivían sólo como materia. El museo conservaba los restos. La memoria había desaparecido mucho antes.',
    'A partir de entonces comenzó una investigación sistemática. Encontró más referencias. Ninguna era completamente coherente. Algunas describían el Archivo Profundo como una dependencia subterránea. Otras como una categoría documental. Otras parecían considerarlo un procedimiento. Un texto especialmente deteriorado afirmaba: El Archivo Profundo no es un lugar. Es una forma de clasificar lo que permanece cuando las clasificaciones fracasan.',
    'Durante meses intentó establecer una definición definitiva. Fracasó. La imposibilidad terminó por convencerlo de que estaba cerca de la verdad. Las cosas fáciles de definir pertenecían al museo. Las difíciles parecían pertenecer al Archivo Profundo.',
    'Una noche encontró un plano. Mostraba todas las salas conocidas. Los depósitos. Las oficinas. Los almacenes. Los talleres de restauración. Y un espacio sin numeración. No tenía puertas. No tenía medidas. No tenía escala. Sólo una inscripción escrita a lápiz. Archivo Profundo. El archivero contempló el plano durante varios minutos. Después lo archivó. No porque hubiera resuelto el enigma. Porque acababa de comprender que el enigma era el propio archivo.'
  ]},
  {key:'trace-machine',title:'XII. LA MÁQUINA DE LAS HUELLAS',paragraphs:[
    'La máquina no parecía una máquina. Ésa fue la primera dificultad. Quienes esperaban engranajes encontraban estanterías. Quienes esperaban estanterías encontraban diagramas. Quienes buscaban diagramas encontraban listas. Nadie regresaba con una descripción idéntica.',
    'El archivero la descubrió al final de un corredor que no figuraba en ningún plano actualizado. La estancia estaba vacía. O casi vacía. En el centro había una estructura imposible de clasificar. No era grande. No imponía respeto. No producía ruido. No emitía luz. Parecía esperar.',
    'La mesa de control estaba cubierta por fichas. Miles de fichas. Algunas describían objetos. Otras contenían nombres. Otras recogían errores documentales. Había incluso tarjetas dedicadas a contradicciones. Durante varios días examinó el material. Todas las fichas compartían una característica. Ninguna estaba dedicada a una cosa aislada. Cada una describía una relación. Un nombre asociado a una fotografía. Un objeto vinculado a una ausencia. Una fecha incompatible con un testimonio. Un error que sobrevivía mejor que los documentos que lo habían originado. La lógica resultaba extraña. Pero también familiar. Era exactamente la lógica que había sospechado en el Archivo Profundo.',
    'Entonces encontró un cuaderno. Sólo contenía esquemas. No había explicaciones. En una página aparecía un cubo. Tres ejes. MATERIALIDAD. INSCRIPCIÓN. SOMBRA. El centro estaba señalado. 14,14,14. Junto a él alguien había escrito: Máxima ambigüedad.',
    'En otra página aparecían palabras distribuidas alrededor del esquema. ECO. AUSENCIA. ERROR. SOMBRA. TESTIMONIO. ESPEJO. CONTRADICCIÓN. No parecían categorías. Parecían fuerzas. Como si la memoria estuviera compuesta por tensiones invisibles.',
    'El archivero siguió leyendo. La letra cambiaba cada pocas páginas. Distintas personas habían trabajado sobre el mismo documento. Algunas anotaciones eran incompatibles entre sí. Nadie había intentado corregirlas. Todas permanecían. La contradicción parecía formar parte del método.',
    'Los últimos folios hablaban del Resonador. No estaba claro si era un mecanismo. Un procedimiento. Un programa. O una teoría. Las descripciones diferían. Sin embargo, todas coincidían en un punto. El Resonador operaba únicamente sobre huellas. Nunca sobre hechos completos. Una huella era suficiente. Una sombra bastaba. Una ausencia incluso podía resultar útil. La desaparición absoluta, en cambio, impedía cualquier operación.',
    'Por primera vez apareció una referencia indirecta a una región excluida. No se mencionaba su nombre. Sólo la condición que la definía: Allí donde ya no queda ninguna huella, el Resonador no puede trabajar.',
    'El archivero comprendió que estaba leyendo los límites del sistema. No sus capacidades. Sus límites. La diferencia lo inquietó. Toda tecnología prometía ampliar lo posible. Aquella parecía diseñada para delimitar lo imposible.',
    'Continuó avanzando entre fichas y diagramas. En una carpeta encontró una nota aislada. No llevaba firma. No llevaba fecha. No llevaba sello del museo. Sólo una frase. La leyó una vez. Después otra. Y otra más. Decía: El Resonador no conserva nada. No recupera nada. No explica nada. Produce formas temporales de sentido.',
    'El archivero cerró la carpeta. Durante varios minutos permaneció inmóvil. La máquina seguía en silencio. El museo también. Y por primera vez sospechó que todo lo que había visto hasta entonces no era más que una preparación. Algo permanecía fuera del sistema. Algo que ni el Archivo Profundo ni la Máquina de las Huellas podían alcanzar. Todavía no conocía su nombre. Pero ya avanzaba hacia él.'
  ]},
  {key:'resonator',title:'XIII. EL RESONADOR',paragraphs:[
    'Durante varios días el archivero no tocó la máquina. La observaba. No había interruptores. Ni pantallas. Ni instrucciones. Sólo fichas. Miles de fichas. Al principio creyó que estaban incompletas. Después comprendió que la incompletitud era deliberada. No describían cosas. Describían relaciones. Una fotografía que contradecía un inventario. Un nombre escrito de cuatro maneras distintas. Una llave presente en tres testimonios y ausente de todos los registros. Un error repetido durante décadas. La máquina parecía interesarse menos por los hechos que por las tensiones entre ellos.',
    'Una mañana reunió varias fichas sobre la mesa. Una silla. Una fotografía. Un testimonio. Aparecieron unas líneas. Finas. Casi invisibles. Unían documentos aparentemente inconexos. Al mover una ficha, cambiaban. La máquina no explicaba. Relacionaba.',
    'Entre los documentos encontró un cuaderno. En una página aparecía un cubo. Tres ejes. MATERIALIDAD. INSCRIPCIÓN. SOMBRA. En el centro: 14,14,14. Debajo: Máxima ambigüedad. Las fichas también tenían tres números. Comprendió entonces que no eran registros. Eran posiciones. Estados. Cuánto quedaba de algo. Cuánto estaba inscrito. Cuánto se había alejado de aquello que alguna vez fue.',
    'Comenzó a experimentar. A veces aparecía una palabra. ECO. O: AUSENCIA. ERROR. CONTRADICCIÓN. Una vez: ESPEJO. La palabra permaneció unos segundos. Después desapareció.',
    'El objeto decisivo fue un botón de nácar. Una ficha incompleta. Sin fecha. Sin propietario. Sin procedencia. Añadió otra huella. Después otra. Después una nota marginal: Ella siempre cosía los botones dos veces. La mesa se llenó de líneas. Apareció una palabra. RESONANCIA. Y luego un texto: Hubo un botón. La camisa desapareció antes. Nadie recuerda quién la llevaba. La costura sobrevivió en una frase. Por eso el museo conservó la duda.',
    'El archivero buscó aquellas frases. No estaban en ninguna ficha. Los elementos sí. La frase no. No había sido recuperada. Había surgido.',
    'Continuó trabajando durante semanas. Aprendió que el Resonador no producía respuestas. Producía estados. A veces un poema. A veces una contradicción. A veces nada.',
    'Una tarde alcanzó el centro del esquema. 14,14,14. Las líneas desaparecieron. Después apareció un único mensaje: [INTERFERENCIA DETECTADA] Tres versiones coinciden. Ninguna describe la misma cosa. Comprendió entonces que aquel punto no era el centro del conocimiento. Era el centro de la ambigüedad.',
    'Más tarde intentó explorar el límite del sistema. Introdujo fichas vacías. Sin objeto. Sin descripción. Sin huella. La máquina no respondió. Finalmente apareció una frase. NO EXISTEN HUELLAS SUFICIENTES. Entonces comprendió el verdadero límite del sistema. Incluso una ausencia necesita una huella. Algo que permita afirmar: aquí faltaba algo. Sin eso no había operación posible. Ni resonancia. Ni sombra. Ni memoria.',
    'Aquella noche cerró el cuaderno. La máquina permaneció inmóvil. Como siempre. Pero ya no interpretó el silencio como inactividad. Sino como espera. Esperaba una huella. Una relación. Una tensión. Algo suficiente para comenzar. Y comprendió por fin la inscripción encontrada meses atrás: El Resonador no conserva nada. No recupera nada. No explica nada. Produce formas temporales de sentido.'
  ]}
];

let panels=[];
let layers=[...stage.querySelectorAll('.photo-layer')];
let activeLayer=0;
let activePanel=null;
let resizeTimer=0;

function injectChapters(){
  if(book.querySelector('[data-chapter="deep-archive"]'))return;
  const epilogue=book.querySelector('.volume-label.epilogue')||book.querySelector('[data-world-marker="zero"]');
  if(!epilogue)return;
  const frag=document.createDocumentFragment();
  for(const chapter of CHAPTERS){
    const h=document.createElement('h3');h.dataset.chapter=chapter.key;h.dataset.chapterWorld='city';h.textContent=chapter.title;frag.appendChild(h);
    chapter.paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;frag.appendChild(p);});
  }
  book.insertBefore(frag,epilogue);
}

function randomSeed(){const key='oras-r5-transition-seed';let n=Number(sessionStorage.getItem(key));if(!Number.isFinite(n)||!n){n=Math.floor(Math.random()*2147483646)+1;sessionStorage.setItem(key,String(n));}return n;}
function randFactory(seed){let s=seed%2147483647;return()=>{s=s*16807%2147483647;return(s-1)/2147483646};}
const rnd=randFactory(randomSeed());
function nextTransition(prev){const choices=TRANSITIONS.filter(x=>x!==prev);return choices[Math.floor(rnd()*choices.length)]||'tr-fade';}

function panelMeta(panel){const heading=panel.querySelector('[data-chapter], [data-world-marker]');let world='house',chapter='house';if(heading){world=heading.dataset.chapterWorld||heading.dataset.worldMarker||world;chapter=heading.dataset.chapter||heading.dataset.worldMarker||world;}return{world,chapter};}

function wrapPanels(){
  if(book.querySelector('.story-panel')){panels=[...book.querySelectorAll('.story-panel')];return;}
  const nodes=[...book.children];const frag=document.createDocumentFragment();let panel=null,pending=[],prevTr='';
  for(const node of nodes){
    const starts=node.matches('h1,h2,h3[data-chapter]');const isLabel=node.classList?.contains('volume-label');
    if(isLabel){pending.push(node);continue;}
    if(starts){panel=document.createElement('section');panel.className='story-panel';const copy=document.createElement('div');copy.className='panel-copy';pending.splice(0).forEach(n=>copy.appendChild(n));copy.appendChild(node);panel.appendChild(copy);const meta=panelMeta(panel);panel.dataset.world=meta.world;panel.dataset.chapter=meta.chapter;prevTr=nextTransition(prevTr);panel.dataset.transition=prevTr;frag.appendChild(panel);continue;}
    if(!panel){panel=document.createElement('section');panel.className='story-panel';const copy=document.createElement('div');copy.className='panel-copy';panel.appendChild(copy);prevTr=nextTransition(prevTr);panel.dataset.transition=prevTr;panel.dataset.world='house';panel.dataset.chapter='house';frag.appendChild(panel);}
    panel.querySelector('.panel-copy').appendChild(node);
  }
  pending.forEach(n=>panel?.querySelector('.panel-copy')?.appendChild(n));book.replaceChildren(frag);panels=[...book.querySelectorAll('.story-panel')];document.documentElement.classList.add('oras-reader-active');document.body.classList.add('oras-reader-active');
}

function atlasMarkup(){return `<div class="atlas-r5" aria-label="Atlas y Azar de la Máquina de las Huellas"><div class="atlas-r5-title">ATLAS / AZAR</div><div class="atlas-r5-grid"><div class="atlas-r5-map"><div id="atlasR5Map"></div><div class="atlas-r5-caption">27 × 27 · X MATERIALIDAD · Y INSCRIPCIÓN · Z SOMBRA</div></div><div class="atlas-r5-console"><div class="atlas-r5-coordinate"><span>Coordenadas</span><strong id="atlasR5Coord">(14,14,14)</strong><small id="atlasR5State">Centro · máxima ambigüedad</small></div><div class="atlas-r5-controls"><label>X <input id="atlasR5X" type="range" min="1" max="27" value="14"><b id="atlasR5XV">14</b></label><label>Y <input id="atlasR5Y" type="range" min="1" max="27" value="14"><b id="atlasR5YV">14</b></label><label>Z <input id="atlasR5Z" type="range" min="1" max="27" value="14"><b id="atlasR5ZV">14</b></label></div><div class="atlas-r5-buttons"><button data-atlas-act="random">AZAR</button><button data-atlas-act="center">CENTRO</button><button data-atlas-act="mirror">ESPEJO</button><button data-atlas-act="pearl">BOTÓN DE NÁCAR</button></div><div class="atlas-r5-seq">X → Y → CENTRO → Z</div><button class="atlas-r5-resonate" data-atlas-act="resonate">ACTIVAR RESONANCIA</button><div class="atlas-r5-output" id="atlasR5Output">La máquina espera una huella.</div></div></div></div>`;}

function insertAtlasPanel(){const trace=panels.find(p=>p.dataset.chapter==='trace-machine');const resonator=panels.find(p=>p.dataset.chapter==='resonator');if(!trace||!resonator||book.querySelector('[data-chapter="atlas"]'))return;const panel=document.createElement('section');panel.className='story-panel atlas-panel';panel.dataset.world='city';panel.dataset.chapter='atlas';panel.dataset.transition='tr-fade';const copy=document.createElement('div');copy.className='panel-copy';copy.innerHTML=atlasMarkup();panel.appendChild(copy);book.insertBefore(panel,resonator);panels=[...book.querySelectorAll('.story-panel')];setupAtlas(panel);}

function setupAtlas(panel){
  const $=s=>panel.querySelector(s);const state={x:14,y:14,z:14};let history=[{...state}];const rand=n=>Math.floor(Math.random()*n)+1;const mirror=p=>({x:28-p.x,y:28-p.y,z:28-p.z});const band=z=>z<=4?'PRESENTE':z<=8?'ATENUADO':z<=12?'DOCUMENTAL':z<=16?'INDIRECTO':z<=20?'RESIDUAL':'UMBRAL';const words=['ECO','CONTRADICCIÓN','SUSTITUCIÓN','PROCEDENCIA','TESTIMONIO','BORRADO','ERROR','ESPEJO','CONTAGIO','AUSENCIA','REAPARICIÓN','DUPLICADO','SOMBRA'];const objects=['botón de nácar','tarjeta usada','fotografía doblada','silla desplazada','llave sin puerta','reloj detenido','vaso vacío','carta incompleta','espejo pequeño','fragmento de mapa','entrada de cine','etiqueta arrancada','pañuelo olvidado','plato sin pareja','cuaderno húmedo','nombre borrado','planta crecida','puerta azul','ventana cerrada','maleta antigua','billete perforado','miga de pan','caja anónima','señal oxidada','archivo perdido','lámpara apagada','huella irreconocible'];const relation=p=>words[(p.x+p.y+p.z-3)%words.length];
  const svg=()=>{const p=state,m=mirror(p),g=8,o=12,w=o*2+27*g,c=v=>o+(v-1)*g+g/2,cy=v=>o+(27-v)*g+g/2;let s=`<svg viewBox="0 0 ${w} ${w}" role="img" aria-label="Atlas 27 por 27, posición ${p.x}, ${p.y}, sombra ${p.z}">`;for(let i=0;i<=27;i++){const q=o+i*g;s+=`<path d="M${o} ${q}H${o+27*g} M${q} ${o}V${o+27*g}" class="atlas-grid-line"/>`;}if(history.length>1)s+=`<polyline class="atlas-history" points="${history.map(h=>`${c(h.x)},${cy(h.y)}`).join(' ')}"/>`;s+=`<circle class="atlas-center" cx="${c(14)}" cy="${cy(14)}" r="4"/><circle class="atlas-mirror" cx="${c(m.x)}" cy="${cy(m.y)}" r="5"/><circle class="atlas-current" cx="${c(p.x)}" cy="${cy(p.y)}" r="5.5"/>`;return s+'</svg>';};
  function render(){['x','y','z'].forEach(k=>{$('#atlasR5'+k.toUpperCase()).value=state[k];$('#atlasR5'+k.toUpperCase()+'V').textContent=state[k]});$('#atlasR5Coord').textContent=`(${state.x},${state.y},${state.z})`;$('#atlasR5State').textContent=state.x===14&&state.y===14&&state.z===14?'Centro · máxima ambigüedad':`${band(state.z)} · ${relation(state)}`;$('#atlasR5Map').innerHTML=svg();}
  function set(p){Object.assign(state,p);history.push({...state});history=history.slice(-24);render();}
  ['X','Y','Z'].forEach(k=>$('#atlasR5'+k).addEventListener('input',e=>{state[k.toLowerCase()]=+e.target.value;history.push({...state});history=history.slice(-24);render();}));
  panel.addEventListener('click',e=>{const act=e.target.closest('[data-atlas-act]')?.dataset.atlasAct;if(!act)return;if(act==='random')set({x:rand(27),y:rand(27),z:rand(27)});else if(act==='center')set({x:14,y:14,z:14});else if(act==='mirror')set(mirror(state));else if(act==='pearl')set({x:1,y:14,z:9+Math.floor(Math.random()*9)});else if(act==='resonate'){const out=$('#atlasR5Output');if(state.x===14&&state.y===14&&state.z===14)out.textContent='[INTERFERENCIA DETECTADA]\nTres versiones coinciden.\nNinguna describe la misma cosa.';else if(state.x===1)out.textContent=['Hubo un botón.\nLa camisa desapareció antes.','El botón sobrevivió a la prenda.','Sólo quedó la costura.','No sabemos qué camisa perdió el botón.\nY, sin embargo, el botón sigue diciendo cosas.'][Math.floor(Math.random()*4)];else out.textContent=`Hubo un ${objects[state.x-1]}.\nSombra: ${band(state.z)}.\nRelación: ${relation(state)}.`;}});render();
}

function splitWords(){for(const panel of panels){if(panel.classList.contains('atlas-panel'))continue;for(const el of [...panel.querySelectorAll('h1,h2,h3,.volume-label,p')]){if(el.dataset.displayReady)continue;const text=el.textContent||'';el.dataset.displayReady='1';el.setAttribute('aria-label',text);const words=text.trim().split(/\s+/).filter(Boolean);el.textContent='';words.forEach((w,i)=>{const s=document.createElement('span');s.className='display-word';s.textContent=w;el.appendChild(s);if(i<words.length-1)el.appendChild(document.createTextNode(' '));});}}}
function assignTimings(){for(const panel of panels){if(panel.classList.contains('atlas-panel'))continue;const words=[...panel.querySelectorAll('.display-word')];let currentTop=null,row=-1,pos=0;for(const w of words){const top=Math.round(w.getBoundingClientRect().top);if(currentTop===null||Math.abs(top-currentTop)>3){currentTop=top;row++;pos=0;}const delay=row*.48+pos*.035;w.style.setProperty('--reveal-delay',delay.toFixed(3)+'s');pos++;}}}
function setupReading(){const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-reading');io.unobserve(e.target);}}},{threshold:.55,rootMargin:'-4% 0px -4% 0px'});panels.forEach(p=>io.observe(p));}
function resetLayer(layer){layer.className='photo-layer';layer.style.removeProperty('background-image');layer.style.removeProperty('background-position');layer.style.removeProperty('z-index');}
function photoFor(panel){const world=panel?.dataset.world||'house';const chapter=panel?.dataset.chapter||world;return PHOTOS[world]?.[chapter]||PHOTOS[world]?.[world]||'';}
function applyPanelPhoto(layer,panel){resetLayer(layer);const url=photoFor(panel);if(!url)return false;layer.style.backgroundImage=`url("${url}")`;layer.style.backgroundPosition='center center';return true;}
function preloadAround(panel){const i=panels.indexOf(panel);[i-1,i,i+1].forEach(n=>{const p=panels[n];if(!p)return;const u=photoFor(p);if(u){const img=new Image();img.decoding='async';img.src=u;}});}
function worldProgress(panel){const world=panel?.dataset.world||'house';const group=panels.filter(p=>(p.dataset.world||'house')===world);const index=Math.max(0,group.indexOf(panel));return group.length>1?index/(group.length-1):0;}
function syncWorldState(panel){if(!panel)return;const world=panel.dataset.world||'house';const chapter=panel.dataset.chapter||world;const progress=worldProgress(panel);document.body.dataset.world=world;document.body.dataset.chapter=chapter;document.documentElement.style.setProperty('--world-progress',progress.toFixed(4));document.documentElement.style.setProperty('--erosion',(world==='city'?progress:0).toFixed(4));document.documentElement.style.setProperty('--zero-progress',(world==='zero'?progress:0).toFixed(4));document.body.classList.toggle('final-withdrawal',world==='zero'&&progress>.78);}
function refreshActivePhoto(){if(!activePanel)return;const layer=layers[activeLayer];const current=layer.classList.contains('bg-current');const ok=applyPanelPhoto(layer,activePanel);if(current)layer.classList.add('bg-current');document.body.classList.toggle('r4-photo-active',ok);}
function showBackground(panel){if(!panel)return;syncWorldState(panel);preloadAround(panel);if(panel===activePanel)return;activePanel=panel;const tr=panel.dataset.transition||'tr-fade';document.body.dataset.panelTransition=tr;const nextIndex=1-activeLayer,incoming=layers[nextIndex],outgoing=layers[activeLayer];const hasPhoto=applyPanelPhoto(incoming,panel);document.body.classList.toggle('r4-photo-active',hasPhoto);if(!hasPhoto){outgoing.classList.remove('bg-enter');outgoing.classList.add('bg-exit');setTimeout(()=>resetLayer(outgoing),1000);return;}incoming.classList.add('bg-enter',tr);incoming.style.zIndex='2';outgoing.classList.remove('bg-enter');outgoing.classList.add('bg-exit');outgoing.style.zIndex='1';setTimeout(()=>{resetLayer(outgoing);incoming.classList.remove('bg-enter',tr);incoming.classList.add('bg-current');incoming.style.zIndex='1';activeLayer=nextIndex;},1600);}
function syncPanel(){if(!panels.length)return;const targetY=innerHeight*.5;let chosen=panels[0],best=Infinity;for(const p of panels){const r=p.getBoundingClientRect();const d=Math.abs((r.top+r.height*.5)-targetY);if(d<best){best=d;chosen=p;}}showBackground(chosen);}
function start(){injectChapters();wrapPanels();insertAtlasPanel();splitWords();requestAnimationFrame(()=>requestAnimationFrame(()=>{assignTimings();setupReading();syncPanel();}));let pending=false;addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;syncPanel();});},{passive:true});addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{assignTimings();refreshActivePhoto();syncPanel();},180);},{passive:true});}
if(book.classList.contains('ready'))start();else{const mo=new MutationObserver(()=>{if(book.classList.contains('ready')){mo.disconnect();start();}});mo.observe(book,{attributes:true,attributeFilter:['class']});}
})();