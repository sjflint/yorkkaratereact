const mongoose = require("mongoose");

const financialSchema = mongoose.Schema({
  baseLevelTrainingFees: { type: Number, required: true },
  joiningFee: { type: Number, required: true },
  costOfAdditionalClass: { type: Number, required: true },
  costOfExtraFee: { type: Number, required: true },
  costOfGrading: { type: Number, required: true },
});

const Financial = (module.exports = mongoose.model(
  "Financial",
  financialSchema
));
