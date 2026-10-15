import {LEAVES} from '../content/manifest.js';
import {loadState,resetCycle} from './state.js';
import {progress,isUnlocked} from './progress.js';
import {go,continueReading} from './router.js';

let host=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));

function render(){
  if(!host)return;
  const s=loadState(),p=progress(s);
  const items=LEAVES.map((item,i)=>{
    const unlocked=isUnlocked(item,s),done=!!s.visited[item.id],exclusive=item.exclusive==='interrogante';
    const cls=['oras-wheel-item',done?'is-done':'',unlocked&&!exclusive?'is-open':'',(!unlocked||exclusive)?'is-locked':''].filter(Boolean).join(' ');
    const a=(i/LEAVES.length)*Math.PI*2-Math.PI/2;
    const x=50+42*Math.cos(a),y=50+42*Math.sin(a);
    return `<button class="${cls}" style="--x:${x}%;--y:${y}%" data-id="${esc(item.id)}" ${(!unlocked||exclusive)?'disabled':''} title="${esc(item.title)}"><span>${esc(item.title)}</span></button>`;
  }).join('');
  host.innerHTML=`<div class="oras-modal-backdrop" data-close></div><section class="oras-index-window" role="dialog" aria-modal="true" aria-label="Índice de lectura ORAS"><button class="oras-close" data-close aria-label="Cerrar">×</button><div class="oras-nacre-wheel">${items}<div class="oras-wheel-core"><small>ORAS · LO QUE QUEDA DE LAS HORAS</small><strong>${p.done}/${p.total}</strong><span>huellas leídas · ${p.percent}%</span><button class="oras-continue">Continuar</button></div></div><div class="oras-index-footer"><button class="oras-reset">Reiniciar</button><span>Ceniciento sólo se abre desde el interrogante.</span></div></section>`;
  host.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeIndex));
  host.querySelectorAll('.oras-wheel-item.is-open').forEach(x=>x.addEventListener('click',()=>{closeIndex();go(x.dataset.id);}));
  host.querySelector('.oras-continue')?.addEventListener('click',()=>{closeIndex();continueReading();});
  host.querySelector('.oras-reset')?.addEventListener('click',()=>{if(confirm('¿Reiniciar ORAS desde 0/43?')){resetCycle();render();history.replaceState({},'','./');window.dispatchEvent(new CustomEvent('oras:route'));}});
}
export function openIndex(){if(!host){host=document.createElement('div');host.id='oras-index-root';document.body.appendChild(host);}render();host.classList.add('is-open');document.documentElement.classList.add('oras-index-open');}
export function closeIndex(){host?.classList.remove('is-open');document.documentElement.classList.remove('oras-index-open');}
export function installIndex(){window.ORASIndex={open:openIndex,close:closeIndex,render};window.addEventListener('oras:state',()=>host?.classList.contains('is-open')&&render());}
