# AWS Concept Map — Restructure Plan (Next.js + react-flow)

## Context

Proyecto actual (`aws_study/`) es un solo HTML vanilla JS/SVG (`aws-map-v4.html`): ~64 servicios AWS en un array `DATA[]` hardcodeado, ~40 relaciones untyped `[nameA, nameB]` en `RELATIONS[]`, layout radial dibujado a mano, persistencia via `window.storage` (shim tipo localStorage). Sirve bien para repasar CLF-C02 pero no escala hacia lo que el usuario quiere a futuro: login, favoritos, flashcards, notas, "marcar repasado" tipo spaced-repetition, filtros por categoría, y relaciones como concepto central (tanto para aprender como para renderizar diagramas de arquitectura de referencia reales — 3-tier, serverless API, data lake, etc.) — todo eventualmente persistido en MongoDB, no localStorage.

Decisión tomada con el usuario: reescribir en **Next.js + react-flow**, con capa de datos diseñada para que Express+Mongo+JWT entre después sin rehacer nada, arrancando con JSON local seedeado. Esta ronda es solo diseño/planning — no se escribe código todavía.

También se decidió configurar MCP servers de AWS (Documentation MCP + Diagram MCP, awslabs) para verificar specs de servicios y contrastar diagramas de arquitectura durante la migración de contenido — esto queda pendiente para cuando se salga de plan mode (no se puede tocar config en modo solo lectura).

## 0. Pendiente inmediato al salir de plan mode
- Configurar `.mcp.json` (proyecto o global) con **AWS Documentation MCP Server** y **AWS Diagram MCP Server** (awslabs, open source) — usar durante migración de contenido (paso 4) para verificar descripciones de servicios contra docs oficiales y contrastar `views.json` contra diagramas generados.

## 1. Data schema

JSON local ahora, mismo shape que futuras collections de Mongo (sin rediseño después) — arrays top-level = 1 collection c/u, ids explícitos `string` (no depender de ObjectId) para que seed/export/import sea trivial.

### `categories.json` → futura collection `categories`
```json
[
  { "id": "compute", "label": "Cómputo", "accent": "#F5A623" },
  { "id": "storage", "label": "Almacenamiento", "accent": "#4DD9C5" }
]
```

### `services.json` → futura collection `services`
```json
[
  {
    "id": "ec2",
    "name": "EC2",
    "categoryId": "compute",
    "description": "Máquinas virtuales redimensionables bajo demanda; on-demand, reserved o spot.",
    "tip": "Lanzá una t2.micro (Free Tier) y conectate por SSH.",
    "examNote": "Distinguir On-Demand vs Reserved vs Spot vs Savings Plans.",
    "docUrl": "https://aws.amazon.com/ec2/"
  }
]
```
`examNote` es campo nuevo (minado de las guías markdown) — opcional, `""` permitido, mantiene el panel de detalle high-signal.

### `relationships.json` → futura collection `relationships`
```json
[
  { "id": "ec2-authenticates-via-iam", "source": "ec2", "target": "iam", "kind": "authenticates-via" },
  { "id": "s3-triggers-lambda", "source": "s3", "target": "lambda", "kind": "triggers" },
  { "id": "lambda-stores-in-dynamodb", "source": "lambda", "target": "dynamodb", "kind": "stores-in" },
  { "id": "ec2-network-scope-vpc", "source": "ec2", "target": "vpc", "kind": "network-scope" }
]
```
Enum de `kind` (chico, extensible): `uses`, `triggers`, `stores-in`, `authenticates-via`, `network-scope`, `monitors`, `routes-to`. Direccional (`source`→`target`) siempre, incluso en casos conceptualmente simétricos (ej SQS↔SNS: elegir un orden cualquiera).

