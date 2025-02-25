import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { Integration } from '../../types';

interface Handler {
  id: string;
  name: string;
  resourceName: string;
  method: string;
}

interface LambdaStackProps extends StackProps {
  handlers: Handler[];
  bucketName: string;
  bucketArn: string;
}

export class LambdaStack extends Stack {
  public readonly integrations: Integration[] = [];
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    for (let index = 0; index < props.handlers.length; index++) {
      const handler = props.handlers[index];
      const uploadLambda = new NodejsFunction(this, handler.id, {
        runtime: Runtime.NODEJS_22_X,
        handler: 'handler',
        entry: join(__dirname, '..', '..', 'services', handler.name),
        environment: {
          BUCKET_NAME: props.bucketName,
          BUCKET_ARN: props.bucketArn,
        },
      });
      this.integrations.push({
        lambdaIntegration: new LambdaIntegration(uploadLambda),
        resourceName: handler.resourceName,
        method: handler.method,
      });
    }
  }
}
