(()=>{
'use strict';

/* EL INVENTARIO DEL AIRE · R8
   Ritmo textual unificado.
   El lector R5 crea los spans .display-word; esta capa sólo sustituye
   sus retardos por una cadencia común para todos los capítulos. */

const book=document.getElementById('book');
if(!book)return;

let raf=0;
let resizeTimer=0;

function assignUnifiedTimings(){
  const panels=[...book.querySelectorAll('.story-panel:not(.atlas-panel)')];
  for(const panel of panels){
    const words=[...panel.querySelectorAll('.display-word')];
    if(!words.length)continue;

    let lastTop=null;
    let row=-1;
    let pos=0;
    let lastElement=null;
    let blockGap=0;

    for(const word of words){
      const parent=word.parentElement;
      const top=Math.round(word.getBoundingClientRect().top);
      const newRow=lastTop===null||Math.abs(top-lastTop)>3;
      const newBlock=parent!==lastElement;

      if(newBlock&&lastElement){
        /* pequeño silencio uniforme entre título/párrafo/párrafo */
        blockGap+=.075;
      }
      if(newRow){
        row++;
        pos=0;
        lastTop=top;
      }

      /* Una línea cada 105 ms; dentro de la línea, 14 ms por palabra.
         El máximo evita que los capítulos largos permanezcan a medio revelar. */
      const delay=Math.min(6.4,.08+blockGap+(row*.105)+(pos*.014));
      word.style.setProperty('--reveal-delay',delay.toFixed(3)+'s');
      pos++;
      lastElement=parent;
    }
  }
}

function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(assignUnifiedTimings));
}

function ready(){
  return book.querySelector('.story-panel .display-word');
}

if(ready())schedule();

const mo=new MutationObserver(()=>{
  if(ready())schedule();
});
mo.observe(book,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(schedule,210);
},{passive:true});

/* La fuente puede cambiar métricas después del primer layout. */
if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});

})();
