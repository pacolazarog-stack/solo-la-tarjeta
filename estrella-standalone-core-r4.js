(()=>{
'use strict';
if(window.__orasStarR6)return;
window.__orasStarR6=true;
const params=new URLSearchParams(location.search);
const path=location.pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');
if(window.parent!==window||!path.endsWith('/estrella')||params.get('standalone')!=='1')return;

const BASE='/solo-la-tarjeta';
const ANA=`${BASE}/elegia-breve/?v=20261017-ana-route-r6&afterPrologue=1`;
const MASTER='oras.master.volume.v1';
const STATE='oras.ana.star.music.v1';

/* Esta escena entra canónicamente al 80 %, sin heredar un volumen antiguo. */
try{localStorage.setItem(MASTER,'80')}catch(_){ }

function save(audio){
  try{
    sessionStorage.setItem(STATE,JSON.stringify({
      time:audio&&Number.isFinite(audio.currentTime)?audio.currentTime:0,
      volume:audio&&Number.isFinite(audio.volume)?audio.volume:.8,
      playing:!!audio&&!audio.paused&&!audio.muted
    }));
  }catch(_){ }
}

function hardStyle(el,props){
  if(!el)return;
  for(const [k,v] of Object.entries(props))el.style.setProperty(k,v,'important');
}

function install(){
  const body=document.body;
  if(!body)return;

  const slider=document.getElementById('musicLevel');
  const output=document.getElementById('musicValue');
  const enabled=document.getElementById('musicEnabled');
  const start=document.getElementById('musicStart');
  if(slider){slider.min='0';slider.max='100';slider.value='80';}
  if(output)output.textContent='80 %';
  if(enabled){enabled.checked=true;enabled.disabled=false;}
  if(start){start.hidden=false;hardStyle(start,{display:'inline-flex',visibility:'visible',opacity:'1','pointer-events':'auto'});start.textContent='Reproducir música';}

  let nav=document.getElementById('orasStarRuntimeNavR6');
  if(!nav){
    nav=document.createElement('nav');
    nav.id='orasStarRuntimeNavR6';
    nav.setAttribute('aria-label','Navegación ORAS');
    nav.innerHTML='<button type="button" data-prev>← Anterior</button><button type="button" data-index>Índice ORAS</button><button type="button" data-next>Siguiente →</button>';
    body.appendChild(nav);
  }
  hardStyle(nav,{
    position:'fixed',left:'50%',bottom:'14px',transform:'translateX(-50%)','z-index':'2147483647',
    display:'grid','grid-template-columns':'1fr auto 1fr',width:'min(560px, calc(100vw - 24px))',height:'48px',
    border:'1px solid rgba(255,255,255,.22)','border-radius':'14px',overflow:'hidden',
    background:'rgba(8,12,20,.96)',color:'#f8eee4','box-shadow':'0 8px 30px rgba(0,0,0,.38)',
    'backdrop-filter':'blur(8px)','font-family':'system-ui,-apple-system,"Segoe UI",sans-serif',
    visibility:'visible',opacity:'1','pointer-events':'auto'
  });
  nav.querySelectorAll('button').forEach((button,i)=>{
    hardStyle(button,{display:'block',visibility:'visible',opacity:'1','pointer-events':'auto',height:'48px',margin:'0',padding:'0 14px',border:'0','border-radius':'0',background:'transparent',color:'#f8eee4',font:'500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif','white-space':'nowrap'});
    if(i)button.style.setProperty('border-left','1px solid rgba(255,255,255,.12)','important');
  });

  let audio=document.getElementById('orasStarRuntimeAudioR6');
  if(!audio){
    audio=document.createElement('audio');
    audio.id='orasStarRuntimeAudioR6';
    audio.src=`${BASE}/elegia-breve/ana-klaudya.m4a?v=20261017-star-audio-r6`;
    audio.preload='auto';
    audio.loop=true;
    audio.setAttribute('playsinline','');
    audio.volume=.8;
    audio.muted=false;
    audio.style.display='none';
    body.appendChild(audio);
  }

  const label=()=>{
    if(!start)return;
    start.hidden=false;
    hardStyle(start,{display:'inline-flex',visibility:'visible',opacity:'1','pointer-events':'auto'});
    start.textContent=(!audio.paused&&!audio.muted)?'Pausar música':'Reproducir música';
  };
  const play=async()=>{
    if(enabled)enabled.checked=true;
    audio.volume=Math.max(0,Math.min(1,(Number(slider?.value)||80)/100));
    audio.muted=false;
    try{await audio.play();}catch(err){console.warn('ORAS estrella audio r6',err);}
    label();
  };
  const pause=()=>{try{audio.pause()}catch(_){ }label();};

  /* Captura en document: prevalece sobre los listeners antiguos añadidos después al botón. */
  if(!window.__orasStarR6Capture){
    window.__orasStarR6Capture=true;
    document.addEventListener('click',e=>{
      const button=e.target&&e.target.closest?e.target.closest('#musicStart'):null;
      if(!button)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      (!audio.paused&&!audio.muted)?pause():play();
    },true);
    document.addEventListener('input',e=>{
      if(e.target!==slider)return;
      const pct=Math.max(0,Math.min(100,Number(slider.value)||0));
      if(output)output.textContent=Math.round(pct)+' %';
      audio.volume=pct/100;
      try{localStorage.setItem(MASTER,String(Math.round(pct)))}catch(_){ }
    },true);
    document.addEventListener('change',e=>{
      if(e.target!==enabled)return;
      enabled.checked?play():pause();
    },true);
  }

  nav.querySelector('[data-prev]').onclick=()=>{location.href=`${BASE}/?read=solo`;};
  nav.querySelector('[data-index]').onclick=()=>{location.href=`${BASE}/?indice=1`;};
  nav.querySelector('[data-next]').onclick=()=>{save(audio);location.href=ANA;};

  audio.addEventListener('playing',label);
  audio.addEventListener('pause',label);
  audio.addEventListener('error',label);
  label();

  /* Intento inicial. Edge puede bloquearlo; el primer clic en Reproducir música lo desbloquea. */
  play();

  /* El inline antiguo se ejecuta después: reponemos sólo el estado de entrada canónico. */
  setTimeout(()=>{
    try{localStorage.setItem(MASTER,'80')}catch(_){ }
    if(slider)slider.value='80';
    if(output)output.textContent='80 %';
    if(enabled)enabled.checked=true;
    hardStyle(nav,{display:'grid',visibility:'visible',opacity:'1','pointer-events':'auto'});
    label();
  },0);
  setTimeout(()=>{
    hardStyle(nav,{display:'grid',visibility:'visible',opacity:'1','pointer-events':'auto'});
  },500);
}

/* El script se carga al final del body: instalamos ya, antes del inline heredado. */
install();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
addEventListener('pageshow',install);
})();
