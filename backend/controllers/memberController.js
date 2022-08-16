import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import {
  createDirectDebit,
  changeDirectDebit,
} from "../utils/registerDirectDebit.cjs";
import Member from "../models/memberModel.cjs";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";

// Format first name and last name to uppercase first letter and lower case for the rest
const formatName = (name) => {
  const removeNoneAlpha = name.replace(/[^a-z0-9]/gi, "");
  const nameLowerCase = removeNoneAlpha.toLowerCase().trim();
  return nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1);
};

// @desc Auth member & get token
// @route GET /api/members/login
// @access Public
const authMember = asyncHandler(async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  firstName = formatName(firstName);
  lastName = formatName(lastName);
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
  let { firstName, lastName, email } = req.body;
  firstName = formatName(firstName);
  lastName = formatName(lastName);
  email = email.toLowerCase().trim();

  const memberExists = await Member.findOne({
    firstName: firstName,
    lastName: lastName,
    email: email,
  });

  if (memberExists) {
    res.status(400);
    throw new Error("Member already exists");
  }
  req.body.firstName = firstName;
  req.body.lastName = lastName;
  req.body.email = email;

  const member = await Member.create(req.body);

  if (member) {
    const session_token = Math.random() + member.firstName + member.email;

    const ddRedirect = await createDirectDebit(member, session_token);

    member.token = generateToken(member._id);
    await member.save();

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
    const kyuGrade = member.kyuGrade;
    const danGrade = member.danGrade;
    let gradeLevel;
    let grade;
    let numberOfSessionsRequired;
    if (kyuGrade === 0) {
      grade = danGrade;
    } else {
      grade = kyuGrade;
    }

    if (age < 9 && grade > 1) {
      gradeLevel = "Intermediate";
      numberOfSessionsRequired = 24;
    }
    if (age < 9 && grade > 6) {
      gradeLevel = "Novice";
      numberOfSessionsRequired = 16;
    }
    if (age < 9 && grade > 10) {
      gradeLevel = "Junior";
      numberOfSessionsRequired = 10;
    }
    if (age < 9 && grade < 2) {
      gradeLevel = "Advanced";
    }

    if (age > 8 && grade > 1) {
      gradeLevel = "Intermediate";
      numberOfSessionsRequired = 24;
    }
    if (age > 8 && grade > 6) {
      gradeLevel = "Novice";
      numberOfSessionsRequired = 16;
    }
    if (age > 8 && grade < 2) {
      gradeLevel = "Advanced";
    }

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
      gradeLevel: gradeLevel,
      membershipLevel: member.trainingFees,
      age: age,
      lastClassChange: member.lastClassChange,
      profileImg: member.profileImg,
      ddsuccess: member.ddsuccess,
      kyuGrade: member.kyuGrade,
      danGrade: member.danGrade,
      licenseNumber: member.licenseNumber,
      attendanceRecord: member.attendanceRecord,
      numberOfSessionsRequired: numberOfSessionsRequired,
      outstandingFees: member.outstandingFees,
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

    // send email to confirm password change
    genericEmail({
      recipientEmail: member.email,
      recipientName: member.firstName,
      subject: "Password changed",
      message: `<h4>${member.firstName}, your password has been changed</h4>
    <p>We have updated your password for your York Karate account.</p>
    `,
      link: `http://localhost:3000/profile`,
      linkText: "View Account",
      attachments: [],
    });

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
  let { firstName, lastName, email } = req.body.values;
  firstName = formatName(firstName);
  lastName = formatName(lastName);
  email = email.toLowerCase().trim();
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

    // send email to confirm password reset
    genericEmail({
      recipientEmail: member.email,
      recipientName: member.firstName,
      subject: "Password reset",
      message: `<h4>${member.firstName}, your password has been reset</h4>
    <p>We have reset your password for your York Karate account.</p>
    `,
      link: `http://localhost:3000/profile`,
      linkText: "View Account",
      attachments: [],
    });

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
  const query = { danGrade: { $gt: 0 }, ddsuccess: true };

  const options = {
    danGrade: 1,
    createdAt: 1,
    danGradings: 1,
    profileImg: 1,
    firstName: 1,
    lastName: 1,
  };

  const blackBeltMembers = await Member.find(query, options).sort({
    danGrade: -1,
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
    kyuGrade: 1,
    danGrade: 1,
    trainingFees: 1,
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

// @desc GET public member by ID
// @route GET /api/members/public/:id
// @access Public
const getPublicMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    res.json({
      firstName: member.firstName,
      lastName: member.lastName,
      profileImg: member.profileImg,
    });
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

    // send email to confirm profile updated
    genericEmail({
      recipientEmail: member.email,
      recipientName: member.firstName,
      subject: "Profile Updated",
      message: `<h4>${member.firstName}, your profile has been updated</h4>
    <p>We have updated your profile details for your York Karate account.</p>
    `,
      link: `http://localhost:3000/profile`,
      linkText: "View Account",
      attachments: [],
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
  getPublicMemberById,
  updateMemberProfile,
};
