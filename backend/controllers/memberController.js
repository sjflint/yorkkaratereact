import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import {
  createDirectDebit,
  changeDirectDebit,
} from "../utils/registerDirectDebit.cjs";
import Member from "../models/memberModel.cjs";

// @desc Auth member & get token
// @route GET /api/members/login
// @access Public
const authMember = asyncHandler(async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  firstName = firstName.toLowerCase().trim();
  lastName = lastName.toLowerCase().trim();
  email = email.toLowerCase().trim();

  const member = await Member.findOne({
    firstName: firstName,
    lastName: lastName,
    email: email,
  });

  if (member && (await member.matchPassword(password))) {
    res.json({
      _id: member._id,
      lastName: member.lastName,
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
  const memberExists = await Member.findOne({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });

  if (memberExists) {
    res.status(400);
    throw new Error("Member already exists");
  }

  const member = await Member.create(req.body);

  if (member) {
    const session_token = Math.random() + member.firstName + member.email;

    const ddRedirect = await createDirectDebit(member, session_token);

    member.token = generateToken(member._id);
    member.save();

    res.status(201).json({
      _id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
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
  const member = await Member.findById(req.body._id);

  if (member) {
    const session_token = Math.random() + member.firstName + member.email;
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
      licenseNumber: member.licenseNumber,
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

  if (member && values.licenseNumber) {
    await Member.findOneAndUpdate(
      { _id: member._id },
      {
        licenseNumber: values.licenseNumber,
      },
      { new: true }
    );
    res.json("JKS Number updated");
  } else if (member) {
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
  const firstName = req.body.values.firstName.toLowerCase();
  const lastName = req.body.values.lastName.toLowerCase();
  const email = req.body.values.email.toLowerCase();
  const dateOfBirth = req.body.values.dateOfBirth;

  const member = await Member.find({
    firstName: firstName,
    lastName: lastName,
    email: email,
    dateOfBirth: dateOfBirth,
  });

  if (member.length > 0 && member.length < 2) {
    member[0].password = req.body.values.newPassword;
    await member[0].save();

    res.json("Password updated");
  } else {
    res.status(404);
    throw new Error("Error: Cannot find member details");
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
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            firstName: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Member.countDocuments();

  const options = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    phone: 1,
    ddMandate: 1,
  };

  const members = await Member.find({ ...keyword }, options)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ members, page, pages: Math.ceil(count / pageSize) });
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
  const member = await Member.findById(req.params.id);

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
