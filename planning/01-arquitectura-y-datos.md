# Arquitectura y datos — estado actual

> Nota: este documento reemplaza una versión anterior que planeaba una reescritura
> con react-flow + dagre + Zustand + MongoDB. Esa dirección se descartó — la app
> real se construyó distinto (ver abajo) y ese plan viejo quedaba desactualizado y
> confuso. Si en algún momento se retoma esa idea (grafo interactivo tipo
> react-flow, backend con Mongo, auth), se vuelve a planificar desde cero contra
> el estado real del código, no contra este archivo.

## Qué es la app hoy

`aws-map/` es una app Next.js (App Router, TypeScript, Tailwind v4) migrada del
prototipo original de un solo archivo (`assets/old/aws-map-v4.html`), con la UI
rediseñada siguiendo un mockup (`assets/old/aws-study-v5.html`). Corre 100% en
cliente — no hay backend, ni base de datos, ni auth. El dataset vive en dos
archivos TypeScript locales, generados una vez a partir del HTML original y
mantenidos a mano desde entonces.

## Datos

- `src/data/services.ts` — `DATA: Category[]`, 15 categorías, 80 servicios. Cada
  servicio: `name`, `d` (descripción corta), `link` (doc oficial AWS), y
  opcionalmente `long` (HTML con `<strong>`), `use[]`, `avoid[]`,
  `concepts[]` — ver `src/lib/types.ts` para las formas exactas.
- `src/data/relations.ts` — `RELATIONS: [string, string][]`, 119 pares
  servicio-a-servicio por nombre, sin tipo semántico (no dicen *cómo* se
  relacionan, solo que se relacionan).
- `src/lib/graph.ts` — indexa `DATA` por id estable (`${categoryIndex}-${serviceIndex}`)
  y por nombre, resuelve `RELATIONS` a esos ids, expone `byId`, `relatedIds()`,
  `highlightSet()`. Es la única fuente de verdad derivada del dataset — no se
  duplica en otro lado.
- `src/lib/domains.ts` — mapea cada nombre de categoría a 1 de los 4 dominios del
  examen CLF-C02 (con su peso % oficial). Es una capa aparte que no toca
  `services.ts`, para no mezclar "cómo se agrupa para navegar" con "cómo se
  agrupa para el examen".

No hay collections, no hay `repository.ts`, no hay swap futuro a API — si algún
día se agrega backend, se decide en ese momento cómo servir estos mismos datos.

## Vistas y componentes

Tres vistas conmutables por tabs (`AwsStudyApp.tsx`, estado `view: View`):

- **Panel** (`DashboardView.tsx`) — landing con las 4 tarjetas de dominio del
  examen y los pasos "Aprender / Practicar / Simulacro" (hoy solo Aprender
  activo).
- **Mapa** (`MapView.tsx`) — SVG a mano (sin librería de grafos): sidebar de
  categorías + lienzo con nodos posicionados por trigonometría simple
  (`src/lib/layout.ts`), pan/zoom propio (`src/lib/usePanZoom.ts`). Dos modos:
  "Todas" (las 15 categorías con sus 80 servicios) o drill-down a 1 categoría.
- **Catálogo** (`CatalogView.tsx`) — buscador + columnas por categoría.

El panel de detalle (`DetailPanel.tsx`) es compartido por Mapa y Catálogo y
muestra todo el contenido del dataset (`long`, folds de `use`/`avoid`/`concepts`,
relacionados, link).

## Por qué no react-flow/dagre/Zustand

El plan original asumía que iba a hacer falta layout automático de grafo
(dagre), estado global complejo (Zustand) y persistencia de usuario (Mongo)
desde el arranque. En la práctica, el layout radial a mano (mismo enfoque que
ya tenía el HTML original, portado a funciones puras en `lib/layout.ts`) resultó
suficiente y más simple de ajustar a mano cuando el usuario pidió cambios
visuales puntuales (ver `02-servicios-pendientes.md` para el historial de
contenido, y el resto de esta carpeta para planes activos). El estado de la app
es chico (vista actual, foco del mapa, id seleccionado) y vive bien en
`useState` de React sin necesidad de una librería de estado.

## Motor del Mapa a futuro (react-flow)

Se conversó con el usuario migrar el Mapa de SVG-a-mano a `@xyflow/react`
(react-flow) más adelante: da pan/zoom/drag/minimap gratis y encaja bien con
filtros dinámicos de nodos (como el filtro por dominio agregado en
`03-dominio-practicar-idioma.md`). **Queda como trabajo a futuro, no
planificado todavía en detalle** — cuando se retome, es su propio plan de
migración de motor evaluado contra el código real de ese momento.

## Convenciones para seguir extendiendo

- Nuevo contenido de servicios: agregar a `src/data/services.ts` siguiendo el
  patrón documentado en `02-servicios-pendientes.md`.
- Nueva agrupación/filtro (como dominio): capa aparte en `src/lib/`, nunca
  editando `services.ts` — mantiene un solo dataset canónico con múltiples
  vistas sobre él.
- Todo texto de UI está hardcodeado en español directo en JSX — no hay
  framework de i18n todavía (ver plan de idioma en
  `03-dominio-practicar-idioma.md` si existe cuando se lea esto).
