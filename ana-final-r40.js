(()=>{
'use strict';
if(window.__anaQuestionR40)return;
window.__anaQuestionR40=true;

const body=document.body;
const stage=document.getElementById('anaFinalStageR37');
if(!stage)return;

const legacy=document.getElementById('cenicientoLink');
const q37=document.getElementById('anaQuestionR37');
const q39=document.getElementById('anaQuestionR1R39');
if(legacy)legacy.style.display='none';
if(q37)q37.style.display='none';
if(q39)q39.style.display='none';

const frame=document.createElement('div');
frame.id='anaQuestionFrameR40';
frame.setAttribute('aria-hidden','false');
frame.innerHTML='<button id="anaQuestionR1R40" type="button" aria-label="Entrar en Ceniciento"><span class="question-beat" aria-hidden="true">?</span></button>';
stage.appendChild(frame);
const q=frame.querySelector('#anaQuestionR1R40');

const style=document.createElement('style');
style.textContent=`
#anaQuestionR37,#cenicientoLink,#anaQuestionR1R39{display:none!important}
#anaQuestionFrameR40{
  position:absolute!important;
  left:50%!important;
  top:50%!important;
  width:min(100vw,59.9609375svh)!important;
  aspect-ratio:1228/2048!important;
  transform:translate(-50%,-50%)!important;
  z-index:1999!important;
  pointer-events:none!important;
}
#anaQuestionR1R40{
  position:absolute!important;
  left:30%!important;
  top:44%!important;
  transform:translate(-50%,-50%)!important;
  display:grid!important;
  place-items:center!important;
  width:72px!important;
  height:72px!important;
  padding:0!important;
  border:0!important;
  border-radius:50%!important;
  background:transparent!important;
  color:#342719!important;
  font:400 2rem/1 Georgia,"Times New Roman",serif!important;
  text-decoration:none!important;
  cursor:pointer!important;
  opacity:0!important;
  visibility:visible!important;
  pointer-events:none!important;
  transition:opacity 17.4s cubic-bezier(.16,.66,.25,1)!important;
  touch-action:manipulation!important;
}
#anaQuestionR1R40 .question-beat{
  display:grid!important;
  place-items:center!important;
  width:52px!important;
  height:52px!important;
  border-radius:50%!important;
  border:1px solid rgba(255,246,225,.65)!important;
  background:rgba(238,241,233,.92)!important;
  box-shadow:0 5px 22px rgba(0,0,0,.24)!important;
  transform-origin:50% 50%!important;
  animation:anaQuestionR40Beat 1.85s linear infinite!important;
  will-change:transform!important;
  pointer-events:none!important;
}
@keyframes anaQuestionR40Beat{
  0%,100%{transform:scale(.98)}
  10%{transform:scale(1.06)}
  18%{transform:scale(.995)}
  33%{transform:scale(1.035)}
  44%{transform:scale(.99)}
}
#anaQuestionR1R40.is-born{
  opacity:1!important;
  pointer-events:auto!important;
}
#anaQuestionR1R40:hover .question-beat{background:#fff9ec!important}
#anaQuestionR1R40:focus-visible{outline:3px solid #fff9ec!important;outline-offset:4px!important}
`;
document.head.appendChild(style);

let birthTimer=0;
function armBirth(){
  if(!body.classList.contains('ana-photo-r37'))return;
  if(birthTimer||q.classList.contains('is-born'))return;
  birthTimer=setTimeout(()=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>q.classList.add('is-born')));
  },2200);
}
armBirth();
const observer=new MutationObserver(armBirth);
observer.observe(body,{attributes:true,attributeFilter:['class']});

q.addEventListener('click',e=>{
  e.preventDefault();
  e.stopImmediatePropagation();
  if(q.dataset.go==='1')return;
  q.dataset.go='1';
  q.style.pointerEvents='none';
  window.location.assign('/solo-la-tarjeta/ceniciento/?from=ana-r41&v=20261021-r41');
},{capture:true});
})();