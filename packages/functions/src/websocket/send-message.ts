import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { logger } from 'src/util/logger';
import { Table } from 'sst/node/table';

import { AuthorizerContext } from './types';

const TableName = Table.WebsocketConnections.tableName;
const dynamoDb = new DynamoDBClient({});

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse(event.body as string).data;

  const { stage, domainName, authorizer } =
    event.requestContext as APIGatewayEventRequestContextWithAuthorizer<AuthorizerContext>;
  const apiG = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`,
  });
  const input: ScanCommandInput = {
    TableName,
    ProjectionExpression: 'id',
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': { S: authorizer.userId },
    },
  };
  const command = new ScanCommand(input);
  const connections = (await dynamoDb.send(command)).Items?.map((item) => item.id.S) as string[];

  const postToConnection = async function (id: string) {
    try {
      const command = new PostToConnectionCommand({ ConnectionId: id, Data: messageData });
      // Send the message to the given client
      await apiG.send(command);
    } catch (e: any) {
      logger.info('Error', { e });
      if (e.statusCode === 410) {
        const params: DeleteItemCommandInput = {
          TableName: Table.WebsocketConnections.tableName,
          Key: {
            id: {
              S: id,
            },
            userId: {
              S: authorizer.userId,
            },
          },
        };
        const command = new DeleteItemCommand(params);

        // Remove stale connections
        await dynamoDb.send(command);
      }
    }
  };

  // Iterate through all the connections
  await Promise.all(connections.map(postToConnection));

  return { statusCode: 200, body: 'Message sent' };
};

export const handler = defaultLambdaMiddleware()(main);
