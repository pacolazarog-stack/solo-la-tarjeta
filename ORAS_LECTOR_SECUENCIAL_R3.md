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

El navegador calcula las líneas reales una vez maquetado el texto. La temporización se asigna según:

1. renglón visual;
2. posición de la palabra dentro del renglón.

El resultado es una lectura progresiva **renglón a renglón**, siempre de izquierda a derecha.

## Relación con las fotografías

### El Inventario del Aire

La infraestructura R3 está activa y utiliza los activos fotográficos ya publicados. Cada capítulo recibe un fondo determinado. Los capítulos para los que aún no existe un binario fotográfico propio pueden reutilizar temporalmente el encuadre más próximo hasta que se publique el activo definitivo.

### El Oficio de las Sombras

Queda fijada una fotografía específica para cada uno de sus nueve capítulos:

1. Estación — andén y tren.
2. Revisor — comprobación de billetes.
3. Sombras — vagón poblado por persistencias.
4. Hombre de la fila siete — enfrentamiento visual entre viajero y sombra.
5. Conversación — diálogo con la presencia.
6. Inventario de ausencias móviles — escritura durante el trayecto.
7. Taller — espacio ferroviario material.
8. El oficio — observación y registro junto a la ventanilla.
9. Último recorrido — viajero y sombra frente al paisaje final.

Las imágenes correspondientes han sido seleccionadas en la fase de trabajo y sus clases R3 están ya previstas en `oras-reader-r3.js`; la publicación binaria definitiva se realiza separadamente del código textual.

### La Ciudad que Aprendió a Olvidar

Queda fijada una fotografía específica para sus diez capítulos:

1. Plaza — espacio urbano completo / primera ausencia.
2. Archivero — investigación documental.
3. Fuente — comparación entre presente y fotografía.
4. Resistentes — memoria oral y testigos.
5. Mapa imposible — cartografía de desapariciones.
6. Teoría — investigación colectiva.
7. Museo — institucionalización de las ausencias.
8. Visitante — confrontación individual con la prueba.
9. Invierno — archivero en la ciudad erosionada.
10. Última sala — frase y espacio museístico final.

Las clases fotográficas correspondientes están previstas en el lector R3.

## Implementación técnica

Archivos activos:

- `inventario-del-aire/oras-reader-r3.css`
- `inventario-del-aire/oras-reader-r3.js`
- `inventario-del-aire/index.html`

El lector utiliza dos capas fotográficas alternas para que una imagen pueda entrar mientras la anterior se retira. El tipo de transición pertenece a la pantalla, no al texto literario.

La maqueta gráfica R1 permanece como **fallback** cuando un activo fotográfico definitivo todavía no está publicado.

## Accesibilidad

Con `prefers-reduced-motion: reduce`:

- se eliminan barridos, flashes y desplazamientos;
- el texto aparece completo;
- las imágenes cambian sin animación compleja.

## Regla final

> **La fotografía puede entrar desde cualquier dirección. El relato sólo avanza de izquierda a derecha.**

La variedad pertenece a la memoria visual. La continuidad pertenece a la lectura.
