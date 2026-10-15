import {LEAVES,ANA_IDS,TOTAL} from '../content/manifest.js';
import {loadState} from './state.js';

export function countVisited(state=loadState()){return LEAVES.reduce((n,x)=>n+(state.visited[x.id]?1:0),0);}
export function anaComplete(state=loadState()){return ANA_IDS.every(id=>state.visited[id]);}
export function soloComplete(state=loadState()){return !!state.visited.solo;}
export function cenicientoComplete(state=loadState()){return !!state.visited.ceniciento;}
export function mirrorReady(state=loadState()){return soloComplete(state)&&anaComplete(state)&&cenicientoComplete(state);}
export function isUnlocked(item,state=loadState()){
  if(item.id==='solo') return true;
  if(item.section==='ana') return soloComplete(state);
  if(item.id==='ceniciento') return false;
  if(item.id==='espejo') return mirrorReady(state);
  if(['inventario','sombras','ciudad','cero'].includes(item.section)) return state.mirror.crossed===true;
  return false;
}
export function progress(state=loadState()){const done=countVisited(state);return {done,total:TOTAL,percent:Math.round(done/TOTAL*100)};}
