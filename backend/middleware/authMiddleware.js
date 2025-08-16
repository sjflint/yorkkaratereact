import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Member from "../models/memberModel.cjs";
import MessageUser from "../models/messageUser.js";

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

const protectMessages = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorised - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorised - Token invalid" });
    }

    const user = await MessageUser.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

const admin = (req, res, next) => {
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

const adminOrInstructor = (req, res, next) => {
  if (req.member.isInstructor || req.member.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorised as an instructor");
  }
};

export {
  protect,
  admin,
  author,
  shopAdmin,
  instructor,
  adminOrInstructor,
  protectMessages,
};
