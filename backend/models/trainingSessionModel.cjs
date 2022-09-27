const mongoose = require("mongoose");

const trainingSessionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    minGradeLevel: { type: Number, required: true },
    maxGradeLevel: { type: Number, required: true },
    juniorSession: { type: Boolean, required: true },
    times: { type: String, required: true },
    day: { type: Number, required: true },
    capacity: { type: Number, required: true },
    hallHire: { type: Number, required: true },
    numberBooked: { type: Number, required: true, default: 0 },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    trialParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrialClass",
      },
    ],
  },
  {
    timestamp: true,
  }
);

const TrainingSessions = mongoose.model(
  "TrainingSession",
  trainingSessionSchema
);

const TrainingSession = (module.exports = mongoose.model(
  "TrainingSession",
  trainingSessionSchema
));
