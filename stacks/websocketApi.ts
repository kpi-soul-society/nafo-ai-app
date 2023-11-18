import { Function, StackContext, use, WebSocketApi } from 'sst/constructs';

import { Dns } from './dns';
import { Dynamo } from './dynamo';

export function WebsocketApi({ stack, app }: StackContext) {
  const dynamo = use(Dynamo);
  const dns = use(Dns);
  const wsApi = new WebSocketApi(stack, 'WebsocketApi', {
    defaults: {
      function: {
        bind: [dynamo.websocketConnectionsTable],
      },
    },
    authorizer: {
      type: 'lambda',
      function: new Function(stack, 'Authorizer', {
        handler: 'packages/functions/src/websocket/authorizer.handler',
      }),
      identitySource: ['route.request.querystring.token'],
    },
    routes: {
      $connect: 'packages/functions/src/websocket/connect.handler',
      $default: 'packages/functions/src/websocket/default.handler',
      $disconnect: 'packages/functions/src/websocket/disconnect.handler',
      sendMessage: 'packages/functions/src/websocket/send-message.handler',
    },
    customDomain: dns.domainName
      ? {
          domainName: `ws-api-${app.stage}.${dns.domainName}`,
        }
      : undefined,
  });

  wsApi.bind([wsApi]);

  stack.addOutputs({
    WebsocketApiUrl: wsApi.customDomainUrl || wsApi.url,
  });

  return { api: wsApi, url: wsApi.url, customDomainUrl: wsApi.customDomainUrl };
}
