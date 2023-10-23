import cron from "node-cron";
import { newsLetterEmail } from "../emailTemplates/newsLetter.js";
import {
  deleteOrders,
  emailShopAdmins,
} from "../controllers/orderControllers.js";
import { checkTrialComplete } from "../controllers/registerTrialControllers.js";
import { emailEnquiryAdmin } from "../emailTemplates/enquiryAdmin.js";
import {
  addTotalMembersToArray,
  checkClassCredits,
  memberLicenseCheck,
} from "../controllers/memberController.js";
import { waitingListCheck } from "../controllers/trainingSessionController.js";

export const cronJobs = () => {
  // every Monday @ 7am
  // Newsletter sent
  // add current number of members to totalMembers Array
  // check for any members without license numbers
  cron.schedule(
    "1 1 7 * * 1",
    () => {
      newsLetterEmail();
      addTotalMembersToArray();
      memberLicenseCheck();
    },
    { timezone: "Europe/London" }
  );

  // every day @ 3am
  // Invalid orders deleted
  // check for class credit refunds
  cron.schedule(
    "1 1 3 * * *",
    () => {
      deleteOrders();
      checkClassCredits();
    },
    { timezone: "Europe/London" }
  );

  // Action at 8am every morning
  // email with all paid orders, marked not ready to collect.
  // email with open enquiries
  // check waiting lists and email if places available
  cron.schedule("0 8 * * *", () => {
    emailShopAdmins();
    emailEnquiryAdmin();
    waitingListCheck();
  });

  // send email at midnight every day to trial attendees who have attended their session. Remove from database.
  cron.schedule("0 0 * * *", () => {
    checkTrialComplete();
  });
};

// remove cancelled member records from db
// check black belt deletions if account reinstated
