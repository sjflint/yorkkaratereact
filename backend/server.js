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
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors()); //Delete this before production!!!

app.get("/", (req, res) => {
  res.send("API is running...");
});

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

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

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
