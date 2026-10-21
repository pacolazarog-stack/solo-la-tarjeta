(()=>{
'use strict';
if(window.__anaQuestionR39)return;
window.__anaQuestionR39=true;

const old=document.getElementById('cenicientoLink');
const stage=document.getElementById('anaFinalStageR37');
const wrap=stage?.querySelector('.photo-wrap');
const q37=document.getElementById('anaQuestionR37');
if(!old||!stage||!wrap)return;

if(q37)q37.style.display='none';
wrap.appendChild(old);
old.classList.add('ana-question-r1-restored');
old.removeAttribute('hidden');
old.style.removeProperty('display');

const style=document.createElement('style');
style.textContent=`
#anaQuestionR37{display:none!important}
#anaFinalStageR37 #cenicientoLink.ana-question-r1-restored{
  position:absolute!important;
  left:30%!important;
  top:44%!important;
  transform:translate(-50%,-50%)!important;
  display:grid!important;
  place-items:center!important;
  width:64px!important;
  height:64px!important;
  padding:0!important;
  margin:0!important;
  border:0!important;
  border-radius:50%!important;
  background:transparent!important;
  box-shadow:none!important;
  color:#342719!important;
  font:400 2rem/1 Georgia,"Times New Roman",serif!important;
  text-decoration:none!important;
  cursor:pointer!important;
  z-index:900!important;
  opacity:0!important;
  visibility:hidden!important;
  pointer-events:none!important;
  filter:none!important;
  transition:opacity 3s ease,visibility 0s linear 3s!important;
  touch-action:manipulation!important;
}
#anaFinalStageR37 #cenicientoLink.ana-question-r1-restored .question-beat{
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
body.ana-photo-r37 #cenicientoLink.ana-question-r1-restored{
  opacity:1!important;
  visibility:visible!important;
  pointer-events:auto!important;
}
body.ceniciento-open #anaFinalStageR37{
  display:none!important;
}
`;
document.head.appendChild(style);

old.addEventListener('click',()=>{
  stage.style.display='none';
},{capture:true});
})();