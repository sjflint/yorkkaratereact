import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
  date: { type: Date, required: true, default: new Date().toDateString() },
  name: { type: String, required: true },
  participants: { type: Array, required: true, default: [] },
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
