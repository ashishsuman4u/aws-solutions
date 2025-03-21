import { Stack, StackProps } from 'aws-cdk-lib';
import {
  RestApi,
  Cors,
  CfnAuthorizer,
  AuthorizationType,
  Authorizer,
  CognitoUserPoolsAuthorizer,
  AwsIntegration,
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Integration } from '../../types';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import 'dotenv/config';
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { PassthroughBehavior } from 'aws-cdk-lib/aws-apigatewayv2';

interface ApiStackProps extends StackProps {
  id: string;
  integration: Integration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, props.id);

    // const userPool = UserPool.fromUserPoolArn(this, 'UserPool', process.env.USER_POOL_ARN ?? '');
    // const auth = new CognitoUserPoolsAuthorizer(this, 'upload-authorizer', {
    //   cognitoUserPools: [userPool],
    // });

    const credentialsRole = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    credentialsRole.attachInlinePolicy(
      new Policy(this, 'SendMessagePolicy', {
        statements: [
          new PolicyStatement({
            actions: ['sqs:SendMessage'],
            effect: Effect.ALLOW,
            resources: [props.integration.queueArn],
          }),
        ],
      })
    );

    const asyncResource = api.root.addResource(props.integration.resourceName, {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });
    asyncResource.addMethod(
      props.integration.integrationHttpMethod,
      new AwsIntegration({
        service: props.integration.service,
        integrationHttpMethod: props.integration.integrationHttpMethod,
        path: `${process.env.CDK_DEFAULT_ACCOUNT}/${props.integration.queueName}`,
        options: {
          credentialsRole,
          passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
          requestParameters: {
            'integration.request.header.Content-Type': `'${props.integration.messageType}'`,
          },
          requestTemplates: {
            'application/json': props.integration.messageTemplate,
          },
          integrationResponses: [
            {
              statusCode: '200',
              responseTemplates: {
                'application/json': '',
              },
            },
          ],
        },
      }),
      {
        methodResponses: [
          {
            statusCode: '400',
          },
          {
            statusCode: '200',
          },
          {
            statusCode: '500',
          },
        ],
      }
      // ,{
      //   authorizer: auth,
      //   authorizationType: AuthorizationType.COGNITO,
      // }
    );
  }
}
