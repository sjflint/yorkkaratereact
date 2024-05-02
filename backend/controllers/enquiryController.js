import asyncHandler from "express-async-handler";
import { enquiryEmail } from "../emailTemplates/enquiry.js";
import Enquiry from "../models/enquiryModel.js";

const postEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, ageGroup, message } = req.body;

  const enquiry = await Enquiry.create({
    name,
    email,
    phone,
    ageGroup,
    message,
  });

  if (enquiry) {
    // send email
    const emailDetails = {
      recipientName: name,
      recipientEmail: email,
    };

    await enquiryEmail(emailDetails);

    res.status(201).json({
      _id: enquiry._id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      ageGroup: enquiry.ageGroup,
      message: enquiry.message,
    });
  } else {
    res.status(400);
    throw new Error("Invalid form data");
  }
});

const getEnquirys = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({ responded: false });
  res.send(enquiries);
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findOne({ _id: req.params.id });
  console.log(enquiry);
  enquiry.responded = true;
  enquiry.save();
  res.send("enquiry deleted");
});

export { postEnquiry, getEnquirys, deleteEnquiry };
