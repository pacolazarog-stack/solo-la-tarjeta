(()=>{
'use strict';

const base=document.createElement('script');
base.src='https://cdn.jsdelivr.net/gh/pacolazarog-stack/solo-la-tarjeta@80866cb8ae17d31356462edf408a4d7f099e1241/narrative-universe.js';
base.async=false;
base.onload=()=>{
  const style=document.createElement('style');
  style.id='mobile-portrait-layout-fix';
  style.textContent=`
.ou-card{
  right:max(16px,env(safe-area-inset-right))!important;
  left:auto!important;
  transform:rotate(4deg)!important;
}
.ou-reading-checklist{
  left:max(10px,env(safe-area-inset-left))!important;
  right:auto!important;
}
.ou-reading-checklist summary{margin-left:0!important}
.ou-reading-checklist ul{left:0!important;right:auto!important}

@media(max-width:700px) and (orientation:portrait){
  .ou-card{
    right:max(10px,env(safe-area-inset-right))!important;
    left:auto!important;
    bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;
    width:94px!important;
    height:58px!important;
    transform:rotate(4deg)!important;
  }
  .ou-card::before{left:13px!important;top:12px!important;width:23px!important;height:17px!important}
  .ou-card::after{left:13px!important;right:13px!important;bottom:11px!important}

  .ou-reading-checklist{
    left:max(10px,env(safe-area-inset-left))!important;
    right:auto!important;
    bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important;
  }
  .ou-reading-checklist summary{
    margin-left:0!important;
    padding:5px 8px!important;
    border-color:rgba(255,255,255,.20)!important;
    background:rgba(12,12,12,.38)!important;
    backdrop-filter:blur(3px)!important;
    -webkit-backdrop-filter:blur(3px)!important;
  }
  .ou-reading-checklist ul{left:0!important;right:auto!important}

  .journey-nav{
    left:112px!important;
    right:112px!important;
    bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;
    transform:none!important;
    width:auto!important;
    max-width:none!important;
    height:48px!important;
    padding:0!important;
    border:0!important;
    border-top:1px solid rgba(255,250,241,.46)!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    backdrop-filter:none!important;
    -webkit-backdrop-filter:none!important;
  }
  .journey-nav button{
    min-width:0!important;
    min-height:48px!important;
    padding:7px 3px!important;
    border:0!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    font-size:12px!important;
    text-shadow:0 1px 4px rgba(0,0,0,.9)!important;
  }
  .journey-nav button+button{
    border-left:1px solid rgba(255,250,241,.26)!important;
  }
}
`;
  document.head.appendChild(style);
};
base.onerror=()=>console.error('No se pudo cargar el módulo base del universo narrativo.');
document.head.appendChild(base);
})();
