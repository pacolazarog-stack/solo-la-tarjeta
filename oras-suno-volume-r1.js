(()=>{
'use strict';
if(window.__orasSunoVolumeInstalled)return;
window.__orasSunoVolumeInstalled=true;

const PATH=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
const ANA_CHILD=/^\/solo-la-tarjeta\/(estrella|ojos|sonrisa|cabello|piel)$/.test(PATH);
const ANA_HOME=PATH==='/solo-la-tarjeta/elegia-breve';
const ANA_FAMILY=ANA_CHILD||ANA_HOME;

/* Nunca dejar ANA bloqueada tras "Preparando la lectura…". */
if(ANA_FAMILY){
  const release=()=>document.documentElement.classList.remove('publication-pending');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(release,60),{once:true});
  else setTimeout(release,60);
  setTimeout(release,900);
  setTimeout(release,1800);
}

/* Estabilidad del final de ANA. */
if(ANA_HOME){
  const perf=document.createElement('style');
  perf.id='oras-ana-final-stability-r2';
  perf.textContent=`body.oras-ana-static-final .world *,body.oras-ana-static-final .portrait-finale,body.oras-ana-static-final .portrait-finale *,body.oras-ana-static-final .pulse-field,body.oras-ana-static-final .pulse-field::before,body.oras-ana-static-final .pulse-field::after,body.oras-ana-static-final .layer-warm,body.oras-ana-static-final .heat-final{animation:none!important;transition:none!important;filter:none!important;-webkit-filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;will-change:auto!important}body.oras-ana-static-final .portrait-finale img{opacity:1!important;transition:none!important;filter:none!important}body.oras-ana-static-final #orasSunoVolume{pointer-events:auto!important;z-index:2147483646!important}`;
  document.head.appendChild(perf);
  const stabilize=()=>{const b=document.body;if(!b)return;const finalVisible=b.classList.contains('portrait-revealed')||b.dataset.ouCompletedAnaFinal==='true';if(finalVisible&&!b.classList.contains('oras-ana-static-final')){b.classList.add('oras-ana-static-final');document.querySelectorAll('.pulse-field,.layer-warm,.heat-final').forEach(el=>{try{el.getAnimations().forEach(a=>a.cancel())}catch(_){}})}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stabilize,{once:true});else stabilize();
  if(document.body)new MutationObserver(stabilize).observe(document.body,{attributes:true,attributeFilter:['class','data-ou-completed-ana-final']});
}

const STORE='oras.master.volume.v1';
const style=document.createElement('style');
style.id='oras-suno-volume-style-r4';
style.textContent=`
#orasSunoVolume{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;z-index:2147483646!important;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasSunoVolume .oras-vol-button{width:42px;height:42px;border:1px solid rgba(255,255,255,.17);border-radius:9px;background:rgba(9,9,9,.86);display:grid;place-items:center;color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.26);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);cursor:pointer;padding:0}
#orasSunoVolume .oras-vol-button:hover,#orasSunoVolume .oras-vol-button:focus-visible{background:rgba(22,22,22,.96);outline:none;border-color:rgba(255,255,255,.30)}
#orasSunoVolume .oras-vol-button svg{width:20px;height:20px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#orasSunoVolume .oras-vol-pop{position:absolute;left:50%;bottom:50px;width:54px;height:206px;padding:10px 6px 8px;border:1px solid rgba(255,255,255,.14);border-radius:11px;background:rgba(9,9,9,.92);box-shadow:0 8px 26px rgba(0,0,0,.30);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:7px;opacity:0;visibility:hidden;pointer-events:none;transform:translate(-50%,6px);transition:opacity .16s ease,transform .16s ease,visibility .16s ease}
#orasSunoVolume[data-open="true"] .oras-vol-pop{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%,0)}
#orasSunoVolume .oras-vol-track{position:relative;width:30px;height:126px;display:grid;place-items:center;overflow:visible}
#orasSunoVolume .oras-vol-range{position:absolute;width:118px;height:24px;margin:0;transform:rotate(-90deg);transform-origin:center;accent-color:#fff;cursor:pointer}
#orasSunoVolume .oras-vol-value{width:100%;text-align:center;color:rgba(255,255,255,.72);font:500 9px/1 system-ui,sans-serif;letter-spacing:.02em}
#orasSunoVolume .oras-vol-mute{appearance:none;width:100%;min-height:26px;padding:3px 2px;border:0;border-top:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.82);font:500 9px/1 system-ui,sans-serif;cursor:pointer}
#orasSunoVolume .oras-vol-mute:hover,#orasSunoVolume .oras-vol-mute:focus-visible{color:#fff;outline:none}
body.oras-suno-volume-ready:not(.oras-ana-child-audio) .music,body.oras-suno-volume-ready:not(.oras-ana-child-audio) .sound-toggle,body.oras-suno-volume-ready:not(.oras-ana-child-audio) #ambientToggle,body.oras-suno-volume-ready:not(.oras-ana-child-audio) .ambient-toggle,body.oras-suno-volume-ready:not(.oras-ana-child-audio) .audio-control,body.oras-suno-volume-ready:not(.oras-ana-child-audio) .music-control,body.oras-suno-volume-ready:not(.oras-ana-child-audio) [data-oras-legacy-audio-control="1"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
body.oras-ana-child-audio .music-controls{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
body.oras-ana-child-audio .music-controls label,body.oras-ana-child-audio .music-controls input,body.oras-ana-child-audio .music-controls output{visibility:visible!important;opacity:1!important;pointer-events:auto!important}
@media(max-width:700px){#orasSunoVolume{left:max(9px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom))}#orasSunoVolume .oras-vol-button{width:40px;height:40px;border-radius:8px}#orasSunoVolume .oras-vol-pop{bottom:48px;height:198px;width:52px}#orasSunoVolume .oras-vol-track{height:120px}#orasSunoVolume .oras-vol-range{width:112px}}
`;
document.head.appendChild(style);

const mount=()=>{
  if(document.getElementById('orasSunoVolume'))return document.getElementById('orasSunoVolume');
  const root=document.createElement('div');
  root.id='orasSunoVolume';root.dataset.open='false';
  root.innerHTML=`<div class="oras-vol-pop" role="group" aria-label="Volumen"><div class="oras-vol-track"><input class="oras-vol-range" type="range" min="0" max="100" step="1" aria-label="Volumen"></div><span class="oras-vol-value"></span><button class="oras-vol-mute" type="button" aria-label="Silenciar">Silencio</button></div><button class="oras-vol-button" type="button" aria-label="Volumen" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path class="oras-wave-1" d="M16 9.5a4 4 0 0 1 0 5"></path><path class="oras-wave-2" d="M18.5 7a7.5 7.5 0 0 1 0 10"></path></svg></button>`;
  document.body.appendChild(root);return root;
};
if(!document.body){document.addEventListener('DOMContentLoaded',()=>location.reload(),{once:true});return;}
const root=mount();
if(ANA_CHILD)document.body.classList.add('oras-ana-child-audio');
const button=root.querySelector('.oras-vol-button'),range=root.querySelector('.oras-vol-range'),value=root.querySelector('.oras-vol-value'),muteButton=root.querySelector('.oras-vol-mute');
let lastNonZero=80;try{lastNonZero=Math.max(1,Math.min(100,Number(localStorage.getItem(STORE)||80)))}catch(_){}
range.value=String(lastNonZero);

const targetRange=()=>document.querySelector('#musicLevel,input[type="range"][data-volume],input[type="range"][id*="volume" i],input[type="range"][name*="volume" i]');
const targetEnabled=()=>document.querySelector('#musicEnabled,input[type="checkbox"][id*="music" i]');
const targetMedia=()=>document.querySelector('audio[data-oras-mirror-score="1"]')||document.getElementById('droneSoundtrack')||document.querySelector('audio');
const mediaLevel=(media,level)=>media&&media.id==='droneSoundtrack'?(level/100)*.22:level/100;
function render(level){root.querySelector('.oras-wave-1').style.display=level>0?'':'none';root.querySelector('.oras-wave-2').style.display=level>45?'':'none';button.setAttribute('aria-label',level>0?`Volumen ${level} %`:'Volumen silenciado');value.textContent=level+'%';muteButton.textContent=level>0?'Silencio':'Activar';muteButton.setAttribute('aria-label',level>0?'Silenciar':'Activar sonido')}
async function tryStartAudio(){const level=Number(range.value)||0;if(level<=0)return false;const media=targetMedia();if(!media)return false;try{media.muted=false;media.volume=Math.max(0,Math.min(1,mediaLevel(media,level)));await media.play();return true}catch(_){return false}}
function apply(level,emit=true){level=Math.max(0,Math.min(100,Number(level)||0));range.value=String(level);render(level);if(level>0){lastNonZero=level;try{localStorage.setItem(STORE,String(level))}catch(_){}}
  const native=targetRange();if(native){const max=Number(native.max||100),min=Number(native.min||0);native.value=String(min+(max-min)*(level/100));if(emit){native.dispatchEvent(new Event('input',{bubbles:true}));native.dispatchEvent(new Event('change',{bubbles:true}))}}
  const enabled=targetEnabled();if(enabled&&enabled.checked!==(level>0)){enabled.checked=level>0;if(emit)enabled.dispatchEvent(new Event('change',{bubbles:true}))}
  document.querySelectorAll('audio').forEach(media=>{try{media.volume=Math.max(0,Math.min(1,mediaLevel(media,level)));media.muted=level===0;if(level===0)media.pause()}catch(_){}});
  if(level>0&&emit){const start=document.getElementById('musicStart');if(start&&!start.hidden){try{start.click()}catch(_){}}tryStartAudio()}}
function sync(){const native=targetRange();if(!native){render(Number(range.value)||0);return}const max=Number(native.max||100),min=Number(native.min||0),v=Number(native.value||0);const pct=Math.round(((v-min)/Math.max(.0001,max-min))*100);range.value=String(pct);render(pct)}
range.addEventListener('input',()=>apply(range.value,true));
muteButton.addEventListener('click',e=>{e.stopPropagation();const current=Number(range.value)||0;apply(current>0?0:lastNonZero,true)});
button.addEventListener('click',e=>{e.stopPropagation();const open=root.dataset.open!=='true';root.dataset.open=String(open);button.setAttribute('aria-expanded',String(open));if(open){sync();tryStartAudio()}});
document.addEventListener('click',e=>{if(!root.contains(e.target)){root.dataset.open='false';button.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){root.dataset.open='false';button.setAttribute('aria-expanded','false')}});
let gestureArmed=true;const gestureStart=()=>{if(!gestureArmed)return;gestureArmed=false;tryStartAudio()};addEventListener('pointerdown',gestureStart,{capture:true,passive:true});addEventListener('touchstart',gestureStart,{capture:true,passive:true});addEventListener('keydown',gestureStart,{capture:true});
function markLegacyControls(){if(ANA_CHILD)return;['.sound-toggle','#ambientToggle','.ambient-toggle','.music','.audio-control','.music-control'].forEach(sel=>document.querySelectorAll(sel).forEach(node=>{if(!node.closest('#orasSunoVolume'))node.setAttribute('data-oras-legacy-audio-control','1')}))}
function activate(){if(ANA_CHILD)document.body.classList.add('oras-ana-child-audio');markLegacyControls();document.body.classList.add('oras-suno-volume-ready');root.style.display='block';root.style.visibility='visible';root.style.opacity='1';const media=targetMedia();if(media&&!media.dataset.orasVolumeSynced){media.dataset.orasVolumeSynced='1';apply(range.value,false)}}
new MutationObserver(activate).observe(document.documentElement,{childList:true,subtree:true});activate();sync();setTimeout(()=>{activate();sync()},250);setTimeout(()=>{activate();sync()},1000);
window.ORASVolume={set:apply,get:()=>Number(range.value),toggle:()=>{const current=Number(range.value);apply(current>0?0:lastNonZero,true)},start:tryStartAudio};
})();
