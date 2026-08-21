# Servicios de AWS – Guía para AWS Cloud Practitioner (CLF-C02)

Guía de repaso con los servicios de AWS más importantes para la certificación **AWS Certified Cloud Practitioner**. Incluye tabla resumen, explicaciones detalladas y una lista de servicios recomendados para practicar gratis.

---

## 📋 Tabla resumen por categorías

| Categoría | Servicio | Qué hace (resumen breve) |
|---|---|---|
| **Cómputo** | EC2 | Servidores virtuales (máquinas virtuales) escalables bajo demanda |
| **Cómputo** | Lambda | Ejecuta código sin servidores (serverless), pagás solo por ejecución |
| **Cómputo** | Elastic Beanstalk | Despliega apps web sin gestionar la infraestructura manualmente |
| **Cómputo** | ECS / EKS | Orquestación de contenedores (Docker / Kubernetes) |
| **Cómputo** | Auto Scaling | Ajusta automáticamente la cantidad de instancias según demanda |
| **Almacenamiento** | S3 | Almacenamiento de objetos (archivos) escalable y duradero |
| **Almacenamiento** | EBS | Discos virtuales persistentes para instancias EC2 |
| **Almacenamiento** | EFS | Sistema de archivos compartido entre múltiples instancias |
| **Almacenamiento** | Glacier | Almacenamiento de archivado a bajo costo, acceso lento |
| **Bases de datos** | RDS | Bases de datos relacionales administradas (MySQL, PostgreSQL, etc.) |
| **Bases de datos** | DynamoDB | Base de datos NoSQL administrada, alta escalabilidad |
| **Bases de datos** | Redshift | Data warehouse para análisis de grandes volúmenes de datos |
| **Bases de datos** | ElastiCache | Caché en memoria (Redis/Memcached) para acelerar apps |
| **Redes** | VPC | Red virtual privada aislada dentro de AWS |
| **Redes** | Route 53 | Servicio DNS administrado |
| **Redes** | CloudFront | CDN para distribuir contenido con baja latencia |
| **Redes** | ELB (Load Balancer) | Distribuye tráfico entrante entre varios recursos |
| **Redes** | API Gateway | Crea, publica y gestiona APIs |
| **Seguridad e Identidad** | IAM | Gestión de usuarios, roles y permisos |
| **Seguridad e Identidad** | Cognito | Autenticación y gestión de usuarios para apps |
| **Seguridad e Identidad** | KMS | Gestión de claves de cifrado |
| **Seguridad e Identidad** | Shield / WAF | Protección contra ataques DDoS y firewall de aplicaciones web |
| **Seguridad e Identidad** | Organizations | Gestión centralizada de múltiples cuentas AWS |
| **Administración y Monitoreo** | CloudWatch | Monitoreo de métricas, logs y alarmas |
| **Administración y Monitoreo** | CloudTrail | Registro de auditoría de todas las acciones/API calls |
| **Administración y Monitoreo** | Trusted Advisor | Recomendaciones de costos, seguridad y rendimiento |
| **Administración y Monitoreo** | Config | Rastrea configuración y cumplimiento de recursos |
| **Costos y Facturación** | Cost Explorer | Visualiza y analiza gastos históricos y proyectados |
| **Costos y Facturación** | Budgets | Configura alertas y límites de presupuesto |
| **Costos y Facturación** | Pricing Calculator | Estima costos antes de desplegar recursos |
| **Integración/Mensajería** | SQS | Colas de mensajes para desacoplar componentes |
| **Integración/Mensajería** | SNS | Notificaciones push/pub-sub entre servicios |
| **Integración/Mensajería** | EventBridge | Bus de eventos para conectar servicios y apps |
| **Desarrollo/DevOps** | CloudFormation | Infraestructura como código (IaC) |
| **Desarrollo/DevOps** | CodePipeline/CodeBuild/CodeDeploy | CI/CD para automatizar despliegues |

---

## 📖 Descripción detallada de los servicios principales

### Cómputo

