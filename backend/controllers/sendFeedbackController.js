import asyncHandler from "express-async-handler";
import Member from "../models/memberModel.cjs";

const sendFeedback = asyncHandler(async (req, res) => {
  console.log(req.body.data.feedback);
  await Member.findOneAndUpdate(
    { _id: req.body.data.id },
    {
      feedback: req.body.data.feedback,
    },
    { new: true }
  );

  res.status(201).json("feedback submitted");
});

export { sendFeedback };
