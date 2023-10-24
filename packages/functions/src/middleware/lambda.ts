/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logMetrics } from '@aws-lambda-powertools/metrics';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { Callback, Context } from 'aws-lambda';
import { logger } from 'src/util/logger';
import { metrics } from 'src/util/metrics';
import { tracer } from 'src/util/tracer';

export type Handler<TEvent = unknown, TResult = unknown> = (
  event: TEvent,
  context: Context,
  callback: Callback<TResult>
) => void | Promise<TResult>;

const DEFAULT_MIDDLEWARE = [
  injectLambdaContext(logger, { logEvent: true }),
  captureLambdaHandler(tracer, { captureResponse: true }),
  logMetrics(metrics, { captureColdStartMetric: true }),
];

export const defaultLambdaMiddleware = <T extends (...args: any[]) => any>() => {
  return (resolverFunc: T) => {
    const handlerWithMiddlewares = middy(resolverFunc).use(DEFAULT_MIDDLEWARE);

    return handlerWithMiddlewares;
  };
};
