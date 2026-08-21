# Servicios de AWS
Guía de repaso AWS Certified Cloud Practitioner (CLF-C02)
Tabla resumen por categorías, infografías de los servicios principales, explicación del uso de cada
servicio y una lista final para practicar gratis.

## Tabla resumen por categorías

| Categoría | Qué hace (resumen breve) | Servicio |
| :--- | :--- | :--- |
| Cómputo | Servidores virtuales escalables bajo demanda | EC2 |
| Cómputo | Ejecuta código sin servidores, pagás solo por ejecución | Lambda |
| Cómputo | Despliega apps web sin gestionar infraestructura | Elastic Beanstalk |
| Cómputo | Orquestación de contenedores (Docker / Kubernetes) | ECS/EKS |
| Cómputo | Ajusta automáticamente la cantidad de instancias | Auto Scaling |
| Almacenamiento | Almacenamiento de objetos escalable y duradero | S3 |
| Almacenamiento | Discos virtuales persistentes para EC2 | EBS |
| Almacenamiento | Sistema de archivos compartido entre instancias | EFS |
| Almacenamiento | Archivado a bajo costo, acceso lento | Glacier |
| Bases de datos | Bases de datos relacionales administradas | RDS |
| Bases de datos | Base de datos NoSQL, alta escalabilidad | DynamoDB |
| Bases de datos | Data warehouse para análisis de datos | Redshift |
| Bases de datos | Caché en memoria (Redis/Memcached) | ElastiCache |
| Redes | Red privada aislada dentro de AWS | VPC |
| Redes | Servicio DNS administrado | Route 53 |
| Redes | CDN: distribuye contenido con baja latencia | CloudFront |
| Redes | Distribuye tráfico entre varios recursos | ELB |
| Redes | Crea, publica y gestiona APIs | API Gateway |
| Seguridad | Gestión de usuarios, roles y permisos | IAM |
| Seguridad | Autenticación de usuarios para apps | Cognito |
| Seguridad | Gestión de claves de cifrado | KMS |
| Seguridad | Protección DDoS y firewall de apps web | Shield/WAF |
| Seguridad | Gestión centralizada de múltiples cuentas | Organizations |
| Monitoreo | Monitoreo de métricas, logs y alarmas | CloudWatch |
| Monitoreo | Auditoría de todas las acciones/API | CloudTrail |
| Monitoreo | Recomendaciones de costo y seguridad | Trusted Advisor |
| Monitoreo | Rastrea configuración y cumplimiento | Config |
| Costos | Visualiza y proyecta gastos | Cost Explorer |
| Costos | Alertas y limites de presupuesto | Budgets |
| Costos | Estima costos antes de desplegar | Pricing Calculator |
| Mensajeria | Colas de mensajes para desacoplar componentes | SQS |
| Mensajeria | Notificaciones pub/sub | SNS |
| Mensajería | Bus de eventos entre servicios y apps | EventBridge |
| DevOps | Infraestructura como código (laC) | CloudFormation |
| DevOps | CI/CD: automatiza despliegues | CodePipeline/Build/Deploy |

## Infografías - servicios principales por bloque
Cuatro resúmenes visuales con los servicios más importantes para el examen, agrupados de forma que se
puedan repasar rápido.

### Cómputo y Almacenamiento
**AWS Cloud Practitioner resumen rápido**
*   **EC2:** Servidores virtuales escalables bajo demanda
*   **Lambda:** Ejecuta código sin servidores, pagás solo por uso
*   **Elastic Beanstalk:** Despliega apps web sin gestionar infraestructura
*   **ECS / EKS:** Orquestación de contenedores Docker/Kubernetes
*   **S3:** Almacenamiento de objetos escalable y duradero
*   **EBS:** Discos virtuales persistentes para EC2
*   **EFS:** Sistema de archivos compartido entre instancias
*   **Glacier:** Archivado a bajo costo, acceso lento

### Bases de Datos y Redes
**AWS Cloud Practitioner resumen rápido**
*   **RDS:** Bases de datos relacionales administradas (MySQL, PostgreSQL...)
*   **DynamoDB:** Base de datos NoSQL, alta escalabilidad
*   **Redshift:** Data warehouse para análisis de grandes datos
*   **ElastiCache:** Cache en memoria (Redis/Memcached)
*   **VPC:** Red privada aislada dentro de AWS
*   **Route 53:** Servicio DNS administrado
*   **CloudFront:** CDN: distribuye contenido con baja latencia
*   **ELB:** Distribuye tráfico entre varios recursos

### Seguridad, Identidad y Monitoreo
**AWS Cloud Practitioner resumen rápido**
*   **IAM:** Gestión de usuarios, roles y permisos
*   **Cognito:** Autenticación de usuarios para apps
*   **KMS:** Gestión de claves de cifrado
*   **Shield / WAF:** Protección DDoS y firewall de apps web
*   **CloudWatch:** Monitoreo de métricas, logs y alarmas
*   **CloudTrail:** Auditoría de todas las acciones/API
*   **Trusted Advisor:** Recomendaciones de costo, seguridad y rendimiento
*   **Config:** Rastrea configuración y cumplimiento

