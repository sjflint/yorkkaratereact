const mongoose = require("mongoose");

const trainingSessionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    minGradeLevel: { type: Number, required: true },
    maxGradeLevel: { type: Number, required: true },
    progressionPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingSession",
      default: null,
    },
    juniorSession: { type: Boolean, required: true },
    times: { type: String, required: true },
    day: { type: Number, required: true },
    capacity: { type: Number, required: true },
    hallHire: { type: Number, required: true },
    numberBooked: { type: Number, required: true, default: 0 },
    cancelledClasses: { type: Array },
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
    waitingList: [
      {
        type: Object,
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
