# Release V1.0.0

Estado: cerrado y verificado el 2026-08-28.

## Alcance

V1 es la línea estable de AWS Prep dedicada exclusivamente a AWS Certified
Cloud Practitioner (CLF-C02). El contenido y la arquitectura multi-examen de
V2 no forman parte de este corte.

## Capacidades incluidas

- Catálogo bilingüe de 129 servicios y conceptos.
- Navegación por los cuatro dominios de CLF-C02.
- Mapa interactivo, búsqueda, filtros y fichas de detalle.
- Flashcards por alcance y cantidad.
- Diagramas de arquitecturas de referencia.
- Autenticación con Google, favoritos y notas respaldados por MongoDB.
- Diseño adaptable a escritorio y dispositivos móviles.

## Validación del corte

- `npx tsc --noEmit`: aprobado.
- `npm run build`: aprobado con las diez rutas generadas correctamente.
- Panel: aprobado; muestra CLF-C02, cuatro dominios y 129 elementos.
- Catálogo y búsqueda: aprobados.
- Mapa y filtros: aprobados.
- Flashcards: aprobadas con una sesión de cinco tarjetas.
- Arquitecturas: aprobadas.
- Selector español/inglés: aprobado.
- Favoritos: estado sin sesión aprobado.
- Consola del navegador: sin errores durante el recorrido.

La autenticación completa con Google y la persistencia contra una cuenta real
no se ejecutaron durante el corte para no modificar datos externos. El build sí
validó los endpoints de autenticación, favoritos y notas con la configuración
local disponible.

## Limitaciones aceptadas

- No existe selector de certificación.
- El simulacro todavía no está implementado.
- Las sesiones de práctica no persisten resultados.
- Los distractores de flashcards son generales y no usan familias de servicios.

Estas limitaciones quedan aceptadas para V1 y pertenecen al alcance planificado
de V2.

## Recuperación

El tag anotado `v1.0.0` identifica el commit estable. Para recuperar esta
versión se puede crear una rama desde ese tag sin moverlo ni reescribirlo.
