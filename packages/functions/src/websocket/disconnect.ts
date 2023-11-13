import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { logger } from 'src/util/logger';
import { Table } from 'sst/node/table';

import { AuthorizerContext } from './types';

const dynamoDb = new DynamoDBClient({});

export const main: APIGatewayProxyHandler = async (event) => {
  const { authorizer, connectionId } =
    event.requestContext as APIGatewayEventRequestContextWithAuthorizer<AuthorizerContext>;
  const params: DeleteItemCommandInput = {
    TableName: Table.WebsocketConnections.tableName,
    Key: {
      id: {
        S: connectionId as string,
      },
      userId: {
        S: authorizer.userId,
      },
    },
  };
  const command = new DeleteItemCommand(params);

  await dynamoDb.send(command);
  logger.info(`Websocket connection ${connectionId} for user ${authorizer.userId} destroyed`, {
    connectionId,
    userId: authorizer.userId,
  });

  return { statusCode: 200, body: 'Disconnected' };
};

export const handler = defaultLambdaMiddleware()(main);
