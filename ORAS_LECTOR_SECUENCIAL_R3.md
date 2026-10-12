# ORAS · LECTOR SECUENCIAL FOTOGRÁFICO · R3

## Lo que queda de las horas

Especificación de la lectura audiovisual por pantallas de **LA EXPANSIÓN**.

Este documento no modifica el texto literario R4. Regula exclusivamente la relación entre **parte textual, fotografía, transición y ritmo de aparición**.

## Principio de composición

Cada parte del texto debe ocupar su propia unidad visual y disponer de un fondo correspondiente a su contenido.

La experiencia deja de funcionar como una página continua sobre un único fondo y pasa a organizarse como una sucesión de **pantallas narrativas**.

> **una parte → una fotografía → una transición → una lectura**

## Ley del display

El texto siempre se narra en el sentido natural de lectura:

> **izquierda → derecha**

Su aparición reproduce el comportamiento de un monitor o display: las palabras se descubren de izquierda a derecha y los renglones se suceden de arriba abajo.

La transición global de la pantalla puede proceder desde cualquier dirección, pero **nunca altera la dirección interna de lectura**.

## Transiciones admitidas

Entre fotografías y partes textuales se alternan, de manera pseudoaleatoria y sin repetir inmediatamente la anterior:

- arriba → abajo;
- izquierda → derecha;
- fundido;
- abajo → arriba;
- derecha → izquierda;
- flash.

La selección queda fijada durante cada sesión de lectura para evitar que una pantalla cambie de transición al volver sobre ella.

La variación debe impedir la monotonía sin convertirse en espectáculo. Las transiciones sirven a la sensación de memoria discontinua y no a la exhibición técnica.

## Comportamiento del texto

Cada pantalla contiene un bloque `.panel-copy` y cada palabra se convierte en una unidad de revelado `.display-word`.

El navegador calcula los renglones reales una vez maquetado el texto. La temporización se asigna primero por línea visual y después por la posición de la palabra dentro de esa línea. El resultado es una lectura progresiva **renglón a renglón**, siempre de izquierda a derecha.

## Relación con las fotografías

### El Inventario del Aire

La infraestructura R3 está activa y utiliza los activos fotográficos R2 ya publicados. Cada capítulo recibe un fondo determinado; donde todavía se reutiliza un encuadre próximo, la reutilización es deliberada y no altera el texto.

### El Oficio de las Sombras

Las **nueve fotografías seleccionadas están ya publicadas y activas** en el lector R3. Se conservan en una tira AVIF compacta y se asignan por capítulo en este orden narrativo: Estación; Revisor; Sombras; Hombre de la fila siete; Conversación; Inventario de ausencias móviles; Taller; El oficio; Último recorrido.

El encuadre correspondiente se extrae en tiempo de lectura sin deformar la fotografía y se centra como fondo de su pantalla. La escenografía ferroviaria R1 queda únicamente como respaldo si el activo fotográfico no pudiera cargarse.

### La Ciudad que Aprendió a Olvidar

Las **diez fotografías seleccionadas están ya publicadas y activas** en el lector R3. Se conservan en una tira AVIF compacta y se asignan por capítulo en este orden narrativo: Plaza; Archivero; Fuente; Resistentes; Mapa imposible; Teoría; Museo; Visitante; Invierno; Última sala.

La progresión fotográfica conserva la realidad material de la ciudad mientras los capítulos desplazan la atención desde la plaza y el archivo hacia la prueba, el museo, la erosión y la última sala.

### La Habitación Número Cero

No se fuerza al régimen fotográfico secuencial. Al entrar en EL CERO, la capa R3 se retira para conservar la lógica de sustracción ya fijada: el mundo visual debe desaparecer, no recibir una nueva serie de imágenes.

## Implementación técnica

Archivos activos principales:

- `inventario-del-aire/oras-reader-r3.css`
- `inventario-del-aire/oras-reader-r3.js`
- `inventario-del-aire/index.html`
- `inventario-del-aire/photo-r3/train-r3-part-1.js` a `train-r3-part-4.js`
- `inventario-del-aire/photo-r3/city-r3-part-1.js` a `city-r3-part-7.js`

Las fotografías de *Sombras* y *Ciudad* se cargan como datos AVIF compactos divididos en fragmentos de transporte. El lector reconstruye cada tira antes de iniciar la composición y selecciona el fotograma correspondiente a cada capítulo. La doble capa fotográfica permite que una imagen entre mientras la anterior se retira.

La maqueta gráfica R1 permanece como **fallback real**: sólo se atenúa cuando una fotografía concreta está disponible.

## Accesibilidad

Con `prefers-reduced-motion: reduce`, se eliminan barridos, flashes y desplazamientos; el texto aparece completo y las imágenes cambian sin animación compleja.

## Regla final

> **La fotografía puede entrar desde cualquier dirección. El relato sólo avanza de izquierda a derecha.**

La variedad pertenece a la memoria visual. La continuidad pertenece a la lectura.
