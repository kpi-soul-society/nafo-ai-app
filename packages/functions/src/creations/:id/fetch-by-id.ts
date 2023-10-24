import { Creation } from '@nafo-ai/core/creation';
import { User } from '@nafo-ai/core/user';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { ApiHandler, Response } from 'sst/node/api';
import { useSession } from 'sst/node/auth';

export const fetchCreationById = ApiHandler(async (req) => {
  const session = useSession();

  if (session.type !== 'user') {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    });
  }

  try {
    await User.getById(session.properties.userId);
  } catch (error) {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'User not found' }),
    });
  }

  if (!req.pathParameters?.id) {
    throw new Response({
      statusCode: 422,
      body: JSON.stringify({ error: 'No creation id supplied' }),
    });
  }

  const creation = await Creation.getById(req.pathParameters.id);

  return {
    statusCode: 200,
    body: JSON.stringify(creation),
  };
});

export const handler = defaultLambdaMiddleware()(fetchCreationById);
