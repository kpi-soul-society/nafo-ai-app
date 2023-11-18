import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';

import { AuthorizerContext } from './types';
import { postToUserWebSocketConnection } from './util';

const main: APIGatewayProxyHandler = async (event) => {
  const { authorizer, connectionId } =
    event.requestContext as APIGatewayEventRequestContextWithAuthorizer<AuthorizerContext>;

  if (!connectionId) {
    return { statusCode: 400, body: 'No connection specified' };
  }

  await postToUserWebSocketConnection(connectionId, authorizer.userId, 'pong');

  return { statusCode: 200, body: 'pong' };
};

export const handler = defaultLambdaMiddleware()(main);
