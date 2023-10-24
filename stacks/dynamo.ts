import { StackContext, Table } from 'sst/constructs';

export function Dynamo({ stack }: StackContext) {
  const websocketConnectionsTable = new Table(stack, 'WebsocketConnections', {
    fields: {
      id: 'string',
      userId: 'string',
    },
    primaryIndex: { partitionKey: 'id', sortKey: 'userId' },
  });

  return { websocketConnectionsTable };
}
