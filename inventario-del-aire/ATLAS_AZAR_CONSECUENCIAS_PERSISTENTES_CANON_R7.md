# ATLAS / AZAR
## Arquitectura canónica de consecuencias persistentes · Canon R7

Este documento sustituye como especificación activa de ATLAS / AZAR al canon R6 en todo lo relativo a persistencia, ecos, contaminación, BN-01 y posición arquitectónica del sistema.

## Decisión ontológica

> La máquina no produce resultados.
>
> Produce consecuencias.

> Una consecuencia es una alteración persistente del Archivo.

ATLAS / AZAR no es una etapa del recorrido ni una máquina de premios. Es una irrupción capaz de introducir huellas nuevas en el Archivo Profundo y, por ello, de modificar el futuro de la obra.

El visitante cree que acciona la máquina.

La máquina cree otra cosa.

## Cadena operativa

JUGADA
↓
COORDENADA
↓
RESONANCIA
↓
HUELLA NUEVA
↓
CONSECUENCIA
↓
PERSISTENCIA

La partida desaparece. La huella no.

La unidad básica almacenada no es la jugada, sino la huella creada.

```json
{
  "id": "AZ-271",
  "origen": "ATLAS_AZAR",
  "timestamp": 0,
  "coordenada": [11,18,7],
  "tipo": "INTERFERENCIA",
  "texto": "La relación sobrevivió al hecho.",
  "rareza": "III",
  "persistente": true,
  "ecosPendientes": ["XI","Espejo"],
  "ecos": []
}
```

## Regla definitiva

> Toda jugada produce una huella.
>
> Toda huella puede volver.
>
> Algunas huellas terminan formando parte del Archivo.

Ninguna desaparición es definitiva mientras exista una relación.

## Categorías de consecuencia

### Nivel I · HUELLA · 60 %

Consecuencia menor: nota marginal, registro menor, microtexto u observación.

Ejemplo:

> La ficha había sido corregida nuevamente.

### Nivel II · RESONANCIA PERSISTENTE · 25 %

La resonancia reaparece más tarde, incluso en otra visita o en otro tramo de la obra.

### Nivel III · ALTERACIÓN · 10 %

Modifica un documento existente: añade una nota, elimina una línea, tacha una palabra o inserta un duplicado.

### Nivel IV · EVENTO SINGULAR · 4 %

Puede activar ESPEJO INVERTIDO, RUTA OCULTA o FICHA ANÓMALA.

### Nivel V · IRRUPCIÓN · 1 %

Corresponde a una intervención de BN-01. BN-01 no constituye una nueva huella: altera huellas ya existentes. La jugada ordinaria puede seguir dejando su propia huella, pero la irrupción queda registrada aparte como acontecimiento del Archivo.

## Consecuencias según resultado

### RESONANCIA

Produce microtexto, nota o eco. Afecta principalmente a XIII · EL RESONADOR.

### INTERFERENCIA

Produce contradicciones nuevas. Afecta a XI y XIII.

### ESPEJO

Produce versiones alternativas. Afecta a EL ESPEJO.

### AUSENCIA

Produce eliminación parcial. Algo deja de verse sin que desaparezca necesariamente su rastro.

### CONTRADICCIÓN

Produce dobles versiones. Ambas permanecen activas.

### ORA

Produce persistencia fuerte. Puede reaparecer en cualquier lugar y aumenta la posibilidad de persistencia y reaparición futuras.

## Banco de efectos narrativos

### XI · EL ARCHIVO PROFUNDO

Puede recibir una nota añadida, una huella nueva, una procedencia alterada o una referencia cruzada.

Ejemplo:

> Observación posterior:
>
> La relación seguía activa.

### XII · LA MÁQUINA DE LAS HUELLAS

Puede recibir un registro nuevo, una coordenada añadida, un diagnóstico alterado o una clasificación modificada.

Una referencia como `AZ-184` puede aparecer en un margen sin explicación.

### XIII · EL RESONADOR

Es la zona más sensible. Puede recibir nuevos poemas, interferencias, ecos y duplicados.

