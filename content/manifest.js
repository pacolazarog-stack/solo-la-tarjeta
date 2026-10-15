export const LEAVES = [
  {id:'solo',section:'vida',title:'Solo la tarjeta',href:'?read=solo'},
  {id:'ana-prologo',section:'ana',title:'Prólogo · Siguiendo una tarjeta',href:'elegia-breve/?parte=prologo'},
  {id:'ana-elegia',section:'ana',title:'Elegía breve para Ana Klaudya',href:'elegia-breve/?parte=elegia'},
  {id:'ana-ojos',section:'ana',title:'En tus ojos',href:'elegia-breve/?parte=ojos'},
  {id:'ana-labios',section:'ana',title:'En tus labios',href:'elegia-breve/?parte=labios'},
  {id:'ana-cabello',section:'ana',title:'Tu cabello',href:'elegia-breve/?parte=cabello'},
  {id:'ana-piel',section:'ana',title:'Tu piel',href:'elegia-breve/?parte=piel'},
  {id:'ana-interludio',section:'ana',title:'Interludio · Iba a llevarte flores',href:'elegia-breve/?parte=interludio'},
  {id:'ana-epilogo',section:'ana',title:'Epílogo · A fuego lento',href:'elegia-breve/?parte=epilogo'},
  {id:'ceniciento',section:'vida',title:'Ceniciento',href:'elegia-breve/#ceniciento',exclusive:'interrogante'},
  {id:'espejo',section:'umbral',title:'El Espejo',href:'ceniciento/?mirror=1'},
  ...Array.from({length:8},(_,i)=>({id:`inv-${i+1}`,section:'inventario',title:`El inventario del aire · ${i+1}`,href:`inventario-del-aire/#inv-${i+1}`})),
  ...Array.from({length:9},(_,i)=>({id:`som-${i+1}`,section:'sombras',title:`El oficio de las sombras · ${i+1}`,href:`inventario-del-aire/#som-${i+1}`})),
  ...['La plaza','El archivero','La fuente','Los resistentes','El mapa','La teoría','El museo','La visitante','Invierno','El archivo profundo','La máquina de las huellas','El resonador','La última sala','ATLAS / AZAR'].map((title,i)=>({id:`ciu-${i+1}`,section:'ciudad',title,href:`inventario-del-aire/#ciu-${i+1}`})),
  {id:'zero',section:'cero',title:'La Habitación Número Cero',href:'inventario-del-aire/#zero'}
];

export const TOTAL = 43;
export const ANA_IDS = LEAVES.filter(x=>x.section==='ana').map(x=>x.id);
export const EXPANSION_IDS = LEAVES.filter(x=>['inventario','sombras','ciudad','cero'].includes(x.section)).map(x=>x.id);
