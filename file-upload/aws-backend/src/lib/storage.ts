import {
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  UploadPartCommand,
  UploadPartCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CompleteMultipartRequest, MultipartUploadRequest } from '../types';

export class Storage {
  client: S3Client;
  bucketName: string;
  constructor(client: S3Client, bucketName: string) {
    this.client = client;
    this.bucketName = bucketName;
  }

  startMultipartUpload = async (fileName: string, fileType: FILE_TYPE) => {
    const params: CreateMultipartUploadCommandInput = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    // add extra params if content type is video
    if (fileType == FILE_TYPE.VIDEO) {
      params.ContentDisposition = 'inline';
      params.ContentType = 'video/mp4';
    }
    const multipart = await this.client.send(new CreateMultipartUploadCommand(params));
    return multipart.UploadId;
  };

  createSinglepartPresignedUrl = async (key: string) => {
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new PutObjectCommand(params);
    return getSignedUrl(this.client, command, { expiresIn: 300 });
  };

  createMultipartPresignedUrl = async (key: string, requests: MultipartUploadRequest[]) => {
    const presignedUrls = [];
    for (let index = 0; index < requests.length; index++) {
      const request = requests[index];
      const params: UploadPartCommandInput = {
        Bucket: this.bucketName,
        Key: key,
        PartNumber: request.partNumber,
        UploadId: request.uploadId,
      };

      const command = new UploadPartCommand(params);
      presignedUrls.push(getSignedUrl(this.client, command, { expiresIn: 3600 }));
    }

    return Promise.all(presignedUrls);
  };

  completeMultipartUpload = async (request: CompleteMultipartRequest) => {
    const params: CompleteMultipartUploadCommandInput = {
      Bucket: this.bucketName,
      Key: request.fileName,
      UploadId: request.uploadId,
      MultipartUpload: {
        Parts: request.parts,
      },
    };
    return this.client.send(new CompleteMultipartUploadCommand(params));
  };
}
