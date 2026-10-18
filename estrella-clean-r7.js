(()=>{
'use strict';
if(window.__orasStarCleanR7)return;
window.__orasStarCleanR7=true;
// Compatibilidad histórica: este runtime ya no elimina audio ni controles.
// La escena canónica usa el control de sonido ORAS y navegación anterior/siguiente.
document.body?.classList.add('oras-star-clean-r7-compatible');
})();
