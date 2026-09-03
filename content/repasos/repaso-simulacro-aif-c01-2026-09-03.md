# Repaso simulacro AIF-C01 — 3 de septiembre de 2026

Fecha del simulacro: 3 de septiembre de 2026. 12 de 21 preguntas marcadas
incorrectas. Este archivo junta los patrones de error y qué repasar antes del
próximo intento.

## Índice de servicios y conceptos

Buscar rápido dónde aparece cada uno (número = sección de "Patrones de error").

- **Accuracy / Precision / Recall** → #3, #19
- **AWS AI Service Cards** → #14
- **AWS Artifact** → #24
- **AWS CloudTrail** → #2, #11, #24
- **Amazon CloudWatch** → #2
- **Amazon Comprehend** → #2, #15
- **AWS PrivateLink / VPC Endpoint** → #18, #22
- **Amazon Rekognition (Custom Labels)** → #2, #21
- **Amazon Textract** → #15
- **Amazon Polly** → #15
- **Amazon Inspector** → #24
- **Amazon SageMaker Clarify** → #8
- **Amazon SageMaker Model Cards** → #8, #11
- **Amazon SageMaker Model Monitor** → #11
- **Amazon SageMaker Ground Truth (Plus)** → #8, #21
- **Amazon SageMaker Autopilot** → #8
- **Amazon SageMaker JumpStart** → #16
- **Amazon Bedrock (Guardrails / Model Evaluation)** → #17
- **Amazon OpenSearch Service / DocumentDB / Neptune ML / DynamoDB (vectores)** → #10, #18b
- **BERTScore / ROUGE / METEOR** → #3, #12
- **MAE / MAPE / MSE / RMSE** → #3
- **Bias / Variance / Overfitting / Underfitting** → #1, #25
- **GAN / RNN / CNN** → #6
- **Modelo fundacional (FM), definición** → #7
- **Context Window** → #13
- **Few-shot / Zero-shot / Fine-tuning (jerarquía de esfuerzo)** → #4
- **Chain-of-thought / Tree-of-thought** → #20
- **Desafíos de GenAI (alucinaciones, toxicidad, PI, corte de conocimiento)** → #5, #23
- **Tipos de inferencia SageMaker (real-time/async/batch/serverless)** → #9

## Fallos por servicio/concepto (para priorizar repaso)

| Veces fallado | Servicio o concepto                                 | Secciones |
| ------------: | --------------------------------------------------- | --------- |
|             3 | Overfitting vs underfitting (bias/variance)         | #1, #25   |
|             2 | Amazon Comprehend usado donde no corresponde        | #2, #15   |
|             2 | Bases de datos vectoriales (cuál sirve)            | #10, #18b |
|             2 | VPC Endpoint vs PrivateLink                         | #18, #22  |
|             2 | Métricas de evaluación de texto (BERTScore/ROUGE) | #3, #12   |
|             1 | CloudWatch vs CloudTrail                            | #2        |
|             1 | CloudTrail vs Model Cards                           | #11       |
|             1 | AWS Artifact vs Inspector                           | #24       |
|             1 | Bedrock Guardrails vs Model Evaluation              | #17       |
|             1 | SageMaker Clarify + Model Cards (combo)             | #8        |
|             1 | SageMaker JumpStart (modelos open-source)           | #16       |
|             1 | Ground Truth + RLHF                                 | #21       |
|             1 | Chain-of-thought vs Tree-of-thought                 | #20       |
|             1 | Context Window                                      | #13       |
|             1 | Definición de modelo fundacional                   | #7        |
|             1 | GAN vs RNN vs CNN                                   | #6        |
|             1 | Desafíos específicos de GenAI                     | #5, #23   |
|             1 | Few-shot vs fine-tuning (esfuerzo)                  | #4        |
|             1 | Accuracy por defecto en clasificación balanceada   | #19       |

Top 3 a machacar antes de lo demás: **overfitting/underfitting**,
**Comprehend mal aplicado**, **bases vectoriales**.

