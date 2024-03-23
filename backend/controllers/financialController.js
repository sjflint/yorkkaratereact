import asyncHandler from "express-async-handler";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Financial from "../models/financialModel.cjs";
import Member from "../models/memberModel.cjs";
import MonthlyCosts from "../models/monthlyCosts.js";
import { updateSubscription } from "./ddController.cjs";
import dotenv from "dotenv";

dotenv.config();

// @desc Fetch all financial details
// @route GET /api/financial
// @access Private/Admin
const getFinancialDetails = asyncHandler(async (req, res) => {
  const financials = await Financial.findOne({});

  const beltsToOrder = await beltCalculator();

  financials.beltsToOrder = beltsToOrder;

  if (financials) {
    res.json(financials);
  } else {
    res.status(404);
    throw new Error("Financials not found");
  }
});

// @desc update belt stock levels
// @route PUT /api/financial
// @access Private/Admin
const updateBelts = asyncHandler(async (req, res) => {
  console.log(req.body);
  const financials = await Financial.findOneAndUpdate(
    {},
    { belts: req.body },
    { new: true }
  );

  if (financials) {
    res.status(200).json(financials);
  } else {
    res.status(404);
    throw new Error("could not find or update belts");
  }
});

// @desc Update financial details
// @route POST /api/financial
// @access Private/Admin
const updateFinancialDetails = asyncHandler(async (req, res) => {
  let {
    baseLevelTrainingFees,
    joiningFee,
    costOfAdditionalClass,
    costOfExtraFee,
    costOfGrading,
    costOfTrainingCourse,
    belts,
  } = req.body;

  const newBaseLevelTrainingFees = Number(baseLevelTrainingFees * 100);
  const newJoiningFee = Number(joiningFee * 100);
  const newCostOfAdditionalClass = Number(costOfAdditionalClass * 100);
  const newCostOfExtraFee = Number(costOfExtraFee * 100);
  const newCostOfGrading = Number(costOfGrading * 100);
  const newCostOfTrainingCourse = Number(costOfTrainingCourse * 100);

  let financials = await Financial.findOne({});

  financials.baseLevelTrainingFees = newBaseLevelTrainingFees;
  financials.costOfAdditionalClass = newCostOfAdditionalClass;
  financials.costOfGrading = newCostOfGrading;
  financials.joiningFee = newJoiningFee;
  financials.costOfExtraFee = newCostOfExtraFee;
  financials.costOfTrainingCourse = newCostOfTrainingCourse;

  await financials.save();

  financials = await Financial.findOne({});

  // // Update member subscriptions
  const membersList = await Member.find({
    ddsuccess: true,
    ddMandate: { $ne: "Cancelled" },
  });

  console.log(membersList.length);
  console.log(financials);
  if (financials) {
    if (
      financials.baseLevelTrainingFees !== baseLevelTrainingFees ||
      financials.costOfAdditionalClass !== costOfAdditionalClass
    ) {
      const numberOfUpdatesProcessed = 0;
      for (const member of membersList) {
        try {
          const paymentDetails = {
            _id: member._id,
            // this would need to be -1 for everyone so that only the additional classes, not including the 1st class, are added. If anyone has no classes booked
            changeAmount: -1,
          };
          await updateSubscription(paymentDetails);
          numberOfUpdatesProcessed++;
        } catch (error) {
          console.log(
            `${member.firstName} ${member.lastName} could not be updated to the new pricing structure`
          );
        }
      }
      console.log(`Number of updates processed: ${numberOfUpdatesProcessed}`);
    }

    //   // combine emails
    //   // send email to notify members of the change
    //   let recipients = [];
    //   membersList.forEach((member) =>
    //     recipients.push(member.email, member.secondaryEmail)
    //   );

    //   genericEmail({
    //     recipientEmail: recipients,
    //     subject: "Update to club fees",
    //     message: `<h4>To all club members, we have updated some of our fees.</h4>
    //   <p>We would like to let you know that with immediate effect, the following fees are in place:</p>
    //   <ul>
    //     <li>Base Level Training Fees (to train once a week): £${
    //       baseLevelTrainingFees / 100
    //     } p/m</li>
    //     <li>The cost of increasing your training by one extra class a week: £${
    //       costOfAdditionalClass / 100
    //     }</li>
    //     <li>The cost of attending a one-off, extra class: £${
    //       costOfExtraFee / 100
    //     }</li>
    //     <li>The cost of attending a grading examination: £${
    //       costOfGrading / 100
    //     }</li>
    //   </ul>
    //   <p>There is nothing you need to do. Any price changes will automatically be applied to your direct debit.</p>
    //   `,
    //     link: `${process.env.DOMAIN_LINK}/profile`,
    //     linkText: "View Your account and fees",
    //     attachments: [],
    //   });

    res.status(201).json("financials updated");
  } else {
    res.status(404);
    throw new Error("Financials not found");
  }
});

