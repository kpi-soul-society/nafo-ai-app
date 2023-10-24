import { EventBus, StackContext, use } from 'sst/constructs';

import { Dynamo } from './dynamo';
import { WebsocketApi } from './websocketApi';

export function Events({ stack }: StackContext) {
  const dynamo = use(Dynamo);
  const websocketApi = use(WebsocketApi);

  const bus = new EventBus(stack, 'bus', {
    defaults: {
      retries: 10,
    },
  });

  bus.subscribe('user.payment-status-updated', {
    handler: 'packages/functions/src/events/user/payment-status-updated.handler',
    bind: [bus, websocketApi.api, dynamo.websocketConnectionsTable],
  });

  bus.subscribe('user.payment-status-updated', {
    handler: 'packages/functions/src/events/user/payment-received-notification.handler',
    bind: [bus],
  });

  bus.subscribe('creation.completion-status-updated', {
    handler: 'packages/functions/src/events/creation/creation-completion-status-updated.handler',
    bind: [bus, websocketApi.api, dynamo.websocketConnectionsTable],
  });

  bus.subscribe('support.request-created', {
    handler: 'packages/functions/src/events/support/request-created.handler',
    bind: [bus],
  });

  return { bus };
}
