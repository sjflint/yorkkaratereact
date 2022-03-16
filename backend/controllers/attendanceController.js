import asyncHandler from "express-async-handler";
import Attendance from "../models/attendanceModel.js";
import Member from "../models/memberModel.cjs";

// @desc get Attendance Record
// @route POST /api/attendance
// @access Private/Instructor
const getAttendanceRecord = asyncHandler(async (req, res) => {
  const attendanceRecord = await Attendance.findOne({
    date: req.body.date,
    name: req.body.name,
  });
  if (attendanceRecord && req.body._id) {
    if (attendanceRecord.participants.includes(req.body._id)) {
      res.json(attendanceRecord);
    } else {
      attendanceRecord.participants.push(req.body._id);
      await Attendance.findOneAndUpdate(
        { date: req.body.date },
        { participants: attendanceRecord.participants },
        { new: true }
      );
      res.json(attendanceRecord);
    }
  } else if (attendanceRecord && !req.body._id) {
    res.json(attendanceRecord);
  } else {
    const attendance = new Attendance({
      date: new Date().toDateString(),
      name: req.body.name,
      participants: [],
    });
    const createdAttendance = await attendance.save();
    res.status(201).json(createdAttendance);
  }
});

// @desc add Attendee
// @route POST /api/attendance/add
// @access Private/Instructor
const addAttendeeRecord = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.body.classId);

  if (record) {
    const newParticipantsList = record.participants;
    newParticipantsList.push(req.body.id);
    await Attendance.findByIdAndUpdate(
      req.body.classId,
      { participants: newParticipantsList },
      { new: true }
    );

    await Member.findByIdAndUpdate(
      req.body.id,
      { $inc: { attendanceRecord: 1 } },
      { new: true }
    );
    res.status(201).json("participants updated");
  } else {
    res.status(404).json("requested record is not found");
  }
});

// @desc remove Attendee
// @route POST /api/attendance/remove
// @access Private/Instructor
const removeAttendeeRecord = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.body.classId);

  if (record) {
    const newParticipantsList = record.participants;

    const updateParticipantsList = newParticipantsList.filter(
      (id) => id !== req.body.id
    );

    await Attendance.findByIdAndUpdate(
      req.body.classId,
      { participants: updateParticipantsList },
      { new: true }
    );

    await Member.findByIdAndUpdate(
      req.body.id,
      { $inc: { attendanceRecord: -1 } },
      { new: true }
    );
    res.status(201).json("participants updated");
  } else {
    res.status(404).json("requested record is not found");
  }
});

export { getAttendanceRecord, addAttendeeRecord, removeAttendeeRecord };
