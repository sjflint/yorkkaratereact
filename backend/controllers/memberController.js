import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import {
  createDirectDebit,
  changeDirectDebit,
} from "../utils/registerDirectDebit.cjs";
import Member from "../models/memberModel.cjs";
// import fs from "fs";
// import { promisify } from "util";
// import stream from "stream";

// @desc Auth member & get token
// @route GET /api/members/login
// @access Public
const authMember = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const member = await Member.findOne({ name });

  if (member && (await member.matchPassword(password))) {
    res.json({
      _id: member._id,
      name: member.name,
      firstName: member.firstName,
      email: member.email,
      isAdmin: member.isAdmin,
      isAuthor: member.isAuthor,
      isShopAdmin: member.isShopAdmin,
      isInstructor: member.isInstructor,
      token: generateToken(member._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

// @desc Register a new member
// @route POST /api/members
// @access Public
const registerMember = asyncHandler(async (req, res) => {
  const { values } = req.body;

  console.log(values);

  const memberExists = await Member.findOne({ name: values.name });

  if (memberExists) {
    res.status(400);
    throw new Error("Member already exists");
  }

  const member = await Member.create(values);

  if (member) {
    const session_token = member.name + member.email;

    const ddRedirect = await createDirectDebit(member, session_token);

    res.status(201).json({
      _id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      name: member.name,
      email: member.email,
      isAdmin: member.isAdmin,
      token: generateToken(member._id),
      ddRedirect: ddRedirect,
      session_token: session_token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid member data");
  }
});

// @desc Update DD mandate
// @route POST /api/members/updatedd
// @access Private
const updateDirectDebit = asyncHandler(async (req, res) => {
  console.log(req.body._id);
  const member = await Member.findById(req.body._id);

  if (member) {
    const session_token = Math.random() + member.name + member.email;
    const ddRedirect = await changeDirectDebit(session_token);

    if (ddRedirect) {
      res.status(201).json({
        _id: member._id,
        session_token: session_token,
        ddRedirect: ddRedirect,
      });
    } else {
      res.status(500);
      throw new Error("Unable to update Direct Debit");
    }
  } else {
    console.log("error");
  }
});

// @desc Get member profile
// @route GET /api/members/profile
// @access Private
const getMemberProfile = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.member._id);

  if (member) {
    const age = Math.floor((new Date() - member.dateOfBirth) / 60000 / 525600);
    const grade = Number(member.grade);

    res.json({
      _id: member._id,
      nameFirst: member.firstName,
      nameSecond: member.lastName,
      isAdmin: member.isAdmin,
      isShopAdmin: member.isShopAdmin,
      isAuthor: member.isAuthor,
      isInstructor: member.isInstructor,
      AddressLine1: member.addressLine1,
      AddressLine2: member.addressLine2,
      AddressLine3: member.addressLine3,
      AddressLine4: member.addressLine4,
      postcode: member.postCode,
      email: member.email,
      phone: member.phone,
      emergencyContactName: member.emergencyContactName,
      emergencyContactEmail: member.emergencyContactEmail,
      emergencyContactPhone: member.emergencyContactPhone,
      userName: member.name,
      gradeLevel: member.gradeLevel,
      membershipLevel: member.trainingFees,
      age: age,
      lastClassChange: member.lastClassChange,
      profileImg: member.profileImg,
      ddsuccess: member.ddsuccess,
      kyuGrade: member.kyuGrade,
      danGrade: member.danGrade,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get member payment details
// @route GET /api/members/memberpaymentdetails
// @access Private
const getMemberPaymentDetails = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.id);

  if (member) {
    res.json({
      _id: member._id,
      nameFirst: member.firstName,
      nameSecond: member.lastName,
      email: member.email,
      ddMandate: member.ddMandate,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update profile
// @route POST /api/members/updateProfile
// @access Public
const updateProfile = asyncHandler(async (req, res) => {
  const { values } = req.body;

  const member = await Member.findById(values.memberId);

  if (member) {
    await Member.findOneAndUpdate(
      { _id: member._id },
      {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        addressLine3: values.addressLine3,
        addressLine4: values.addressLine4,
        postCode: values.postCode,
        email: values.email,
        phone: values.phone,
        emergencyContactName: values.emergencyContactName,
        emergencyContactEmail: values.emergencyContactEmail,
        emergencyContactPhone: values.emergencyContactPhone,
      },
      { new: true }
    );
    res.json("profile updated");
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc update password
// @route GET /api/members/updatepassword
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
  const { passwordValues } = req.body;

  const member = await Member.findById(passwordValues.memberId);

  if (member && (await member.matchPassword(passwordValues.password))) {
    member.password = passwordValues.newPassword;
    await member.save();
    res.json("Password updated");
  } else {
    res.status(401);
    throw new Error("Password Incorrect");
  }
});

// @desc Reset Password
// @route GET /api/members/resetpassword
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.body._id);

  if (member) {
    member.password = "Cannon110";
    await member.save();

    res.json("Password updated");
  }
});

// @desc Get club black belts
// @route GET /api/members/blackbelts
// @access Public
const getBlackBelts = asyncHandler(async (req, res) => {
  const query = { danGrade: { $gt: 0 } };

  const options = {
    danGrade: 1,
    createdAt: 1,
    danGradings: 1,
    profileImg: 1,
    firstName: 1,
    lastName: 1,
  };

  const blackBeltMembers = await Member.find(query, options).sort({
    danGrade: 1,
  });

  res.json(blackBeltMembers);
});

// @desc Find all members
// @route GET /api/members
// @access Private/Admin
const getMembers = asyncHandler(async (req, res) => {
  const options = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    phone: 1,
    ddMandate: 1,
  };

  const members = await Member.find({}, options);

  res.json(members);
});

// @desc Delete member
// @route DELETE /api/members/:id
// @access Private/Admin
const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    await member.remove();
    res.json({ message: "Member deleted" });
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc GET member by ID
// @route GET /api/members/:id/edit
// @access Private/Admin
const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id).select("-password");

  if (member) {
    res.json(member);
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc Update member profile
// @route POST /api/members/:id
// @access Private/Admin
const updateMemberProfile = asyncHandler(async (req, res) => {
  const { values } = req.body;

  const member = await Member.findById(req.params.id);

  console.log(values);

  if (member) {
    await Member.findOneAndUpdate({ _id: values.memberId }, values, {
      new: true,
    });
    res.json("profile updated");
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

export {
  authMember,
  getMemberProfile,
  registerMember,
  getBlackBelts,
  // postProfileImg,
  updateProfile,
  updatePassword,
  updateDirectDebit,
  getMemberPaymentDetails,
  resetPassword,
  getMembers,
  deleteMember,
  getMemberById,
  updateMemberProfile,
};