## Heurísticas anti-trampa (repaso rápido antes del examen)

- Input es **imagen** → Comprehend queda descartado siempre (NLP es solo
  texto). Ver #2, #15.
- Pregunta pide **"documentar modelo"** → Model Cards, no CloudTrail
  (CloudTrail es solo llamadas API). Ver #11.
- Pregunta pide **"auditar llamadas API"** → CloudTrail, no CloudWatch
  (CloudWatch es métricas/logs operativos). Ver #2.
- Pregunta pide **"documentación de compliance de AWS"** (no de tu modelo)
  → AWS Artifact, no Inspector. Ver #24.
- Pregunta menciona **"menor esfuerzo operativo"** → descartar fine-tuning
  y entrenamiento continuo; preferir few-shot/RAG. Ver #4.
- Selección múltiple de **"desafíos de GenAI"** → descartar privacidad,
  seguridad, recursos computacionales, bajo recall, detección de fraude
  (son de ML clásico, no específicos de GenAI). Ver #5, #23.
- Pregunta menciona **embeddings + búsqueda/recuperación** → pensar
  OpenSearch/DocumentDB/Neptune ML/Aurora-RDS(pgvector)/MemoryDB.
  Descartar DynamoDB, ElastiCache simple, S3, Redshift, QuickSight,
  Lake Formation salvo que digan soporte vectorial explícito. Ver #10, #18b.
- Pregunta dice **"sin salir de la red AWS"** y el servicio es **S3 o
  DynamoDB** → VPC Gateway Endpoint. Si es **otro servicio** (Bedrock,
  etc.) → AWS PrivateLink / Interface Endpoint. Ver #18, #22.
- Enunciado dice **"dominio limitado (finanzas, medicina)"** sonando a
  modelo fundacional → es la trampa, un FM es justo lo opuesto
  (propósito general). Ver #7.
- "Bien en train, mal en test" → overfitting (alta varianza). "Mal en
  train y test" → underfitting (alto sesgo). Nunca al revés. Ver #1, #25.

## Quiz de autoevaluación (repaso activo, sin mirar las respuestas)

Responder de memoria antes de repasar las secciones — si dudás, ahí está
el hueco real.

1. Modelo funciona bien en train, mal en test. ¿Sesgo/varianza y nombre?
2. ¿Qué servicio audita llamadas API con usuario/hora/origen?
3. ¿Qué servicio documenta datos de entrenamiento y métricas de un modelo
   propio para auditoría?
4. Input es una imagen con texto manuscrito. ¿Primer servicio del pipeline?
5. ¿Qué métrica generalmente se usa por defecto para clasificación de
   imágenes balanceada, sin señales de asimetría en el enunciado?
6. ¿Qué métrica mide similitud semántica de texto vía embeddings, distinta
   de ROUGE/METEOR?
7. Necesito adaptar el estilo/formato de salida de un LLM con mínimo
   esfuerzo. ¿Qué técnica?
8. Nombrá 4 desafíos específicos de IA generativa (no genéricos de ML).
9. ¿Qué arquitectura genera datos sintéticos vía generador/discriminador?
10. Definí "modelo fundacional" en una frase, sin usar "dominio limitado".
11. ¿Cuáles 2 features de SageMaker cubren documentación + explicabilidad
    juntas?
12. ¿Qué tipo de inferencia SageMaker es la de menor latencia?
13. ¿3 servicios de AWS que soportan búsqueda por vectores/embeddings?
14. Necesito conectividad privada entre VPC y Bedrock sin pasar por
    internet. ¿Qué servicio/feature?
15. ¿Diferencia en una frase entre AWS Artifact y Amazon Inspector?
16. ¿Diferencia en una frase entre Chain-of-thought y Tree-of-thought?
17. ¿Qué feature de SageMaker se usa específicamente para RLHF con
    anotación humana?
18. ¿Qué es el "Context Window" de un LLM?
19. Institución quiere modelos open-source que despliega y gestiona ella
    misma. ¿Qué servicio de AWS?
