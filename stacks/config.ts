import { Config, StackContext } from 'sst/constructs';

export function Configuration({ stack, app }: StackContext) {
  let imageServiceUrl: string;
  if (!process.env.IMAGE_GENERATION_SERVICE_URL) {
    throw new Error('IMAGE_GENERATION_SERVICE_URL is not defined');
  }

  if (app.stage === 'dev') {
    imageServiceUrl = process.env.IMAGE_GENERATION_SERVICE_URL;
  } else if (app.stage === 'prod') {
    imageServiceUrl = process.env.IMAGE_GENERATION_SERVICE_URL;
  } else {
    imageServiceUrl = `https://api-${app.stage}.nafoai.com`;
  }

  let siteUrl: string;
  if (stack.stage === 'dev') {
    siteUrl = 'https://dev.nafoai.com';
  } else if (stack.stage === 'prod') {
    siteUrl = 'https://nafoai.com';
  } else {
    siteUrl = 'http://localhost:3000';
  }

  let fondyMerchantId: string;
  if (stack.stage === 'dev') {
    fondyMerchantId = '1530252';
  } else if (stack.stage === 'prod') {
    fondyMerchantId = '1534021';
  } else {
    fondyMerchantId = '1530252';
  }

  const config = [
    new Config.Parameter(stack, 'IMAGE_GENERATION_SERVICE_URL', {
      value: imageServiceUrl,
    }),
    new Config.Parameter(stack, 'FONDY_CALLBACK_URL', {
      value: `https://api-${app.stage}.nafoai.com/payments/callback/fondy`,
    }),
    new Config.Parameter(stack, 'FONDY_MERCHANT_ID', {
      value: fondyMerchantId,
    }),
    new Config.Parameter(stack, 'WEBSITE_URL', {
      value: siteUrl,
    }),
    new Config.Secret(stack, 'SLACK_TOKEN'),
    new Config.Secret(stack, 'TELEGRAM_TOKEN'),
    new Config.Secret(stack, 'FONDY_SECRET_KEY'),
    new Config.Secret(stack, 'REST_API_KEY'),
  ];
  app.addDefaultFunctionBinding(config);

  return config;
}
