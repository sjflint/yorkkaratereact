const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
  date: { type: Date, required: true, default: new Date().toDateString() },
  name: { type: String, required: true },
  participants: { type: Array, required: true, default: [] },
  extraParticipants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
});

const Attendance = (module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
));