### `views.json` → futura collection `architectureViews` (los diagramas famosos como overlay)
```json
[
  {
    "id": "serverless-api",
    "label": "Serverless API",
    "description": "API Gateway + Lambda + DynamoDB, sin servidores que administrar.",
    "nodeIds": ["api-gateway", "lambda", "dynamodb", "cognito", "cloudwatch"],
    "edgeIds": ["apigw-invokes-lambda", "lambda-stores-in-dynamodb", "apigw-authenticates-via-cognito"]
  },
  {
    "id": "three-tier-web",
    "label": "3-Tier Web App",
    "description": "ELB + EC2 (app tier) + RDS (data tier) dentro de una VPC.",
    "nodeIds": ["elb", "ec2", "rds", "vpc"],
    "edgeIds": ["elb-routes-to-ec2", "ec2-network-scope-vpc", "rds-network-scope-vpc"]
  }
]
```
`views[]` referencia nodos/edges **por id**, sin duplicar data — misma fuente de verdad, N overlays nombrados encima. Esta es la decisión estructural clave para los diagramas de referencia.

### Por qué este shape mapea limpio a Mongo después
- Cada array top-level → 1 collection, 1:1.
- `categoryId`, `source`, `target`, `nodeIds`, `edgeIds` son ids string, no refs/populate de Mongo — funciona igual sea JSON en memoria o `db.collection.find({id: {$in: [...]}})`.
- Futuras collections `favorites`, `reviewed`, `notes`, `flashcards` clavan en `{ userId, serviceId }` — se agregan sin tocar las 4 de arriba.

## 2. Estructura del proyecto (Next.js)

```
aws-map/
  app/
    page.tsx                      # vista principal del grafo (client component)
    layout.tsx
  components/
    graph/
      AwsFlowCanvas.tsx            # wrapper de react-flow: nodes, edges, controls, background
      ServiceNode.tsx              # custom node (icono + nombre + color de categoría)
      RelationshipEdge.tsx         # custom edge (estilo según `kind`)
      CategoryLegend.tsx
    panel/
      ServiceDetailPanel.tsx       # panel deslizante (desc/tip/examNote/link/acciones)
      RelatedChips.tsx
    views/
      ViewSwitcher.tsx             # selector de vista/arquitectura preset
    layout-mode/
      ModeToggle.tsx                # "por categoría" vs "todas las relaciones" (reemplaza modos radial/graph de v4)
  lib/
    data/
      seed/
        categories.json
        services.json
        relationships.json
        views.json
      repository.ts                # capa de acceso a datos: getServices(), getRelationships(), getViews()
                                     # hoy: lee JSON local. después: fetch/Mongo. Callers no cambian.
    layout/
      dagreLayout.ts               # calcula {x,y} por nodo dado nodes+edges+dirección
    highlight.ts                   # dado selección o vista activa -> {activeNodeIds, activeEdgeIds}
    store/
      useGraphStore.ts             # Zustand: selectedNodeId, activeViewId, layoutMode
      useUserStateStore.ts         # Zustand + persist localStorage: favorites, reviewed, notes (STUB temporal)
  types/
    domain.ts                      # Service, Category, Relationship, ArchitectureView, RelationshipKind
  scripts/
    migrate-legacy.md              # notas (sin código todavía) de cómo convertir DATA/RELATIONS + markdown -> JSON
```

Principio clave: **`lib/data/repository.ts` es el único módulo que sabe si los datos vienen de JSON o de una API.** Componentes y stores de Zustand llaman `repository.getServices()`, nunca `fetch` o imports de JSON directo. Cuando entre Express+Mongo+JWT, cambia el interior de `repository.ts` a `fetch('/api/services')`, las firmas se mantienen (quizás pasan a `async`) — diff contenido.

Puntos de enchufe para auth/favoritos/notas/flashcards (diseñados ahora, no construidos):
- `useUserStateStore.ts` ya aísla "estado de usuario" de "datos del grafo" — cambiar su persistencia de localStorage a API-Mongo queda contenido a este archivo.
- Futuro `app/api/*` o servidor Express separado, ambos caen bajo el mismo contrato de `repository.ts`.
- Flashcards = nueva `flashcards.json`/collection + métodos en `repository.ts`, mismo patrón, sin cambio estructural.