20. ¿Diferencia entre Bedrock Guardrails y Bedrock Model Evaluation?

## Resultado por dominio (examen completo, 65 preguntas)

| Dominio                                                    | Peso examen real |      Correcto | Incorrecto/omitido |
| ---------------------------------------------------------- | ---------------: | ------------: | -----------------: |
| Fundamentos de IA y ML (19 preg.)                          |              20% |           37% |                63% |
| Fundamentos de IA Generativa (11 preg.)                    |              24% |           45% |                55% |
| **Aplicaciones de modelos fundacionales (19 preg.)** |              28% | **74%** |                26% |
| IA responsable (6 preg.)                                   |              14% |           33% |                67% |
| Seguridad, normativa y gobernanza (10 preg.)               |              10% |           40% |                60% |

Lectura: único dominio que aprueba es Aplicaciones de modelos fundacionales.
Los otros cuatro están por debajo de 45% de aciertos. Fundamentos de IA y ML
(20% del examen) y Fundamentos de IA Generativa (24% del examen) juntos son
44% del peso real y están reprobando fuerte — prioridad número uno de
repaso, por encima de los detalles ya cubiertos abajo (que salen del primer
simulacro de 21 preguntas).

IA responsable pesa solo 14% pero 67% de error ahí es la peor proporción —
señal de que faltan conceptos base (no es tema de detalle fino, es tema no
estudiado todavía).

### Prioridad de estudio ajustada

1. **Fundamentos de IA y ML** — bias/variance, tipos de aprendizaje
   (supervisado/no supervisado/refuerzo), métricas por tarea, algoritmos
   básicos (regresión, clustering, forecasting), overfitting/underfitting.
2. **Fundamentos de IA Generativa** — qué es un FM, arquitectura
   transformer, embeddings, tokens, prompt engineering básico, casos de uso
   GenAI vs ML tradicional.
3. **IA responsable** — principios (equidad, explicabilidad, robustez,
   privacidad, transparencia, gobernanza), sesgo en datos/modelos, human-in-
   the-loop, herramientas SageMaker Clarify/Model Cards.
4. **Seguridad, normativa y gobernanza** — CloudTrail vs CloudWatch, IAM
   para Bedrock, encriptación, compliance frameworks, AWS AI Service Cards.
5. Aplicaciones de modelos fundacionales — ya aprueba, solo repasar detalles
   sueltos (sección de patrones de error abajo).

## Patrones de error (lo importante)

### 1. Overfitting vs underfitting — confundido dos veces (P4, P19)

Es el error más repetido. Regla fija para no dudar más:

| Síntoma                                    | Sesgo | Varianza | Nombre                                                            |
| ------------------------------------------- | ----- | -------- | ----------------------------------------------------------------- |
| Mal en train**y** en test/validación | Alto  | Baja     | **Underfitting** (modelo muy simple, no aprendió patrones) |
| Bien en train, mal en test                  | Bajo  | Alta     | **Overfitting** (memorizó ruido del train, no generaliza)  |
| Bien en ambos                               | Bajo  | Baja     | Ideal                                                             |

Truco mental: "falla en **todos lados**" = underfitting (alto sesgo). "Falla
**solo afuera**" = overfitting (alta varianza). Nunca asociar "mal
rendimiento general" directo con overfitting sin chequear si también falla en
train.


### 2. Servicios AWS confundidos por nombre/dominio parecido, no por función

- **CloudWatch vs CloudTrail** (P20): CloudWatch = métricas/logs de
  rendimiento y monitoreo operativo. **CloudTrail = auditoría de llamadas API**
  (quién, qué, cuándo, desde dónde). Pregunta de auditoría/compliance → casi
  siempre CloudTrail, no CloudWatch.
- **Amazon Comprehend vs Amazon Rekognition** (P14): Comprehend = NLP sobre
  **texto**. Rekognition = análisis de **imágenes/video**. Si el input es
  imagen, Comprehend queda descartado de entrada, sin importar que diga
  "modelo personalizado".
