import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import trainingVideosN1 from "./data/trainingvideosN1.js";
import TrainingVideo from "./models/trainingVideosModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await TrainingVideo.deleteMany();

    await TrainingVideo.insertMany(trainingVideosN1);

    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await Event.deleteMany();

    console.log("Data Deleted".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

process.argv[2] === "-d" ? destroyData() : importData();
