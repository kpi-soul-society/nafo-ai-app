import { CreationCompletionStatusUpdatedEventSchema } from '@nafo-ai/core/common/validation';
import { Creation } from '@nafo-ai/core/creation';
import { SQSEvent } from 'aws-lambda';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';

export const webhook = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const payload: CreationCompletionStatusUpdatedEventSchema = JSON.parse(record.body as string);

    await Creation.updateById(payload.creationId, { completionStatus: 'COMPLETED' });
    await Creation.Events.CreationCompletionStatusUpdated.publish(payload);
  }

  return {
    body: `OK`,
  };
};

export const handler = defaultLambdaMiddleware()(webhook);
