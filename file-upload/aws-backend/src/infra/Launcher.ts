import { App } from 'aws-cdk-lib';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';
import { S3Stack } from './stacks/S3Stack';

const app = new App();
const uploadS3Bucket = new S3Stack(app, 'uploadBucket');
const uploadLambda = new LambdaStack(app, 'UploadLambdaStack', {
  bucketName: uploadS3Bucket.uploadBucket.bucketName,
  bucketArn: uploadS3Bucket.uploadBucket.bucketArn,
  handlers: [
    { id: 'singleUpload', method: 'POST', resourceName: 'single/url', name: 'singleUploadHandler.ts' },
    {
      id: 'startMultipartUpload',
      method: 'POST',
      resourceName: 'multipart/start',
      name: 'startMultipartUploadhandler.ts',
    },
    { id: 'multipartUpload', method: 'POST', resourceName: 'multipart/url', name: 'multipartUploadHandler.ts' },
    {
      id: 'completeMultipartUpload',
      method: 'POST',
      resourceName: 'multipart/complete',
      name: 'completeMultipartUploadHandler.ts',
    },
  ],
});
new ApiStack(app, 'uploadApiStack', {
  id: 'file-upload',
  integrations: uploadLambda.integrations,
});
