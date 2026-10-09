(() => {
  const path=location.pathname;
  const enabled=[
    '/elegia-breve/','/estrella/','/ojos/','/sonrisa/','/cabello/','/piel/','/interludio/','/epilogo/',
    '/ana-klaudya/acerca/','/ana-klaudya-festival/'
  ].some(part=>path.includes(part));
  if(!enabled)return;

  document.documentElement.lang='en';

  const pairs=[
    // Titles and structural labels
    ['Siguiendo una tarjeta','Following a Card'],
    ['Prólogo · Siguiendo una tarjeta','Prologue · Following a Card'],
    ['Elegía breve para Ana Klaudya','A Brief Elegy for Ana Klaudya'],
    ['En tus ojos','In Your Eyes'],
    ['En tus labios','On Your Lips'],
    ['Tu cabello','Your Hair'],
    ['Tu piel','Your Skin'],
    ['Interludio · Iba a llevarte flores','Interlude · I Was Going to Bring You Flowers'],
    ['Epílogo · A fuego lento','Epilogue · Over a Low Flame'],
    ['A fuego lento · Epílogo de Ana Klaudya','Over a Low Flame · Epilogue of Ana Klaudya'],
    ['Iba a llevarte flores · Interludio de Ana Klaudya','I Was Going to Bring You Flowers · Ana Klaudya Interlude'],
    ['Acerca de ANA KLAUDYA','About ANA KLAUDYA'],
    ['ANA KLAUDYA · Jurados y festivales','ANA KLAUDYA · Juries and Festivals'],

    // Split headings
    ['En tus','In Your'],['ojos.','Eyes.'],['labios.','Lips.'],['Tu','Your'],['cabello.','Hair.'],['piel.','Skin.'],
    ['A fuego','Over a'],['lento.','Low Flame.'],['Siguiendo una','Following a'],['tarjeta.','Card.'],

    // Core interface
    ['poemas de Paco Olmo de Males','poems by Paco Olmo de Males'],
    ['▶ Comenzar','▶ Begin'],['Voz','Voice'],['Activar voz','Play voice'],['Volver','Back'],['Volver a escuchar','Listen again'],
    ['Nivel de música','Music level'],['Recitado de Ana Klaudya','Ana Klaudya recitation'],
    ['Tu navegador no admite la reproducción de audio.','Your browser does not support audio playback.'],
    ['Pulsa Activar voz para volver a intentarlo.','Press Play voice to try again.'],
    ['Pulsa Activar voz para iniciar la grabación.','Press Play voice to start the recording.'],
    ['Fin de la grabación.','End of recording.'],
    ['Entrada a Ana Klaudya','Enter Ana Klaudya'],
    ['Anterior','Previous'],['Índice','Index'],['Siguiente','Next'],
    ['Principio del recorrido','Start of the journey'],['Final del recorrido','End of the journey'],
    ['Recorrido de la obra','Work journey'],['Acerca del proyecto ↗','About the project ↗'],['Jurados y festivales ↗','Juries and festivals ↗'],
    ['Acerca del proyecto','About the project'],['Jurados y festivales','Juries and festivals'],
    ['Inicio de Ana ↗','Ana home ↗'],['Volver a Ana','Back to Ana'],
    ['Leer con pausas','Read with pauses'],['Poema completo','Full poem'],['A tu ritmo.','At your pace.'],
    ['Activar música','Play music'],['Música de fondo','Background music'],['Volumen','Volume'],
    ['Volver a leer','Read again'],['Silencio.','Silence.'],['Continuar','Continue'],['Pausar','Pause'],
    ['Una pausa, a tu elección.','A pause, if you choose.'],['Deja respirar cada verso.','Let each line breathe.'],
    ['Volver a ver','Replay'],['Cargando las imágenes.','Loading images.'],['A fuego lento.','Over a Low Flame.'],
    ['Entrada de A fuego lento','Opening of Over a Low Flame'],
    ['No se han podido cargar las imágenes. Puedes continuar al epílogo con Siguiente.','The images could not be loaded. You can continue to the epilogue with Next.'],
    ['La obra no está disponible públicamente en este momento.','The work is not publicly available at this time.'],
    ['Obra no disponible','Work unavailable'],
    ['La obra no está disponible. Vuelve a intentarlo más tarde.','The work is unavailable. Please try again later.'],
    ['Habilitado para el uso indicado.','Enabled for the stated use.'],['Pendiente de autorización expresa.','Pending explicit permission.'],
    ['Ver la versión audiovisual','View the audiovisual version'],['Subtítulos definitivos','Final subtitles'],

    // Microsite framing
    ['Una mirada · un poema','A gaze · a poem'],['Una sonrisa · un poema','A smile · a poem'],
    ['Un destello · un poema','A glint · a poem'],['Una caricia · un poema','A caress · a poem'],
    ['Puede esperar.','It can wait.'],['Una grieta de luz.','A crack of light.'],

    // Prologue · canonical English
    ['Siguiendo una tarjeta,','Following a card,'],['encontré un lugar.','I found a place.'],['Al detenerme allí,','When I stopped there,'],
    ['empezó a ser mi hogar','it began to feel like home'],['(todavía sin llave,','(still without a key,'],['pero ya imaginaba','but I was already imagining'],
    ['mis pasos al volver)','my footsteps on returning)'],['Siguiendo a un ángel,','Following an angel,'],['llegué hasta ti.','I came to you.'],
    ['Todavía me sorprende.','It still surprises me.'],['Cuando era yang,','When I was yang,'],['buscaba el yin.','I searched for yin.'],
    ['Ahora que soy yin,','Now that I am yin,'],['me basta con mirarte.','looking at you is enough.'],

    // Elegy · canonical English
    ['Había en su rostro','There was in her face'],['una belleza serena,','a quiet beauty,'],['de las que no reclaman','the kind that never asks'],
    ['hacerse notar.','to be noticed.'],['La hondura de los ojos,','The depth of her eyes,'],['el trazo de la boca,','the line of her mouth,'],
    ['el cabello dispuesto','her hair arranged'],['con un cuidado','with a care'],['que subraya','that accentuates'],['sin corregir.','without correcting.'],
    ['Y luego habló.','And then she spoke.'],['Brasil seguía intacto','Brazil remained intact'],['en su manera de decir:','in the way she spoke:'],
    ['el peso tibio de las vocales,','the warm weight of the vowels,'],['la sílaba demorada,','the lingering syllable,'],['una música','a music'],
    ['que se negaba','that refused'],['a disimular.','to disguise itself.'],['Entonces comprendí','Then I understood'],
    ['que a la luz de aquel rostro','that the light of that face'],['le faltaba todavía','was still missing'],['la voz.','her voice.'],
    ['Después vino','Then came'],['el abrazo.','the embrace.'],['Ignoro cuánto duró','I do not know how long it lasted'],
    ['o quién se acercó primero.','or who moved closer first.'],['Solo recuerdo','I remember only'],['el calor.','the warmth.'],
    ['Y quedó también','And there remained as well'],['esa íntima injusticia','that private injustice'],['que a veces comete la memoria:','memory sometimes commits:'],
    ['de toda una tarde','from an entire afternoon'],['retiene intacto','it keeps intact'],['un rostro,','a face,'],['y de todo un abrazo,','and from an entire embrace,'],
    ['el','the'],['calor.','warmth.'],

    // Eyes · canonical English
    ['Tus párpados se entornan.','Your eyelids half-close.'],['Bajo tu mirada','Under your gaze,'],['se me desordena','falls out of order.'],
    ['la cara que traía.','the face I came in with'],['No sé cuánto de mí','I do not know how much of me'],['has visto ya.','you have already seen.'],
    ['Y no bajo los ojos.','And I do not lower my eyes.'],

    // Lips · canonical English
    ['Iba a decirte algo.','I was going to tell you something.'],['Tu sonrisa comienza en las comisuras:','Your smile begins at the corners of your mouth:'],
    ['un leve movimiento','a slight movement,'],['y se me olvida','and I forget'],['cómo iba a empezar.','how I was going to begin.'],
    ['El gesto se extiende por tu rostro.','The gesture spreads across your face.'],['Yo también sonrío.','I smile too.'],
    ['Todavía no has dicho nada.','You still have not said a word.'],['Vuelves a sonreír.','You smile again.'],
    ['Lo que iba a decirte','What I was going to tell you'],['puede esperar.','can wait.'],

    // Hair · canonical English
    ['Negro, con ese brillo de crin','Black, with that sheen of a mane'],['que estalla al volver la cabeza:','that flashes when you turn your head:'],
    ['la luz resbala por él','light glides across it'],['sin llegar a aclararlo.','without lightening it.'],['Cae sobre tu hombro','It falls across your shoulder'],
    ['y tarda en quedarse quieto.','and takes its time becoming still.'],['Tú regresas a tus palabras;','You return to your words;'],
    ['pero un mechón prolonga','but one strand prolongs'],['el giro de tu rostro.','the turning of your face.'],
    ['Lo apartas con los dedos.','You brush it aside with your fingers.'],['El gesto desnuda tu cuello','The gesture bares your neck'],
    ['y deja entre las hebras','and leaves between the strands'],['una grieta de luz.','a crack of light.'],['Sigues hablando.','You keep talking.'],
    ['El mechón vuelve a su sitio.','The strand falls back into place.'],['Yo tardo','I take'],['un poco más.','a little longer.'],

    // Skin · canonical English
    ['Mi mano sigue quieta.','My hand remains still.'],['Hablas.','You speak.'],['Mueves los dedos','You move your fingers'],
    ['y la luz pasa','and the light passes'],['de un nudillo a otro.','from one knuckle to another.'],['Entre la tuya y la mía','Between yours and mine'],
    ['queda apenas el aire.','there is only air.'],['No lo atravieso.','I do not cross it.'],

    // Epilogue · canonical English
    ['Yo iba a escribirte un poema.','I was going to write you a poem.'],['Tú me diste una cebolla.','You handed me an onion.'],
    ['—Empieza por aquí.','—Start with this.'],['A los dos minutos','Two minutes later'],['ya me habías hecho llorar','you had already made me cry'],
    ['sin romperme el corazón.','without breaking my heart.'],['Tarareas algo en portugués','You hum something in Portuguese'],
    ['mientras el aceite se calienta.','while the oil heats up.'],['Yo sigo el ritmo con el pie.','I keep the rhythm with my foot.'],
    ['La cuchara','The spoon'],['se me queda quieta.','goes still in my hand.'],['—Remueve, poeta.','—Stir, poet.'],
    ['Se me había olvidado el puchero.','I had forgotten the stew.'],['Estaba buscando una palabra','I was looking for a word'],
    ['para el modo en que sonríes.','for the way you smile.'],['Me acercas la cuchara.','You hold out the spoon.'],
    ['—Prueba. ¿Qué le falta?','—Taste it. What does it need?'],['Me quedo mirándote.','I keep looking at you.'],
    ['—Al puchero, Paco.','—The stew, Paco.'],['—Sal.','—Salt.'],['Tú pones dos platos.','You set out two plates.'],
    ['Yo llevo el puchero a la mesa.','I carry the stew to the table.'],['Apartas los papeles','You move the papers aside'],
    ['para que quepa.','to make room for it.'],['El poema sigue sin terminar.','The poem is still unfinished.'],
    ['Me pides el pan.','You ask me for the bread.'],['Yo te doy la mano.','I give you my hand.'],['—El pan, poeta.','—The bread, poet.'],
    ['Lo alcanzo con la otra.','I reach for it with the other.'],

    // Interlude accessibility copy
    ['Un pétalo con gotas da paso a una calle florida, una ciudad, un paisaje y un planeta cubierto de flores junto a una luna yin yang; el planeta se transforma suavemente en una cebolla y la luna yin yang desciende hasta convertirse en un trozo de pan sobre la mesa y abre A fuego lento.',
     'A dew-covered petal gives way to a flowered street, a city, a landscape and a planet covered in flowers beside a yin-yang moon; the planet slowly becomes an onion and the yin-yang moon descends until it becomes a piece of bread on the table, opening Over a Low Flame.'],

    // About page
    ['Volver a la obra','Back to the work'],['Concepto','Concept'],['Nota artística','Artistic statement'],['Autoría y créditos','Authorship and credits'],
    ['Concepto y edición final','Concept and final editing'],['Desarrollo de los textos','Text development'],['Con intervención de ChatGPT, Gemini y Copilot.','With contributions from ChatGPT, Gemini and Copilot.'],
    ['Recitado disponible','Available recitation'],['Voz del autor, en la elegía.','Author’s voice, in the elegy.'],['Imágenes','Images'],
    ['Imágenes tratadas o generadas con ChatGPT y Copilot. Las fotografías de origen se acreditarán individualmente en el inventario de materiales.','Images processed or generated with ChatGPT and Copilot. Source photographs will be credited individually in the materials inventory.'],
    ['Música','Music'],['Música generada con Suno, en una pista de fondo independiente de la voz.','Music generated with Suno, on a background track independent of the voice.'],
    ['Intervención de IA','AI involvement'],['Se declara su uso en el desarrollo de los textos, la generación musical y el tratamiento o generación de imágenes. La selección y edición final corresponden al autor.','Its use is declared in text development, music generation, and image processing or generation. Final selection and editing are by the author.'],
    ['Información técnica','Technical information'],['Autorizaciones','Permissions'],['Contacto','Contact'],
    ['Siete piezas forman un recorrido desde la llegada a un lugar hasta una escena compartida alrededor de una mesa. El texto se acompaña de imágenes que ganan nitidez, silencios, música y una grabación de la elegía.','Seven pieces form a journey from arriving at a place to a shared scene around a table. The text is accompanied by images that gradually sharpen, silences, music and a recording of the elegy.'],
    ['La lectura conserva su propio tiempo. Las imágenes se revelan gradualmente y el sonido comienza cuando el lector lo elige. Cada pieza tiene una disposición y un ritmo propios; el epílogo devuelve el recorrido a una conversación cotidiana.','The reading preserves its own pace. Images reveal themselves gradually and sound begins when the reader chooses. Each piece has its own arrangement and rhythm; the epilogue returns the journey to an everyday conversation.'],
    ['Experiencia web interactiva en español, con siete poemas, 123 versos y el interludio visual «Iba a llevarte flores» (30 segundos, incluida la entrada del epílogo), antes del epílogo. Su duración depende de la lectura y la navegación. La traducción inglesa está disponible como base literaria para subtítulos; el vídeo lineal y los subtítulos definitivos siguen en preparación.','Interactive web experience in English, with seven poems, 123 lines and the visual interlude “I Was Going to Bring You Flowers” (30 seconds, including the epilogue entrance) before the epilogue. Its duration depends on reading and navigation. The English literary text is canonical for this international edition; the linear video and final subtitles remain in preparation.'],
    ['Los permisos para web, jurados, proyecciones y promoción se documentan por separado. El documento firmado y los datos personales de contacto se conservan de forma privada.','Permissions for web publication, juries, screenings and promotion are documented separately. Signed documents and personal contact details are kept private.'],
    ['Ceniciento es una obra independiente. Su acceso desde la obra se mantiene únicamente en el interrogante del retrato final.','Ceniciento is an independent work. Access from ANA KLAUDYA is retained only through the question mark on the final portrait.'],
    ['Contacto profesional pendiente de incorporar antes del envío a certámenes.','Professional contact details to be added before submission.'],

    // Festival / jury page
    ['Presentación para jurados y festivales','Presentation for juries and festivals'],['Abrir la obra web','Open the web work'],
    ['Naturaleza','Nature'],['Obra poética y audiovisual interactiva. Versión lineal de videopoesía en preparación.','Interactive poetic and audiovisual work. Linear videopoetry version in preparation.'],
    ['Idioma original','Original language'],['Español.','Spanish.'],['Duración web','Web duration'],['Abierta, según lectura, navegación y escucha.','Open-ended, depending on reading, navigation and listening.'],
    ['Duración audiovisual total','Total audiovisual duration'],['Pendiente de render y medición del vídeo final. Objetivo editorial del montaje: 09:27, incluidos los créditos; no es una duración definitiva.','Pending final render and measurement. Editorial target for the cut: 09:27 including credits; this is not a final duration.'],
    ['Subtítulos','Subtitles'],['Traducción inglesa disponible. Subtítulos temporizados definitivos pendientes de conformado al vídeo final.','English translation available. Final timed subtitles pending conformity to the final video.'],
    ['Estructura','Structure'],['Siete poemas · 123 versos · prólogo, elegía, ojos, labios, cabello, piel y epílogo, con el interludio visual «Iba a llevarte flores» antes del epílogo.','Seven poems · 123 lines · prologue, elegy, eyes, lips, hair, skin and epilogue, with the visual interlude “I Was Going to Bring You Flowers” before the epilogue.'],
    ['Sinopsis','Synopsis'],['Una llegada, una mirada, una voz y el recuerdo de un abrazo se suceden en siete poemas, con un interludio visual de 38 segundos, incluida la entrada del epílogo. La imagen se revela gradualmente y la lectura conduce desde la contemplación hasta una escena cotidiana en torno a una mesa.','An arrival, a gaze, a voice and the memory of an embrace unfold across seven poems, with a visual interlude leading into the epilogue. The image is gradually revealed and the reading moves from contemplation toward an everyday scene around a table.'],
    ['Ficha técnica y créditos','Technical sheet and credits'],['Concepto, edición final y recitado','Concept, final editing and recitation'],
    ['Formato del máster previsto','Planned master format'],['1920 × 1080 · H.264 · audio estéreo. Archivo definitivo aún no disponible.','1920 × 1080 · H.264 · stereo audio. Final file not yet available.'],
    ['Tratadas o generadas con ChatGPT y Copilot.','Processed or generated with ChatGPT and Copilot.'],['Generada con Suno. Pista independiente de la voz.','Generated with Suno. Track independent of the voice.'],
    ['Herramientas digitales e IA','Digital tools and AI'],['Intervención en textos, música e imágenes. La selección y edición final corresponden al autor. Los materiales de origen y sus permisos se documentan en el inventario de producción.','Used in texts, music and images. Final selection and editing are by the author. Source materials and permissions are documented in the production inventory.'],
    ['Materiales','Materials'],['Texto español completo','Complete Spanish text'],['Vídeo lineal en preparación.','Linear video in preparation.'],
    ['Subtítulos definitivos en preparación.','Final subtitles in preparation.'],['Estado de presentación','Submission status'],
    ['Visionado por jurados','Jury viewing'],['Proyecciones','Screenings'],['Promoción mediante imágenes o fragmentos','Promotion using images or excerpts'],
    ['La ficha identifica los materiales existentes y los que siguen pendientes. El máster lineal no incluye Ceniciento. La documentación firmada de permisos permanece privada.','This sheet identifies existing materials and those still pending. The linear master does not include Ceniciento. Signed permissions documentation remains private.'],
    ['Contacto profesional pendiente de incorporar antes del envío.','Professional contact details to be added before submission.']
  ];

  const table=new Map(pairs);
  const titleTable=new Map([
    ['Siguiendo una tarjeta','Following a Card'],['En tus ojos','In Your Eyes'],['En tus labios','On Your Lips'],['Tu cabello','Your Hair'],['Tu piel','Your Skin'],
    ['A fuego lento · Epílogo de Ana Klaudya','Over a Low Flame · Epilogue of Ana Klaudya'],
    ['Iba a llevarte flores · Interludio de Ana Klaudya','I Was Going to Bring You Flowers · Ana Klaudya Interlude'],
    ['Acerca de ANA KLAUDYA','About ANA KLAUDYA'],['ANA KLAUDYA · Jurados y festivales','ANA KLAUDYA · Juries and Festivals']
  ]);

  const translateValue=value=>{
    if(!value)return value;
    if(table.has(value))return table.get(value);
    let m=value.match(/^Anterior:\s*(.+)$/);if(m)return 'Previous: '+translateValue(m[1]);
    m=value.match(/^Siguiente:\s*(.+)$/);if(m)return 'Next: '+translateValue(m[1]);
    m=value.match(/^Recorrido ·\s*(.+)$/);if(m)return 'Journey · '+translateValue(m[1]);
    return value;
  };

  const translateText=node=>{
    if(!node||node.nodeType!==Node.TEXT_NODE||!node.parentElement||['SCRIPT','STYLE'].includes(node.parentElement.tagName))return;
    const raw=node.nodeValue,trimmed=raw.trim();
    if(!trimmed)return;
    const replacement=translateValue(trimmed);
    if(replacement!==trimmed){
      const start=raw.indexOf(trimmed);
      node.nodeValue=raw.slice(0,start)+replacement+raw.slice(start+trimmed.length);
    }
  };

  const translateElement=el=>{
    if(!(el instanceof Element))return;
    for(const attr of ['aria-label','title','alt','placeholder']){
      if(el.hasAttribute(attr)){
        const current=el.getAttribute(attr),translated=translateValue(current);
        if(translated!==current)el.setAttribute(attr,translated);
      }
    }
    for(const node of el.childNodes)if(node.nodeType===Node.TEXT_NODE)translateText(node);
  };

  const translateTree=root=>{
    if(root.nodeType===Node.TEXT_NODE){translateText(root);return;}
    if(!(root instanceof Element)&&root!==document)return;
    const scope=root===document?document.documentElement:root;
    if(scope instanceof Element)translateElement(scope);
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
    let node;while(node=walker.nextNode()){
      if(node.nodeType===Node.TEXT_NODE)translateText(node);else translateElement(node);
    }
  };

  const apply=()=>{
    document.documentElement.lang='en';
    const title=titleTable.get(document.title)||translateValue(document.title);
    if(title)document.title=title;
    const ogLocale=document.querySelector('meta[property="og:locale"]');if(ogLocale)ogLocale.setAttribute('content','en_GB');
    translateTree(document);
  };

  const start=()=>{
    apply();
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData')translateText(record.target);
        else if(record.type==='attributes')translateElement(record.target);
        else for(const node of record.addedNodes)translateTree(node);
      }
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder']});
    window.anaNmwpEnglish={apply,translateValue};
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
