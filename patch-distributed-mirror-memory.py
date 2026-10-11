from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

marker='oras-distributed-mirror-memory-v1'
if marker in s:
    print('PASS: memoria distribuida ya presente')
    raise SystemExit(0)

addon=r'''

;(()=>{
  /* oras-distributed-mirror-memory-v1
     EL ESPEJO no desbloquea contenido nuevo: cambia microscópicamente la
     relectura de lo que ya existía. La memoria vive separada del progreso. */
  const STATE_KEY='oras.universe.v2';
  const MEMORY_KEY='oras.memory.v1';
  const SESSION_KEY='oras.memory.session.v1';

  const readJson=(key,fallback)=>{
    try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(_){return fallback}
  };
  const readState=()=>readJson(STATE_KEY,{});
  const remembered=()=>readState()?.mirrorReadComplete===true;
  if(!remembered())return;

  const root=document.documentElement;
  root.classList.add('oras-memory');

  const path=location.pathname.replace(/\/index\.html$/,'/');
  const route=path.includes('/ceniciento')?'ceniciento':path.includes('/elegia-breve')?'ana':'solo';
  root.classList.add('oras-memory-'+route);

  const emptyMemory=()=>({version:1,returns:0,lastVisit:0,encounters:{eyes:0,card:0,flowers:0,appointment:0}});
  let memory=Object.assign(emptyMemory(),readJson(MEMORY_KEY,{}));
  memory.encounters=Object.assign(emptyMemory().encounters,memory.encounters||{});

  /* Una visita narrativa por sesión, no una estadística de páginas vistas. */
  try{
    if(sessionStorage.getItem(SESSION_KEY)!=='1'){
      memory.returns=(Number(memory.returns)||0)+1;
      memory.lastVisit=Date.now();
      localStorage.setItem(MEMORY_KEY,JSON.stringify(memory));
      sessionStorage.setItem(SESSION_KEY,'1');
    }
  }catch(_){ }

  const style=document.createElement('style');
  style.id='oras-distributed-mirror-memory-style';
  style.textContent=`
    html.oras-memory body::after{
      content:"";position:fixed;inset:0;z-index:2147480000;pointer-events:none;
      background:rgba(190,145,91,.016);mix-blend-mode:multiply;
    }
    html.oras-memory .oras-memory-recognition{
      transition-delay:300ms!important;
    }
    html.oras-memory .oras-memory-aged{
      transition-delay:700ms!important;
    }
    html.oras-memory-solo #duskFinalPhrase{
      transition-delay:700ms!important;
    }
    @media (prefers-reduced-motion:reduce){
      html.oras-memory .oras-memory-recognition,
      html.oras-memory .oras-memory-aged,
      html.oras-memory-solo #duskFinalPhrase{transition-delay:0ms!important}
    }
  `;
  document.head.appendChild(style);

  const motifs=[
    {key:'eyes',tests:['los ojos de estatua']},
    {key:'appointment',tests:['la cita, en cambio, sí']},
    {key:'flowers',tests:['flores.']},
    {key:'card',tests:['la tarjeta ya no hacía falta','ahora la tarjeta ya no hacía falta']}
  ];
  const normalize=text=>(text||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const seen=new Set();

  const register=(key,node)=>{
    const token=route+':'+key;
    if(seen.has(token))return;
    seen.add(token);
    memory.encounters[key]=(Number(memory.encounters[key])||0)+1;
    try{localStorage.setItem(MEMORY_KEY,JSON.stringify(memory))}catch(_){ }
    const target=node.closest?.('p,blockquote,li,.sintaxis-revelada,.mirror-line,.mirror-scene')||node;
    target.classList?.add('oras-memory-recognition');
    if(key==='appointment'||key==='flowers')target.classList?.add('oras-memory-aged');
  };

  const scan=rootNode=>{
    const nodes=[];
    if(rootNode?.nodeType===1)nodes.push(rootNode,...(rootNode.querySelectorAll?.('p,blockquote,li,.sintaxis-revelada,.mirror-line,.mirror-scene')||[]));
    for(const node of nodes){
      const text=normalize(node.textContent);
      if(!text)continue;
      for(const motif of motifs){
        if(motif.tests.some(test=>text.includes(normalize(test))))register(motif.key,node);
      }
    }
  };

  scan(document.body);
  new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType===1)scan(node);
      }
    }
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
'''

s+=addon
p.write_text(s,encoding='utf-8')
print('PASS: EL ESPEJO distribuido activa memoria de relectura sin contenido nuevo')
