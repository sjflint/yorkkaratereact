import path from "path";
import express from "express";
import multer from "multer";
import Member from "../models/memberModel.cjs";
import Event from "../models/eventModel.cjs";
import Product from "../models/productModel.cjs";
import Article from "../models/articleModel.cjs";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import TrainingVideo from "../models/trainingVideosModel.js";

const router = express.Router();

dotenv.config();

const randomName = () => crypto.randomBytes(16).toString("hex");

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

const checkImageType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
};
const checkVideoType = (file, cb) => {
  const filetypes = /mp4|wmv|mov|/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("mp4 videos only!");
  }
};
const checkFileType = (file, cb) => {
  const filetypes = /pdf|doc|mp3|mpeg|docx|xlsx|xls|csv|ppt|pptx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log(file);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("word/excel/powerpoint/pdf/mp3 files only!");
  }
};

const storage = multer.memoryStorage();
const videoUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 400 },
  fileFilter: function (req, file, cb) {
    checkVideoType(file, cb);
  },
});
const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 10240 * 10240 },
  fileFilter: function (req, file, cb) {
    checkImageType(file, cb);
  },
});
const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

videoUpload.single("video");
imageUpload.single("image");
fileUpload.single("file");

router.post("/file", fileUpload.single("file"), async (req, res) => {
  console.log(req.body);
  const fileName = randomName() + req.file.originalname;

  const params = {
    Bucket: bucketName,
    Body: req.file.buffer,
    Key: fileName,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  if (req.body.id !== "newUpload") {
    // delete old file
    const trainingVideo = await TrainingVideo.findById(req.body.id);

    const fileToDelete = trainingVideo.soundFile.slice(55);

    const params = {
      Bucket: bucketName,
      Key: fileToDelete,
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // add new file
    await TrainingVideo.findOneAndUpdate(
      { _id: req.body.id },
      {
        soundFile: `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${fileName}`,
      }
    );
  }

  res.send(
    `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${fileName}`
  );
});

router.post("/video", videoUpload.single("video"), async (req, res) => {
  const videoName = randomName() + req.file.originalname;

  const params = {
    Bucket: bucketName,
    Body: req.file.buffer,
    Key: videoName,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  if (req.body.id !== "newUpload") {
    // delete old video
    const trainingVideo = await TrainingVideo.findById(req.body.id);

    const videoToDelete = trainingVideo.video.slice(55);

    const params = {
      Bucket: bucketName,
      Key: videoToDelete,
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // add new video to database
    await TrainingVideo.findOneAndUpdate(
      { _id: req.body.id },
      {
        video: `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${videoName}`,
      }
    );
  }
  res.send(
    `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${videoName}`
  );
});

router.post("/image", imageUpload.single("image"), async (req, res) => {
  let imgHeight;
  let imgWidth;
  let db;
  let dbEntry;

  const uploadImage = async () => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        height: imgHeight,
        width: imgWidth,
        fit: "contain",
        background: { r: 242, g: 242, b: 242, alpha: 1 },
      })
      .withMetadata()
      .toBuffer();

    const imageName = randomName() + req.file.originalname;

    const params = {
      Bucket: bucketName,
      Body: buffer,
      Key: imageName,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);

    if (req.body.id !== "newUpload") {
      const dbRecord = await db.findById(req.body.id);

      if (dbRecord.carouselImages) {
        dbRecord.carouselImages.push({
          original: `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${imageName}`,
          thumbnail: `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${imageName}`,
        });
        dbRecord.save();
      } else {
        // delete old image
        const dbRecord = await db.findById(req.body.id);

        const imageToDelete = dbRecord[dbEntry].slice(55);

        console.log(imageToDelete);
        const params = {
          Bucket: bucketName,
          Key: imageToDelete,
        };
        const command = new DeleteObjectCommand(params);
        await s3.send(command);

        // add new image to database
        await db.findOneAndUpdate(
          { _id: req.body.id },
          {
            [dbEntry]: `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${imageName}`,
          }
        );
      }
    }
    res.send(
      `https://york-karate-uploads.s3.eu-west-2.amazonaws.com/${imageName}`
    );
  };

  // Image types and configs
  switch (req.body.type) {
    case "Profile":
      imgHeight = 1000;
      imgWidth = 1000;
      db = Member;
      dbEntry = "profileImg";
      uploadImage();
      break;
    case "Event":
      imgHeight = 600;
      imgWidth = 900;
      db = Event;
      dbEntry = "image";
      uploadImage();
      break;
    case "Product":
      imgHeight = 1000;
      imgWidth = 1000;
      db = Product;
      dbEntry = "image";
      uploadImage();
      break;
    case "Article":
      imgHeight = 600;
      imgWidth = 900;
      db = Article;
      dbEntry = "image";
      uploadImage();
      break;
    case "VideoPoster":
      imgHeight = 1080;
      imgWidth = 1920;
      db = TrainingVideo;
      dbEntry = "img";
      uploadImage();
  }
});

export default router;
