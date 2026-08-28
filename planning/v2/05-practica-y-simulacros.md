# Fase 4 — Práctica V2 y simulacros

Estado: propuesto.

## Objetivo

Evolucionar las flashcards de servicios a un motor de preguntas reutilizable
para conceptos, escenarios y simulacros de ambos exámenes.

Este es uno de los cambios grandes de V2: la práctica deja de ser un random
simple de servicios y pasa a ser un banco de ejercicios con metadata suficiente
para armar opciones plausibles, comparar servicios parecidos y medir progreso
por examen.

Requisitos: `PRC-01`, `PRC-02`, `PRC-03`, `PRC-04`, `PRC-05`, `EDU-01`.

## Dependencias

- Contenido estructurado de AIF-C01.
- Selectores de contenido por examen y dominio.

## Modelo propuesto

```ts
type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "ordering"
  | "matching";

type PracticeQuestion = {
  id: string;
  examId: ExamId;
  domainId: string;
  objectiveIds: string[];
  type: QuestionType;
  prompt: Localized;
  explanation: Localized;
  sourceItemKeys: string[];
  relatedItemKeys?: string[];
  distractorGroupIds: string[];
  skill: "recall" | "compare" | "scenario" | "troubleshoot" | "choose-best";
  difficulty?: "basic" | "intermediate" | "exam-like";
  // Opciones/respuestas discriminadas según type.
};
```

## Agrupación de preguntas y distractores

La V2 debe evitar preguntas con opciones globales al azar. Cada pregunta puede
tener distractores explícitos, pero cuando se generen opciones desde el catálogo
deben salir de grupos coherentes:

```ts
type DistractorGroup = {
  id: string;
  name: Localized;
  itemKeys: string[];
  examIds?: ExamId[];
  notes?: Localized;
};
```

Ejemplos de grupos:

- `ai-ml-managed-services`: Bedrock, SageMaker, Amazon Q, Comprehend, Lex,
  Kendra, Textract, Transcribe.
- `storage-object-file-block`: S3, EBS, EFS, FSx.
- `identity-access-governance`: IAM, Organizations, Control Tower, Config,
  CloudTrail.
- `databases-purpose-built`: RDS, DynamoDB, Aurora, Redshift, ElastiCache,
  DocumentDB.

`similarTo` vive en el catálogo y sirve para relaciones finas, por ejemplo
Bedrock ↔ SageMaker o CloudTrail ↔ Config. `DistractorGroup` sirve para armar
opciones de una misma familia. Una pregunta tipo examen puede usar ambos:
primero distractores explícitos si existen, luego `similarTo`, luego el grupo,
y finalmente una familia relacionada si faltan candidatos.

## Entregas incrementales

### 4A — Sesiones mejoradas

1. Generalizar el mazo para `StudyItem`.
2. Mantener los dos modos actuales como práctica rápida.
3. Añadir puntaje, progreso de sesión y resumen final.
4. Mostrar explicación después de responder.
5. Permitir revisar respuestas incorrectas.
6. Evitar distractores ambiguos o obviamente incompatibles.
7. Etiquetar cada ejercicio con habilidad evaluada: recordar, comparar, elegir
   el mejor servicio, resolver escenario o detectar una mala opción.

### 4B — Banco de preguntas

1. Incorporar preguntas de opción única y múltiple.
2. Agregar metadata de dominio, objetivo y dificultad.
3. Agregar `sourceItemKeys`, `relatedItemKeys`, `skill` y
   `distractorGroupIds`.
4. Validar ids únicos, cantidad de respuestas y consistencia de soluciones.
5. Validar que cada distractor sea plausible:
   - pertenece al mismo grupo o está en `similarTo`;
   - no es la respuesta correcta;
   - no contradice la explicación;
   - no queda fuera del alcance del examen salvo que la pregunta lo justifique.
6. Separar preguntas de aprendizaje de preguntas tipo examen.
7. No copiar preguntas protegidas ni afirmar que son preguntas reales de AWS.

### 4C — Motor de selección de opciones

1. Crear una función determinística para construir opciones por pregunta.
2. Priorizar distractores explícitos definidos por editor.
3. Usar `similarTo` cuando la pregunta sea de comparación o elección de servicio.
4. Usar `DistractorGroup` cuando se necesiten opciones adicionales.
5. Evitar mezclar servicios de familias lejanas si vuelven la respuesta obvia.
6. Registrar cuando una pregunta no tiene suficientes distractores plausibles.
7. Cubrir casos de empate, orden aleatorio y semilla fija para pruebas.

### 4D — Simulacro

1. Activar el tercer paso del Dashboard.
2. Crear sesiones ponderadas según `ExamDomain.weight`.
3. Configurar cantidad y tiempo sin prometer replicar exactamente el examen real.
4. Evitar repetición de preguntas dentro de una sesión.
5. Mostrar resultado total, por dominio y revisión completa.
6. Permitir abandonar y confirmar antes de perder una sesión en curso.
7. Ofrecer una ruta clara “Aprender → Practicar → Simular → Revisar” por cada
   certificación, mostrando qué etapa está disponible y cuál sigue.

## Reglas del generador de simulacros

- Distribuye preguntas mediante ponderación y corrige redondeos de forma
  determinística.
- Nunca solicita más preguntas únicas de las disponibles sin advertirlo.
- No elige distractores desde todo el catálogo salvo fallback explícito y
  marcado como deuda editorial.
- Evita que una pregunta quede con opciones demasiado obvias por mezclar
  familias sin relación.
- El score de práctica se presenta como orientativo.
- Las preguntas sin responder se tratan según la configuración del modo.
- La semilla aleatoria puede fijarse en pruebas.

## Verificación

- Un mazo CLF-C02 y uno AIF-C01 solo contienen elementos de su examen.
- El resumen coincide con las respuestas dadas.
- Opción múltiple exige exactamente la cantidad de respuestas definida.
- Las opciones incorrectas de cada pregunta provienen de distractores explícitos,
  `similarTo` o grupos compatibles.
- Un validador detecta preguntas sin suficientes distractores plausibles.
- El simulacro respeta una tolerancia documentada de ponderación por dominio.
- Reiniciar una sesión no reutiliza estado inválido del examen anterior.
- Mobile, teclado y lectores de pantalla permiten responder todos los tipos.

## Criterios de aceptación

- Servicios y conceptos se pueden practicar con feedback útil.
- Ambos exámenes pueden construir un simulacro válido.
- La persona puede identificar qué respondió mal y por qué.
- Las preguntas de comparación no se sienten obvias porque sus opciones compiten
  dentro de familias similares.
- CLF-C02 y AIF-C01 ofrecen el ciclo educativo completo, no solo un catálogo.
