import asyncHandler from "express-async-handler";
import TrainingSession from "../models/trainingSessionModel.cjs";
import Member from "../models/memberModel.cjs";
import { updateSubscription } from "./ddController.cjs";
import Financial from "../models/financialModel.cjs";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import dotenv from "dotenv";

dotenv.config();

// @desc Fetch all training sessions
// @route GET /api/trainingSessions
// @access Public
const getTrainingSessions = asyncHandler(async (req, res) => {
  const trainingSessions = await TrainingSession.find({})
    .populate(
      "participants",
      "id firstName lastName email phone medicalStatus dateOfBirth attendanceRecord"
    )
    .populate(
      "trialParticipants",
      "id firstName lastName email phone medicalStatus"
    )
    .sort({
      day: 1,
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
        changeAmount: financials.costOfAdditionalClass,
      };
      console.log(paymentDetails);
      await updateSubscription(paymentDetails);
    }
    genericEmail({
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "New class added",
      message: `<h4>${member.firstName}, we have upgraded your membership to include an extra class per week</h4>
              <p>We have added the following class to your training schedule:</p>
              <p>${session.name}<br/>${session.location}<br/>${session.times}
            `,
      link: `${process.env.DOMAIN_LINK}/profile?key=third`,
      linkText: "View your training sessions",
      attachments: [],
    });

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
        if (member.trainingFees !== financials.baseLevelTrainingFees) {
          const paymentDetails = {
            _id: member._id,
            changeAmount: financials.costOfAdditionalClass * -1,
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
    genericEmail({
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "Class removed",
      message: `<h4>${member.firstName}, at your request we have reduced your membership and removed one class per week</h4>
              <p>We have removed the following class from your training schedule:</p>
              <p>${session.name}<br/>${session.location}<br/>${session.times}   
            `,
      link: `${process.env.DOMAIN_LINK}/profile?key=third`,
      linkText: "View your training sessions",
      attachments: [],
    });

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
      genericEmail({
        recipientEmail: `${member.email}, ${member.secondaryEmail}`,
        recipientName: member.firstName,
        subject: "Class switched",
        message: `<h4>${member.firstName}, at your request we have switched your training sessions</h4>
                <p>We have removed the following class from your training schedule:</p>
                <p>${deleteSession.name}<br/>${deleteSession.location}<br/>${deleteSession.times}   
                <p>We have added the following class to your training schedule:</p>
                <p>${addSession.name}<br/>${addSession.location}<br/>${addSession.times}   
              `,
        link: `${process.env.DOMAIN_LINK}/profile?key=third`,
        linkText: "View your training sessions",
        attachments: [],
      });

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
  let day;
  switch (req.body.dayOfWeek) {
    case "Monday":
      day = 0;
      break;
    case "Tuesday":
      day = 1;
      break;
    case "Wednesday":
      day = 2;
      break;
    case "Thursday":
      day = 3;
      break;
    case "Friday":
      day = 4;
      break;
    case "Saturday":
      day = 5;
      break;
    case "Sunday":
      day = 6;
      break;
  }

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
    day: day,
  };

  await TrainingSession.create(trainingSession);

  const members = await Member.find({ ddsuccess: true });
  let junior = false;
  if (trainingSession.juniorSession === true) {
    junior = true;
  }

  let recipients = [];
  for (const member of members) {
    recipients.push(member.email, member.secondaryEmail);
  }

  genericEmail({
    recipientEmail: recipients,
    subject: "New class starting",
    message: `<h4>Dear members, we have a new training session on the timetable</h4>
              <p>This new class is for ${
                junior === true ? "Juniors" : "ages 9+"
              }. The class details are:</p>
              <p>${trainingSession.name}<br/>${trainingSession.location}<br/>${
      trainingSession.times
    }   
              <p>If you are interested in this session, and you meet the age/grade requirement, you can book a place now via your profile page. Please click the link below.</p>
            `,
    link: `${process.env.DOMAIN_LINK}/profile?key=third`,
    linkText: "View your training sessions",
    attachments: [],
  });

  res.status(201).json(trainingSession);
});

// @desc Update training session
// @route PUT /api/trainingsessions/:id
// @access Private/Admin
const updateTimetableSession = asyncHandler(async (req, res) => {
  let day;
  switch (req.body.dayOfWeek) {
    case "Monday":
      day = 0;
      break;
    case "Tuesday":
      day = 1;
      break;
    case "Wednesday":
      day = 2;
      break;
    case "Thursday":
      day = 3;
      break;
    case "Friday":
      day = 4;
      break;
    case "Saturday":
      day = 5;
      break;
    case "Sunday":
      day = 6;
      break;
  }
  const trainingSession = await TrainingSession.findById(req.body.id);
  const members = await Member.find({ ddsuccess: true });

  if (trainingSession) {
    trainingSession.name = req.body.name;
    trainingSession.location = req.body.location;
    trainingSession.minGradeLevel = Number(req.body.minGradeLevel);
    trainingSession.maxGradeLevel = Number(req.body.maxGradeLevel);
    trainingSession.juniorSession = req.body.juniorSession;
    trainingSession.times = req.body.times;
    trainingSession.capacity = Number(req.body.capacity);
    trainingSession.hallHire = Number(req.body.hallHire);
    trainingSession.day = day;

    const updatedTrainingSession = await trainingSession.save();
    // review this. Combine email addresses into a single email and send only to those eligible by age/grade
    const recipients = [];
    for (const member of members) {
      recipients.push(member.email, member.secondaryEmail);
    }
    genericEmail({
      recipientEmail: recipients,
      subject: "Class has been amended",
      message: `<h4>Dear members, we have amended a training session on the timetable</h4>
              <p>The class details are:</p>
              <p>${trainingSession.name}<br/>${trainingSession.location}<br/>${trainingSession.times}
              <p>If you are interested in this session, and you meet the age/grade requirement, you can book a place now via your profile page. Please click the link below.</p>
            `,
      link: `${process.env.DOMAIN_LINK}/profile?key=third`,
      linkText: "View your training sessions",
      attachments: [],
    });

    res.status(201).json(updatedTrainingSession);
  } else {
    res.status(404);
    throw new Error("Training Session not found");
  }
});

// @desc Cancel a training session
// @route POST /api/trainingsessions/:id
// @access Private/Admin
const trainingSessionCancelled = asyncHandler(async (req, res) => {
  const classId = req.body.classId;

  const trainingSession = await TrainingSession.findById(classId);
  if (trainingSession) {
    const participants = trainingSession.participants;
    const recipients = [];

    // create record of cancelled class
    const date = new Date(req.body.date);
    await TrainingSession.updateOne(
      { _id: classId },
      { $push: { cancelledClasses: date } }
    );

    for (const participant of participants) {
      const member = await Member.findById(participant);

      if (member) {
        member.freeClasses++;
        member.save();
        recipients.push(member.email, member.secondaryEmail);
        console.log(`free class added for ${member.firstName}`);
      }
    }
    genericEmail({
      recipientEmail: recipients,
      subject: "A Class has been cancelled",
      message: `<h4>Unfortunately, we have had to cancel one of your training sessions. We are sorry for the inconvenience.</h4>
          <p>The class that has been cancelled is:</p>
          <p>${trainingSession.name}<br/>${trainingSession.location}<br/>${
        trainingSession.times
      }<br/>On the ${new Date(req.body.date).toLocaleDateString()}
          <p>A free session has been added to your account to be used at any other suitable training session on the timetable. There is no need to book, simply turn up for the training session you would like to attend and the instructor will add you to the register.</p>
          <p>Please accept my apology for the inconvenience</p>
        `,
      link: `${process.env.DOMAIN_LINK}/timetable`,
      linkText: "View our timetable",
      attachments: [],
    });
    res.status(201).json("class cancelled");
  } else {
    res.status(404);
    throw new Error("Training Session not found");
  }
});

// @desc add details to waiting list
// @route POST /api/trainingsessions/waitinglist
// @access Public
const postWaitingList = asyncHandler(async (req, res) => {
  const waitingList = {
    email: req.body.email,
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  const trainingSession = await TrainingSession.findByIdAndUpdate(
    req.body.classId,
    {
      $push: { waitingList: waitingList },
    }
  );
  if (trainingSession) {
    res.status(201).json(trainingSession);
  }
});

// @desc run test on training sessions and send emails on waiitng lists if required
// @route server only
// @access server only
const waitingListCheck = async () => {
  const formatName = (name) => {
    const removeNoneAlpha = name.replace(/[^a-z0-9-']/gi, "");
    const nameLowerCase = removeNoneAlpha.toLowerCase().trim();
    return nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1);
  };
  const trainingSessions = await TrainingSession.find({});

  trainingSessions.forEach((trainingSession) => {
    if (trainingSession.capacity - trainingSession.numberBooked > 0) {
      if (
        trainingSession.waitingList &&
        trainingSession.waitingList.length > 0
      ) {
        trainingSession.waitingList.forEach((member) => {
          genericEmail({
            recipientEmail: member.email,
            subject: `A Place has become available in the ${trainingSession.name} session`,
            message: `<h4>Hi ${formatName(member.firstName)}, GOOD NEWS!</h4>
                <p>A place has become available in the ${
                  trainingSession.name
                } session. You indicated that you might be interested in this class.</p>
                <h5>What now?</h5>
                <p>If you are a member of York Karate already, please login to your account and add the class to your list of classes.</p> 
                <p>If you are not a member of York Karate but are considering joining, you can book a trial session through our website. To do this, please click the link below.</p>               
              `,
            link: `${process.env.DOMAIN_LINK}/trialregistrationform`,
            linkText: "Book A Trial.",
            attachments: [],
          });
        });
        trainingSession.waitingList = [];
        trainingSession.save();
      }
    }
  });
};

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
  trainingSessionCancelled,
  postWaitingList,
  waitingListCheck,
};
