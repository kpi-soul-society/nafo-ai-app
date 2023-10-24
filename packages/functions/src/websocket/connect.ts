import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { Table } from 'sst/node/table';

import { AuthorizerContext } from './types';

const dynamoDb = new DynamoDBClient({});

const main: APIGatewayProxyHandler = async (event) => {
  const { authorizer } = event.requestContext as APIGatewayEventRequestContextWithAuthorizer<AuthorizerContext>;

  const params: PutItemCommandInput = {
    TableName: Table.WebsocketConnections.tableName,
    Item: {
      id: {
        S: event.requestContext.connectionId as string,
      },
      userId: {
        S: authorizer.userId,
      },
    },
  };
  const command = new PutItemCommand(params);

  await dynamoDb.send(command);

  return { statusCode: 200, body: 'Connected' };
};

export const handler = defaultLambdaMiddleware()(main);
