import * as cdk from 'aws-cdk-lib';
import { SQSStack } from '../src/infra/stacks/SQSStack';
import { CfnQueue, Queue } from 'aws-cdk-lib/aws-sqs';

test('Queue Created', () => {
  const app = new cdk.App();
  const queue = new SQSStack(app, 'asyncQueueStack');

  expect(queue).toBeDefined();
});
