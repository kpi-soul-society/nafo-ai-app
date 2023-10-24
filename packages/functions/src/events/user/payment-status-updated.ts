import { PaymentSuccessfulMessage } from '@nafo-ai/core/common/validation';
import { fondyPaymentStatusToSystemPaymentStatus } from '@nafo-ai/core/payment';
import { AcquireTokens, User } from '@nafo-ai/core/user';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { sendWebsocketMessageToUser } from 'src/websocket/util';
import { EventHandler } from 'sst/node/event-bus';

const paymentStatusUpdated = EventHandler(User.Events.PaymentStatusUpdated, async (event) => {
  if (event.properties.orderStatus === 'approved') {
    const tokenAcquisitionPayload: AcquireTokens = {
      donation: event.properties.amount,
      donationCurrency: event.properties.currency,
      paymentProviderTransactionId: event.properties.paymentId,
      userId: event.properties.userId,
    };
    const tokenAcquisition = await User.acquireTokens(tokenAcquisitionPayload);

    await sendWebsocketMessageToUser(event.properties.userId, {
      actionType: 'PAYMENT_SUCCESSFUL',
      donationId: tokenAcquisition.id,
    } as PaymentSuccessfulMessage);
  } else {
    const orderStatus = fondyPaymentStatusToSystemPaymentStatus.get(event.properties.orderStatus);
    if (!orderStatus) {
      throw new Error(`Received unknown payment status: ${event.properties.orderStatus}`);
    }
    await User.updatePaymentStatus({ orderStatus, paymentProviderTransactionId: event.properties.paymentId });
  }
});

export const handler = defaultLambdaMiddleware()(paymentStatusUpdated);
