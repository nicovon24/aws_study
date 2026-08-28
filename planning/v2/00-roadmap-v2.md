# AWS Prep V2 — Roadmap multi-certificación

Estado: en ejecución. Fases 0, 1 y 2 completadas; Fase 3 es el próximo bloque.

Última actualización: 2026-08-28.

## Tablero de seguimiento

Este tablero es la referencia rápida del avance de V2. Se actualiza al cerrar
cada tarea o fase junto con la evidencia correspondiente.

Estados utilizados: `LISTO`, `EN CURSO`, `PENDIENTE` y `BLOQUEADO`.

### Resumen por fase

| Fase | Trabajo | Estado | Avance | Listo | Falta | Documento |
|---|---|---|---:|---|---|---|
| 0 | Cierre y versionado de V1 | LISTO | 100% | Build, prueba visual, documentación, commit y tag `v1.0.0` | Publicar commit/tag en GitHub cuando se autorice | `01-cierre-v1.md` |
| 1 | Fundaciones multi-examen | LISTO | 100% | Registro, ids dinámicos, CLF-C02 migrado, metadata pedagógica y validaciones | — | `02-fundaciones-multi-examen.md` |
| 2 | Selector, navegación y UX | LISTO | 100% | Selector responsive, URL/localStorage, navegación, filtros por examen, estados vacíos y movimiento reducido | — | `03-selector-y-navegacion.md` |
| 3 | AWS MCP y contenido AIF-C01 | PENDIENTE | 0% | Fuentes iniciales y reglas editoriales definidas | Pipeline de fuentes, revisión y contenido estructurado AIF-C01 | `04-contenido-aif-c01.md` |
| 4 | Preguntas, flashcards y simulacros | PENDIENTE | 0% | Modelo conceptual y estrategia de distractores definidos | Banco de preguntas, `similarTo`, grupos, sesiones y simulacro ponderado | `05-practica-y-simulacros.md` |
| 5 | Progreso de usuario | PENDIENTE | 0% | Compatibilidad objetivo documentada | Persistencia, métricas por examen y migración compatible | `06-progreso-usuario.md` |
| 6 | Validación y release V2 | PENDIENTE | 0% | Gates de release definidos | Validación integral, documentación y tag `v2.0.0` | `07-validacion-y-release.md` |

### Seguimiento por entregable

