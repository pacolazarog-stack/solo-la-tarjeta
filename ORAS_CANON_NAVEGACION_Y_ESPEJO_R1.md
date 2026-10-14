# ORAS · CANON DE NAVEGACIÓN Y DEL ESPEJO · R1

## 1. Índice canónico único

El índice general de **ORAS · Lo que queda de las horas** es el único índice canónico de toda la obra.

Sustituye cualquier índice parcial o autónomo anterior, incluido el índice propio de **ANA KLAUDYA**. Desde las piezas de la obra, cualquier acceso denominado «Índice» debe conducir al índice general de ORAS.

El índice no es sólo un menú: representa el estado narrativo real de la lectura. **No anticipa el contenido todavía no descubierto.** Sus elementos aparecen conforme el lector abre las sucesivas puertas de la obra.

---

## 2. Arquitectura de acceso y revelación progresiva

### Estado inicial

Al comenzar un ciclo nuevo, el índice muestra **únicamente SOLO LA TARJETA**. Ningún otro título, sección o tarjeta debe ser visible ni accesible.

### I · LA VIDA

1. **SOLO LA TARJETA**
2. **ANA KLAUDYA**
3. **CENICIENTO**

Cuando **SOLO LA TARJETA** queda completada, se revela **ANA KLAUDYA** y, dentro de su tarjeta, quedan disponibles sus ocho partes:

- Prólogo · Siguiendo una tarjeta
- Elegía breve para Ana Klaudya
- En tus ojos
- En tus labios
- Tu cabello
- Tu piel
- Interludio · Iba a llevarte flores
- Epílogo · A fuego lento · Flores

En ese mismo estadio puede figurar **CENICIENTO** en el índice, pero **sin acceso directo**. CENICIENTO constituye la excepción absoluta del sistema: no puede abrirse desde su tarjeta, desde «Continuar» ni mediante ningún atajo de navegación. Su única puerta narrativa es el **interrogante** que aparece dentro del recorrido de ANA KLAUDYA.

### II · EL UMBRAL

**EL ESPEJO**

EL ESPEJO no se anticipa en el índice. Sólo aparece cuando LA VIDA ha cumplido sus condiciones narrativas y la puerta del umbral ha sido alcanzada.

### III · LA EXPANSIÓN

4. **EL INVENTARIO DEL AIRE**
5. **EL OFICIO DE LAS SOMBRAS**
6. **LA CIUDAD QUE APRENDIÓ A OLVIDAR · I–IX**

LA EXPANSIÓN sólo se revela después de haber atravesado efectivamente EL ESPEJO. Dentro de ella, el índice mantiene la misma lógica de descubrimiento: primero EL INVENTARIO DEL AIRE; completado éste, EL OFICIO DE LAS SOMBRAS; completado éste, LA CIUDAD QUE APRENDIÓ A OLVIDAR hasta **IX · Invierno**.

### IV · EL ARCHIVERO

- **X · EL ARCHIVO PROFUNDO**
- **XI · LA MÁQUINA DE LAS HUELLAS**
- **XII · EL RESONADOR**
- **XIII · LA ÚLTIMA SALA**

Esta sección conserva al lector dentro de la historia del archivero. **LA ÚLTIMA SALA** culmina el arco humano del archivero.

### V · EL CERO

**ATLAS / AZAR** aparece como pieza autónoma, sin número, y se presenta como **INTERLUDIO DOCUMENTAL**:

> Documento recuperado del Archivo Profundo.

Después aparece **LA HABITACIÓN NÚMERO CERO**, última pieza absoluta de ORAS. Nada puede situarse detrás de ella.

---

## 3. Regla absoluta del umbral

**Nada de EL INVENTARIO DEL AIRE, EL OFICIO DE LAS SOMBRAS, LA CIUDAD QUE APRENDIÓ A OLVIDAR ni LA HABITACIÓN NÚMERO CERO puede mostrarse ni visitarse antes de haber atravesado EL ESPEJO.**

No basta con que EL ESPEJO esté descubierto o iniciado. Debe existir un estado persistente e inequívoco de tránsito consumado:

`mirrorCrossed === true`

Mientras ese estado no exista:

- LA EXPANSIÓN y EL CERO no aparecen en el índice;
- «Continuar» no puede saltar a ninguna de esas zonas;
- un acceso directo por URL a la segunda trilogía o a LA HABITACIÓN NÚMERO CERO debe devolver al índice canónico.

Una vez atravesado EL ESPEJO, se revela EL INVENTARIO DEL AIRE y comienza la liberación progresiva de la segunda mitad de ORAS.

---

## 4. Estados canónicos

La navegación debe distinguir como mínimo:

- `anaComplete`
- `soloComplete`
- `cenicientoComplete`
- `mirrorReadComplete`
- `mirrorCrossed`
- `realityDeformed`

`mirrorReadComplete` registra la lectura del Espejo.

`mirrorCrossed` registra que el lector ha pulsado el tránsito final y ha pasado efectivamente a la segunda trilogía.

`realityDeformed` registra la consecuencia estética y narrativa permanente del cruce.

La regla de desbloqueo de LA EXPANSIÓN es:

`expansionUnlocked = mirrorCrossed === true`

La visibilidad del índice es siempre consecuencia del estado narrativo alcanzado, nunca una previsualización de etapas futuras.

---

## 5. Naturaleza canónica de EL ESPEJO

