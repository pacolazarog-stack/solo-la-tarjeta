const fs=require('node:fs'),path=require('node:path');

function assert(value,message){if(!value)throw Error(message);}
function boot(source,route,storage,options={}){
  const observations=[],mutations=[],events={},children=[];
  class Node{
    constructor(tag='div'){this.tagName=tag;this.className='';this.dataset={};this.style={};this.hidden=false;this.children=[];this.listeners={};this.textContent='';this.attrs={};this.rows={};this.summary=null;
      this.classList={contains:n=>this.className.split(/\s+/).includes(n),add:(...ns)=>{this.className=[...new Set([...this.className.split(/\s+/).filter(Boolean),...ns])].join(' ');},remove:(...ns)=>{this.className=this.className.split(/\s+/).filter(n=>!ns.includes(n)).join(' ');}};
    }
    set innerHTML(s){this.html=s;this.summary=new Node('summary');if(s.includes('data-piece="ana"'))for(const key of ['ana','solo','ceniciento'])this.rows[key]=new Node('li');}
    append(...ns){this.children.push(...ns);}
    appendChild(n){this.append(n);return n;}
    setAttribute(k,v){this.attrs[k]=String(v);}
    addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
    emit(k,e={}){for(const fn of this.listeners[k]||[])fn(e);}
    querySelector(s){if(s==='summary')return this.summary;const p=s.match(/data-piece="(\w+)"/);if(p)return this.rows[p[1]];return null;}
    querySelectorAll(){return [];}
    remove(){}
  }
  const body=new Node('body'),head=new Node('head'),lastLine=new Node('p'),readingEnd=new Node('span'),readerText=new Node('div'),voice=new Node('audio');
  readerText.textContent=options.emptyText?'':'Texto íntegro de prueba.';
  const ids={readerText,voice,anaNavigation:new Node('nav')};
  const walk=(n,p)=>p(n)?n:n.children.map(c=>walk(c,p)).find(Boolean);
  const document={body,head,readyState:'complete',documentElement:{scrollHeight:10000},createElement:t=>new Node(t),getElementById:id=>ids[id]||walk(head,n=>n.id===id)||walk(body,n=>n.id===id)||null,
    querySelector:s=>{
      if(s.startsWith('main article p'))return lastLine;
      if(s==='#readerText + .reading-end')return readingEnd;
      if(s==='script[data-oras-mirror]')return walk(body,n=>n.tagName==='script'&&n.dataset.orasMirror);
      if(s.startsWith('.'))return walk(body,n=>n.classList.contains(s.slice(1)));
      return null;
    },querySelectorAll:()=>[]};
  const win={addEventListener:(k,f)=>{(events[k]??=[]).push(f);},dispatchEvent:e=>{for(const fn of events[e.type]||[])fn(e);},scrollTo(){},location:{}};
  win.parent=win;win.top=win;
  const location={pathname:route.split('?')[0],search:route.includes('?')?'?'+route.split('?')[1]:'',origin:'https://example.test'};
  const localStorage={getItem:k=>{if(options.blocked)throw Error('blocked');return storage.get(k)||null;},setItem:(k,v)=>{if(options.blocked)throw Error('blocked');storage.set(k,v);}};
  class IO{constructor(fn){this.fn=fn;observations.push(this);}observe(n){this.target=n;}disconnect(){this.disconnected=true;}}
  class MO{constructor(fn){this.fn=fn;mutations.push(this);}observe(n){this.target=n;}}
  win.IntersectionObserver=IO;
  class Query{constructor(s){this.parts=String(s).replace(/^\?/,'').split('&');}get(key){const p=this.parts.find(s=>s.split('=')[0]===key);return p?p.slice(key.length+1):null;}}
  class CE{constructor(type){this.type=type;}}
  new Function('window','document','location','localStorage','addEventListener','IntersectionObserver','MutationObserver','requestAnimationFrame','setTimeout','clearTimeout','CustomEvent','scrollY','innerHeight','URLSearchParams',source)(
    win,document,location,localStorage,win.addEventListener,IO,MO,fn=>fn(),()=>1,()=>{},CE,0,800,Query);
  return {body,document,win,voice,readerText,readingEnd,lastLine,storage,
    start:()=>win.dispatchEvent({type:'oras:reading-start'}),
    state:()=>JSON.parse(storage.get('oras.universe.v2')||'{}'),
    box:()=>document.querySelector('.ou-reading-checklist'),
    end:target=>{for(const observer of observations)if(observer.target===target&&!observer.disconnected)observer.fn([{isIntersecting:true,target,intersectionRatio:1}]);},
    anaEnd:()=>{body.classList.add('portrait-revealed');for(const m of mutations)if(m.target===body)m.fn([]);}
  };
}
function run(source){
  const legacy=new Map([['oras.universe.v1',JSON.stringify({anaComplete:true,soloComplete:true,cenicientoComplete:true,cenicientoUnlocked:true})]]);
  const earlySolo=boot(source,'/solo-la-tarjeta/',legacy);earlySolo.end(earlySolo.lastLine);
  assert(!earlySolo.state().soloComplete,'A direct Solo visit before Ana start must not count');
  const earlyCeni=boot(source,'/solo-la-tarjeta/ceniciento/?via=question',legacy);earlyCeni.voice.emit('ended');
  assert(!earlyCeni.state().cenicientoComplete,'Ceniciento cannot count before the journey');
  const ana=boot(source,'/solo-la-tarjeta/elegia-breve/',legacy);
  assert(ana.box().hidden,'Progress is hidden before starting Ana');
  ana.start();
  assert(!ana.box().hidden,'Checklist is visible at the first Ana start');
  for(const key of ['ana','solo','ceniciento'])assert(ana.box().rows[key].dataset.done==='false','No inherited completed row: '+key);
  assert(ana.box().summary.textContent==='Lecturas · 0/3','Initial visible counter must be zero');
  assert(ana.box().rows.solo.textContent==='SOLO LA TARJETA · pendiente','Solo is visibly pending');
  assert(ana.box().rows.ceniciento.textContent==='CENICIENTO · pendiente','Ceniciento is visibly pending');
  assert(ana.state().journeyStartedAt>0,'The journey has an explicit start');
  ana.anaEnd();
  assert(ana.state().anaComplete&&!ana.state().soloComplete&&!ana.state().cenicientoComplete,'Finishing Ana counts only Ana');
  const solo=boot(source,'/solo-la-tarjeta/',legacy);
  assert(!solo.state().soloComplete,'Opening Solo is not completion');
  solo.end(solo.lastLine);
  assert(solo.state().anaComplete&&solo.state().soloComplete&&!solo.state().cenicientoComplete,'Solo completion preserves Ana and leaves Ceniciento pending');
  const direct=boot(source,'/solo-la-tarjeta/ceniciento/',legacy);direct.voice.emit('ended');
  assert(!direct.state().cenicientoComplete,'A direct Ceniciento URL does not count the first reading');
  const ceni=boot(source,'/solo-la-tarjeta/ceniciento/?via=question',legacy,{emptyText:true});
  const nav=ceni.document.querySelector('.ou-ceniciento-endnav');
  nav.children[1].emit('click');
  assert(!ceni.state().cenicientoComplete,'A navigation click is not reading completion');
  ceni.body.classList.add('read');ceni.end(ceni.readingEnd);
  assert(!ceni.state().cenicientoComplete,'Empty reader layout cannot complete Ceniciento');
  ceni.readerText.textContent='La lectura ha llegado al final.';ceni.end(ceni.readingEnd);
  assert(ceni.state().anaComplete&&ceni.state().soloComplete&&ceni.state().cenicientoComplete&&ceni.state().cenicientoUnlocked,'Valid question-route completion persists all three readings');
  assert(!!ceni.document.querySelector('script[data-oras-mirror]'),'Finishing the third reading loads Mirror');
  ana.win.dispatchEvent({type:'storage',key:'oras.universe.v2'});
  assert(ana.box().rows.ceniciento.dataset.done==='true','Parent checklist refreshes after frame storage updates');
  const reread=boot(source,'/solo-la-tarjeta/elegia-breve/',legacy);reread.start();
  assert(reread.state().soloComplete&&reread.state().cenicientoComplete,'Returning to Ana preserves genuine completed readings');
  for(const last of ['ana','solo','ceniciento']){
    const saved={journeyStartedAt:123,anaComplete:last!=='ana',soloComplete:last!=='solo',cenicientoComplete:last!=='ceniciento',cenicientoUnlocked:last!=='ceniciento'};
    const db=new Map([['oras.universe.v2',JSON.stringify(saved)]]);
    const route=last==='ana'?'/solo-la-tarjeta/elegia-breve/':last==='solo'?'/solo-la-tarjeta/':'/solo-la-tarjeta/ceniciento/?via=question';
    const page=boot(source,route,db);
    if(last==='ana')page.anaEnd();else if(last==='solo')page.end(page.lastLine);else page.voice.emit('ended');
    assert(!!page.document.querySelector('script[data-oras-mirror]'),'Mirror begins when the final piece is '+last);
  }
  const indexed=boot(source,'/solo-la-tarjeta/elegia-breve/index.html',new Map());indexed.start();
  assert(indexed.state().journeyStartedAt>0&&indexed.box().summary.textContent==='Lecturas · 0/3','Explicit index.html starts the same journey');
  const invalid=boot(source,'/solo-la-tarjeta/elegia-breve/',new Map([['oras.universe.v2',JSON.stringify({soloComplete:true,cenicientoComplete:true})]]));
  invalid.start();assert(!invalid.state().soloComplete&&!invalid.state().cenicientoComplete,'Completion values without a valid journey start are discarded');
  const memory=boot(source,'/solo-la-tarjeta/elegia-breve/',new Map(),{blocked:true});memory.start();memory.anaEnd();
  assert(!memory.box().hidden&&memory.box().rows.ana.dataset.done==='true','In-memory tracking survives blocked storage during the page visit');
  return 'PASS: clean first start, legacy isolation, actual completion, question gate, frame synchronization, reload persistence and blocked storage';
}

console.log(run(fs.readFileSync(path.join(__dirname,'narrative-universe.js'),'utf8')));
