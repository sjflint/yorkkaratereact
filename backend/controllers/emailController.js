import asyncHandler from "express-async-handler";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Members from "../models/memberModel.cjs";
import Enquiry from "../models/enquiryModel.js";
import TrainingSessions from "../models/trainingSessionModel.cjs";

// possible recipient groups:
// -Everyone
// -Specific grade or grade range
// -Squad
// -Specific class

const sendEmail = asyncHandler(async (req, res) => {
  const members = await Members.find({});
  console.log(req.body.email);
  console.log(req.body._id);
  let recipients = [];
  const emailDetails = {
    recipientEmail: recipients,
    recipientName: "Dear club members,",
    subject: req.body.subject,
    message: `<h4>${req.body.subject}</h4>
                  <p style="white-space: pre-line;">${req.body.message}</p>`,
    link: req.body.link,
    linkText: req.body.linkText,
    attachments: req.body.attachments,
  };
  switch (req.body.recipientGroup) {
    case "all":
      members.forEach((member) => recipients.push(member.email));
      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "grade":
      members.forEach(
        (member) =>
          member.kyuGrade <= req.body.minGrade &&
          member.kyuGrade >= req.body.maxGrade &&
          recipients.push(member.email)
      );
      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "squad":
      members.forEach(
        (member) => member.squadMember && recipients.push(member.email)
      );
      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "class":
      const trainingSessions = await TrainingSessions.findById(
        req.body.classId
      ).populate("participants", "email");
      trainingSessions.participants.forEach((participant) =>
        recipients.push(participant.email)
      );
      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "enquiry":
      emailDetails.recipientEmail = req.body.email;
      emailDetails.recipientName = "Thank you for your enquiry";
      genericEmail(emailDetails);
      const enquiry = await Enquiry.findById(req.body._id);
      enquiry.responded = true;
      await enquiry.save();
      return res.status(201).json("email sent");
  }
});

export { sendEmail };
