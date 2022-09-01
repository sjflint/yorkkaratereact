import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import articleRoutes from "./routes/articleRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import trainingSessionRoutes from "./routes/trainingSessionRoutes.js";
import ddRoutes from "./routes/ddRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import trainingVideosRoutes from "./routes/trainingVideosRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import lessonPlanRoutes from "./routes/lessonPlanRoutes.js";
import gradingRoutes from "./routes/gradingRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import financialRoutes from "./routes/financialRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import { goCardlessWebhook } from "./utils/goCardlessWebhook.cjs";
import cors from "cors";
import mongoose from "mongoose";
import { getFileStream } from "./utils/s3.js";
import { cronJobs } from "./utils/cronJobs.js";

// log finder
// ["log", "warn"].forEach(function (method) {
//   var old = console[method];
//   console[method] = function () {
//     var stack = new Error().stack.split(/\n/);
//     // Chrome includes a single "Error" line, FF doesn't.
//     if (stack[0].indexOf("Error") === 0) {
//       stack = stack.slice(1);
//     }
//     var args = [].slice.apply(arguments).concat([stack[1].trim()]);
//     return old.apply(console, args);
//   };
// });

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors()); //Delete this before production!!!

mongoose.set("useFindAndModify", false);

// run cron jobs
cronJobs();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/", goCardlessWebhook);
app.use("/api/articles", articleRoutes);
app.use("/api/trainingvideos", trainingVideosRoutes);
app.use("/api/members", memberRoutes);
app.use("/sendEnquiry", enquiryRoutes);
app.use("/sendFeedback", feedbackRoutes);
app.use("/ddroutes", ddRoutes);
app.use("/api/trainingsessions", trainingSessionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/lessonplans", lessonPlanRoutes);
app.use("/api/grading", gradingRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/email", emailRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// get any image from s3 bucket
app.get("/images/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

const __dirname = path.resolve();
app.use(
  "/uploadedImages",
  express.static(path.join(__dirname, "/uploadedImages"))
);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