**Amazon EC2 (Elastic Compute Cloud)** es el servicio central de cómputo de AWS: permite alquilar servidores virtuales ("instancias") con distintas combinaciones de CPU, memoria, almacenamiento y capacidad de red. Se usa para alojar aplicaciones web, backends, entornos de desarrollo, procesamiento por lotes o cualquier carga que necesite un servidor. Se puede elegir el sistema operativo, el tipo de instancia según la necesidad (general, optimizada a cómputo, memoria o GPU) y el modelo de pago (On-Demand, Reserved, Spot, Savings Plans). Es la base sobre la que se apoyan muchísimos otros servicios de AWS.

**AWS Lambda** permite ejecutar código sin tener que administrar servidores (computación *serverless*). Subís tu función (en Python, Node.js, Java, etc.), definís qué la dispara (un evento de S3, una petición HTTP vía API Gateway, un mensaje de SQS, etc.) y AWS se encarga de ejecutarla, escalarla y cobrarte solo por el tiempo de cómputo usado. Es ideal para tareas cortas, microservicios, procesamiento de eventos y automatizaciones, y es uno de los servicios más usados en arquitecturas modernas.

**AWS Elastic Beanstalk** es una plataforma como servicio (PaaS) que simplifica el despliegue de aplicaciones web: subís tu código y Beanstalk se encarga automáticamente de aprovisionar EC2, balanceador de carga, Auto Scaling y monitoreo, sin que tengas que configurar cada pieza manualmente. Es útil para desarrolladores que quieren desplegar rápido sin preocuparse por la infraestructura subyacente.

**Amazon ECS y EKS** son servicios de orquestación de contenedores. ECS es la solución nativa de AWS para correr contenedores Docker, mientras que EKS ofrece Kubernetes administrado. Se usan cuando una aplicación está dividida en microservicios empaquetados en contenedores y se necesita gestionar su despliegue, escalado y networking de forma centralizada.

**Auto Scaling** ajusta automáticamente la cantidad de instancias EC2 (u otros recursos) según la demanda real, agregando instancias en picos de tráfico y quitándolas cuando baja, lo que ayuda a mantener el rendimiento y optimizar costos.

### Almacenamiento

**Amazon S3 (Simple Storage Service)** es el servicio de almacenamiento de objetos más usado de AWS. Permite guardar cualquier tipo de archivo (imágenes, videos, backups, logs, datasets) de forma prácticamente ilimitada, con altísima durabilidad (99.999999999%). Se organiza en "buckets" y objetos, y tiene distintas clases de almacenamiento (Standard, Infrequent Access, Glacier) según la frecuencia de acceso necesaria y el costo que se quiera pagar. Es la base de muchísimas arquitecturas: hosting de sitios estáticos, almacenamiento de backups, data lakes, distribución de contenido, etc.

**Amazon EBS (Elastic Block Store)** provee discos virtuales persistentes que se conectan a instancias EC2, similares a un disco duro tradicional. Se usa cuando una aplicación necesita almacenamiento de bajo nivel y persistente que sobreviva al reinicio de la instancia (bases de datos, sistemas de archivos, etc.).

**Amazon EFS (Elastic File System)** es un sistema de archivos compartido que puede montarse simultáneamente en múltiples instancias EC2, útil cuando varias instancias necesitan acceder y modificar los mismos archivos al mismo tiempo (por ejemplo, contenido compartido entre servidores web).

**Amazon S3 Glacier** es la opción de almacenamiento de archivado de AWS, pensada para datos que se acceden muy raramente (backups a largo plazo, cumplimiento normativo). Tiene un costo mucho menor que S3 estándar, a cambio de tiempos de recuperación más largos.

### Bases de datos

**Amazon RDS (Relational Database Service)** administra bases de datos relacionales (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora) encargándose de tareas como backups automáticos, parches, replicación y escalado, para que no tengas que gestionar el servidor de base de datos manualmente. Es la opción típica cuando una aplicación necesita una base de datos SQL tradicional.

**Amazon DynamoDB** es una base de datos NoSQL totalmente administrada, pensada para aplicaciones que necesitan latencia muy baja y escalabilidad masiva (millones de solicitudes por segundo), como apps móviles, IoT o sistemas de sesiones. No requiere un esquema fijo como las bases relacionales.

**Amazon Redshift** es un data warehouse (almacén de datos) diseñado para análisis de grandes volúmenes de información mediante consultas SQL complejas, típicamente usado en BI (business intelligence) y análisis empresarial.

**Amazon ElastiCache** ofrece caché en memoria (compatible con Redis o Memcached) para acelerar aplicaciones reduciendo la carga sobre la base de datos principal, guardando en memoria los datos que se consultan con frecuencia.

