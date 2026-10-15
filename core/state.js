const KEY='oras.root.v1';
const fresh=()=>({version:1,cycleId:1,visited:{},mirror:{available:false,completed:false,crossed:false},realityDeformed:false,audio:{enabled:true,volume:.8}});

export function loadState(){
  try{
    const raw=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!raw||raw.version!==1) return fresh();
    return {...fresh(),...raw,mirror:{...fresh().mirror,...raw.mirror},audio:{...fresh().audio,...raw.audio},visited:{...(raw.visited||{})}};
  }catch{return fresh();}
}

export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('oras:state',{detail:state}));return state;}
export function mutate(fn){const s=loadState();fn(s);return saveState(s);}
export function markVisited(id){return mutate(s=>{s.visited[id]=true;if(id==='ceniciento')s.mirror.available=true;if(id==='espejo'){s.mirror.completed=true;s.mirror.crossed=true;s.realityDeformed=true;}});}
export function resetCycle(){return mutate(s=>{const scar=s.realityDeformed;s.cycleId=(s.cycleId||1)+1;s.visited={};s.mirror={available:false,completed:false,crossed:false};s.realityDeformed=scar;});}
export function setAudio(patch){return mutate(s=>{s.audio={...s.audio,...patch};});}
export {KEY};