## 3. Integración react-flow

- **Librería**: `@xyflow/react` (nombre actual de React Flow v12+; `react-flow-renderer`/`reactflow` están deprecados).
- **Custom node** `ServiceNode.tsx`: borde/punto color de categoría + nombre + ícono chico (dot simple como v4 por ahora, íconos AWS reales como stretch goal futuro). Recibe `data: { service, categoryAccent, isDimmed, isReviewed, isFavorite }`.
- **Custom edge** `RelationshipEdge.tsx`: estilo según `data.kind` — sólido para `uses`/`network-scope`, punteado para `triggers`/`stores-in`, color distinto para `authenticates-via`. Lookup table `KIND_STYLES` chica.
- **Layout**: **dagre** (`@dagrejs/dagre`), no elkjs, no manual.
  - Justificación: dagre más liviano y simple para "agrupar en clusters, layout jerárquico" con ~65 nodos; elkjs es más potente pero pesado de más para proyecto solo; el radial manual de v4 es justo lo que se está reemplazando.
  - Enfoque: correr dagre una vez por cambio de layout-mode (agrupado por categoría vs grafo completo de relaciones), alimentar `position` de los nodos de react-flow. Re-correr solo si cambia el set de nodos; mantener posiciones estables al solo togglear highlight.
- **Preset views (overlay filtering)**: `lib/highlight.ts` toma `activeViewId` (o nodo hover/seleccionado como fallback) y devuelve sets de ids activos; `AwsFlowCanvas` mapea cada nodo/edge a `opacity: activeSet.has(id) ? 1 : 0.15` — generaliza directamente la lógica de dim-on-select que v4 ya tiene, ahora también disparada por vista nombrada. `ViewSwitcher` setea `activeViewId` en `useGraphStore`.
- **Layout agrupado por categoría (default)**: empezar simple — dagre sobre el grafo completo de relaciones con `rankdir: 'LR'` o `'TB'`, color por categoría como pista visual de agrupación (sin forzar clustering estricto). Revisar clustering real solo si el resultado de dagre plano se ve desordenado en la práctica.

## 4. Plan de migración (contenido legacy → JSON nuevo)

Extracción mecánica, un pase enfocado, sin código en este plan:
1. Recorrer `DATA[]` de `aws-map-v4.html`; por categoría emitir entrada en `categories.json` (`id` = slug de `cat`, mantener `accent`).
2. Por cada servicio en `items[]`, emitir entrada en `services.json`: `id` = slug de `name` (debe ser estable — es la join key de relationships/views), `d`→`description`, `tip`→`tip`, `link`→`docUrl`.
3. Cruzar las dos guías markdown por servicio para completar `examNote` (distinción relevante para examen, ej "OLTP vs OLAP") — solo donde aporte, `""` si no.
4. Recorrer pares de `RELATIONS[]`, resolver `[nameA, nameB]` a `[idA, idB]` vía el slug map del paso 2, asignar un `kind` por par (juicio manual, reusar el enum chico), emitir `relationships.json` con `id` = `${sourceId}-${kind}-${targetId}`.
5. Autorar a mano `views.json` para las 6 arquitecturas de referencia que pidió el usuario (3-tier web app, serverless API, static site + CDN, data lake/analytics pipeline, VPC public/private subnet, event-driven microservices) seleccionando ids ya producidos en pasos 2-4. Usar MCP de AWS Diagram/Documentation acá para verificar/contrastar.
6. Verificar counts: servicios ~64, relaciones ~40, sin relationship huérfana (source/target sin match en services.json).

## 5. Rollout por etapas