### Redes y entrega de contenido

**Amazon VPC (Virtual Private Cloud)** permite crear una red privada y aislada dentro de AWS, donde defines subredes, tablas de rutas, gateways y reglas de seguridad. Es la base de la arquitectura de red de casi cualquier proyecto en AWS, ya que controla qué recursos son públicos y cuáles privados, y cómo se comunican entre sí.

**Amazon Route 53** es el servicio de DNS de AWS: traduce nombres de dominio en direcciones IP, gestiona el registro de dominios y permite configurar políticas de enrutamiento (failover, geolocalización, balanceo de carga basado en DNS).

**Amazon CloudFront** es la red de distribución de contenido (CDN) de AWS: cachea contenido (imágenes, videos, páginas web) en ubicaciones ("edge locations") cercanas a los usuarios finales, reduciendo la latencia y la carga sobre el servidor de origen.

**Elastic Load Balancing (ELB)** distribuye automáticamente el tráfico entrante entre múltiples instancias EC2, contenedores o funciones Lambda, mejorando la disponibilidad y tolerancia a fallos de una aplicación.

**Amazon API Gateway** permite crear, publicar, mantener y proteger APIs (REST, HTTP o WebSocket) que suelen actuar como punto de entrada hacia funciones Lambda u otros backends.

### Seguridad e identidad

**AWS IAM (Identity and Access Management)** es el servicio central para gestionar quién puede hacer qué dentro de una cuenta de AWS: usuarios, grupos, roles y políticas de permisos. Es uno de los servicios más importantes del examen porque toda la seguridad de AWS se apoya en él (principio de mínimo privilegio, MFA, roles para servicios, etc.).

**Amazon Cognito** gestiona la autenticación y autorización de usuarios finales en aplicaciones web y móviles (registro, login, integración con proveedores externos como Google o Facebook).

**AWS KMS (Key Management Service)** administra las claves de cifrado usadas para proteger datos en distintos servicios de AWS (S3, EBS, RDS, etc.), permitiendo crear, rotar y controlar el acceso a esas claves.

**AWS Shield y AWS WAF** protegen aplicaciones: Shield contra ataques de denegación de servicio (DDoS), y WAF (Web Application Firewall) filtrando tráfico web malicioso mediante reglas personalizables.

**AWS Organizations** permite gestionar de forma centralizada múltiples cuentas de AWS (facturación consolidada, políticas de control de servicios, estructura jerárquica de cuentas), muy usado en empresas con varios equipos o entornos.

### Administración, monitoreo y cumplimiento

**Amazon CloudWatch** recolecta métricas, logs y eventos de los recursos de AWS, permitiendo crear dashboards, alarmas y disparar acciones automáticas (por ejemplo, escalar instancias cuando sube el uso de CPU).

**AWS CloudTrail** registra todas las llamadas a la API realizadas dentro de una cuenta de AWS (quién hizo qué, cuándo y desde dónde), fundamental para auditoría y seguridad.

**AWS Trusted Advisor** analiza la cuenta y da recomendaciones automáticas sobre optimización de costos, seguridad, rendimiento y límites de servicio.

**AWS Config** rastrea y evalúa la configuración de los recursos de AWS a lo largo del tiempo, útil para verificar cumplimiento de políticas internas o normativas.

### Costos y facturación

**AWS Cost Explorer** permite visualizar, analizar y proyectar los gastos de la cuenta con gráficos y filtros por servicio, cuenta o etiqueta.

**AWS Budgets** permite configurar presupuestos personalizados y recibir alertas cuando el gasto (o el uso) se acerca o supera un límite definido.

**AWS Pricing Calculator** es una herramienta externa (basada en web) que permite estimar el costo mensual de una arquitectura antes de desplegarla, muy útil para el examen porque pregunta sobre modelos de precios (On-Demand, Reserved, Spot, Savings Plans).

### Integración y mensajería

**Amazon SQS (Simple Queue Service)** es un servicio de colas de mensajes que permite desacoplar componentes de una aplicación: un servicio envía mensajes a la cola y otro los procesa a su propio ritmo, mejorando la resiliencia del sistema.

