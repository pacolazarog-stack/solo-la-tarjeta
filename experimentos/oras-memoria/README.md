# ORAS · protocolo mínimo de validación

Este experimento separa la **persistencia interpretativa distribuida** del contenido de la trilogía. No usa Ana, Rebeca, Paco ni EL ESPEJO como escena. La hipótesis es formal:

> Una obra digital puede modificar de forma sistemática la interpretación de una relectura mediante memoria persistente distribuida, sin alterar el texto verbal.

## Hipótesis falsable

La innovación queda debilitada si las diferencias interpretativas entre relecturas pueden explicarse únicamente por el hecho de releer. Para aislarla se comparan tres condiciones:

- **A · lectura única**: una sola exposición.
- **B · relectura control**: segunda exposición idéntica, sin memoria distribuida.
- **C · relectura ORAS**: segunda exposición con el mismo texto, pero con modulación temporal, térmica y una ausencia mínima.

La comparación decisiva es **B vs C**.

## Variables

El texto permanece idéntico. La condición C solo puede modificar:

- tiempo de aparición;
- temperatura visual;
- profundidad de silencio/ritmo;
- presencia o ausencia de un elemento no verbal.

No se permite:

- texto nuevo;
- explicación de los cambios;
- mensajes de desbloqueo;
- estadísticas visibles;
- nuevas rutas narrativas.

## Criterios de falsación

1. **Independencia del contenido**: el fenómeno debe sobrevivir a la sustitución completa del relato.
2. **Control de mera relectura**: C debe diferenciarse de B, no solo de A.
3. **Sin texto nuevo**: si el efecto necesita información verbal adicional, la hipótesis falla.
4. **Detectabilidad indirecta**: el lector puede no identificar el mecanismo, pero debe poder describir una diferencia de clima o significado.
5. **Persistencia distribuida**: el efecto debe seguir funcionando sin una sala o destino llamado EL ESPEJO.
6. **Transferibilidad**: otro autor debe poder reproducir el método con otro texto y otra estética.

## Preguntas postlectura

Primero, sin revelar la hipótesis:

1. ¿Qué elemento de la escena te pareció más importante?
2. ¿Qué relación percibiste entre el espacio y la persona que lo habita?
3. ¿La segunda lectura te pareció más próxima, más distante o igual? ¿Por qué?
4. ¿Hubo algo que pareciera faltar o pesar más?
5. Resume en una frase qué significa ahora la escena.

Después, como control perceptivo:

6. ¿Notaste algún cambio de interfaz, ritmo, color, sonido o composición?
7. Si sí, ¿cuál?

## Señal de éxito

La evidencia más fuerte no es que los lectores descubran la manipulación técnica, sino que el grupo C produzca interpretaciones consistentemente distintas del grupo B mientras el texto verbal permanece idéntico.

## Implementación de referencia

`index.html` contiene una maqueta autocontenida. La condición se selecciona con `?grupo=A`, `?grupo=B` o `?grupo=C`.

- A no ofrece relectura experimental.
- B conserva exactamente la puesta en escena.
- C conserva el texto pero modifica discretamente delay, temperatura y una presencia visual en la segunda exposición.

El estado se guarda en `localStorage` bajo una clave separada del universo ORAS de producción para no contaminar el progreso real.
