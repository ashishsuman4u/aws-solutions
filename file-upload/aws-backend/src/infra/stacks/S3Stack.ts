import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';

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
    });

    new CfnOutput(this, 'uploadBucketName', {
      value: this.uploadBucket.bucketName,
    });

    new CfnOutput(this, 'uploadBucketArn', {
      value: this.uploadBucket.bucketArn,
    });
  }
}
