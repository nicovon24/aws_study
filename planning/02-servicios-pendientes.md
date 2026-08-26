# Servicios pendientes de agregar al mapa

Estado al 2026-08-26: `src/data/services.ts` tiene **94 entradas** (80 servicios originales + 12 servicios y 2 conceptos de la tanda "en curso") en 15 categorías, todos con documentación completa (`long`, `use`, `avoid`, `concepts`) y relaciones sin huérfanas en `src/data/relations.ts`.

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

## Hecho — tanda "en curso" (2026-08-26)

Los 12 servicios y 2 conceptos de la tanda anterior ya están en `src/data/services.ts` con `long`/`use`/`avoid`/`concepts` completos, verificados contra `docs.aws.amazon.com` con el MCP `aws-documentation`, y con relaciones en `src/data/relations.ts`. Build y `tsc --noEmit` pasan limpios.

| Servicio | Categoría | Nota de la verificación |
|---|---|---|
| **Glue** | Analítica | ETL serverless sobre Spark; Data Catalog compartido con Athena/EMR/Redshift Spectrum |
| **CDK** | Herramientas dev | Sintetiza a CloudFormation; hereda su rollback y drift detection |
| **Outposts** | Cómputo | Rack o server físico administrado por AWS como extensión de una Region |
| **Amazon Q** | Machine Learning | Dos caras: Q Developer (IDE/código) y Q Business (empresarial, permission-aware). Soporte de los plugins de IDE termina 2027-04-30 |
| **X-Ray** | Administración | Trazado distribuido; complementa a CloudWatch, no lo reemplaza |
| **DAX** | Bases de datos | Caché in-memory específico de DynamoDB, microsegundos, consistencia eventual |
| **DocumentDB** | Bases de datos | Compatible con API de MongoDB 3.6/4.0; motor propio de AWS por debajo |
| **MemoryDB** | Bases de datos | Redis/Valkey durable como base primaria, no solo caché (a diferencia de ElastiCache) |
| **Audit Manager** | Seguridad y detección | **Cerrado a nuevos clientes** (dato verificado en docs); existentes lo siguen usando |
| **Migration Hub** | Migración y transferencia | **Cerrado a nuevos clientes desde 2025-11-07**; alternativa AWS Transform |
| **Elastic Disaster Recovery** | Migración y transferencia | RTO en minutos, RPO en segundos vía staging area de bajo costo |
| **Backup** | Almacenamiento | Backup centralizado por tags entre EC2/EBS/RDS/DynamoDB/EFS/FSx y más |
| **Ventajas de la nube** | Fundamentos (concepto) | Los 6 beneficios oficiales del whitepaper `aws-overview` |
| **Las 7 R de migración** | Fundamentos (concepto) | Rehost, Replatform, Repurchase, Refactor, Retire, Retain, Relocate |

Nota: **CloudWatch Logs Insights** se decidió dejar como concepto dentro de la ficha existente de CloudWatch (ya estaba ahí desde antes) en vez de ficha propia — no amerita el espacio.

## Hecho — tanda "redes + Security Hub + IA texto/voz + conceptos sueltos" (2026-08-26)

7 servicios y 3 conceptos, verificados contra docs oficiales, con relaciones en `RELATIONS[]`. Build y `tsc --noEmit` limpios.

| Servicio/concepto | Categoría | Nota |
|---|---|---|
| **Global Accelerator** | Redes y CDN | Anycast; failover instantáneo entre Regions, distinto de CloudFront (cachea, no acelera red) |
| **Transit Gateway** | Redes y CDN | Hub-and-spoke; reemplaza peering punto a punto entre muchas VPCs |
| **Site-to-Site VPN** | Redes y CDN | IPsec por internet, 2 túneles; par clásico con Direct Connect |
| **Security Hub** | Seguridad y detección | Centraliza GuardDuty/Inspector/Macie + estándares (CIS, PCI DSS, NIST) |
| **Polly / Translate / Transcribe** | Machine Learning | Trío TTS / traducción / STT; se combinan entre sí en casos de uso |
| **RTO / RPO** | Fundamentos (concepto) | Tiempo de inactividad vs datos perdidos; ligado a Elastic Disaster Recovery |
| **CapEx vs OpEx** | Fundamentos (concepto) | Parte explícita del Task 1.4 del temario oficial (economía de la nube) |
| **Escalado vertical vs horizontal** | Fundamentos (concepto) | Scale up vs scale out; distinto de escalabilidad vs elasticidad |

Dataset total: **104 servicios/conceptos**.

## Prioridad baja — completitud

| Servicio | Categoría | Por qué |
|---|---|---|
| **Timestream** | Bases de datos | Series temporales |
| **QLDB** | Bases de datos | Libro mayor inmutable |
| **Keyspaces** | Bases de datos | Compatible con Cassandra |
| **Lex** | Machine Learning | Chatbots conversacionales |
| **Kendra** | Machine Learning | Búsqueda empresarial |
| **Forecast / Personalize** | Machine Learning | Predicción y recomendaciones |
| **MediaConvert** | (nueva: Media) | Transcodificación de video |
| **AppSync** | Integración | GraphQL administrado |
| **MQ** | Integración | Broker de mensajes administrado |
| **OpenSearch** | Analítica | Búsqueda y análisis de logs |
| **Data Firehose** | Analítica | Hoy es un concepto dentro de Kinesis |
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

- **RTO / RPO** — objetivos de tiempo y punto de recuperación
- **Estrategias de DR** — backup y restore, pilot light, warm standby, multi-site
- **Escalado vertical vs horizontal** — scale up contra scale out
- **CapEx vs OpEx** — el argumento económico de la nube
- **Free Tier** — sus tres modalidades; hoy es un concepto dentro de "Modelo de precios"

---

## Deuda técnica pendiente

1. **Los markdown quedaron obsoletos.** `Aws_Cloud_Practitioner_Resumen_1.md` y `_2.md` cubren ~35 servicios con una línea cada uno; el HTML tiene 80 documentados en profundidad. No los lee nadie: el HTML tiene todo hardcodeado en `DATA[]`. Decidir entre borrarlos o generarlos desde `DATA[]` con un script. No mantener el contenido en dos lugares.

2. **`RELATIONS[]` no tiene tipos.** Son 119 pares `["A","B"]` sin semántica. El plan en `01-arquitectura-y-datos.md` propone `kind` (`uses`, `triggers`, `stores-in`, `authenticates-via`...) más un campo `note` por relación. Eso convertiría cada arista del mapa en documentación.

3. **Backups del HTML**: `aws-map-v4.html.bak` (antes de documentar) y `.pre18` (antes de sumar los 18). Borrar cuando no hagan falta.
