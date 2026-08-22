# aws-map

App de estudio para la certificación **AWS Certified Cloud Practitioner (CLF-C02)**. Organiza ~80 servicios/conceptos de AWS en categorías y en los 4 dominios del examen, con un mapa interactivo, catálogo buscable y flashcards de repaso.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (`@theme` en `src/app/globals.css`, sin config file)
- Sin backend ni base de datos: todo el dataset vive en `src/data/`, la app corre 100% en el cliente (`ssr: false` en `src/app/page.tsx`)

## Cómo correr

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run start    # sirve el build
npm run lint
```

## Estructura

```text
src/
  app/
    page.tsx          # carga AwsStudyApp en el cliente + loader inicial
    globals.css        # theme de Tailwind, scrollbars, animaciones
  components/
    AwsStudyApp.tsx     # estado raíz: view actual, foco (MapFocus), selección
    Header.tsx           # navbar; en mobile es hamburger -> drawer full-screen
    CategoryFilters.tsx   # lista de categorías/dominios (sidebar en desktop, drawer en mobile)
    DashboardView.tsx     # home: dominios del examen + accesos a Mapa/Practicar
    MapView.tsx            # mapa de nodos (SVG) con pan/zoom
    CatalogView.tsx          # catálogo en columnas por categoría, con buscador
    PracticeView.tsx          # configuración y sesión de flashcards
    DetailPanel.tsx            # panel lateral (mobile: full screen) con el detalle de un servicio
    ServiceNode.tsx              # nodo/pill de servicio dentro del SVG del mapa
    Loader.tsx                    # splash inicial
  data/
    services.ts    # categorías -> servicios (nombre, descripción, doc oficial, etc.)
    relations.ts     # relaciones entre servicios (usadas en "Se relaciona con")
  lib/
    types.ts        # tipos compartidos (Node, Category, MapFocus, View, ...)
    domains.ts        # mapeo categoría -> dominio del examen (CLF-C02) + pesos
    graph.ts            # índices derivados de DATA (byId, relatedIds)
    layout.ts             # cálculo de posiciones de nodos en el mapa
    usePanZoom.ts          # hook de pan (drag/touch) y zoom (wheel) del mapa
    flashcards.ts            # armado de mazos y opciones para el modo práctica
```

## Vistas (`View`)

`dashboard` (Home) · `map` · `catalog` · `practice` — el estado vive en `AwsStudyApp` y se navega con `onNavigate`. El "foco" (`MapFocus`: todas las categorías, un dominio, o una categoría puntual) es compartido entre Mapa, Catálogo y el selector de alcance de Practicar.

## Mobile

- Header con hamburger (`md:hidden`) que abre un drawer full-screen con la navegación y, en Mapa/Catálogo, los filtros de categoría (mismo componente `CategoryFilters` que se usa como sidebar fijo en desktop).
- `DetailPanel` (detalle de servicio) ocupa el 100% del ancho/alto en mobile en vez del panel angosto de desktop.
- El mapa soporta pan de un dedo y pinch-zoom de dos dedos vía `usePanZoom` (el stage usa `touch-none` para no pelear con el zoom nativo del navegador).

## Dataset

Agregar o editar servicios se hace en `src/data/services.ts` (por categoría) y, si corresponde, relaciones en `src/data/relations.ts`. La asignación de categoría a dominio del examen vive en `src/lib/domains.ts` — toda categoría nueva debe agregarse ahí o cae por defecto en el dominio 3.