| ID | Entregable | Fase | Estado | Evidencia o próximo resultado |
|---|---|---:|---|---|
| VER-01 | Congelar una V1 reproducible | 0 | LISTO | Tag anotado `v1.0.0` sobre commit `eb1013f`; build y recorrido visual aprobados |
| EXM-01 | Registro tipado de certificaciones | 1 | LISTO | Registro con CLF-C02 y metadata AIF-C01 validado durante build |
| EXM-02 | Eliminar la suposición fija de cuatro dominios | 1 | LISTO | Vistas iteran dominios configurados e ids estables |
| EXM-03 | Migrar CLF-C02 sin regresiones | 1 | LISTO | Conteos 8/21/89/11, URLs, mapa y flashcards comparados con V1 |
| AWS-01 | Catálogo canónico independiente de exámenes | 1 | LISTO | Servicios mantienen claves globales y `CatalogScope` admite `all-aws` |
| AWS-02 | Pertenencia y prioridad por examen | 1 | LISTO | `ExamItem` concentra dominio y prioridad con fallback V1 reversible |
| NAV-01 | Selector CLF-C02/AIF-C01 | 2 | LISTO | Selector accesible en Header desktop y drawer mobile |
| NAV-02 | Persistencia del examen activo | 2 | LISTO | URL tiene precedencia y `localStorage` restaura la última selección |
| NAV-03 | Enlaces compartibles con foco correcto | 2 | LISTO | Tabs preservan `exam`; dominio/categoría inválidos se normalizan |
| SRC-01 | Flujo editorial con AWS Knowledge MCP | 3 | PENDIENTE | Descubrimiento y actualización reproducibles |
| SRC-02 | Proveniencia de contenido | 3 | PENDIENTE | URL, fecha, examen y revisión registrados |
| SRC-03 | Revisión antes de publicar | 3 | PENDIENTE | Contenido MCP entra como `staged`, nunca directo a producción |
| CNT-01 | Cinco dominios completos de AIF-C01 | 3 | PENDIENTE | Matriz dominio → objetivo → contenido |
| CNT-02 | Reutilizar servicios compartidos | 1–3 | LISTO | Exámenes referencian claves del catálogo sin duplicar servicios |
| CNT-03 | Prioridad específica por examen | 1–3 | LISTO | Prioridad leída desde `ExamItem`; campo V1 queda como fallback temporal |
| PRC-01 | Práctica para servicios y conceptos | 4 | PENDIENTE | Motor común de preguntas |
| PRC-02 | Explicaciones y resumen | 4 | PENDIENTE | Feedback correcto/incorrecto y cierre de sesión |
| PRC-03 | Simulacro ponderado | 4 | PENDIENTE | Distribución por pesos del examen activo |
| PRC-04 | Distractores plausibles | 4 | PENDIENTE | `similarTo`, familias y grupos validados |
| PRC-05 | Tipos de ejercicio diferenciados | 4 | PENDIENTE | Aprendizaje, comparación, escenario y examen |
| EDU-01 | Recorrido completo por certificación | 4–6 | PENDIENTE | Aprender → practicar → simular → revisar para CLF-C02 y AIF-C01 |
| USR-01 | Preservar favoritos y notas V1 | 5 | PENDIENTE | Compatibilidad por `serviceKey` demostrada |
| USR-02 | Progreso por usuario y examen | 5 | PENDIENTE | Resultados por certificación, dominio y objetivo |
| UX-01 | Skeletons consistentes | 2–6 | EN CURSO | Loader de hidratación y skeleton de cálculo del mapa solo durante esperas reales; ampliar con futuras cargas de contenido |
| UX-02 | Animaciones accesibles | 2–6 | EN CURSO | Loader y mapa respetan movimiento reducido; continuar auditoría en fases con sesiones y simulacros |
| REL-01 | Gates técnicos V2 | 6 | PENDIENTE | Build, tipos, lint y pruebas aprobados |
| REL-02 | Validación manual V2 | 6 | PENDIENTE | Flujos principales aprobados en desktop y mobile |

### Regla de actualización

- Al empezar una tarea, su estado cambia a `EN CURSO`.
- Al terminarla, cambia a `LISTO` únicamente si existe evidencia verificable.
- Si no puede avanzar, cambia a `BLOQUEADO` y se registra la causa.
- El porcentaje de una fase se actualiza por entregables terminados, no por
  tiempo invertido.
- Cada cierre debe registrar commit, prueba, documento o resultado que permita
  comprobarlo.

## Visión

Convertir AWS Prep de una aplicación dedicada a Cloud Practitioner (CLF-C02)
en una plataforma extensible para aprender el ecosistema AWS completo y preparar
múltiples certificaciones. CLF-C02 y AWS Certified AI Practitioner (AIF-C01)
serán los dos primeros recorridos completos, pero el modelo no debe quedar
limitado a ellos.

La V2 debe permitir que una persona elija una certificación y encuentre una
experiencia coherente en todas las vistas: panel, mapa, catálogo, arquitecturas,
práctica, favoritos, notas, progreso y simulacros. También debe poder explorar
contenido general de AWS aunque todavía no esté asociado a un examen.

## Línea base y versionado

- **V1 (`v1.0.0`)**: experiencia actual centrada exclusivamente en CLF-C02.
- **V2 beta (`2.0.0-beta.x`)**: catálogo AWS canónico, transformación
  multi-examen y carga de AIF-C01.
- **V2 estable (`v2.0.0`)**: CLF-C02 y AIF-C01 utilizables de punta a punta,
  sin regresiones conocidas sobre las capacidades de V1.
- El tag de V1 fue creado antes de integrar contenido o código propio de AIF-C01.
- El desarrollo de V2 continúa en la rama `v2`, creada después
  del tag estable de V1.

## Principios de arquitectura

