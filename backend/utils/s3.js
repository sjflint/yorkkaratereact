import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

//  uploads a file to s3
export const uploadFile = function upload(file) {
  // const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.filename,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  return s3.upload(command).promise();
};

// download a file from s3
export const getFileStream = function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};

// delete a file from s3
export const deleteFile = function deleting(imagePath) {
  const deleteParams = {
    Bucket: bucketName,
    Key: imagePath,
  };

  return s3.deleteObject(deleteParams).promise();
};
