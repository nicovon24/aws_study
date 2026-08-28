# AWS Prep

Aplicación de estudio para **AWS Certified Cloud Practitioner (CLF-C02)**.
La versión estable actual es **V1 (`v1.0.0`)** y está dedicada exclusivamente
a esa certificación.

Incluye 129 servicios y conceptos organizados por los cuatro dominios del
examen, con contenido en español e inglés.

## Funcionalidades de V1

- Panel de estudio por dominio y peso del examen.
- Catálogo buscable con filtros por dominio, categoría y prioridad.
- Mapa interactivo de servicios y sus relaciones.
- Flashcards configurables por alcance y cantidad.
- Ejemplos visuales de arquitecturas AWS.
- Selector de idioma español/inglés.
- Inicio de sesión con Google, favoritos y notas persistidas en MongoDB.
- Interfaz adaptable a escritorio y dispositivos móviles.

## Stack

- Next.js 16 (App Router), React 19 y TypeScript.
- Tailwind CSS v4 y Framer Motion.
- NextAuth con Google y MongoDB para cuentas, favoritos y notas.
- Dataset de estudio versionado localmente en `src/data/`.

## Cómo ejecutar

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Para habilitar autenticación, favoritos y notas se necesitan estas variables
en `.env.local`:

```dotenv
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Comandos de validación:

```bash
npm run build
npx tsc --noEmit
```

## Vistas

- `/`: panel CLF-C02.
- `/catalogo`: catálogo de servicios y conceptos.
- `/mapa`: mapa interactivo.
- `/practicar`: sesiones de flashcards.
- `/arquitecturas`: escenarios visuales.
- `/favoritos`: contenido guardado por el usuario autenticado.

## Estructura principal

```text
src/
  app/          # rutas, layout y endpoints de autenticación/datos
  components/   # layout, vistas, UI compartida, diagramas y skeletons
  data/         # catálogo, relaciones y arquitecturas
  hooks/        # idioma, favoritos, notas y comportamiento de vistas
  lib/          # dominios CLF-C02, grafo, flashcards, auth y utilidades
```

## Alcance y limitaciones de V1

- V1 cubre solamente CLF-C02; todavía no permite elegir otras certificaciones.
- El paso de simulacro permanece marcado como próximamente.
- Las flashcards usan el catálogo actual y no guardan historial de resultados.
- Los distractores de las flashcards todavía no se agrupan por servicios
  similares; esa mejora está planificada para V2.
- Las funciones de cuenta requieren Google OAuth y una instancia de MongoDB
  correctamente configurados.

El diseño de la plataforma multi-certificación pertenece a V2 y no forma parte
del tag `v1.0.0`.

## Contenido

El catálogo canónico vive en `src/data/services.ts`. Las relaciones entre
servicios están en `src/data/relations.ts`, y la asignación a los dominios del
examen CLF-C02 está en `src/lib/domains.ts`.

Proyecto personal de estudio, no afiliado ni patrocinado por Amazon Web
Services, Inc.