- Regla general: identificar primero el **tipo de dato de entrada/salida**
  (texto, imagen, audio, tabular) antes de mirar el nombre del servicio.
  Reduce a la mitad las opciones.

### 3. Métricas de evaluación — no tener el mapa métrica↔tarea memorizado

- **P7**: BERTScore (similitud semántica de texto vía embeddings) vs METEOR
  (precision/recall superficial). Para "qué tan parecido en significado" →
  BERTScore. METEOR/ROUGE son más superficiales (n-gramas).
- **P8**: regresión/forecast (predecir ingresos, valores continuos) → **MAE,
  MAPE, RMSE**. Nunca Accuracy/F1 (esas son de clasificación).

Tabla rápida para memorizar:

| Tipo de tarea                                 | Métricas típicas                                      |
| --------------------------------------------- | ------------------------------------------------------- |
| Clasificación                                | Accuracy, F1, Precision, Recall                         |
| Regresión / forecasting                      | MAE, MAPE, RMSE, MSE                                    |
| Generación de texto (similitud a referencia) | BERTScore (semántico), ROUGE/METEOR/BLEU (superficial) |
| Modelos fundacionales / LLM eval              | SageMaker Clarify, benchmarks de toxicidad/sesgo        |

### 4. Técnicas de GenAI — no distinguir esfuerzo/costo de cada una

**P11**: para adaptar estilo/formato de salida con **mínimo esfuerzo** →
**few-shot prompting**, no fine-tuning. Jerarquía de esfuerzo (menor a mayor):

1. Zero-shot prompting
2. Few-shot prompting (dar ejemplos en el prompt)
3. Prompt engineering avanzado / RAG (conecta a datos externos sin reentrenar)
4. Fine-tuning (reentrena el modelo, costoso)
5. Entrenar modelo desde cero (rarísimo, carísimo)

Si la pregunta dice "menor esfuerzo operativo" o "sin reentrenar", descartar
fine-tuning y entrenamiento continuo directo.

### 5. Desafíos específicos de IA generativa (P12)

Selección múltiple, ojo con **privacidad y seguridad** — parece correcta pero
es un problema genérico de TODO sistema de IA, no específico de GenAI. Los
desafíos *distintivos* de GenAI:

- **Alucinaciones** (inventa datos con seguridad)
- **Toxicidad** (contenido ofensivo/inapropiado)
- **Propiedad intelectual** (reproduce contenido protegido de datos de
  entrenamiento)
- Plagio, sesgo amplificado, falta de explicabilidad de la salida

Privacidad/seguridad y recursos computacionales son transversales a todo ML,
no exclusivos de GenAI — señal de alerta para descartar en preguntas "selecciona
los que son específicos de GenAI".

### 6. GAN vs RNN vs CNN (P13)

Mapa rápido arquitectura → propósito:

| Arquitectura  | Para qué sirve                                                             |
| ------------- | --------------------------------------------------------------------------- |
| **GAN** | Generar datos sintéticos nuevos (generador vs discriminador compitiendo)   |
| **RNN** | Datos secuenciales/temporales (series de tiempo, texto secuencial)          |
| **CNN** | Extraer features espaciales de imágenes (clasificación, detección)       |
| Transformer   | Base de LLMs modernos, atención, no está en esta tabla pero repasar igual |

"Genera datos artificiales aprendiendo de ejemplos" es la definición textual
de GAN — no confundir con RNN solo porque "aprende de patrones".

### 7. Definición de "modelo fundacional" (P21)

Un FM es **grande, propósito general, preentrenado en datos diversos, y
ajustable (fine-tuneable) para tareas específicas**. No es:

- Un modelo específico de un dominio limitado (eso sería lo opuesto: modelo
  especializado, no fundacional)
- Un marco teórico
- Una arquitectura base para diseñar otras redes

