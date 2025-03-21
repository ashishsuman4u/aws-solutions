import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../src/infra/stacks/ApiStack';
import { CfnRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';

test('API Created', () => {
  const app = new cdk.App();
  const stack = new ApiStack(app, 'asyncApiStack', {
    id: 'async-upload',
    integration: {
      resourceName: 'async-upload',
      queueArn: 'arn',
      service: 'sqs',
      queueName: 'async-queue',
      integrationHttpMethod: 'POST',
      messageType: 'application/x-www-form-urlencoded',
      messageTemplate: 'Action=SendMessage&MessageBody=$input.body',
    },
  });

  const api = stack.node.tryFindChild('async-upload');

  expect(api).toBeDefined();
  expect(api instanceof RestApi).toBe(true);
  expect(api?.node.defaultChild instanceof CfnRestApi).toBe(true);
});
