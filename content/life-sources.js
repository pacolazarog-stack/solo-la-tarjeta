export const LIFE_SOURCES={
  solo:{source:'./index-legacy.html',selectors:['main article p','main .dusk-passage p','main .final-line','main .opening-phrase'],theme:'solo'},
  'ana-prologo':{source:'./estrella/index.html',selectors:['article.poem .phrase','article.poem .line'],theme:'ana prologo'},
  'ana-elegia':{source:'./elegia-breve/index.html',selectors:['#reading .line'],theme:'ana elegia'},
  'ana-ojos':{source:'./ojos/index.html',selectors:['article.poem .line'],theme:'ana ojos'},
  'ana-labios':{source:'./sonrisa/index.html',selectors:['article.poem .line'],theme:'ana labios'},
  'ana-cabello':{source:'./cabello/index.html',selectors:['article.poem .line'],theme:'ana cabello'},
  'ana-piel':{source:'./piel/index.html',selectors:['article.poem .line'],theme:'ana piel'},
  'ana-interludio':{source:'./interludio/index.html',selectors:[],theme:'ana interludio'},
  'ana-epilogo':{source:'./epilogo/index.html',selectors:['article.poem .phrase'],theme:'ana epilogo'}
};

export const LIFE_IDS=Object.keys(LIFE_SOURCES);
