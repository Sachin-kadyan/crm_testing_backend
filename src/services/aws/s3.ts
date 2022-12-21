import S3 from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";

const bucket = new S3();
const BUCKET_NAME = process.env.BUCKET_NAME;

export const putMedia = async (file: any, location: string, bucketName?: string) => {
  const fileName = uuid() + "-" + Date.now();
  const params = {
    Bucket: `${bucketName ? bucketName : BUCKET_NAME}/${location}`,
    Body: file.buffer,
    Key: fileName,
    ContentType: file.mimeType,
  };
  return await bucket.upload(params).promise();
};
