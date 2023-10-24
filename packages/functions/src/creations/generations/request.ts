import { CreationGenerationMessagePayload, updateById } from '@nafo-ai/core/creation';
import { SQSEvent } from 'aws-lambda';
import fetch from 'node-fetch';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { Config } from 'sst/node/config';

export const generateImage = async (event: SQSEvent) => {
  const payload: CreationGenerationMessagePayload = JSON.parse(event.Records[0].body);

  console.log('About to send payload', payload);

  const endpoint = !['dev', 'prod'].includes(Config.STAGE) ? '/creations/generations/dispatch/mock' : '/';
  await fetch(`${Config.IMAGE_GENERATION_SERVICE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: Config.REST_API_KEY,
    },
  });

  await updateById(payload.creationId, { completionStatus: 'IN_PROGRESS' });

  return {
    body: `Image successfully submitted for generation`,
  };
};

export const handler = defaultLambdaMiddleware()(generateImage);
