import axios from 'axios';
import { isPdf, isVideo } from './utils';

export interface MultipartUploadRequest {
  partNumber?: number;
  uploadId?: string;
}

export interface CompletedPart {
  ETag: string;
  PartNumber: number;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export async function handleSingleUpload(file: File | null, token: string | undefined) {
  if (file) {
    const presignedUrl = await client.post(
      '/single/url',
      { fileName: file.name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response = await client.put(
      presignedUrl.data.uploadUrls,
      {
        data: file,
      },
      {
        headers: {
          'Content-Type': file.type,
        },
      }
    );

    return response;
  }
}

export async function handleMultipartUpload(file: File | null, token: string | undefined) {
  let fileType = 'IMAGE';
  const chunkSize = 10000000;
  if (file) {
    if (isVideo(file.name)) {
      fileType = 'VIDEO';
    } else if (isPdf(file.name)) {
      fileType = 'PDF';
    }
    const uploadStartResponse = await client.post(
      '/multipart/start',
      { fileName: file.name, fileType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const uploadId = uploadStartResponse?.data?.uploadId;

    const parts = Math.ceil(file.size / chunkSize);
    const multipartRequest: MultipartUploadRequest[] = [];
    for (let index = 0; index < parts; index++) {
      multipartRequest.push({
        partNumber: index + 1,
        uploadId,
      });
    }
    console.log('multipartRequest', multipartRequest);
    const presignedUrlsResponse = await client.post(
      '/multipart/url',
      { fileName: file.name, multipartRequest },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('presignedUrlsResponse', presignedUrlsResponse);
    const presignedUrls = presignedUrlsResponse.data?.uploadUrls;
    console.log('presignedUrls', presignedUrls);

    const uploadPromises = [];
    for (let index = 0; index < parts; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      console.log(chunk.size);
      const presignedUrl = presignedUrls[index];
      uploadPromises.push(
        client.put(
          presignedUrl,
          {
            data: chunk,
          },
          {
            headers: {
              'Content-Type': file.type,
            },
          }
        )
      );
    }
    const uploadResponses = await Promise.all(uploadPromises);
    console.log(uploadResponses);

    const partsResponse: CompletedPart[] = [];
    uploadResponses.forEach((response, i) => {
      partsResponse.push({
        ETag: response.headers.etag.replaceAll('"', ''),
        PartNumber: i + 1,
      });
    });

    console.log('partsResponse - ', partsResponse);

    const uploadCompleteResponse = await client.post(
      '/multipart/complete',
      { fileName: file.name, uploadId, parts: partsResponse },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(uploadCompleteResponse);
    return uploadCompleteResponse;
  }
}
