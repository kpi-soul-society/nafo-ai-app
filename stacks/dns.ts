import { DnsValidatedCertificate, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { StackContext } from 'sst/constructs';

export function Dns({ stack, app }: StackContext) {
  if (!process.env['HOSTED_ZONE_NAME']) {
    throw new Error('Please set HOSTED_ZONE_NAME');
  }
  // route53 zone
  const hostedZoneName = process.env['HOSTED_ZONE_NAME'];
  const hostedZone = HostedZone.fromLookup(stack, 'Zone', {
    domainName: hostedZoneName,
  });

  // certificate (in our region)
  let certificateRegional: ICertificate | undefined, certificateGlobal: ICertificate | undefined;

  if (hostedZoneName && hostedZone) {
    certificateRegional = new DnsValidatedCertificate(stack, 'RegionalCertificate', {
      domainName: hostedZoneName,
      hostedZone,
      subjectAlternativeNames: [`*.${hostedZoneName}`],
    });
    // cert in us-east-1, required for cloudfront, cognito, etc.
    certificateGlobal =
      app.region === 'us-east-1'
        ? certificateRegional
        : new DnsValidatedCertificate(stack, 'GlobalCertificate', {
            domainName: hostedZoneName,
            hostedZone,
            subjectAlternativeNames: [`*.${hostedZoneName}`],
            region: 'us-east-1',
          });
  }

  return { certificateRegional, certificateGlobal, hostedZone, domainName: hostedZoneName };
}
