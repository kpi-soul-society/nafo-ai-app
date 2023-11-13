import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { logger } from 'src/util/logger';
import { Table } from 'sst/node/table';
import { WebSocketApi } from 'sst/node/websocket-api';

const dynamoDb = new DynamoDBClient({});
const apiG = new ApiGatewayManagementApiClient({
  endpoint: WebSocketApi.WebsocketApi.url.replace('wss://', 'https://'),
});

export const sendWebsocketMessageToUser = async <T>(userId: string, message: T) => {
  const input: ScanCommandInput = {
    TableName: Table.WebsocketConnections.tableName,
    ProjectionExpression: 'id',
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': { S: userId },
    },
  };
  const command = new ScanCommand(input);
  const userWebsocketConnections = (await dynamoDb.send(command)).Items?.map((item) => item.id.S) as string[];
  logger.info(`Found ${userWebsocketConnections.length} websocket connections for user ${userId}`, {
    userWebsocketConnections,
  });

  const results = await Promise.all(
    userWebsocketConnections.map(async (c) => await postToUserWebSocketConnection(c, userId, message))
  );
  const deliveredMessageStatusCodes = results.filter((r) => {
    return r;
  });

  return deliveredMessageStatusCodes;
};

const postToUserWebSocketConnection = async function (connectionId: string, userId: string, message: unknown) {
  try {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify(message) as unknown as Uint8Array,
    });
    // Send the message to the given client
    const res = await apiG.send(command);
    return res.$metadata.httpStatusCode;
  } catch (e: any) {
    logger.info('Error sending message via websocket', { e, message });
    if (e.statusCode === 410 || e?.name === 'GoneException') {
      const params: DeleteItemCommandInput = {
        TableName: Table.WebsocketConnections.tableName,
        Key: {
          id: {
            S: connectionId,
          },
          userId: {
            S: userId,
          },
        },
      };
      const command = new DeleteItemCommand(params);

      try {
        // Remove stale connections
        await dynamoDb.send(command);
      } catch (e) {
        logger.error('Error deleting stale connection', { e, connectionId, userId, message });
      }

      return null;
    }
  }
};
