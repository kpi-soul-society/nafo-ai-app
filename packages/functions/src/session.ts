import { User } from '@nafo-ai/core/user';
import { ApiHandler, Response } from 'sst/node/api';
import { useSession } from 'sst/node/auth';

export const handler = ApiHandler(async () => {
  const session = useSession();

  if (session.type !== 'user') {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    });
  }

  try {
    const user = await User.getById(session.properties.userId);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'No user found' }),
    });
  }
});
