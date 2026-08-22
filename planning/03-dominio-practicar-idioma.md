# Filtro por dominio, Practicar (flashcards) y preparación de idioma

Estado: implementado. Ver plan original y decisiones completas en el historial
de la sesión; este documento resume qué quedó construido para referencia futura.

## Qué se agregó

1. **Filtro por dominio en Mapa y Catálogo.** `MapFocus` (`src/lib/types.ts`)
   pasó de `"all" | string` a un union discriminado:
   ```ts
   type MapFocus =
     | { kind: "all" }
     | { kind: "domain"; n: DomainNumber }
     | { kind: "category"; name: string };
   ```
   El botón "Estudiar" del Panel ahora navega con `{kind:"domain", n}` en vez de
   abrir solo la primera categoría del dominio. El Mapa (`MapView.tsx`) agrupa
   su sidebar por los 4 dominios y soporta un tercer layout
   (`layoutDomainCategories` en `lib/layout.ts`) que expande todas las
   categorías de un dominio a la vez, atenuando el resto sin dibujar sus
   servicios. El Catálogo (`CatalogView.tsx`) recibe el mismo `focus` por prop
   y filtra sus columnas, con un chip "✕" para volver a "Todos".

2. **Practicar (flashcards).** Nueva vista (`PracticeView.tsx`) y nueva lógica
   (`lib/flashcards.ts`): dos modos multiple-choice elegidos explícitamente por
   el usuario ("Adivinar descripción" / "Adivinar servicio"), alcance filtrable
   con el mismo `MapFocus` que Mapa/Catálogo, 4 opciones por tarjeta (1 correcta
   + 3 distractores al azar de todo el dataset, no solo del alcance filtrado).
   Feedback inmediato (verde/rojo) al elegir, sin puntaje persistido ni resumen
   más allá de "completaste la tanda". El paso "2 Practicar" del Panel
   (`DashboardView.tsx`) se activó — ya no está deshabilitado.

3. **Idioma — sin implementar, a propósito.** No se agregó selector ni
   framework de i18n. Se dejó anotado que cuando se pida, es su propio plan
   (decidir en ese momento si se traduce solo la UI o también las 80
   descripciones del dataset, y qué librería usar — probablemente `next-intl`).

## Decisiones que quedaron fuera de alcance a propósito

- Sin tracking de progreso en Practicar (ni en memoria entre tandas ni
  persistido) — decisión explícita del usuario, coherente con no tener
  tracking de "aprendidos" en el Mapa tampoco.
- El motor del Mapa sigue siendo SVG a mano. Migrar a `@xyflow/react`
  (react-flow) se conversó y quedó anotado como trabajo a futuro en
  `01-arquitectura-y-datos.md` — no se tocó nada de eso en esta ronda.

## Archivos tocados

- `src/lib/types.ts` — `MapFocus` (union discriminado), `View` gana `"practice"`.
- `src/lib/layout.ts` — `layoutDomainCategories`, `computeLayout` maneja los 3 casos.
- `src/lib/flashcards.ts` — nuevo: `buildDeck`, `nodesInScope`, `FLASHCARD_MODE_LABEL`.
- `src/components/MapView.tsx` — sidebar por dominio, `catInFocus` helper.
- `src/components/CatalogView.tsx` — filtro por `focus` + chip de limpiar.
- `src/components/DashboardView.tsx` — `onStudy` con dominio completo, paso
  "Practicar" habilitado y navegable.
- `src/components/PracticeView.tsx` — nuevo.
- `src/components/AwsStudyApp.tsx`, `Header.tsx` — nueva vista `"practice"` cableada.
