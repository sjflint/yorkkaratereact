import asyncHandler from "express-async-handler";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Attendance from "../models/attendanceModel.cjs";
import Finance from "../models/financialModel.cjs";
import Member from "../models/memberModel.cjs";
import TrainingSession from "../models/trainingSessionModel.cjs";
import TrialClass from "../models/trialRegistrationModel.js";
import { serverCreatedPayment } from "./ddController.cjs";

// @desc get all attendance records for one member
// @route GET /api/attendance/:id
// @access Public
const getmemberAttendanceRecords = asyncHandler(async (req, res) => {
  const numberOfResults = req.params.numresults;
  const member = req.params.id;

  const attendanceRecord = await Attendance.find({}).sort({ date: 1 });

  let result = [];
  for (let i = attendanceRecord.length - 1; i >= 0; i--) {
    attendanceRecord[i].participants.forEach((participant) => {
      if (participant === member) {
        const record = {
          date: new Date(attendanceRecord[i].date),
          class: attendanceRecord[i].name,
        };
        result.push(record);
      }
    });
    attendanceRecord[i].extraParticipants.forEach((participant) => {
      const id = String(participant);

      if (id === member) {
        const record = {
          date: new Date(attendanceRecord[i].date),
          class: `${attendanceRecord[i].name} - EXTRA CLASS`,
        };

        result.push(record);
      }
    });
  }

  result.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  if (result.length > 0) {
    res.status(201).json(result.slice(0, numberOfResults * -1));
  } else {
    res.json("No results found");
  }
});

// @desc get one Attendance Record
// @route POST /api/attendance
// @access Private/Instructor
const getAttendanceRecord = asyncHandler(async (req, res) => {
  const trainingSession = await TrainingSession.findById(req.body.name);

  if (trainingSession) {
    const className = `${trainingSession.name}: ${trainingSession.times}`;

    const attendanceRecord = await Attendance.findOne({
      date: req.body.date,
      name: className,
    }).populate(
      "extraParticipants",
      "id firstName lastName email phone attendanceRecord"
    );

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

  if (member.freeClasses > 1) {
    member.freeClasses--;
    member.save();
    console.log("free class used");
  } else if (member.freeClasses === 1) {
    console.log("using last class");
    member.freeClasses--;
    const refundDate = todaysDate.setDate(todaysDate.getDate() + 28);
    member.classCreditRefund = refundDate;
    member.save();
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
    const date = new Date(record.date).toLocaleDateString("en-GB");
    genericEmail({
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "Extra class attended",
      message: `<h4>Extra class attended</h4>
      <p>Thank you for attending the class ${record.name} on ${date}.</p>
      <p>If this class is an additional class this month, you will receive notification from goCardless about any additional fees. Perhaps consider reviewing your training schedule and seeing if it might be worth adding an extra class to your weekly program.</p>
      <h5>What is our club policy on attending additional classes</h5>
      <p>In general, it is expected that you will attend the classes that you are booked in for. However, we understand that life can get in the way of our plans and so you may attend one free class every 28 days. This should be used when you miss one of your regular classes.</p>
      <p>You may attend more than one extra class in any given 28 day time period, but this will incur a charge.</p>
      <p>One exception is when we cancel a training session. You will get a notification by email if your class has been cancelled and receive a free class credit to be used at any other training session. Please view your profile on the website to see if you currently have any free class credits available.</p>
      <p>You do not need to pre-book extra classes. Simply attend the class and the instructor will add you to the register.</p>
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
  addExtraAttendeeRecord,
  getmemberAttendanceRecords,
};