### Costos, Integración y DevOps
**AWS Cloud Practitioner resumen rápido**
*   **Cost Explorer:** Visualiza y proyecta gastos históricos
*   **Budgets:** Alertas y límites de presupuesto
*   **Pricing Calculator:** Estima costos antes de desplegar
*   **SQS:** Colas de mensajes para desacoplar componentes
*   **SNS:** Notificaciones pub/sub
*   **EventBridge:** Bus de eventos entre servicios y apps
*   **CloudFormation:** Infraestructura como código (lac)
*   **CodePipeline/Build/Deploy:** CI/CD: automatiza despliegues

## Descripción detallada de los servicios

### Cómputo
*   **Amazon EC2:** Servicio central de cómputo: servidores virtuales con distintas combinaciones de CPU, memoria y red. Se usa para alojar aplicaciones web, backends, entornos de desarrollo o procesamiento por lotes, eligiendo sistema operativo, tipo de instancia y modelo de pago (On-Demand, Reserved, Spot, Savings Plans).
*   **AWS Lambda:** Ejecuta código sin administrar servidores. Se dispara por eventos (S3, API Gateway, SQS, etc.) y solo se paga por el tiempo de cómputo usado. Ideal para tareas cortas, microservicios y automatizaciones.
*   **Elastic Beanstalk:** Plataforma como servicio (PaaS) que despliega apps web aprovisionando automáticamente EC2, balanceador y Auto Scaling, sin configurar cada pieza manualmente.
*   **ECS/EKS:** Orquestación de contenedores Docker (ECS) o Kubernetes administrado (EKS), para gestionar despliegue, escalado y networking de microservicios.
*   **Auto Scaling:** Ajusta automáticamente la cantidad de instancias según la demanda, agregando o quitando recursos para mantener rendimiento y optimizar costos.

### Almacenamiento
*   **Amazon S3:** Almacenamiento de objetos prácticamente ilimitado y muy duradero (99.999999999%). Se organiza en buckets y objetos, con distintas clases (Standard, Infrequent Access, Glacier). Base de hosting estático, backups y data lakes.
*   **Amazon EBS:** Discos virtuales persistentes conectados a instancias EC2, similares a un disco duro tradicional, usados cuando se necesita almacenamiento de bajo nivel que sobreviva reinicios.
*   **Amazon EFS:** Sistema de archivos compartido, montable simultáneamente en múltiples instancias EC2, útil cuando varias instancias necesitan acceder a los mismos archivos.
*   **S3 Glacier:** Almacenamiento de archivado a muy bajo costo, pensado para datos de acceso poco frecuente (backups, cumplimiento normativo), con tiempos de recuperación más largos.

### Bases de datos
*   **Amazon RDS:** Bases de datos relacionales administradas (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora), con backups automáticos, parches y replicación gestionados por AWS.
*   **Amazon DynamoDB:** Base de datos NoSQL totalmente administrada, con latencia muy baja y escalabilidad masiva, sin esquema fijo. Ideal para apps móviles, IoT o sistemas de sesiones.
*   **Amazon Redshift:** Data warehouse para análisis de grandes volúmenes de datos mediante consultas SQL complejas, típico en Bl y análisis empresarial.
*   **Amazon ElastiCache:** Caché en memoria (Redis/Memcached) que acelera aplicaciones reduciendo la carga sobre la base de datos principal.

### Redes y entrega de contenido
*   **Amazon VPC:** Red privada y aislada dentro de AWS, con subredes, tablas de rutas, gateways y reglas de seguridad. Base de la arquitectura de red de cualquier proyecto.
*   **Amazon Route 53:** Servicio DNS de AWS: traduce dominios en IPs, gestiona registro de dominios y políticas de enrutamiento (failover, geolocalización, etc.).
*   **Amazon CloudFront:** CDN que cachea contenido en ubicaciones cercanas a los usuarios finales, reduciendo latencia y carga sobre el servidor de origen.
*   **Elastic Load Balancing:** Distribuye automáticamente el tráfico entrante entre múltiples instancias, contenedores o funciones Lambda, mejorando disponibilidad y tolerancia a fallos.
*   **API Gateway:** Crea, publica y protege APIs (REST, HTTP, WebSocket) que suelen actuar como entrada hacia funciones Lambda u otros backends.

