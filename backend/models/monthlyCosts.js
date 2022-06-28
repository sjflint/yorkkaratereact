import mongoose from "mongoose";

const monthlyCostsSchema = mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
});

const MonthlyCosts = mongoose.model("MonthlyCosts", monthlyCostsSchema);

export default MonthlyCosts;
