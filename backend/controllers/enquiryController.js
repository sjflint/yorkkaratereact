import asyncHandler from "express-async-handler";
import Enquiry from "../models/enquiryModel.js";

const postEnquiry = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone, ageGroup, message } = req.body;

  const enquiry = await Enquiry.create({
    name,
    email,
    phone,
    ageGroup,
    message,
  });

  if (enquiry) {
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

export { postEnquiry };
