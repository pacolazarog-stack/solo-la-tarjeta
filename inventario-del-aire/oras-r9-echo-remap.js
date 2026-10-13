(()=>{
'use strict';

/* ORAS · compatibilidad semántica R9
   Las consecuencias persistentes de ATLAS / AZAR guardadas antes de la
   renumeración usan XI=Archivo, XII=Máquina y XIII=Resonador. Esos códigos
   son identidad histórica, no numeración visible. Esta capa crea alias
   invisibles para que los ecos antiguos y nuevos sigan llegando al mismo
   capítulo después de la secuencia canónica X / XI / ATLAS / XII / XIII. */

const book=document.getElementById('book');
if(!book)return;

const style=document.createElement('style');
style.textContent='.oras-r9-semantic-alias{display:none!important}';
document.head.appendChild(style);

const ALIASES=[
  ['deep-archive','XI EL ARCHIVO PROFUNDO'],
  ['trace-machine','XII LA MÁQUINA DE LAS HUELLAS'],
  ['resonator','XIII EL RESONADOR']
];

function install(){
  let ready=0;
  for(const [chapter,legacyTitle] of ALIASES){
    const panel=book.querySelector(`.story-panel[data-chapter="${chapter}"]`);
    if(!panel)continue;
    ready++;
    if(panel.querySelector(`.oras-r9-semantic-alias[data-title="${legacyTitle}"]`))continue;
    const alias=document.createElement('span');
    alias.className='oras-r9-semantic-alias';
    alias.dataset.title=legacyTitle;
    alias.setAttribute('aria-hidden','true');
    alias.textContent=legacyTitle;
    panel.appendChild(alias);
  }
  return ready===ALIASES.length;
}

if(install())return;
const mo=new MutationObserver(()=>{if(install())mo.disconnect()});
mo.observe(book,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-chapter']});
setTimeout(()=>install(),800);
setTimeout(()=>install(),1800);
})();
