import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket, HttpMethods, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { S3 } from '@aws-sdk/client-s3';

export class S3Stack extends Stack {
  public readonly uploadBucket: IBucket;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const suffix = getSuffixFromStack(this);

    this.uploadBucket = new Bucket(this, 'uploadBucket', {
      bucketName: `upload-bucket-${suffix}`,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      cors: [
        {
          allowedMethods: [HttpMethods.PUT, HttpMethods.HEAD, HttpMethods.GET],
          allowedOrigins: ['http://localhost:3000'],
          allowedHeaders: ['*'],
        },
      ],
    });

    new CfnOutput(this, 'uploadBucketName', {
      value: this.uploadBucket.bucketName,
    });

    new CfnOutput(this, 'uploadBucketArn', {
      value: this.uploadBucket.bucketArn,
    });
  }
}
