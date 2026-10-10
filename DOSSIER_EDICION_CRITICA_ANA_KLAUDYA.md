# DOSSIER / EDICIÓN CRÍTICA

## *ANA KLAUDYA · SOLO LA TARJETA · CENICIENTO*

**Idioma:** español  
**Autoría publicada:** flag  
**Edición canónica de *ANA KLAUDYA*:** cerrada el 9 de octubre de 2026  
**Código fuente archivístico vigente en este dossier:** versión 15, publicada en `main` como commit `79d073790dfdcf2bcbd2819cc2aa70bff06f9b0b`
**Módulo compartido:** `narrative-universe.js`, versión `20261010-9`  
**Estado de este dossier:** documento crítico y de conservación; no forma parte de la interfaz de lectura.

> Este documento reúne información contextual, bibliográfica y técnica para prensa, investigación, programación de festivales y preservación. No debe incorporarse a las páginas de las obras ni presentarse como parte de su recorrido narrativo.

## 1. Identificación del conjunto

El conjunto comprende tres obras digitales en español: *ANA KLAUDYA*, *SOLO LA TARJETA* y *CENICIENTO*. Cada pieza puede recorrerse como una obra autónoma. En conjunto admiten una lectura retrospectiva: al descubrir otras piezas, ciertos elementos de las anteriores adquieren nuevos sentidos.

La arquitectura de navegación de la edición descrita aquí contiene tres puertas entre obras:

| Señal en la obra | Destino |
| --- | --- |
| tarjeta | *SOLO LA TARJETA* |
| ? | *CENICIENTO* |
| volver | *ANA KLAUDYA* |

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

> flag. *Trilogía ANA KLAUDYA: código fuente español completo*. Versión archivística 15, revisión móvil basada en la versión 14. Repositorio `pacolazarog-stack/solo-la-tarjeta`, commit de código `79d073790dfdcf2bcbd2819cc2aa70bff06f9b0b`; módulo compartido `20261010-9`. Archivo Markdown de conservación, fuera de la interfaz de lectura.

Para citas académicas, conviene especificar la pieza, el modo de acceso (lectura o escucha), la URL y la fecha de consulta. Si se cita un verso, añadir el nombre de la pieza y el identificador o encabezado de sección disponible en la edición consultada. No asignar números de verso que la obra no muestre.

## 7. Referencias documentales

- Repositorio fuente: [github.com/pacolazarog-stack/solo-la-tarjeta](https://github.com/pacolazarog-stack/solo-la-tarjeta)
- README de la edición fuente: rutas de acceso a las tres obras y nota de cierre canónico de *ANA KLAUDYA*.
- `ana-klaudya/TEXTO_CANONICO_ES.md`: texto español canónico de *ANA KLAUDYA*.
- `ceniciento/texto.md`: texto de lectura de *CENICIENTO*.
- `ceniciento/index.html`: interfaz de lectura/escucha y 59 señales de voz de *CENICIENTO*.
- `ceniciento/narracion.txt`: material de narración asociado a *CENICIENTO*.
- Archivo complementario vigente: [TRILOGIA_ANA_KLAUDYA_CODIGO_ES (14).md](TRILOGIA_ANA_KLAUDYA_CODIGO_ES%20(14).md).

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
