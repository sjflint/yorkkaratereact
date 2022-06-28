import asyncHandler from "express-async-handler";
import Financial from "../models/financialModel.cjs";
import Member from "../models/memberModel.cjs";
import MonthlyCosts from "../models/monthlyCosts.js";
import { updateSubscription } from "./ddController.cjs";

// @desc Fetch all financial details
// @route GET /api/financial
// @access Private/Admin
const getFinancialDetails = asyncHandler(async (req, res) => {
  const financials = await Financial.findOne({});

  if (financials) {
    res.json(financials);
  } else {
    res.status(404);
    throw new Error("Financials not found");
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
    costOfGrading,
  } = req.body;
  const financials = await Financial.findOne({});

  const membersList = await Member.find({ ddsuccess: true });

  if (financials) {
    if (financials.costOfAdditionalClass !== costOfAdditionalClass) {
      // if cost of additional class increases, update all members direct debits
      for (const member of membersList) {
        const additionalPayment =
          member.trainingFees / 100 - financials.baseLevelTrainingFees;
        const numberOfClasses =
          additionalPayment / financials.costOfAdditionalClass;
        const changeAmount =
          (costOfAdditionalClass - financials.costOfAdditionalClass) * 100;

        const paymentDetails = {
          _id: member._id,
          changeAmount: numberOfClasses * changeAmount,
        };
        await updateSubscription(paymentDetails);
      }
      financials.costOfAdditionalClass = costOfAdditionalClass;
    }

    if (financials.baseLevelTrainingFees !== baseLevelTrainingFees) {
      // if baselevel training fees have changed, update all members direct debits
      for (const member of membersList) {
        const paymentDetails = {
          _id: member._id,
          changeAmount:
            (baseLevelTrainingFees - financials.baseLevelTrainingFees) * 100,
        };
        await updateSubscription(paymentDetails);
      }
      financials.baseLevelTrainingFees = baseLevelTrainingFees;
    }

    financials.costOfGrading = costOfGrading;
    financials.joiningFee = joiningFee;

    await financials.save();
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

export {
  getFinancialDetails,
  updateFinancialDetails,
  getMonthlyCosts,
  updateMonthlyCost,
  deleteMonthlyCost,
};
