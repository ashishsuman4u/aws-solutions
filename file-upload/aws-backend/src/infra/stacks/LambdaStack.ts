import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { Handler, Integration } from '../../types';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

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
      if (handler.nestedHandlers?.length) {
        const nestedIntegration: Integration[] = [];
        for (let j = 0; j < handler.nestedHandlers.length; j++) {
          const nestedHandler = handler.nestedHandlers[j];
          const uploadLambda = new NodejsFunction(this, nestedHandler.id, {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', nestedHandler.fileName ?? ''),
            environment: {
              BUCKET_NAME: props.bucketName,
            },
          });
          uploadLambda.addToRolePolicy(
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['s3:ListAllMyBuckets', 's3:ListBucket'],
              resources: [props.bucketArn],
            })
          );
          uploadLambda.addToRolePolicy(
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['s3:PutObject', 's3:PutObjectAcl', 's3:GetObject', 's3:GetObjectAcl'],
              resources: [`${props.bucketArn}/*`],
            })
          );
          nestedIntegration.push({
            lambdaIntegration: new LambdaIntegration(uploadLambda),
            resourceName: nestedHandler.resourceName,
            method: nestedHandler.method ?? '',
          });
        }
        this.integrations.push({
          nestedIntegrations: nestedIntegration,
          resourceName: handler.resourceName,
        });
      } else {
        const uploadLambda = new NodejsFunction(this, handler.id, {
          runtime: Runtime.NODEJS_22_X,
          handler: 'handler',
          entry: join(__dirname, '..', '..', 'services', handler.fileName ?? ''),
          environment: {
            BUCKET_NAME: props.bucketName,
          },
        });
        uploadLambda.addToRolePolicy(
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets', 's3:ListBucket'],
            resources: [props.bucketArn],
          })
        );
        uploadLambda.addToRolePolicy(
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:PutObject', 's3:PutObjectAcl', 's3:GetObject', 's3:GetObjectAcl'],
            resources: [`${props.bucketArn}/*`],
          })
        );
        this.integrations.push({
          lambdaIntegration: new LambdaIntegration(uploadLambda),
          resourceName: handler.resourceName,
          method: handler.method ?? '',
        });
      }
    }
  }
}
