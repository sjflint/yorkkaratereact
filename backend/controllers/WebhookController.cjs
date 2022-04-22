const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Webhook = require("../models/webhookModel.cjs");
const Member = require("../models/memberModel.cjs");
const TrainingSessions = require("../models/trainingSessionModel.cjs");
const Event = require("../models/eventModel.cjs");
const Order = require("../models/orderModel.cjs");

const dotenv = require("dotenv");
dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Sandbox
);

// Mandate Webhooks
const processMandate = asyncHandler(async (event) => {
  const createdEvent = await Webhook.create(event);

  const member = await Member.findOne({
    ddMandate: createdEvent.links.mandate,
  });
  const memberId = member._id.toString();
  const sessions = await TrainingSessions.find({});

  switch (createdEvent.action) {
    case "cancelled":
      // Cancel member in database
      for (const session of sessions) {
        if (session.participants.includes(member._id)) {
          const newParticipants = session.participants.filter(
            (participant) => participant.toString() !== memberId
          );
          await TrainingSessions.findOneAndUpdate(
            { _id: session._id },
            {
              participants: newParticipants,
              numberBooked: session.numberBooked - 1,
            },
            { new: true }
          );
        }
      }
      await Member.findOneAndUpdate(
        { ddMandate: createdEvent.links.mandate },
        {
          ddMandate: "Cancelled",
          ddsuccess: false,
          trainingFees: 2150,
        },
        { new: true }
      );
      return `Mandate ${createdEvent.links.mandate} has been cancelled.\n`;

    case "failed":
      // Cancel member in database
      for (const session of sessions) {
        if (session.participants.includes(member._id)) {
          const newParticipants = session.participants.filter(
            (participant) => participant.toString() !== memberId
          );
          await TrainingSessions.findOneAndUpdate(
            { _id: session._id },
            {
              participants: newParticipants,
              numberBooked: session.numberBooked - 1,
            },
            { new: true }
          );
        }
      }
      await Member.findOneAndUpdate(
        { ddMandate: createdEvent.links.mandate },
        {
          ddMandate: "Cancelled",
          ddsuccess: false,
          trainingFees: 2150,
        },
        { new: true }
      );
      return `Mandate ${createdEvent.links.mandate} has failed to be created.\n`;
    case "created":
      // check if customer_approval selected and if so, halt application
      const mandate = await client.mandates.find(createdEvent.links.mandate);
      const mandateStatus = mandate.status;

      if (mandateStatus === "pending_customer_approval") {
        for (const session of sessions) {
          if (session.participants.includes(member._id)) {
            const newParticipants = session.participants.filter(
              (participant) => participant.toString() !== memberId
            );
            await TrainingSessions.findOneAndUpdate(
              { _id: session._id },
              {
                participants: newParticipants,
                numberBooked: session.numberBooked - 1,
              },
              { new: true }
            );
          }
        }
        await Member.findOneAndUpdate(
          { ddMandate: createdEvent.links.mandate },
          {
            ddMandate: "Pending",
            ddsuccess: false,
          },
          { new: true }
        );
        return `Mandate ${createdEvent.links.mandate} is awaiting customer approval.\n`;
      }
      return "Mandate created";
    case "active":
      // no action needed
      return "Mandate active";
    case "customer_approval_granted":
      await Member.findOneAndUpdate(
        { ddMandate: createdEvent.links.mandate },
        {
          ddMandate: createdEvent.links.mandate,
          ddsuccess: true,
        },
        { new: true }
      );
      return `Mandate ${createdEvent.links.mandate} has now been approved.\n`;
    default:
      return `Do not know how to process an event with action ${createdEvent.action}`;
  }
});

// Subscription Webhooks
const processSubscription = async (event) => {
  //  available if we need to action anything on subscriptions only.
};

// Payment webhooks
const processPayment = async (event) => {
  const createdEvent = await Webhook.create(event);
  const payment = await client.payments.find(createdEvent.links.payment);

  const member = await Member.findOne({
    ddMandate: payment.links.mandate,
  });
  const sessions = await TrainingSessions.find({});
  const memberId = await member._id.toString();

  switch (createdEvent.action) {
    case "failed":
      if (createdEvent.details.will_attempt_retry) {
        // No further action as the payment process will continue
        return "Payment will be retried";
      } else {
        switch (payment.description) {
          case "Annual membership fee":
            await Member.findOneAndUpdate(
              { ddMandate: payment.links.mandate },
              {
                ddsuccess: "Fail - Annual membership fee not paid",
              },
              { new: true }
            );
            return `membership fee not paid for ${payment.links.mandate}`;
          case "Grading fee":
            const gradingCourse = await Event.findById(
              payment.metadata.gradingId
            );
            await gradingCourse.participants.map((participant) => {
              if (participant.paymentId === payment.id) {
                participant.paymentStatus = "failed";
              }
            });
            await Event.findOneAndUpdate(
              { _id: payment.metadata.gradingId },
              {
                participants: gradingCourse.participants,
              },
              { new: true }
            );
            // Fringe case - dd fails after grading event? Still need to check for grading result object and reverse results. Deadline for gradings will be 7 days prior to reduce this risk.
            return "Grading Payment failed";
          case "Payment to York Karate Shop":
            const order = await Order.findOneAndUpdate(
              {
                "paymentResult.paymentId": payment.id,
              },
              {
                isPaid: "false",
              },
              { new: true }
            );

            return "Shop Payment Failed";
          case "Monthly training fees":
            // Cancel membership and remove class bookings
            const mandate = await client.mandates.cancel(payment.links.mandate);
            console.log(`Mandate ${mandate} cancelled`);
            for (const session of sessions) {
              if (session.participants.includes(member._id)) {
                const newParticipants = session.participants.filter(
                  (participant) => participant.toString() !== memberId
                );
                await TrainingSessions.findOneAndUpdate(
                  { _id: session._id },
                  {
                    participants: newParticipants,
                    numberBooked: session.numberBooked - 1,
                  },
                  { new: true }
                );
              }
            }
            await Member.findOneAndUpdate(
              { ddMandate: payment.links.mandate },
              {
                ddMandate: "Cancelled",
                ddsuccess: false,
                trainingfees: 2150,
              },
              { new: true }
            );
            console.log("training fees not paid");
            return "Training fees not paid. Membership cancelled";
          case "Extra class payment":
            // email admin and member to state payment not made
            return "Payment for extra class not made";
          default:
            return "Dont know what this payment is for";
        }
      }
    case "confirmed":
      switch (payment.description) {
        case "Payment to York Karate Shop":
          const order = await Order.findOneAndUpdate(
            {
              "paymentResult.paymentId": payment.id,
            },
            {
              isPaid: "true",
            },
            { new: true }
          );

          return "Shop Payment success";
        case "Grading fee":
          const gradingCourse = await Event.findById(
            payment.metadata.gradingId
          );
          await gradingCourse.participants.map((participant) => {
            if (participant.paymentId === payment.id) {
              participant.paymentStatus = "success";
            }
          });
          await Event.findOneAndUpdate(
            { _id: payment.metadata.gradingId },
            {
              participants: gradingCourse.participants,
            },
            { new: true }
          );
      }
      return "";
    case "resubmission_requested":
      return "";
    default:
      return `don't know how to process event with action ${createdEvent.action}`;
  }
};
// How to connect the payment to the customer? Does the payment webhook include dd mandate id?

module.exports = {
  processMandate,
  processSubscription,
  processPayment,
};
