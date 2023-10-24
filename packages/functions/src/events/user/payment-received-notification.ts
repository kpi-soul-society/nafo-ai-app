import { User } from '@nafo-ai/core/user';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { Config } from 'sst/node/config';
import { EventHandler } from 'sst/node/event-bus';

const paymentReceivedNotification = EventHandler(User.Events.PaymentStatusUpdated, async (event) => {
  const { amount, currency, userId } = event.properties;
  let telegramChannelId: string;
  if (Config.STAGE === 'prod') {
    telegramChannelId = '-1001880272717';
  } else {
    telegramChannelId = '-1001980381714';
  }

  if (event.properties.orderStatus === 'approved') {
    const user = await User.getOne({ id: userId });
    const body = new URLSearchParams({
      text: `🇺🇦🇺🇦🇺🇦*СЛАВА УКРАЇНІ*🇺🇦🇺🇦🇺🇦
${user?.email}
Задонатив *${(amount / 100).toFixed(2)} ${currency}*💸
ДЯКУЄМО!!!
👉️️️️👈️️️️🥺️️️️`,
      chat_id: telegramChannelId,
      parse_mode: 'markdown',
    });

    await fetch(`https://api.telegram.org/bot${Config.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      body,
      headers: {
        ContentType: 'application/x-www-form-urlencoded',
      },
    });
  }
});

export const handler = defaultLambdaMiddleware()(paymentReceivedNotification);
