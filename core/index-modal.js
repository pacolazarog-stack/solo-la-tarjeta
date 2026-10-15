import {LEAVES,ANA_IDS} from '../content/manifest.js';
import {loadState,resetCycle} from './state.js';
import {progress,isUnlocked,anaComplete,mirrorReady} from './progress.js';
import {go,continueReading} from './router.js';

let host=null;
let activeGroup=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=id=>LEAVES.find(x=>x.id===id);

const GROUPS=[
  {id:'vida',title:'SOLO LA TARJETA',ids:['solo']},
  {id:'ana',title:'ANA KLAUDYA',ids:ANA_IDS},
  {id:'ceniciento',title:'CENICIENTO',ids:['ceniciento'],exclusive:true},
  {id:'umbral',title:'EL ESPEJO',ids:['espejo']},
  {id:'inventario',title:'EL INVENTARIO DEL AIRE',ids:LEAVES.filter(x=>x.section==='inventario').map(x=>x.id)},
  {id:'sombras',title:'EL OFICIO DE LAS SOMBRAS',ids:LEAVES.filter(x=>x.section==='sombras').map(x=>x.id)},
  {id:'ciudad',title:'LA CIUDAD QUE APRENDIÓ A OLVIDAR',ids:LEAVES.filter(x=>x.section==='ciudad').map(x=>x.id)},
  {id:'archivero',title:'EL ARCHIVERO',ids:LEAVES.filter(x=>x.section==='archivero').map(x=>x.id)},
  {id:'cero',title:'EL CERO',ids:LEAVES.filter(x=>x.section==='cero').map(x=>x.id)}
];

function groupVisible(group,state){
  if(group.id==='vida')return true;
  if(group.id==='ana')return !!state.visited.solo;
  if(group.id==='ceniciento')return anaComplete(state)||!!state.visited.ceniciento;
  if(group.id==='umbral')return mirrorReady(state)||!!state.visited.espejo;
  return group.ids.some(id=>state.visited[id]||isUnlocked(byId(id),state));
}
function groupDone(group,state){return group.ids.every(id=>!!state.visited[id]);}
function groupOpen(group,state){return group.ids.some(id=>isUnlocked(byId(id),state)&&byId(id)?.exclusive!=='interrogante');}
function radial(items,renderItem){
  const n=Math.max(1,items.length);
  return items.map((item,i)=>{
    const a=(i/n)*Math.PI*2-Math.PI/2;
    const x=50+41*Math.cos(a),y=50+41*Math.sin(a);
    return renderItem(item,x,y);
  }).join('');
}
function renderGroupWheel(state){
  const groups=GROUPS.filter(g=>groupVisible(g,state));
  return radial(groups,(group,x,y)=>{
    const done=groupDone(group,state),open=groupOpen(group,state),locked=group.exclusive||!open;
    const cls=['oras-wheel-item','oras-wheel-group',done?'is-done':'',open&&!group.exclusive?'is-open':'',locked?'is-locked':''].filter(Boolean).join(' ');
    return `<button class="${cls}" style="--x:${x}%;--y:${y}%" data-group="${esc(group.id)}" ${locked&&group.ids.length===1?'disabled':''} title="${esc(group.title)}"><span>${esc(group.title)}</span></button>`;
  });
}
function renderLeafWheel(group,state){
  const leaves=group.ids.map(byId).filter(Boolean).filter(item=>state.visited[item.id]||isUnlocked(item,state)||item.exclusive==='interrogante');
  return radial(leaves,(item,x,y)=>{
    const done=!!state.visited[item.id],exclusive=item.exclusive==='interrogante',open=isUnlocked(item,state)&&!exclusive;
    const cls=['oras-wheel-item','oras-wheel-leaf',done?'is-done':'',open?'is-open':'',(!open)?'is-locked':''].filter(Boolean).join(' ');
    return `<button class="${cls}" style="--x:${x}%;--y:${y}%" data-id="${esc(item.id)}" ${open?'':'disabled'} title="${esc(item.title)}"><span>${esc(item.title)}</span></button>`;
  });
}
function render(){
  if(!host)return;
  const s=loadState(),p=progress(s),group=GROUPS.find(g=>g.id===activeGroup&&groupVisible(g,s))||null;
  if(activeGroup&&!group)activeGroup=null;
  const wheel=group?renderLeafWheel(group,s):renderGroupWheel(s);
  const centerTitle=group?group.title:'ORAS · LO QUE QUEDA DE LAS HORAS';
  host.innerHTML=`<div class="oras-modal-backdrop" data-close></div><section class="oras-index-window" role="dialog" aria-modal="true" aria-label="Índice de lectura ORAS"><button class="oras-close" data-close aria-label="Cerrar">×</button><div class="oras-nacre-wheel ${group?'is-subwheel':''}">${wheel}<div class="oras-wheel-core"><small>${esc(centerTitle)}</small><strong>${p.done}/${p.total}</strong><span>huellas leídas · ${p.percent}%</span>${group?'<button class="oras-wheel-back" data-wheel-back>Volver</button>':'<button class="oras-continue">Continuar</button>'}</div></div><div class="oras-index-footer"><button class="oras-reset">Reiniciar</button><span>${group?.id==='ceniciento'?'Ceniciento sólo se abre desde el interrogante.':'El índice crece con la lectura.'}</span></div></section>`;
  host.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeIndex));
  host.querySelectorAll('[data-group]').forEach(x=>x.addEventListener('click',()=>{
    const g=GROUPS.find(v=>v.id===x.dataset.group);if(!g)return;
    if(g.exclusive){activeGroup=g.id;render();return;}
    const openLeaves=g.ids.filter(id=>isUnlocked(byId(id),loadState()));
    if(g.ids.length===1&&openLeaves.length===1){closeIndex();go(openLeaves[0]);return;}
    activeGroup=g.id;render();
  }));
  host.querySelectorAll('.oras-wheel-leaf.is-open').forEach(x=>x.addEventListener('click',()=>{closeIndex();go(x.dataset.id);}));
  host.querySelector('[data-wheel-back]')?.addEventListener('click',()=>{activeGroup=null;render();});
  host.querySelector('.oras-continue')?.addEventListener('click',()=>{closeIndex();continueReading();});
  host.querySelector('.oras-reset')?.addEventListener('click',()=>{if(confirm('¿Reiniciar ORAS desde 0/43?')){resetCycle();activeGroup=null;render();history.replaceState({},'','./');window.dispatchEvent(new CustomEvent('oras:route'));}});
}
export function openIndex(){if(!host){host=document.createElement('div');host.id='oras-index-root';document.body.appendChild(host);}render();host.classList.add('is-open');document.documentElement.classList.add('oras-index-open');}
export function closeIndex(){host?.classList.remove('is-open');document.documentElement.classList.remove('oras-index-open');}
export function installIndex(){window.ORASIndex={open:openIndex,close:closeIndex,render};window.addEventListener('oras:state',()=>host?.classList.contains('is-open')&&render());}