Ojo con la trampa de "entrenado en dominio limitado como finanzas o
medicina" — suena a especialización correcta pero es justo lo contrario del
concepto de FM (que es generalista por definición).

### 8. SageMaker — features específicas para compliance/explicabilidad (P5)

Pregunta de selección múltiple, elegiste solo Clarify pero faltaba
**Model Cards** también. Repasar el combo:

- **SageMaker Clarify**: detecta **sesgo** en datos/modelo + genera
  explicabilidad de predicciones (por qué el modelo decidió X).
- **SageMaker Model Cards**: **documentación estructurada** del modelo
  (propósito, datos de entrenamiento, métricas, consideraciones éticas) — para
  auditorías y transparencia regulatoria.
- Cuando la pregunta pide "documentación **y** explicabilidad" juntas, casi
  siempre son ambas herramientas combinadas, no una sola.
- Ground Truth Plus = solo etiquetado de datos (no documentación ni
  explicabilidad). Autopilot = AutoML (no documentación ni explicabilidad).

### 9. Tipos de inferencia SageMaker (P15, ya venías bien en P10)

Reafirmar tabla (esta ya la tenés bastante clara, solo un fallo):

| Tipo                    | Latencia              | Uso                                                     |
| ----------------------- | --------------------- | ------------------------------------------------------- |
| Tiempo real (Real-time) | Milisegundos          | Apps interactivas, recomendaciones en vivo              |
| Asíncrona              | Segundos-minutos      | Payloads grandes, no necesita respuesta inmediata       |
| Batch Transform         | Horas                 | Procesar dataset completo offline                       |
| Serverless              | Variable (cold start) | Tráfico intermitente/impredecible, sin gestionar infra |

### 10. Bases de datos vectoriales en AWS (P23)

Selección múltiple, fallaste combo. Servicios que soportan búsqueda por
vectores (k-NN / similitud semántica):

- **Amazon OpenSearch Service** — búsqueda k-NN, uso más común para RAG.
- **Amazon Neptune ML** — grafos + GNN, bueno cuando hay relaciones tipo
  grafo entre entidades.
- **Amazon DocumentDB (compat. MongoDB)** — sí soporta vector search
  (contraintuitivo si pensás en DocumentDB como solo documentos JSON).
- También válidos fuera de esta pregunta: Amazon Aurora (pgvector),
  Amazon RDS for PostgreSQL (pgvector), Amazon MemoryDB.

Descartar siempre: S3 (solo almacenamiento, no indexa), Redshift (analítica
SQL, no vectores), QuickSight (solo visualización).

### 11. CloudTrail vs SageMaker Model Cards — auditoría de API ≠ documentación de modelo (P25 ok, P26 falló)

Refuerza error #2 pero con matiz nuevo:

- **"Auditar llamadas API"** (quién llamó qué endpoint, cuándo) → CloudTrail.
- **"Documentar detalles de entrenamiento y rendimiento del modelo"** (para
  auditoría de cumplimiento del modelo en sí, no de las llamadas) → **SageMaker
  Model Cards**.
- CloudTrail nunca documenta contenido del modelo (datos de entrenamiento,
  métricas). Es solo log de actividad API. Model Monitor tampoco documenta
  histórico de entrenamiento — solo detecta drift en producción.

### 12. Métrica de evaluación de texto generado — ROUGE vs BERTScore, contexto importa (P28)

Ya se vio BERTScore en error #3, pero acá la respuesta correcta fue **ROUGE**
— parece contradictorio pero depende del enunciado exacto:

- Si la pregunta pide medir **similitud semántica/significado** (como
  respuestas de chatbot vs experto) → BERTScore.
- Si la pregunta pide medir **calidad de generación de texto / resúmenes**
  en términos más generales, sin mencionar "significado" o "coherencia
  semántica" explícitamente, y ROUGE está en las opciones sin BERTScore
  competir → ROUGE es la respuesta "de catálogo AWS" esperada para
  resumen/traducción.
