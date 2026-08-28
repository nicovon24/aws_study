# Fase 1 — Fundaciones multi-examen

Estado: en curso desde 2026-08-28.

Avance actual:

- [x] Línea base V1 disponible mediante el tag `v1.0.0`.
- [x] Rama `feat/v2-multi-exam` creada desde la línea base.
- [x] Versión de desarrollo cambiada a `2.0.0-beta.0`.
- [ ] Registro tipado de exámenes.
- [ ] Migración compatible de CLF-C02.
- [ ] Vistas con dominios dinámicos.
- [ ] Selectores e integridad de datos.
- [ ] Verificación funcional contra V1.

## Objetivo

Generalizar el modelo de dominio mientras la aplicación continúa mostrando
CLF-C02 y se comporta igual que V1.

Requisitos: `EXM-01`, `EXM-02`, `EXM-03`, `AWS-01`, `AWS-02`, `CNT-02`, `CNT-03`.

## Dependencias

- Fase 0 cerrada.
- Snapshot funcional de CLF-C02 disponible para comparar.

## Diseño propuesto

Crear un registro similar a:

```text
src/data/exams/
  index.ts
  clf-c02.ts
  aif-c01.ts        # inicialmente puede ser solo metadata

src/data/study-items/
  concepts.ts
```

La ubicación exacta se valida contra las convenciones vigentes al implementar.
`services.ts` continúa como fuente canónica de servicios durante la migración.
El destino conceptual es un catálogo AWS independiente de los exámenes y una
capa de recorridos/currículos que lo referencia.

Además de la descripción visible, cada elemento de estudio debe poder guardar
metadata pedagógica:

- `topicIds`: temas como `storage`, `iam`, `generative-ai`, `monitoring`.
- `familyIds`: familias amplias como `compute`, `database`, `ai-ml`,
  `security`, `networking`.
- `similarTo`: claves de servicios o conceptos que se confunden naturalmente.
- `distractorGroupIds`: grupos reutilizables para generar opciones plausibles.

Esta metadata no reemplaza las preguntas; prepara el terreno para que la
práctica pueda elegir opciones parecidas sin mezclar respuestas obvias.

## Tareas

1. Introducir tipos genéricos `ExamId`, `ExamDefinition`, `ExamDomain`,
   `ExamItem` y `StudyItemKind`.
2. Crear el registro de exámenes y funciones de acceso con fallo explícito para
   ids inválidos.
3. Definir un modo global de exploración `all-aws` que pueda incluir conocimiento
   sin pertenencia a un examen, sin forzarlo todavía en la navegación principal.
4. Migrar metadata, dominios, pesos y pertenencias CLF-C02 desde `domains.ts`.
5. Reemplazar `DomainNumber = 1 | 2 | 3 | 4` por identificadores que admitan
   cualquier cantidad de dominios.
6. Cambiar `MapFocus` para que el foco de dominio use un id estable y sea
   interpretable dentro del examen activo.
7. Mover la prioridad de estudio desde `Service.priority` hacia la pertenencia
   `ExamItem`; mantener compatibilidad temporal mientras se migra la UI.
8. Agregar metadata `topicIds`, `familyIds`, `similarTo` y
   `distractorGroupIds` al catálogo canónico con fallback vacío.
9. Crear selectores puros:
   - examen por id;
   - dominios por examen;
   - elementos por examen;
   - elementos por dominio;
   - prioridad de un elemento dentro de un examen.
10. Crear selectores pedagógicos iniciales:
   - elementos similares;
   - elementos por familia;
   - candidatos de distractor por grupo;
   - validación de referencias `similarTo`.
11. Adaptar dashboard, filtros, mapa, catálogo y flashcards para iterar dominios
   dinámicos sin introducir todavía el selector visible.
12. Agregar validaciones de integridad de datos:
   - ids únicos;
   - pesos razonables y suma esperada;
   - dominios referenciados existentes;
   - `itemKey` existente;
   - pertenencias no duplicadas.
13. Mantener exports de compatibilidad solo mientras sean necesarios y registrar
    su eliminación posterior.

## Archivos esperados

- `src/lib/types.ts`
- `src/lib/domains.ts` o su reemplazo
- `src/lib/flashcards.ts`
- `src/data/services.ts`
- nuevos archivos bajo `src/data/exams/`
- vistas que actualmente asumen `[1, 2, 3, 4]`
- pruebas nuevas del registro y selectores

## Verificación

- CLF-C02 expone cuatro dominios con pesos 24/30/34/12.
- El conteo de elementos por dominio coincide con la línea base.
- Los mazos CLF-C02 siguen excluyendo elementos fuera de alcance.
- Las relaciones `similarTo` apuntan a elementos existentes y no se autoreferencian.
- Los grupos de distractores tienen suficientes candidatos para las preguntas
  planeadas o quedan marcados como incompletos.
- Buscar en el código no encuentra loops de UI con `[1, 2, 3, 4]` vinculados
  a dominios de examen.
- Los identificadores estables de servicios no cambian.
- Build y verificaciones automatizadas pasan.

## Criterios de aceptación

- Se puede registrar un examen de cinco dominios sin modificar tipos globales.
- Se puede registrar conocimiento AWS que aún no pertenezca a ningún examen.
- CLF-C02 funciona enteramente mediante el registro.
- La prioridad puede variar entre exámenes.
- El catálogo puede expresar que dos servicios son similares sin duplicar
  contenido ni crear pertenencias falsas a un examen.
- No se modifican documentos existentes de favoritos o notas.

## Riesgos y rollback

- El mayor riesgo es cambiar el significado de `MapFocus` y romper URLs. El
  parser debe aceptar temporalmente parámetros V1 y normalizarlos.
- La migración de prioridad se hace en dos pasos: lectura con fallback y luego
  eliminación del campo viejo, nunca ambas cosas en un único cambio masivo.
