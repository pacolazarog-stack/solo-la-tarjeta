import {LEAVES} from '../content/manifest.js';
import {loadState} from './state.js';
import {isUnlocked} from './progress.js';

export function hrefFor(id){return LEAVES.find(x=>x.id===id)?.href||'./';}
export function canOpen(id){const item=LEAVES.find(x=>x.id===id);if(!item)return false;return isUnlocked(item,loadState());}
export function go(id){const item=LEAVES.find(x=>x.id===id);if(!item)return false;if(item.exclusive==='interrogante')return false;if(!canOpen(id))return false;location.href=item.href;return true;}
export function continueReading(){const s=loadState();for(const item of LEAVES){if(item.id==='ceniciento')continue;if(!s.visited[item.id]&&isUnlocked(item,s)){location.href=item.href;return;}}location.href='./';}
