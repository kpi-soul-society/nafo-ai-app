import { Duration } from 'aws-cdk-lib';
import { Queue, StackContext, use } from 'sst/constructs';

import { Events } from './events';

export function Sqs({ stack, app }: StackContext) {
  const events = use(Events);
  const creationGenerationDLQ = new Queue(stack, 'CreationGenerationDLQ', {
    cdk: {
      queue: {
        retentionPeriod: Duration.days(2),
      },
    },
  });

  // for creation generation requests to the ML service
  const creationGenerationQueue = new Queue(stack, 'CreationGeneration', {
    consumer: {
      function: { handler: 'packages/functions/src/creations/generations/request.handler', timeout: '30 seconds' },
      cdk: {
        eventSource: {
          // Lambda to get invoked with a single message instead of a batch
          batchSize: 1,
        },
      },
    },
    cdk: {
      queue: {
        deadLetterQueue: ['dev', 'prod'].includes(app.stage)
          ? {
              queue: creationGenerationDLQ.cdk.queue,
              maxReceiveCount: 5,
            }
          : undefined,
      },
    },
  });

  const creationWebhookQueue = new Queue(stack, 'CreationWebhook', {
    consumer: {
      function: {
        handler: 'packages/functions/src/creations/generations/webhook.handler',
        bind: [events.bus],
      },
      cdk: {
        eventSource: {
          // how many messages per lambda
          batchSize: 5,
        },
      },
    },
  });

  stack.addOutputs({
    CreationGenerationQueue: creationGenerationQueue.queueName,
    CreationWebhookQueue: creationWebhookQueue.queueName,
  });

  return { creationGenerationQueue, creationWebhookQueue };
}
