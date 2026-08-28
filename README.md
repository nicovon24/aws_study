# AWS Prep V2

Plataforma bilingüe de estudio para **AWS Certified Cloud Practitioner
(CLF-C02)** y **AWS Certified AI Practitioner (AIF-C01)**. El examen activo se
conserva en la URL y controla panel, catálogo, mapa, práctica y progreso.

## Funcionalidades

- Registro tipado de certificaciones y dominios con ponderaciones.
- Catálogo canónico compartido, con servicios, conceptos y comparaciones.
- Contenido AIF-C01 trazable y flujo editorial staged/reviewed/published.
- Mapa y catálogo filtrados por certificación, dominio, categoría y prioridad.
- Flashcards, práctica guiada con explicación y simulacro ponderado.
- Resumen de errores y progreso persistente por usuario, examen y dominio.
- Favoritos y notas compatibles con documentos V1 basados en `serviceKey`.
- Experiencia responsive, teclado, movimiento reducido y skeletons para esperas reales.

## Ejecución

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`. Las funciones de
cuenta requieren `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y
`AUTH_SECRET` en `.env.local`.

## Validación

```bash
npm run verify
```

El gate ejecuta validación editorial offline, pruebas del registro y banco,
TypeScript y build de producción. `npm run content:report` funciona sin conexión
a AWS MCP.

## Vistas

- `/`: ruta de aprendizaje del examen activo.
- `/catalogo` y `/mapa`: conocimiento aplicable al examen.
- `/practicar`: flashcards, práctica guiada y simulacro.
- `/progreso`: actividad y desempeño por dominio del usuario autenticado.
- `/arquitecturas`: patrones visuales.
- `/favoritos`: elementos guardados.

## Agregar una tercera certificación

1. Crear un `ExamDefinition` en `src/data/exams/` con dominios, pesos y objetivos.
2. Registrar el examen en `src/data/exams/index.ts`.
3. Reutilizar claves de `src/data/services.ts`; agregar solo contenido canónico faltante.
4. Asignar `ExamItem` con dominio, prioridad y `objectiveIds`.
5. Registrar fuentes y consultas en `content/sources/manifest.json`.
6. Ejecutar `npm run verify`; el registro detecta pesos, referencias y objetivos sin cobertura.

## Datos, migración y rollback

El contenido publicado vive versionado en el repositorio; MCP se usa solamente
para curación. Las sesiones se guardan idempotentemente en `practiceSessions`
con índice único `{ userId, sessionId }`. V2 sigue leyendo favoritos y notas V1
por `serviceKey`. El tag `v1.0.0` es el rollback de aplicación y no requiere una
migración destructiva de datos.

Proyecto personal de estudio, no afiliado ni patrocinado por Amazon Web
Services, Inc.
