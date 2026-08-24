import type { Localized } from "@/lib/types";

/**
 * Reference architecture diagrams, layered on top of `services.ts` without
 * touching it — same principle as `lib/domains.ts`. Each diagram is authored
 * as a plain Mermaid flowchart string, and `services` lists the exact
 * `Service.name` values that appear in it, used to cross-link from
 * DetailPanel ("aparece en estas arquitecturas").
 */

export type Architecture = {
  id: string;
  title: Localized;
  description: Localized;
  /** Service.name values (from data/services.ts) that appear in this diagram. */
  services: string[];
  mermaid: Localized;
};

export const ARCHITECTURES: Architecture[] = [
  {
    id: "web-3-capas",
    title: { es: "Web app clásica de 3 capas", en: "Classic 3-tier web app" },
    description: {
      es: "Un Application Load Balancer reparte tráfico entre instancias EC2 en un Auto Scaling Group, que leen y escriben en una base RDS Multi-AZ.",
      en: "An Application Load Balancer spreads traffic across EC2 instances in an Auto Scaling Group, which read and write to a Multi-AZ RDS database.",
    },
    services: ["EC2", "Auto Scaling", "RDS", "ELB"],
    mermaid: {
      es: `flowchart LR
    U[Usuario] --> ALB[Elastic Load Balancing]
    ALB --> EC2A[EC2 - AZ 1]
    ALB --> EC2B[EC2 - AZ 2]
    subgraph ASG[Auto Scaling Group]
      EC2A
      EC2B
    end
    EC2A --> RDS[(RDS Multi-AZ)]
    EC2B --> RDS`,
      en: `flowchart LR
    U[User] --> ALB[Elastic Load Balancing]
    ALB --> EC2A[EC2 - AZ 1]
    ALB --> EC2B[EC2 - AZ 2]
    subgraph ASG[Auto Scaling Group]
      EC2A
      EC2B
    end
    EC2A --> RDS[(RDS Multi-AZ)]
    EC2B --> RDS`,
    },
  },
  {
    id: "api-serverless",
    title: { es: "API serverless", en: "Serverless API" },
    description: {
      es: "Un cliente llama a API Gateway, que invoca una función Lambda; Lambda lee y escribe en DynamoDB. Sin servidores que administrar ni pagar en reposo.",
      en: "A client calls API Gateway, which invokes a Lambda function; Lambda reads and writes to DynamoDB. No servers to manage, and nothing paid while idle.",
    },
    services: ["API Gateway", "Lambda", "DynamoDB", "S3"],
    mermaid: {
      es: `flowchart LR
    U[Cliente] --> APIGW[API Gateway]
    APIGW --> L[Lambda]
    L --> DDB[(DynamoDB)]
    L --> S3[(S3 - assets)]`,
      en: `flowchart LR
    U[Client] --> APIGW[API Gateway]
    APIGW --> L[Lambda]
    L --> DDB[(DynamoDB)]
    L --> S3[(S3 - assets)]`,
    },
  },
  {
    id: "vpc-publica-privada",
    title: { es: "VPC con subred pública y privada", en: "VPC with a public and private subnet" },
    description: {
      es: "El tráfico entra por un Internet Gateway hasta un servidor web en la subred pública; la base de datos vive aislada en la subred privada, solo accesible desde el servidor web.",
      en: "Traffic enters through an Internet Gateway to a web server in the public subnet; the database lives isolated in the private subnet, reachable only from the web server.",
    },
    services: ["VPC", "EC2", "RDS"],
    mermaid: {
      es: `flowchart LR
    I[Internet] --> IGW[Internet Gateway]
    subgraph VPC[VPC 10.10.0.0/16]
      IGW --> R[Router]
      subgraph PUB[Subred pública 10.10.0.0/24]
        WEB[EC2 - Web server]
      end
      subgraph PRIV[Subred privada 10.10.2.0/24]
        DB[(RDS - DB server)]
      end
      R --> WEB
      WEB -- "puerto 3306" --> DB
    end`,
      en: `flowchart LR
    I[Internet] --> IGW[Internet Gateway]
    subgraph VPC[VPC 10.10.0.0/16]
      IGW --> R[Router]
      subgraph PUB[Public subnet 10.10.0.0/24]
        WEB[EC2 - Web server]
      end
      subgraph PRIV[Private subnet 10.10.2.0/24]
        DB[(RDS - DB server)]
      end
      R --> WEB
      WEB -- "port 3306" --> DB
    end`,
    },
  },
  {
    id: "sitio-estatico",
    title: { es: "Sitio estático con CDN", en: "Static site with CDN" },
    description: {
      es: "Los archivos del sitio (HTML, CSS, imágenes) viven en un bucket S3; CloudFront los distribuye desde ubicaciones cercanas al usuario, con baja latencia y sin servidores.",
      en: "The site's files (HTML, CSS, images) live in an S3 bucket; CloudFront distributes them from locations close to the user, with low latency and no servers.",
    },
    services: ["S3", "CloudFront"],
    mermaid: {
      es: `flowchart LR
    U[Usuario] --> CF[CloudFront]
    CF --> S3[(S3 - sitio estático)]`,
      en: `flowchart LR
    U[User] --> CF[CloudFront]
    CF --> S3[(S3 - static site)]`,
    },
  },
  {
    id: "auto-scaling-elastico",
    title: { es: "Auto Scaling ante demanda variable", en: "Auto Scaling under variable demand" },
    description: {
      es: "En vez de aprovisionar para el pico (capacidad fija, con desperdicio o cuellos de botella), un Auto Scaling Group agrega y quita instancias EC2 según la demanda real.",
      en: "Instead of provisioning for the peak (fixed capacity, with waste or bottlenecks), an Auto Scaling Group adds and removes EC2 instances based on real demand.",
    },
    services: ["EC2", "Auto Scaling"],
    mermaid: {
      es: `flowchart TB
    subgraph Fijo[Capacidad fija tradicional]
      direction LR
      D1[Demanda variable] -.-> C1[Recursos: constantes]
    end
    subgraph Elastico[Auto Scaling Group]
      direction LR
      D2[Demanda variable] --> C2[EC2 mínimo]
      D2 --> C3[EC2 según demanda]
      D2 --> C4[EC2 máximo]
    end
    Fijo --> Elastico`,
      en: `flowchart TB
    subgraph Fixed[Traditional fixed capacity]
      direction LR
      D1[Variable demand] -.-> C1[Resources: constant]
    end
    subgraph Elastic[Auto Scaling Group]
      direction LR
      D2[Variable demand] --> C2[EC2 minimum]
      D2 --> C3[EC2 based on demand]
      D2 --> C4[EC2 maximum]
    end
    Fixed --> Elastic`,
    },
  },
  {
    id: "rds-multi-az-replicas",
    title: { es: "RDS Multi-AZ con read replicas", en: "RDS Multi-AZ with read replicas" },
    description: {
      es: "La aplicación escribe siempre en la instancia primaria (AZ A), que replica de forma síncrona a un standby (AZ B) para failover automático, y de forma asíncrona a read replicas (AZ C) para descargar lecturas.",
      en: "The application always writes to the primary instance (AZ A), which replicates synchronously to a standby (AZ B) for automatic failover, and asynchronously to read replicas (AZ C) to offload reads.",
    },
    services: ["RDS"],
    mermaid: {
      es: `flowchart LR
    APP[Aplicación] -- escritura --> PRIM[(RDS primaria - AZ A)]
    APP -- lectura --> REPL[(RDS read replica - AZ C)]
    PRIM -- réplica síncrona --> STDBY[(RDS standby - AZ B)]
    PRIM -. réplica asíncrona .-> REPL`,
      en: `flowchart LR
    APP[Application] -- write --> PRIM[(RDS primary - AZ A)]
    APP -- read --> REPL[(RDS read replica - AZ C)]
    PRIM -- sync replication --> STDBY[(RDS standby - AZ B)]
    PRIM -. async replication .-> REPL`,
    },
  },
  {
    id: "contenedores-fargate",
    title: { es: "Contenedores serverless con ECS + Fargate", en: "Serverless containers with ECS + Fargate" },
    description: {
      es: "ECS orquesta los contenedores, pero Fargate se encarga de la capacidad: no hay instancias EC2 que administrar. Un balanceador reparte tráfico entre las tareas.",
      en: "ECS orchestrates the containers, but Fargate handles capacity: there are no EC2 instances to manage. A load balancer spreads traffic across the tasks.",
    },
    services: ["ECS", "Fargate", "ELB"],
    mermaid: {
      es: `flowchart LR
    U[Usuario] --> ALB[Elastic Load Balancing]
    subgraph ECSCL[Cluster ECS]
      ALB --> T1[Tarea - Fargate]
      ALB --> T2[Tarea - Fargate]
    end`,
      en: `flowchart LR
    U[User] --> ALB[Elastic Load Balancing]
    subgraph ECSCL[ECS Cluster]
      ALB --> T1[Task - Fargate]
      ALB --> T2[Task - Fargate]
    end`,
    },
  },
  {
    id: "mensajeria-desacoplada",
    title: { es: "Arquitectura desacoplada con colas y notificaciones", en: "Decoupled architecture with queues and notifications" },
    description: {
      es: "El productor no llama directo al consumidor: publica en SNS, que reparte a varias colas SQS. Cada consumidor procesa a su propio ritmo, sin bloquear al productor ni perder mensajes si está caído.",
      en: "The producer doesn't call the consumer directly: it publishes to SNS, which fans out to several SQS queues. Each consumer processes at its own pace, without blocking the producer or losing messages if it's down.",
    },
    services: ["SNS", "SQS", "Lambda"],
    mermaid: {
      es: `flowchart LR
    P[Servicio productor] --> SNS[SNS - topic]
    SNS --> Q1[SQS - cola pedidos]
    SNS --> Q2[SQS - cola facturación]
    Q1 --> L1[Lambda - procesa pedido]
    Q2 --> L2[Lambda - procesa factura]`,
      en: `flowchart LR
    P[Producer service] --> SNS[SNS - topic]
    SNS --> Q1[SQS - orders queue]
    SNS --> Q2[SQS - billing queue]
    Q1 --> L1[Lambda - processes order]
    Q2 --> L2[Lambda - processes invoice]`,
    },
  },
  {
    id: "monitoreo-autoscaling",
    title: { es: "Auto Scaling dirigido por métricas de CloudWatch", en: "Auto Scaling driven by CloudWatch metrics" },
    description: {
      es: "CloudWatch mide una métrica (por ejemplo CPU promedio) de las instancias; cuando cruza el umbral, dispara una alarma que le dice al Auto Scaling Group que agregue o quite capacidad.",
      en: "CloudWatch measures a metric (e.g. average CPU) across the instances; when it crosses the threshold, it fires an alarm that tells the Auto Scaling Group to add or remove capacity.",
    },
    services: ["CloudWatch", "Auto Scaling", "EC2"],
    mermaid: {
      es: `flowchart LR
    subgraph ASG[Auto Scaling Group]
      EC2A[EC2]
      EC2B[EC2]
    end
    EC2A --> CW[CloudWatch - métricas]
    EC2B --> CW
    CW --> AL["Alarma: CPU > 70%"]
    AL --> ASG`,
      en: `flowchart LR
    subgraph ASG[Auto Scaling Group]
      EC2A[EC2]
      EC2B[EC2]
    end
    EC2A --> CW[CloudWatch - metrics]
    EC2B --> CW
    CW --> AL["Alarm: CPU > 70%"]
    AL --> ASG`,
    },
  },
  {
    id: "seguridad-borde",
    title: { es: "Seguridad en el borde: WAF + Shield + CloudFront", en: "Security at the edge: WAF + Shield + CloudFront" },
    description: {
      es: "El tráfico entra primero por CloudFront; Shield filtra ataques DDoS a nivel de red, y WAF inspecciona cada request HTTP contra reglas (SQL injection, IPs bloqueadas) antes de dejarlo pasar al origen.",
      en: "Traffic enters through CloudFront first; Shield filters network-level DDoS attacks, and WAF inspects every HTTP request against rules (SQL injection, blocked IPs) before letting it through to the origin.",
    },
    services: ["CloudFront", "WAF", "Shield"],
    mermaid: {
      es: `flowchart LR
    U[Internet] --> SH[Shield - anti-DDoS]
    SH --> CF[CloudFront]
    CF --> WAF[WAF - reglas HTTP]
    WAF --> ORIG[Origen - ALB o S3]`,
      en: `flowchart LR
    U[Internet] --> SH[Shield - anti-DDoS]
    SH --> CF[CloudFront]
    CF --> WAF[WAF - HTTP rules]
    WAF --> ORIG[Origin - ALB or S3]`,
    },
  },
  {
    id: "multi-cuenta-iam",
    title: { es: "Multi-cuenta con Organizations e IAM", en: "Multi-account with Organizations and IAM" },
    description: {
      es: "Organizations agrupa las cuentas (prod, dev, seguridad) bajo facturación consolidada. Dentro de cada cuenta, IAM define roles con permisos mínimos en vez de compartir credenciales de la cuenta raíz.",
      en: "Organizations groups the accounts (prod, dev, security) under consolidated billing. Inside each account, IAM defines roles with minimal permissions instead of sharing root account credentials.",
    },
    services: ["Organizations", "IAM"],
    mermaid: {
      es: `flowchart TB
    ORG[Organizations - cuenta de gestión]
    ORG --> A1[Cuenta: Producción]
    ORG --> A2[Cuenta: Desarrollo]
    ORG --> A3[Cuenta: Seguridad]
    subgraph A1
      R1[IAM Role: Admin]
      R2[IAM Role: Solo lectura]
    end`,
      en: `flowchart TB
    ORG[Organizations - management account]
    ORG --> A1[Account: Production]
    ORG --> A2[Account: Development]
    ORG --> A3[Account: Security]
    subgraph A1
      R1[IAM Role: Admin]
      R2[IAM Role: Read-only]
    end`,
    },
  },
];

export function architecturesUsing(serviceName: string): Architecture[] {
  return ARCHITECTURES.filter((a) => a.services.includes(serviceName));
}
