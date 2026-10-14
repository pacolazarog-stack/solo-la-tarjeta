# ORAS · CANON DE NAVEGACIÓN Y DEL ESPEJO · R1

## 1. Índice canónico único

El índice general de **ORAS · Lo que queda de las horas** es el único índice canónico de toda la obra.

Sustituye cualquier índice parcial o autónomo anterior, incluido el índice propio de **ANA KLAUDYA**. Desde las piezas de la obra, cualquier acceso denominado «Índice» debe conducir al índice general de ORAS.

El índice no es sólo un menú: representa el estado narrativo real de la lectura y debe respetar los bloqueos estructurales de la obra.

---

## 2. Arquitectura de acceso

### I · LA VIDA

1. **SOLO LA TARJETA**
2. **ANA KLAUDYA**
3. **CENICIENTO**

**CENICIENTO constituye la única excepción a los accesos directos del índice.** No puede abrirse desde su tarjeta, desde «Continuar» ni mediante ningún atajo de navegación. Su única puerta narrativa es el **interrogante** que aparece dentro del recorrido de ANA KLAUDYA.

### II · EL UMBRAL

**EL ESPEJO**

El acceso al Espejo no es libre. Lo habilitan las rutas narrativas del recorrido de ANA KLAUDYA una vez cumplidas las condiciones de LA VIDA. El índice puede mostrarlo, pero sólo debe permitir atravesarlo cuando esa puerta haya sido alcanzada narrativamente.

### III · LA EXPANSIÓN

4. **EL INVENTARIO DEL AIRE**
5. **EL OFICIO DE LAS SOMBRAS**
6. **LA CIUDAD QUE APRENDIÓ A OLVIDAR**

### IV · EL CERO

**LA HABITACIÓN NÚMERO CERO**

---

## 3. Regla absoluta del umbral

**Nada de EL INVENTARIO DEL AIRE, EL OFICIO DE LAS SOMBRAS, LA CIUDAD QUE APRENDIÓ A OLVIDAR ni LA HABITACIÓN NÚMERO CERO puede visitarse antes de haber atravesado EL ESPEJO.**

No basta con que EL ESPEJO esté visible, descubierto o iniciado. Debe existir un estado persistente e inequívoco de tránsito consumado:

`mirrorCrossed === true`

Mientras ese estado no exista:

- las tarjetas de LA EXPANSIÓN y EL CERO permanecen visibles pero bloqueadas en el índice;
- sus subbotones no son operativos;
- «Continuar» no puede saltar a ninguna de esas zonas;
- un acceso directo por URL a la segunda trilogía o a LA HABITACIÓN NÚMERO CERO debe devolver al índice canónico.

Una vez atravesado EL ESPEJO, la expansión queda desbloqueada.

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

La regla de desbloqueo es:

`expansionUnlocked = mirrorCrossed === true`

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

Cada botón del índice debe conducir exactamente a la pantalla, pieza o fragmento que nombra.

Única excepción: **CENICIENTO**, cuya tarjeta carece de acceso directo y remite narrativamente al interrogante de ANA KLAUDYA.

EL ESPEJO sólo puede abrirse cuando las rutas de ANA KLAUDYA hayan habilitado su tránsito.

LA EXPANSIÓN y EL CERO sólo pueden abrirse después de `mirrorCrossed === true`.

---

## 9. Canon de retorno

El regreso al índice después del cruce no deshace el cruce.

El índice continúa siendo el mismo lugar funcional, pero su estado ha cambiado: la segunda trilogía queda abierta y EL ESPEJO figura como atravesado.

La navegación debe encarnar así la ley narrativa central del umbral:

**volver no equivale a regresar al estado anterior.**

---

## 10. Canon de reinicio

**Reiniciar ORAS abre un ciclo de lectura completamente nuevo.**

En el instante del reinicio, el índice canónico debe mostrar **0/43 huellas leídas**. Ninguna pieza, fragmento o territorio puede conservar la condición de visitado del ciclo anterior.

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

LA EXPANSIÓN y EL CERO vuelven a quedar bloqueados hasta atravesar de nuevo EL ESPEJO, y CENICIENTO vuelve a carecer de acceso directo: sólo puede alcanzarse otra vez mediante el interrogante.

La huella conceptual `realityDeformed` puede conservarse como cicatriz narrativa de un cruce anterior, porque expresa que volver al mismo lugar nunca restaura exactamente la realidad. **Esa cicatriz no cuenta como lectura, no suma ninguna de las 43 huellas y no desbloquea ninguna ruta.**
