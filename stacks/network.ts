import { IVpc, Vpc } from 'aws-cdk-lib/aws-ec2';
import { StackContext } from 'sst/constructs';

export function Network({ stack, app }: StackContext) {
  let vpc: IVpc;

  // Use 1 VPC for all the stages
  if (app.stage !== 'prod') {
    const vpcId = 'vpc-0ba6175b7e5735c52';
    vpc = Vpc.fromLookup(stack, app.logicalPrefixedName('net'), { vpcId });
  } else {
    vpc = new Vpc(stack, app.logicalPrefixedName('net'), {
      /**
       * We don't need an NAT gateway since we're not putting our Lambdas into the VPC.
       * We are doing it because:
       * 1. We save money
       * 2. We don't use RDS and a private subnet
       */
      natGateways: 0,
    });
  }

  return { vpc };
}
