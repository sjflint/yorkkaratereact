import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import {
  createDirectDebit,
  changeDirectDebit,
} from "../utils/registerDirectDebit.cjs";
import Member from "../models/memberModel.cjs";
import FormerBlackBelts from "../models/formerBlackBeltsModel.cjs";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Financial from "../models/financialModel.cjs";
import Attendance from "../models/attendanceModel.cjs";
import dotenv from "dotenv";
import { updateCollectionDate } from "./ddController.cjs";
import MonthlyCosts from "../models/monthlyCosts.js";
import TrainingSession from "../models/trainingSessionModel.cjs";

dotenv.config();

// Format first name and last name to uppercase first letter and lower case for the rest
const formatName = (name) => {
  const removeNoneAlpha = name.replace(/[^a-z0-9-\s']/gi, "");
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
      phone: member.phone,
      isAdmin: member.isAdmin,
      isAuthor: member.isAuthor,
      isShopAdmin: member.isShopAdmin,
      isInstructor: member.isInstructor,
      token: generateToken(member._id),
      lastLogin: new Date(),
      ddsuccess: member.ddsuccess,
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
    email: email,
    firstName: firstName,
    lastName: lastName,
  });

  if (memberExists) {
    res.status(400);
    throw new Error(
      "Member already registered. Please login to your account via the login screen"
    );
  }

  const financials = await Financial.findOne({});

  req.body.firstName = firstName;
  req.body.lastName = lastName;
  req.body.email = email;
  req.body.trainingFees = Number(financials.baseLevelTrainingFees);

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

  // set date here in db for next collection date, if available
  await updateCollectionDate(member._id);

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

    let grade;
    if (kyuGrade === 0) {
      grade = danGrade * -1;
    } else {
      grade = kyuGrade;
    }

    if (age < 9 && grade > 1) {
      member.gradeLevel = "Intermediate";
      member.numberOfSessionsRequired = 24;
    }
    if (age < 9 && grade > 6) {
      member.gradeLevel = "Novice";
      member.numberOfSessionsRequired = 16;
    }
    if (age < 9 && grade > 10) {
      member.gradeLevel = "Junior";
      member.numberOfSessionsRequired = 10;
    }
    if (age < 9 && grade < 2) {
      member.gradeLevel = "Advanced";
      member.numberOfSessionsRequired = 0;
    }

    if (age > 8 && grade > 1) {
      member.gradeLevel = "Intermediate";
      member.numberOfSessionsRequired = 24;
    }
    if (age > 8 && grade > 6) {
      member.gradeLevel = "Novice";
      member.numberOfSessionsRequired = 16;
    }
    if (age > 8 && grade > 10) {
      member.gradeLevel = "Junior";
      member.numberOfSessionsRequired = 10;
    }
    if (age > 8 && grade < 2) {
      member.gradeLevel = "Advanced";
    }

    // if conditional pass flag, double number of sessions required

    res.json(member);
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

  console.log(values);

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
    const memberUpdated = await Member.findOneAndUpdate(
      { _id: member._id },
      values,
      { new: true }
    );
    res.json(memberUpdated);
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
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "Password changed",
      message: `<h4>${member.firstName}, your password has been changed</h4>
    <p>We have updated your password for your York Karate account.</p>
    `,
      link: `${process.env.DOMAIN_LINK}/profile`,
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
  console.log(lastName);
  firstName = formatName(firstName);
  lastName = formatName(lastName);
  email = email.toLowerCase().trim();
  const dateOfBirth = req.body.values.dateOfBirth;

  console.log(lastName);

  let member = await Member.find({
    firstName: firstName,
    lastName: lastName,
    email: email,
    dateOfBirth: dateOfBirth,
  });

  if (member.length > 0 && member.length < 2) {
    member[0].password = req.body.values.newPassword;
    member = await member[0].save();

    console.log(member.firstName);

    // send email to confirm password reset
    genericEmail({
      recipientEmail: `${member.email}, ${member.secondaryEmail}`,
      recipientName: member.firstName,
      subject: "Password reset",
      message: `<h4>${member.firstName}, your password has been reset</h4>
    <p>We have reset your password for your York Karate account.</p>
    `,
      link: `${process.env.DOMAIN_LINK}/profile`,
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
    bio: 1,
    isInstructor: 1,
  };

  const sortParams = {
    danGrade: -1,
    "danGradings.1st Dan": 1,
    // "danGradings.2nd Dan": -1,
    // "danGradings.3rd Dan": -1,
    // "danGradings.Started Training": -1,
  };

  const blackBeltMembers = await Member.find(query, options).sort(sortParams);

  res.json(blackBeltMembers);
});

// @desc Get former club black belts
// @route GET /api/members/formerblackbelts
// @access Public
const getFormerBlackBelts = asyncHandler(async (req, res) => {
  const formerBlackBeltMembers = await FormerBlackBelts.find({}).sort({
    dateLeft: -1,
  });

  res.json(formerBlackBeltMembers);
});

// @desc Find all members
// @route GET /api/members
// @access Private/Admin
const getMembers = asyncHandler(async (req, res) => {
  // special keywords: all for every members unpaginated & squad for all squad members unpaginated
  if (req.query.keyword === "all") {
    console.log('"all" keyword called');
    const members = await Member.find({ ddsuccess: true });
    res.json({ members: members });
  } else if (req.query.keyword === "squad") {
    console.log('"squad" keyword called');
    const members = await Member.find({
      squadMember: true,
      ddsuccess: true,
    }).sort({ firstName: 1 });

    // Check attendance and return for each member
    // Obtain array of last 12 squad training sessions
    let classes = await Attendance.find({
      name: /Squad/,
    }).sort({ date: 1 });
    console.log(classes.length);
    classes = classes.slice(classes.length - 24);

    // Loop through each member and check their attendance against the array of the last 12 squad sessions
    members.forEach((member) => {
      let attScore = 0;
      classes.forEach((squadClass) => {
        if (squadClass.participants.includes(member._id)) {
          attScore++;
        }
      });
      member.squadAttScore = attScore;
    });

    res.json({ members: members });
  } else {
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
      ddsuccess: 1,
    };

    const members = await Member.find({ ...keyword }, options)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ members, page, pages: Math.ceil(count / pageSize) });
  }
});

