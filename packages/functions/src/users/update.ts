import { updateUserSchema } from '@nafo-ai/core/common/validation';
import { User } from '@nafo-ai/core/user';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { logger } from 'src/util/logger';
import { ApiHandler, Response } from 'sst/node/api';
import { useSession } from 'sst/node/auth';

export const updateUser = ApiHandler(async (req) => {
  const session = useSession();

  if (session.type !== 'user') {
    throw new Error('Not authenticated');
  }

  if (!req.pathParameters?.userId) {
    throw new Error('No user id supplied');
  }

  if (!req.body) {
    throw new Error('No body supplied');
  }

  const body = JSON.parse(req.body);

  const updateUserPayload = updateUserSchema.parse(body);

  let existingUser;
  try {
    existingUser = await User.getById(req.pathParameters.userId);
  } catch (error) {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'User not found' }),
    });
  }

  if (!existingUser.referrerId && updateUserPayload.referrerId) {
    logger.info(`User ${existingUser.id} has been referred by user ${updateUserPayload.referrerId}`, {
      userId: existingUser.id,
      referrerId: updateUserPayload.referrerId,
    });
  }

  const user = await User.updateById(req.pathParameters.userId, updateUserPayload);

  return {
    body: JSON.stringify(user),
  };
});

export const handler = defaultLambdaMiddleware()(updateUser);
