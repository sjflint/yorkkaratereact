const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel.cjs");
const TrainingSessions = require("../models/trainingSessionModel.cjs");

const dotenv = require("dotenv");
dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Sandbox
);

const findMandate = async () => {
  const mandate = await client.mandates.find("MD000JWN2RETA3");
  console.log(mandate.status);
};
findMandate();

// @desc confirm dd setup and update database
// @route GET /ddsetup_confirmed
// @access Public
const ddSetup = asyncHandler(async (req, res) => {
  const redirectFlow = await client.redirectFlows.complete(
    req.body.ddRedirect,
    {
      session_token: req.body.session_token,
    }
  );

  await Member.findOneAndUpdate(
    { _id: req.body._id },
    { ddsuccess: true, ddMandate: redirectFlow.links.mandate },
    { new: true },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("DD status updated");
      }
    }
  );

  // Create membership payment
  const payment = await client.payments.create(
    {
      amount: 1500,
      currency: "GBP",
      description: "Annual membership fee",
      links: {
        mandate: redirectFlow.links.mandate,
      },
      metadata: {},
    },
    req.body._id
  );
  // add payment amount to database
  await Member.findOneAndUpdate(
    { _id: req.body._id },
    { totalPayment: payment.amount },
    { new: true },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Payment total updated");
      }
    }
  );

  // create training fees subscription
  const randomString = "random" + Math.random() + req.body.name;
  const subscription = await client.subscriptions.create(
    {
      amount: 2150,
      currency: "GBP",
      name: "Monthly training fees",
      interval: 1,
      interval_unit: "monthly",
      day_of_month: 1,
      links: {
        mandate: redirectFlow.links.mandate,
      },
    },
    randomString
  );

  // Set training fees amount in database
  const member = await Member.findById(req.body._id);
  await Member.findOneAndUpdate(
    { _id: member._id },
    {
      trainingFees: subscription.amount,
      subscriptionId: subscription.id,
    },
    { new: true }
  );
  console.log("training fees total updated");

  // Send auto email with nodemailer

  res.status(201).json({
    confirmationURL: "http://localhost:3000/ddsuccess",
  });

  console.log(`Mandate: ${redirectFlow.links.mandate}`);
  console.log(`Customer: ${redirectFlow.links.customer}`);
});

// @desc cancel direct debit and update database
// @route POST /ddroutes/cancel
// @access Public (private)
const cancelDirectDebit = asyncHandler(async (req, res) => {
  // Private route
  const member = await Member.findById(req.body._id);
  const mandateId = member.ddMandate;
  console.log(`Cancelling mandate: ${mandateId}`);

  const mandate = await client.mandates.cancel(mandateId);
  console.log(`Status: ${mandate.status}`);

  const classList = await TrainingSessions.find({});
  classList.forEach(async (indClass) => {
    for (let i = 0; i < indClass.participants.length; i++) {
      if (indClass.participants[i].toString() === req.body._id.toString()) {
        indClass.participants.splice(i, 1);
        const numberBooked = indClass.numberBooked;

        await TrainingSessions.findOneAndUpdate(
          { _id: indClass._id },
          {
            participants: indClass.participants,
            numberBooked: numberBooked - 1,
          },

          { new: true }
        );
      }
    }
  });

  // Update database

  await Member.findOneAndUpdate(
    { _id: member._id },
    {
      ddMandate: "Cancelled",
      ddsuccess: false,
    },
    { new: true }
  );

  res.status(201).json({
    Mandate: mandateId,
    Status: mandate.status,
  });
});

// @desc update subscription and update database
// @route access from within server only
// @access server only (private)
const updateSubscription = asyncHandler(async (paymentDetails) => {
  const member = await Member.findById(paymentDetails._id);

  let subscriptionId = member.subscriptionId;

  let subscription = await client.subscriptions.find(subscriptionId);
  console.log(`Previous amount: ${subscription.amount}`);
  console.log("Updating...");
  const newAmount = subscription.amount + paymentDetails.changeAmount;

  const subscriptionRequest = {
    amount: newAmount,
  };
  subscription = await client.subscriptions.update(
    subscriptionId,
    subscriptionRequest
  );
  console.log(`Previous amount: ${subscription.amount}`);

  await Member.findOneAndUpdate(
    { _id: member._id },
    {
      trainingFees: newAmount,
    },
    { new: true }
  );

  return {
    status: "Successfully updated",
    MonthlyTrainingFees: subscription.amount,
  };
});

// @desc update direct debit and update database
// @route POST /ddroutes/updatedirectdebit
// @access Public (private)
const updateDirectDebit = asyncHandler(async (req, res) => {
  console.log(req.body.session_token);
  console.log(req.body.ddRedirect);
  // Create new DD
  const redirectFlow = await client.redirectFlows.complete(
    req.body.ddRedirect,
    {
      session_token: req.body.session_token,
    }
  );

  if (redirectFlow) {
    const member = await Member.findById(req.body._id);
    if (member) {
      const mandateId = await member.ddMandate;
      await Member.findOneAndUpdate(
        { _id: member._id },
        { ddMandate: redirectFlow.links.mandate, ddsuccess: true },
        { new: true }
      );

      // Create new payment
      const randomString = "random" + Math.random() + req.body._id;
      const trainingFees = await member.trainingFees;
      const subscription = await client.subscriptions.create(
        {
          amount: trainingFees,
          currency: "GBP",
          name: "Monthly training fees",
          interval: 1,
          interval_unit: "monthly",
          day_of_month: 1,
          links: {
            mandate: redirectFlow.links.mandate,
          },
        },
        randomString
      );
      if (subscription) {
        await Member.findOneAndUpdate(
          { _id: member._id },
          {
            trainingFees: subscription.amount,
            subscriptionId: subscription.id,
          },
          { new: true }
        );

        console.log("training fees total updated");
      } else {
        res.status(500);
        throw new Error(
          "unable to fulfill request - New subscription could not be created"
        );
      }

      // Cancel existing payment
      if (mandateId === "Cancelled") {
        res.status(201).json({
          confirmationURL: "http://localhost:3000/ddupdatesuccess",
        });
      } else {
        console.log(`Cancelling mandate: ${mandateId}`);
        const mandate = await client.mandates.cancel(mandateId);
        if (mandate) {
          res.status(201).json({
            confirmationURL: "http://localhost:3000/ddupdatesuccess",
            status: mandate.status,
          });
        } else {
          res.status(404);
          throw new Error(
            "unable to fulfill request - Mandate not located and cancelled"
          );
        }
      }
    } else {
      res.status(404);
      throw new Error("Mandate created but unable to find customer");
    }
  } else {
    res.status(500);
    console.log("can't create new dd");
    throw new Error("unable to fulfill request - New DD not created");
  }
});

// @desc create payment
// @route POST /ddroutes/createpayment
// @access Public (private)
const createPayment = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.body.paymentDetails._id);

  const payment = await client.payments.create(
    {
      amount: req.body.paymentDetails.amount,
      currency: "GBP",
      description: req.body.paymentDetails.description,
      links: {
        mandate: member.ddMandate,
      },
      metadata: {},
    },
    Math.random() + req.body.paymentDetails._id + "paymentstring"
  );

  res.status(201).json({
    PaymentStatus: "submitted",
    PaymentAmount: payment.amount,
  });
});

module.exports = {
  ddSetup,
  cancelDirectDebit,
  updateSubscription,
  updateDirectDebit,
  createPayment,
};
