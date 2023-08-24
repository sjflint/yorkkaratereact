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
  const members = await Members.find({ ddsuccess: true });

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
      members.forEach((member) =>
        recipients.push(member.email, member.secondaryEmail)
      );

      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "grade":
      members.forEach(
        (member) =>
          member.kyuGrade <= req.body.minGrade &&
          member.kyuGrade >= req.body.maxGrade &&
          recipients.push(member.email, member.secondaryEmail)
      );
      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "squad":
      members.forEach(
        (member) =>
          member.squadMember &&
          recipients.push(member.email, member.secondaryEmail)
      );
      genericEmail(emailDetails);
      return res.status(201).json("email sent");

    case "class":
      const trainingSessions = await TrainingSessions.findById(
        req.body.classId
      ).populate("participants", "email");
      trainingSessions.participants.forEach((participant) =>
        recipients.push(participant.email, participant.secondaryEmail)
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

// const checkEmails = async () => {
//   const members = await Members.find({ ddsuccess: true });
//   const emailArray = [];
//   for (const member of members) {
//     emailArray.push(member.email);
//     emailArray.push(member.secondaryEmail);
//   }
//   const recipients = emailArray.filter((recipient) => recipient !== "");

//   if (recipients.length > 100 && recipients.length < 200) {
//     //if over 100 and less than 200
//     // divide into two
//     const firstArray = recipients.slice(0, recipients.length / 2);
//     const secondArray = recipients.slice(recipients.length / 2);
//     console.log(firstArray);
//     console.log(secondArray);
//   } else if (recipients.length > 200 && recipients.length < 300) {
//     //if over 200 and less than 300
//     // divide into 3
//     const firstArray = recipients.slice(0, recipients.length / 3);
//     const secondArray = recipients.slice(
//       recipients.length / 3,
//       recipients.length - recipients.length / 3
//     );
//     const thirdArray = recipients.slice(
//       recipients.length - recipients.length / 3
//     );
//   } else if (recipients.length > 300 && recipients.length < 400) {
//     //if over 300 and less than 400
//     // divide into 4
//     const firstArray = recipients.slice(0, recipients.length / 4);
//     const secondArray = recipients.slice(
//       recipients.length / 4,
//       recipients.length - recipients.length / 2
//     );
//     const thirdArray = recipients.slice(
//       recipients.length - recipients.length / 2,
//       recipients.length - recipients.length / 4
//     );
//     const fourthArray = recipients.slice(
//       recipients.length - recipients.length / 4
//     );
//   } else {
//     // default and so less than 3. just send full array
//   }
// };
// checkEmails();

export { sendEmail };
