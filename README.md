# aws-map

Mapa interactivo de los servicios de AWS para el track Cloud Practitioner (CLF-C02).
Migración a Next.js del prototipo original de un solo archivo (`../aws-map-v4.html`).

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
```

## Estructura

```
src/
  app/
    layout.tsx        raíz del App Router + metadata
    page.tsx          carga AwsMap solo en cliente
    globals.css       Tailwind v4 + tokens de tema + estilos de <details>
  components/
    AwsMap.tsx        estado (modo, estilo, selección) y todo el SVG
    Titlebar.tsx      barra superior y botones de modo/estilo
    DetailPanel.tsx   panel lateral: descripción, folds, relaciones
    ServiceCard.tsx   nodo rectangular (estilo "cards")
    ServiceDot.tsx    nodo punto + label (estilo "círculo")
  lib/
    types.ts          tipos del dominio
    graph.ts          índice de servicios y resolución de relaciones
    layout.ts         los 4 layouts, curvas y cálculo de "fit"
    usePanZoom.ts     arrastre, rueda y zoom anclado al cursor
  data/
    services.ts       15 categorías, 80 servicios
    relations.ts      119 relaciones servicio-a-servicio
```

## Modos

Dos ejes independientes, combinables:

- **radial** — jerarquía AWS → categoría → servicio.
- **relaciones** — todos los servicios conectados por sus relaciones reales.
- **círculo** — nodos como puntos con label, en órbita.
- **cards** — nodos como tarjetas compactas en grilla.

## Notas de la migración

- El render imperativo con `createElementNS` es ahora JSX; los layouts siguen
  siendo funciones puras que devuelven posiciones.
- El campo `long` del dataset es HTML de autor y se inyecta con
  `dangerouslySetInnerHTML`; no hay input de usuario en ese camino.
