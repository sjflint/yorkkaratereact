const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel.cjs");
const Attendance = require("../models/attendanceModel.cjs");
const TrainingSessions = require("../models/trainingSessionModel.cjs");
const Financial = require("../models/financialModel.cjs");

const dotenv = require("dotenv");
const { genericEmail } = require("../emailTemplates/genericEmail.cjs");
dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Live
);

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
  const financials = await Financial.findOne({});
  const payment = await client.payments.create(
    {
      amount: financials.joiningFee,
      currency: "GBP",
      description: "Joining fee",
      links: {
        mandate: redirectFlow.links.mandate,
      },
      metadata: {},
    },
    `${Math.random()} req.body._id`
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
      amount: financials.baseLevelTrainingFees,
      currency: "GBP",
      name: "Monthly training fees",
      interval: 1,
      interval_unit: "monthly",
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

  // **************send a welcome email*************
  genericEmail({
    recipientEmail: `${member.email}, ${member.secondaryEmail}`,
    recipientName: member.firstName,
    subject: "Welcome to York Karate Dojo",
    message: `<h4>Welcome to York Karate Dojo, ${member.firstName}</h4>
    <p>I hope this is the start of a life-long interest in karate and the martial arts. Karate can offer you many opportunities and amazing experiences, such as entering competitions, training with some of the best Japanese instructors, travelling to Japan to train and meeting new friends.</p>
    <p>The training can be difficult at times, you should be prepared for this, but anything in life that is positive and worth doing is usually difficult. That's exactly why it is worth doing.</p>
    <p>There are just a few more things you might want to take a look at:</p>
    <ul>
    <li>Register for a class! Please sign up for at least one class. Visit your profile to do this <a href='${process.env.DOMAIN_LINK}/login'>here</a></li>
    <li>Purchase a karate suit, sparring mitts and other protection (mitts and protection not required for juniors under 9). Please visit our <a href='${process.env.DOMAIN_LINK}/shop'>Club Shop</a> to see purchasing options</li>
    <li>Register With the Japan Karate Shotorenmei (JKS) - our governing body. You can do this <a href='https://www.jksengland.com/members'>here</a>. This is a requirement before taking part in any gradings/competitions</li>
    </ul>
    <p>Should you have any questions, please do not hesitate to contact us for further assistance</p>
    `,
    link: `${process.env.DOMAIN_LINK}/login`,
    linkText: "View Profile",
    attachments: [],
  });

  res.status(201).json({
    confirmationURL: `${process.env.DOMAIN_LINK}/ddsuccess`,
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

  if (member) {
    genericEmail({
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "Direct Debit Cancelled",
      message: `<h4>${member.firstName}, your direct debit has been cancelled</h4>
  <p>We have received an instruction to cancel your direct debit. Consequently, your membership to York Karate Dojo has been suspended and will be cancelled soon.</p>
  <p>If there has been some kind of mistake and you would like to reinstate your account, please <a href='${process.env.DOMAIN_LINK}/login'> login to your account</a> to get things back up and running</p>
  <p>If you are cancelling your membership with us, then we are very sorry to see you go! We know there are many reasons why our members might decide to leave the club but please, if there is something we could have done better then let us know so that we can improve in the future.
  `,
      link: `${process.env.DOMAIN_LINK}/login`,
      linkText: "Reinstate Account",
      attachments: [],
    });
  }

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

  console.log(`New amount: ${newAmount}`);

  const mandate = await client.mandates.find(member.ddMandate);
  const chargeDay = mandate.next_possible_charge_date.slice(-2);

  // create new subscription for the new amount
  const newSubscription = await client.subscriptions.create({
    amount: newAmount,
    currency: "GBP",
    name: "Monthly training fees",
    // *** should not be 1st of month but current collection day
    interval: 1,
    interval_unit: "monthly",
    // day_of_month: chargeDay,
    start_date: subscription.upcoming_payments[0].charge_date,
    links: {
      mandate: member.ddMandate,
    },
  });

  if (newSubscription) {
    // Cancel existing subscription
    const cancelSubscription = await client.subscriptions.cancel(
      member.subscriptionId
    );
    console.log(`Cancelled Sub status: ${cancelSubscription.status}`);
    await Member.findOneAndUpdate(
      { _id: member._id },
      {
        trainingFees: newSubscription.amount,
        subscriptionId: newSubscription.id,
      },
      { new: true }
    );
    console.log("training fees total updated");
  }

  return {
    status: "Successfully updated",
    MonthlyTrainingFees: newSubscription.amount,
  };
});

// @desc update direct debit and update database
// @route POST /ddroutes/updatedirectdebit
// @access Public (private)
const updateDirectDebit = asyncHandler(async (req, res) => {
  // get collection day
  let collectionDay;

  if (req.body.subChargeDate) {
    collectionDay = new Date(req.body.subChargeDate).getDay();
    console.log(`charge day: ${collectionDay}`);
  }

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
      let mandateId;
      if (member.ddMandate) {
        mandateId = member.ddMandate;
      }

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
          // ddMandate field must be removed during webhook cancelled dd action
          day_of_month: collectionDay ? collectionDay : null,
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

      if (!mandateId || mandateId === "Failed") {
        const payment = await client.payments.create(
          {
            amount: member.totalPayment * 100,
            currency: "GBP",
            description: "Joining fee",
            links: {
              mandate: redirectFlow.links.mandate,
            },
            metadata: {},
          },
          Math.random() + randomString + "paymentstring"
        );

        if (payment) {
          console.log("Annual fee recharged succesfully");
        } else {
          console.log("ERROR: payment not charged");
        }
      }

      // Cancel existing payment
      if (
        mandateId === "Cancelled" ||
        mandateId === "Pending" ||
        mandateId === "Failed" ||
        !mandateId
      ) {
        res.status(201).json({
          confirmationURL: `${process.env.DOMAIN_LINK}/ddupdatesuccess`,
        });
      } else {
        console.log(`Cancelling mandate: ${mandateId}`);
        const mandate = await client.mandates.cancel(mandateId);
        if (mandate) {
          res.status(201).json({
            confirmationURL: `${process.env.DOMAIN_LINK}/ddupdatesuccess`,
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
  console.log(req.body.paymentDetails._id);
  const member = await Member.findById(req.body.paymentDetails._id);
  console.log(`Member Found ${member.firstName}`);

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

  if (req.body.paymentDetails.category === "competitionPayment") {
    console.log("attempting to store info");
    const payment = `${req.body.paymentDetails.description} - £${(
      req.body.paymentDetails.amount / 100
    ).toFixed(2)}`;

    let competitionPayment = [];

    if (member.competitionPayment) {
      competitionPayment = member.competitionPayment;
      competitionPayment.push(payment);
    } else {
      competitionPayment.push(payment);
    }

    Member.findOneAndUpdate(
      { _id: req.body.paymentDetails._id },
      {
        competitionPayment: competitionPayment,
      },
      { new: true },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
        }
      }
    );
    genericEmail({
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "Competition Payment Created",
      message: `<h4>${
        member.firstName
      }, we have created a payment for an upcoming competition.</h4>
  <p>We have created a payment from your direct debit with the following details:</p>
  <ul>
      <li>Payment Description: ${req.body.paymentDetails.description}</li>
      <li>Amount: £${(req.body.paymentDetails.amount / 100).toFixed(2)}</li>
  </ul>
  `,
      link: `${process.env.DOMAIN_LINK}/login`,
      linkText: "View Account",
      attachments: [],
    });
  }

  res.status(201).json({
    PaymentStatus: "submitted",
    PaymentAmount: payment.amount,
    paymentId: payment.id,
  });
});
// *** if ever creating a new payment type, add to webhooks to catch payment success/failure ***

// @desc create payment
// @route Access from server only
// @access Server (private)
const serverCreatedPayment = asyncHandler(async (paymentDetails) => {
  const member = await Member.findById(paymentDetails._id);

  const payment = await client.payments.create(
    {
      amount: paymentDetails.amount,
      currency: "GBP",
      description: paymentDetails.description,
      links: {
        mandate: member.ddMandate,
      },
      metadata: {},
    },
    Math.random() + paymentDetails._id + "paymentstring"
  );
  const paymentsObject = member.additionalPayments;
  paymentsObject[paymentDetails.recordId] = payment.id;

  await Member.findOneAndUpdate(
    { _id: member._id },
    {
      additionalPayments: paymentsObject,
    },
    { new: true }
  );

  return {
    PaymentStatus: "submitted",
    PaymentAmount: payment.amount,
    paymentId: payment.id,
  };
});

// @desc cancel extra class payment
// @route POST /ddroutes/cancelpayment
// @access Public (private)
const cancelPayment = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.body.paymentDetails._id);

  // Find payment ID using record id
  const paymentKey =
    member.additionalPayments[req.body.paymentDetails.recordId];

  let paymentId;
  if (paymentKey && paymentKey !== "cancelled") {
    paymentId = member.additionalPayments[req.body.paymentDetails.recordId];

    const payment = await client.payments.cancel(paymentId);

    // update database if payment cancelled
    if (payment.status === "cancelled") {
      // update member => payment record
      // date 26 days ago
      const today = new Date();
      const pastDate = today.setDate(today.getDate() - 26);

      const keyValue = `additionalPayments.${req.body.paymentDetails.recordId}`;
      await Member.findOneAndUpdate(
        { _id: member._id },
        {
          $set: { [keyValue]: payment.status },
          extraClassAdded: pastDate,
          $inc: { attendanceRecord: -1 },
        },
        { new: true }
      );
    }
  } else {
    await Member.findOneAndUpdate(
      { _id: member._id },
      {
        extraClassAdded: new Date(2000, 0),
        $inc: { attendanceRecord: -1 },
      },
      { new: true }
    );
  }
  // update attendance record
  const record = await Attendance.findById(req.body.paymentDetails.recordId);

  const attendees = record.extraParticipants;

  const newAttendees = attendees.filter(
    (attendee) => String(attendee) !== String(member._id)
  );

  await Attendance.findOneAndUpdate(
    { _id: req.body.paymentDetails.recordId },
    {
      extraParticipants: newAttendees,
    },
    { new: true }
  );

  res.status(201).json({
    "attendee Removed": "success",
  });
});

const updateCollectionDate = async (id) => {
  const member = await Member.findById(id);

  if (member && member.ddMandate && member.ddMandate !== "") {
    const subscription = await client.subscriptions.find(member.subscriptionId);
    let collectionDate = subscription.upcoming_payments[0].charge_date;

    collectionDate = new Date(collectionDate);
    const nextDate = collectionDate.setDate(collectionDate.getDate() - 28);
    if (new Date() < nextDate) {
      // set date as soon as possible
      member.subChargeDate = "";
      member.save();
      console.log(true);
    } else {
      // set date for the next collection date
      member.subChargeDate = collectionDate;
      member.save();
    }

    return collectionDate;
  } else {
    return false;
  }
};

module.exports = {
  ddSetup,
  cancelDirectDebit,
  updateSubscription,
  updateDirectDebit,
  createPayment,
  serverCreatedPayment,
  cancelPayment,
  updateCollectionDate,
};
