import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logMetrics } from '@aws-lambda-powertools/metrics';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import { NotEnoughTokensError, UserNotFoundError } from '@nafo-ai/core/common/errors';
import { ServerCreationGenerationSchema, serverSideCreationGenerationSchema } from '@nafo-ai/core/common/validation';
import { Creation } from '@nafo-ai/core/creation';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { logger } from 'src/util/logger';
import { metrics } from 'src/util/metrics';
import { tracer } from 'src/util/tracer';
import { ApiHandler, Response } from 'sst/node/api';
import { SessionValue, useSession } from 'sst/node/auth';

const dispatchCreationGeneration = ApiHandler(async (event: APIGatewayProxyEventV2) => {
  let session: SessionValue;
  // TODO: make it reusable for other API handlers
  try {
    session = useSession();
  } catch (error: any) {
    if (error.code === 'FAST_JWT_MALFORMED' || error.code === 'FAST_JWT_EXPIRED') {
      throw new Response({
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      });
    } else {
      throw error;
    }
  }

  if (session.type !== 'user') {
    throw new Response({
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    });
  }

  // body is multipart-form-data
  const initialBody = event.body as unknown as Body;
  logger.info('Received image generation request', {
    payload: initialBody?.payload,
    startingImageUrl: initialBody?.startingImageUrl,
  });

  if (!initialBody || !initialBody.payload) {
    throw new Response({
      statusCode: 422,
      body: JSON.stringify({ error: 'Incorrect body' }),
    });
  }

  const payload = {
    ...JSON.parse(initialBody?.payload),
    startingImage: initialBody?.startingImage,
    startingImageUrl: initialBody?.startingImageUrl,
    userId: session.properties.userId,
  };
  const body: ServerCreationGenerationSchema = serverSideCreationGenerationSchema.parse(payload);

  try {
    await Creation.dispatchCreationGeneration(body);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw new Response({
        statusCode: 401,
        body: JSON.stringify({ error: 'User not found' }),
      });
    } else if (error instanceof NotEnoughTokensError) {
      throw new Response({
        statusCode: 403,
        body: JSON.stringify({ error: 'User does not have enough tokens for creation' }),
      });
    }
    throw error;
  }

  return {
    body: `ok`,
  };
});

export const handler = middy(dispatchCreationGeneration)
  .use(injectLambdaContext(logger, { logEvent: false })) // so that we don't log large images
  .use(captureLambdaHandler(tracer, { captureResponse: true }))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(httpHeaderNormalizer())
  .use(
    httpMultipartBodyParser({
      busboy: {
        limits: {
          fileSize: 20000000, // 20 MB in bytes
          files: 1,
        },
      },
    })
  )
  .use(httpErrorHandler());

type Body = {
  startingImage?: {
    content: Buffer;
    filename: string;
    mimetype: string;
  };
  startingImageUrl?: string;
  payload: string;
};
