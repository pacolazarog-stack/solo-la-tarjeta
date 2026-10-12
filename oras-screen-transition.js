(()=>{
'use strict';
if(window.ORASScreenTransition)return;

const FADE_OUT_MS=1050;
const FADE_IN_MS=900;
const REVEAL_DELAY_MS=120;
const NAV_FALLBACK_MS=2200;
let active=false;
let bypassDepth=0;
let unloading=false;
let sequence=0;

const BUTTON_SELECTOR=[
  '#entryButton',
  '#voiceLaunch',
  '#voiceClose',
  '#cenicientoLink',
  '#readEpilogue',
  '#anaEstrella',
  '#anaRead',
  '#anaOjos',
  '#anaSonrisa',
  '#anaCabello',
  '#anaPiel',
  '#anaInterlude',
  '#anaEpilogue',
  '#journeyPrevious',
  '#journeyNext',
  '#listen',
  '#read',
  '#switch',
  '#back',
  '.mode button',
  '.reveal button',
  '.ou-solo-endnav a',
  '.ou-ceniciento-endnav a',
  '.oras-solo-mirror-gate button',
  '.oras-ceniciento-mirror-gate button',
  '.mirror-continue:not(.mirror-final-continue)',
  '.oras-mirror-nav button',
  '.return-link',
  '[data-oras-screen-transition]'
].join(',');

const EXPECT_NAV_SELECTOR=[
  '#back',
  '.ou-solo-endnav a',
  '.ou-ceniciento-endnav a',
  '.return-link',
  '[data-oras-screen-navigation]'
].join(',');

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clamp=v=>Math.max(0,Math.min(1,v));

function hostWindow(){
  try{return window.top||window}catch(_){return window}
}
function hostDocument(){
  try{return hostWindow().document}catch(_){return document}
}
function collectDocuments(root=hostDocument(),seen=new Set()){
  if(!root||seen.has(root))return [];
  seen.add(root);
  const docs=[root];
  try{
    root.querySelectorAll('iframe').forEach(frame=>{
      try{if(frame.contentDocument)docs.push(...collectDocuments(frame.contentDocument,seen))}catch(_){}
    });
  }catch(_){}
  return docs;
}
function collectAudio(){
  const found=[];
  const seen=new Set();
  collectDocuments().forEach(doc=>{
    try{
      doc.querySelectorAll('audio').forEach(audio=>{
        if(seen.has(audio))return;
        seen.add(audio);
        found.push({
          audio,
          volume:Number.isFinite(audio.volume)?clamp(audio.volume):1,
          muted:audio.muted===true
        });
      });
    }catch(_){}
  });
  return found;
}
function animateVolumes(entries,to,duration){
  if(!entries.length||duration<=0){
    entries.forEach(item=>{try{if(!item.audio.muted)item.audio.volume=to(item)}catch(_){}});
    return Promise.resolve();
  }
  const starts=entries.map(item=>{
    let value=item.volume;
    try{value=Number.isFinite(item.audio.volume)?item.audio.volume:item.volume}catch(_){}
    return clamp(value);
  });
  const began=performance.now();
  return new Promise(resolve=>{
    const tick=now=>{
      const p=clamp((now-began)/duration);
      const eased=p*p*(3-2*p);
      entries.forEach((item,index)=>{
        try{
          if(item.audio.muted)return;
          const target=clamp(to(item));
          item.audio.volume=starts[index]+(target-starts[index])*eased;
        }catch(_){}
      });
      if(p<1)requestAnimationFrame(tick);else resolve();
    };
    requestAnimationFrame(tick);
  });
}
function transitionVeil(){
  const doc=hostDocument();
  let veil=doc.getElementById('oras-screen-transition-veil');
  if(!veil){
    veil=doc.createElement('div');
    veil.id='oras-screen-transition-veil';
    veil.setAttribute('aria-hidden','true');
    veil.style.cssText=[
      'position:fixed',
      'inset:0',
      'z-index:2147483647',
      'pointer-events:none',
      'background:#100f0e',
      'opacity:0',
      `transition:opacity ${FADE_OUT_MS}ms cubic-bezier(.22,.7,.24,1)`,
      'will-change:opacity'
    ].join(';');
    doc.body.appendChild(veil);
  }
  return veil;
}
function showVeil(veil){
  veil.style.pointerEvents='auto';
  veil.style.transition=`opacity ${FADE_OUT_MS}ms cubic-bezier(.22,.7,.24,1)`;
  void veil.offsetWidth;
  requestAnimationFrame(()=>{veil.style.opacity='1'});
}
async function hideVeil(veil){
  if(!veil||!veil.isConnected)return;
  veil.style.transition=`opacity ${FADE_IN_MS}ms cubic-bezier(.22,.7,.24,1)`;
  veil.style.opacity='0';
  await wait(FADE_IN_MS+80);
  if(veil.isConnected&&veil.style.opacity==='0')veil.remove();
}
function restorePlayingAudio(snapshot){
  const activeTracks=snapshot.filter(item=>{
    try{return !item.audio.paused&&!item.audio.ended&&!item.audio.muted}catch(_){return false}
  });
  activeTracks.forEach(item=>{
    try{
      const current=Number.isFinite(item.audio.volume)?item.audio.volume:0;
      item.targetVolume=current>.015?current:item.volume;
      item.audio.volume=0;
    }catch(_){item.targetVolume=item.volume}
  });
  return animateVolumes(activeTracks,item=>item.targetVolume??item.volume,FADE_IN_MS);
}
function runOriginal(action){
  bypassDepth++;
  try{return action()}finally{bypassDepth--}
}
async function run(action,{expectNavigation=false}={}){
  if(active)return false;
  active=true;
  const token=++sequence;
  const veil=transitionVeil();
  const audio=collectAudio();
  showVeil(veil);
  try{window.dispatchEvent(new CustomEvent('oras:screen-transition-start',{detail:{expectNavigation}}))}catch(_){}
  await animateVolumes(audio,()=>0,FADE_OUT_MS);
  if(token!==sequence)return false;

  runOriginal(action);

  if(expectNavigation){
    await wait(NAV_FALLBACK_MS);
    if(unloading)return true;
  }else{
    await wait(REVEAL_DELAY_MS);
  }

  await Promise.allSettled([restorePlayingAudio(audio),hideVeil(veil)]);
  active=false;
  try{window.dispatchEvent(new CustomEvent('oras:screen-transition-end'))}catch(_){}
  return true;
}
function clickThrough(control){
  return run(()=>control.click(),{expectNavigation:control.matches(EXPECT_NAV_SELECTOR)});
}
function navigate(url){
  return run(()=>{try{hostWindow().location.href=url}catch(_){location.href=url}},{expectNavigation:true});
}
function isActive(){return active}

addEventListener('pagehide',()=>{unloading=true},{capture:true});
addEventListener('pageshow',()=>{unloading=false;active=false},{capture:true});

document.addEventListener('click',event=>{
  if(bypassDepth>0||event.defaultPrevented)return;
  const control=event.target.closest?.(BUTTON_SELECTOR);
  if(!control)return;
  if(control.disabled||control.getAttribute('aria-disabled')==='true')return;
  if(control.matches('.mirror-final-continue'))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  clickThrough(control);
},true);

window.ORASScreenTransition={run,navigate,clickThrough,isActive,get active(){return active}};
})();
