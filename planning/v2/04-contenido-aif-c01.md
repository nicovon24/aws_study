# Fase 3 — Fuentes AWS MCP y contenido AI Practitioner (AIF-C01)

Estado: propuesto.

## Objetivo

Crear un flujo reproducible de curación desde documentación oficial de AWS y
convertir la guía AIF-C01 en contenido estructurado y navegable que cubra los
cinco dominios sin duplicar servicios existentes.

Requisitos: `CNT-01`, `CNT-02`, `CNT-03`, `SRC-01`, `SRC-02`, `SRC-03`.

## Dependencias

- Fases 1 y 2 implementadas.
- Guía `Aws_AI_Practitioner_Guia_Estudio.md` revisada contra fuentes oficiales
  vigentes antes de convertir afirmaciones sensibles a cambios.

## Fuentes oficiales iniciales

- Índice de guías de certificación:
  `https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html`
- Servicios AIF-C01 en alcance:
  `https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html`
- Servicios CLF-C02 en alcance:
  `https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html`
- Páginas oficiales de dominios y task statements de cada examen.
- Documentación oficial de cada servicio o feature enlazado.

Estas fuentes se descubren y leen mediante AWS Knowledge MCP cuando sea posible.
Los MCPs de AWS Pricing e IaC solo se usan cuando el contenido requiera precios,
tradeoffs de costo o infraestructura; no sustituyen la guía del examen.

## Flujo de ingestión y actualización

1. **Discover:** consultar AWS Knowledge MCP por guía, dominios, task statements,
   servicios in-scope/out-of-scope y documentación relevante.
2. **Stage:** guardar un manifiesto con URL, título, fecha, examen, checksum o
   versión observable y fragmentos que requieren revisión.
3. **Diff:** comparar la fuente actual con el último snapshot revisado y mostrar
   altas, bajas y cambios de alcance.
4. **Normalize:** convertir hallazgos en `StudyItem`, `ExamItem`, objetivos y
   fuentes, usando resúmenes propios en lugar de copiar páginas completas.
5. **Validate:** ejecutar integridad referencial, cobertura, enlaces y reglas
   editoriales.
6. **Review:** revisión humana obligatoria del diff y del significado del cambio.
7. **Publish:** promover contenido de `staged` a `published` en un commit explícito.

El refresh puede ejecutarse manualmente antes de una carga editorial o release.
Más adelante, una automatización puede generar un reporte periódico de cambios,
pero su salida termina siempre en `staged`: nunca publica ni modifica preguntas
sin revisión.

El MCP es una herramienta de mantenimiento ejecutada por Codex/desarrolladores;
la aplicación consume exclusivamente el snapshot aprobado y versionado.

## Dominios iniciales

| Nº | Dominio | Peso |
|---|---|---:|
| 1 | Fundamentos de AI y ML | 20% |
| 2 | Fundamentos de GenAI | 24% |
| 3 | Aplicaciones de Foundation Models | 28% |
| 4 | Guías de AI Responsable | 14% |
| 5 | Seguridad, Compliance y Governance para AI | 14% |

Los nombres y pesos se validan nuevamente al ejecutar esta fase porque la guía
del examen puede actualizarse.

## Taxonomía de contenido

- `service`: Bedrock, SageMaker AI, Comprehend, Lex, Polly, etc.
- `concept`: token, embedding, RAG, temperature, bias, grounding, etc.
- `comparison`: RAG vs fine-tuning, Bedrock vs SageMaker, precision vs recall.
- `scenario`: elección de servicio/técnica ante costo, latencia, seguridad o
  requisitos de negocio.

## Tareas

1. Mover la guía desde `assets/old/` a una ubicación editorial activa, por
   ejemplo `content/guides/aif-c01.md`, conservando su historial.
2. Crear el modelo y manifiesto `ContentSource` con estados editoriales.
3. Documentar consultas MCP reproducibles para ambos exámenes.
   El manifiesto debe indicar qué consulta y topics se usaron.
4. Crear un comando de validación/reporte que no necesite conexión MCP.
5. Crear una matriz de cobertura dominio → task statement → elemento de estudio.
6. Reutilizar servicios existentes por `Service.key`.
7. Completar o agregar servicios AIF-C01 faltantes siguiendo el modelo canónico.
8. Crear datos tipados para conceptos y comparaciones.
9. Asignar cada elemento a uno o más dominios/objetivos con prioridad específica
   para AIF-C01.
10. Adaptar búsqueda y detalle para distinguir tipo de elemento sin perder las
   capacidades ricas de los servicios.
11. Definir qué elementos aparecen en mapa. Los conceptos que no encajen bien
   visualmente pueden permanecer primero en catálogo y práctica.
12. Agregar arquitecturas/patrones AIF-C01 de alto valor, por ejemplo:
   - aplicación RAG con Bedrock Knowledge Bases;
   - agente con herramientas y guardrails;
   - endpoint administrado frente a servicio self-hosted;
   - flujo de evaluación y monitoreo responsable.
13. Revisar enlaces oficiales y evitar enlaces rotos o páginas de marketing
    cuando exista documentación técnica adecuada.
14. Añadir validación automática de cobertura y referencias.
15. Hacer revisión editorial en español e inglés; si el contenido inglés queda
    incompleto, documentar el fallback explícitamente antes de release.
16. Permitir que el catálogo canónico crezca con contenido AWS general sin
    inventar una pertenencia a CLF-C02 o AIF-C01.

## Entregable de cobertura

Debe existir una tabla o reporte generado que permita responder:

- ¿Qué objetivos no tienen contenido?
- ¿Qué elementos no están asignados a ningún objetivo?
- ¿Qué dominios tienen pocas preguntas?
- ¿Qué servicios compartidos tienen prioridad diferente entre exámenes?
- ¿Qué fuentes cambiaron desde la última revisión?
- ¿Qué contenido publicado depende de una fuente marcada como obsoleta?

## Verificación

- Los cinco dominios aparecen con la ponderación configurada.
- Cada objetivo de examen acordado tiene al menos un elemento de estudio.
- Todos los `itemKey` resuelven a contenido existente.
- No existen copias separadas de Bedrock/SageMaker/etc. solo por pertenecer a
  distintos exámenes.
- Búsqueda, detalles y enlaces funcionan para servicios y conceptos.
- La suma de pesos es 100%.
- Cada item publicado tiene al menos una fuente o una justificación editorial.
- Repetir una consulta MCP genera un diff revisable y no sobrescribe contenido.

## Criterios de aceptación

- El usuario puede recorrer AIF-C01 de punta a punta en modo aprendizaje.
- La guía Markdown y los datos estructurados tienen un propósito claro y no se
  contradicen silenciosamente.
- Se puede auditar cobertura por dominio y objetivo.
- El contenido se puede refrescar con AWS MCP sin convertir la app en un cliente
  dependiente del MCP.
