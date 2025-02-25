import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../src/infra/stacks/LambdaStack';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';

test('Lambda Created', () => {
  const app = new cdk.App();
  const stack = new LambdaStack(app, 'uploadLambda', {
    bucketName: 'uploadBucket',
  });

  const lambda = stack.node.tryFindChild('uploadLambda');

  expect(lambda).toBeDefined();
  expect(lambda instanceof NodejsFunction).toBe(true);
  expect(lambda?.node.defaultChild instanceof CfnFunction).toBe(true);
});
