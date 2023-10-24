import { Logger } from '@aws-lambda-powertools/logger';
import { Config } from 'sst/node/config';

export const logger = new Logger({ serviceName: Config.APP });
