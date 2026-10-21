(()=>{
'use strict';
if(window.__anaQuestionR39)return;
window.__anaQuestionR39=true;

const body=document.body;
const stage=document.getElementById('anaFinalStageR37');
const wrap=stage?.querySelector('.photo-wrap');
if(!stage||!wrap)return;

const legacy=document.getElementById('cenicientoLink');
const q37=document.getElementById('anaQuestionR37');
if(q37)q37.style.display='none';
if(legacy)legacy.style.display='none';

const q=document.createElement('button');
q.id='anaQuestionR1R39';
q.type='button';
q.setAttribute('aria-label','Entrar en Ceniciento');
q.innerHTML='<span aria-hidden="true">?</span>';
wrap.appendChild(q);

const style=document.createElement('style');
style.textContent=`
#anaQuestionR37,#cenicientoLink{display:none!important}
#anaQuestionR1R39{
  position:absolute!important;
  left:30%!important;
  top:44%!important;
  width:64px!important;
  height:64px!important;
  margin:-32px 0 0 -32px!important;
  padding:0!important;
  border:0!important;
  border-radius:50%!important;
  background:transparent!important;
  box-shadow:none!important;
  display:grid!important;
  place-items:center!important;
  color:#342719!important;
  font:400 2rem/1 Georgia,"Times New Roman",serif!important;
  z-index:2000!important;
  opacity:0!important;
  visibility:visible!important;
  transform:scale(.92)!important;
  pointer-events:none!important;
  cursor:pointer!important;
  touch-action:manipulation!important;
  transition:opacity 5.8s ease,transform 5.8s ease!important;
}
#anaQuestionR1R39 span{
  display:block!important;
  transform-origin:50% 50%!important;
  animation:anaQuestionR1Beat 1.85s linear infinite!important;
}
@keyframes anaQuestionR1Beat{
  0%,100%{transform:scale(.98)}
  10%{transform:scale(1.06)}
  18%{transform:scale(.995)}
  33%{transform:scale(1.035)}
  44%{transform:scale(.99)}
}
#anaQuestionR1R39.is-born{
  opacity:1!important;
  transform:scale(1)!important;
  pointer-events:auto!important;
}
`;
document.head.appendChild(style);

let birthTimer=0;
const armBirth=()=>{
  if(!body.classList.contains('ana-photo-r37'))return;
  if(birthTimer||q.classList.contains('is-born'))return;
  birthTimer=setTimeout(()=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>q.classList.add('is-born')));
  },2200);
};

armBirth();
const observer=new MutationObserver(armBirth);
observer.observe(body,{attributes:true,attributeFilter:['class']});

q.addEventListener('click',e=>{
  e.preventDefault();
  e.stopImmediatePropagation();
  if(q.dataset.go==='1')return;
  q.dataset.go='1';
  q.style.pointerEvents='none';
  window.location.assign('/solo-la-tarjeta/ceniciento/?from=ana-r39&v=20261021-r39');
},{capture:true});
})();