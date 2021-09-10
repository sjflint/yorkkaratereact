import asyncHandler from "express-async-handler";
import TrainingVideo from "../models/trainingVideosModel.js";

// @desc Fetch all videos
// @route GET /api/trainingVideos
// @access Public
const getTrainingVideos = asyncHandler(async (req, res) => {
  const trainingVideos = await TrainingVideo.find({});
  res.json(trainingVideos);
});

// @desc Fetch single video
// @route GET /api/trainingVideos/:id
// @access Public
const getTrainingVideoById = asyncHandler(async (req, res) => {
  const trainingVideo = await TrainingVideo.findById(req.params.id);

  if (trainingVideo) {
    res.json(trainingVideo);
  } else {
    res.status(404);
    throw Error("Video not found");
  }
});

export { getTrainingVideos, getTrainingVideoById };