1. **El examen es configuración.** Agregar una certificación no debe exigir
   condiciones repartidas por componentes.
2. **Una sola identidad por elemento.** Los servicios mantienen su `key`
   estable para preservar favoritos, notas, relaciones y arquitecturas.
3. **Contenido y pertenencia se separan.** El contenido canónico de un servicio
   no se duplica; cada examen define qué elementos incluye, en qué dominio y con
   qué prioridad.
4. **Los dominios no tienen cantidad fija.** Ningún componente puede asumir que
   existen exactamente cuatro dominios ni que su id TypeScript es `1 | 2 | 3 | 4`.
5. **La selección es navegable.** El examen activo debe estar en la URL y
   conservarse al recargar o compartir un enlace.
6. **Compatibilidad antes que expansión.** La primera prueba del nuevo modelo es
   que CLF-C02 siga comportándose igual.
7. **Markdown es fuente editorial, no base de datos de runtime.** Las guías pueden
   mantenerse en Markdown, pero la UI interactiva consume datos tipados.
8. **Conocimiento y certificación son capas distintas.** El catálogo canónico
   representa servicios, conceptos, comparaciones y patrones de AWS; cada examen
   define un recorrido sobre un subconjunto de ese conocimiento.
9. **Fuentes oficiales trazables.** El contenido obtenido mediante MCPs de AWS
   conserva URL, fecha de consulta y estado de revisión humana.
10. **MCP en curación, datos locales en runtime.** La app publicada no depende de
    que Codex o un MCP estén conectados para poder estudiar.
11. **Movimiento con propósito.** Skeletons y animaciones comunican carga,
    jerarquía o transición; respetan `prefers-reduced-motion` y no degradan el uso.

## Alcance de V2

### Incluido

- Corte y documentación formal de V1.
- Registro tipado de certificaciones.
- Catálogo canónico extensible de conocimiento AWS, incluso fuera de un examen.
- CLF-C02 migrado al registro sin cambios funcionales intencionales.
- Selector de certificación responsive.
- URL, metadatos y navegación conscientes del examen activo.
- Cinco dominios de AIF-C01 con sus ponderaciones.
- Flujo asistido por AWS Knowledge MCP para descubrir, comparar y refrescar
  guías de examen, servicios en alcance y documentación oficial.
- Proveniencia y estado editorial de cada fuente incorporada.
- Elementos de estudio de tipo servicio, concepto, comparación y escenario.
- Metadata pedagógica para agrupar servicios similares, conceptos cercanos y
  distractores plausibles.
- Catálogo, mapa y práctica filtrados por certificación.
- Banco de preguntas trazable con dificultad, objetivo, explicación y relación
  con servicios/conceptos similares.
- Práctica con opciones menos obvias, distractores por familia y formatos
  adicionales.
- Simulacro configurable y simulacro ponderado por examen.
- Progreso persistente por usuario y certificación.
- Migración compatible de favoritos y notas actuales.
- Skeletons específicos por vista y transiciones consistentes en desktop/mobile.
- Soporte de movimiento reducido y presupuesto básico de rendimiento visual.

### Fuera de alcance inicial

- Compra, agenda o rendición del examen desde la aplicación.
- Banco comercial de preguntas o copia de preguntas reales de AWS.
- Generación de preguntas mediante IA en producción.
- Aplicación móvil nativa.
- Panel administrativo completo para editar contenido.
- Soporte simultáneo de una tercera certificación antes de estabilizar AIF-C01.
- Publicación automática de texto obtenido por MCP sin revisión editorial.
- Scraping del sitio de AWS desde el cliente de producción.
- Migración del mapa a otro motor solo por introducir múltiples exámenes.

## Requisitos trazables

