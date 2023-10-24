import { Cron, StackContext } from 'sst/constructs';

export function CronJobs({ stack }: StackContext) {
  new Cron(stack, 'CheckStaleCreations', {
    schedule: 'rate(5 minutes)',
    job: 'packages/functions/src/cron/check-stale-creations.handler',
    enabled: stack.stage === 'prod',
  });
}
