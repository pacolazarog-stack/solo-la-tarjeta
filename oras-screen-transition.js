(()=>{
'use strict';
if(window.ORASScreenTransition)return;

const FADE_OUT_MS=1050;
const FADE_IN_MS=900;
const REVEAL_DELAY_MS=120;
const NAV_FALLBACK_MS=2200;
const AUDIO_HISPANO='hispano-brasilena';
const AUDIO_DRONE='drone';
const AUDIO_MIRROR='mirror-special';
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

/*
 * Dos familias sonoras canónicas:
 *   A · ANA KLAUDYA + todas sus partes + CENICIENTO = música hispano-brasileña.
 *   B · SOLO LA TARJETA + EL INVENTARIO DEL AIRE = drone.
 * El fundido VISUAL es universal. El volumen sólo baja al cruzar A <-> B.
 * EL ESPEJO queda fuera de esta decisión genérica: conserva su motor y sus
 * singularidades propias, sin que este módulo le imponga una segunda bajada.
 */
function normalizedPath(urlLike){
  try{
    const url=new URL(urlLike,window.location.href);
    return url.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'')||'/';
  }catch(_){return ''}
}
function audioGroupForUrl(urlLike){
  const path=normalizedPath(urlLike);
  if(!path)return null;
  if(path.includes('/ana-klaudya-el-espejo-el-inventario'))return AUDIO_MIRROR;
  if(path.includes('/inventario-del-aire'))return AUDIO_DRONE;
  if(path==='/solo-la-tarjeta')return AUDIO_DRONE;
  if(
    path.includes('/elegia-breve')||
    path.includes('/ana-klaudya')||
    path.includes('/ceniciento')||
    path.includes('/estrella')||
    path.includes('/ojos')||
    path.includes('/sonrisa')||
    path.includes('/cabello')||
    path.includes('/piel')||
    path.includes('/interludio')||
    path.includes('/epilogo')
  )return AUDIO_HISPANO;
  return null;
}
function currentAudioGroup(){
  return audioGroupForUrl(window.location.href)||audioGroupForUrl(hostWindow().location?.href||'');
}
function explicitAudioGroup(control){
  const value=control?.getAttribute?.('data-oras-audio-group');
  if(value===AUDIO_HISPANO||value==='ana-ceniciento')return AUDIO_HISPANO;
  if(value===AUDIO_DRONE||value==='solo-inventario')return AUDIO_DRONE;
  if(value===AUDIO_MIRROR||value==='mirror')return AUDIO_MIRROR;
  return null;
}
function targetAudioGroup(control){
  const explicit=explicitAudioGroup(control);
  if(explicit)return explicit;

  /* Controles sin href cuyo destino sí conocemos. */
  if(control?.id==='ou-solo-ana-forward')return AUDIO_HISPANO;
  if(control?.id==='cenicientoLink'||control?.id==='back')return AUDIO_HISPANO;

  try{
    const href=control?.closest?.('a[href]')?.href||control?.href;
    if(href){
      const group=audioGroupForUrl(href);
      if(group)return group;
    }
  }catch(_){}

  /* Un cambio de pantalla interno permanece en la misma familia sonora. */
  return currentAudioGroup();
}
function shouldFadeAudio(sourceGroup,targetGroup){
  if(!sourceGroup||!targetGroup)return false;
  if(sourceGroup===AUDIO_MIRROR||targetGroup===AUDIO_MIRROR)return false;
  return sourceGroup!==targetGroup;
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
async function run(action,{expectNavigation=false,audioFade=false}={}){
  if(active)return false;
  active=true;
  const token=++sequence;
  const veil=transitionVeil();
  const audio=audioFade?collectAudio():[];
  showVeil(veil);
  try{window.dispatchEvent(new CustomEvent('oras:screen-transition-start',{detail:{expectNavigation,audioFade}}))}catch(_){}

  /* El oscurecimiento visual siempre se conserva; el volumen sólo cambia entre familias. */
  if(audioFade)await animateVolumes(audio,()=>0,FADE_OUT_MS);
  else await wait(FADE_OUT_MS);
  if(token!==sequence)return false;

  runOriginal(action);

  if(expectNavigation){
    await wait(NAV_FALLBACK_MS);
    if(unloading)return true;
  }else{
    await wait(REVEAL_DELAY_MS);
  }

  const tasks=[hideVeil(veil)];
  if(audioFade)tasks.push(restorePlayingAudio(audio));
  await Promise.allSettled(tasks);
  active=false;
  try{window.dispatchEvent(new CustomEvent('oras:screen-transition-end',{detail:{audioFade}}))}catch(_){}
  return true;
}
function clickThrough(control){
  const expectNavigation=control.matches(EXPECT_NAV_SELECTOR);
  const sourceGroup=currentAudioGroup();
  const targetGroup=targetAudioGroup(control);
  const audioFade=shouldFadeAudio(sourceGroup,targetGroup);
  return run(()=>control.click(),{expectNavigation,audioFade});
}
function navigate(url){
  const sourceGroup=currentAudioGroup();
  const targetGroup=audioGroupForUrl(url);
  const audioFade=shouldFadeAudio(sourceGroup,targetGroup);
  return run(()=>{try{hostWindow().location.href=url}catch(_){location.href=url}},{expectNavigation:true,audioFade});
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

window.ORASScreenTransition={
  run,
  navigate,
  clickThrough,
  isActive,
  audioGroupForUrl,
  shouldFadeAudio,
  get active(){return active}
};
})();
