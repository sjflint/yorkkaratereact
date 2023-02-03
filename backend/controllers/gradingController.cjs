const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel.cjs");
const Member = require("../models/memberModel.cjs");
const Financial = require("../models/financialModel.cjs");
const { genericEmail } = require("../emailTemplates/genericEmail.cjs");

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
            `${Math.random()} - payment ID`
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
              const dateOfEvent = new Date(
                gradingCourse.dateOfEvent
              ).toLocaleDateString();
              genericEmail({
                recipientEmail: member.email,
                recipientName: member.firstName,
                subject: gradingCourse.title,
                message: `<h4>${gradingCourse.title}</h4>
                          <p>Date: ${dateOfEvent}.</p>
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

            `${Math.random()} - payment ID`
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
              const dateOfEvent = new Date(
                gradingCourse.dateOfEvent
              ).toLocaleDateString();
              genericEmail({
                recipientEmail: member.email,
                recipientName: member.firstName,
                subject: gradingCourse.title,
                message: `<h4>${gradingCourse.title}</h4>
            <p>Date: ${dateOfEvent}.</p>
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

  if (grading) {
    res.json(grading);
  } else {
    res.status(404);
    throw Error("Grading not found");
  }
});

module.exports = {
  postGradingApplication,
  getGradingDetails,
};
