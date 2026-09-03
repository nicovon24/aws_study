# Estudio: servicios de IA compartidos entre CLF-C02 y AIF-C01

Fecha de verificación: 2 de septiembre de 2026.

## Conclusión ejecutiva

Estudiar primero los servicios de IA que se superponen entre **AWS Certified
Cloud Practitioner (CLF-C02)** y **AWS Certified AI Practitioner (AIF-C01)** es
una estrategia de muy buen rendimiento: hay **10 servicios de IA/ML incluidos
en las listas oficiales actuales de ambos exámenes**.

La diferencia está en la profundidad:

- En **CLF-C02** hay que reconocer el servicio correcto para un caso de uso y
  entender su valor como servicio administrado. IA/ML aparece dentro del
  Dominio 3, Tecnología y servicios, que pesa 34%, pero comparte ese dominio
  con cómputo, almacenamiento, bases de datos, redes y analítica.
- En **AIF-C01** no alcanza con reconocer nombres. Hay que entender la técnica
  de IA, la modalidad de entrada y salida, el ciclo de vida, las métricas, los
  riesgos, la seguridad y cuándo conviene ML tradicional o un modelo
  fundacional. Todo el examen está dedicado a IA.

Por lo tanto, el núcleo compartido sirve como base para los dos, pero **no
reemplaza** el estudio de GenAI, Amazon Bedrock, modelos fundacionales, RAG,
prompt engineering, agentes, IA responsable y gobierno requerido por AIF-C01.

## Peso y enfoque de cada examen

### CLF-C02

| Dominio | Peso |
|---|---:|
| Conceptos de la nube | 24% |
| Seguridad y cumplimiento | 30% |
| Tecnología y servicios | 34% |
| Facturación, precios y soporte | 12% |

El objetivo 3.7 pide identificar servicios de IA/ML y analítica y comprender
qué tareas realizan. La profundidad esperada es principalmente **servicio ↔
caso de uso**.

### AIF-C01

| Dominio | Peso |
|---|---:|
| Fundamentos de IA y ML | 20% |
| Fundamentos de IA generativa | 24% |
| Aplicaciones de modelos fundacionales | 28% |
| IA responsable | 14% |
| Seguridad, cumplimiento y gobierno de IA | 14% |

Los dominios 2 y 3 suman 52%. En AIF-C01, saber Polly, Transcribe o Textract
ayuda, pero la mayor parte del peso está en **GenAI y modelos fundacionales**.

## Los 10 servicios de IA/ML compartidos

| Servicio | Fórmula mental | Caso que lo delata | Confusión típica |
|---|---|---|---|
| **Amazon Polly** | texto → voz | Narrar artículos, accesibilidad, e-learning | No traduce; habla en el idioma del texto |
| **Amazon Transcribe** | voz/audio → texto | Subtitular audios, llamadas o streaming | No interpreta sentimiento ni traduce |
| **Amazon Translate** | texto idioma A → texto idioma B | Localización automática y traducción multilingüe | No convierte voz; primero se usa Transcribe si la entrada es audio |
| **Amazon Comprehend** | texto → significado/insights | Sentimiento, entidades, frases clave, idioma y PII | No genera texto ni extrae tablas de un PDF |
| **Amazon Textract** | documento → texto + estructura | Formularios, tablas, facturas, recibos e identificaciones | Para objetos o escenas en fotos corresponde Rekognition |
| **Amazon Rekognition** | imagen/video → etiquetas y análisis visual | Objetos, escenas, rostros, moderación y celebridades | Para formularios y pares clave-valor corresponde Textract |
| **Amazon Lex** | lenguaje natural → intención conversacional | Chatbot o IVR por texto/voz con intents y slots | No es solo speech-to-text; administra el diálogo |
| **Amazon Kendra** | documentos empresariales → búsqueda semántica | Buscar respuestas relevantes en repositorios internos | Kendra recupera; Amazon Q genera y conversa usando datos autorizados |
| **Amazon SageMaker AI** | datos → modelo propio → endpoint | Construir, entrenar y desplegar ML con máximo control | Para capacidades preentrenadas simples conviene una API administrada; para FMs por API, Bedrock |
| **Amazon Q** | datos/contexto empresarial → asistente GenAI listo | Resumir, responder preguntas y completar tareas | No es una plataforma para entrenar modelos como SageMaker AI |

