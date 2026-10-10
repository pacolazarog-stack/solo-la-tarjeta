const fs=require('node:fs');
const assert=require('node:assert/strict');
async function check(source,mode){
  const classes=new Set(),body={dataset:{publication:'web'},children:[],replaceChildren(){this.children=[];},append(n){this.children.push(n);}};
  let timeout,cleared=false,aborted=false,reloaded=false;
  const document={currentScript:{src:'https://example.test/ana-klaudya/publication.js'},readyState:'complete',body,title:'ANA KLAUDYA',
    documentElement:{classList:{add:n=>classes.add(n),remove:n=>classes.delete(n),toggle:(n,on)=>on?classes.add(n):classes.delete(n)}},
    head:{append(){}},querySelectorAll:()=>[],createElement:tag=>({tag,children:[],setAttribute(){},append(...n){this.children.push(...n);},addEventListener(k,fn){this[k]=fn;}})};
  const fetch=()=>mode==='stall'?new Promise(()=>{}):mode==='error'?Promise.reject(Error('network')):Promise.resolve({ok:true,json:async()=>({web:mode!=='disabled',images:true,publicName:true})});
  new Function('document','window','URL','fetch','AbortController','setTimeout','clearTimeout','location',source)(document,{},URL,fetch,class{constructor(){this.signal={};}abort(){aborted=true;}},fn=>{timeout=fn;return 1;},()=>{cleared=true;},{reload(){reloaded=true;}});
  assert(classes.has('publication-pending'));
  if(mode==='stall')timeout();
  for(let i=0;i<15;i++)await Promise.resolve();
  assert(!classes.has('publication-pending'),'Publication must not stay invisible: '+mode);
  assert(cleared);
  if(mode==='stall'||mode==='error'){
    const notice=body.children[0];assert.equal(notice.tag,'section');
    assert.equal(notice.children[1].textContent,'Reintentar');
    notice.children[1].click();assert(reloaded);
    if(mode==='stall')assert(aborted);
  }else if(mode==='disabled')assert.match(body.children[0].textContent,/no está disponible públicamente/);
  else assert.equal(body.children.length,0,'Successful policy preserves the work');
}
async function run(source){for(const mode of ['ok','disabled','error','stall'])await check(source,mode);return 'PASS: publication success, disabled policy, network error and stalled request';}
run(fs.readFileSync(require('node:path').join(__dirname,'ana-klaudya/publication.js'),'utf8')).then(console.log).catch(error=>{console.error(error);process.exitCode=1;});
