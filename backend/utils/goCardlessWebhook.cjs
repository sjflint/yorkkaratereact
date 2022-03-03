const process = require("process");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Webhook = require("../models/webhookModel.cjs");
const Member = require("../models/memberModel.cjs");
const TrainingSessions = require("../models/trainingSessionModel.cjs");
const app = express();
const {
  processMandate,
  processSubscription,
  processPayment,
} = require("../controllers/WebhookController.cjs");

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

const processEvent = async (event) => {
  // check event not already processed
  const foundEvent = await Webhook.findOne({ id: event.id });
  if (foundEvent) {
    return `Webhook with id ${foundEvent.id} has already been processed`;
  } else {
    switch (event.resource_type) {
      case "mandates":
        return processMandate(event);
      case "subscriptions":
        return processSubscription(event);
      case "payments":
        return processPayment(event);
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
