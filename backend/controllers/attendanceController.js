import asyncHandler from "express-async-handler";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Attendance from "../models/attendanceModel.cjs";
import Finance from "../models/financialModel.cjs";
import Member from "../models/memberModel.cjs";
import TrainingSession from "../models/trainingSessionModel.cjs";
import TrialClass from "../models/trialRegistrationModel.js";
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

  console.log(req.body);

  if (req.body.addRemove === "add") {
    if (record) {
      const newParticipantsList = record.participants;
      newParticipantsList.push(req.body.id);
      const newRecord = await Attendance.findByIdAndUpdate(
        req.body.classId,
        { participants: newParticipantsList },
        { new: true }
      );

      const trialMember = await TrialClass.findById(req.body.id);

      if (trialMember) {
        trialMember.completed = true;
        trialMember.save();
        res.status(201).json(trialMember);
      } else {
        await Member.findByIdAndUpdate(
          req.body.id,
          { $inc: { attendanceRecord: 1 } },
          { new: true }
        );
        res.status(201).json(newRecord);
      }
    } else {
      res.status(404).json("requested record is not found");
    }
  }

  if (req.body.addRemove === "remove") {
    if (record) {
      const newParticipantsList = record.participants;

      console.log(`The current list of participants: ${newParticipantsList}`);

      const updateParticipantsList = newParticipantsList.filter(
        (id) => String(id) !== String(req.body.id)
      );

      console.log(`The new list of participants: ${updateParticipantsList}`);

      const newRecord = await Attendance.findByIdAndUpdate(
        req.body.classId,
        { participants: updateParticipantsList },
        { new: true }
      );

      const trialMember = await TrialClass.findById(req.body.id);

      if (trialMember) {
        trialMember.completed = false;
        trialMember.save();
        res.status(201).json("participants updated");
      } else {
        await Member.findByIdAndUpdate(
          req.body.id,
          { $inc: { attendanceRecord: -1 } },
          { new: true }
        );
        res.status(201).json(newRecord);
      }
    } else {
      res.status(404).json("requested record is not found");
    }
  }
});

// @desc remove Attendee
// @route POST /api/attendance/remove
// @access Private/Instructor
const removeAttendeeRecord = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.body.classId);

  // if (record) {
  //   const newParticipantsList = record.participants;

  //   console.log(`The current list of participants: ${newParticipantsList}`);

  //   const updateParticipantsList = newParticipantsList.filter(
  //     (id) => String(id) !== String(req.body.id)
  //   );

  //   console.log(`The new list of participants: ${updateParticipantsList}`);

  //   await Attendance.findByIdAndUpdate(
  //     req.body.classId,
  //     { participants: updateParticipantsList },
  //     { new: true }
  //   );

  //   const trialMember = await TrialClass.findById(req.body.id);

  //   if (trialMember) {
  //     trialMember.completed = false;
  //     trialMember.save();
  //     res.status(201).json("participants updated");
  //   } else {
  //     await Member.findByIdAndUpdate(
  //       req.body.id,
  //       { $inc: { attendanceRecord: -1 } },
  //       { new: true }
  //     );
  //     res.status(201).json("participants updated");
  //   }
  // } else {
  //   res.status(404).json("requested record is not found");
  // }
});

// @desc add Extra Attendee
// @route POST /api/attendance/addextra
// @access Private/Instructor
const addExtraAttendeeRecord = asyncHandler(async (req, res) => {
  const todaysDate = new Date();
  const memberId = req.body.memberId;
  const record = await Attendance.findById(req.body.recordId);

  const member = await Member.findById(req.body.memberId);

  const financials = await Finance.findOne({});

  const extraFee = financials.costOfExtraFee;

  // Member actions
  const lastExtraClassAdded = member.extraClassAdded.setDate(
    member.extraClassAdded.getDate() + 28
  );

  console.log(todaysDate);
  console.log(lastExtraClassAdded);

  if (member.freeClasses > 0) {
    member.freeClasses--;
    member.save();
    console.log("free class used");
  } else if (lastExtraClassAdded < todaysDate) {
    console.log("no action as extra class option used");
  } else {
    // Charge DD for extra session
    console.log("charging for extra class");
    const paymentDetails = {
      _id: member._id,
      amount: extraFee,
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

    // send email to confirm new class
    const date = new Date(record.date).toLocaleDateString();
    genericEmail({
      recipientEmail: member.email,
      recipientName: member.firstName,
      subject: "Extra class attended",
      message: `<h4>Extra class attended</h4>
      <p>Thank you for attending the class ${record.name} on ${date}.</p>
      <p>If this class is an additional class this month, you will receive notification from goCardless about any additional fees. Perhaps consider reviewing your training schedule and seeing if it might be worth adding an extra class to your weekly program.</p>
      `,
      link: `${process.env.DOMAIN_LINK}/profile?key=third`,
      linkText: "Review your class bookings",
      attachments: [],
    });

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
