# Fase 0 — Cierre y versionado de V1

Estado: implementado y verificado el 2026-08-28.

## Objetivo

Congelar una línea base reproducible de la experiencia CLF-C02 antes de comenzar
la transformación multi-certificación.

Requisitos: `VER-01`.

## Decisiones

- V1 incluye únicamente CLF-C02.
- La guía AIF-C01 y el planning V2 no forman parte del producto V1.
- El tag sugerido es anotado: `v1.0.0`.
- El tag solo se crea desde un commit limpio y verificado.
- `.vscode/` se revisa antes de decidir si se ignora o comparte; nunca se
  versionan secretos ni configuraciones personales con credenciales.

## Tareas

1. [x] Revisar archivos no versionados y separar material V1 de material V2.
2. [x] Confirmar que `package.json` mantenga `1.0.0` para el corte.
3. [x] Ejecutar build y las verificaciones disponibles.
4. [x] Hacer una prueba manual mínima de:
   - panel CLF-C02;
   - filtros por dominio;
   - mapa y catálogo;
   - sesión de flashcards;
   - login, favoritos y notas;
   - arquitecturas;
   - idioma español/inglés.
5. [x] Actualizar README con alcance y ejecución de V1.
6. [x] Registrar limitaciones conocidas aceptadas para V1.
7. [x] Crear el commit final de V1.
8. [x] Crear localmente el tag anotado `v1.0.0` con autorización del usuario.
9. [ ] Publicar el commit y el tag en GitHub cuando se autorice expresamente.
10. [x] Al iniciar V2, cambiar la versión a `2.0.0-beta.0`.

## Resultado

- Commit estable: `eb1013f74490f84f3344a9128a2997c848397df8`.
- Tag anotado: `v1.0.0`.
- `package.json`: `1.0.0`.
- `npx tsc --noEmit`: aprobado.
- `npm run build`: aprobado.
- Panel, catálogo, mapa, práctica, arquitecturas, favoritos sin sesión e idioma:
  aprobados mediante recorrido local.
- Planning V2, guía AIF-C01 y configuración local: preservados fuera del tag.

## Verificación

- `git status` no contiene cambios imprevistos en el commit etiquetado.
- `npm run build` termina correctamente.
- El tag apunta exactamente al commit validado.
- El código etiquetado no depende de los documentos AIF-C01.
- El README identifica a V1 como aplicación CLF-C02.

## Criterios de aceptación

- Existe una referencia inmutable y recuperable de V1.
- El alcance de V1 queda explícito.
- El trabajo V2 puede avanzar sin reescribir la historia de V1.

## Rollback

Si se descubre que el tag local apunta al commit equivocado antes de publicarlo,
se elimina y recrea localmente. Si ya fue publicado, no se mueve silenciosamente:
se documenta el problema y se publica una versión correctiva.
