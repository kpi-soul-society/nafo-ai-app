import { PutObjectCommand, PutObjectRequest, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const createPresignedUploadUrl = async (client: S3Client, { bucket, key }: S3BucketKeyPair) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: 'image/png',
    CacheControl: 'public,max-age=0,s-maxage=31536000,must-revalidate',
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const getPublicReadUrl = ({ bucket, key }: S3BucketKeyPair) => {
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

export const uploadFile = async (client: S3Client, { bucket, key, body }: UploadFileToS3) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });

  return client.send(command);
};

interface S3BucketKeyPair {
  bucket: string;
  key: string;
}

interface UploadFileToS3 extends S3BucketKeyPair {
  body: PutObjectRequest['Body'];
}
