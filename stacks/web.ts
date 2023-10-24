import { Config, NextjsSite, StackContext, use } from 'sst/constructs';

import { Dns } from './dns';
import { RestApi } from './restApi';
import { S3 } from './s3';
import { WebsocketApi } from './websocketApi';

export function Web({ stack, app }: StackContext) {
  const restApi = use(RestApi);
  const websocketApi = use(WebsocketApi);
  const dns = use(Dns);
  const s3 = use(S3);

  let siteUrl: string;
  if (stack.stage === 'dev') {
    siteUrl = 'https://dev.nafoai.com';
  } else if (stack.stage === 'prod') {
    siteUrl = 'https://nafoai.com';
  } else {
    siteUrl = 'http://localhost:3000';
  }

  const NEXTAUTH_SECRET = new Config.Secret(stack, 'NEXTAUTH_SECRET');
  if (!process.env.NEXTAUTH_SECRET || !process.env.TOGGLED_FEATURE_FLAGS_CLIENT_KEY) {
    throw new Error('Please set NEXTAUTH_SECRET and TOGGLED_FEATURE_FLAGS_CLIENT_KEY');
  }

  const frontendSite = new NextjsSite(stack, 'Web', {
    path: 'packages/web/',
    customDomain: {
      domainName: stack.stage === 'prod' ? dns.domainName : `${stack.stage}.${dns.domainName}`,
      domainAlias: stack.stage === 'prod' ? `www.${dns.domainName}` : undefined,
      hostedZone: dns.domainName,
    },
    cdk: {
      distribution: {
        comment: `NextJS distribution for ${app.name} (${app.stage})`,
        additionalBehaviors: {},
      },
    },
    timeout: '30 seconds',
    bind: [NEXTAUTH_SECRET, s3.creationsBucket],
    warm: stack.stage === 'prod' ? 30 : undefined,
    environment: {
      NEXT_PUBLIC_STAGE: stack.stage,
      NEXT_PUBLIC_REGION: stack.region,
      NEXT_PUBLIC_REST_API_URL: restApi.customDomainUrl || restApi.url,
      NEXT_PUBLIC_WEBSOCKET_API_URL: websocketApi.customDomainUrl || websocketApi.url,
      NEXTAUTH_URL: siteUrl,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      TOGGLED_FEATURE_FLAGS_CLIENT_KEY: process.env.TOGGLED_FEATURE_FLAGS_CLIENT_KEY,
    },
  });

  stack.addOutputs({
    WebURL: frontendSite.customDomainUrl || frontendSite.url || 'unknown',
  });

  return frontendSite;
}
