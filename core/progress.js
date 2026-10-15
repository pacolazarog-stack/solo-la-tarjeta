import {LEAVES,ANA_IDS,TOTAL,EXPANSION_IDS} from '../content/manifest.js';
import {loadState} from './state.js';

export function countVisited(state=loadState()){return LEAVES.reduce((n,x)=>n+(state.visited[x.id]?1:0),0);}
export function anaComplete(state=loadState()){return ANA_IDS.every(id=>state.visited[id]);}
export function soloComplete(state=loadState()){return !!state.visited.solo;}
export function cenicientoComplete(state=loadState()){return !!state.visited.ceniciento;}
export function mirrorReady(state=loadState()){return soloComplete(state)&&anaComplete(state)&&cenicientoComplete(state)&&state.mirror.available===true;}

function expansionUnlocked(id,state){
  if(state.mirror.crossed!==true)return false;
  const i=EXPANSION_IDS.indexOf(id);
  if(i<0)return false;
  if(i===0)return true;
  return !!state.visited[EXPANSION_IDS[i-1]];
}

export function isUnlocked(item,state=loadState()){
  if(item.id==='solo') return true;
  if(item.section==='ana') return soloComplete(state);
  if(item.id==='ceniciento') return false;
  if(item.id==='espejo') return mirrorReady(state);
  if(EXPANSION_IDS.includes(item.id)) return expansionUnlocked(item.id,state);
  return false;
}
export function progress(state=loadState()){const done=countVisited(state);return {done,total:TOTAL,percent:Math.round(done/TOTAL*100)};}
