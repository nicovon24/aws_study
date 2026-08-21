export const RELATIONS: [string, string][] = [
  ["EC2","EBS"],["EC2","ELB"],["EC2","VPC"],["EC2","CloudWatch"],["EC2","IAM"],["EC2","ECS"],["EC2","EKS"],
  ["Lambda","API Gateway"],["Lambda","S3"],["Lambda","DynamoDB"],["Lambda","SQS"],["Lambda","SNS"],["Lambda","EventBridge"],["Lambda","Step Functions"],["Lambda","CloudWatch"],["Lambda","Kinesis"],
  ["S3","CloudFront"],["S3","Athena"],["S3","S3 Glacier"],["S3","KMS"],
  ["ECS","ECR"],["EKS","ECR"],["ECS","Fargate"],["EKS","Fargate"],
  ["RDS","VPC"],["RDS","KMS"],["RDS","Secrets Manager"],["RDS","CloudWatch"],
  ["Aurora","RDS"],
  ["CloudFront","WAF"],["CloudFront","Route 53"],["API Gateway","Cognito"],["API Gateway","WAF"],
  ["SQS","SNS"],["EventBridge","Step Functions"],
  ["EBS","KMS"],
  ["Athena","QuickSight"],["Kinesis","S3"],
  ["ELB","VPC"],["ELB","EC2"],
  ["CloudTrail","CloudWatch"],["Config","CloudWatch"],
  ["Bedrock","Lambda"],["SageMaker","S3"],
  // --- cómputo y contenedores ---
  ["Auto Scaling","EC2"],["Auto Scaling","ELB"],["Auto Scaling","CloudWatch"],
  ["Elastic Beanstalk","EC2"],["Elastic Beanstalk","ELB"],["Elastic Beanstalk","Auto Scaling"],
  ["App Runner","ECR"],["Batch","ECS"],["Batch","EC2"],["Lightsail","EC2"],
  // --- almacenamiento ---
  ["EFS","EC2"],["EFS","VPC"],["FSx","VPC"],["Storage Gateway","S3"],["EBS","EC2"],
  // --- migración y transferencia ---
  ["Snow Family","S3"],["DataSync","S3"],["DataSync","EFS"],["DMS","RDS"],["DMS","Aurora"],
  // --- bases de datos ---
  ["Redshift","S3"],["Redshift","QuickSight"],["ElastiCache","RDS"],["ElastiCache","VPC"],["Neptune","VPC"],
  // --- redes ---
  ["Direct Connect","VPC"],["Route 53","ELB"],["VPC","IAM"],
  // --- seguridad ---
  ["Shield","CloudFront"],["Shield","Route 53"],["CloudHSM","VPC"],["Cognito","IAM"],
  ["IAM Identity Center","IAM"],["IAM Identity Center","Organizations"],
  ["Control Tower","Organizations"],["Control Tower","Config"],["Control Tower","IAM Identity Center"],
  ["GuardDuty","CloudTrail"],["GuardDuty","VPC"],["Inspector","EC2"],["Inspector","ECR"],
  ["Macie","S3"],["Artifact","Shared Responsibility"],
  // --- administración ---
  ["Organizations","IAM"],["Trusted Advisor","Support Plans"],["Trusted Advisor","Cost Explorer"],
  ["Personal Health Dashboard","CloudWatch"],["Config","CloudTrail"],
  // --- analítica y ML ---
  ["EMR","S3"],["QuickSight","Athena"],["Rekognition","S3"],["Textract","S3"],["Comprehend","S3"],
  // --- herramientas dev ---
  ["CodePipeline","CodeBuild"],["CodePipeline","CodeDeploy"],["CodePipeline","CodeCommit"],
  ["CodeBuild","ECR"],["CodeDeploy","EC2"],["CodeDeploy","Lambda"],["CodeDeploy","ECS"],
  ["CloudFormation","IAM"],["Systems Manager","EC2"],["Systems Manager","Secrets Manager"],
  // --- costos y fundamentos ---
  ["Budgets","Cost Explorer"],["Budgets","SNS"],["Pricing Calculator","Modelo de precios"],
  ["Cost Explorer","Organizations"],["Marketplace","EC2"],
  ["Infraestructura global","VPC"],["Infraestructura global","CloudFront"],["Infraestructura global","Well-Architected"],
  ["Well-Architected","Shared Responsibility"],["AWS CAF","Well-Architected"],
  ["Modelo de precios","EC2"],["Support Plans","Personal Health Dashboard"],
];

export default RELATIONS;
