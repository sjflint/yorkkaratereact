import S3 from "aws-sdk/clients/s3.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//  uploads a file to s3
export const uploadFile = function upload(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
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
