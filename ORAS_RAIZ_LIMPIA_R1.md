# ORAS · RECONSTRUCCIÓN DE RAÍZ · R1

## Decisión

ORAS se rehace desde una arquitectura única y continua. No se trasladan los parches actuales como capas sucesivas: sus comportamientos válidos se incorporan a la raíz del sistema.

La versión publicada actual queda intacta mientras se construye la nueva raíz en la rama `oras-raiz-limpia`.

## Principios de arquitectura

1. **Una sola raíz narrativa.** `index.html` es la puerta de ORAS y no una obra aislada.
2. **Un solo estado.** Toda la lectura, desbloqueos, reinicio, cruce de El Espejo y huella residual viven en un único modelo de estado versionado.
3. **Un solo índice canónico.** El índice general de ORAS es modal, contextual y universal; no existen índices paralelos de ANA KLAUDYA u otras piezas.
4. **Una sola navegación.** Anterior, siguiente, continuar, índice y reiniciar son funciones del núcleo, no scripts correctores por página.
5. **Un solo sistema visual.** Tipografía, fondos, botones, transiciones, audio y responsive se definen en la raíz y cada obra declara solo sus variaciones narrativas.
6. **Un solo sistema de audio.** Música, voz, volumen, silencios y fundidos comparten controlador central.
7. **Contenido separado de comportamiento.** Los textos canónicos se mantienen como contenido; el motor decide cómo aparecen, avanzan y se recuerdan.
8. **Sin workflows de parcheo.** GitHub Actions publica y valida; no reescribe HTML/JS/CSS en cada push.
9. **Mobile-first real.** La misma arquitectura sirve escritorio y móvil sin scripts específicos que se contradigan.
10. **Reinicio verdadero.** Reiniciar abre un ciclo nuevo: 0/43, ninguna hoja visitada, El Espejo no cruzado, Expansión y Cero bloqueados. La huella conceptual de una realidad deformada puede conservarse aparte sin contar como lectura ni desbloqueo.

## Estructura narrativa canónica

### I · LA VIDA

1. SOLO LA TARJETA
2. ANA KLAUDYA
   - Prólogo · Siguiendo una tarjeta
   - Elegía breve para Ana Klaudya
   - En tus ojos
   - En tus labios
   - Tu cabello
   - Tu piel
   - Interludio · Iba a llevarte flores
   - Epílogo · A fuego lento
3. CENICIENTO

CENICIENTO no tendrá acceso directo desde el índice: se alcanza únicamente mediante el interrogante.

### II · EL UMBRAL

- EL ESPEJO · 32 fragmentos

El Espejo no introduce otro universo: deforma de forma irreversible el ya conocido. El desbloqueo de la Expansión se produce únicamente al cruzarlo de verdad.

### III · LA EXPANSIÓN

4. EL INVENTARIO DEL AIRE · 8 hojas
5. EL OFICIO DE LAS SOMBRAS · 9 hojas
6. LA CIUDAD QUE APRENDIÓ A OLVIDAR · 14 hojas

### IV · EL CERO

- EPÍLOGO · LA HABITACIÓN NÚMERO CERO

Total canónico: **43 hojas de lectura**.

## Núcleo técnico previsto

La nueva raíz se organizará alrededor de estos componentes estables:

- `index.html` — contenedor único de la experiencia.
- `oras.css` — sistema visual completo y responsive.
- `oras.js` — arranque, enrutado y coordinación.
- `core/state.js` — estado único de lectura.
- `core/router.js` — rutas y continuidad.
- `core/index-modal.js` — índice canónico modal.
- `core/audio.js` — música, voz y volumen.
- `core/transitions.js` — fundidos, apariciones y cambios de obra.
- `core/progress.js` — 0/43, visitados y desbloqueos.
- `content/` — textos y metadatos narrativos.
- `assets/` — imágenes, audio y recursos visuales.

Los nombres exactos podrán simplificarse durante la implementación, pero la separación de responsabilidades queda fijada.

## Estado único

El nuevo estado sustituirá la coexistencia de `oras.universe.v2`, `oras.reading.index.v1` y marcas auxiliares dispersas. Tendrá una sola clave persistente y una estructura explícita, por ejemplo:

```js
{
  version: 1,
  cycleId: 1,
  visited: {},
  mirror: {
    available: false,
    completed: false,
    crossed: false
  },
  realityDeformed: false,
  audio: {
    musicEnabled: true,
    voiceEnabled: true,
    volume: 0.8
  }
}
```

`visited` será la única fuente de verdad para el contador 0/43.

## Reglas que pasan a ser raíz y dejan de ser parches

- ANA KLAUDYA siempre tiene una entrada visible y funcional; nunca puede quedar una pantalla blanca.
- El índice general abre como ventana modal sobre la posición narrativa actual.
- El cierre del índice devuelve exactamente al punto anterior.
- CENICIENTO se descubre por el interrogante y no por una tarjeta directa.
- El Espejo solo se activa al cumplir la secuencia de Vida.
- La Expansión y El Cero rechazan rutas directas antes del cruce.
- Tras el cruce existe una deformación visual residual coherente.
- Volver conserva el estado; reiniciar borra todas las visitas del ciclo.
- La barra/contador empieza desde la primera lectura real y nunca hereda lecturas de un ciclo anterior.
- Los controles de audio no se duplican.
- Los controles de navegación mantienen posición, jerarquía y comportamiento comunes.

## Migración

La reconstrucción se hará por capas completas, no por arreglos locales:

1. congelar y conservar los textos y activos canónicos;
2. crear el núcleo de estado, router, índice y navegación;
3. reconstruir SOLO LA TARJETA y ANA KLAUDYA sobre el núcleo;
4. integrar CENICIENTO y EL ESPEJO;
5. integrar la segunda trilogía y HABITACIÓN NÚMERO CERO;
6. integrar audio, transiciones y deformación visual;
7. validar escritorio y móvil;
8. sustituir `main` solo cuando el recorrido completo funcione sin scripts de corrección.

## Regla de publicación

Hasta completar la reconstrucción, `main` continúa siendo la versión pública. La rama `oras-raiz-limpia` es el nuevo máster de construcción. No se parcheará la publicación antigua salvo una avería que impida completamente el acceso al contenido.
