import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { Table } from 'sst/node/table';

import { AuthorizerContext } from './types';

const dynamoDb = new DynamoDBClient({});

export const main: APIGatewayProxyHandler = async (event) => {
  const { authorizer } = event.requestContext as APIGatewayEventRequestContextWithAuthorizer<AuthorizerContext>;
  const params: DeleteItemCommandInput = {
    TableName: Table.WebsocketConnections.tableName,
    Key: {
      id: {
        S: event.requestContext.connectionId as string,
      },
      userId: {
        S: authorizer.userId,
      },
    },
  };
  const command = new DeleteItemCommand(params);

  await dynamoDb.send(command);

  return { statusCode: 200, body: 'Disconnected' };
};

export const handler = defaultLambdaMiddleware()(main);
