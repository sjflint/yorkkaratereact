const process = require("process");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Webhook = require("../models/webhookModel.cjs");
const Member = require("../models/memberModel.cjs");
const TrainingSessions = require("../models/trainingSessionModel.cjs");
const app = express();

app.use(bodyParser.text({ type: "application/json" }));

dotenv.config();

const webhookEndpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

// verify webhook middleware
const verifyGocardlessWebhook = () => {
  return (req, res, next) => {
    if (!req.headers["webhook-signature"]) {
      console.log("missing headers");
      res.status(400).send({ message: "missing signature header" });
      return null;
    }
    const bodyAsString = JSON.stringify(req.body, null, 0);
    const secret = webhookEndpointSecret;
    const hash = crypto
      .createHmac("sha256", secret)
      .update(bodyAsString)
      .digest("hex");
    if (hash !== req.headers["webhook-signature"]) {
      res.status(498).send({ message: "Invalid token" });
      return null;
    }
    return next();
  };
};

const processMandate = async (event) => {
  // create record of event
  const createdEvent = await Webhook.create(event);
  // search member database to find member id
  const member = await Member.findOne({
    ddMandate: createdEvent.links.mandate,
  });
  const memberId = member._id.toString();

  switch (createdEvent.action) {
    case "cancelled":
      // Cancel member in database
      const sessions = await TrainingSessions.find({});
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
        },
        { new: true }
      );
      return `Mandate ${createdEvent.links.mandate} has been cancelled.\n`;

    case "failed":
      return "Mandate failed";
    case "created":
      return "Mandate created";
    case "active":
      return "Mandate active";
    case "customer_approval_granted":
      return "customer approval secured";
    default:
      return `Do not know how to process an event with action ${createdEvent.action}`;
  }
};

const processEvent = async (event) => {
  // check event not already processed
  const foundEvent = await Webhook.findOne({ id: event.id });
  if (foundEvent) {
    return `Webhook with id ${foundEvent.id} has already been processed`;
  } else {
    switch (event.resource_type) {
      case "mandates":
        return processMandate(event);
      default:
        return `Do not know how to process an event with resource_type ${event.resource_type}`;
    }
  }
};

const goCardlessWebhook = app.post(
  "/",
  verifyGocardlessWebhook(),
  async (req, res) => {
    const eventsRequestBody = req.body;

    try {
      const events = eventsRequestBody.events;
      let responseBody = "";

      for (const event of events) {
        responseBody += processEvent(event);
      }
      res.send({ success: responseBody });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

module.exports = {
  goCardlessWebhook,
};
