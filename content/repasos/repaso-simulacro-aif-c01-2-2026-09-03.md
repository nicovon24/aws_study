# Repaso simulacro AIF-C01 (2) — 3 de septiembre de 2026

Segundo simulacro de práctica, 65 preguntas. 20 marcadas incorrectas
(69% global). Cruzado con el exam guide oficial ([aif-c01.md](../guides/aif-c01.md))
y con el temario del curso Udemy (clase exacta para repasar cada gap).

**Examen real: antes del 30 de septiembre de 2026.** Desde hoy (3/9),
27 días.

## Cronograma hacia el examen (30/9)

| Semana | Fechas | Foco | Cómo |
| --- | --- | --- | --- |
| 1 | 3/9 – 9/9 | IA Responsable a fondo (33% en los dos simulacros) | Repasar dominio 4 completo del exam guide, no solo los errores. Flashcards de los 8 servicios confundidos hasta dominar las 8. |
| 2 | 10/9 – 16/9 | Fundamentos de IA y ML (58%, sigue bajo) | Bias/varianza (flashcard diaria), métricas por tipo de tarea, tipos de inferencia. |
| 3 | 17/9 – 20/9 | Simulacro 3 dirigido | Solo preguntas de IA Responsable + Fundamentos de IA/ML — los otros tres dominios ya superan el umbral, no repetir examen completo. |
| 3-4 | 21/9 – 26/9 | Repaso de lo que falle en simulacro 3 | Mismo formato que este archivo: patrones, heurísticas, cruce con exam guide. |
| 4 | 27/9 – 29/9 | Repaso liviano + descanso | Flashcards de repaso rápido, sin simulacro nuevo. Nada de contenido nuevo el último día. |
| — | 30/9 | Examen | — |

## Resultado por dominio

| Dominio                                       | Correcto | Preguntas |
| ---------------------------------------------- | -------: | --------: |
| Fundamentos de IA y ML                         |      58% |        19 |
| Aplicaciones de los modelos fundacionales      |      84% |        19 |
| **Directrices para una IA Responsable**  | **33%** |     **6** |
| Fundamentos de IA Generativa                   |      82% |        11 |
| Seguridad, normativa y gobernanza              |      70% |        10 |

Comparado con simulacro 1: Aplicaciones de FM y GenAI ya aprueban cómodo.
IA Responsable sigue siendo el dominio más débil en ambos intentos —
segunda vez consecutiva por debajo de 35%. Prioridad número uno.

## Índice de servicios y conceptos (búsqueda rápida)

- **Amazon Rekognition (Custom Labels)** → #1.2
- **Amazon Textract** → #1.3, #4.2
- **Amazon Comprehend** → #1.3, #2.3, #3.2 (patrón recurrente, usado de comodín)
- **Regresión lineal vs densidad de probabilidad** → #1.4
- **Inferencia tiempo real vs batch** → #1.5
- **ROUGE-N / Cross-Entropy Loss** → #1.6, #4.1
- **SageMaker Ground Truth (RLHF)** → #1.7
- **Underfitting vs overfitting** → #2.1
- **AWS AI Service Cards** → #2.2
- **Bedrock Guardrails vs Agents** → #2.3
- **Amazon Inspector vs CloudTrail** → #2.4, #3.1
- **Bedrock Model Evaluation vs Comprehend** → #2.5
- **SageMaker Clarify vs Model Cards vs Autopilot** → #2.6, #3.2
- **AWS Artifact** → #3.1
- **Búsqueda vectorial: OpenSearch/DocumentDB/Neptune ML** → #4.3
- **Embeddings vs tokenización** → #5.1
- **Fine-tuning: domain adaptation vs instruction-based** → #5.2

## Métricas y patrones ya cubiertos en simulacro 1 (repetidos aquí)

MAE/MAPE para regresión, ROUGE para resumen, Comprehend vs Rekognition,
CloudTrail vs Inspector — ver detalle extendido en
[repaso-simulacro-aif-c01-2026-09-03.md](repaso-simulacro-aif-c01-2026-09-03.md).
Acá solo la variante nueva de cada error.

---

## 1. Fundamentos de IA y ML (7 errores, 58%)

### 1.1 Métricas por tipo de tarea — regresión (Q5)

