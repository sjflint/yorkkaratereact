import mongoose from "mongoose";

const enquirySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    ageGroup: { type: String, required: true },
    message: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
  },
  {
    timestamp: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
