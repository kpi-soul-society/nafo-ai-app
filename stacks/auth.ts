import { Api, Auth, Config, StackContext, use } from 'sst/constructs';

import { RestApi } from './restApi';
import { Web } from './web';

export function Authentication({ stack }: StackContext) {
  const api = use(RestApi);
  const site = use(Web);

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
    throw new Error('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler',
      bind: [
        site,
        new Config.Parameter(stack, 'GOOGLE_CLIENT_ID', {
          value: process.env.GOOGLE_CLIENT_ID,
        }),
      ],
    },
  });

  auth.attach(stack, {
    // @ts-expect-error - Property 'apiKeyAuthorizer' is missing in type 'Record<string, ApiAuthorizer>' but required in type '{ apiKeyAuthorizer: { type: "lambda"; function: Function; }; }'
    api: api,
    prefix: '/auth',
  });

  return auth;
}
