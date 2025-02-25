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
      const resources = integration.resourceName.split('/');
      if (resources.length > 2) {
        console.log('Invalid resource path - Depth should not be more than 2');
        return;
      }
      const uploadResource = api.root.addResource(resources[0]);
      if (resources.length > 1) {
        const resource = uploadResource.addResource(resources[1]);
        resource.addMethod(integration.method, integration.lambdaIntegration);
      } else {
        uploadResource.addMethod(integration.method, integration.lambdaIntegration);
      }
    });
  }
}