Aunque Amazon Q aparece bajo categorías diferentes en las dos guías oficiales
(Machine Learning en CLF-C02 y Developer Tools en AIF-C01), el servicio está en
alcance para ambos.

## Cómo recordarlos por modalidad

### Audio y conversación

- **Polly:** texto a voz, TTS (*text-to-speech*).
- **Transcribe:** voz a texto, ASR (*automatic speech recognition*).
- **Lex:** conversación por texto o voz; identifica la intención y recopila los
  datos necesarios mediante intents y slots.
- **Translate:** cambia el idioma del texto. Si el origen es una llamada, una
  arquitectura posible es Transcribe → Translate.

Regla rápida: **Polly habla, Transcribe escucha, Translate cambia el idioma y
Lex conversa**.

### Texto y documentos

- **Comprehend** analiza el significado de texto que ya está disponible.
- **Textract** obtiene texto y estructura desde documentos o imágenes de
  documentos.
- **Kendra** indexa y recupera información empresarial relevante.
- **Amazon Q** usa GenAI para producir respuestas, resúmenes y acciones.

Regla rápida: **Textract lee el documento, Comprehend lo entiende, Kendra lo
encuentra y Q responde**.

### Imágenes, video y modelos

- **Rekognition** analiza contenido visual.
- **SageMaker AI** permite construir, entrenar y desplegar modelos propios.

## Diferencias que suelen transformarse en preguntas

### Polly vs Transcribe

- Texto a audio: **Polly**.
- Audio a texto: **Transcribe**.

### Transcribe vs Translate

- Cambiar modalidad de audio a texto: **Transcribe**.
- Cambiar idioma manteniendo texto como salida: **Translate**.
- Traducir una llamada: normalmente **Transcribe → Translate**.

### Textract vs Rekognition

- Factura, recibo, formulario, tabla, par clave-valor o escritura manuscrita:
  **Textract**.
- Objeto, escena, rostro, celebridad, actividad o moderación de imagen/video:
  **Rekognition**.
- Ambos pueden detectar texto visual, pero Textract es la respuesta cuando
  importa la **estructura documental**.

### Comprehend vs Textract

- Obtener texto o campos desde un escaneo: **Textract**.
- Analizar sentimiento, entidades, frases clave o PII del texto extraído:
  **Comprehend**.
- Flujo frecuente: **Textract → Comprehend**.

### Lex vs Amazon Q

- Bot determinista orientado a intents, slots y cumplimiento de una tarea:
  **Lex**.
- Asistente generativo que responde, resume o actúa sobre información
  empresarial: **Amazon Q**.

### Kendra vs Amazon Q

- Motor de búsqueda semántica empresarial: **Kendra**.
- Asistente GenAI con respuesta conversacional: **Amazon Q**.
- Pueden complementarse: Q puede apoyarse en fuentes e índices empresariales.

### SageMaker AI vs servicios preentrenados

- Modelo propio, entrenamiento, notebooks, pipelines y endpoints: **SageMaker
  AI**.
- Capacidad concreta lista por API: Polly, Transcribe, Translate, Comprehend,
  Textract o Rekognition.
- La opción administrada reduce tiempo y conocimiento de ML; SageMaker ofrece
  más control y personalización.

### SageMaker AI vs Amazon Bedrock

- Ciclo completo de ML y control sobre entrenamiento/despliegue: **SageMaker
  AI**.
- Consumir y personalizar modelos fundacionales para GenAI mediante un servicio
  administrado: **Amazon Bedrock**.
- SageMaker JumpStart acerca modelos preentrenados y plantillas al flujo de
  SageMaker AI.

## Servicios AIF-C01 que no figuran en la lista actual de CLF-C02

Estos servicios merecen una segunda etapa de estudio específica para AI
Practitioner:

