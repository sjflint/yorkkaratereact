import asyncHandler from "express-async-handler";
import TrialClass from "../models/trialRegistrationModel.js";
import TrainingSession from "../models/trainingSessionModel.cjs";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import dotenv from "dotenv";

dotenv.config();

// @
// desc: get all trial members awaiting to attend sessions
// Private/admin
const getAllTrials = asyncHandler(async (req, res) => {
  const trialMembers = await TrialClass.find({}).populate(
    "classSelection",
    "name location times"
  );

  if (trialMembers) {
    res.status(201).json(trialMembers);
  } else {
    res.status(404).json("Could not locate trial participants");
  }
});

const registerTrial = asyncHandler(async (req, res) => {
  // Format first name and last name to uppercase first letter and lower case for the rest
  const formatName = (name) => {
    const removeNoneAlpha = name.replace(/[^a-z0-9-\s]/gi, "");
    const nameLowerCase = removeNoneAlpha.toLowerCase().trim();
    return nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1);
  };
  const classSelection = req.body.classSelection;
  const trainingSession = await TrainingSession.findById(classSelection);

  if (trainingSession.capacity <= trainingSession.numberBooked) {
    res.status(400);
    throw new Error("Unable to register. Class is at capacity");
  } else {
    req.body.firstName = formatName(req.body.firstName);
    req.body.lastName = formatName(req.body.lastName);
    const trialClass = await TrialClass.create(req.body);

    if (trialClass) {
      res.status(201).json({ trialClassId: trialClass._id });
    } else {
      res.status(400);
      throw new Error("Unable to complete registration");
    }
  }
});

const getTrial = asyncHandler(async (req, res) => {
  const trialClass = await TrialClass.findById(req.params.id);

  if (trialClass) {
    res.send(trialClass);
  } else {
    res.status(404);
    throw new Error("Unable to locate application");
  }
});

const payTrial = asyncHandler(async (req, res) => {
  const trialClass = await TrialClass.findById(req.params.id);

  if (trialClass) {
    const classId = trialClass.classSelection;

    const trainingSession = await TrainingSession.findById(classId);

    trialClass.paid = true;
    const updatedTrialClass = await trialClass.save();

    // add to trainingSession
    trainingSession.trialParticipants.push(trialClass._id);

    await TrainingSession.findOneAndUpdate(
      { _id: trainingSession._id },
      {
        trialParticipants: trainingSession.trialParticipants,
        numberBooked: trainingSession.numberBooked + 1,
      },
      { new: true }
    );

    genericEmail({
      recipientEmail: trialClass.email,
      recipientName: trialClass.firstName,
      subject: "Thank you for registering for a trial class",
      message: `<h4>Thank you for registering for a trial class</h4>
    <p>The class you selected was ${trainingSession.name} at ${trainingSession.times}.</p>
    <p>The location is: ${trainingSession.location}</p>
    <p>You should wear comfortable sports type clothing for the session, such as tracksuit bottoms and a t-shirt. Please arrive around 10 minutes before the start time. We would recommend you stay with your child for their first session.</p>
    <p>We look forward to meeting you.</p>
    <h5>Do you have questions?</h5>
    <p>Perhaps take a look at our frequently asked questions on the trial registration page, if you haven't already</p>
    `,
      link: `${process.env.DOMAIN_LINK}/faq`,
      linkText: "Some frequently asked questions",
      attachments: [],
    });
    res.send(updatedTrialClass);
  } else {
    res.status(404);
    throw new Error("record not found");
  }
});

// check for trials completed today
const checkTrialComplete = async () => {
  const date = new Date();
  date.setDate(date.getDate() - 28);

  const deleteRecord = async (attendee) => {
    console.log("deleting attendee...");
    const trainingSession = await TrainingSession.findById(
      attendee.classSelection
    );
    if (trainingSession) {
      const trialParticipants = trainingSession.trialParticipants;

      const newTrialParticipants = trialParticipants.filter(
        (participant) =>
          JSON.stringify(participant) !== JSON.stringify(attendee._id)
      );

      await TrainingSession.findOneAndUpdate(
        { _id: trainingSession._id },
        {
          trialParticipants: newTrialParticipants,
          numberBooked: trainingSession.numberBooked - 1,
        },
        { new: true }
      );
    }
    await TrialClass.deleteOne({ _id: attendee._id });
  };

  const trialAttendees = await TrialClass.find({});
  if (trialAttendees) {
    trialAttendees.forEach(async (attendee) => {
      if (attendee.completed === true) {
        genericEmail({
          recipientEmail: attendee.email,
          recipientName: attendee.firstName,
          subject: "Thank you for attending the trial yesterday",
          message: `<h4>Thank you for attending the trial session yetserday</h4>
        <p>I hope that you, or your child, is keen to continue their karate journey and learn more.</p>
        <h5>What next?</h5>
        <p>Please register by completing our quick and easy online application form. Use the link below to jump straight to where you need to be:</p>
        `,
          link: `${process.env.DOMAIN_LINK}/register`,
          linkText: "Register",
          attachments: [],
        });

        deleteRecord(attendee);
      }

      if (attendee.createdAt < date || attendee.paid === false) {
        deleteRecord(attendee);
      }
    });
  }
};

export { registerTrial, getTrial, payTrial, checkTrialComplete, getAllTrials };
