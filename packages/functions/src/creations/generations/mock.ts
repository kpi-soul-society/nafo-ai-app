import { CreationCompletionStatusUpdatedEventSchema } from '@nafo-ai/core/common/validation';
import { CreationGenerationMessagePayload } from '@nafo-ai/core/creation';
import https from 'https';
import fetch from 'node-fetch';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { ApiHandler } from 'sst/node/api';
import { Config } from 'sst/node/config';

export const mock = ApiHandler(async (req) => {
  const payload: CreationGenerationMessagePayload = JSON.parse(req.body as string);

  const img = await fetch('https://cdn2.thecatapi.com/images/bok.jpg');
  const buf = await img.arrayBuffer();

  for (const url of payload.variationUploadUrls) {
    await put(url, Buffer.from(buf));
  }

  await fetch(`${Config.IMAGE_GENERATION_SERVICE_URL}/creations/webhook`, {
    method: 'POST',
    body: JSON.stringify({
      creationId: payload.creationId,
      actionType: 'GENERATION_COMPLETE',
    } as CreationCompletionStatusUpdatedEventSchema),
    headers: { 'Content-Type': 'application/json', Authorization: Config.REST_API_KEY },
  });

  return {
    body: `OK`,
  };
});

function put(url: string, data: any) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'PUT', headers: { 'Content-Length': new Blob([data]).size } }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve(responseBody);
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.write(data);
    req.end();
  });
}

export const handler = defaultLambdaMiddleware()(mock);