Predecir ingresos mensuales (valor continuo) → **MAPE, MAE**, no
Accuracy/F1 (clasificación). Mismo mapa métrica↔tarea del simulacro 1,
sección #3. *Clase Udemy: "Regresión" (8:08), "[PARTE-2] Evaluación de
modelos: AUC-ROC y métricas".*

### 1.2 Rekognition Custom Labels — 2 pasos, no 1 (Q40)

Clasificar categorías nuevas de producto desde imágenes históricas
requiere **etiquetar + crear proyecto de entrenamiento en Rekognition**.
Marcar solo el etiquetado es incompleto — Rekognition necesita el paso de
entrenamiento explícito para categorías custom. *Clase Udemy: "Amazon
Rekognition" (3:37) + demo (6:59).*

### 1.3 Textract vs Comprehend — input imagen con manuscrito (Q43)

Input imagen/factura con escritura manuscrita → **Textract** (OCR+),
nunca Comprehend (solo analiza texto ya extraído). Regla ya vista en
simulacro 1 #2/#15: imagen como input descarta Comprehend siempre.
*Clase Udemy: "Amazon Textract" (2:05) + demo (5:09).*

### 1.4 Regresión lineal vs "densidad de probabilidad" (Q45)

Predecir valor futuro de portafolio (continuo, histórico) →
**regresión lineal** (aprendizaje supervisado estándar). "Densidad de
probabilidad" no es una técnica predictiva de este tipo — es una trampa
de vocabulario estadístico sin encaje aquí. *Clase Udemy: "Regresión"
(8:08).*

### 1.5 Tiempo real vs batch — repetido (Q55)

Caso con latencia baja + respuesta rápida → **inferencia en tiempo
real**, no batch (offline, horas/días). Mismo error que simulacro 1 #9.
Consolidar: si el enunciado dice "latencia baja" o "interactivo" en
cualquier forma → tiempo real, sin dudar. *Clase Udemy: revisar demos de
SageMaker endpoints en "Entrenamiento y evaluación de modelos" (5:14).*

### 1.6 ROUGE-N para resumen (Q56)

Métrica para evaluar resúmenes generados por FM → **ROUGE-N**, no
Precision (clasificación). Ver también #4.1 (Cross-Entropy Loss, mismo
patrón con otro distractor). *Clase Udemy: "Métricas de evaluación de
modelos" (8:32).*

### 1.7 SageMaker Ground Truth cubre RLHF, Rekognition Custom Labels no (Q63)

Etiquetar imágenes + **RLHF** para mejorar detección de vehículos →
**SageMaker Ground Truth** (human-in-the-loop completo). Rekognition
Custom Labels solo entrena con datos ya etiquetados, no gestiona feedback
humano iterativo. Mismo concepto que simulacro 1 #21. *Clase Udemy:
"Aprendizaje por refuerzo y RLHF" (2:37).*

---

## 2. Directrices para una IA Responsable (6 errores, 33% — dominio más débil)

### 2.1 Underfitting — mal en train y validación (Q20)

