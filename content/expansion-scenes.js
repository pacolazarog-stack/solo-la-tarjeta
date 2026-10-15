const ROOT='./inventario-del-aire/';

const house=['01-recibidor.webp','02-reloj.webp','03-cocina.webp','04-pasillo.webp','05-dormitorio.webp','06-jardin.webp','07-inventario.webp','08-salida.webp'];
const train=['01-estacion.webp','02-revisor.webp','03-sombras.webp','04-fila-siete.webp','05-conversacion.webp','06-inventario-ausencias-moviles.webp','07-taller.webp','08-oficio.webp','09-ultimo-recorrido.webp'];
const city=['01-plaza.webp','02-archivero.webp','03-fuente.webp','04-resistentes.webp','05-mapa-imposible.webp','06-teoria.webp','07-museo.webp','08-visitante.webp','09-invierno.webp'];

export const EXPANSION_SCENES={};
house.forEach((file,i)=>EXPANSION_SCENES[`inv-${i+1}`]={kind:'house',image:`${ROOT}assets-r4/house/${file}`,motion:i===1?'clock':i===5?'garden':'drift'});
train.forEach((file,i)=>EXPANSION_SCENES[`som-${i+1}`]={kind:'train',image:`${ROOT}assets-r4/train/${file}`,motion:'rail'});
city.forEach((file,i)=>EXPANSION_SCENES[`ciu-${i+1}`]={kind:'city',image:`${ROOT}assets-r4/city/${file}`,motion:i===4?'map':i===8?'winter':'absence'});
EXPANSION_SCENES['ciu-10']={kind:'archive',image:`${ROOT}assets-r5/city/11-archivo-profundo.webp`,motion:'archive'};
EXPANSION_SCENES['ciu-11']={kind:'archive',image:`${ROOT}assets-r5/city/12-maquina-huellas.webp`,motion:'machine'};
EXPANSION_SCENES['ciu-12']={kind:'archive',image:`${ROOT}assets-r5/city/13-resonador.webp`,motion:'resonator'};
EXPANSION_SCENES['ciu-13']={kind:'archive',image:`${ROOT}assets-r4/city/10-ultima-sala.webp`,motion:'last-room'};
EXPANSION_SCENES['ciu-14']={kind:'atlas',image:`${ROOT}assets-r5/city/11-archivo-profundo.webp`,motion:'document'};
EXPANSION_SCENES.zero={kind:'zero',image:`${ROOT}assets-r4/zero/01-habitacion-cero.webp`,motion:'zero'};

export function expansionScene(id){return EXPANSION_SCENES[id]||null;}
