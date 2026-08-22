/**
 * Reference architecture diagrams, layered on top of `services.ts` without
 * touching it — same principle as `lib/domains.ts`. Each diagram is authored
 * as a plain Mermaid flowchart string, and `services` lists the exact
 * `Service.name` values that appear in it, used to cross-link from
 * DetailPanel ("aparece en estas arquitecturas").
 */

export type Architecture = {
  id: string;
  title: string;
  description: string;
  /** Service.name values (from data/services.ts) that appear in this diagram. */
  services: string[];
  mermaid: string;
};

export const ARCHITECTURES: Architecture[] = [
  {
    id: "web-3-capas",
    title: "Web app clásica de 3 capas",
    description:
      "Un Application Load Balancer reparte tráfico entre instancias EC2 en un Auto Scaling Group, que leen y escriben en una base RDS Multi-AZ.",
    services: ["EC2", "Auto Scaling", "RDS", "ELB"],
    mermaid: `flowchart LR
    U[Usuario] --> ALB[Elastic Load Balancing]
    ALB --> EC2A[EC2 - AZ 1]
    ALB --> EC2B[EC2 - AZ 2]
    subgraph ASG[Auto Scaling Group]
      EC2A
      EC2B
    end
    EC2A --> RDS[(RDS Multi-AZ)]
    EC2B --> RDS`,
  },
  {
    id: "api-serverless",
    title: "API serverless",
    description:
      "Un cliente llama a API Gateway, que invoca una función Lambda; Lambda lee y escribe en DynamoDB. Sin servidores que administrar ni pagar en reposo.",
    services: ["API Gateway", "Lambda", "DynamoDB", "S3"],
    mermaid: `flowchart LR
    U[Cliente] --> APIGW[API Gateway]
    APIGW --> L[Lambda]
    L --> DDB[(DynamoDB)]
    L --> S3[(S3 - assets)]`,
  },
  {
    id: "vpc-publica-privada",
    title: "VPC con subred pública y privada",
    description:
      "El tráfico entra por un Internet Gateway hasta un servidor web en la subred pública; la base de datos vive aislada en la subred privada, solo accesible desde el servidor web.",
    services: ["VPC", "EC2", "RDS"],
    mermaid: `flowchart LR
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
  },
  {
    id: "sitio-estatico",
    title: "Sitio estático con CDN",
    description:
      "Los archivos del sitio (HTML, CSS, imágenes) viven en un bucket S3; CloudFront los distribuye desde ubicaciones cercanas al usuario, con baja latencia y sin servidores.",
    services: ["S3", "CloudFront"],
    mermaid: `flowchart LR
    U[Usuario] --> CF[CloudFront]
    CF --> S3[(S3 - sitio estático)]`,
  },
  {
    id: "auto-scaling-elastico",
    title: "Auto Scaling ante demanda variable",
    description:
      "En vez de aprovisionar para el pico (capacidad fija, con desperdicio o cuellos de botella), un Auto Scaling Group agrega y quita instancias EC2 según la demanda real.",
    services: ["EC2", "Auto Scaling"],
    mermaid: `flowchart TB
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
  },
  {
    id: "rds-multi-az-replicas",
    title: "RDS Multi-AZ con read replicas",
    description:
      "La aplicación escribe siempre en la instancia primaria (AZ A), que replica de forma síncrona a un standby (AZ B) para failover automático, y de forma asíncrona a read replicas (AZ C) para descargar lecturas.",
    services: ["RDS"],
    mermaid: `flowchart LR
    APP[Aplicación] -- escritura --> PRIM[(RDS primaria - AZ A)]
    APP -- lectura --> REPL[(RDS read replica - AZ C)]
    PRIM -- réplica síncrona --> STDBY[(RDS standby - AZ B)]
    PRIM -. réplica asíncrona .-> REPL`,
  },
  {
    id: "contenedores-fargate",
    title: "Contenedores serverless con ECS + Fargate",
    description:
      "ECS orquesta los contenedores, pero Fargate se encarga de la capacidad: no hay instancias EC2 que administrar. Un balanceador reparte tráfico entre las tareas.",
    services: ["ECS", "Fargate", "ELB"],
    mermaid: `flowchart LR
    U[Usuario] --> ALB[Elastic Load Balancing]
    subgraph ECSCL[Cluster ECS]
      ALB --> T1[Tarea - Fargate]
      ALB --> T2[Tarea - Fargate]
    end`,
  },
  {
    id: "mensajeria-desacoplada",
    title: "Arquitectura desacoplada con colas y notificaciones",
    description:
      "El productor no llama directo al consumidor: publica en SNS, que reparte a varias colas SQS. Cada consumidor procesa a su propio ritmo, sin bloquear al productor ni perder mensajes si está caído.",
    services: ["SNS", "SQS", "Lambda"],
    mermaid: `flowchart LR
    P[Servicio productor] --> SNS[SNS - topic]
    SNS --> Q1[SQS - cola pedidos]
    SNS --> Q2[SQS - cola facturación]
    Q1 --> L1[Lambda - procesa pedido]
    Q2 --> L2[Lambda - procesa factura]`,
  },
  {
    id: "monitoreo-autoscaling",
    title: "Auto Scaling dirigido por métricas de CloudWatch",
    description:
      "CloudWatch mide una métrica (por ejemplo CPU promedio) de las instancias; cuando cruza el umbral, dispara una alarma que le dice al Auto Scaling Group que agregue o quite capacidad.",
    services: ["CloudWatch", "Auto Scaling", "EC2"],
    mermaid: `flowchart LR
    subgraph ASG[Auto Scaling Group]
      EC2A[EC2]
      EC2B[EC2]
    end
    EC2A --> CW[CloudWatch - métricas]
    EC2B --> CW
    CW --> AL["Alarma: CPU > 70%"]
    AL --> ASG`,
  },
  {
    id: "seguridad-borde",
    title: "Seguridad en el borde: WAF + Shield + CloudFront",
    description:
      "El tráfico entra primero por CloudFront; Shield filtra ataques DDoS a nivel de red, y WAF inspecciona cada request HTTP contra reglas (SQL injection, IPs bloqueadas) antes de dejarlo pasar al origen.",
    services: ["CloudFront", "WAF", "Shield"],
    mermaid: `flowchart LR
    U[Internet] --> SH[Shield - anti-DDoS]
    SH --> CF[CloudFront]
    CF --> WAF[WAF - reglas HTTP]
    WAF --> ORIG[Origen - ALB o S3]`,
  },
  {
    id: "multi-cuenta-iam",
    title: "Multi-cuenta con Organizations e IAM",
    description:
      "Organizations agrupa las cuentas (prod, dev, seguridad) bajo facturación consolidada. Dentro de cada cuenta, IAM define roles con permisos mínimos en vez de compartir credenciales de la cuenta raíz.",
    services: ["Organizations", "IAM"],
    mermaid: `flowchart TB
    ORG[Organizations - cuenta de gestión]
    ORG --> A1[Cuenta: Producción]
    ORG --> A2[Cuenta: Desarrollo]
    ORG --> A3[Cuenta: Seguridad]
    subgraph A1
      R1[IAM Role: Admin]
      R2[IAM Role: Solo lectura]
    end`,
  },
];

export function architecturesUsing(serviceName: string): Architecture[] {
  return ARCHITECTURES.filter((a) => a.services.includes(serviceName));
}