Una resonancia pasada puede cambiar sin borrar la anterior.

### EL ESPEJO

Nunca recibe directamente. Todo llega transformado.

El Espejo no corrige una huella: la multiplica.

HUELLA A
↓
ESPEJO
↓
HUELLA A'

A y A' permanecen activas.

## Sistema de ecos diferidos

Una huella puede no producir efecto visible inmediato.

JUGADA
↓
HUELLA
↓
ARCHIVO
↓
REAPARICIÓN

El eco puede aparecer varias jugadas o varias visitas después. El lector no tiene por qué recordar que la originó.

Ejemplo:

> Anotación añadida posteriormente:
>
> La relación seguía activa.

## Contaminación

Las huellas modifican las probabilidades ontológicas del museo.

ORA favorece persistencia, presencia y reaparición.

CONTRADICCIÓN favorece duplicados, errores e interferencias.

INTERFERENCIA puede contaminar jugadas posteriores.

Por tanto, ATLAS / AZAR no sólo añade contenido: cambia las condiciones de posibilidad de lo que el museo puede producir después.

## Máxima Ambigüedad

La coordenada `14·14·14` produce obligatoriamente:

> INTERFERENCIA

Mensaje canónico:

> Tres versiones coinciden.
>
> Ninguna describe la misma cosa.

Consecuencia: las dos jugadas siguientes quedan contaminadas.

## BN-01 · Botón de Nácar

BN-01 no es premio, categoría seleccionable ni huella nueva.

Es un acontecimiento capaz de alterar huellas ya existentes.

Su frecuencia debe mantenerse aproximadamente entre 0,5 % y 1 % de las activaciones, sin aviso previo.

Puede desplazar coordenadas, modificar resonancias, abrir una ruta, insertar una ficha o alterar una lectura previa.

Nunca se anuncia antes. Siempre ocurre después.

Una intervención de BN-01 puede modificar una palabra, una fecha o una observación. Sólo una investigación posterior puede hacer aparecer una referencia probable:

> Referencia probable:
>
> BN-01

## La primera vez que la máquina gana

Una sola vez, después de un número suficiente de activaciones, ATLAS / AZAR puede devolver:

> NO SE HA REGISTRADO
>
> NINGUNA CONSECUENCIA

El visitante interpreta que no ha ocurrido nada.

La huella, sin embargo, queda latente y altera silenciosamente el sistema. En una visita posterior, XI, XII, XIII o EL ESPEJO pueden aparecer cambiados.

Éste es el momento en que se comprende que el visitante no accionaba la máquina para obtener un premio. La máquina estaba seleccionando una huella.

## Persistencia global

El sistema mantiene un ArchivoPersistente consultado por XI, XII, XIII y EL ESPEJO.

Cada huella conserva su identidad, coordenada, tipo, texto, rareza, ecos pendientes, ecos ya manifestados y contaminaciones activas.

Las consecuencias no se eliminan por haberse mostrado. Una consecuencia manifestada puede volver a actuar.

## Posición arquitectónica

ATLAS / AZAR no es una etapa situada entre XII y XIII.

La estructura canónica es:

```text
XI · ARCHIVO PROFUNDO
↓
XII · MÁQUINA DE LAS HUELLAS
↓
XIII · RESONADOR
        ↑
        │
   ATLAS / AZAR
        │
        ↓
      ESPEJO
↓
HABITACIÓN NÚMERO CERO
```

ATLAS / AZAR irrumpe transversalmente en el sistema.

El Museo conserva.

El Archivo Profundo relaciona.

La Máquina de las Huellas organiza.

El Resonador interpreta y produce formas temporales de sentido.

El Espejo transforma y multiplica.

**ATLAS / AZAR es la única entidad del museo capaz de producir nuevas huellas.**

La Habitación Número Cero permanece fuera de estas operaciones: comienza donde ya no queda nada capaz de producir una relación.

## Formulación interna

> ATLAS / AZAR no fue construido para ofrecer resultados.
>
> Fue construido para introducir nuevas huellas en el Archivo Profundo.

Ésa es su función creativa y su peligro: puede modificar el futuro del propio museo.