| Servicio | Qué hay que recordar |
|---|---|
| **Amazon Bedrock** | Acceso administrado y seguro a modelos fundacionales para construir aplicaciones GenAI; Knowledge Bases, Agents, Guardrails y evaluación son conceptos clave |
| **Amazon Bedrock AgentCore** | Infraestructura y capacidades para desplegar y operar agentes en producción: runtime, identidad, memoria, herramientas y observabilidad |
| **Amazon Nova** | Familia de modelos fundacionales de Amazon disponible mediante Bedrock; no es el reemplazo de Bedrock |
| **Amazon SageMaker JumpStart** | Modelos preentrenados, plantillas y notebooks para acelerar soluciones en SageMaker AI |
| **Amazon Personalize** | Recomendaciones y segmentos personalizados a partir de usuarios, ítems e interacciones |
| **Amazon Augmented AI (A2I)** | Revisión humana de predicciones; útil para baja confianza, control de calidad y human-in-the-loop |
| **AWS Transform** | IA agéntica para migrar y modernizar infraestructura, aplicaciones y código |
| **Kiro** | IDE agéntico orientado a desarrollo guiado por especificaciones |
| **Strands Agents** | SDK abierto, model-first, para construir agentes y patrones multiagente |
| **Amazon Quick** | Servicio de trabajo asistido por IA para análisis, automatización, investigación y aplicaciones; Quick Sight vive actualmente dentro de Quick |

Importante: la revisión 1.1 de la guía AIF-C01, publicada el 30 de abril de
2026, incorporó explícitamente AgentCore, Kiro, Strands Agents, Amazon Q,
SageMaker JumpStart y AWS Transform, entre otros cambios. Conviene estudiar con
la guía nueva y no con resúmenes anteriores.

## Servicios de base que también se reutilizan

Los servicios de IA no viven aislados. Para ambos exámenes conviene reconocer
esta base común:

- **Amazon S3:** entrada y almacenamiento de documentos, audios, imágenes,
  datasets y resultados.
- **AWS Lambda:** procesamiento y orquestación sin servidores alrededor de una
  llamada de IA.
- **IAM:** quién puede invocar el servicio o acceder a datos y modelos; aplicar
  mínimo privilegio.
- **AWS KMS:** cifrado y administración de claves.
- **Amazon Macie:** descubrimiento de datos sensibles y PII en S3.
- **AWS CloudTrail:** auditoría de llamadas y actividad de API.
- **Amazon CloudWatch:** métricas, logs, alarmas y observabilidad.
- **AWS Config:** estado y cumplimiento de configuraciones.
- **Amazon VPC:** aislamiento de red.
- **Amazon S3 Glacier:** archivo de datos de largo plazo y bajo acceso.

Para AIF-C01 hay que conectar estos servicios con privacidad, linaje, cifrado
en tránsito y reposo, prevención de fuga de datos, logging, residencia,
retención y el modelo de responsabilidad compartida.

## Tres arquitecturas mentales útiles

### 1. Contact center multilingüe

1. **Transcribe** convierte la llamada a texto.
2. **Translate** cambia el idioma si hace falta.
3. **Comprehend** detecta sentimiento, entidades o PII.
4. **Polly** puede leer una respuesta en voz alta.
5. **Lex** administra el diálogo si se necesita un bot/IVR conversacional.

### 2. Procesamiento inteligente de documentos

1. El archivo llega a **S3**.
2. **Textract** extrae texto, tablas y campos.
3. **Comprehend** clasifica o analiza el contenido.
4. **A2I** deriva casos dudosos a revisión humana.
5. **Lambda**, una base de datos o un servicio analítico continúa el flujo.

### 3. Asistente sobre documentación propia

1. Los documentos viven en S3 u otros repositorios.
2. **Kendra**, OpenSearch o una Knowledge Base recupera contexto relevante.
3. **Bedrock** ejecuta el modelo fundacional.
4. RAG ancla la respuesta a información recuperada.
5. Guardrails, IAM, KMS, logs y evaluación reducen riesgos.

## Qué estudiar en cada nivel

### Prioridad 1: máximo retorno para ambos exámenes

Memorizar para los 10 servicios compartidos:

