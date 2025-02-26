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

export interface Handler {
  id: string;
  resourceName: string;
  fileName?: string;
  method?: string;
  nestedHandlers?: Handler[];
}

export interface Integration {
  resourceName: string;
  lambdaIntegration?: LambdaIntegration;
  method?: string;
  nestedIntegrations?: Integration[];
}