Mal desempeño en **ambos** conjuntos (train y validación) = alto sesgo =
**underfitting**, no "calidad de datos pobre". Regla fija (igual que
simulacro 1 #1): falla en todos lados → underfitting; falla solo afuera
(bien en train, mal en test) → overfitting. *Clase Udemy: "[PARTE-1]
Evaluación de modelos: Matriz de confusión" (7:19), "Evaluaciones del
modelo" (5:49).*

### 2.2 AWS AI Service Cards — recurso de ética, no Polly (Q23)

Recurso sobre uso ético/responsable de IA generativa → **AWS AI Service
Cards** (documentación pública de transparencia), no Polly (servicio
funcional de texto-a-voz, no tiene nada que ver). *Clase Udemy: revisar
"Responsabilidad en IA" (7:54) y "Cumplimiento en IA" (2:53) — no hay
clase dedicada a AI Service Cards por nombre en el temario, cubrir con
doc oficial AWS.*

### 2.3 Guardrails vs Bedrock Agents (Q33)

Asegurar precisión y cumplimiento normativo del contenido de un chatbot
financiero → **Guardrails for Amazon Bedrock** (impone límites/reglas
sobre contenido generado), no Agents (orquesta acciones/integraciones,
no filtra contenido). *Clase Udemy: "Barreras de protección
(GuardRails)" (1:17) + demo (8:37) + "[Eduardo Ordax] Buen uso de
barreras de protección" (3:55).*

### 2.4 Inspector vs CloudTrail — vulnerabilidades técnicas (Q37)

Evaluar postura de seguridad (vulnerabilidades) en EC2 y repos ECR →
**Amazon Inspector** (escanea vulnerabilidades de software), no
CloudTrail (audita actividad de API, no escanea nada). Repetido en #3.1
con AWS Artifact como tercer distractor. *No hay clase dedicada a
Inspector en el temario Udemy — cubrir con "Seguridad en IA" (3:12) y
doc oficial AWS.*

### 2.5 Bedrock Model Evaluation, no Comprehend (Q61)

Chatbot que predice sentimiento de reseñas + elimina info sensible (2
servicios): Guardrails correcto, pero falta **Bedrock Model Evaluation**
(compara y selecciona el FM más apto por métricas), no Comprehend (NLP
genérico, no resuelve ninguno de los dos requisitos). Mismo patrón que
simulacro 1 #17. *Clase Udemy: "Evaluación de modelos en Amazon
Bedrock" (7:48) + demo (5:48).*

### 2.6 SageMaker Clarify, no Autopilot, para explicabilidad (Q9)

Documentación + explicabilidad para auditorías (2 servicios): Model
Cards correcto, pero falta **SageMaker Clarify** (detecta sesgo, explica
predicciones), no Autopilot (solo automatiza entrenamiento, AutoML puro).
Mismo combo que simulacro 1 #8. *Clase Udemy: "Model Cards y Model
Dashboard" (4:13) — revisar si Clarify tiene mención específica, si no
reforzar con doc oficial AWS.*

---

## 3. Seguridad, normativa y gobernanza (2 errores, 70%)

### 3.1 AWS Artifact — compliance del proveedor, no Inspector (Q19)

Revisar cumplimiento normativo de AWS (HIPAA, GDPR) en biotecnología →
**AWS Artifact** (portal de documentos de compliance), no Inspector
(escaneo técnico de vulnerabilidades de tu carga de trabajo). Mismo
concepto que simulacro 1 #24 — no confundir "compliance del proveedor"
con "seguridad de tus recursos". *Clase Udemy: "Cumplimiento en IA"
(2:53), "Gobernanza en IA" (6:40).*

### 3.2 Clarify para equidad, no Comprehend (Q32)

Asegurar equidad y transparencia en modelo de detección de spam →
**Amazon SageMaker Clarify** (sesgo/equidad/explicabilidad), no
Comprehend (NLP genérico, no mide sesgo). Mismo patrón que #2.6 y #1.3 —
Comprehend usado como comodín equivocado 3 veces en este simulacro.
*Clase Udemy: "Model Cards y Model Dashboard" (4:13).*

---

## 4. Aplicaciones de los modelos fundacionales (3 errores, 84%)

### 4.1 ROUGE, no Cross-Entropy Loss, para evaluar resúmenes (Q2)

Métrica para evaluar resúmenes generados vs referencias humanas →
**ROUGE**. Cross-Entropy Loss se usa durante el *entrenamiento*, no para
evaluar calidad de output ya generado — no confundir métrica de
entrenamiento con métrica de evaluación de salida. *Clase Udemy:
"Métricas de evaluación de modelos" (8:32).*

### 4.2 Textract + Polly — pipeline completo, no solo Textract (Q24)

App texto-a-voz para discapacidad visual (2 servicios): Textract
correcto, pero falta **Polly** (texto → voz). Pipeline típico OCR→TTS en
AWS: Textract extrae texto de imagen, Polly lo convierte a voz. *Clase
Udemy: "Amazon Textract" (2:05) + "Amazon Polly" (1:13) + demos
respectivas.*

### 4.3 Vector search: OpenSearch + Neptune ML + DocumentDB, no S3 (Q38)

Búsqueda por vectores para sistema de recomendación (3 servicios):
elegido de más *Amazon S3* (solo almacenamiento, no indexa nada). Falta
**Amazon DocumentDB** (con soporte vectorial). Correctos: OpenSearch
Service, Neptune ML, DocumentDB. Mismo mapa que simulacro 1 #10/#18b.
*No hay clase Udemy dedicada a vector search — cubrir con doc oficial
AWS (OpenSearch k-NN, DocumentDB vector search, Neptune ML).*

---

## 5. Fundamentos de IA Generativa (2 errores, 82%)

### 5.1 Embeddings = vectores semánticos, no tokenización (Q4)

Por qué importan los embeddings en un LLM que resume texto → **convierten
texto en vectores numéricos que representan significado semántico**, no
"dividen el texto en unidades más pequeñas" (eso es tokenización). Son
pasos distintos del pipeline: primero tokenizar, después generar
embeddings. *Clase Udemy: "Introducción a Transformers" (2:24), buscar
si hay clase específica de embeddings — reforzar con "Conceptos de
GenAI" (9:02).*

### 5.2 Instruction-based fine-tuning, no domain adaptation (Q16)

Ajustar FM para asesoría de viajes con conversaciones multi-turno y
recomendaciones personalizadas → **instruction-based fine-tuning**
(enseña a seguir instrucciones/tareas complejas como diálogo y
personalización), no domain adaptation (especializa en
dominio/vocabulario, no en seguir instrucciones). *Clase Udemy:
"Personalización de modelos" (10:43) + demo (4:08).*

---

## Patrones recurrentes a repasar con prioridad (este simulacro)

1. **Comprehend como comodín equivocado** — falló 3 veces (#1.3, #2.6,
   #3.2). Comprehend = NLP genérico sobre texto ya extraído (sentimiento,
   entidades). Nunca cubre: extracción de imagen (→ Textract), sesgo/
   equidad (→ Clarify), selección de mejor modelo (→ Model Evaluation).
2. **IA Responsable sigue siendo el dominio más débil** (33%, igual que
   simulacro 1). Concentrar repaso en: Guardrails vs Agents vs Model
   Evaluation, Clarify vs Model Cards vs Autopilot, AI Service Cards.
3. **Combos de "2 o 3 servicios"** (Q9, Q24, Q38, Q61) — el error casi
   siempre es marcar solo una parte correcta y olvidar el complemento.
   Leer bien cuántos servicios pide el enunciado antes de confirmar.
4. **Underfitting/overfitting** — tercera vez apareciendo entre los dos
   simulacros. Candidato a flashcard diaria hasta automatizar.

## Heurísticas anti-trampa (repaso rápido, específicas de este simulacro)

- Enunciado pide **"documentación + explicabilidad"** → Model Cards
  (documenta) + Clarify (explica sesgo), nunca Autopilot (solo AutoML).
- Enunciado pide **"contenido preciso y conforme a normativa"** en un
  chatbot → Guardrails (filtra contenido), no Agents (orquesta acciones).
- Enunciado pide **"elegir el mejor FM"** por métricas → Bedrock Model
  Evaluation, no Comprehend ni Guardrails.
- Enunciado dice **"compliance de AWS como proveedor"** (HIPAA, GDPR,
  SOC) → AWS Artifact. Si dice **"vulnerabilidades en mis recursos"**
  (EC2, ECR) → Amazon Inspector.
- Enunciado combina **imagen → texto → voz** → siempre Textract +
  Polly, nunca Comprehend en el medio.
- Enunciado pide **fine-tuning para diálogo/personalización compleja**
  → instruction-based. Si pide **especializar vocabulario/dominio**
  (legal, médico) sin mencionar diálogo → domain adaptation.
- Métrica para **resumen de texto generado** → ROUGE-N (default de
  catálogo AWS), nunca Cross-Entropy Loss (eso es entrenamiento) ni
  Precision/F1 (clasificación).

## Plan de repaso sugerido

1. Repasar sección "Pilares fundamentales en el desarrollo de IA" +
   "Responsabilidad en IA" + "Gobernanza en IA" del temario Udemy —
   dominio más débil en ambos simulacros.
2. Flashcards: Comprehend vs Textract vs Rekognition vs Clarify vs
   Guardrails vs Model Evaluation vs Autopilot vs Model Cards (8 nombres
   que se confunden entre sí, mapear cada uno a su única función).
3. Repetir underfitting/overfitting hasta poder responderlo sin dudar
   (tercera vez fallando variantes de esto entre los dos simulacros).
4. Repasar embeddings vs tokenización vs fine-tuning (domain adaptation
   vs instruction-based) — sección "Conceptos de GenAI" (9:02) y
   "Personalización de modelos" (10:43).
