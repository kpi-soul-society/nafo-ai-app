import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { SessionValue, useSession } from 'sst/node/auth';
import { GraphQLHandler } from 'sst/node/graphql';

import { schema } from './schema';

const graphqlHandler = GraphQLHandler<SessionValue>({
  schema,
  context: async (): Promise<SessionValue> => {
    const session = useSession();

    return session;
  },
});

export const handler = defaultLambdaMiddleware()(graphqlHandler);
