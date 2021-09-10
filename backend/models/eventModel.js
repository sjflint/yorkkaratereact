import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    dateOfEvent: { type: Date, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    location: { type: String, required: true },
    register: { type: String },
  },
  {
    timestamp: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
