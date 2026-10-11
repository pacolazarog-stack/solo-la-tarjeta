from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

marker='oras-distributed-mirror-memory-v2'
if marker in s:
    print('PASS: memoria distribuida v2 ya presente')
    raise SystemExit(0)

addon=r'''

;(()=>{
  /* oras-distributed-mirror-memory-v2
     EL ESPEJO deja de ser únicamente un destino y se convierte en una
     condición irreversible de relectura. No desbloquea textos, estadísticas
     ni recompensas: modifica de forma microscópica tiempo, temperatura,
     reconocimiento y ausencia. */
  const STATE_KEY='oras.universe.v2';
  const MEMORY_KEY='oras.memory.v2';
  const SESSION_KEY='oras.memory.session.v2';

  const readJson=(key,fallback)=>{
    try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(_){return fallback}
  };
  const writeJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}};
  const state=readJson(STATE_KEY,{});
  if(state?.mirrorReadComplete!==true)return;

  const path=location.pathname.replace(/\/index\.html$/,'/');
  const route=path.includes('/ceniciento')?'ceniciento':path.includes('/elegia-breve')?'ana':'solo';
  const root=document.documentElement;

  const emptyMemory=()=>({
    version:2,
    returns:0,
    lastVisit:0,
    routes:{ana:0,solo:0,ceniciento:0},
    encounters:{eyes:0,card:0,flowers:0,appointment:0,eiffel:0,clock:0,photograph:0}
  });

  let memory=Object.assign(emptyMemory(),readJson(MEMORY_KEY,{}));
  memory.routes=Object.assign(emptyMemory().routes,memory.routes||{});
  memory.encounters=Object.assign(emptyMemory().encounters,memory.encounters||{});

  let newReturn=false;
  try{
    const session=readJson(SESSION_KEY,{routes:{}});
    session.routes=session.routes||{};
    if(!session.started){
      memory.returns=(Number(memory.returns)||0)+1;
      memory.lastVisit=Date.now();
      session.started=true;
      newReturn=true;
    }
    if(!session.routes[route]){
      memory.routes[route]=(Number(memory.routes[route])||0)+1;
      session.routes[route]=true;
    }
    writeJson(MEMORY_KEY,memory);
    sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
  }catch(_){ }

  const depth=Math.max(1,Math.min(3,Number(memory.returns)||1));
  root.classList.add('oras-memory','oras-memory-'+route,'oras-memory-depth-'+depth);
  if(depth>=2)root.classList.add('oras-memory-deep');
  if(depth>=3)root.classList.add('oras-memory-old');

  const style=document.createElement('style');
  style.id='oras-distributed-mirror-memory-style';
  style.textContent=`
    html.oras-memory body::after{
      content:"";position:fixed;inset:0;z-index:2147480000;pointer-events:none;
      background:rgba(190,145,91,.012);mix-blend-mode:multiply;
    }
    html.oras-memory-depth-2 body::after{background:rgba(190,145,91,.020)}
    html.oras-memory-depth-3 body::after{background:rgba(190,145,91,.028)}

    html.oras-memory .oras-memory-recognition{transition-delay:300ms!important}
    html.oras-memory-deep .oras-memory-recognition{transition-delay:450ms!important}
    html.oras-memory .oras-memory-aged{transition-delay:700ms!important}
    html.oras-memory-old .oras-memory-aged{transition-delay:900ms!important}
    html.oras-memory-solo #duskFinalPhrase{transition-delay:700ms!important}
    html.oras-memory-old.oras-memory-solo #duskFinalPhrase{transition-delay:900ms!important}

    /* La memoria de ausencia no añade signos: retira una presencia decorativa,
       únicamente cuando existe un elemento inequívocamente no narrativo. */
    html.oras-memory-deep .oras-memory-absence{
      opacity:0!important;visibility:hidden!important;transition:opacity 1.8s ease!important
    }

    @media (prefers-reduced-motion:reduce){
      html.oras-memory .oras-memory-recognition,
      html.oras-memory .oras-memory-aged,
      html.oras-memory-solo #duskFinalPhrase{transition-delay:0ms!important}
      html.oras-memory-deep .oras-memory-absence{transition:none!important}
    }
  `;
  document.head.appendChild(style);

  const motifs=[
    {key:'eyes',tests:['los ojos de estatua','ojos de estatua']},
    {key:'appointment',tests:['la cita, en cambio, sí','la cita, en cambio, si']},
    {key:'flowers',tests:['flores.']},
    {key:'card',tests:['la tarjeta ya no hacía falta','ahora la tarjeta ya no hacía falta','la tarjeta']},
    {key:'eiffel',tests:['torre eiffel','eiffel']},
    {key:'clock',tests:['reloj']},
    {key:'photograph',tests:['fotografía','fotografia','foto']}
  ];

  const normalize=text=>(text||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const seen=new Set();
  const narrativeSelector='p,blockquote,li,.sintaxis-revelada,.mirror-line,.mirror-scene';

  const register=(key,node)=>{
    const token=route+':'+key;
    if(seen.has(token))return;
    seen.add(token);
    memory.encounters[key]=(Number(memory.encounters[key])||0)+1;
    writeJson(MEMORY_KEY,memory);
    const target=node.closest?.(narrativeSelector)||node;
    target.classList?.add('oras-memory-recognition');
    if(key==='appointment'||key==='flowers'||key==='eyes')target.classList?.add('oras-memory-aged');
  };

  const scan=rootNode=>{
    const nodes=[];
    if(rootNode?.nodeType===1){
      if(rootNode.matches?.(narrativeSelector))nodes.push(rootNode);
      nodes.push(...(rootNode.querySelectorAll?.(narrativeSelector)||[]));
    }
    for(const node of nodes){
      const text=normalize(node.textContent);
      if(!text)continue;
      for(const motif of motifs){
        if(motif.tests.some(test=>text.includes(normalize(test))))register(motif.key,node);
      }
    }
  };

  /* Ausencia controlada: se retira como máximo una estrella puramente
     decorativa y sólo a partir de la segunda relectura posterior al espejo. */
  const applyAbsence=()=>{
    if(depth<2)return;
    const candidates=[...document.querySelectorAll('.star,[data-star],.sky-star,.decorative-star')]
      .filter(node=>node.getAttribute('aria-hidden')==='true'||node.matches('[aria-hidden="true"]'));
    const target=candidates[candidates.length-1];
    if(target)target.classList.add('oras-memory-absence');
  };

  scan(document.body);
  applyAbsence();
  new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType===1){scan(node);applyAbsence()}
      }
    }
  }).observe(document.documentElement,{childList:true,subtree:true});

  /* Punto único de integración para el sonido u otras capas: ninguna de ellas
     necesita volver a consultar el progreso ni crear otra inicialización. */
  window.dispatchEvent(new CustomEvent('oras:memory-active',{detail:{
    route,depth,returns:memory.returns,newReturn,encounters:Object.assign({},memory.encounters)
  }}));
})();
'''

s+=addon
p.write_text(s,encoding='utf-8')
print('PASS: EL ESPEJO distribuido v2 activa reconocimiento, temperatura, envejecimiento, ausencia y memoria de retorno sin contenido nuevo')
