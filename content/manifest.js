export const LEAVES = [
  {id:'solo',section:'vida',title:'Solo la tarjeta',href:'?read=solo'},
  {id:'ana-prologo',section:'ana',title:'Prólogo · Siguiendo una tarjeta',href:'?read=ana-prologo'},
  {id:'ana-elegia',section:'ana',title:'Elegía breve para Ana Klaudya',href:'?read=ana-elegia'},
  {id:'ana-ojos',section:'ana',title:'En tus ojos',href:'?read=ana-ojos'},
  {id:'ana-labios',section:'ana',title:'En tus labios',href:'?read=ana-labios'},
  {id:'ana-cabello',section:'ana',title:'Tu cabello',href:'?read=ana-cabello'},
  {id:'ana-piel',section:'ana',title:'Tu piel',href:'?read=ana-piel'},
  {id:'ana-interludio',section:'ana',title:'Interludio · Iba a llevarte flores',href:'?read=ana-interludio'},
  {id:'ana-epilogo',section:'ana',title:'Epílogo · A fuego lento',href:'?read=ana-epilogo'},
  {id:'ceniciento',section:'vida',title:'Ceniciento',href:'?read=ceniciento&via=interrogante',exclusive:'interrogante'},
  {id:'espejo',section:'umbral',title:'El Espejo',href:'?read=espejo'},

  {id:'inv-1',section:'inventario',title:'I · El recibidor',href:'?read=inv-1'},
  {id:'inv-2',section:'inventario',title:'II · La habitación del reloj',href:'?read=inv-2'},
  {id:'inv-3',section:'inventario',title:'III · La cocina',href:'?read=inv-3'},
  {id:'inv-4',section:'inventario',title:'IV · El pasillo',href:'?read=inv-4'},
  {id:'inv-5',section:'inventario',title:'V · El dormitorio',href:'?read=inv-5'},
  {id:'inv-6',section:'inventario',title:'VI · El jardín',href:'?read=inv-6'},
  {id:'inv-7',section:'inventario',title:'VII · Inventario',href:'?read=inv-7'},
  {id:'inv-8',section:'inventario',title:'VIII · Salida',href:'?read=inv-8'},

  {id:'som-1',section:'sombras',title:'I · La estación',href:'?read=som-1'},
  {id:'som-2',section:'sombras',title:'II · El revisor',href:'?read=som-2'},
  {id:'som-3',section:'sombras',title:'III · Las sombras',href:'?read=som-3'},
  {id:'som-4',section:'sombras',title:'IV · El hombre de la fila siete',href:'?read=som-4'},
  {id:'som-5',section:'sombras',title:'V · Conversación',href:'?read=som-5'},
  {id:'som-6',section:'sombras',title:'VI · Inventario de ausencias móviles',href:'?read=som-6'},
  {id:'som-7',section:'sombras',title:'VII · El taller',href:'?read=som-7'},
  {id:'som-8',section:'sombras',title:'VIII · El oficio',href:'?read=som-8'},
  {id:'som-9',section:'sombras',title:'IX · Último recorrido',href:'?read=som-9'},

  {id:'ciu-1',section:'ciudad',title:'I · La plaza',href:'?read=ciu-1'},
  {id:'ciu-2',section:'ciudad',title:'II · El archivero',href:'?read=ciu-2'},
  {id:'ciu-3',section:'ciudad',title:'III · La fuente',href:'?read=ciu-3'},
  {id:'ciu-4',section:'ciudad',title:'IV · Los resistentes',href:'?read=ciu-4'},
  {id:'ciu-5',section:'ciudad',title:'V · El mapa imposible',href:'?read=ciu-5'},
  {id:'ciu-6',section:'ciudad',title:'VI · Teoría',href:'?read=ciu-6'},
  {id:'ciu-7',section:'ciudad',title:'VII · El museo',href:'?read=ciu-7'},
  {id:'ciu-8',section:'ciudad',title:'VIII · El visitante',href:'?read=ciu-8'},
  {id:'ciu-9',section:'ciudad',title:'IX · Invierno',href:'?read=ciu-9'},
  {id:'ciu-10',section:'archivero',title:'X · El Archivo Profundo',href:'?read=ciu-10'},
  {id:'ciu-11',section:'archivero',title:'XI · La Máquina de las Huellas',href:'?read=ciu-11'},
  {id:'ciu-12',section:'archivero',title:'XII · El Resonador',href:'?read=ciu-12'},
  {id:'ciu-13',section:'archivero',title:'XIII · La Última Sala',href:'?read=ciu-13'},
  {id:'ciu-14',section:'cero',title:'ATLAS / AZAR',href:'?read=ciu-14',documental:true},
  {id:'zero',section:'cero',title:'La Habitación Número Cero',href:'?read=zero'}
];

export const TOTAL = 43;
export const ANA_IDS = LEAVES.filter(x=>x.section==='ana').map(x=>x.id);
export const EXPANSION_IDS = LEAVES.filter(x=>['inventario','sombras','ciudad','archivero','cero'].includes(x.section)).map(x=>x.id);
