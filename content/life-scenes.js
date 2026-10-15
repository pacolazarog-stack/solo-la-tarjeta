export const LIFE_SCENES={
  'ana-prologo':{
    kind:'paced',scene:'prologo',kicker:'Prólogo · Ana Klaudya',subtitle:'Siguiendo una tarjeta',clearMs:18000,
    background:'image',asset:'./estrella/umbral.jpg',title:'Siguiendo una tarjeta'
  },
  'ana-elegia':{
    kind:'paced',scene:'elegia',kicker:'Elegía breve · Ana Klaudya',subtitle:'La respiración de la página',background:'elegia',title:'Elegía breve para Ana Klaudya'
  },
  'ana-ojos':{
    kind:'paced',scene:'ojos',kicker:'Una mirada · un poema',subtitle:'Y no bajo los ojos.',clearMs:15000,
    background:'image',asset:'./ojos/ojos-ana.svg',title:'En tus ojos'
  },
  'ana-labios':{
    kind:'paced',scene:'labios',kicker:'Una sonrisa · un poema',subtitle:'Puede esperar.',background:'heartbeat',asset:'./sonrisa/labios-ana.jpg',title:'En tus labios'
  },
  'ana-cabello':{
    kind:'paced',scene:'cabello',kicker:'Un destello · un poema',subtitle:'Una grieta de luz.',clearMs:15000,
    background:'crop',asset:'./elegia-breve/ana-klaudya-fotografia.jpg',viewBox:'1010 680 210 230',title:'Tu cabello'
  },
  'ana-piel':{
    kind:'paced',scene:'piel',kicker:'Una caricia · un poema',subtitle:'No lo atravieso.',clearMs:7500,
    background:'crop',asset:'./elegia-breve/ana-klaudya-fotografia.jpg',viewBox:'855 1090 180 420',title:'Tu piel'
  },
  'ana-interludio':{
    kind:'interlude',scene:'interludio',kicker:'Interludio · Ana Klaudya',subtitle:'Iba a llevarte flores',title:'Iba a llevarte flores'
  },
  'ana-epilogo':{
    kind:'paced',scene:'epilogo',kicker:'Epílogo · Ana Klaudya',subtitle:'A fuego lento.',clearMs:60000,
    background:'cotan',asset:'./epilogo/cotan-imperative.webp',title:'A fuego lento'
  }
};

export function lifeScene(id){return LIFE_SCENES[id]||null;}
