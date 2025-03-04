import axios from 'axios';
import { isPdf, isVideo } from './utils';

export interface MultipartUploadRequest {
  partNumber?: number;
  uploadId?: string;
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
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    return response;
  }
}

export async function handleMultipartUpload(file: File | null, token: string | undefined) {
  let fileType = 'IMAGE';
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

    const parts = file.size / 10000000 + (file.size % 10000000 > 0 ? 1 : 0);
    const multipartRequest: MultipartUploadRequest[] = [];
    for (let index = 0; index < parts; index++) {
      multipartRequest.push({
        partNumber: index,
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

    const presignedUrls = presignedUrlsResponse.data?.presignedUrls;

    console.log('presignedUrls', presignedUrls);

    // for (let index = 0; index < presignedUrls.length; index++) {
    //   const presignedUrl = presignedUrls[index];
    //   const response = await client.put(
    //     presignedUrl.data.uploadUrls,
    //     {
    //       data: file,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/octet-stream',
    //         Authorization: token,
    //       },
    //     }
    //   );
    // }

    return response;
  }
}
