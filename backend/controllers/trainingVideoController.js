import asyncHandler from "express-async-handler";
import TrainingVideo from "../models/trainingVideosModel.js";

// @desc Fetch all videos (paginated)
// @route GET /api/trainingVideos
// @access Public
const getTrainingVideos = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            title: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            category: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            grade: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ],
      }
    : null;

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  console.log(keyword);
  if (!keyword) {
    const trainingVideos = await TrainingVideo.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    const count = await TrainingVideo.countDocuments();
    res.json({ trainingVideos, page, pages: Math.ceil(count / pageSize) });
  } else {
    const trainingVideos = await TrainingVideo.find({ ...keyword });
    res.json({ trainingVideos });
  }
});

// @desc Fetch all videos (unpaginated)
// @route GET /api/trainingvideos/all
// @access Public
const getAllTrainingVideos = asyncHandler(async (req, res) => {
  const trainingVideos = await TrainingVideo.find({});
  if (trainingVideos) {
    res.json(trainingVideos);
  } else {
    res.json(404);
    throw Error("Videos not found");
  }
});

// Fetch videos for member grade ???????
// @desc Fetch all videos for a certain grade
// @route GET /api/getTrainingVideos/grade
// @access Public
const getTrainingVideosByGrade = asyncHandler(async (req, res) => {
  const trainingVideos = await TrainingVideo.find({
    grade: req.params.grade,
  });

  if (trainingVideos) {
    res.json(trainingVideos);
  } else {
    res.status(404);
    throw Error("Videos not found");
  }
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
    img: req.body.img,
    video: req.body.video,
    soundFile: req.body.soundFile,
    category: req.body.category,
  });

  const createdTrainingVideo = await trainingVideo.save();

  // ******************send email with new training video***************??????????????????????????

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
  getAllTrainingVideos,
  getTrainingVideoById,
  deleteTrainingVideo,
  updateTrainingVideo,
  createTrainingVideo,
  getTrainingVideosByGrade,
};
