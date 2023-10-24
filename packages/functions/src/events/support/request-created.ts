import { Support } from '@nafo-ai/core/support';
import { WebClient } from '@slack/web-api';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { Config } from 'sst/node/config';
import { EventHandler } from 'sst/node/event-bus';

const slackClient = new WebClient(Config.SLACK_TOKEN);

const supportRequestCreated = EventHandler(Support.Events.SupportRequestCreated, async (event) => {
  let channel: string | undefined;
  if (Config.STAGE === 'prod') {
    channel = 'C05NGS697B8';
  } else if (Config.STAGE === 'dev') {
    channel = 'C05N8V68BKR';
  }

  const supportRequest = await Support.getById(event.properties.id);

  if (!channel) {
    return;
  }
  await slackClient.chat.postMessage({
    channel,
    text: `<!channel>:rotating_light: User ${
      supportRequest.customerEmail || ''
    } has submitted a new support request on subject: *${supportRequest.subject}*.\n\nDetails:\n\n ${
      supportRequest.details
    }`,
  });
});

export const handler = defaultLambdaMiddleware()(supportRequestCreated);
