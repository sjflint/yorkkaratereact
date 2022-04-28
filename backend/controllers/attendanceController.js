import asyncHandler from "express-async-handler";
import Attendance from "../models/attendanceModel.cjs";
import Member from "../models/memberModel.cjs";
import TrainingSession from "../models/trainingSessionModel.cjs";
import { serverCreatedPayment } from "./ddController.cjs";

// @desc get Attendance Record
// @route POST /api/attendance
// @access Private/Instructor
const getAttendanceRecord = asyncHandler(async (req, res) => {
  const trainingSession = await TrainingSession.findById(req.body.name);

  if (trainingSession) {
    const className = `${trainingSession.name}: ${trainingSession.times}`;

    const attendanceRecord = await Attendance.findOne({
      date: req.body.date,
      name: className,
    }).populate("extraParticipants", "id firstName lastName email phone");

    if (attendanceRecord) {
      res.json(attendanceRecord);
    } else {
      const attendance = new Attendance({
        date: new Date().toDateString(),
        name: className,
        participants: [],
      });
      const createdAttendance = await attendance.save();
      res.status(201).json(createdAttendance);
    }
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

// @desc add Extra Attendee
// @route POST /api/attendance/addextra
// @access Private/Instructor
const addExtraAttendeeRecord = asyncHandler(async (req, res) => {
  const todaysDate = new Date();
  const record = await Attendance.findById(req.body.recordId);

  const member = await Member.findById(req.body.memberId);

  // Member actions
  const lastExtraClassAdded = member.extraClassAdded.setDate(
    member.extraClassAdded.getDate() + 28
  );
  if (lastExtraClassAdded < todaysDate) {
    console.log("no action");
  } else {
    // Charge DD for extra session
    const paymentDetails = {
      _id: member._id,
      amount: 500,
      description: "Extra class payment",
      recordId: req.body.recordId,
    };
    serverCreatedPayment(paymentDetails);
  }

  try {
    const extraParticipants = record.extraParticipants;
    const memberId = extraParticipants.filter(
      (participant) => participant === member._id
    );

    if (memberId.length !== 0) {
      console.log("member already added");
      res.status(200).json("member already added");
    } else {
      console.log("adding member to array");
      extraParticipants.push(member._id);
    }
    await Attendance.findByIdAndUpdate(
      req.body.recordId,
      { extraParticipants: extraParticipants },
      { new: true }
    );
    await Member.findByIdAndUpdate(
      req.body.memberId,
      { extraClassAdded: todaysDate, $inc: { attendanceRecord: +1 } },
      { new: true }
    );

    res.status(201).json("Extra participants added");
  } catch {
    res.status(404);
  }
});

export {
  getAttendanceRecord,
  addAttendeeRecord,
  removeAttendeeRecord,
  addExtraAttendeeRecord,
};
