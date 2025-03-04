import { S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Storage } from '../lib/storage';
import { getApiResponse } from '../lib/common';

const client = new S3Client({
  region: 'us-east-1',
});

const storage = new Storage(client, process.env.BUCKET_NAME ?? '');

const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const resBody = JSON.parse(event.body ? event.body : '');
    const response = await storage.completeMultipartUpload(resBody);

    return getApiResponse(200, response);
  } catch (error) {
    return getApiResponse(500, error);
  }
};

export { handler };
