(()=>{
'use strict';
if(window.__orasSunoVolumeInstalled)return;
window.__orasSunoVolumeInstalled=true;
const STORE='oras.master.volume.v1';
const style=document.createElement('style');
style.id='oras-suno-volume-style-r1';
style.textContent=`
#orasSunoVolume{position:fixed;z-index:2147483646;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#orasSunoVolume .oras-vol-button{width:42px;height:42px;border:1px solid rgba(255,255,255,.16);border-radius:9px;background:rgba(9,9,9,.84);display:grid;place-items:center;color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.24);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);cursor:pointer;padding:0}
#orasSunoVolume .oras-vol-button:hover,#orasSunoVolume .oras-vol-button:focus-visible{background:rgba(22,22,22,.94);outline:none;border-color:rgba(255,255,255,.28)}
#orasSunoVolume .oras-vol-button svg{width:20px;height:20px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#orasSunoVolume .oras-vol-pop{position:absolute;left:0;bottom:50px;width:164px;min-height:42px;padding:10px 12px;border:1px solid rgba(255,255,255,.14);border-radius:9px;background:rgba(9,9,9,.91);box-shadow:0 8px 26px rgba(0,0,0,.28);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);display:flex;align-items:center;gap:9px;opacity:0;visibility:hidden;transform:translateY(5px);transition:opacity .16s ease,transform .16s ease,visibility .16s ease}
#orasSunoVolume[data-open="true"] .oras-vol-pop{opacity:1;visibility:visible;transform:none}
#orasSunoVolume .oras-vol-pop input{width:112px;margin:0;accent-color:#fff}
#orasSunoVolume .oras-vol-value{min-width:28px;text-align:right;color:rgba(255,255,255,.72);font:500 10px/1 system-ui,sans-serif}
body.oras-suno-volume-ready .music{display:none!important}
body.oras-suno-volume-ready .ou-reading-window-r2{left:max(62px,calc(env(safe-area-inset-left) + 62px))}
@media(max-width:700px){#orasSunoVolume{left:max(9px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom))}#orasSunoVolume .oras-vol-button{width:40px;height:40px;border-radius:8px}#orasSunoVolume .oras-vol-pop{bottom:48px;width:156px}body.oras-suno-volume-ready .ou-reading-window-r2{left:max(57px,calc(env(safe-area-inset-left) + 57px))}}
`;
document.head.appendChild(style);
const root=document.createElement('div');
root.id='orasSunoVolume';root.dataset.open='false';
root.innerHTML=`<div class="oras-vol-pop" role="group" aria-label="Volumen"><input class="oras-vol-range" type="range" min="0" max="100" step="1" aria-label="Volumen"><span class="oras-vol-value"></span></div><button class="oras-vol-button" type="button" aria-label="Volumen" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path class="oras-wave-1" d="M16 9.5a4 4 0 0 1 0 5"></path><path class="oras-wave-2" d="M18.5 7a7.5 7.5 0 0 1 0 10"></path></svg></button>`;
document.body.appendChild(root);
const button=root.querySelector('.oras-vol-button'),range=root.querySelector('.oras-vol-range'),value=root.querySelector('.oras-vol-value');
let lastNonZero=80;
try{lastNonZero=Math.max(1,Math.min(100,Number(localStorage.getItem(STORE)||80)))}catch(_){}
range.value=String(lastNonZero);
const targetRange=()=>document.querySelector('#musicLevel,input[type="range"][data-volume],input[type="range"][id*="volume" i],input[type="range"][name*="volume" i]');
const targetEnabled=()=>document.querySelector('#musicEnabled,input[type="checkbox"][id*="music" i]');
const mirrorScore=()=>document.querySelector('audio[data-oras-mirror-score="1"]');
function renderIcon(level){root.querySelector('.oras-wave-1').style.display=level>0?'':'none';root.querySelector('.oras-wave-2').style.display=level>45?'':'none';button.setAttribute('aria-label',level>0?`Volumen ${level} %`:'Volumen silenciado');value.textContent=level+'%'}
function apply(level,emit=true){level=Math.max(0,Math.min(100,Number(level)||0));range.value=String(level);renderIcon(level);if(level>0){lastNonZero=level;try{localStorage.setItem(STORE,String(level))}catch(_){}}
 const native=targetRange();if(native){const max=Number(native.max||100),min=Number(native.min||0);native.value=String(min+(max-min)*(level/100));if(emit){native.dispatchEvent(new Event('input',{bubbles:true}));native.dispatchEvent(new Event('change',{bubbles:true}))}}
 const enabled=targetEnabled();if(enabled&&enabled.checked!==(level>0)){enabled.checked=level>0;if(emit)enabled.dispatchEvent(new Event('change',{bubbles:true}))}
 const score=mirrorScore();if(score){score.volume=level/100;score.muted=level===0}
 if(level>0&&emit){const start=document.getElementById('musicStart');if(start&&!start.hidden){try{start.click()}catch(_){}}}}
function sync(){const native=targetRange();if(!native){apply(range.value,false);return}const max=Number(native.max||100),min=Number(native.min||0),v=Number(native.value||0);const pct=Math.round(((v-min)/Math.max(.0001,max-min))*100);range.value=String(pct);renderIcon(pct)}
range.addEventListener('input',()=>apply(range.value,true));
button.addEventListener('click',e=>{e.stopPropagation();const open=root.dataset.open!=='true';root.dataset.open=String(open);button.setAttribute('aria-expanded',String(open));if(open)sync()});
document.addEventListener('click',e=>{if(!root.contains(e.target)){root.dataset.open='false';button.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){root.dataset.open='false';button.setAttribute('aria-expanded','false')}});
function activate(){if(document.querySelector('audio,.music,#musicLevel')){document.body.classList.add('oras-suno-volume-ready');const score=mirrorScore();if(score&&!score.dataset.orasVolumeSynced){score.dataset.orasVolumeSynced='1';apply(range.value,false)}}}
new MutationObserver(activate).observe(document.documentElement,{childList:true,subtree:true});activate();setTimeout(sync,0);setTimeout(sync,700);
window.ORASVolume={set:apply,get:()=>Number(range.value),toggle:()=>{const current=Number(range.value);apply(current>0?0:lastNonZero,true)}};
})();