| ID | Requisito |
|---|---|
| VER-01 | Existe un tag reproducible de V1 y su alcance está documentado. |
| EXM-01 | La app obtiene nombre, código y dominios desde un registro de exámenes. |
| EXM-02 | Ninguna vista depende de una cantidad fija de dominios. |
| EXM-03 | CLF-C02 conserva su contenido y comportamiento al migrar al nuevo modelo. |
| AWS-01 | Existe un catálogo canónico de conocimiento AWS independiente de los exámenes. |
| AWS-02 | Cada certificación define un recorrido sobre el catálogo sin duplicar contenido. |
| NAV-01 | El usuario puede seleccionar CLF-C02 o AIF-C01 en desktop y mobile. |
| NAV-02 | El examen activo se conserva en URL y almacenamiento local. |
| NAV-03 | Los enlaces compartidos abren la certificación y el foco correctos. |
| CNT-01 | AIF-C01 cubre sus cinco dominios y objetivos de estudio. |
| CNT-02 | Servicios y conceptos compartidos no se duplican innecesariamente. |
| CNT-03 | La prioridad pertenece al examen, no al servicio global. |
| SRC-01 | AWS Knowledge MCP alimenta un flujo reproducible de descubrimiento y actualización. |
| SRC-02 | Cada fuente importada registra URL, fecha, examen y estado de revisión. |
| SRC-03 | Ningún cambio obtenido por MCP llega al contenido publicado sin validación. |
| PRC-01 | La práctica soporta servicios y conceptos. |
| PRC-02 | La práctica ofrece explicación y resumen de resultados. |
| PRC-03 | Existe un simulacro ponderado según la definición del examen. |
| PRC-04 | Las preguntas usan grupos de distractores y relaciones `similarTo` para evitar opciones obvias o aleatorias. |
| PRC-05 | El banco de preguntas distingue aprendizaje guiado, comparación de servicios, escenarios y práctica tipo examen. |
| EDU-01 | CLF-C02 y AIF-C01 completan aprender → practicar → simular → revisar. |
| USR-01 | Favoritos y notas V1 continúan accesibles. |
| USR-02 | El progreso se guarda por usuario, examen y dominio. |
| REL-01 | Build, lint y pruebas relevantes pasan antes de V2 estable. |
| REL-02 | V2 incluye validación manual de los flujos principales en mobile y desktop. |
| UX-01 | Las vistas con carga o transición relevante tienen skeletons coherentes. |
| UX-02 | Las animaciones respetan movimiento reducido, accesibilidad y rendimiento. |

## Modelo conceptual objetivo

```ts
type ExamId = "clf-c02" | "aif-c01";
type StudyItemKind = "service" | "concept" | "comparison" | "scenario";

type CatalogScope =
  | { kind: "all-aws" }
  | { kind: "exam"; examId: ExamId };

type ExamDefinition = {
  id: ExamId;
  code: string;
  name: Localized;
  shortName: Localized;
  description: Localized;
  domains: ExamDomain[];
};

type ExamDomain = {
  id: string;
  number: number;
  name: Localized;
  weight: number;
  color: string;
  objectives?: Localized[];
};

type ExamItem = {
  itemKey: string;
  domainId: string;
  priority: 1 | 2 | 3;
  objectiveIds?: string[];
};

type StudyItem = {
  key: string;
  kind: StudyItemKind;
  name: Localized;
  description: Localized;
  link?: string;
  topicIds?: string[];
  familyIds?: string[];
  similarTo?: string[];
  distractorGroupIds?: string[];
};

type PracticeQuestion = {
  id: string;
  examId: ExamId;
  domainId: string;
  objectiveIds: string[];
  sourceItemKeys: string[];
  relatedItemKeys?: string[];
  distractorGroupIds: string[];
  skill: "recall" | "compare" | "scenario" | "troubleshoot" | "choose-best";
  difficulty: "basic" | "intermediate" | "exam-like";
};

type ContentSource = {
  id: string;
  provider: "aws-knowledge-mcp" | "aws-docs" | "manual";
  url: string;
  fetchedAt: string;
  reviewedAt?: string;
  status: "staged" | "reviewed" | "published" | "stale";
  examIds?: ExamId[];
};
```

La forma final puede variar durante implementación, pero debe mantener las
separaciones anteriores. `Service` puede seguir siendo un subtipo enriquecido
de `StudyItem` para no reescribir de golpe mapa, relaciones y arquitecturas.

## Fases y dependencias

