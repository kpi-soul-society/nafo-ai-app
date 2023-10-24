import { User } from '@nafo-ai/core/user';
import { APIGatewayRequestAuthorizerEvent, APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { logger } from 'src/util/logger';
import { SessionValue } from 'sst/node/auth';

const main: APIGatewayRequestAuthorizerHandler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const methodArn = event.methodArn;

  const deny = (msg: string) => {
    return { message: msg, policyDocument: generatePolicy(methodArn, false), principalId: 'user' };
  };

  // get access token from query string
  const queryParams = event.queryStringParameters;
  if (!queryParams) {
    return deny('missing queryStringParameters');
  }
  if (!queryParams.token) {
    return deny('missing token in query string');
  }
  const token = queryParams.token;

  if (!token || !token.length) {
    return deny('empty token');
  }

  // decode and verify token
  let decodedToken: SessionValue;
  try {
    decodedToken = parseJwt(token);
  } catch (error) {
    logger.error('Error parsing JWT', { error, token });
    return deny('Invalid or expired token');
  }

  if (decodedToken.type !== 'user') {
    return deny('Not authenticated');
  }

  const userId = decodedToken.properties.userId;
  if (!userId) {
    return deny('Invalid JWT, missing userId');
  }

  // get user to pass to the websocket handler
  const user = await User.getOne({ id: userId });
  if (!user) {
    return deny("Couldn't find user with userId");
  }

  // allow access
  const policy = generatePolicy(event.methodArn as string, true);
  const context = {
    userId: user.id,
  };
  const res = {
    principalId: userId,
    policyDocument: policy,
    context: context,
  };
  return res;
};

const generatePolicy = (methodArn: string, allow: boolean) => {
  const effect = allow ? 'Allow' : 'Deny';
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };
};

const parseJwt = (token: string): SessionValue => {
  const parsedToken: SessionValue = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

  return parsedToken;
};

export const handler = defaultLambdaMiddleware()(main);
