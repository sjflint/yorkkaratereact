const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel.cjs");
const Member = require("../models/memberModel.cjs");
const Financial = require("../models/financialModel.cjs");
const { genericEmail } = require("../emailTemplates/genericEmail.cjs");
const TrainingSession = require("../models/trainingSessionModel.cjs");

const dotenv = require("dotenv");

dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Live
);

// @desc Post grading application and payment
// @route POST /api/grading/:id
// @access Private
const postGradingApplication = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.body.memberId);
  const financials = await Financial.findOne({});

  if (!member) {
    res.status(404);
    throw new Error("Cannot find member details");
  } else {
    const mandate = member.ddMandate;

    if (!mandate || mandate === "Cancelled") {
      res.status(404);
      throw new Error("Cannot find direct debit details");
    } else {
      // process payment and update grading course
      try {
        if (member.kyuGrade <= 1) {
          console.log("registering for the training course...");
          const costOfTraining = financials.costOfTrainingCourse;
          const payment = await client.payments.create(
            {
              amount: costOfTraining,
              currency: "GBP",
              description: "Course Training Fees",
              links: {
                mandate: mandate,
              },
              metadata: {
                gradingId: req.params.id,
              },
            },
            `${member._id} - course training fees`
          );
          if (payment) {
            const gradingCourse = await Event.findById(req.params.id);
            if (!gradingCourse) {
              res.status(500);
              throw new Error(
                "Internal server error. Payment may have been taken but your application may not have been processed. Please contact us for assistance"
              );
            } else {
              gradingCourse.trainingParticipants.push({
                _id: member._id,
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
                phone: member.phone,
                paymentStatus: "pending",
                paymentId: payment.id,
              });

              await gradingCourse.save();

              // Send confirmation email
              const dateOfEvent = new Date(gradingCourse.dateOfEvent);
              genericEmail({
                recipientEmail: `${member.email}, ${member.secondaryEmail}`,
                recipientName: member.firstName,
                subject: gradingCourse.title,
                message: `<h4>${gradingCourse.title}</h4>
                          <p>Date: ${dateOfEvent.toLocaleDateString(
                            "en-GB"
                          )}.</p>
                          <p>Location: ${gradingCourse.location}.</p>
                          <p>Thank you for registering for the training session.</p>
                        `,
                link: `${process.env.DOMAIN_LINK}/event/${gradingCourse._id}`,
                linkText: "View more details",
                image: gradingCourse.image,
                attachments: [],
              });
            }
          }

          // Limit number of attendees
          res.send("training course application successful!");
        } else {
          const costOfGrading = financials.costOfGrading;
          console.log(`Cost of grading: ${costOfGrading}`);
          const payment = await client.payments.create(
            {
              amount: costOfGrading,
              currency: "GBP",
              description: "Grading fee",
              links: {
                mandate: mandate,
              },
              metadata: {
                gradingId: req.params.id,
              },
            },

            `${member._id} - grading fee`
          );

          if (payment) {
            const gradingCourse = await Event.findById(req.params.id);
            if (!gradingCourse) {
              res.status(500);
              throw new Error(
                "Internal server error. Payment may have been taken but your application may not have been processed. Please contact us for assistance"
              );
            } else {
              gradingCourse.participants.push({
                _id: member._id,
                firstName: member.firstName,
                lastName: member.lastName,
                grade: member.kyuGrade,
                email: member.email,
                phone: member.phone,
                dateOfBirth: member.dateOfBirth,
                licenseNumber: member.licenseNumber,
                paymentStatus: "pending",
                paymentId: payment.id,
              });
              await gradingCourse.save();

              // Send confirmation email
              const dateOfEvent = new Date(gradingCourse.dateOfEvent);
              genericEmail({
                recipientEmail: `${member.email}, ${member.secondaryEmail}`,
                recipientName: member.firstName,
                subject: gradingCourse.title,
                message: `<h4>${gradingCourse.title}</h4>
            <p>Date: ${dateOfEvent.toLocaleDateString("en-GB")}.</p>
            <p>Location: ${gradingCourse.location}.</p>
            <p>Thank you for registering for the grading course.</p>
            <h4>Good luck on the day!</h4>
            `,
                link: `${process.env.DOMAIN_LINK}/event/${gradingCourse._id}`,
                linkText: "View more details",
                image: gradingCourse.image,
                attachments: [],
              });

              res.send("grading application successful!");
            }
          }
        }
      } catch (err) {
        res.status(400);
        throw new Error(
          "Payment could not be processed. This could be because the payment has already been collected, or there is a problem with the direct debit mandate. Please contact us for further assistance."
        );
      }
    }
  }
});

