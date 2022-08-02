import path from "path";
import express from "express";
import multer from "multer";
import Member from "../models/memberModel.cjs";
import Event from "../models/eventModel.cjs";
import Product from "../models/productModel.js";
import Article from "../models/articleModel.js";
import sharp from "sharp";
import { deleteFile, uploadFile } from "../utils/s3.js";
import fs from "fs";
import { unlink } from "fs";

const router = express.Router();

// Image Dimensions
// Events
const event = {
  width: 800,
  height: 480,
};

// Profile
const profile = {
  width: 500,
  height: 500,
};

// Product
const product = {
  width: 1000,
  height: 1000,
};

// Article
const article = {
  width: 900,
  height: 600,
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploadedImages/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
};

const upload = multer({
  storage,
  // limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  switch (req.body.type) {
    case "Profile":
      await sharp(req.file.path)
        .resize({
          height: profile.height,
          width: profile.width,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFile(`uploadedImages/processed${req.file.filename}`);
      const profileS3Upload = {
        filename: req.file.filename,
        path: `uploadedImages/processed${req.file.filename}`,
      };

      const profileResult = await uploadFile(profileS3Upload);
      unlink(`uploadedImages/processed${req.file.filename}`, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });
      unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });

      if (req.body.id !== "newUpload") {
        // delete previous profile image
        const member = await Member.findById(req.body.id);
        const imageKey = member.profileImg.slice(8);
        await deleteFile(imageKey);

        await Member.findOneAndUpdate(
          { _id: req.body.id },
          { profileImg: `/images/${profileResult.Key}` },
          { new: true }
        );
      }

      res.send(`/images/${profileResult.Key}`);
      break;

    case "Event":
      await sharp(req.file.path)
        .resize({
          height: event.height,
          width: event.width,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFile(`uploadedImages/processed${req.file.filename}`);

      const eventS3Upload = {
        filename: req.file.filename,
        path: `uploadedImages/processed${req.file.filename}`,
      };

      const eventResult = await uploadFile(eventS3Upload);
      unlink(`uploadedImages/processed${req.file.filename}`, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });
      unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });

      if (req.body.id !== "newUpload") {
        // delete previous event image
        const event = await Event.findById(req.body.id);
        const imageKey = event.image.slice(8);
        await deleteFile(imageKey);

        await Event.findOneAndUpdate(
          { _id: req.body.id },
          { image: `/images/${eventResult.Key}` },
          { new: true }
        );
      }
      res.send(`/images/${eventResult.Key}`);

      break;

    case "Product":
      await sharp(req.file.path)
        .resize({
          height: product.height,
          width: product.width,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFile(`uploadedImages/processed${req.file.filename}`);

      const productS3Upload = {
        filename: req.file.filename,
        path: `uploadedImages/processed${req.file.filename}`,
      };

      const productResult = await uploadFile(productS3Upload);
      unlink(`uploadedImages/processed${req.file.filename}`, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });
      unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });

      if (req.body.id !== "newUpload") {
        // delete previous product image
        const product = await Product.findById(req.body.id);
        const imageKey = product.image.slice(8);
        await deleteFile(imageKey);

        await Product.findOneAndUpdate(
          { _id: req.body.id },
          { image: `/images/${productResult.Key}` },
          { new: true }
        );
      }
      res.send(`/images/${productResult.Key}`);
      break;

    case "Article":
      await sharp(req.file.path)
        .resize({
          width: article.width,
          height: article.height,
          fit: "contain",
          background: { r: 242, g: 242, b: 242, alpha: 1 },
        })
        .toFile(`uploadedImages/processed${req.file.filename}`);

      const articleS3Upload = {
        filename: req.file.filename,
        path: `uploadedImages/processed${req.file.filename}`,
      };

      const articleResult = await uploadFile(articleS3Upload);
      unlink(`uploadedImages/processed${req.file.filename}`, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });
      unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });

      if (req.body.id !== "newUpload") {
        // delete previous article image
        const article = await Article.findById(req.body.id);
        const imageKey = article.image.slice(8);
        await deleteFile(imageKey);

        await Article.findOneAndUpdate(
          { _id: req.body.id },
          { image: `/images/${articleResult.Key}` },
          { new: true }
        );
      }
      res.send(`/images/${articleResult.Key}`);
      break;
  }
});

export default router;
