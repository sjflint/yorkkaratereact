import asyncHandler from "express-async-handler";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Members from "../models/memberModel.cjs";
import TrainingSessions from "../models/trainingSessionModel.cjs";

// possible recipient groups:
// -Everyone
// -Specific grade or grade range
// -Squad
// -Specific class

const sendEmail = asyncHandler(async (req, res) => {
  let paragraphs = "";
  const messages = req.body.message;
  messages.forEach((message) => {
    paragraphs = `${paragraphs}<p>${message}</p>`;
  });

  const members = await Members.find({});
  let recipients = [];
  const emailDetails = {
    recipientEmail: recipients,
    recipientName: "Dear club members,",
    subject: req.body.subject,
    message: `<h4>${req.body.subject}</h4>
                  ${paragraphs}`,
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
  }
});

export { sendEmail };
