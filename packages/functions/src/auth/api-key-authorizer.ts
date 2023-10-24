import { APIGatewayRequestAuthorizerEvent, APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { Config } from 'sst/node/config';

const apiKeyAuthorizer: APIGatewayRequestAuthorizerHandler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const methodArn = event.methodArn;

  const deny = (msg: string) => {
    return { message: msg, policyDocument: generatePolicy(methodArn, false), principalId: 'user' };
  };

  const apiKey = event.headers?.['authorization'];

  if (!apiKey) {
    return deny('missing api key');
  }
  if (!apiKey.length) {
    return deny('empty api key');
  }
  if (apiKey !== Config.REST_API_KEY) {
    return deny('invalid api key');
  }

  const policy = generatePolicy(event.methodArn as string, true);
  const context = {};
  const res = {
    principalId: 'user',
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

export const handler = defaultLambdaMiddleware()(apiKeyAuthorizer);
