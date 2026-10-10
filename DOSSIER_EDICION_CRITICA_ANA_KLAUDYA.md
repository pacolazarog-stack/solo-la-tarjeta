# DOSSIER / EDICIÓN CRÍTICA

## *ANA KLAUDYA · SOLO LA TARJETA · CENICIENTO*

**Idioma:** español  
**Autoría publicada:** flag  
**Edición canónica de *ANA KLAUDYA*:** cerrada el 9 de octubre de 2026  
**Paquete archivístico vigente:** versión 35; código y pruebas publicados en `main`, commit `181eda17be95a62ee0ac741dd8c66ea4dfd20c72`  
**Módulo compartido:** `narrative-universe.js`, versión `20261010-22`  
**Estado de este dossier:** documento crítico y de conservación; no forma parte de la interfaz de lectura.

> Este documento reúne información contextual, bibliográfica y técnica para prensa, investigación, programación de festivales y preservación. No debe incorporarse a las páginas de las obras ni presentarse como parte de su recorrido narrativo.

## 1. Identificación del conjunto

El conjunto comprende tres obras digitales en español: *ANA KLAUDYA*, *SOLO LA TARJETA* y *CENICIENTO*. Cada pieza puede recorrerse como una obra autónoma. En conjunto admiten una lectura retrospectiva: al descubrir otras piezas, ciertos elementos de las anteriores adquieren nuevos sentidos.

Antes de completar *CENICIENTO*, el interrogante de *ANA KLAUDYA* es la única entrada a esa obra y *SOLO LA TARJETA* no ofrece un enlace a ella. Al completar por primera vez la lectura o escucha de *CENICIENTO*, el desbloqueo queda guardado localmente. En las lecturas posteriores, el índice de *ANA KLAUDYA*, el pie de *SOLO LA TARJETA* y la navegación de *CENICIENTO* permiten ir desde cada obra a las otras dos. La tarjeta sigue conduciendo a *SOLO LA TARJETA*; los motivos secundarios no abren destinos.

| Señal o estado | Destino |
| --- | --- |
| tarjeta | *SOLO LA TARJETA* |
| ? en *ANA KLAUDYA* | *CENICIENTO* |
| *CENICIENTO* completado por primera vez | Desbloquea navegación recíproca persistente |
| Lecturas posteriores de *ANA KLAUDYA* | *SOLO LA TARJETA* y *CENICIENTO* desde el índice |
| Lecturas posteriores de *SOLO LA TARJETA* | *ANA KLAUDYA* y *CENICIENTO* desde el pie |
| Lecturas posteriores de *CENICIENTO* | *ANA KLAUDYA* y *SOLO LA TARJETA* |

Otros motivos —entre ellos «ojos de estatua», la Torre Eiffel, el reloj, el pan, la cebolla y la tarjeta anulada— funcionan como resonancias y no como enlaces.

## 2. Ficha de las obras

### *ANA KLAUDYA*

Edición española canónica compuesta por siete piezas y 123 versos. La edición se declaró cerrada el 9 de octubre de 2026. En los metadatos de la fuente figura como obra 21 de 21 del corpus literario. La página ofrece recorrido de lectura y acceso a voz.

### *SOLO LA TARJETA*

Pieza narrativa digital con texto, imágenes y sonido. Su página conserva el recorrido completo y un control de sonido. El módulo compartido guarda localmente el descubrimiento de la tarjeta y el estado de finalización para activar las relaciones narrativas; no guarda identidad ni transmite esos datos.

### *CENICIENTO*

Pieza digital con modos de lectura y escucha. El texto se conserva en `ceniciento/texto.md`; la edición de código consultada lleva 59 señales de voz dentro del HTML de la pieza. El flujo de publicación documentado compone el audio a partir de catorce fragmentos binarios y valida su suma SHA-256.

## 3. Acceso a las obras y a las fuentes

Las siguientes direcciones aparecen en el README del repositorio fuente. Se incluyen como referencias de acceso consignadas en la edición archivada; la disponibilidad y el contenido de cualquier publicación pueden cambiar.