// @desc Get grading details
// @route GET /api/grading/:id
// @access Private/Instructor
const getGradingDetails = asyncHandler(async (req, res) => {
  const grading = await Event.findById(req.params.id);

  const beltsToOrder = await beltCalculator();

  grading.beltsToOrder = beltsToOrder;

  if (grading) {
    res.json(grading);
  } else {
    res.status(404);
    throw Error("Grading not found");
  }
});

// @desc POST grading results
// @route POST /api/grading/results
// @access Private/Instructor or admin
const postGradingResult = asyncHandler(async (req, res) => {
  console.log("posting grading result");
  const confirmedResults = req.body.confirmedResults;
  const eventId = req.body.eventId;

  // member ID
  // Grading event ID
  // <8 === fail, <10 === condiitonal pass, >=10 === pass, >=17 === pass with distinction
  for (record of confirmedResults) {
    const { memberId, result } = record;

    const member = await Member.findById(memberId);
    const dob = new Date(member.dateOfBirth);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    const age = Math.abs(age_dt.getUTCFullYear() - 1970);

    const financials = await Financial.findById("627d1d7b4a3c41c6226bbaf6");
    await Event.findByIdAndUpdate(eventId, {
      $push: { gradingResults: { _id: memberId, result: result } },
    });

    if (result == null) {
      // Take no action as scored in error and then removed. This is some awesome coding isn't it Simon!!!! Great job!!!
    } else if (result < 8) {
      // failed
      console.log("grading failed");
      member.attendanceRecord = 0;
      await member.save();
    } else if (result < 10) {
      // conditional pass
      console.log("conditional pass");
      member.kyuGrade--;
      if (member.kyuGrade === 10) {
        member.kyuGrade--;
        switchClasses(member._id);
      }
      if (member.kyuGrade === 6) {
        switchClasses(member._id);
      }
      const belts = financials.belts;
      belts[member.kyuGrade]--;
      await Financial.findOneAndUpdate({}, { belts: belts }, { new: true });

      if (member.kyuGrade > 10 && age > 8) {
        member.kyuGrade = 10;
        switchClasses(member._id);
        member.markModified("kyuGrade");
        member.save();
      }

      await member.save();
      member.kyuGrade > 10
        ? (member.attendanceRecord = -10)
        : member.kyuGrade > 6
        ? (member.attendanceRecord = -16)
        : (member.attendanceRecord = -24);
      await member.save();
    } else {
      // pass
      console.log("pass");
      member.kyuGrade--;
      if (member.kyuGrade === 10) {
        member.kyuGrade--;
        switchClasses(member._id);
      }
      if (member.kyuGrade === 6) {
        switchClasses(member._id);
      }
      member.attendanceRecord = 0;
      await member.save();
      const belts = financials.belts;
      belts[member.kyuGrade]--;
      await Financial.findOneAndUpdate({}, { belts: belts }, { new: true });
      if (member.kyuGrade > 10 && age > 8) {
        member.kyuGrade = 10;
        switchClasses(member._id);
        member.markModified("kyuGrade");
        member.save();
      }
    }
  }
  await Event.findOneAndUpdate(eventId, { resultsPosted: true });
  res.status(201).json("results logged");
});

const updateScore = asyncHandler(async (req, res) => {
  const grading = await Event.findById(req.body.eventId);

  if (grading) {
    grading.participants.forEach(async (participant) => {
      if (participant._id.toString() === req.body.id.toString()) {
        console.log("code running...");
        let style = req.body.style;
        participant[style] = Number(req.body.score);
        console.log(participant);
        grading.markModified("participants");
        await grading.save();
      }
    });
  }
  res.json("score updated");
});

