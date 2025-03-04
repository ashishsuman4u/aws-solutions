# Welcome to File Upload project

This is the AWS Serverless backend for file-upload project. This has the CDK setup for deploying APIGateway, Lambda and S3 along with the permissions needed to access it. For now I have kept all the permissions to \* (ALL) to make things simplier for everyone.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

# Environment variable

USER_POOL_ARN - Cognito user pool arn to be used for cognito authorizer.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
- `npx cdk destroy` destroy this stack in your default AWS account/region
