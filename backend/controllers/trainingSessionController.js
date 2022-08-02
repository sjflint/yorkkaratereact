import asyncHandler from "express-async-handler";
import TrainingSession from "../models/trainingSessionModel.cjs";
import Member from "../models/memberModel.cjs";
import { updateSubscription } from "./ddController.cjs";
import Financial from "../models/financialModel.cjs";

// @desc Fetch all training sessions
// @route GET /api/trainingSessions
// @access Public
const getTrainingSessions = asyncHandler(async (req, res) => {
  const trainingSessions = await TrainingSession.find({})
    .populate("participants", "id firstName lastName email phone")
    .sort({
      times: 1,
    });
  res.json(trainingSessions);
});

// @desc Fetch single training session
// @route GET /api/trainingSessions/:id
// @access Public
const getTrainingSessionById = asyncHandler(async (req, res) => {
  const trainingSession = await TrainingSession.findById(req.params.id);

  if (trainingSession) {
    res.json(trainingSession);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc Get logged in user classes
// @route GET /api/trainingSessions/myTrainingSessions
// @access Private
const getMyTrainingSessions = asyncHandler(async (req, res) => {
  const trainingSessions = await TrainingSession.find({
    participants: req.member._id,
  }).sort({ _id: 1 });
  res.json(trainingSessions);
});

// @desc add training session to list
// @route PUT /api/trainingSessions/addsession
// @access Private
const addTrainingSession = asyncHandler(async (req, res) => {
  const session = await TrainingSession.findById(req.body.classId);
  const member = await Member.findById(req.body.memberId);
  const financials = await Financial.findOne({});

  if (session.participants.includes(member._id)) {
    res.json("already added to class");
  } else if (session) {
    session.participants.push(req.body.memberId);

    await TrainingSession.findOneAndUpdate(
      { _id: session._id },
      {
        participants: session.participants,
        numberBooked: session.numberBooked + 1,
      },
      { new: true }
    );
    if (req.body.classList.length !== 0) {
      const paymentDetails = {
        _id: member._id,
        changeAmount: financials.costOfAdditionalClass * 100,
      };
      await updateSubscription(paymentDetails);
    }

    // ******************send email conifmring class added and new training fees************************************

    res.json("added to class");
  } else {
    res.status(404);
    throw new Error("Session not found");
  }
});

// @desc Delete training session from list
// @route POST /api/trainingSessions/deletesession
// @access Private
const deleteTrainingSession = asyncHandler(async (req, res) => {
  let session = await TrainingSession.findById(req.body.classId);
  let member = await Member.findById(req.body.memberId._id);
  const financials = await Financial.findOne({});

  const today = new Date();
  const changeDate = new Date(req.body.memberId.lastClassChange);
  changeDate.setMonth(changeDate.getMonth() + 1);

  if (
    session.participants.includes(req.body.memberId._id) &&
    changeDate < today
  ) {
    for (let i = 0; i < session.participants.length; i++) {
      if (session.participants[i] == req.body.memberId._id) {
        session.participants.splice(i, 1);

        await TrainingSession.findOneAndUpdate(
          { _id: session._id },
          {
            participants: session.participants,
            numberBooked: session.numberBooked - 1,
          },
          { new: true }
        );
        if (member.trainingFees !== financials.baseLevelTrainingFees * 100) {
          const paymentDetails = {
            _id: member._id,
            changeAmount: financials.costOfAdditionalClass * -100,
          };
          console.log(`payment details${paymentDetails}`);
          await updateSubscription(paymentDetails);
        }
      }
    }
    const lastClassChange = new Date();
    await Member.findOneAndUpdate(
      { _id: member._id },
      { lastClassChange: lastClassChange },
      { new: true }
    );

    // ******************send email confimring class deleted and new training fees****************************

    res.json("class deleted");
  } else {
    res.status(404);
    throw new Error("Participant not found");
  }
});

// @desc Switch training session
// @route POST /api/trainingSessions/switchsession
// @access Private
const switchTrainingSession = asyncHandler(async (req, res) => {
  let deleteSession = await TrainingSession.findById(req.body.deleteId);
  let member = await Member.findById(req.body.memberId._id);
  const today = new Date();
  console.log(today);
  const changeDate = new Date(req.body.memberId.lastClassChange);
  changeDate.setMonth(changeDate.getMonth() + 1);

  if (
    deleteSession.participants.includes(req.body.memberId._id) &&
    changeDate < today
  ) {
    for (let i = 0; i < deleteSession.participants.length; i++) {
      if (deleteSession.participants[i] == req.body.memberId._id) {
        deleteSession.participants.splice(i, 1);
        deleteSession.numberBooked--;
      }
    }
    await deleteSession.save();

    const addSession = await TrainingSession.findById(req.body.addId);

    if (addSession.participants.includes(req.body.memberId._id)) {
      res.json("already added to class");
    } else if (addSession) {
      addSession.participants.push(req.body.memberId._id);
      addSession.numberBooked++;

      await addSession.save();
      const lastClassChange = new Date();
      await Member.findOneAndUpdate(
        { _id: member._id },
        { lastClassChange: lastClassChange },
        { new: true }
      );

      // ******************send email confimring class switched and new training fees*********************************

      res.json("class switched");
    }
  } else {
    res.status(404);
    throw new Error("Class can't be switched");
  }
});

// @desc Get selected member's classes by id
// @route GET /api/trainingSessions/membertrainingsessions
// @access Private/admin
const getMemberTrainingSessions = asyncHandler(async (req, res) => {
  const trainingSessions = await TrainingSession.find({
    participants: req.params.id,
  }).sort({ _id: 1 });

  if (trainingSessions.length !== 0) {
    res.json(trainingSessions);
  } else {
    res.json([]);
  }
});

// @desc Delete training session
// @route DELETE /api/trainingsessions/:id
// @access Private/Admin
const deleteTimetableSession = asyncHandler(async (req, res) => {
  const trainingSession = await TrainingSession.findById(req.params.id);

  if (trainingSession.participants.length > 0) {
    res.status(404);
    throw new Error(
      "Training session not deleted as participants are registered"
    );
  } else if (trainingSession) {
    await trainingSession.remove();
    res.json({ message: "Training Session removed" });
  } else {
    res.status(404);
    throw new Error("Training Session not found");
  }
});

// @desc Create training session
// @route POST /api/trainingsessions
// @access Private/Admin
const createTimetableSession = asyncHandler(async (req, res) => {
  const trainingSession = {
    name: req.body.name,
    location: req.body.location,
    minGradeLevel: Number(req.body.minGradeLevel),
    maxGradeLevel: Number(req.body.maxGradeLevel),
    juniorSession: req.body.juniorSession,
    times: req.body.times,
    capacity: req.body.capacity,
    hallHire: req.body.hallHire,
    numberBooked: 0,
    participants: [],
  };

  console.log(trainingSession);

  await TrainingSession.create(trainingSession);

  // ******************send email to all members letting them know about the new class being set up*********************************

  res.status(201).json(trainingSession);
});

// @desc Update training session
// @route PUT /api/trainingsessions/:id
// @access Private/Admin
const updateTimetableSession = asyncHandler(async (req, res) => {
  const trainingSession = await TrainingSession.findById(req.body.id);

  if (trainingSession) {
    trainingSession.name = req.body.name;
    trainingSession.location = req.body.location;
    trainingSession.minGradeLevel = Number(req.body.minGradeLevel);
    trainingSession.maxGradeLevel = Number(req.body.maxGradeLevel);
    trainingSession.juniorSession = req.body.juniorSession;
    trainingSession.times = req.body.times;
    trainingSession.capacity = Number(req.body.capacity);
    trainingSession.hallHire = Number(req.body.hallHire);

    const updatedTrainingSession = await trainingSession.save();

    // ******************send email confimring class changes******************************

    res.status(201).json(updatedTrainingSession);
  } else {
    res.status(404);
    throw new Error("Training Session not found");
  }
});

export {
  getTrainingSessions,
  getMyTrainingSessions,
  addTrainingSession,
  deleteTrainingSession,
  switchTrainingSession,
  getMemberTrainingSessions,
  deleteTimetableSession,
  updateTimetableSession,
  createTimetableSession,
  getTrainingSessionById,
};
