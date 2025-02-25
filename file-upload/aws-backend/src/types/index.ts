import { CompletedPart } from '@aws-sdk/client-s3';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export interface MultipartUploadRequest {
  partNumber?: number;
  uploadId?: string;
}

export interface CompleteMultipartRequest {
  fileName: string;
  uploadId: string;
  parts: CompletedPart[];
}

export interface Integration {
  lambdaIntegration: LambdaIntegration;
  resourceName: string;
  method: string;
}