- Regla práctica: si BERTScore está entre las opciones, preferirlo para
  "similitud de significado". Si no está, ROUGE es el default para
  evaluación de texto generado en general.

### 13. Context Window — concepto de LLM, no de arquitectura (P29)

**Context Window** = cantidad de tokens que el modelo puede procesar en una
sola interacción (entrada + salida combinadas, límite duro del modelo).

- No confundir con **arquitectura del modelo** (define capacidad general,
  no el límite de tokens por request).
- No confundir con **temperatura** (controla aleatoriedad/creatividad, no
  volumen de datos).
- Pregunta típica: "límite de cuánto texto/datos puede meterse en un solo
  prompt" → siempre Context Window.

### 14. AWS AI Service Cards — recurso de ética/transparencia, no servicio técnico (P30)

**AWS AI Service Cards** = documentación pública sobre uso responsable,
limitaciones y consideraciones éticas de cada servicio de IA de AWS. Es
recurso de **lectura/referencia**, no un servicio que se despliega.

- Distinto de SageMaker Model Cards (esas documentan TU modelo custom).
- AI Service Cards documentan los servicios de AWS ya existentes (Rekognition,
  Transcribe, etc.), publicadas por AWS mismo.
- Si la pregunta es "dónde entender las implicaciones éticas de un servicio
  de AWS" → AI Service Cards. Nunca Comprehend/Polly/Marketplace (son
  servicios funcionales, no documentación ética).

### 15. Imagen a voz — combo de dos servicios de una sola modalidad cada uno (P31)

Falló por elegir Comprehend en vez de Textract. Pipeline correcto imagen →
texto → voz:

1. **Textract**: imagen/documento → texto (OCR, incluye manuscrito).
2. **Polly**: texto → voz.

