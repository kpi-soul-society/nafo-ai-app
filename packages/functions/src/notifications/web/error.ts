import { WebClient } from '@slack/web-api';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { Config } from 'sst/node/config';

const slackClient = new WebClient(Config.SLACK_TOKEN);

const reportError = async (error: any, userId?: string) => {
  let channel: string | undefined;
  if (Config.STAGE === 'prod') {
    channel = 'C05NGS697B8';
  } else if (Config.STAGE === 'dev') {
    channel = 'C05N8V68BKR';
  }

  if (!channel) {
    return;
  }
  await slackClient.chat.postMessage({
    channel,
    text: `:rotating_light: User ${
      userId || ''
    } has encountered a screen of death :skull_and_crossbones:.\n\nDetails: ${error}`,
  });
};

export const webErrorNotification = ApiHandler(async (req) => {
  const session = useSession();

  if (!req.body) {
    throw new Error('No body');
  }
  const error = req.body;

  if (session.type !== 'user') {
    return reportError(error);
  }

  return reportError(error, session.properties.userId);
});

export const handler = defaultLambdaMiddleware()(webErrorNotification);