1. Entrada.
2. Salida.
3. Caso de uso principal.
4. Servicio con el que más se confunde.
5. Si es una capacidad preentrenada, una plataforma de ML, búsqueda o un
   asistente.

### Prioridad 2: profundidad adicional para AIF-C01

- IA vs ML vs deep learning vs GenAI vs IA agéntica.
- Aprendizaje supervisado, no supervisado y por refuerzo.
- Clasificación, regresión y clustering.
- Inferencia batch, tiempo real, asíncrona y serverless.
- Accuracy, precision, recall y F1.
- Modelos fundacionales, tokens, embeddings y bases vectoriales.
- RAG vs fine-tuning vs pre-training vs in-context learning.
- Zero-shot, one-shot/few-shot, temperatura y longitud de contexto.
- ROUGE, BLEU, BERTScore, evaluación humana y LLM-as-a-judge.

### Prioridad 3: seguridad e IA responsable

- Sesgo, fairness, robustez, seguridad, veracidad e inclusión.
- Overfitting y underfitting.
- Datasets representativos, balanceados, diversos y curados.
- Explicabilidad, Model Cards y evaluación por subgrupos.
- Prompt injection, fuga de datos, toxicidad, alucinaciones y validación de
  salida.
- Human-in-the-loop, grounding, RAG y confidence scores.

## Auditoría del contenido actual de AWS Prep

El catálogo ya contiene una base valiosa, pero la asignación por examen no
coincide todavía con el alcance oficial actual.

### Hallazgos

1. La definición de AIF-C01 asigna solo cuatro de los diez servicios
   compartidos: SageMaker AI, Comprehend, Kendra y Amazon Q.
2. Ya existen fichas para **Lex, Polly, Rekognition, Textract, Transcribe y
   Translate**, pero no están asignadas a AIF-C01. Son la brecha de mayor retorno
   porque sirven para los dos exámenes y el objetivo AIF-C01 1.2 menciona
   explícitamente varios de ellos.
3. CLF-C02 incorpora automáticamente todos los elementos de la categoría
   `machine-learning`. Eso hace que hoy muestre 16 elementos de esa categoría,
   aunque la lista oficial de ML de CLF-C02 contiene los 10 compartidos.
4. Bedrock, A2I, Nova, AgentCore y Personalize son útiles para AIF-C01, pero no
   deberían obtener pertenencia a CLF-C02 solo por compartir la categoría del
   catálogo.
5. AIF-C01 ya tiene asignados Bedrock y A2I. Las fichas de Nova, AgentCore,
   Personalize, Kiro, Strands Agents y AWS Transform existen, pero todavía no
   están asignadas al examen.
6. SageMaker JumpStart aparece dentro de la ficha de SageMaker, pero la guía
   oficial actual lo enumera de forma explícita; conviene darle visibilidad y
   preguntas propias aunque se conserve una única ficha relacionada.
7. El catálogo conserva **Amazon Fraud Detector** y lo asigna a ambos exámenes.
   No figura en las listas actuales de servicios en alcance de CLF-C02 ni
   AIF-C01. Además, AWS lo marcó para fin de soporte el 7 de octubre de 2026.
   “Fraud detection” sí sigue siendo un caso de uso conceptual de AIF-C01, pero
   no conviene enseñarlo como servicio prioritario del examen.
8. La guía nueva distingue **Amazon Quick** de la denominación histórica
   QuickSight/Quick Sight. El catálogo tiene QuickSight, pero no una ficha
   canónica de Amazon Quick con sus capacidades actuales.

### Recomendación editorial y técnica

1. Reemplazar en CLF-C02 la inclusión automática de toda la categoría por una
   pertenencia explícita de los 10 servicios oficiales compartidos.
2. Asignar a AIF-C01 los seis servicios compartidos faltantes con objetivo 1.2:
   Lex, Polly, Rekognition, Textract, Transcribe y Translate.
3. Incorporar al recorrido AIF-C01 los servicios agregados por la revisión 1.1
   y los servicios AI-only ya presentes en el catálogo.
4. Convertir Amazon Fraud Detector en contenido histórico/no perteneciente a
   examen, y conservar “detección de fraude” como caso de uso de clasificación.