1. **Scaffold**: `create-next-app`, instalar `@xyflow/react`, `@dagrejs/dagre`, `zustand`, Tailwind. Cargar `services.json`/`categories.json` vía `repository.ts`, render de nodos coloreados por categoría, layout dagre, sin edges/relaciones todavía, sin panel de detalle más allá de click-to-select básico. Objetivo: confirmar flujo de datos + que el layout se vea razonable.
2. **Relaciones**: agregar `relationships.json`, custom edge `RelationshipEdge`, highlight hover/select (dim no-relacionados), panel de detalle con campos reales (`description`/`tip`/`examNote`/`docUrl`) + chips de relacionados (espejo del `pRel` de v4).
3. **Preset views**: agregar `views.json`, componente `ViewSwitcher`, `lib/highlight.ts` generalizado para aceptar view id.
4. **Estado de usuario local-only**: `useUserStateStore.ts` (Zustand + `persist` → localStorage) para favoritos/repasado/notas — UI igual a v4 (estrella, check, textarea), comentado en código como stand-in temporal para futura API Mongo, aislado detrás de la misma interfaz de store para que el swap sea contenido.
5. **Después (no en esta pasada)**: backend Express + MongoDB + JWT; `repository.ts` cambia internals de JSON-import a `fetch`; UI de auth/login; feature de flashcards (nueva collection + métodos repository + pantalla de estudio/repaso); UI de filtro por categoría (checklist que oculta categorías — separado de preset views, show/hide simple por set).

## 6. Recomendaciones de librerías

| Concern | Elección | Por qué |
|---|---|---|
| Render de grafo | `@xyflow/react` (React Flow v12) | Decisión ya tomada por el usuario; nombre de paquete actual, mantenido activamente, tiene las APIs de custom node/edge necesarias. |
| Layout | `@dagrejs/dagre` | Liviano, alcanza para layout jerárquico/clusterizado de ~65 nodos; elkjs es más pesado/potente de lo que necesita este proyecto solo; radial manual es justo lo que se reemplaza. |
| Estado | Zustand | Menos boilerplate que Context (sin provider tree, sin re-render footguns), más liviano que el modelo atom-por-valor de Jotai para esta forma de app; encaja con "proyecto solo pragmático". |
| Estilos | Tailwind CSS | Default estándar en Next.js nuevo, combina bien con className-based styling de react-flow, evita rehacer un theme de CSS variables como v4. |
| Persistencia (temporal) | Zustand `persist` middleware → localStorage | Marcado explícitamente temporal; misma interfaz de store apuntará a llamadas API después, sin ondas hacia los componentes. |

Complementario, no requerido: configurar por separado AWS Documentation MCP Server y AWS Diagram MCP Server (awslabs) para verificar descripciones de servicios durante la migración y contrastar los `views.json` de arquitecturas de referencia contra diagramas generados. Nada de este plan depende de que estén presentes.

### Archivos críticos para implementación
- lib/data/repository.ts
- lib/data/seed/services.json
- lib/data/seed/relationships.json
- lib/data/seed/views.json
- components/graph/AwsFlowCanvas.tsx
- lib/layout/dagreLayout.ts
- lib/store/useUserStateStore.ts

## Verificación
- `npm run dev` tras el scaffold (paso 1) y confirmar visualmente en navegador que categorías/nodos rendericen con colores correctos y layout dagre no se vea roto.
- Tras paso 2, click en nodo abre panel con datos reales (no placeholder), hover resalta relacionados y dim el resto — comparar visualmente contra el comportamiento ya validado en `aws-map-v4.html`.
- Tras paso 3, cada `views.json` entry activa un subset coherente (nodos/edges que realmente forman el patrón de arquitectura nombrado) — revisar contra documentación/diagramas AWS oficiales (usar MCP si ya está configurado).
- Tras paso 4, favoritos/notas/repasado persisten entre reloads de página (localStorage) y no rompen si se borra el storage.
- Correr conteos de migración (paso 4.6): servicios ≈64, relaciones ≈40, cero relationship huérfana.