- [*SOLO LA TARJETA* — edición web](https://pacolazarog-stack.github.io/solo-la-tarjeta/)
- [*ANA KLAUDYA* — edición web](https://pacolazarog-stack.github.io/solo-la-tarjeta/elegia-breve/)
- [*CENICIENTO* — edición web](https://pacolazarog-stack.github.io/solo-la-tarjeta/ceniciento/)
- [Repositorio fuente](https://github.com/pacolazarog-stack/solo-la-tarjeta)

La edición de código reunida en el archivo complementario contiene las páginas y los textos fuente necesarios para inspeccionar la implementación. La referencia remota utilizada como base fue el commit `f9d6a74429e9d64b478c139274dc1c443e7c925c` de `main`. Los diez archivos de código revisados en la versión archivística 15 se publicaron en `main` mediante el commit `79d073790dfdcf2bcbd2819cc2aa70bff06f9b0b`.

Los medios binarios (audio e imágenes) se mantienen como recursos referenciados o como elementos del repositorio, según corresponda; el archivo de código Markdown no los sustituye por transcripciones codificadas. Para una preservación integral deben conservarse junto con el repositorio y verificarse los recursos externos antes de una nueva publicación.

## 4. Guía de lectura

### Orientación sin revelar la arquitectura

Cada obra puede leerse de principio a fin por sí sola. Se puede leer, escuchar, pausar y volver. No hace falta encontrar todos los motivos ni seguir una ruta determinada. La versión web ofrece controles para la lectura y la escucha según la pieza.

### Nota crítica con revelaciones

La navegación deliberadamente no expone un mapa global ni explica la relación entre las obras. Las tres puertas son discretas y los demás motivos no abren páginas. La relación se reconstruye por memoria: *SOLO LA TARJETA* desplaza la lectura hacia un origen; *CENICIENTO* introduce otra perspectiva; «volver» lleva de nuevo a *ANA KLAUDYA* después de esa lectura. Las cuatro frases fantasma de la edición son:

1. «Hay historias que empiezan antes.»
2. «El origen suele parecer insignificante.»
3. «Falta una versión de la historia.»
4. «Nadie regresa al mismo lugar.»

En las notas de diseño del archivo fuente, el recorrido retrospectivo se describe como casualidad, mirada, reconocimiento y transformación. Esa explicación pertenece a este aparato crítico y no a la interfaz de las obras.

## 5. Registro de la edición y preservación

El paquete archivístico 14 conserva estas características verificadas en el código:

- HTML semántico, controles operables por teclado y etiquetas ARIA;
- adaptación a `prefers-reduced-motion`;
- revelado de pasajes de *SOLO LA TARJETA* mediante `IntersectionObserver`;
- estado narrativo local en el dispositivo, con datos de descubrimiento y frases ya mostradas;
- modos de lectura y escucha en *CENICIENTO*, con texto íntegro independiente de la voz;
- comprobaciones automatizadas para navegación, accesibilidad de controles, estructura de las piezas y las cuatro frases acordadas.

El estado local no identifica al visitante ni transmite su historial. Puede desaparecer al borrar los datos del navegador o cambiar de dispositivo. El código archivístico 14 no sincroniza el punto exacto de desplazamiento ni la posición de voz entre sesiones. La reproducción de audio depende de los recursos de medios y de las políticas del navegador.

La versión archivística 14 preserva los textos recibidos en la versión 13; los cambios se limitan a navegación, frases fantasma, separación de documentación y pruebas. No constituye una nueva edición textual. No se atribuyen a *SOLO LA TARJETA* ni a *CENICIENTO* fechas de cierre o recuentos canónicos que el paquete no documenta.

## 6. Cómo citar

### Cita de una obra web

> flag. *[Título de la obra]*. Edición digital en español, [fecha o versión indicada en la propia obra]. [URL de la obra]. Consultado el [fecha de consulta].

Ejemplo con la fecha canónica registrada para *ANA KLAUDYA*:

> flag. *ANA KLAUDYA*. Edición digital canónica en español, cerrada el 9 de octubre de 2026. https://pacolazarog-stack.github.io/solo-la-tarjeta/elegia-breve/. Consultado el [fecha de consulta].

### Cita del código fuente archivado

> flag. *Trilogía ANA KLAUDYA: código fuente español completo*. Versión archivística 28, lectura fotográfica de CENICIENTO y espacio de convergencia propuesto. Código del commit `pacolazarog-stack/solo-la-tarjeta`, commit de código `7387caaa463fc07febac6c1028ac8e4049f23e96`; módulo compartido `20261010-17`. Archivo Markdown de conservación, fuera de la interfaz de lectura.

Para citas académicas, conviene especificar la pieza, el modo de acceso (lectura o escucha), la URL y la fecha de consulta. Si se cita un verso, añadir el nombre de la pieza y el identificador o encabezado de sección disponible en la edición consultada. No asignar números de verso que la obra no muestre.

## 7. Referencias documentales

- Repositorio fuente: [github.com/pacolazarog-stack/solo-la-tarjeta](https://github.com/pacolazarog-stack/solo-la-tarjeta)
- README de la edición fuente: rutas de acceso a las tres obras y nota de cierre canónico de *ANA KLAUDYA*.
- `ana-klaudya/TEXTO_CANONICO_ES.md`: texto español canónico de *ANA KLAUDYA*.
- `ceniciento/texto.md`: texto de lectura de *CENICIENTO*.
- `ceniciento/index.html`: interfaz de lectura/escucha y 59 señales de voz de *CENICIENTO*.
- `ceniciento/narracion.txt`: material de narración asociado a *CENICIENTO*.
- Archivo complementario vigente: [TRILOGIA_ANA_KLAUDYA_CODIGO_ES (26).md](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(26).md).

## 8. Separación editorial

Este dossier explica relaciones, procedencia y conservación para quienes necesitan documentar las obras. La experiencia pública conserva sus propias señales y silencios. No se debe insertar en la navegación, enlazar desde una pista oculta ni mostrar como explicación al terminar una pieza. Su función es hacer citable y preservable el conjunto sin convertir el aparato crítico en parte obligatoria de la lectura.

## 9. Nota histórica sobre la versión archivística 10

La versión local 10 documentaba decisiones de conservación que no deben confundirse con las funciones presentes en el paquete de la versión 14. El historial de esa versión no reemplaza la ficha actual ni amplía sus capacidades.

### Prueba de supresión

- **Tarjeta, interrogante y «volver»:** se conservan como las tres puertas entre obras. Suprimir cualquiera alteraría el recorrido definido en el paquete.
- **Frases fantasma:** se conservan cuatro y sus activaciones corresponden a estados distintos de lectura: después de ANA, al descubrir la tarjeta, antes de revelar el interrogante y al regresar de CENICIENTO.
- **Reloj y otros motivos:** permanecen como motivos de memoria, sin función de navegación. Si no sostienen una resonancia textual en la pieza concreta, esa aparición debe revisarse durante la corrección literaria; el mero hecho de que figure en el inventario de motivos no justifica conservarla.

### Prueba de autonomía

Las páginas ofrecen lectura o escucha sin exigir el mapa ni el dossier. El archivo de código sí contiene notas de diseño y documentación para conservación; son paratexto del paquete fuente, no texto que la interfaz presente como explicación. El README del repositorio enumera las tres direcciones web, pero no constituye un paso necesario para iniciar o completar ninguna obra.

### Prueba de relectura

La navegación y los estados guardados implementan las condiciones para que el lector recuerde y vuelva. El código puede verificar esos disparadores, pero no demostrar que cada hallazgo transforma de verdad la interpretación. Esa conclusión exige cotejar los textos completos y probar el recorrido como lector, antes y después de cada descubrimiento. Debe conservarse como criterio de revisión, no anotarse como resultado técnico ya probado.

## 10. Auditoría de *TRILOGÍA ANA KLAUDYA — código fuente español completo (13)*

Revisión realizada sobre el archivo adjunto `TRILOGIA_ANA_KLAUDYA_CODIGO_ES (13).md`. El adjunto se conserva sin cambios.

### Resultado editorial

La versión 13 contiene las tres puertas previstas —tarjeta, interrogante y «volver»—, pero no las limita a esas tres. En `narrative-universe.js`, `activateSoloSymbols()` convierte también en enlaces «Ojos de estatua», «París», «La tarjeta quedó anulada» y «reloj». Sus destinos son secciones de *ANA KLAUDYA* o *CENICIENTO*. Al final de *SOLO LA TARJETA*, `showSoloEndNav()` añade además dos enlaces visibles: «Volver a Ana Klaudya» e «Ir a Ceniciento». Por tanto, el sistema invita a recorrer un menú de conexiones y no respeta la regla de que esos motivos sean sólo ecos.

La misma fuente contiene **ocho frases fantasma distintas**:

- «Hay historias que empiezan antes.»
- «Todo esto ocurrió después.»
- «Falta una versión de la historia.»
- «No todo lo que se mira puede describirse.»
- «Y también antes.»
- «Una casualidad rara vez termina donde parece.»
- «El tiempo nunca desaparece.»
- «No estaba ocurriendo lo que parecía.»

De las cuatro frases fijadas para la edición austera, aparecen «Hay historias que empiezan antes» y «Falta una versión de la historia»; no aparecen «El origen suele parecer insignificante» ni «Nadie regresa al mismo lugar». Las otras seis amplían el conjunto. En CENICIENTO, dos se disparan por tiempos de reproducción de la voz; otras dependen de tiempos de espera o de completar el desplazamiento. Esto se aparta de la economía de cuatro frases y de la idea de que los cambios respondan principalmente al acto de leer.

### Autonomía de lectura

Las obras conservan texto completo y modos de lectura propios, así que no exigen consultar el README ni el mapa para entender cada pieza. Sin embargo, la navegación final de *SOLO LA TARJETA* hace explícitos dos destinos y la activación de símbolos convierte resonancias en controles. La autonomía textual se mantiene; la arquitectura oculta, en cambio, queda parcialmente expuesta por la interfaz.

### Relectura de los textos

La conexión de *SOLO LA TARJETA* con *ANA KLAUDYA* es plausible y más sutil. El prólogo de *ANA KLAUDYA* comienza «Siguiendo una tarjeta» y convierte el hallazgo de un lugar en hogar; el relato de Paco desarrolla una tarjeta y un viaje como accidente que abre una relación. Leído después, ofrece una historia concreta que resuena con el origen evocado por el prólogo, sin que haga falta afirmar que todos los personajes son idénticos.

La conexión de *CENICIENTO* con *ANA KLAUDYA* es más fuerte. El desenlace revela que la joven había seguido viendo y abrazando al Paco de sesenta y dos años, aunque él se contemplara bajo la apariencia de su juventud. Esa revelación reorienta la lectura de los poemas de mirada, rostro y contacto de *ANA KLAUDYA*: el centro pasa de ser sólo la mirada de Paco hacia Ana a incluir la mirada de ella hacia Paco. La relectura nace del relato; las frases explicativas adicionales no son necesarias para producirla.

### Disciplina de versión

El nombre del adjunto lo identifica como versión 13, pero su encabezado no consigna una versión archivística propia y declara `narrative-universe.js` versión `20261010-7`, con commit base `f9d6a74429e9d64b478c139274dc1c443e7c925c`. Conviene registrar por separado número editorial del paquete, revisión del módulo y commit fuente para que una conservación futura permita distinguirlos.

### Dictamen

La versión 13 supera la prueba de que las piezas pueden leerse completas y conserva dos relecturas legítimas, especialmente la que produce *CENICIENTO*. No supera la prueba de supresión ni la contención acordada: multiplica los enlaces simbólicos, añade una navegación final explícita y casi duplica el máximo de frases fantasma. La corrección editorial prioritaria es reducir esos elementos a las tres puertas y las cuatro frases fijadas, preservando como ecos sin enlace los demás motivos.

## 11. Actualización editorial y técnica de la versión 14

La versión 14 aplica las correcciones indicadas por la auditoría de la versión 13:

- conserva como transiciones entre las obras la tarjeta, el interrogante y «volver»;
- retira la navegación desde los motivos «Ojos de estatua», «París», la tarjeta anulada y el reloj;
- elimina el menú de destinos que aparecía al final de *SOLO LA TARJETA*;
- limita las frases fantasma a «Hay historias que empiezan antes», «El origen suele parecer insignificante», «Falta una versión de la historia» y «Nadie regresa al mismo lugar»;
- retira de la interfaz de *ANA KLAUDYA* los enlaces a «Acerca del proyecto» y «Jurados y festivales»; esa documentación permanece fuera de la obra;
- añade pruebas automatizadas para impedir que reaparezcan las rutas simbólicas, las frases extra o los enlaces documentales en la interfaz.

Se ejecutaron las siete comprobaciones CJS incluidas en el paquete archivístico 14; todas pasan. Los cambios de código se publicaron en el repositorio el 10 de octubre de 2026 mediante el commit `d41e87817a801545209f6e85379a0c5c800e1517`. La publicación del código en GitHub no implica por sí sola que las URLs de acceso listadas en este dossier ya hayan terminado de desplegarse.

La relectura de *SOLO LA TARJETA* hacia *ANA KLAUDYA* funciona como resonancia del origen y del motivo de la tarjeta. La de *CENICIENTO* hacia *ANA KLAUDYA* tiene un efecto más directo: cambia quién mira y quién es mirado. La arquitectura se considera editorialmente cerrada en estas conexiones; la frase rectora queda así:

> La fuerza del sistema no reside en cuántas conexiones existen, sino en cuántas conexiones el lector es capaz de recordar por sí mismo.


## 12. Revisión móvil de la versión 15

La versión 15 toma el teléfono como soporte principal. Conserva las tres puertas y no añade rótulos de menú. La tarjeta pasa a 112 × 70 px en pantallas estrechas, respeta el área segura del dispositivo y mantiene un nombre accesible; el interrogante dispone de un área de toque de 80 × 80 px, aparece antes en móvil y deja de pulsar en dispositivos táctiles; «volver» cuenta con un área mínima de 100 × 48 px, situada de forma estable sobre el borde seguro inferior.

El final de *SOLO LA TARJETA* y el cierre de lectura de *CENICIENTO* se activan al entrar en vista la última línea o la firma, mediante `IntersectionObserver`. Se conserva la alternativa basada en scroll para navegadores sin esa API. Las páginas afectadas ajustan el viewport para ocupar correctamente la pantalla y respetar las áreas seguras.

Las siete comprobaciones CJS del paquete pasan, incluidas verificaciones de las zonas táctiles, el fin de lectura observado y la ausencia de nuevas rutas. El código se publicó en `main` el 10 de octubre de 2026 mediante el commit `79d073790dfdcf2bcbd2819cc2aa70bff06f9b0b`; la edición de conservación y este dossier se registran en el commit documental posterior.


## 13. Corrección de navegación final de la versión 16

La revisión 15 no mostraba controles al completar *SOLO LA TARJETA*. La versión 16 restaura dos botones al final de la pieza: «Volver a ANA KLAUDYA» y «Ir a CENICIENTO». El cierre se activa cuando la última línea entra en la zona observada por `IntersectionObserver`; los navegadores sin esa API usan el respaldo por scroll. Los botones aparecen después de ese evento, no durante la lectura.

En pantallas táctiles, los botones se apilan en columna y cada uno tiene una altura mínima de 52 px; en pantallas más anchas se presentan juntos. Respetan el área segura inferior, el foco visible por teclado y la preferencia de movimiento reducido. La navegación tiene un nombre accesible y no depende de hover. Los motivos secundarios se mantienen como ecos sin enlace.

Se ejecutaron las siete comprobaciones CJS de la edición y todas pasaron. El código corregido quedó publicado en `main` mediante `50313d6b562e199222942bb4c103107ac48b28b`; el archivo archivístico completo de la versión 16 y este dossier se publican en el commit documental siguiente.


## 14. Ajuste de controles móviles de la versión 17

La captura móvil recibida muestra la tarjeta y la navegación fija de lectura en *ANA KLAUDYA* ocupando la misma zona inferior; el texto final también queda detrás de esos controles. La versión 17 dispone la navegación «Anterior / Índice / Siguiente» como una barra compacta de tres columnas en teléfonos, coloca la tarjeta por encima de esa barra y reserva 240 px al final del contenido para permitir que el lector desplace el último texto hasta una zona despejada. La tarjeta y la barra respetan el área segura del dispositivo.

Se añade una comprobación al control móvil para verificar la fila de navegación, el espacio de lectura y la separación vertical de la tarjeta. Las siete pruebas CJS pasan. El código se publicó en `main` mediante `3b14bda6c9d548316731fa9265a9069ca9186c1b`; el archivo archivístico completo de la versión 17 y este dossier se registran en el commit documental siguiente.


## 15. Separación final de la tarjeta y la navegación móvil

La versión 18 sitúa la tarjeta 88 px por encima del borde inferior seguro del teléfono; la barra compacta «Anterior / Índice / Siguiente» permanece junto al borde inferior. Esta distancia deja al menos 12 px de separación respecto a la barra incluso cuando `safe-area-inset-bottom` vale cero. El relleno inferior de 240 px al final del recorrido permite llevar el último texto por encima de la tarjeta y de la navegación.

La prueba móvil verifica la barra de una fila, el espacio de lectura y la posición de la tarjeta. Las siete comprobaciones CJS pasan. El código se publicó en `main` mediante `ac13094d015f28965f9890e3bc277cef2845637a`; el paquete archivístico 18 y este dossier se registran en el commit documental siguiente.


## 16. Compactación de portadas móviles de la versión 19

La versión 19 reduce en teléfonos el espacio de cabecera, el tamaño y los márgenes de los títulos, el espacio entre acciones y el bloque de sonido en las portadas de *ANA KLAUDYA*, sus poemas independientes y *CENICIENTO*. Los botones «Leer con pausas» y «Poema completo» se conservan; los controles de música siguen disponibles en un bloque compacto de dos columnas. El poema comienza antes y gana área visible sin alterar el texto ni añadir navegación. En pantallas bajas se aplica un ajuste adicional.

Las siete comprobaciones CJS se ejecutaron y pasan. El código se publicó en `main` mediante `6527b9fd27dc0e9635ca255b4838ffb899349c2e`. El paquete de código español completo se conserva en [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (19).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(19).md); este dossier permanece fuera de la interfaz de lectura.


## 17. Separación de tarjeta y navegación móvil en la versión 20

La captura recibida muestra que, en un teléfono con ancho CSS superior a 480 px, «Anterior / Índice / Siguiente» salta a dos filas y tapa parcialmente la tarjeta. La corrección aplica la fila de tres columnas a toda la gama móvil hasta 760 px, con ancho y tamaños de botón acotados. La tarjeta conserva su posición móvil, ahora separada de los tres controles.

La comprobación `check-mobile-navigation.cjs` verifica la regla de una sola fila hasta 760 px. Las siete pruebas CJS pasan. El código se publicó en `main` mediante `23608494d4fdfe911d0492472db88485f5453128`; el código completo actualizado queda en [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (20).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(20).md).


## 18. Visibilidad del fondo COTÁN en móvil en la versión 21

La barra inferior de navegación conserva una sola fila hasta 760 px y adopta un fondo oscuro translúcido con desenfoque leve; así la imagen de bodegón puede verse a través de los controles sin sacrificar legibilidad. La tarjeta flotante se reduce a 86 × 54 px y su placa también deja pasar parte de la fotografía. El contenido de la obra y la imagen permanecen intactos.

La prueba móvil comprueba la translucidez de la navegación y la tarjeta compacta; las siete comprobaciones CJS pasan. El código se publicó en `main` mediante `e5461949f48ffaa4209c6e11b003c682730702f0`; el archivo fuente completo es [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (21).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(21).md).


## 19. Criterio de calidad para la edición móvil

La relectura decisiva procede de los propios textos y, en particular, de la relación entre *CENICIENTO* y *ANA KLAUDYA*. Las animaciones, los estados y las transiciones pueden acompañar la experiencia, pero no deben ser necesarios para que esa relación exista. Si al retirarlos la lectura retrospectiva permanece, la arquitectura narrativa se sostiene por sí misma.

La edición móvil canónica conserva tres puertas entre obras —tarjeta, interrogante y «volver»—, cuatro frases fantasma y motivos secundarios que funcionan como ecos de memoria. Los accesos deben ser objetos táctiles claros y fáciles de hallar con el pulgar; los motivos resonantes no se convierten en navegación. El criterio no es añadir más controles, sino facilitar la lectura sin debilitar el misterio.


## 20. Cierre editorial y conservación móvil · versión 22

La revisión 22 no añade rutas, símbolos ni controles narrativos y no altera los poemas. Conserva como núcleo las tres puertas entre obras y las cuatro frases fantasma fijadas en este dossier. Los motivos secundarios —ojos de estatua, Torre Eiffel, reloj, pan, cebolla, tarjeta anulada y ausencia— sólo cuentan como ecos de memoria cuando están sostenidos por los textos; no se convierten en enlaces.

El criterio principal es que la relectura nazca de los textos, sobre todo de la relación entre *CENICIENTO* y *ANA KLAUDYA*. Animaciones, estados y transiciones pueden acompañar el recorrido, pero al retirarlos debe permanecer la posibilidad de releer de otra manera lo ya leído. El código puede comprobar disparadores y accesibilidad; la transformación interpretativa requiere evaluación editorial de las obras completas.

La edición móvil se diseña para lectura con pulgar, sin depender de hover, zoom ni objetivos diminutos. Las puertas deben ser reconocibles y táctiles, y los controles no deben tapar la tarjeta, el fondo COTÁN ni el texto. La reducción de información de portada sirve para ampliar la superficie útil de lectura e imagen, preservando contraste, áreas seguras y acceso por teclado o tecnologías de asistencia.

La revisión documental actualiza este dossier y el archivo Markdown integral. No modifica el código publicado en el commit `e5461949f48ffaa4209c6e11b003c682730702f0`, ni constituye una nueva edición textual.


## 21. Puertas, resonancias y economía narrativa · versión 23

La edición distingue dos funciones. Las puertas cambian el recorrido entre obras: tarjeta → *SOLO LA TARJETA*; ? → *CENICIENTO*; «volver» → *ANA KLAUDYA*. Las resonancias cambian la memoria y la lectura, no la navegación. Ojos de estatua, Torre Eiffel, reloj, pan, cebolla y tarjeta anulada pueden permanecer en la experiencia móvil como motivos visibles, pero no como enlaces, botones ni controles. La regla retira su función interactiva, no obliga a borrar su presencia visual o textual.

La auditoría de ocho frases fantasma corresponde al paquete histórico de la versión 13 y debe leerse en ese alcance. El código de la versión 22, preservado en el paquete actual, implementa las cuatro frases canónicas —«Hay historias que empiezan antes», «El origen suele parecer insignificante», «Falta una versión de la historia» y «Nadie regresa al mismo lugar»—; la prueba de inventario automatizada del módulo compartido verifica exactamente esas cuatro. No se debe trasladar el hallazgo histórico de la versión 13 al código vigente.

La relectura fuerte debe nacer de los textos, en particular de la relación entre *ANA KLAUDYA* y *CENICIENTO*. JavaScript, animaciones, efectos y estado local pueden sostener la accesibilidad y continuidad del recorrido, pero no ser requisito para que el lector perciba una transformación de sentido. La documentación crítica fija este criterio fuera de la interfaz pública.

La versión 23 es una actualización documental y archivística. No altera el código publicado en `e5461949f48ffaa4209c6e11b003c682730702f0` ni los textos canónicos.


## 22. Corrección de visibilidad del fondo COTÁN en móvil · versión 24

La captura móvil confirma que la barra inferior seguía presentándose como una placa casi opaca. La versión 24 reduce su fondo a una opacidad del 18 %, elimina el desenfoque que velaba la imagen y conserva el contraste de las etiquetas con sombra de texto. El estilo base adopta también la placa translúcida para evitar que el fondo claro opaque la fotografía en dispositivos cuyo viewport no active el corte móvil. La tarjeta compacta permanece sin cambios.

Las siete comprobaciones CJS pasan, incluida la prueba móvil actualizada. El código se publicó en `main` mediante `c734c9fcd665c830690e4aa19f46e73baac30f78`; el archivo archivístico completo correspondiente es [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (25).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(25).md).


## 23. Acceso único a CENICIENTO y salidas finales · versión 25

La entrada de navegación a *CENICIENTO* queda reservada al interrogante de *ANA KLAUDYA*. Se elimina el enlace «Ir a CENICIENTO» del final de *SOLO LA TARJETA*. En ese cierre sólo queda «Volver a ANA KLAUDYA».

Al acabar *CENICIENTO*, sí se permite continuar hacia ambas piezas: «volver» conduce a *ANA KLAUDYA* y un segundo enlace conduce a *SOLO LA TARJETA*. Estos controles aparecen sólo cuando termina la lectura —firma observada o narración terminada— y tras la pausa prevista. Desde el marco de lectura de ANA, ambos enlaces abren los destinos en la ventana superior. El enlace hacia *SOLO LA TARJETA* no simula el descubrimiento de la tarjeta.

El cambio conserva las tres puertas de entrada definidas por la arquitectura y añade una salida poslectura desde *CENICIENTO* a *SOLO LA TARJETA*. No convierte motivos secundarios en controles. Se actualiza el identificador del módulo compartido para evitar que el navegador conserve una copia anterior. Las siete pruebas CJS pasan. Código publicado en `main` mediante `78e715f9f920cb7353ab4aca177377e6332a4b13`; archivo fuente integral: [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (25).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(25).md).


## 24. Navegación recíproca después de completar CENICIENTO · versión 26

El primer final de lectura o escucha de *CENICIENTO* activa un estado persistente en `localStorage`. Antes de ese desbloqueo, el interrogante de *ANA KLAUDYA* continúa siendo la única entrada a *CENICIENTO* y *SOLO LA TARJETA* no enlaza a esa pieza.

Después del desbloqueo, las lecturas sucesivas ofrecen navegación entre las tres obras: el índice de *ANA KLAUDYA* muestra accesos a *SOLO LA TARJETA* y *CENICIENTO*; el pie de *SOLO LA TARJETA* muestra accesos a *ANA KLAUDYA* y *CENICIENTO*; y *CENICIENTO* muestra accesos a las otras dos. En *SOLO LA TARJETA*, los botones se sitúan en el flujo tras el contenido para dejar libre la imagen de Cotán y la tarjeta. En *ANA KLAUDYA*, los accesos se ubican dentro del índice. El estado permanece en el dispositivo y no se transmite.

El módulo compartido se actualiza a `20261010-14`. Las siete pruebas CJS pasan. Código publicado en `main` mediante `eda9a2183f9b9548f5d4b159d1dbf689202b6e59`; archivo fuente integral: [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (26).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(26).md).


## 25. Criterio rector y auditoría integral · versión 27

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

Éste es el criterio rector de la trilogía y de la revisión de su implementación. Una puerta se justifica cuando habilita una relectura, no por el mero hecho de añadir una ruta. Las tres transiciones base son tarjeta → *SOLO LA TARJETA*, interrogante → *CENICIENTO* y «volver» → *ANA KLAUDYA*. Antes de completar *CENICIENTO*, el interrogante de *ANA KLAUDYA* es la única vía de acceso a esa obra. Al completar su lectura o escucha por primera vez, el sistema guarda el desbloqueo y habilita navegación recíproca en las visitas posteriores. Los motivos restantes —ojos de estatua, Torre Eiffel, reloj, pan, cebolla y tarjeta anulada— permanecen como ecos sin destino de navegación.

### Resultado editorial

El criterio se mantiene coherente: *SOLO LA TARJETA* convierte la tarjeta en origen; *CENICIENTO* desplaza la mirada hacia quien observa a Paco; «volver» devuelve al lector a *ANA KLAUDYA* con una lectura transformada. La interfaz no explica esa relación. Se conservan exactamente cuatro frases fantasma: «Hay historias que empiezan antes», «El origen suele parecer insignificante», «Falta una versión de la historia» y «Nadie regresa al mismo lugar». No se añadieron nuevas obras, símbolos, rutas ni frases.

### Hallazgos y correcciones de implementación

La auditoría detectó que la primera finalización de *CENICIENTO* almacenaba el estado de finalización y luego lo consultaba como si ya existiera antes de esa lectura. Esto impedía distinguir la primera experiencia de las visitas posteriores y anulaba la pausa prevista antes de presentar las salidas. Se corrigió capturando el estado previo: la primera vez, los controles aparecen 6,2 segundos después del cierre; en lecturas posteriores, aparecen al entrar en la pieza.

La salida de *CENICIENTO* hacia *SOLO LA TARJETA* ya no pierde el estado de retorno. Ambos destinos desde *CENICIENTO* registran que la lectura fue completada y que el lector vuelve al sistema; al regresar a *ANA KLAUDYA*, queda disponible la frase «Nadie regresa al mismo lugar». La entrada a *CENICIENTO* sigue dependiendo del interrogante antes de su primer cierre.

Los botones del cierre de *CENICIENTO* pasan al flujo normal bajo el texto en el modo de lectura. En el modo de voz, el verso final y el indicador reciben espacio libre cuando aparecen los controles. Esta corrección atiende la superposición móvil sin cubrir la tarjeta ni el fondo de Cotán en *SOLO LA TARJETA*. Las rutas desbloqueadas quedan en el índice de *ANA KLAUDYA*, al final de *SOLO LA TARJETA* y en el cierre de *CENICIENTO*, fuera de la superficie del texto o imagen principal.

### Verificación y límites

Se ejecutaron las siete comprobaciones automatizadas del paquete: navegación móvil; recorrido y estados entre obras; cierre de *SOLO LA TARJETA*; estructura de la pieza; secuencia del interludio; apertura del epílogo; y lectura, firma y salidas de *CENICIENTO*. Las siete pasan. Las pruebas verifican comportamiento del código, condiciones de ruta, tamaño táctil y reglas CSS relevantes. No equivalen a una prueba visual en todos los modelos de teléfono; por ello, la verificación física de encuadres y fondos sigue siendo una comprobación editorial recomendada.

La revisión confirma HTML en español, controles con nombres accesibles, navegación táctil sin dependencia de hover, prefers-reduced-motion, observación de finales de lectura con IntersectionObserver y alternativas de scroll, y estado persistente local. CENICIENTO usa aria-live="polite" para su superficie de lectura. El estado guardado en localStorage no se sincroniza entre dispositivos.

**Pendiente archivístico:** las páginas revisadas no incluyen JSON-LD ni metadatos Dublin Core. La identificación de autoría, fecha de cierre, número de edición y linaje de versión se documenta en este dossier y en el archivo de código, pero aún no se publica como metadato estructurado legible por máquinas en las páginas. La recomendación es añadirlo en el aparato head de cada obra sin mostrar explicaciones de la arquitectura al lector.

**Publicación:** código y pruebas en main, commit e9877adc27ee90d7b8595f4616ea7c79f8ecbc18; paquete integral: [TRILOGIA_ANA_KLAUDYA_CODIGO_ES (27).md](https://github.com/pacolazarog-stack/solo-la-tarjeta/blob/main/TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(27).md).


## 25. Criterio rector y auditoría integral · versión 27

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

Éste es el criterio rector de la trilogía y de la revisión de su implementación. Una puerta se justifica cuando habilita una relectura, no por el mero hecho de añadir una ruta. Las tres transiciones base son tarjeta → *SOLO LA TARJETA*, interrogante → *CENICIENTO* y «volver» → *ANA KLAUDYA*. Antes de completar *CENICIENTO*, el interrogante de *ANA KLAUDYA* es la única vía de acceso a esa obra. Al completar su lectura o escucha por primera vez, el sistema guarda el desbloqueo y habilita navegación recíproca en las visitas posteriores. Los motivos restantes —ojos de estatua, Torre Eiffel, reloj, pan, cebolla y tarjeta anulada— permanecen como ecos sin destino de navegación.

### Resultado editorial

El criterio se mantiene coherente: *SOLO LA TARJETA* convierte la tarjeta en origen; *CENICIENTO* desplaza la mirada hacia quien observa a Paco; «volver» devuelve al lector a *ANA KLAUDYA* con una lectura transformada. La interfaz no explica esa relación. Se conservan exactamente cuatro frases fantasma: «Hay historias que empiezan antes», «El origen suele parecer insignificante», «Falta una versión de la historia» y «Nadie regresa al mismo lugar». No se añadieron nuevas obras, símbolos, rutas ni frases.

### Hallazgos y correcciones de implementación

La auditoría detectó que la primera finalización de *CENICIENTO* almacenaba el estado de finalización y luego lo consultaba como si ya existiera antes de esa lectura. Esto impedía distinguir la primera experiencia de las visitas posteriores y anulaba la pausa prevista antes de presentar las salidas. Se corrigió capturando el estado previo: la primera vez, los controles aparecen 6,2 segundos después del cierre; en lecturas posteriores, aparecen al entrar en la pieza.

La salida de *CENICIENTO* hacia *SOLO LA TARJETA* ya no pierde el estado de retorno. Ambos destinos desde *CENICIENTO* registran que la lectura fue completada y que el lector vuelve al sistema; al regresar a *ANA KLAUDYA*, queda disponible la frase «Nadie regresa al mismo lugar». La entrada a *CENICIENTO* sigue dependiendo del interrogante antes de su primer cierre.

Los botones del cierre de *CENICIENTO* pasan al flujo normal bajo el texto en el modo de lectura. En el modo de voz, el verso final y el indicador reciben espacio libre cuando aparecen los controles. Esta corrección atiende la superposición móvil sin cubrir la tarjeta ni el fondo de Cotán en *SOLO LA TARJETA*. Las rutas desbloqueadas quedan en el índice de *ANA KLAUDYA*, al final de *SOLO LA TARJETA* y en el cierre de *CENICIENTO*, fuera de la superficie del texto o imagen principal.

### Verificación y límites

Se ejecutaron las siete comprobaciones automatizadas del paquete: navegación móvil; recorrido y estados entre obras; cierre de *SOLO LA TARJETA*; estructura de la pieza; secuencia del interludio; apertura del epílogo; y lectura, firma y salidas de *CENICIENTO*. Las siete pasan. Las pruebas verifican comportamiento del código, condiciones de ruta, tamaño táctil y reglas CSS relevantes. No equivalen a una prueba visual en todos los modelos de teléfono; por ello, la verificación física de encuadres y fondos sigue siendo una comprobación editorial recomendada.

La revisión confirma HTML en español, controles con nombres accesibles, navegación táctil sin dependencia de hover, prefers-reduced-motion, observación de finales de lectura con IntersectionObserver y alternativas de scroll, y estado persistente local. CENICIENTO usa aria-live="polite" para su superficie de lectura. El estado guardado en localStorage no se sincroniza entre dispositivos.

**Pendiente archivístico:** las páginas revisadas no incluyen JSON-LD ni metadatos Dublin Core. La identificación de autoría, fecha de cierre, número de edición y linaje de versión se documenta en este dossier y en el archivo de código, pero aún no se publica como metadato estructurado legible por máquinas en las páginas. La recomendación es añadirlo en el aparato head de cada obra sin mostrar explicaciones de la arquitectura al lector.

**Publicación:** código y pruebas en main, commit e9877adc27ee90d7b8595f4616ea7c79f8ecbc18; paquete integral: [TRILOGIA_ANA_KLAUDYA_CODIGO_ES (27).md](https://github.com/pacolazarog-stack/solo-la-tarjeta/blob/main/TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(27).md).



## 26. Lectura fotográfica de CENICIENTO y EL ESPEJO · versión 28

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

El modo de lectura de CENICIENTO sitúa ahora el texto sobre la secuencia fotográfica que ocupa el fondo. La secuencia avanza con el desplazamiento por el texto y hace visible la transformación de Paco, incluido el cambio de su cabello. El retrato independiente que antes ocupaba la parte superior desaparece en este modo para que la fotografía de fondo pueda ocupar toda la pantalla, especialmente en móvil. Una capa oscura translúcida, tipografía clara y sombra de texto preservan contraste. El modo de voz conserva su secuencia basada en tiempo. No se ha cambiado el texto canónico ni la navegación.

### EL ESPEJO: definición editorial provisional

La idea se registra como una superficie de convergencia —una habitación de colapso para las tres trayectorias— y no como cuarta obra, página de menú o enlace. Su razón de existir es hacer coincidir resonancias ya presentes y dejar al lector realizar la conexión. Por ello, no se añaden botones, indicaciones, voz, movimiento ni explicación. Las frases propuestas en el intercambio quedan como materiales de trabajo, no como texto aprobado. El intervalo de 150–400 palabras también queda como orientación provisional, sin redactar contenido nuevo hasta definir la composición.

### Verificación

Se ejecutaron de nuevo las siete pruebas automatizadas; todas pasan. La comprobación de CENICIENTO verifica que el fondo permanece nítido en lectura, que la placa del texto es translúcida y que el avance de la fotografía depende del desplazamiento de lectura. Los enlaces del módulo se actualizaron para evitar caché. La prueba no sustituye una inspección visual en dispositivos físicos.

La observación archivística del apartado anterior sigue vigente: las páginas aún carecen de JSON-LD y Dublin Core; el estado guardado en localStorage es local al navegador. La documentación continúa fuera de la experiencia narrativa.

Publicación: código y pruebas en main, commit 7387caaa463fc07febac6c1028ac8e4049f23e96; fuente integral: [TRILOGIA_ANA_KLAUDYA_CODIGO_ES (28).md](https://github.com/pacolazarog-stack/solo-la-tarjeta/blob/main/TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(28).md).


## 27. Secuencia convergente de EL ESPEJO · versión 29

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

La propuesta de 32 fragmentos se integra como una estancia final de lectura, no como cuarta obra, URL independiente ni nueva puerta. Sólo aparece al final de CENICIENTO cuando el estado local confirma que ANA KLAUDYA, SOLO LA TARJETA y CENICIENTO han sido completadas. Se presenta una sola vez por navegador. Si la lectura se interrumpe antes del fragmento final, la estancia no se marca como completada y puede aparecer de nuevo.

Cada fragmento ocupa una pantalla y avanza con el desplazamiento. Los fragmentos 14, 15, 17, 26 y 30 detienen el avance hasta que el lector elige «seguir»: la pausa es manual, no un temporizador. La secuencia no incorpora voz, música, animación explicativa, mapa, título de menú ni enlace a otra página. Al llegar al final se habilitan las salidas de CENICIENTO ya existentes: «volver» a ANA KLAUDYA y SOLO LA TARJETA. El acceso inicial a CENICIENTO continúa reservado al interrogante; una lectura completada permite los enlaces recíprocos en recorridos posteriores.

Los 32 fragmentos son una composición de convergencia nueva, distinta de las cuatro frases fantasma. Estas últimas permanecen en su inventario canónico de cuatro; la composición no se registra como frases fantasma ni cambia sus ubicaciones. Los motivos de la tarjeta, la mirada, el reloj, el pan, la cebolla y el regreso funcionan como resonancias. El texto narrativo original de las tres piezas permanece intacto.

### Implementación y verificación

La sala está contenida en la página de CENICIENTO y se crea desde `ceniciento/el-espejo.js`; no se añade un enlace con destino EL ESPEJO. El módulo compartido espera el estado de lectura de las tres piezas y registra la finalización de la estancia para que no se repita después de completada. Las escenas usan ajuste de desplazamiento, objetivos de lectura accesibles y pausas por acción explícita. El contenido se conserva en español exactamente como fue propuesto.

Las siete pruebas anteriores y la nueva comprobación `ceniciento/check-espejo.cjs` pasan: ocho en total. La prueba nueva verifica el recuento de 32 escenas, la lista exacta de pausas, el disparador tras completar las tres piezas, la persistencia, la ausencia de temporizadores y el mantenimiento de las cuatro frases fantasma. La inspección automatizada no sustituye la validación visual en teléfonos físicos.

La versión 29 añade al archivo completo las fuentes actualizadas, el script de EL ESPEJO y su comprobación automatizada. Código y pruebas publicados en `main` mediante el commit `25edbd10e0455f5f36c0e33d588853b97dd855db`; fuente integral: [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (29).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(29).md). La documentación continúa fuera de la experiencia narrativa.


## 28. Pausas reversibles en EL ESPEJO · versión 30

La pausa de los fragmentos 14, 15, 17, 26 y 30 detiene únicamente el avance. El lector puede retroceder y releer sin liberar la pausa por delante; al regresar al fragmento, debe elegir «seguir». Así, el sistema conserva la detención dramática y permite la relectura sin convertir la pausa en un bloqueo de navegación. No hay temporizador ni nueva puerta.

La prueba de EL ESPEJO se amplió para comprobar este comportamiento, además de las 32 escenas, las cinco pausas y el acceso condicionado a la finalización de las tres piezas. Las ocho comprobaciones automatizadas pasan. Código publicado en `main`, commit `d04e5a6b5ec6290c6e9f9003210d12360ff3847b`; archivo integral de código fuente: [`TRILOGIA_ANA_KLAUDYA_CODIGO_ES (30).md`](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(30).md).


## 29. EL ESPEJO como convergencia invisible y retorno automático · versión 31

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

EL ESPEJO deja de funcionar como puerta o epílogo navegable. Sigue siendo una estancia de 32 fragmentos integrada en CENICIENTO y aparece únicamente al terminar esa lectura cuando ANA KLAUDYA y SOLO LA TARJETA ya están completas. No tiene URL, título de navegación ni botón de salida. Las pausas manuales de los fragmentos 14, 15, 17, 26 y 30 se conservan, con retroceso disponible para releer.

Al alcanzar el final del fragmento 32, se registra la lectura de EL ESPEJO y el retorno desde CENICIENTO. Los botones de salida permanecen ocultos. La pantalla se funde a negro y vuelve automáticamente a ANA KLAUDYA; al completar el cierre aparece allí la frase de retorno «Nadie regresa al mismo lugar». En visitas posteriores, las salidas recíprocas entre ANA KLAUDYA, SOLO LA TARJETA y CENICIENTO siguen disponibles. La única entrada inicial a CENICIENTO continúa siendo el interrogante de ANA KLAUDYA. SOLO LA TARJETA no proporciona acceso a CENICIENTO.

El cambio respeta el criterio rector y no crea una cuarta obra: la convergencia se produce como recompensa estructural de la lectura completa, no como contenido que el visitante busca o desbloquea mediante un control. Las cuatro frases fantasma y los textos canónicos permanecen sin cambios.

**Verificación:** pasan las ocho comprobaciones automatizadas del recorrido y las comprobaciones de sintaxis JavaScript. No se realizó una nueva inspección visual en un teléfono físico; el fundido, la transición del marco y la ubicación exacta de la frase deben confirmarse en el dispositivo durante la siguiente prueba visual.

**Publicación de código:** `main`, commit `1cfbeb24dfa71631171937c495b39642e41564b8`. El archivo integral de código fuente se publica como versión 31 junto con esta actualización documental.


## 30. Desbloqueo de CENICIENTO exclusivamente desde el interrogante · versión 32

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

El acceso a CENICIENTO sólo queda desbloqueado después de completar la pieza tras entrar desde el interrogante de ANA KLAUDYA. Abrir la URL directamente o que el navegador conserve un indicador antiguo de lectura no basta para mostrar botones de CENICIENTO en ANA KLAUDYA o SOLO LA TARJETA. La ruta del interrogante comunica el origen de la entrada al marco de lectura; el desbloqueo se guarda por separado del indicador general de lectura de CENICIENTO.

Tras la primera lectura válida quedan habilitadas las salidas recíprocas entre las tres piezas en las lecturas sucesivas. La convergencia de EL ESPEJO también requiere ese desbloqueo válido, además de haber completado ANA KLAUDYA y SOLO LA TARJETA. Sus 32 fragmentos, las cinco pausas, el fundido final y el retorno automático no cambian.

**Verificación:** pasan las ocho comprobaciones automatizadas, incluidas las nuevas aserciones de procedencia de la ruta y de ausencia del botón previo al desbloqueo. Las referencias del módulo compartido se actualizaron a `20261010-20`.

**Publicación de código:** `main`, commit `a8cb9ec4edc196326d3743a0da31aadfc62254ef`. El código español completo queda archivado en la versión 32.


## 31. Continuidad de la secuencia de envejecimiento fotográfico · versión 33

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

La lectura fotográfica de CENICIENTO conserva sus diez imágenes, pero el avance ya no reparte por igual el recorrido entre todos los fotogramas. La progresión dedica más espacio de lectura a los cambios de edad más visibles y menos a las variaciones leves. En el modo lectura, la opacidad de los dos fotogramas se calcula directamente desde el scroll, sin una transición CSS adicional que se retrase y produzca estelas o saltos. Las imágenes se precargan y decodifican antes de usarse; si la lectura empieza antes de que acabe la carga, al terminar ésta la imagen se sincroniza con la posición actual del texto, sin reiniciarse al primer retrato.

El modo de voz mantiene la sincronización temporal existente. No se han cambiado las fotografías, el texto, la navegación ni EL ESPEJO.

**Verificación:** pasan las ocho pruebas automatizadas. La prueba de CENICIENTO ahora verifica la distribución no uniforme de las edades, la eliminación de las transiciones de opacidad en scroll y la sincronización de imágenes ya decodificadas. La secuencia se inspeccionó visualmente mediante una hoja de contacto de los diez fotogramas; aún conviene comprobar el resultado de desplazamiento en un teléfono físico.

**Publicación de código:** `main`, commit `968609929af08757b540b9750000f922e4ec3dbd`. Archivo integral actualizado: versión 33.


## 32. Recuperación de la secuencia fotográfica estable y salidas directas · versión 34

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

Se restituye la secuencia completa de nueve retratos de Paco que estaba en la revisión estable del 6 de octubre de 2026 (`84c5dc3693a578eecc84f50f0128405a9df9eb2e`), también conservada sin cambios en la revisión del 9 de octubre. Los nueve archivos WebP se publican como activos independientes y se precargan antes de habilitar los modos de lectura y voz. Ambos modos usan el mismo avance lineal y los mismos retratos. Se retiran los puntos desiguales de distribución y las transiciones de opacidad que hacían vibrar la mezcla y dejaban huecos entre imágenes.

En modo lectura, CENICIENTO vuelve a mostrar el texto sobre la fotografía de fondo; el oscurecimiento baja para que el cambio de cabello y edad siga visible detrás del texto. Los nueve fotogramas se sincronizan al scroll y la narración con el mismo cálculo lineal, sin retardo CSS.

Al terminar EL ESPEJO aparecen dos salidas directas: ANA KLAUDYA y una tarjeta a SOLO LA TARJETA. Se elimina el retorno automático. Tras la primera lectura válida de CENICIENTO por el interrogante, los accesos recíprocos entre las tres piezas permanecen disponibles en lecturas posteriores. No aparecen etiquetas visibles de completado o desbloqueo; el estado requerido se mantiene internamente.

El criterio rector continúa siendo:

> **Cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.**

**Verificación:** pasan ocho pruebas automatizadas de navegación, lectura, CENICIENTO, EL ESPEJO, voz y secuencias relacionadas; los nueve archivos se validaron como WebP completos de 768 × 1024 píxeles. La prueba en un móvil físico queda pendiente.

**Publicación de código y fotogramas:** `main`, commit `a55730e47c85e877d6d0889308319c646018e754`. Módulo compartido: `20261010-21`. Archivo integral: versión 34.


## 33. Inicio directo, lista de lecturas y convergencia automática · versión 35

Al pulsar «Leer» o «Voz», CENICIENTO inicia inmediatamente el modo elegido: ya no aparece un segundo botón para comenzar. La voz se solicita dentro de la interacción inicial del lector.

El acceso inicial a CENICIENTO continúa limitado al interrogante de ANA KLAUDYA. Una vez que CENICIENTO ha sido leído o escuchado por completo, quedan disponibles las rutas recíprocas para lecturas posteriores. SOLO LA TARJETA no muestra salida a otra pieza antes de ese momento. La convergencia se activa cuando ANA KLAUDYA, SOLO LA TARJETA y CENICIENTO registran sus primeras lecturas completas; no depende del orden. EL ESPEJO se inicia automáticamente al terminar la tercera pieza y devuelve al visitante al comienzo de ANA KLAUDYA. El regreso queda coordinado con el marco de CENICIENTO cuando éste se abre desde la obra anfitriona.

Se incorpora una lista única, compacta y plegable de las tres lecturas obligatorias. Se muestra después de la primera lectura completada, comunica el estado con etiquetas accesibles y evita cubrir la tarjeta en móviles; en el modo de lectura de CENICIENTO se integra al final del flujo. No expone las rutas ocultas ni convierte los ecos simbólicos en controles.

**Criterio rector:** cada descubrimiento no abre una obra nueva; cambia el significado de una obra ya visitada.

**Verificación:** pasan ocho pruebas automatizadas y la validación sintáctica de los scripts inline principales. No se ha realizado aún una prueba física en móvil. Código y pruebas publicados en `main`, commit `181eda17be95a62ee0ac741dd8c66ea4dfd20c72`.
