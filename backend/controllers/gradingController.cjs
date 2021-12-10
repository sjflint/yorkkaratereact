const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel.cjs");
const Member = require("../models/memberModel.cjs");

const dotenv = require("dotenv");

dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Sandbox
);

// @desc Post grading application and payment
// @route POST /api/grading/:id
// @access Private
const postGradingApplication = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.body.memberId);

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
        const payment = await client.payments.create(
          {
            amount: 2500,
            currency: "GBP",
            description: "Grading fee",
            links: {
              mandate: mandate,
            },
            metadata: {},
          },
          // `${member._id}${req.params.id} - payment ID`
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
            });
            await gradingCourse.save();
            res.send("grading application successful!");
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
