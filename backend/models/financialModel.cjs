const mongoose = require("mongoose");

const financialSchema = mongoose.Schema({
  baseLevelTrainingFees: { type: Number, required: true },
  joiningFee: { type: Number, required: true },
  costOfAdditionalClass: { type: Number, required: true },
  costOfExtraFee: { type: Number, required: true },
  costOfGrading: { type: Number, required: true },
  costOfTrainingCourse: { type: Number, required: true },
  totalMembers: { type: Array },
});

const Financial = (module.exports = mongoose.model(
  "Financial",
  financialSchema
));
