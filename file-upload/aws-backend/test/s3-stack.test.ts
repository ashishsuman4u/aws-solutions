import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { S3Stack } from '../src/infra/stacks/S3Stack';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
test('S3 Bucket Created', () => {
  const app = new cdk.App();
  const stack = new S3Stack(app, 'uploadBucket');

  const bucket = stack.node.tryFindChild('uploadBucket');

  expect(bucket).toBeDefined();
  expect(bucket instanceof Bucket).toBe(true);
  expect(bucket?.node.defaultChild instanceof CfnBucket).toBe(true);
});
