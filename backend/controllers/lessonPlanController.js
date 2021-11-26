import asyncHandler from "express-async-handler";
import LessonPlan from "../models/lessonPlanModel.js";

// @desc Fetch all lesson Plans
// @route GET /api/lessonPlans
// @access Private/Instructor
const getLessonPlans = asyncHandler(async (req, res) => {
  const lessonPlans = await LessonPlan.find({});
  res.json(lessonPlans);
});

// @desc Delete Lesson Plan
// @route DELETE /api/lessonplan/:id
// @access Private/Instructor
const deleteLessonPlan = asyncHandler(async (req, res) => {
  const lessonPlan = await LessonPlan.findById(req.params.id);

  if (lessonPlan) {
    await lessonPlan.remove();
    res.json({ message: "Lesson Plan deleted" });
  } else {
    res.status(404);
    throw new Error("Lesson Plan not found");
  }
});

// @desc Create Training Video
// @route POST /api/lessonplans
// @access Private/Instructor
const createLessonPlan = asyncHandler(async (req, res) => {
  const lessonPlan = new LessonPlan({
    kihon: req.body.kihon,
    kihonKumite: req.body.kihonKumite,
    shobuKumite: req.body.shobuKumite,
    kata: req.body.kata,
    title: req.body.title,
    description: req.body.description,
  });

  const createdLessonPlan = await lessonPlan.save();
  res.status(201).json(createdLessonPlan);
});

// @desc Update Lesson Plan
// @route PUT /api/lessonplans/:id
// @access Private/Instructor
const updateLessonPlan = asyncHandler(async (req, res) => {
  const lessonPlan = await LessonPlan.findById(req.body.id);

  if (lessonPlan) {
    lessonPlan.kihon = req.body.kihon;
    lessonPlan.kihonKumite = req.body.kihonKumite;
    lessonPlan.shobuKumite = req.body.shobuKumite;
    lessonPlan.kata = req.body.kata;

    const updatedLessonPlan = await lessonPlan.save();
    res.status(201).json(updatedLessonPlan);
  } else {
    res.status(404);
    throw new Error("Lesson plan not found");
  }
});

// @desc Fetch single lesson plan
// @route GET /api/lessonplans/:id
// @access Private / Instructor
const getLessonPlanById = asyncHandler(async (req, res) => {
  const lessonPlan = await LessonPlan.findById(req.params.id);

  if (lessonPlan) {
    res.json(lessonPlan);
  } else {
    res.status(404);
    throw Error("Lesson plan not found");
  }
});

export {
  getLessonPlans,
  deleteLessonPlan,
  createLessonPlan,
  updateLessonPlan,
  getLessonPlanById,
};
