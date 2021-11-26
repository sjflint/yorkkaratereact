import mongoose from "mongoose";

const trainingVideoSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  img: { type: String, required: true },
  video: { type: String, required: true },
  soundFile: { type: String, required: true },
  grade: { type: Array, required: true },
  category: { type: String, required: true },
});

const TrainingVideo = mongoose.model("TrainingVideo", trainingVideoSchema);

export default TrainingVideo;