// @desc Delete member
// @route DELETE /api/members/:id
// @access Private/Admin
const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  const removeMember = async (member) => {
    await member.remove();
    res.json({ message: "Member deleted" });
  };

  // if member is a black belt, create record for former black belts.
  if (member.danGrade > 0) {
    await FormerBlackBelts.create({
      firstName: member.firstName,
      lastName: member.lastName,
      danGrade: member.danGrade,
      danGradings: member.danGradings,
      profileImg: member.profileImg,
    });
    console.log("former black belt created");
    removeMember(member);
  } else if (member) {
    removeMember(member);
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
      createdAt: member.createdAt,
      kyuGrade: member.kyuGrade,
      danGrade: member.danGrade,
      isInstructor: member.isInstructor,
      bio: member.bio,
    });
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc Update member profile
// @route PUT /api/members/:id
// @access Private/Admin
const updateMemberProfile = asyncHandler(async (req, res) => {
  const { values } = req.body;

  console.log(values);

  const keys = Object.keys(values.danGradings);

  keys.forEach((key) => {
    console.log(values.danGradings[key]);
    const date = new Date(values.danGradings[key]);
    console.log(date);
    values.danGradings[key] = date;
  });

  const todaysDate = new Date();

  if (values.danGradingDate) {
    values.danGradings[values.danGradeToUpdate] = new Date(
      values.danGradingDate
    );
  }

  const member = await Member.findById(req.params.id);

  if (member) {
    const memberUpdate = await Member.findOneAndUpdate(
      { _id: values.memberId },
      values,
      {
        new: true,
      }
    );

    // // send email to confirm profile updated
    // genericEmail({
    //   recipientEmail: member.email,
    //   recipientName: member.firstName,
    //   subject: "Profile Updated",
    //   message: `<h4>${member.firstName}, your profile has been updated</h4>
    // <p>We have updated your profile details for your York Karate account.</p>
    // `,
    //   link: `${process.env.DOMAIN_LINK}/profile`,
    //   linkText: "View Account",
    //   attachments: [],
    // });

    res.json(memberUpdate);
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc Add current number of members to array
// @route SERVER ONLY
const addTotalMembersToArray = async () => {
  const financials = await Financial.findOne({});

  const members = await Member.find({ ddsuccess: true });

  // Calculate total income
  let totalFees = [];
  members.forEach((member) => {
    if (member.ddsuccess) {
      totalFees.push(Number(member.trainingFees));
    }
  });
  const initialValue = 0;
  let totalIncome = totalFees.reduce((prev, curr) => prev + curr, initialValue);
  totalIncome = totalIncome / 100;

  // calculate total costs
  let totalCosts = [];
  const monthlyCosts = await MonthlyCosts.find({});
  monthlyCosts.forEach((cost) => {
    totalCosts.push(cost.cost);
  });
  const initialCostValue = 0;
  let totalCost = totalCosts.reduce(
    (prevValue, currValue) => prevValue + currValue,
    initialCostValue
  );

  // update database
  financials.totalMembers.push({
    date: new Date().toISOString().slice(0, 10),
    totalMembers: members.length,
    totalIncome: totalIncome,
    totalCosts: totalCost,
    profit: totalIncome - totalCost,
  });

  financials.save();
};

// @desc get public list of welfare officers
// @route GET /api/members/publicwelfarelist
// access Public
const getPublicWelfareList = asyncHandler(async (req, res) => {
  let eighteenYearsAgo = new Date();
  eighteenYearsAgo = eighteenYearsAgo.setFullYear(
    eighteenYearsAgo.getFullYear() - 18
  );

  const members = await Member.find(
    {
      dateOfBirth: { $lte: new Date(eighteenYearsAgo) },
      kyuGrade: { $lte: 3 },
      ddsuccess: true,
    },
    { firstName: 1, lastName: 1, profileImg: 1 }
  ).sort({
    danGrade: -1,
  });

  if (members) {
    res.status(200).json(members);
  } else {
    res.status(404);
    throw new Error("Members not found");
  }
});

// @desc get member list of welfare officers
// @route GET /api/members/memberwelfarelist
// access Private
const getMemberWelfareList = asyncHandler(async (req, res) => {
  let eighteenYearsAgo = new Date();
  eighteenYearsAgo = eighteenYearsAgo.setFullYear(
    eighteenYearsAgo.getFullYear() - 18
  );

  const members = await Member.find(
    {
      dateOfBirth: { $lte: new Date(eighteenYearsAgo) },
      kyuGrade: { $lte: 3 },
      ddsuccess: true,
    },
    { firstName: 1, lastName: 1, profileImg: 1, phone: 1, email: 1 }
  ).sort({
    danGrade: -1,
  });

  if (members) {
    res.status(200).json(members);
  } else {
    res.status(404);
    throw new Error("Members not found");
  }
});

const updateAttRecord = asyncHandler(async (req, res) => {
  const member = await Member.findById({ _id: req.params.id });

  if (member) {
    let attRecord = Number(member.attendanceRecord);
    console.log(attRecord);
    member.attendanceRecord = attRecord + Number(req.params.value);
    member.save();
    res.status(200).json(member);
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc check class credits
// route SERVER ONLY
const checkClassCredits = asyncHandler(async (req, res) => {
  const todaysDate = new Date().setHours(0, 0, 0, 0);
  const members = await Member.find({
    ddsuccess: true,
  });
  if (members) {
    members.forEach((member) => {
      if (
        new Date(member.classCreditRefund).setHours(0, 0, 0, 0) == todaysDate
      ) {
        console.log("class credit added");
        member.freeClasses++;
        member.classCreditRefund = null;
        member.save();
      }
    });
  }
});

// @desc check members are licensed
// route SERVER ONLY
const memberLicenseCheck = asyncHandler(async (req, res) => {
  const members = await Member.find({
    ddsuccess: true,
    licenseNumber: { $exists: 0 },
  });

  let memberEmails = [];
  if (members) {
    members.forEach((member) => {
      memberEmails.push(member.email);
      memberEmails.push(member.secondaryEmail);
    });
  }

  genericEmail({
    recipientEmail: memberEmails,
    subject: "JKS England License",
    message: `<h4>Missing JKS England License Number</h4>
    <p>Our records indicate that we do not have your JKS England license number.</p>
    <p>This could be because you haven't updated your profile with your number or perhaps you haven't applied for your license yet.</p>
    <p>Please use the link below to login to your account and either add your license number, when prompted, or follow the instructions to apply for a license.</p>
    <h5>Why do I need a JKS England License?</h5>
    <p>The license is required for the following reasons:</p>
    <ul>
      <li>Member Insurance. This will cover you/your parents for public liability including damage to property or injury to another individual whilst training in karate</li>
      <li>Gradings. In order to obtain a JKS England grade, you must be a member of JKS England</li>
      <li>Competitions. As well as being licensed with JKS England, you will also be a member of the English Karate Federation (EKF) and by association, the World Karate Federation (WKF). This is necessary to compete in any WKF sanctioned event or JKS England event.</li>
    </ul>
    <p>Please don't hesitate to get in touch if you have any questions (info@yorkkarate.net)</p>
    `,
    link: `${process.env.DOMAIN_LINK}/profile`,
    linkText: "Login",
    attachments: [],
  });
});

const totalSquadAtt = async () => {
  const members = await Member.find({ squadMember: true, ddsuccess: true });

  let classes = await Attendance.find({
    name: /Squad/,
  }).sort({ date: 1 });
  classes = classes.slice(classes.length - 96);
  // gives attendance at squad training for the past year
  // provide average attendance for squad member of the course of the year
  // TODO: show in front end admin section somewhere

  members.forEach((member) => {
    let attScore = 0;
    classes.forEach((squadClass) => {
      if (squadClass.participants.includes(member._id)) {
        attScore++;
      }
    });
    console.log(member.firstName);
    console.log(`${(attScore / 48) * 100}%`);
  });
};

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
  getFormerBlackBelts,
  addTotalMembersToArray,
  getPublicWelfareList,
  getMemberWelfareList,
  updateAttRecord,
  memberLicenseCheck,
  checkClassCredits,
};