### Seguridad e identidad
*   **AWS IAM:** Servicio central para gestionar quién puede hacer qué en una cuenta: usuarios, grupos, roles y políticas de permisos. Uno de los más importantes del examen.
*   **Amazon Cognito:** Gestiona autenticación y autorización de usuarios finales en apps web y móviles, incluyendo login con proveedores externos.
*   **AWS KMS:** Administra las claves de cifrado usadas para proteger datos en distintos servicios (S3, EBS, RDS, etc.), permitiendo crear, rotar y controlar su acceso.
*   **AWS Shield y WAF:** Shield protege contra ataques DDoS; WAF filtra tráfico web malicioso mediante reglas personalizables.
*   **AWS Organizations:** Gestión centralizada de múltiples cuentas AWS: facturación consolidada, políticas de control y estructura jerárquica.

### Administración, monitoreo y cumplimiento
*   **Amazon CloudWatch:** Recolecta métricas, logs y eventos, permitiendo crear dashboards, alarmas y acciones automáticas (como escalar instancias).
*   **AWS CloudTrail:** Registra todas las llamadas a la API dentro de una cuenta (quién hizo qué, cuándo y desde dónde), fundamental para auditoría.
*   **AWS Trusted Advisor:** Analiza la cuenta y da recomendaciones automáticas sobre costos, seguridad, rendimiento y límites de servicio.
*   **AWS Config:** Rastrea y evalúa la configuración de recursos a lo largo del tiempo, útil para verificar cumplimiento de políticas.

### Costos y facturación
*   **Cost Explorer:** Permite visualizar, analizar y proyectar gastos con gráficos y filtros por servicio, cuenta o etiqueta.
*   **AWS Budgets:** Configura presupuestos personalizados y alertas cuando el gasto se acerca o supera un límite definido.
*   **Pricing Calculator:** Herramienta web para estimar el costo mensual de una arquitectura antes de desplegarla, clave para entender modelos de precios.

### Integración, mensajería y DevOps
*   **Amazon SQS:** Colas de mensajes que desacoplan componentes: un servicio envía mensajes y otro los procesa a su propio ritmo, mejorando resiliencia.
*   **Amazon SNS:** Patrón pub/sub: un servicio publica una notificación y todos los suscriptores (email, SMS, Lambda, SQS) la reciben automáticamente.
*   **Amazon EventBridge:** Bus de eventos que conecta aplicaciones en tiempo real, tanto de servicios AWS como de apps SaaS externas.
*   **AWS CloudFormation:** Infraestructura como código (laC) mediante plantillas JSON/YAML, para crear o actualizar arquitecturas completas de forma repetible.
*   **CodePipeline / CodeBuild/CodeDeploy:** Conjunto de herramientas CI/CD que automatizan compilación, prueba y despliegue cada vez que se actualiza el código.

## Servicios recomendados para practicar (gratis)
Estos son los servicios más importantes para practicar con el AWS Free Tier o con repositorios/simuladores gratuitos.

| Servicio | Cómo practicarlo gratis |
| :--- | :--- |
| EC2 | Free Tier: 750 hs/mes de instancia t2.micro/t3.micro por 12 meses |
| S3 | Free Tier: 5 GB de almacenamiento estándar por 12 meses |
| Lambda | Always free: 1 millón de solicitudes gratis por mes, de forma permanente |
| DynamoDB | Always free: 25 GB de almacenamiento, de forma permanente |
| RDS | Free Tier: 750 hs/mes de instancia db.t2.micro/t3.micro por 12 meses |
| IAM | Siempre gratis (ideal para practicar roles y políticas) |
| VPC | Siempre gratis crear la red (se cobran recursos como NAT Gateway) |
| CloudWatch | Free Tier: 10 métricas personalizadas y 5 GB de logs gratis por mes |
| CloudFormation | Sin costo por el servicio en sí (se cobra por los recursos creados) |
| SNS/SQS | Always free: 1 millón de solicitudes gratis por mes |

### Formas de practicar sin (o casi sin) usar la tarjeta
*   **AWS Free Tier oficial** - aws.amazon.com/free (requiere tarjeta para verificar, pero tiene servicios "always free" que nunca cobran dentro de los límites).
*   **AWS Skill Builder** - skillbuilder.aws: labs, cursos oficiales para el Cloud Practitioner y simuladores de examen.
*   **AWS Workshops** - workshops.aws: tutoriales guiados gratuitos usando tu propia cuenta Free Tier, paso a paso.
*   **LocalStack** (github.com/localstack/localstack) simula muchos servicios de AWS (S3, Lambda, DynamoDB, SQS, etc.) localmente con Docker, 100% gratis.
*   **AWS CDK Examples** (github.com/aws-samples/aws-cdk-examples) - ejemplos oficiales para desplegar arquitecturas reales con código.
*   **AWS SAM CLI** (github.com/aws/aws-sam-cli) herramienta oficial gratuita para probar apps serverless (Lambda + API Gateway) localmente antes de desplegar.

> **Recomendación:** configurar desde el primer día un Budget/alarma de billing (AWS Budgets, gratis) para recibir aviso por mail si te acercás a superar el Free Tier.
> *Nota: los límites del Free Tier son de referencia y AWS puede actualizarlos; conviene confirmarlos en aws.amazon.com/free antes de usarlos.*
