import S3 from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";
import ErrorHandler from "../../utils/errorHandler";

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

export const listMedia = async (Bucket: string, Location: string) => {
  bucket.listObjectVersions(
    {
      Bucket,
      Prefix: Location,
    },
    (err, data) => {
      if (err) throw new ErrorHandler(err.message, err.statusCode ? err.statusCode : 500);
      console.log(data);
      return data;
    }
  );
};
