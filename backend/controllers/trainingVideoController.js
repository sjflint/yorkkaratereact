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

// @desc Delete Training Video
// @route DELETE /api/trainingVideos/:id
// @access Private/Instructor
const deleteTrainingVideo = asyncHandler(async (req, res) => {
  const trainingVideo = await TrainingVideo.findById(req.params.id);

  if (trainingVideo) {
    await trainingVideo.remove();
    res.json({ message: "Training Video removed" });
  } else {
    res.status(404);
    throw new Error("Training Video not found");
  }
});

// @desc Create Training Video
// @route POST /api/trainingVideos
// @access Private/Instructor
const createTrainingVideo = asyncHandler(async (req, res) => {
  const trainingVideo = new TrainingVideo({
    grade: req.body.grade,
    title: req.body.title,
    img: `https://drive.google.com/uc?export=view&id=${req.body.img}`,
    video: `https://drive.google.com/file/d/${req.body.video}/preview`,
    soundFile: `https://drive.google.com/uc?export=view&id=${req.body.soundFile}`,
    category: req.body.category,
  });

  const createdTrainingVideo = await trainingVideo.save();
  res.status(201).json(createdTrainingVideo);
});

// @desc Update Training Video
// @route PUT /api/trainingVideos/:id
// @access Private/Instructor
const updateTrainingVideo = asyncHandler(async (req, res) => {
  const trainingVideo = await TrainingVideo.findById(req.body.id);

  if (trainingVideo) {
    trainingVideo.grade = req.body.grade;
    trainingVideo.title = req.body.title;
    trainingVideo.img = req.body.img;
    trainingVideo.video = req.body.video;
    trainingVideo.soundFile = req.body.soundFile;
    trainingVideo.category = req.body.category;

    const updatedTrainingVideo = await trainingVideo.save();
    res.status(201).json(updatedTrainingVideo);
  } else {
    res.status(404);
    throw new Error("Training Video not found");
  }
});

export {
  getTrainingVideos,
  getTrainingVideoById,
  deleteTrainingVideo,
  updateTrainingVideo,
  createTrainingVideo,
};
