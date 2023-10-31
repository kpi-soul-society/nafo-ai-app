import { RemovalPolicy } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as sst from 'sst/constructs';

import { Authentication } from './auth';
import { Configuration } from './config';
import { CronJobs } from './cron';
import { DatabaseMigrations } from './databaseMigrations';
import { Dns } from './dns';
import { Dynamo } from './dynamo';
import { Events } from './events';
import { Network } from './network';
import { RDS } from './rds';
import { RestApi } from './restApi';
import { S3 } from './s3';
import { Sqs } from './sqs';
import { Web } from './web';
import { WebsocketApi } from './websocketApi';

export const RUNTIME = Runtime.NODEJS_18_X;

export default function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs18.x',
    nodejs: {
      esbuild: { external: ['pg-native'], target: 'node18' },
    },
    tracing: ['prod', 'dev'].includes(app.stage) ? 'active' : 'disabled',
  });

  if (app.stage !== 'prod') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }

  app
    .stack(Network)
    .stack(Dns)
    .stack(RDS)
    .stack(Configuration)
    .stack(Dynamo)
    .stack(S3)
    .stack(DatabaseMigrations)
    .stack(WebsocketApi)
    .stack(Events)
    .stack(Sqs)
    .stack(RestApi)
    .stack(Web)
    .stack(Authentication)
    .stack(CronJobs);
}
