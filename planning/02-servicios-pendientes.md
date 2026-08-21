# Servicios pendientes de agregar al mapa

Estado al 2026-08-21: `aws-map-v4.html` tiene **80 servicios** en 15 categorías, todos con documentación completa (`long`, `use`, `avoid`, `concepts`) y 119 relaciones sin huérfanas.

Este archivo lista lo que **falta** para cobertura completa de CLF-C02, ordenado por prioridad. Cada entrada indica en qué categoría va y por qué importa.

## Cómo agregarlos

El patrón está establecido. Cada servicio es un objeto dentro de `items[]` de su categoría en `DATA[]`:

```js
{ name: "Nombre", d: "Una línea para el nodo del mapa.", link: "https://aws.amazon.com/...",
  long: "3-5 oraciones. <strong>Términos clave</strong> en negrita. Qué problema resuelve.",
  use: ["Caso concreto 1.", "Caso 2.", "Caso 3.", "Caso 4."],
  avoid: ["Situación &rarr; <strong>Alternativa</strong>.", "..."],
  concepts: [{t:"Término",d:"Definición corta."}, ...] },
```

Convenciones:
- `avoid` siempre nombra el servicio alternativo con `&rarr; <strong>X</strong>` — así el bloque da la comparación entre servicios sin necesitar un campo aparte.
- Español rioplatense (vos/tenés/podés), igual que el resto.
- Verificar contra docs oficiales con el MCP `aws-documentation` antes de redactar.
- Sumar relaciones en `RELATIONS[]` o el servicio queda aislado en el mapa.

Método de inserción que funciona (los heredocs de bash rompen con las comillas del JS):
1. Escribir un script Python en el scratchpad con el bloque nuevo.
2. Localizar la línea `  ]},` que cierra la categoría destino.
3. Insertar por índice de línea, de mayor a menor si son varios.
4. Validar con Node antes de dar por hecho el cambio.

---

## Prioridad alta — aparecen con frecuencia en el examen

| Servicio | Categoría | Por qué |
|---|---|---|
| **Amazon Q** | Machine Learning | Asistente de IA de AWS. Incorporado al temario reciente |
| **Global Accelerator** | Redes y CDN | Red global anycast. Se contrasta con CloudFront en preguntas |
| **Transit Gateway** | Redes y CDN | Ya se menciona en la ficha de VPC, no existe como servicio |
| **Site-to-Site VPN** | Redes y CDN | Ya se menciona en Direct Connect. Par clásico VPN vs DX |
| **Security Hub** | Seguridad y detección | Ya se menciona en GuardDuty. Centraliza hallazgos |
| **Polly** | Machine Learning | Texto a voz. Uno de los servicios de IA que suele aparecer |
| **Translate** | Machine Learning | Traducción automática |
| **Transcribe** | Machine Learning | Voz a texto |

## Prioridad media — cubren huecos conceptuales

| Servicio | Categoría | Por qué |
|---|---|---|
| **Glue** | Analítica | ETL serverless. Ya se menciona en Athena y EMR |
| **X-Ray** | Administración | Trazado distribuido. Ya se menciona en CloudWatch |
| **DAX** | Bases de datos | Caché de DynamoDB. Ya se menciona en ElastiCache |
| **CDK** | Herramientas dev | Ya se menciona en CloudFormation. IaC en lenguaje de programación |
| **CloudWatch Logs Insights** | Administración | Podría ser ficha propia o quedar como concepto |
| **Audit Manager** | Seguridad y detección | Ya se menciona en Artifact |
| **Migration Hub** | Migración y transferencia | Completa la categoría junto a DMS y DataSync |
| **Backup** | Almacenamiento | Backup centralizado entre servicios |
| **Elastic Disaster Recovery** | Migración y transferencia | DR. Concepto RTO/RPO del examen |

## Prioridad baja — completitud

| Servicio | Categoría | Por qué |
|---|---|---|
| **DocumentDB** | Bases de datos | Compatible con MongoDB |
| **Timestream** | Bases de datos | Series temporales |
| **QLDB** | Bases de datos | Libro mayor inmutable |
| **Keyspaces** | Bases de datos | Compatible con Cassandra |
| **MemoryDB** | Bases de datos | Redis durable |
| **Lex** | Machine Learning | Chatbots conversacionales |
| **Kendra** | Machine Learning | Búsqueda empresarial |
| **Forecast / Personalize** | Machine Learning | Predicción y recomendaciones |
| **MediaConvert** | (nueva: Media) | Transcodificación de video |
| **AppSync** | Integración | GraphQL administrado |
| **MQ** | Integración | Broker de mensajes administrado |
| **OpenSearch** | Analítica | Búsqueda y análisis de logs |
| **Data Firehose** | Analítica | Hoy es un concepto dentro de Kinesis |
| **Outposts** | Cómputo | AWS en tu datacenter. Modelo híbrido |
| **Local Zones / Wavelength** | Cómputo | Cómputo de baja latencia en el borde |
| **WorkSpaces** | (nueva: Usuario final) | Escritorios virtuales |
| **Connect** | (nueva: Usuario final) | Centro de contacto |
| **Chatbot** | Administración | Alertas a Slack o Teams |
| **Launch Wizard** | Cómputo | Aprovisionamiento guiado |
| **Compute Optimizer** | Costos y soporte | Recomendaciones de dimensionamiento |
| **License Manager** | Administración | Gestión de licencias |
| **Fault Injection Service** | Administración | Ingeniería del caos |

---

## Conceptos sin servicio asociado

Estos no son servicios pero aparecen en el examen. Podrían ir como fichas en **Fundamentos**:

- **Las 7 R de migración** — Rehost, Replatform, Repurchase, Refactor, Retire, Retain, Relocate
- **RTO / RPO** — objetivos de tiempo y punto de recuperación
- **Estrategias de DR** — backup y restore, pilot light, warm standby, multi-site
- **Escalado vertical vs horizontal** — scale up contra scale out
- **CapEx vs OpEx** — el argumento económico de la nube
- **Free Tier** — sus tres modalidades; hoy es un concepto dentro de "Modelo de precios"
- **Ventajas de la nube** — los seis beneficios que enumera AWS

---

## Deuda técnica pendiente

1. **Los markdown quedaron obsoletos.** `Aws_Cloud_Practitioner_Resumen_1.md` y `_2.md` cubren ~35 servicios con una línea cada uno; el HTML tiene 80 documentados en profundidad. No los lee nadie: el HTML tiene todo hardcodeado en `DATA[]`. Decidir entre borrarlos o generarlos desde `DATA[]` con un script. No mantener el contenido en dos lugares.

2. **`RELATIONS[]` no tiene tipos.** Son 119 pares `["A","B"]` sin semántica. El plan en `01-arquitectura-y-datos.md` propone `kind` (`uses`, `triggers`, `stores-in`, `authenticates-via`...) más un campo `note` por relación. Eso convertiría cada arista del mapa en documentación.

3. **Backups del HTML**: `aws-map-v4.html.bak` (antes de documentar) y `.pre18` (antes de sumar los 18). Borrar cuando no hagan falta.
