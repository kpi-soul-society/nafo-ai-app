// Utilities for emitting cloudwatch metrics from AWS Lambda
// https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/metrics/

import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Config } from 'sst/node/config';

const stage = Config.APP;
const app = Config.STAGE;

export const metrics = new Metrics({ serviceName: Config.APP, namespace: `${app}/${stage}` });

// add custom metric names here
export type MetricName = 'SaidHello';

export const incrementMetric = (metric: MetricName, count = 1) => metrics.addMetric(metric, MetricUnits.Count, count);
