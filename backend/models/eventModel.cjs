const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    dateOfEvent: { type: Date, required: true },
    description: { type: Array, required: true },
    image: { type: String },
    author: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    location: { type: String, required: true },
    register: { type: String },
    participants: { type: Array, required: true, default: [] },
    trainingParticipants: { type: Array, required: true, default: [] },
  },
  {
    timestamp: true,
  }
);

const Event = (module.exports = mongoose.model("Event", eventSchema));