**Amazon SNS (Simple Notification Service)** funciona bajo el patrón pub/sub: un servicio publica una notificación y todos los suscriptores (email, SMS, Lambda, SQS, etc.) la reciben automáticamente.

**Amazon EventBridge** es un bus de eventos que conecta aplicaciones usando datos de eventos en tiempo real, tanto de servicios de AWS como de aplicaciones SaaS externas o propias.

### Desarrollo y DevOps

**AWS CloudFormation** permite definir infraestructura como código (IaC) mediante plantillas (JSON/YAML), de forma que se pueda crear, actualizar o eliminar toda una arquitectura de forma repetible y versionada.

**AWS CodePipeline, CodeBuild y CodeDeploy** conforman el conjunto de herramientas de CI/CD de AWS: automatizan la compilación, prueba y despliegue de aplicaciones cada vez que se actualiza el código fuente.

---

## 🎯 Servicios recomendados para practicar (con Free Tier o repos gratuitos)

Estos son los servicios más importantes para practicar de forma práctica, ya sea con el **AWS Free Tier** (cuenta gratuita de AWS) o con repositorios/simuladores gratuitos:

| Servicio | Cómo practicarlo gratis |
|---|---|
| **EC2** | Free Tier: 750 hs/mes de instancia `t2.micro`/`t3.micro` por 12 meses |
| **S3** | Free Tier: 5 GB de almacenamiento estándar por 12 meses |
| **Lambda** | Free Tier "always free": 1 millón de solicitudes gratis por mes, de forma permanente |
| **DynamoDB** | Free Tier "always free": 25 GB de almacenamiento, permanente |
| **RDS** | Free Tier: 750 hs/mes de instancia `db.t2.micro`/`t3.micro` por 12 meses |
| **IAM** | Siempre gratis (no tiene costo, ideal para practicar roles y políticas) |
| **VPC** | Siempre gratis crear la red (se cobra por recursos adicionales como NAT Gateway) |
| **CloudWatch** | Free Tier: 10 métricas personalizadas y 5 GB de logs gratis por mes |
| **CloudFormation** | Sin costo adicional por el servicio en sí (se cobra por los recursos que crea) |
| **SNS / SQS** | Free Tier "always free": 1 millón de solicitudes gratis por mes |

**Formas de practicar sin (o casi sin) usar tu tarjeta:**

- **AWS Free Tier oficial** → [aws.amazon.com/free](https://aws.amazon.com/free) (requiere tarjeta para verificación, pero tiene servicios "always free" que nunca cobran si te mantenés dentro de los límites).
- **AWS Skill Builder** → [skillbuilder.aws](https://skillbuilder.aws) tiene labs gratuitos y de pago, cursos oficiales para el Cloud Practitioner, y algunos simuladores de examen gratis.
- **AWS Workshops** → [workshops.aws](https://workshops.aws) — decenas de tutoriales guiados gratuitos usando tu propia cuenta Free Tier, paso a paso.
- **Qwiklabs / AWS Skill Builder Labs** → labs con crédito temporal de AWS sin usar tu cuenta personal (algunos gratis, otros pagos).
- **LocalStack** (repo open source: [github.com/localstack/localstack](https://github.com/localstack/localstack)) → simula muchos servicios de AWS (S3, Lambda, DynamoDB, SQS, etc.) de forma local con Docker, 100% gratis, ideal para practicar sin tocar la nube real ni arriesgarte a que te cobren.
- **AWS CDK Examples** (repo: [github.com/aws-samples/aws-cdk-examples](https://github.com/aws-samples/aws-cdk-examples)) → ejemplos oficiales de AWS para desplegar arquitecturas reales con código, gratis de usar (pagás solo lo que despliegues en tu cuenta).
- **AWS SAM CLI** (repo: [github.com/aws/aws-sam-cli](https://github.com/aws/aws-sam-cli)) → herramienta oficial gratuita para probar aplicaciones serverless (Lambda + API Gateway) localmente antes de desplegar.

> ⚠️ Recomendación: siempre configurar un **Budget/alarma de billing** desde el primer día de tu cuenta (AWS Budgets, gratis) para que te avise por mail si te acercás a superar el Free Tier.

*Nota: no tengo acceso a navegación en tiempo real al generar este archivo, así que si querés confirmo los límites exactos actuales del Free Tier con una búsqueda web, porque AWS los actualiza de vez en cuando.*
