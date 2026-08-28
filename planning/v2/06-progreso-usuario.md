# Fase 5 — Progreso por usuario y certificación

Estado: implementado y verificado el 2026-08-28.

Evidencia: `/api/progress` recalcula aciertos desde el banco conocido, limita
payloads, filtra por usuario y guarda sesiones idempotentes con índice único.
`/progreso` muestra actividad y desempeño por dominio/examen. Favoritos aceptan
`itemKey` y mantienen lectura/escritura compatible con `serviceKey` de V1.

## Objetivo

Persistir evidencia de práctica y mostrar fortalezas/debilidades por examen sin
romper favoritos ni notas existentes.

Requisitos: `USR-01`, `USR-02`.

## Dependencias

- Motor de sesiones de la Fase 4 con resultados normalizados.
- Autenticación y MongoDB actuales operativos.

## Decisiones de compatibilidad

- `serviceKey` continúa siendo la identidad de favoritos y notas de servicios.
- Los conceptos nuevos usan un `itemKey` global; la API puede evolucionar de
  `serviceKey` a `itemKey` aceptando ambos durante la transición.
- Favoritos son globales por elemento, no se duplican por examen. La vista los
  filtra según el examen activo.
- El progreso sí pertenece a un examen, porque dominio, prioridad y resultados
  cambian entre certificaciones.
- Las migraciones de MongoDB son aditivas y toleran documentos V1.

## Datos propuestos

### `practiceSessions`

- `userId`
- `examId`
- `mode`
- `startedAt`, `completedAt`
- `questionCount`, `correctCount`
- resumen por dominio
- versión del banco de preguntas

### `questionAttempts`

- `userId`, `sessionId`, `examId`
- `questionId`, `domainId`
- resultado, respuesta y timestamp

Puede iniciarse con resúmenes de sesión y agregar intentos detallados solo si la
UI realmente los necesita, para evitar almacenar datos sin consumidor.

## Tareas

1. Definir contrato de resultado de sesión independiente de la UI.
2. Diseñar índices únicos y de consulta para nuevas colecciones.
3. Crear endpoints autenticados con validación estricta de payload.
4. Guardar sesiones completadas de forma idempotente.
5. Agregar página o sección de progreso por examen.
6. Mostrar:
   - actividad reciente;
   - aciertos globales;
   - desempeño por dominio;
   - preguntas/elementos a repasar.
7. Integrar “practicar errores” sin duplicar bancos de preguntas.
8. Adaptar favoritos/notas para `StudyItem` conservando lectura V1.
9. Definir retención y eliminación de datos de progreso.
10. Evitar métricas que presenten un porcentaje de aprobación garantizado.

## Seguridad y privacidad

- Todas las lecturas/escrituras filtran por `session.user.id` del servidor.
- El cliente no puede escribir resultados para otro usuario.
- Se limita tamaño de notas y payloads de sesiones.
- Los ids recibidos se validan contra el registro/banco conocido.
- No se guardan respuestas correctas confiando en el cliente sin validación.
- Los errores de base de datos no exponen datos de conexión.

## Verificación

- Un usuario nuevo inicia sin progreso y sin errores.
- Un usuario V1 conserva favoritos y notas.
- El mismo elemento favorito aparece donde corresponde en ambos exámenes.
- Dos usuarios no pueden acceder a progreso ajeno.
- Cambiar de examen cambia las métricas mostradas.
- Reenviar una sesión no duplica estadísticas.

## Criterios de aceptación

- El usuario autenticado puede retomar su preparación por certificación.
- La información previa de V1 permanece disponible.
- Las métricas explican qué representan y qué no representan.
