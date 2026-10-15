export function fadeSwap(outgoing,incoming,{duration=700}={}){
  if(outgoing){outgoing.classList.add('oras-fade-out');setTimeout(()=>outgoing.hidden=true,duration);}
  if(incoming){incoming.hidden=false;requestAnimationFrame(()=>incoming.classList.add('oras-fade-in'));}
}
export function setDeformed(on){document.documentElement.classList.toggle('oras-reality-deformed',!!on);}
