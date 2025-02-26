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
    {
      id: 'singleUpload',
      resourceName: 'single',
      nestedHandlers: [{ id: 'singleUpload', method: 'POST', resourceName: 'url', fileName: 'singleUploadHandler.ts' }],
    },
    {
      id: 'multipartUpload',
      resourceName: 'multipart',
      nestedHandlers: [
        {
          id: 'startMultipartUpload',
          method: 'POST',
          resourceName: 'start',
          fileName: 'startMultipartUploadhandler.ts',
        },
        { id: 'multipartUpload', method: 'POST', resourceName: 'url', fileName: 'multipartUploadHandler.ts' },
        {
          id: 'completeMultipartUpload',
          method: 'POST',
          resourceName: 'complete',
          fileName: 'completeMultipartUploadHandler.ts',
        },
      ],
    },
  ],
});
new ApiStack(app, 'uploadApiStack', {
  id: 'file-upload',
  integrations: uploadLambda.integrations,
});