// @desc GET grading results (for an individual member)
// @route GET /api/grading/results
// @access Private
const getGradingResults = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  let results = [];
  const events = await Event.find({});
  if (events) {
    events.forEach((grading) => {
      grading.participants.forEach((participant) => {
        if (participant._id.toString() == req.params.id.toString()) {
          const result = {
            kihon: participant.kihon,
            kihonKumite: participant.kihonKumite,
            kata: participant.kata,
            shobuKumite: participant.shobuKumite,
            date: grading.dateOfEvent,
            gradeAchieved: participant.grade === 11 ? 9 : participant.grade - 1,
            overallScore:
              participant.kihon +
              participant.kata +
              participant.kihonKumite +
              participant.shobuKumite,
          };
          results.push(result);
        }
      });
    });
  }
  if (results != []) {
    res.status(201).json(results);
  } else {
    res.status(404).json("Results could not be found");
  }
});

const beltCalculator = async () => {
  // calculate belts required from member data to belts in stock from financial data
  const members = await Member.find({ ddsuccess: true });

  const financials = await Financial.find({});

  const beltStock = financials[0].belts;

  let arrayOfGrades = [];
  let beltRequired = {};

  members.forEach((member) => {
    arrayOfGrades.push(member.kyuGrade);
  });

  for (const grade of arrayOfGrades) {
    if (!beltRequired[grade - 1]) {
      beltRequired[grade - 1] = 1;
    } else {
      beltRequired[grade - 1] = beltRequired[grade - 1] + 1;
    }
  }

  const beltsToOrder = {
    "White Red":
      beltRequired[15] - beltStock[15] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[15] - beltStock[15] + 2,
    "White Black":
      beltRequired[14] - beltStock[14] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[14] - beltStock[14] + 2,
    Orange:
      beltRequired[13] - beltStock[13] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[13] - beltStock[13] + 2,
    "Orange White":
      beltRequired[12] - beltStock[12] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[12] - beltStock[12] + 2,
    "Orange Yellow":
      beltRequired[11] - beltStock[11] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[11] - beltStock[11] + 2,
    Red:
      beltRequired[9] + beltRequired[10] - beltStock[9] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[9] + beltRequired[10] - beltStock[9] + 2,
    "Red Black":
      beltRequired[8] - beltStock[8] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[8] - beltStock[8] + 2,
    Yellow:
      beltRequired[7] - beltStock[7] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[7] - beltStock[7] + 2,
    Green:
      beltRequired[6] - beltStock[6] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[6] - beltStock[6] + 2,
    Purple:
      beltRequired[5] - beltStock[5] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[5] - beltStock[5] + 2,
    "Purple White":
      beltRequired[4] - beltStock[4] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[4] - beltStock[4] + 2,
    Brown:
      beltRequired[3] - beltStock[3] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[3] - beltStock[3] + 2,
    "Brown White":
      beltRequired[2] - beltStock[2] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[2] - beltStock[2] + 2,
    "Brown Double White":
      beltRequired[1] - beltStock[1] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[1] - beltStock[1] + 2,
  };

  return beltsToOrder;
};
beltCalculator();

// switchclass function
const switchClasses = async (member) => {
  const trainingSessions = await TrainingSession.find({});
  for (const trainingSession of trainingSessions) {
    if (
      trainingSession.participants.includes(member.toString()) &&
      trainingSession.progressionPath
    ) {
      console.log("class switch required");
      // remove from participants array of current training session
      const newArray = trainingSession.participants.filter(
        (participant) => participant.toString() !== member.toString()
      );
      await TrainingSession.findByIdAndUpdate(
        trainingSession._id,
        { participants: newArray },
        { new: true }
      );
      // add to participants array for progressionpath training session
      await TrainingSession.findByIdAndUpdate(
        trainingSession.progressionPath,
        {
          $push: { participants: member },
        },
        { new: true }
      );
    }
  }
  // send email about class switch
  console.log("class switch complete");
};

module.exports = {
  postGradingApplication,
  getGradingDetails,
  postGradingResult,
  getGradingResults,
  updateScore,
};
