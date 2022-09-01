const mongoose = require("mongoose");

const formerBlackBeltsSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    danGrade: { type: Number, required: true, default: 0 },
    danGradings: {
      type: Object,
      required: true,
    },
    profileImg: {
      type: String,
      required: true,
    },
    dateLeft: { type: Date, default: Date.now },
  },
  {
    timestamp: true,
  }
);

const FormerBlackBelts = (module.exports = mongoose.model(
  "FormerBlackBelts",
  formerBlackBeltsSchema
));
