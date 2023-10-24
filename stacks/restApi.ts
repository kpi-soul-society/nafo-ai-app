import { HttpIntegrationSubtype, MappingValue, ParameterMapping } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Api, Function, StackContext, use } from 'sst/constructs';

import { Dns } from './dns';
import { Events } from './events';
import { S3 } from './s3';
import { Sqs } from './sqs';

export function RestApi({ stack, app }: StackContext) {
  const sqs = use(Sqs);
  const s3 = use(S3);
  const dns = use(Dns);
  const events = use(Events);

  const api = new Api(stack, 'RestApi', {
    routes: {
      'POST /creations/generations/dispatch': {
        function: 'packages/functions/src/creations/generations/dispatch.handler',
      },
      'GET /creations/{id}': {
        function: 'packages/functions/src/creations/:id/fetch-by-id.handler',
      },
      'POST /creations/generations/dispatch/mock': {
        function: 'packages/functions/src/creations/generations/mock.handler',
      },
      'ANY /payments/callback/fondy': {
        function: 'packages/functions/src/payments/callback.handler',
      },
      'POST /payments/checkout/session': {
        function: 'packages/functions/src/payments/checkout/create-session.handler',
      },

      'POST /creations/webhook': {
        type: 'aws',
        authorizer: 'apiKeyAuthorizer',
        cdk: {
          integration: {
            subtype: HttpIntegrationSubtype.SQS_SEND_MESSAGE,
            parameterMapping: ParameterMapping.fromObject({
              MessageBody: MappingValue.custom('$request.body'),
              QueueUrl: MappingValue.custom(sqs.creationWebhookQueue.queueUrl),
            }),
          },
        },
      },
      'GET /session': 'packages/functions/src/session.handler',
      'PATCH /users/{userId}': 'packages/functions/src/users/update.handler',
      'POST /errors/web/notify': 'packages/functions/src/notifications/web/error.handler',

      'POST /graphql': {
        type: 'graphql',
        function: {
          handler: 'packages/functions/src/graphql/graphql.handler',
        },
        pothos: {
          schema: 'packages/functions/src/graphql/schema.ts',
          output: 'packages/graphql/schema.graphql',
          commands: ['cd packages/graphql && npx @genql/cli --output ./genql --schema ./schema.graphql --esm'],
        },
      },
    },
    customDomain: dns.domainName
      ? {
          domainName: `api-${app.stage}.${dns.domainName}`,
        }
      : undefined,
    authorizers: {
      apiKeyAuthorizer: {
        type: 'lambda',
        function: new Function(stack, 'ApiKeyAuthorizer', {
          handler: 'packages/functions/src/auth/api-key-authorizer.handler',
        }),
      },
    },
  });

  api.bind([s3.creationsBucket, sqs.creationGenerationQueue, events.bus]);

  stack.addOutputs({
    RestApiEndpoint: api.customDomainUrl || api.url,
  });

  return api;
}
