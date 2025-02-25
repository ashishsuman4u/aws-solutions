import { S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Storage } from '../lib/storage';

const client = new S3Client({
  region: 'us-east-1',
});

const storage = new Storage(client, process.env.BUCKET_NAME ?? '');

const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const resBody = JSON.parse(event.body ? event.body : '');

    const presignedUrl = await storage.createSinglepartPresignedUrl(resBody.fileName);

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl: presignedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export { handler };
