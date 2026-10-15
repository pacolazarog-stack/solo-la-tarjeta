import {LEAVES} from '../content/manifest.js';
import {loadState} from './state.js';
import {isUnlocked,anaComplete} from './progress.js';

export function hrefFor(id){return LEAVES.find(x=>x.id===id)?.href||'./';}
export function canOpen(id){const item=LEAVES.find(x=>x.id===id);if(!item)return false;return isUnlocked(item,loadState());}

function openHref(href){
  if(href.startsWith('?')){
    history.pushState({},'',href);
    window.dispatchEvent(new CustomEvent('oras:route'));
  }else location.href=href;
}

export function go(id){
  const item=LEAVES.find(x=>x.id===id);
  if(!item)return false;
  if(item.exclusive==='interrogante')return false;
  if(!canOpen(id))return false;
  openHref(item.href);
  return true;
}

export function continueReading(){
  const s=loadState();
  if(anaComplete(s)&&!s.visited.ceniciento){
    openHref('?read=ana-epilogo&resume=interrogante');
    return;
  }
  for(const item of LEAVES){
    if(item.id==='ceniciento')continue;
    if(!s.visited[item.id]&&isUnlocked(item,s)){openHref(item.href);return;}
  }
  history.pushState({},'','./');
  window.dispatchEvent(new CustomEvent('oras:route'));
}
