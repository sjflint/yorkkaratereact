import mongoose from "mongoose";

const trialClassSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    ageGroup: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    medicalStatus: { type: String, required: true },
    medicalDetails: { type: String },
    paid: { type: Boolean, required: true, default: false },
    completed: { type: Boolean, required: true, default: false },
    classSelection: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "TrainingSession",
    },
  },
  {
    timestamps: true,
  }
);

const TrialClass = mongoose.model("TrialClass", trialClassSchema);

export default TrialClass;
