import S3, { PutObjectRequest } from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";
import ErrorHandler from "../../utils/errorHandler";

const bucket = new S3();
const BUCKET_NAME = process.env.BUCKET_NAME;

export const putMedia = async (file: any, location: string, bucketName?: string) => {
  const fileName = uuid() + "-" + Date.now();
  const params: PutObjectRequest = {
    Bucket: `${bucketName ? bucketName : BUCKET_NAME}/${location}`,
    Body: file.buffer,
    Key: `${fileName}.${file.mimetype.split("/")[1]}`,
    ContentType: file.mimetype,
  };
  return await bucket.upload(params).promise();
};

export const listMedia = async (Bucket: string, Location: string) => {
  return await bucket.listObjectsV2({ Bucket, Prefix: Location }).promise();
};
