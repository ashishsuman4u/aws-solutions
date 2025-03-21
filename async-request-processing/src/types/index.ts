import { AwsIntegration } from 'aws-cdk-lib/aws-apigateway';

export interface Integration {
  resourceName: string;
  queueArn: string;
  service: string;
  queueName: string;
  integrationHttpMethod: string;
  messageType: string;
  messageTemplate: string;
}