// @desc Fetch all monthly costs
// @route GET /api/financial/monthlycosts
// @access Private/Admin
const getMonthlyCosts = asyncHandler(async (req, res) => {
  const monthlyCosts = await MonthlyCosts.find();

  if (monthlyCosts) {
    res.json(monthlyCosts);
  } else {
    res.status(404);
    throw new Error("Monthly costs not found");
  }
});

// @desc Update monthly cost (single document)
// @route POST /api/financial/monthlycosts
// @access Private/Admin
const updateMonthlyCost = asyncHandler(async (req, res) => {
  if (req.body._id === "") {
    const newCost = await MonthlyCosts.create({
      name: req.body.name,
      cost: req.body.cost,
    });

    if (!newCost) {
      res.status(404);
      throw new Error("Monthly cost not created");
    } else {
      res.status(201).json("monthly cost updated");
    }
  } else {
    const updatedCost = await MonthlyCosts.findByIdAndUpdate(req.body._id, {
      $set: { name: req.body.name, cost: req.body.cost },
    });

    if (!updatedCost) {
      res.status(404);
      throw new Error("Monthly cost not found");
    } else {
      res.status(201).json("monthly cost updated");
    }
  }
});

// @desc Delete monthly cost (single document)
// @route DELETE /api/financial/monthlycosts
// @access Private/Admin
const deleteMonthlyCost = asyncHandler(async (req, res) => {
  const deletedCost = await MonthlyCosts.findById(req.params.id);

  if (deletedCost) {
    await deletedCost.remove();
    res.json({ message: "Cost removed" });
  } else {
    res.status(404);
    throw new Error("Cost not found");
  }
});

const beltCalculator = async () => {
  // calculate belts required from member data to belts in stock from financial data
  const members = await Member.find({ ddsuccess: true });

  const financials = await Financial.findOne({});

  const beltStock = financials.belts;

  await Financial.findOneAndUpdate({}, { belts: beltStock }, { new: true });

  let arrayOfGrades = [];
  let beltRequired = {};

  members.forEach((member) => {
    arrayOfGrades.push(member.kyuGrade);
  });

  for (const grade of arrayOfGrades) {
    if (!beltRequired[grade - 1]) {
      beltRequired[grade - 1] = 1;
    } else {
      beltRequired[grade - 1] = beltRequired[grade - 1] + 1;
    }
  }

  const beltsToOrder = {
    "White Red":
      beltRequired[15] - beltStock[15] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[15] - beltStock[15] + 2,
    "White Black":
      beltRequired[14] - beltStock[14] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[14] - beltStock[14] + 2,
    Orange:
      beltRequired[13] - beltStock[13] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[13] - beltStock[13] + 2,
    "Orange White":
      beltRequired[12] - beltStock[12] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[12] - beltStock[12] + 2,
    "Orange Yellow":
      beltRequired[11] - beltStock[11] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[11] - beltStock[11] + 2,
    Red:
      beltRequired[9] - beltStock[9] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[9] - beltStock[9] + 2,
    "Red Black":
      beltRequired[8] - beltStock[8] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[8] - beltStock[8] + 2,
    Yellow:
      beltRequired[7] - beltStock[7] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[7] - beltStock[7] + 2,
    Green:
      beltRequired[6] - beltStock[6] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[6] - beltStock[6] + 2,
    Purple:
      beltRequired[5] - beltStock[5] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[5] - beltStock[5] + 2,
    "Purple White":
      beltRequired[4] - beltStock[4] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[4] - beltStock[4] + 2,
    Brown:
      beltRequired[3] - beltStock[3] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[3] - beltStock[3] + 2,
    "Brown White":
      beltRequired[2] - beltStock[2] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[2] - beltStock[2] + 2,
    "Brown Double White":
      beltRequired[1] - beltStock[1] + 2 < 1
        ? "Fully Stocked"
        : beltRequired[1] - beltStock[1] + 2,
  };

  return beltsToOrder;
};

beltCalculator();

export {
  getFinancialDetails,
  updateFinancialDetails,
  getMonthlyCosts,
  updateMonthlyCost,
  deleteMonthlyCost,
  updateBelts,
};
