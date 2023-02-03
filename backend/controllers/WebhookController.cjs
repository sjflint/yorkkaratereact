const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const asyncHandler = require("express-async-handler");
const Webhook = require("../models/webhookModel.cjs");
const Member = require("../models/memberModel.cjs");
const TrainingSessions = require("../models/trainingSessionModel.cjs");
const Event = require("../models/eventModel.cjs");
const Order = require("../models/orderModel.cjs");
const Financial = require("../models/financialModel.cjs");

const dotenv = require("dotenv");
const { genericEmail } = require("../emailTemplates/genericEmail.cjs");
dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Live
);

// Clear sessions booked for member.......
const clearBookedSessions = async (memberId) => {
  const sessions = await TrainingSessions.find({});

  for (const session of sessions) {
    if (session.participants.includes(memberId)) {
      const newParticipants = session.participants.filter(
        (participant) => participant.toString() !== memberId.toString()
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
};

// Mandate Webhooks
const processMandate = asyncHandler(async (event) => {
  const financials = await Financial.findOne({});
  const createdEvent = await Webhook.create(event);

  let member = await Member.findOne({
    ddMandate: createdEvent.links.mandate,
  });

  switch (createdEvent.action) {
    // ******Mandate Cancelled*******
    case "cancelled":
      clearBookedSessions(member._id);
      await Member.findOneAndUpdate(
        { ddMandate: createdEvent.links.mandate },
        {
          ddMandate: "Cancelled",
          ddsuccess: false,
          trainingFees: financials.baseLevelTrainingFees,
        },
        { new: true }
      );
      genericEmail({
        recipientEmail: member.email,
        recipientName: member.firstName,
        subject: "Direct Debit Cancelled",
        message: `<h4>${member.firstName}, your direct debit has been cancelled</h4>
                    <p>We have received notification that your direct debit has been cancelled. Consequently, your membership to York Karate Dojo has been suspended and will be cancelled soon.</p>
                    <p>If there has been a mistake and you would like to reinstate your account, please <a href='${process.env.DOMAIN_LINK}/login'> login to your account</a> to get things back up and running</p>
                    <p>If you are cancelling your membership with us, then we are very sorry to see you go! We know there are many reasons why our members might decide to leave the club but please, if there is something we could have done better then let us know so that we can improve in the future.</p>
                  `,
        link: `${process.env.DOMAIN_LINK}/login`,
        linkText: "Reinstate Account",
        attachments: [],
      });
      return `Mandate ${createdEvent.links.mandate} has been cancelled.\n`;

    // ****Mandate failed on setup****
    case "failed":
      clearBookedSessions(member._id);
      genericEmail({
        recipientEmail: member.email,
        recipientName: member.firstName,
        subject: "Direct Debit Failed",
        message: `<h4>${member.firstName}, your direct debit failed when being setup.</h4>
                    <p>We have received notification that your direct debit failed to be created during your application. Consequently, your membership to York Karate Dojo has been cancelled.</p>
                    <p>If there has been a mistake and you wish to become a member of York Karate Dojo, please <a href='${process.env.DOMAIN_LINK}/register'> register again</a> and create a new account</p>
                    <p>If you have changed your mind to join us, then we are very sorry to see you go! Please let us know what we could have done better.</p>
                  `,
        link: `${process.env.DOMAIN_LINK}/register`,
        linkText: "Reinstate Account",
        attachments: [],
      });
      await Member.findOneAndUpdate(
        { ddMandate: createdEvent.links.mandate },
        {
          ddMandate: "Failed",
          ddsuccess: false,
          trainingFees: financials.baseLevelTrainingFees,
        },
        { new: true }
      );
      return `Mandate ${createdEvent.links.mandate} has failed to be created.\n`;

    // *****Mandate Created*****
    case "created":
      // check if customer_approval selected and if so, halt application
      const mandate = await client.mandates.find(createdEvent.links.mandate);
      const mandateStatus = mandate.status;
      if (mandateStatus === "pending_customer_approval") {
        clearBookedSessions(member._id);
        await Member.findOneAndUpdate(
          { ddMandate: createdEvent.links.mandate },
          {
            ddsuccess: false,
          },
          { new: true }
        );
        genericEmail({
          recipientEmail: member.email,
          recipientName: member.firstName,
          subject: "Direct Debit Requires Approval",
          message: `<h4>${member.firstName}, your direct debit requires approval.</h4>
                      <p>We have received notification that your direct debit cannot bet setup right now as it requires approval from a second account holder. Consequently, your membership to York Karate Dojo has been suspended.</p>
                      <p>You will have received an email from goCardless with details of how to setup the direct debit.</p>
                      <p>If you think you might have made a mistake, and your account requires only one signature to setup direct debits, please click the link below to login to your account and create a new direct debit.</p>
                    `,
          link: `${process.env.DOMAIN_LINK}/login`,
          linkText: "Reinstate Account",
          attachments: [],
        });
        return `Mandate ${createdEvent.links.mandate} is awaiting customer approval.\n`;
      }
      return "Mandate created";

    // *****Mandate now active******
    case "active":
      return "Mandate active";

    // *****Customer Approval Granted*****
    case "customer_approval_granted":
      await Member.findOneAndUpdate(
        { ddMandate: createdEvent.links.mandate },
        {
          ddsuccess: true,
        },
        { new: true }
      );
      // send email to say account active after dd approval given ****************************
      genericEmail({
        recipientEmail: member.email,
        recipientName: member.firstName,
        subject: "Direct Debit Requires Approval",
        message: `<h4>${member.firstName}, your direct debit has been approved.</h4>
                    <p>We have received notification that your direct debit has now been approved and is setup.</p>
                    <p>Your account is now active. If you previously booked classes before your account was suspended, you will need to do this again. Please click the link below to login to your account.</p>
                  `,
        link: `${process.env.DOMAIN_LINK}/login`,
        linkText: "Account Login",
        attachments: [],
      });
      return `Mandate ${createdEvent.links.mandate} has now been approved.\n`;
    case "submitted":
      console.log("DD mandate submitted");
      return "await mandate to be processed";
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
  console.log("analysing payment webhook...");
  const financials = await Financial.findOne({});
  const createdEvent = await Webhook.create(event);
  console.log(`Payment id: ${createdEvent.links.payment}`);

  const payment = await client.payments.find(createdEvent.links.payment);
  switch (createdEvent.action) {
    case "failed":
      if (createdEvent.details.will_attempt_retry) {
        // No further action as the payment process will continue
        return "Payment will be retried";
      } else {
        // find mandate using bank account id
        const mandateList = await client.mandates.list({
          customer_bank_account: createdEvent.details.bank_account_id,
        });
        const mandateId = mandateList.mandates[0].id;

        const member = await Member.findOne({
          ddMandate: mandateId,
        });

        // payment description
        switch (payment.description) {
          case "Joining fee":
            clearBookedSessions(member._id);
            await Member.findOneAndUpdate(
              { ddMandate: mandateId },
              {
                ddMandate: "Failed",
                ddsuccess: false,
                trainingFees: financials.baseLevelTrainingFees,
              },
              { new: true }
            );
            genericEmail({
              recipientEmail: member.email,
              recipientName: member.firstName,
              subject: "Membership Fee failed",
              message: `<h4>${member.firstName}, your membership has been suspended</h4>
                    <p>We have received notification that we could not collect your membership fee . Consequently, your membership to York Karate Dojo has been suspended and will be cancelled soon.</p>
                    <p>If there has been a mistake and you would like to reinstate your account, please <a href='${process.env.DOMAIN_LINK}/login'> login to your account</a> to get things back up and running</p>
                    <p>If you are cancelling your membership with us, then we are very sorry to see you go! We know there are many reasons why our members might decide to leave the club but please, if there is something we could have done better then let us know so that we can improve in the future.</p>
                  `,
              link: `${process.env.DOMAIN_LINK}/login`,
              linkText: "Reinstate Account",
              attachments: [],
            });

            return `membership fee not paid for ${mandateId}`;

          case "Grading fee":
            const gradingCourse = await Event.findById(
              payment.metadata.gradingId
            );
            const today = new Date();

            if (today < gradingCourse.dateOfEvent) {
              // remove from participants list and send email to say not registered
              let participantArr = [];
              gradingCourse.participants.map((participant) => {
                if (participant._id.toString() !== member._id.toString()) {
                  participantArr.push(participant);
                }
              });
              await Event.findOneAndUpdate(
                { _id: payment.metadata.gradingId },
                {
                  participants: participantArr,
                }
              );
              genericEmail({
                recipientEmail: member.email,
                recipientName: member.firstName,
                subject: "Grading payment failed",
                message: `<h4>${member.firstName}, your grading payment failed</h4>
                      <p>We have received notification that we could not collect your grading payment. Consequently, your application to grade has been rejected.</p>
                      <p>If the deadline has not passed, you could try again <a href='${process.env.DOMAIN_LINK}/event/${gradingCourse._id}'>here</a></p>
                      <p>If the deadline has passed, but you would still like to grade, please contact us urgently.</p>
                    `,
                link: `${process.env.DOMAIN_LINK}/event/${gradingCourse._id}`,
                linkText: "Apply again for the grading course",
                attachments: [],
              });
            } else {
              let outstandingFees = member.outstandingFees;
              const gradingFee = financials.costOfGrading * 100;
              outstandingFees = outstandingFees + gradingFee;

              await Member.findOneAndUpdate(
                { _id: member._id },
                {
                  outstandingFees: outstandingFees,
                }
              );
              genericEmail({
                recipientEmail: member.email,
                recipientName: member.firstName,
                subject: "Grading payment failed",
                message: `<h4>${member.firstName}, your grading payment failed</h4>
                      <p>We have received notification that we could not collect your grading payment. Consequently, your grading result has been temporarily reversed.</p>
                      <p>To reinstate the result, please pay the outstanding balance by <a href='${process.env.DOMAIN_LINK}/outstandingfees'>clicking here</a></p>
                      <p>Once the payment has been made, the grading result will be reinstated.</p>
                    `,
                link: `${process.env.DOMAIN_LINK}/outstandingfees`,
                linkText: "Pay outstanding fees",
                attachments: [],
              });
            }
            return "Grading Payment failed";

          case "Course Training Fees":
            const trainingCourse = await Event.findById(
              payment.metadata.gradingId
            );
            const courseToday = new Date();

            if (courseToday < trainingCourse.dateOfEvent) {
              // remove from participants list and send email to say not registered
              let participantArr = [];
              trainingCourse.trainingParticipants.map((participant) => {
                if (participant._id.toString() !== member._id.toString()) {
                  participantArr.push(participant);
                }
              });
              await Event.findOneAndUpdate(
                { _id: payment.metadata.gradingId },
                {
                  trainingParticipants: participantArr,
                }
              );
              genericEmail({
                recipientEmail: member.email,
                recipientName: member.firstName,
                subject: "Training Course Payment Failed",
                message: `<h4>${member.firstName}, your training course payment failed</h4>
                        <p>We have received notification that we could not collect your taining payment. Consequently, we have removed you from the list of participants for the training session.</p>
                        <p>If the deadline has not passed, you could try again <a href='${process.env.DOMAIN_LINK}/event/${gradingCourse._id}'>here</a></p>
                        <p>If the deadline has passed, but you would still like to train, please contact us urgently.</p>
                      `,
                link: `${process.env.DOMAIN_LINK}/event/${gradingCourse._id}`,
                linkText: "Apply again for the training session",
                attachments: [],
              });
            } else {
              let outstandingFees = member.outstandingFees;
              const trainingFee = financials.costOfTrainingCourse * 100;
              outstandingFees = outstandingFees + trainingFee;

              await Member.findOneAndUpdate(
                { _id: member._id },
                {
                  outstandingFees: outstandingFees,
                }
              );

              genericEmail({
                recipientEmail: member.email,
                recipientName: member.firstName,
                subject: "Training Course Payment Failed",
                message: `<h4>${member.firstName}, your training course payment failed</h4>
                      <p>We have received notification that we could not collect your training course payment. Consequently, there is an 'outstanding balance' on your account.</p>
                      <p>Please pay the outstanding balance by <a href='${process.env.DOMAIN_LINK}/outstandingfees'>clicking here</a></p>
                      <p>Not paying this balance could jeopordise your memership with York Karate. Please contact us if you need to discuss this further.</p>
                    `,
                link: `${process.env.DOMAIN_LINK}/outstandingfees`,
                linkText: "Pay outstanding fees",
                attachments: [],
              });
            }

            return "Training Fee failed";

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
            genericEmail({
              recipientEmail: member.email,
              recipientName: member.firstName,
              subject: "Shop payment failed",
              message: `<h4>${member.firstName}, your payment to the York Karate Shop failed</h4>
                    <p>We have received notification that we could not collect your shop payment. Consequently, your order has been cancelled.</p>
                    <p>To reorder, please visit our shop <a href='${process.env.DOMAIN_LINK}/shop'>here</a></p>
                  `,
              link: `${process.env.DOMAIN_LINK}/shop`,
              linkText: "Visit our shop",
              attachments: [],
            });
            return "Shop Payment Failed";

          case "Monthly training fees":
            // Cancel membership and remove class bookings
            const mandate = await client.mandates.cancel(mandateId);
            console.log(`Mandate ${mandate} cancelled`);
            clearBookedSessions(member._id);
            await Member.findOneAndUpdate(
              { ddMandate: mandateId },
              {
                ddMandate: "Cancelled",
                ddsuccess: false,
                trainingfees: financials.baseLevelTrainingFees,
              },
              { new: true }
            );
            console.log("training fees not paid");
            genericEmail({
              recipientEmail: member.email,
              recipientName: member.firstName,
              subject: "Training Fees not paid",
              message: `<h4>${member.firstName}, your membership has been suspended</h4>
                    <p>We have received notification that we could not collect your training fees. Consequently, your membership to York Karate Dojo has been suspended and will be cancelled soon.</p>
                    <p>If there has been a mistake and you would like to reinstate your account, please <a href='${process.env.DOMAIN_LINK}/login'> login to your account</a> to get things back up and running</p>
                    <p>If you are cancelling your membership with us, then we are very sorry to see you go! We know there are many reasons why our members might decide to leave the club but please, if there is something we could have done better then let us know so that we can improve in the future.</p>
                  `,
              link: `${process.env.DOMAIN_LINK}/login`,
              linkText: "Reinstate Account",
              attachments: [],
            });
            return "Training fees not paid. Membership cancelled";
          case "Extra class payment":
            let outstandingFees = member.outstandingFees;
            const additionalFee = financials.costOfExtraFee;
            outstandingFees = outstandingFees + additionalFee;

            await Member.findOneAndUpdate(
              { _id: member._id },
              {
                outstandingFees: outstandingFees,
              }
            );
            genericEmail({
              recipientEmail: member.email,
              recipientName: member.firstName,
              subject: "Payment failed",
              message: `<h4>${member.firstName}, your payment for your extra class failed</h4>
                    <p>We have received notification that we could not collect the additional fee for the extra class you attended.</p>
                    <p>To make this payment, and any other payments that may be outstanding, please visit <a href='${process.env.DOMAIN_LINK}/outstandingfees'>here</a></p>
                    
                  `,
              link: `${process.env.DOMAIN_LINK}/outstandingfees`,
              linkText: "Pay outstanding balance",
              attachments: [],
            });
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

module.exports = {
  processMandate,
  processSubscription,
  processPayment,
};
