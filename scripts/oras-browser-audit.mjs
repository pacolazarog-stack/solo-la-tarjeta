import { chromium } from 'playwright';
import fs from 'node:fs';

const base='http://127.0.0.1:4173/';
const shots='browser-audit';
fs.mkdirSync(shots,{recursive:true});

const scenarios=[
  {name:'desktop-cover',viewport:{width:1440,height:1100},path:'./'},
  {name:'desktop-index-0',viewport:{width:1440,height:1100},path:'./?indice=1'},
  {name:'mobile-index-0',viewport:{width:390,height:844},path:'./?indice=1'},
];

const browser=await chromium.launch({headless:true});
let failures=[];
async function seed(page,state){await page.addInitScript(s=>localStorage.setItem('oras.root.v1',JSON.stringify(s)),state);}
async function inspect(page,name){
  const body=await page.locator('body').boundingBox();
  if(!body||body.width<100||body.height<100)failures.push(`${name}: body invisible`);
  const blank=await page.evaluate(()=>document.body.innerText.trim().length===0);
  if(blank)failures.push(`${name}: blank page`);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  if(overflow)failures.push(`${name}: horizontal overflow`);
  await page.screenshot({path:`${shots}/${name}.png`,fullPage:true});
}
for(const s of scenarios){
  const page=await browser.newPage({viewport:s.viewport});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(new URL(s.path,base).href,{waitUntil:'networkidle'});await page.waitForTimeout(500);await inspect(page,s.name);
  if(errors.length)failures.push(`${s.name}: ${errors.join(' | ')}`);await page.close();
}

// SOLO LA TARJETA: preserve the scenic structure rather than a generic text reader.
{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(base+'?read=solo',{waitUntil:'networkidle'});await page.waitForTimeout(900);await inspect(page,'mobile-solo');
  if(await page.locator('.oras-solo-world').count()!==1)failures.push('mobile-solo: scenic world missing');
  if(await page.locator('.solo-dawn-dark,.solo-sunset,.solo-night,.solo-final-moon').count()<4)failures.push('mobile-solo: day/night layers missing');
  if(await page.locator('.solo-copy article p').count()<40)failures.push('mobile-solo: canonical narrative not mounted');
  if(await page.locator('.two-days-passage').count()!==1)failures.push('mobile-solo: two-days passage missing');
  if(await page.locator('.tower-photo img,.photo-layer img').count()<1)failures.push('mobile-solo: photographic layer missing');
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(1200);
  if(await page.locator('[data-next]').isDisabled())failures.push('mobile-solo: next did not unlock at end');
  if(errors.length)failures.push(`mobile-solo: ${errors.join(' | ')}`);await page.close();
}

const lifeReady={version:1,cycleId:1,visited:{solo:true,'ana-prologo':true,'ana-elegia':true,'ana-ojos':true,'ana-labios':true,'ana-cabello':true,'ana-piel':true,'ana-interludio':true},mirror:{available:false,completed:false,crossed:false},realityDeformed:false,audio:{enabled:false,volume:.8}};
const anaCases=[
  ['mobile-ana-prologo','ana-prologo','.oras-ana-stage[data-scene="prologo"]'],
  ['mobile-ana-ojos','ana-ojos','.oras-ana-stage[data-scene="ojos"]'],
  ['mobile-ana-labios','ana-labios','.oras-ana-stage[data-scene="labios"]'],
  ['mobile-ana-cabello','ana-cabello','.oras-ana-stage[data-scene="cabello"]'],
  ['mobile-ana-piel','ana-piel','.oras-ana-stage[data-scene="piel"]'],
  ['mobile-ana-interludio','ana-interludio','.oras-interlude-stage'],
  ['mobile-ana-epilogue','ana-epilogo','.oras-ana-stage[data-scene="epilogo"]']
];
for(const [name,id,selector] of anaCases){
  const page=await browser.newPage({viewport:{width:390,height:844}});await seed(page,lifeReady);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(base+`?read=${id}`,{waitUntil:'networkidle'});await page.waitForTimeout(900);await inspect(page,name);
  if(await page.locator(selector).count()!==1)failures.push(`${name}: scenic stage missing`);
  if(errors.length)failures.push(`${name}: ${errors.join(' | ')}`);await page.close();
}

const completed={version:1,cycleId:1,visited:{solo:true,'ana-prologo':true,'ana-elegia':true,'ana-ojos':true,'ana-labios':true,'ana-cabello':true,'ana-piel':true,'ana-interludio':true,'ana-epilogo':true,ceniciento:true,espejo:true},mirror:{available:true,completed:true,crossed:true},realityDeformed:true,audio:{enabled:false,volume:.8}};
for(const [name,path,viewport] of [
  ['desktop-expansion','./?read=inv-1',{width:1440,height:1100}],
  ['mobile-expansion','./?read=inv-1',{width:390,height:844}],
  ['desktop-archive','./?read=ciu-10',{width:1440,height:1100}],
]){
  const page=await browser.newPage({viewport});await seed(page,completed);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(new URL(path,base).href,{waitUntil:'networkidle'});await page.waitForTimeout(700);await inspect(page,name);
  if(errors.length)failures.push(`${name}: ${errors.join(' | ')}`);await page.close();
}
{
  const state={version:1,cycleId:1,visited:{...completed.visited},mirror:{available:true,completed:false,crossed:false},realityDeformed:false,audio:{enabled:false,volume:.8}};delete state.visited.espejo;
  const page=await browser.newPage({viewport:{width:390,height:844}});await seed(page,state);
  await page.goto(base+'?read=espejo',{waitUntil:'networkidle'});await page.waitForTimeout(700);await inspect(page,'mobile-mirror');
  if(await page.locator('.oras-mirror-scene').count()!==32)failures.push('mobile-mirror: mirror does not render 32 scenes');await page.close();
}

await browser.close();
if(failures.length){console.error('\nBROWSER AUDIT FAILURES\n'+failures.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('ORAS browser audit: OK');
