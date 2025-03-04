import { Stack, StackProps } from 'aws-cdk-lib';
import {
  RestApi,
  Cors,
  CfnAuthorizer,
  AuthorizationType,
  Authorizer,
  CognitoUserPoolsAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Integration } from '../../types';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import 'dotenv/config';

interface ApiStackProps extends StackProps {
  id: string;
  integrations: Integration[];
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, props.id);

    console.log(process.env.USER_POOL_ARN);
    const userPool = UserPool.fromUserPoolArn(this, 'UserPool', process.env.USER_POOL_ARN ?? '');
    const auth = new CognitoUserPoolsAuthorizer(this, 'upload-authorizer', {
      cognitoUserPools: [userPool],
    });

    props.integrations.forEach((integration) => {
      const uploadResource = api.root.addResource(integration.resourceName, {
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS,
          allowHeaders: Cors.DEFAULT_HEADERS,
        },
      });
      if (integration.nestedIntegrations?.length) {
        for (let index = 0; index < integration.nestedIntegrations.length; index++) {
          const nestedIntegration = integration.nestedIntegrations[index];
          const resource = uploadResource.addResource(nestedIntegration.resourceName, {
            defaultCorsPreflightOptions: {
              allowOrigins: Cors.ALL_ORIGINS,
              allowMethods: Cors.ALL_METHODS,
              allowHeaders: Cors.DEFAULT_HEADERS,
            },
          });
          resource.addMethod(nestedIntegration.method ?? '', nestedIntegration.lambdaIntegration, {
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO,
          });
        }
      } else {
        uploadResource.addMethod(integration.method ?? '', integration.lambdaIntegration, {
          authorizer: auth,
          authorizationType: AuthorizationType.COGNITO,
        });
      }
    });
  }
}