| Fase | Nombre | Depende de | Resultado |
|---|---|---|---|
| 0 | Cierre de V1 | — | V1 verificada, documentada y etiquetable. |
| 1 | Fundaciones multi-examen | 0 | CLF-C02 funciona sobre un registro genérico. |
| 2 | Selector, navegación y estados visuales | 1 | El examen activo controla toda la interfaz con carga coherente. |
| 3 | Fuentes AWS MCP y contenido AIF-C01 | 1, 2 | AIF-C01 se construye desde fuentes oficiales trazables. |
| 4 | Práctica y simulacros | 3 | Sesiones y simulacros útiles para ambos exámenes. |
| 5 | Progreso de usuario | 4 | Resultados y dominio se persisten por examen. |
| 6 | Validación y release | 0–5 | V2 estable, documentada y liberable. |

Los detalles ejecutables están en los documentos `01` a `07` de esta carpeta.
El contrato transversal de skeletons y animaciones está en
`08-experiencia-ui-skeletons-animaciones.md`.

## Estrategia de entrega

- Cada fase debe terminar con build y comprobaciones focalizadas.
- No mezclar la carga masiva de contenido AIF-C01 con la refactorización del
  modelo: primero se migra CLF-C02, luego se agrega el nuevo examen.
- La actualización por MCP produce primero contenido `staged` y un diff; nunca
  modifica silenciosamente el dataset publicado.
- Los cambios de base de datos deben ser aditivos y compatibles con documentos
  existentes antes de retirar campos antiguos.
- Los commits deben ser pequeños y separar infraestructura, contenido y UI.
- Al final de cada fase se actualiza su estado: `propuesto`, `en curso`,
  `implementado` o `bloqueado`.

## Riesgos principales

| Riesgo | Mitigación |
|---|---|
| Regresión de CLF-C02 | Snapshot del comportamiento actual y pruebas de selectores/mazos antes de generalizar. |
| Duplicación de servicios | Identificadores canónicos y tablas de pertenencia por examen. |
| URL ambigua | Parser centralizado con fallback explícito a CLF-C02. |
| Prioridades incorrectas | Mover prioridad a `ExamItem` y validar referencias. |
| Contenido AIF-C01 incompleto | Matriz dominio → objetivo → elemento → pregunta. |
| Preguntas demasiado obvias | `similarTo`, familias y grupos de distractores validados por tipo de pregunta. |
| Banco de preguntas inmantenible | Separar contenido canónico, metadata pedagógica y preguntas versionadas. |
| Documentación AWS cambiante | Proveniencia, fecha de consulta, detección de cambios y revisión antes de publicar. |
| Dependencia indebida del MCP | MCP solo en tooling/editorial; snapshot tipado y versionado para runtime. |
| Animaciones costosas o molestas | Presupuesto de movimiento, skeletons por geometría y `prefers-reduced-motion`. |
| Métricas engañosas | Definir progreso como evidencia de práctica, no como probabilidad garantizada de aprobar. |
| Datos V1 inaccesibles | Mantener `serviceKey` y migraciones aditivas. |

## Definición global de terminado

- Un enlace puede abrir cualquiera de los dos exámenes.
- Todas las vistas muestran el examen activo y solo contenido aplicable.
- CLF-C02 conserva las capacidades disponibles en V1.
- AIF-C01 cubre sus cinco dominios con contenido revisable y práctica.
- El catálogo puede alojar conocimiento AWS no asociado todavía a una certificación.
- Las fuentes oficiales usadas pueden auditarse y refrescarse mediante AWS MCP.
- Las preguntas usan distractores plausibles provenientes de servicios o
  conceptos similares, no opciones globales al azar.
- Favoritos y notas anteriores siguen funcionando.
- El usuario autenticado puede ver progreso separado por examen.
- El simulacro respeta ponderaciones y produce revisión de respuestas.
- La documentación explica cómo agregar una tercera certificación.
- Las validaciones técnicas y manuales de la Fase 6 están aprobadas.
- Los estados de carga no producen saltos de layout importantes y las animaciones
  se pueden reducir desde las preferencias del sistema.
