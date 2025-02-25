import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../src/infra/stacks/LambdaStack';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { ApiStack } from '../src/infra/stacks/ApiStack';
import { CfnRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';

test('API Created', () => {
  const app = new cdk.App();
  const lambda = new LambdaStack(app, 'uploadLambda', {
    bucketName: 'uploadBucket',
  });
  const stack = new ApiStack(app, 'uploadapi', {
    lambdaIntegration: lambda.uploadLambdaIntegration,
  });

  const api = stack.node.tryFindChild('uploadapi');

  expect(api).toBeDefined();
  expect(api instanceof RestApi).toBe(true);
  expect(api?.node.defaultChild instanceof CfnRestApi).toBe(true);
});
