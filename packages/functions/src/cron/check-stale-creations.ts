import { Creation } from '@nafo-ai/core/creation';
import { WebClient } from '@slack/web-api';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { logger } from 'src/util/logger';
import { Config } from 'sst/node/config';

const slackClient = new WebClient(Config.SLACK_TOKEN);

const checkStaleCreations = async () => {
  let channel: string | undefined;
  if (Config.STAGE === 'prod') {
    channel = 'C05NGS697B8';
  } else {
    channel = 'C05N8V68BKR';
  }

  const creations = await Creation.getStaleCreations();
  const creationIds = creations.map((creation) => creation.id);

  if (!creationIds.length || !channel) {
    return;
  }

  logger.info(`Found ${creationIds.length} stale creations`);

  await slackClient.chat.postMessage({
    channel,
    text: `:rotating_light: Some creations have bee stuck IN_PROGRESS for over 5 minutes:\n\n${creationIds.join(', ')}`,
  });
};

export const handler = defaultLambdaMiddleware()(checkStaleCreations);
