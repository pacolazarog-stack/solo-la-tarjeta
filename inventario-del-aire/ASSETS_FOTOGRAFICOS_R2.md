# ORAS · MANIFIESTO DE ACTIVOS FOTOGRÁFICOS R2

Este archivo define los activos necesarios para sustituir la implementación gráfica provisional de `inventario-del-aire/` por la puesta en escena fotográfica canónica R2.

No deben reutilizarse fotografías de ANA KLAUDYA ni de CENICIENTO para simular estos espacios. La continuidad entre bloques debe proceder de la **calidad material**, no de compartir imágenes.

## Convenciones

Directorio previsto:

`inventario-del-aire/assets-r2/`

Formato preferente para fotografía estática: `webp` de alta calidad, con JPG como alternativa si la textura fotográfica lo exige.

Cada pantalla debe disponer, cuando sea necesario, de dos o más estados del mismo encuadre para permitir erosión o cambio retrospectivo sin morphing evidente.

## Inventario

| Pantalla | Archivo principal previsto | Función |
| --- | --- | --- |
| I.1 | `i1-llegada.webp` | Casa real, exterior vivido |
| I.2 | `i2-recibidor.webp` | Interior con profundidad |
| I.3 | `i3-reloj.webp` | Primer plano de reloj detenido |
| I.4 | `i4-silla.webp` | Mesa y silla desplazada |
| I.5 | `i5-pasillo.webp` | Pasillo real y profundo |
| I.6 | `i6-jardin.webp` | Vegetación real y persistente |

Activos auxiliares posibles: `i1-nubes.webm`, `i1-hojas.webm`, capas de polvo y máscaras de luz. Si se resuelven proceduralmente, deben mantener apariencia naturalista.

## Sombras

| Pantalla | Archivo / clip previsto | Función |
| --- | --- | --- |
| S.1 | `s1-anden.webm` | Andén auténtico con tren entrando |
| S.2 | `s2-vagon.webp` / `s2-vibracion.webm` | Interior vivido |
| S.3 | `s3-ventanilla.webm` | Paisaje lateral real |
| S.4 | `s4-reflejo.webp` | Reflejo ambiguo, nunca fantasma gráfico |
| S.5 | `s5-tunel.webm` | Oscuridad física y destellos |
| S.6 | `s6-ultimo-recorrido.webm` | Paisaje crepuscular y despedida |

## Ciudad

| Pantalla | Activos previstos | Función |
| --- | --- | --- |
| C.1 | `c1-plaza-con-banco.webp` | Plaza completa |
| C.2 | `c2-plaza-sin-banco.webp` | Mismo encuadre, primera fractura |
| C.3 | `c3-archivo.webp` | Documentación material |
| C.4 | `c4-foto-a.webp`, `c4-foto-b.webp`, `c4-foto-c.webp` | Prueba que se descompone |
| C.5 | `c5-museo.webp` | Espacio institucional real |
| C.6 | `c6-ultima-sala.webp` | Frase bajo cristal |

La plaza C.1/C.2 debe conservar, en lo posible, exactamente encuadre, focal, luz y densidad humana. La desaparición del banco no debe parecer un truco gráfico.

## Habitación Número Cero

| Pantalla | Activos previstos | Función |
| --- | --- | --- |
| H.1 | `h1-umbral.webp` | Último museo reconocible |
| H.2 | `h2-caja.webp` | Caja, carpeta y mesa físicas |
| H.3 | `h3-habitacion.webp` | Habitación blanca real con textura |
| H.4 | `h4-habitacion-erodida.webp` | Menor contraste, profundidad y materia |
| H.5 | `h5-boton-nacar.webp` | Macro de nácar, hilo y arañazos |
| H.6 | sin fotografía obligatoria | Ficha / relato |
| H.7 | `h7-luz-final.webp` o tratamiento de H.4 | Luz residual tras la desaparición |

## Criterios de rechazo

Se rechaza cualquier activo que:

- parezca fotografía de catálogo inmobiliario;
- resulte demasiado bello o deliberadamente «poético»;
- convierta una ausencia en iconografía obvia;
- use fantasmas o siluetas literales para las sombras;
- presente la Habitación Cero como un blanco digital sin materia;
- monumentalice el botón;
- no permita continuidad de luz, escala o perspectiva entre estados sucesivos.

## Regla final

> **La imagen debe parecer encontrada en el mundo antes de parecer diseñada para ORAS.**

Hasta que estos activos estén disponibles, la implementación CSS actual funciona únicamente como **maqueta funcional R1**, no como acabado visual definitivo.