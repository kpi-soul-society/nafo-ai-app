import { Bucket, StackContext } from 'sst/constructs';

export function S3({ stack }: StackContext) {
  const creationsBucket = new Bucket(stack, 'Creations', {
    cors: true,
    cdk: {
      bucket: {
        publicReadAccess: true,
      },
    },
  });

  stack.addOutputs({
    CreationsBucket: creationsBucket.bucketName,
  });

  return { creationsBucket };
}
