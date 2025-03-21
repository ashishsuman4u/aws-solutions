import { App } from 'aws-cdk-lib';
import { ApiStack } from './stacks/ApiStack';
import { SQSStack } from './stacks/SQSStack';

const app = new App();

const asyncQueueStack = new SQSStack(app, 'asyncQueueStack');
new ApiStack(app, 'asyncApiStack', {
  id: 'async-upload',
  integration: {
    resourceName: 'async-upload',
    queueArn: asyncQueueStack.asyncQueue.queueArn,
    service: 'sqs',
    queueName: asyncQueueStack.asyncQueue.queueName,
    integrationHttpMethod: 'POST',
    messageType: 'application/x-www-form-urlencoded',
    messageTemplate: 'Action=SendMessage&MessageBody=$input.body',
  },
});
