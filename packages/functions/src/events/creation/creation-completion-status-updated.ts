import { CreationCompletionStatusUpdatedEventSchema } from '@nafo-ai/core/common/validation';
import { Creation } from '@nafo-ai/core/creation';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { sendWebsocketMessageToUser } from 'src/websocket/util';
import { EventHandler } from 'sst/node/event-bus';

const creationCompletionStatusUpdated = EventHandler(Creation.Events.CreationCompletionStatusUpdated, async (event) => {
  const body: CreationCompletionStatusUpdatedEventSchema = event.properties;
  const userId = (await Creation.getById(body.creationId))?.userId;
  if (!userId) {
    throw new Error(`No userId found for creation ${body.creationId}`);
  }
  const deliveredMessages = await sendWebsocketMessageToUser(userId, { ...body, userId });

  if (!deliveredMessages.length) {
    throw new Error(
      `Could not deliver a message about creation ${body.creationId} completion to user ${userId} via websocket`
    );
  }
});

export const handler = defaultLambdaMiddleware()(creationCompletionStatusUpdated);
