import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Member from "../models/memberModel.cjs";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.member = await Member.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  console.log(req.member);
  if (req.member.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorised as an admin");
  }
};

const author = (req, res, next) => {
  if (req.member.isAuthor) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorised as an author");
  }
};

const shopAdmin = (req, res, next) => {
  if (req.member.isShopAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorised as a Shop Admin");
  }
};

const instructor = (req, res, next) => {
  if (req.member.isInstructor) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorised as an instructor");
  }
};

export { protect, admin, author, shopAdmin, instructor };
