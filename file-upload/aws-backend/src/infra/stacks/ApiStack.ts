import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Integration } from '../../types';

interface ApiStackProps extends StackProps {
  id: string;
  integrations: Integration[];
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, props.id);
    props.integrations.forEach((integration) => {
      const uploadResource = api.root.addResource(integration.resourceName);
      if (integration.nestedIntegrations?.length) {
        for (let index = 0; index < integration.nestedIntegrations.length; index++) {
          const nestedIntegration = integration.nestedIntegrations[index];
          const resource = uploadResource.addResource(nestedIntegration.resourceName);
          resource.addMethod(nestedIntegration.method ?? '', nestedIntegration.lambdaIntegration);
        }
      } else {
        uploadResource.addMethod(integration.method ?? '', integration.lambdaIntegration);
      }
    });
  }
}
