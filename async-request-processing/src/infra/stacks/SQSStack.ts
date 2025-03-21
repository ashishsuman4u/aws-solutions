import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';

export class SQSStack extends Stack {
  public readonly asyncQueue: IQueue;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const suffix = getSuffixFromStack(this);

    this.asyncQueue = new Queue(this, 'asyncQueue', {
      queueName: `async-queue-${suffix}`,
    });

    new CfnOutput(this, 'asyncQueueName', {
      value: this.asyncQueue.queueName,
    });

    new CfnOutput(this, 'asyncQueueArn', {
      value: this.asyncQueue.queueArn,
    });

    new CfnOutput(this, 'asyncQueueUrl', {
      value: this.asyncQueue.queueUrl,
    });
  }
}
