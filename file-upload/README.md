# File upload

Uploading files to server is one of the most commonly used scenario in modern world. Whether we upload a profile picture on any social website or share our vacation picture with our friends, we are uploading a file to server.

## What has been covered?

This project contains the code for the use case where we can upload a file to a private S3 bucket in AWS. For this we have used API Gateway and Lambda to create backend APIs that manage the urls needed for getting the presigned url. If the file size is less that 10MB, the file will be uploaded in single call but in case of file with size more than 10MB, the frontend divides the file in the chunks of 10MB or less to upload it in parallel through multipart upload. All the files are getting uploaded in a private S3 bucket through presigned S3 url(s).

## Files and folders

### aws-backend (folder)

This folder contains the AWS backend code that is used to create the serverless APIs. These APIs are being used by the frontend to either get a presigned url(s) needed for the upload or to manage the multipart upload workflow. The entire stack can be created or destroyed through AWS-CDK.

### uploader.app (folder)

This folder contains the frontend code that is making the request to AWS backend and uploading the file to S3 using the presigned urls.

## Key Metrics

### - Availability

The whole backend system is highly available. Most of the services used like API Gateway, Lambda and S3 has more than 99% availability.

### - Scalability

API Gateway and S3 are infinitely scalable. The only part that has some limited scaling is the Lambda which we can replace with containers (ECS/EKS) with AWS Fargate option for better scalability and cost.

### - Maintainability

The system is highly maintainable as it is cloud-native.

### - Security

We have basic authentication setup through Cognito. This can be further improved by RBAC.

### - Estimated Cost

With 1 million API + Lambda request from 10000 Active users storing 1000GB of S3 data, it would cost around 26 USD.