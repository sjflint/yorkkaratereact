import path from "path";
import express from "express";
import multer from "multer";
import Member from "../models/memberModel.cjs";
import Event from "../models/eventModel.js";
import Product from "../models/productModel.js";
import Article from "../models/articleModel.js";
import sharp from "sharp";

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
  width: 600,
  height: 400,
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
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  switch (req.body.type) {
    case "Profile":
      sharp(req.file.path)
        .resize(profile.width, profile.height)
        .toFile(`${req.file.destination}profile${req.file.filename}`);

      if (req.body.id !== "newUpload") {
        await Member.findOneAndUpdate(
          { _id: req.body.id },
          { profileImg: `/${req.file.destination}profile${req.file.filename}` },
          { new: true }
        );
      }
      res.send(`/${req.file.destination}profile${req.file.filename}`);
      break;

    case "Event":
      sharp(req.file.path)
        .resize(event.width, event.height)
        .toFile(`${req.file.destination}event${req.file.filename}`);

      if (req.body.id !== "newUpload") {
        await Event.findOneAndUpdate(
          { _id: req.body.id },
          { image: `/${req.file.destination}event${req.file.filename}` },
          { new: true }
        );
      }
      res.send(`/${req.file.destination}event${req.file.filename}`);

      break;

    case "Product":
      sharp(req.file.path)
        .resize(product.width, product.height)
        .toFile(`${req.file.destination}product${req.file.filename}`);

      if (req.body.id !== "newUpload") {
        await Product.findOneAndUpdate(
          { _id: req.body.id },
          { image: `/${req.file.destination}product${req.file.filename}` },
          { new: true }
        );
      }
      res.send(`/${req.file.destination}product${req.file.filename}`);
      break;

    case "Article":
      sharp(req.file.path)
        .resize(article.width, article.height)
        .toFile(`${req.file.destination}article${req.file.filename}`);

      if (req.body.id !== "newUpload") {
        await Article.findOneAndUpdate(
          { _id: req.body.id },
          { image: `/${req.file.destination}article${req.file.filename}` },
          { new: true }
        );
      }
      res.send(`/${req.file.destination}article${req.file.filename}`);
      break;
  }
});

export default router;