5. Modelar Amazon Quick y dejar clara su relación actual con Quick Sight para no
   crear una confusión artificial en las preguntas.
6. Crear comparaciones y escenarios específicos para los pares Polly/Transcribe,
   Textract/Rekognition, Comprehend/Textract, Lex/Q, Kendra/Q y
   SageMaker/Bedrock.
7. Actualizar el manifiesto de fuentes y el reporte de cobertura antes de
   publicar el cambio en la aplicación.

## Mini simulacro

1. Una empresa quiere transformar artículos escritos en audio natural. ¿Qué
   servicio usa? **Amazon Polly**.
2. Un contact center necesita convertir llamadas grabadas en texto. ¿Qué
   servicio usa? **Amazon Transcribe**.
3. Se necesita traducir automáticamente descripciones de productos. ¿Qué
   servicio usa? **Amazon Translate**.
4. Se quiere medir sentimiento y extraer entidades de reseñas. ¿Qué servicio
   usa? **Amazon Comprehend**.
5. Hay que extraer campos y tablas de miles de facturas escaneadas. ¿Qué
   servicio usa? **Amazon Textract**.
6. Una red social quiere detectar contenido visual inapropiado. ¿Qué servicio
   usa? **Amazon Rekognition**.
7. Se quiere crear un bot que detecte la intención “reservar hotel” y pida fecha
   y ciudad. ¿Qué servicio usa? **Amazon Lex**.
8. Los empleados necesitan búsqueda semántica sobre manuales internos. ¿Qué
   servicio usa? **Amazon Kendra**.
9. Un equipo de datos necesita entrenar y desplegar un modelo propio. ¿Qué
   servicio usa? **Amazon SageMaker AI**.
10. La empresa quiere un asistente GenAI listo para responder sobre información
    empresarial respetando permisos. ¿Qué servicio usa? **Amazon Q Business**.
11. Se necesita revisar manualmente solo las predicciones de baja confianza.
    ¿Qué servicio/capacidad usa? **Amazon A2I**.
12. Se quiere construir una aplicación GenAI con un FM, RAG y guardrails sin
    administrar el servidor del modelo. ¿Qué servicio usa? **Amazon Bedrock**.
13. ¿Qué combinación analiza el sentimiento de una llamada en otro idioma?
    **Transcribe → Translate → Comprehend**.
14. ¿Qué combinación obtiene datos de una factura y deriva casos dudosos a una
    persona? **Textract → A2I**.
15. ¿Qué herramienta elegir para objetos en una fotografía en lugar de tablas
    de un documento? **Rekognition**, no Textract.

## Fuentes oficiales

- [Guía y dominios de CLF-C02](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html)
- [Servicios en alcance de CLF-C02](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html)
- [Dominio 3 de CLF-C02](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain3.html)
- [Guía y dominios de AIF-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01.html)
- [Servicios en alcance de AIF-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html)
- [Revisiones de AIF-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [Amazon Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html)
- [Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html)
- [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html)
- [Amazon Translate](https://docs.aws.amazon.com/translate/)
- [Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/what-is.html)
- [Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html)
- [Amazon Lex](https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html)
- [Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html)
- [Amazon SageMaker AI](https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html)
- [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [Amazon Q Business](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html)
- [Amazon Personalize](https://docs.aws.amazon.com/personalize/latest/dg/what-is-personalize.html)
- [SageMaker JumpStart](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-jumpstart.html)
- [Amazon Quick](https://docs.aws.amazon.com/quick/latest/userguide/what-is.html)
- [AWS Transform](https://docs.aws.amazon.com/transform/latest/userguide/what-is-service.html)
- [Cambio de disponibilidad de Amazon Fraud Detector](https://docs.aws.amazon.com/frauddetector/latest/ug/frauddetector-availability-change.html)
- [Servicios AWS en proceso de cierre](https://docs.aws.amazon.com/general/latest/gr/sunset_services.html)

Las listas oficiales son no exhaustivas y AWS indica que pueden cambiar. Este
documento debe volver a verificarse antes de una publicación importante o de
la fecha del examen.
