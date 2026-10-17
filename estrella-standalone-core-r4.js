(()=>{
'use strict';
if(window.__orasStarR4)return;
window.__orasStarR4=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const BASE='/solo-la-tarjeta';
const ANA=`${BASE}/elegia-breve/?v=20261017-ana-route-r4&afterPrologue=1`;
const MASTER='oras.master.volume.v1';
const STATE='oras.ana.star.music.v1';

function volume(){
  try{
    const n=Number(localStorage.getItem(MASTER));
    return Number.isFinite(n)&&n>=0?Math.max(0,Math.min(100,n)):80;
  }catch(_){return 80;}
}
function save(audio){
  try{
    sessionStorage.setItem(STATE,JSON.stringify({
      time:audio&&Number.isFinite(audio.currentTime)?audio.currentTime:0,
      volume:audio&&Number.isFinite(audio.volume)?audio.volume:volume()/100,
      playing:!!audio&&!audio.paused&&!audio.muted
    }));
  }catch(_){ }
}
function install(){
  if(document.getElementById('orasStarNavR4'))return;
  const body=document.body;
  if(!body)return;

  const style=document.createElement('style');
  style.textContent=`
  #musicStart{display:inline-flex!important;align-items:center;justify-content:center;min-height:40px;pointer-events:auto!important;position:relative;z-index:50}
  #orasStarNavR4{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483646;display:grid;grid-template-columns:1fr auto 1fr;width:min(560px,calc(100vw - 24px));height:48px;border:1px solid rgba(255,255,255,.18);border-radius:14px;overflow:hidden;background:rgba(8,12,20,.92);color:#f8eee4;box-shadow:0 8px 30px rgba(0,0,0,.32);backdrop-filter:blur(8px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  #orasStarNavR4 button{border:0;background:transparent;color:inherit;height:48px;padding:0 14px;font:500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;pointer-events:auto!important}
  #orasStarNavR4 button+button{border-left:1px solid rgba(255,255,255,.11)}
  #orasStarNavR4 button:hover{background:rgba(255,255,255,.07)}
  #orasStarNavR4 [data-index]{font-weight:700}
  @media(max-width:620px){#orasStarNavR4{height:44px;bottom:max(8px,env(safe-area-inset-bottom))}#orasStarNavR4 button{height:44px;font-size:11px;padding:0 8px}}
  `;
  document.head.appendChild(style);

  const nav=document.createElement('nav');
  nav.id='orasStarNavR4';
  nav.setAttribute('aria-label','Navegación ORAS');
  nav.innerHTML='<button type="button" data-prev>← Anterior</button><button type="button" data-index>Índice ORAS</button><button type="button" data-next>Siguiente →</button>';
  body.appendChild(nav);

  let audio=document.getElementById('orasStarAudioR4');
  if(!audio){
    audio=document.createElement('audio');
    audio.id='orasStarAudioR4';
    audio.src=`${BASE}/elegia-breve/ana-klaudya.m4a?v=20261017-star-audio-r4`;
    audio.preload='auto';
    audio.loop=true;
    audio.setAttribute('playsinline','');
    audio.style.display='none';
    body.appendChild(audio);
  }

  const start=document.getElementById('musicStart');
  const enabled=document.getElementById('musicEnabled');
  const slider=document.getElementById('musicLevel');
  const output=document.getElementById('musicValue');
  const level=volume();
  if(slider){slider.max='100';slider.value=String(level);}
  if(output)output.textContent=Math.round(level)+' %';
  if(enabled)enabled.checked=level>0;
  audio.volume=level/100;
  audio.muted=!(enabled?enabled.checked:level>0);

  const label=()=>{
    if(!start)return;
    start.hidden=false;
    start.textContent=(!audio.paused&&!audio.muted)?'Pausar música':'Reproducir música';
  };
  const sync=()=>{
    const pct=slider?Math.max(0,Math.min(100,Number(slider.value)||0)):level;
    if(output)output.textContent=Math.round(pct)+' %';
    try{localStorage.setItem(MASTER,String(Math.round(pct)))}catch(_){ }
    audio.volume=pct/100;
    audio.muted=enabled?!enabled.checked:pct===0;
  };
  const play=()=>{
    if(enabled)enabled.checked=true;
    sync();
    audio.muted=false;
    try{
      const p=audio.play();
      if(p&&typeof p.then==='function')p.then(label).catch(label);
    }catch(_){label();}
  };
  const pause=()=>{try{audio.pause();}catch(_){ }label();};

  if(start){
    start.hidden=false;
    start.textContent='Reproducir música';
    start.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(!audio.paused&&!audio.muted)pause();else play();},true);
  }
  slider?.addEventListener('input',()=>{sync();label();},true);
  enabled?.addEventListener('change',()=>{if(enabled.checked)play();else pause();},true);
  audio.addEventListener('playing',label);
  audio.addEventListener('pause',label);
  audio.addEventListener('error',label);
  label();

  nav.querySelector('[data-prev]').addEventListener('click',()=>{location.href=`${BASE}/?read=solo`;});
  nav.querySelector('[data-index]').addEventListener('click',()=>{location.href=`${BASE}/?indice=1`;});
  nav.querySelector('[data-next]').addEventListener('click',()=>{save(audio);location.href=ANA;});

  // Intento inicial; si Edge lo bloquea, el botón visible lo desbloquea con un clic real.
  play();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
addEventListener('pageshow',install);
})();
