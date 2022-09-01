import mongoose from "mongoose";

const lessonPlanSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  kihon: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingVideo",
    },
  ],
  kata: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingVideo",
    },
  ],
  kihonKumite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingVideo",
    },
  ],
  shobuKumite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingVideo",
    },
  ],
  additionalInfo: { type: Array },
});

const LessonPlan = mongoose.model("LessonPlan", lessonPlanSchema);

export default LessonPlan;