EL ESPEJO no es un capítulo intermedio convencional. Es una **operación sobre la realidad de la obra**.

Debe actuar como espejo deformante, esperpéntico: no muestra otro mundo independiente, sino el mundo anterior sometido a una alteración que ya no puede deshacerse por completo.

Su formulación canónica es:

> El Espejo no introduce un mundo ajeno, sino la deformación irreversible del mundo ya conocido.
>
> Después de atravesarlo, el lector permanece en ORAS, pero ya no en el mismo ORAS.

Y su ley de tránsito:

> Aunque uno vuelva al mismo lugar, nunca será lo mismo.

---

## 6. Diseño visual de EL ESPEJO

Se conserva el fondo negro y la austeridad actual. La deformación debe introducirse sin convertir la pantalla en un efecto ornamental.

El tránsito debe visualizarse mediante una combinación sutil y progresiva de:

- desplazamiento lateral mínimo del campo tipográfico;
- ligera compresión y expansión horizontal;
- sesgo o curvatura perceptiva muy pequeña;
- duplicación o sombra reflejada casi imperceptible;
- una línea o plano de reflexión que no coincida exactamente con el centro;
- máxima deformación en la zona media del recorrido;
- aparente recuperación al final, pero nunca restitución completa.

La legibilidad del texto tiene prioridad. El efecto debe percibirse más que exhibirse.

---

## 7. Consecuencia visual del cruce

La segunda trilogía debe conservar una huella mínima del tránsito. No se trata de mantener una distorsión intensa, sino de hacer visible que la realidad ya ha sido alterada.

Puede expresarse con una señal residual común a LA EXPANSIÓN y EL CERO: una leve discontinuidad vertical, una refracción casi invisible o una mínima asimetría de luz.

El lector debe reconocer el espacio, pero sentir que algo ya no coincide del todo con lo anterior.

---

## 8. Regla de los botones

Cada botón visible del índice debe conducir exactamente a la pantalla, pieza o fragmento que nombra.

Única excepción: **CENICIENTO**, cuya tarjeta carece siempre de acceso directo. Su presencia en el índice sólo registra que forma parte de LA VIDA; su entrada efectiva se produce exclusivamente mediante el interrogante de ANA KLAUDYA.

EL ESPEJO sólo aparece y puede abrirse cuando las rutas de LA VIDA hayan habilitado su tránsito.

LA EXPANSIÓN sólo aparece después de `mirrorCrossed === true`, y sus obras se revelan de manera sucesiva conforme se completa la anterior.

---

## 9. Canon de retorno

El regreso al índice después del cruce no deshace el cruce.

El índice continúa siendo el mismo lugar funcional, pero conserva todo lo que ya ha sido descubierto en el ciclo actual y sólo añade las puertas nuevas que el recorrido vaya habilitando.

La navegación debe encarnar así la ley narrativa central del umbral:

**volver no equivale a regresar al estado anterior.**

---

## 10. Canon de reinicio

**Reiniciar ORAS abre un ciclo de lectura completamente nuevo.**

En el instante del reinicio, el índice canónico debe mostrar **0/43 huellas leídas** y, visualmente, **sólo SOLO LA TARJETA**. Ninguna pieza, fragmento o territorio posterior puede conservar la condición de visible, visitado o desbloqueado del ciclo anterior.

El reinicio borra, a efectos de navegación y recuento:

- SOLO LA TARJETA;
- las ocho partes de ANA KLAUDYA;
- CENICIENTO;
- EL ESPEJO como leído y como atravesado;
- las ocho huellas de EL INVENTARIO DEL AIRE;
- las nueve huellas de EL OFICIO DE LAS SOMBRAS;
- las catorce huellas de LA CIUDAD QUE APRENDIÓ A OLVIDAR;
- LA HABITACIÓN NÚMERO CERO.

Por tanto, tras reiniciar:

`mirrorReadComplete === false`

`mirrorCrossed === false`

`oras.reading.index.v1.done = {}`

ANA KLAUDYA vuelve a permanecer oculta hasta completar SOLO LA TARJETA; CENICIENTO vuelve a ser sólo accesible mediante el interrogante; EL ESPEJO y toda LA EXPANSIÓN desaparecen del índice hasta que el nuevo ciclo vuelva a alcanzarlos.

La huella conceptual `realityDeformed` puede conservarse como cicatriz narrativa de un cruce anterior, porque expresa que volver al mismo lugar nunca restaura exactamente la realidad. **Esa cicatriz no cuenta como lectura, no suma ninguna de las 43 huellas, no hace visible contenido futuro y no desbloquea ninguna ruta.**


---

## 11. Canon definitivo del arco emocional

El orden definitivo del tramo final es:

**LA CIUDAD QUE APRENDIÓ A OLVIDAR I–IX → EL ARCHIVERO X–XIII → ATLAS / AZAR → LA HABITACIÓN NÚMERO CERO.**

La secuencia emocional profunda de ORAS es:

**persona → amor → presencia → tiempo → ausencia → memoria → ciudad → archivero → muerte → documentos supervivientes → cero.**

Las teorías sostienen la emoción; no la sustituyen.

ATLAS / AZAR no forma parte de la numeración X–XIII. Es un documento superviviente y debe distinguirse gráficamente como tal.

LA HABITACIÓN NÚMERO CERO permanece intacta y cierra toda la obra. No existe XIV, coda ni explicación posterior.

La última frase absoluta de ORAS es:

> **Nadie supo decir desde cuándo.**