Comprehend NO extrae texto de imágenes — solo analiza texto que ya existe
como texto (entidades, sentimiento, idioma). Si el input crudo es una
**imagen**, Comprehend queda descartado siempre (mismo patrón que error #2).

### 16. Institución financiera + modelo open-source preentrenado (P34)

Cuando la pregunta pide específicamente **modelos de código abierto /
preentrenados que se puedan desplegar y gestionar vos mismo** →
**SageMaker JumpStart** (no Bedrock, no Q Business, no Kendra).

- Bedrock = modelos de terceros vía API gestionada, no todos open-source, no
  los "traés" vos.
- JumpStart = catálogo de modelos preentrenados (muchos open-source) que se
  despliegan en tu propio endpoint SageMaker — control total, vos gestionás
  el hosting.
- Señal en el enunciado: "modelo de código abierto" + "implementar" (no
  "consumir vía API") apunta a JumpStart.

### 17. Bedrock Guardrails vs Model Evaluation — piezas distintas del mismo pipeline (P35)

Selección múltiple, faltó Model Evaluation:

- **Bedrock Guardrails**: filtra contenido dañino/sensible ANTES de que
  llegue al modelo o en la respuesta (privacidad, seguridad, PII).
- **Bedrock Model Evaluation**: compara modelos por métricas (precisión,
  robustez, toxicidad) para elegir el mejor modelo para la tarea.
- Cuando la pregunta combina "elegir mejor modelo para predecir sentimiento"
  y "eliminar información sensible" → siempre las dos herramientas juntas,
  no una sola.
- Comprehend/Ground Truth/Lex no cumplen ninguna de las dos funciones acá.

### 18. Transferencia privada S3 → SageMaker sin salir de la red AWS (P36)

**VPC Gateway Endpoint** conecta VPC a S3 sin pasar por internet público.

- S3 Transfer Acceleration: usa red de bordes de CloudFront — sí puede
  atravesar internet público, no cumple requisito de conformidad.
- S3 Access Point: control de acceso granular, no garantiza tráfico privado.
- CloudFront: CDN pública, lo opuesto a mantener tráfico interno.
- Regla: "no debe salir de la red AWS" / "tráfico privado sin internet" →
  VPC Endpoint (Gateway para S3/DynamoDB, Interface para la mayoría de otros
  servicios).

### 18b. DocumentDB + OpenSearch para embeddings de recomendación en tiempo real (P22)

Selección múltiple, fallaste con DynamoDB en vez de DocumentDB. Refuerza
error #10 (bases vectoriales) con caso nuevo: sistema de recomendación con
embeddings de productos/usuarios y consultas en tiempo real.

- **Amazon OpenSearch Service**: búsqueda k-NN sobre vectores — encaja
  siempre que se hable de "recuperar productos similares por embeddings".
- **Amazon DocumentDB (compat. MongoDB)**: también soporta vector search,
  útil cuando además hay que guardar documentos estructurados (atributos de
  producto) junto a los vectores.
- **DynamoDB**: NoSQL rápido para key-value, pero **no tiene búsqueda de
  similitud vectorial nativa** — trampa común porque parece "base de datos
  moderna de AWS", pero no cumple el requisito específico de vectores.
- ElastiCache: cache en memoria, tampoco busca por similitud vectorial.
- Lake Formation: gestión de data lake, no motor de consultas en tiempo real.
- Regla: cuando la pregunta dice "embeddings" + "búsqueda/recuperación" →
  pensar primero en OpenSearch, DocumentDB, Neptune ML, Aurora/RDS
  (pgvector), MemoryDB. Descartar DynamoDB, ElastiCache "simple", S3,
  Redshift, QuickSight, Lake Formation salvo que la pregunta aclare soporte
  vectorial explícito.

### 19. Accuracy sigue siendo default para clasificación de imágenes balanceada (P47)

Fallaste eligiendo Precision. Regla: si la pregunta NO menciona desbalance de
clases, costo asimétrico de error, ni fraude/detección de casos raros →
**Accuracy** es la métrica general por defecto para clasificación.

- Precision/Recall se usan cuando el enunciado dice explícito "falsos
  positivos son costosos" (Precision) o "no podemos perder casos positivos"
  (Recall, ej. detección de cáncer, fraude).
- Sin esa señal explícita de asimetría → Accuracy gana. No sobre-pensar la
  pregunta buscando trampa cuando no la hay.

### 20. Chain-of-thought — prompting técnica para razonamiento paso a paso (P52)

Fallaste con Tree-of-thought. Diferencia clave:

- **Chain-of-thought (CoT)**: pide al modelo mostrar el razonamiento **de
  forma lineal, secuencial** ("piensa paso a paso"). Es la técnica default
  para "explicaciones paso a paso" o mejorar razonamiento en problemas
  matemáticos/lógicos.
- **Tree-of-thought**: explora **múltiples ramas de razonamiento en
  paralelo** antes de converger — para problemas con varios caminos
  posibles a evaluar, no para explicar un concepto de forma lineal.
- Si el enunciado dice "explicación paso a paso" o "razonamiento secuencial"
  → CoT. Si dice "explorar múltiples enfoques/alternativas antes de decidir"
  → ToT.

### 21. Ground Truth soporta RLHF con anotación humana — no es solo "etiquetado simple" (P53)

Fallaste con Rekognition Custom Labels. **SageMaker Ground Truth** cubre todo
el espectro human-in-the-loop: etiquetado inicial, revisión de modelo,
personalización, y específicamente **RLHF** (Reinforcement Learning from
Human Feedback).

- Rekognition Custom Labels: solo entrena modelo de clasificación de imágenes
  con etiquetas ya dadas — no gestiona feedback humano iterativo ni RLHF.
- Si el enunciado menciona **RLHF** explícitamente → Ground Truth, sin dudar.

### 22. AWS PrivateLink vs VPC Endpoint — no son sinónimos exactos (P55)

Matiz nuevo sobre error #18: cuando la pregunta pide **conectividad privada
a servicios de AWS en general** (no solo S3/DynamoDB) y **cero conectividad
a internet** en ambas direcciones →  **AWS PrivateLink** es el nombre
correcto de la tecnología/marco.

- VPC Gateway Endpoint: solo cubre S3 y DynamoDB específicamente.
- AWS PrivateLink: es el mecanismo más amplio detrás de los VPC Interface
  Endpoints, cubre Bedrock y la mayoría de servicios de AWS + servicios de
  terceros.
- Pista: si el servicio mencionado NO es S3/DynamoDB (acá era Bedrock) →
  PrivateLink/Interface Endpoint, no Gateway Endpoint.

### 23. Desafíos de IA generativa — "corte de conocimiento" es concepto propio, no confundir con Recall (P56)

Nuevo desafío específico de GenAI no cubierto en error #5: **corte de
conocimiento (knowledge cutoff)** — el modelo no sabe nada después de su
fecha de entrenamiento, no tiene acceso a info en tiempo real (por eso existe
RAG, para solucionarlo).

- Lista ampliada de desafíos específicos de GenAI: alucinaciones, toxicidad,
  propiedad intelectual, **corte de conocimiento**.
- Bajo Recall y detección de fraude son conceptos de ML clásico
  (clasificación/anomalías), no debilidades de GenAI — mismo patrón trampa
  que error #5 (opciones de ML tradicional mezcladas como distractor).

### 24. AWS Artifact = portal de documentos de compliance, no herramienta de seguridad activa (P58)

Fallaste con Amazon Inspector. Diferencia:

- **AWS Artifact**: repositorio de **documentos** (certificaciones SOC,
  ISO, HIPAA, PCI DSS) que demuestran que AWS mismo cumple normativas. Es
  descarga de PDFs/reportes, no un servicio que escanea nada.
- **Amazon Inspector**: escanea vulnerabilidades EN TUS recursos (EC2, ECR).
  Es activo, técnico, no documentación.
- Pregunta tipo "revisar/descargar documentación de cumplimiento de AWS" →
  siempre Artifact. Pregunta tipo "detectar vulnerabilidades en mis
  instancias" → siempre Inspector.

### 25. Overfitting — tercera vez fallando el mismo patrón (P59)

Repetiste el error de #1 con otra redacción ("alta precisión en train, baja
en test" = mismo síntoma exacto que P4). Confirma que este concepto necesita
más repetición espaciada, no solo lectura una vez — considerar flashcard
diaria hasta automatizar la respuesta sin dudar.

## Conceptos que SÍ dominás (no repasar, reforzar solo de pasada)

- Amazon Transcribe custom vocabulary/language model para dominio específico
- Amazon Textract para extracción de formularios/documentos
- Amazon Bedrock pricing on-demand vs provisioned throughput vs batch
- Amazon Bedrock para GenAI sin gestionar infraestructura (vs SageMaker
  JumpStart que sí requiere gestionar el endpoint)
- Amazon Forecast / algoritmos de forecasting para series temporales
- RAG como técnica de menor esfuerzo para conectar LLM a conocimiento externo
- Capacidad de respuesta como atributo clave de chatbots en tiempo real
- Rekognition + etiquetado de imágenes para clasificación custom

## Plan de repaso sugerido

1. Re-leer sección bias/variance + overfitting/underfitting de la doc AWS
   (enlaces ya usados en las explicaciones del simulacro).
2. Hacer tabla propia de servicios AWS por **tipo de input/output** (texto,
   imagen, audio, tabular, multimodal) en vez de por nombre.
3. Memorizar tabla de métricas por tipo de tarea (arriba).
4. Repasar SageMaker Clarify vs Model Cards vs Ground Truth vs Autopilot —
   son 4 nombres que se confunden fácil, hacer flashcards.
5. Repetir simulacro en unos días enfocado en Fundamentos de IA y ML (20%) y
   Seguridad/gobernanza (14%), que fueron los dominios con más fallos.

### Sagemakers resumen con gráficos

[claude.ai/code/artifact/28d76d29-f684-4671-b3a3-1d61d7a392d8](https://claude.ai/code/artifact/28d76d29-f684-4671-b3a3-1d61d7a392d8)
