import { CreateCheckoutSessionSchema, createCheckoutSessionSchema } from '@nafo-ai/core/common/validation';
import { Payment } from '@nafo-ai/core/payment';
import { User } from '@nafo-ai/core/user';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { ApiHandler, Response } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { Config } from 'sst/node/config';

export const createCheckoutSession = ApiHandler(async (req) => {
  const session = useSession();

  if (session.type !== 'user') {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    });
  }
  if (!req.body) {
    throw new Error('No body');
  }

  try {
    await User.getById(session.properties.userId);
  } catch (error) {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'User not found' }),
    });
  }

  const body: CreateCheckoutSessionSchema = createCheckoutSessionSchema.parse(JSON.parse(req.body));
  const merchantData = [{ key: 'userId', value: session.properties.userId }];

  const { checkoutUrl } = await Payment.createCheckoutSession({
    ...body,
    metadata: merchantData,
    orderDescription: 'Donation to "United24" through nafoai.com',
    onSuccessRedirectUrl: `${Config.WEBSITE_URL}/checkout/pending`,
  });

  return {
    body: JSON.stringify({ checkoutUrl }),
  };
});

export const handler = defaultLambdaMiddleware()(createCheckoutSession);
