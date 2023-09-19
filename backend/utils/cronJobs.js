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
  memberLicenseCheck,
} from "../controllers/memberController.js";
import { waitingListCheck } from "../controllers/trainingSessionController.js";

export const cronJobs = () => {
  // Newsletter sent every Monday @ 7am
  // add current number of members to totalMembers Array
  cron.schedule(
    "1 1 7 * * 1",
    () => {
      newsLetterEmail();
      console.log("request to send newsletter");
      addTotalMembersToArray();
      // check for any members without license numbers
      memberLicenseCheck();
    },
    { timezone: "Europe/London" }
  );

  // Invalid orders deleted every day @ 3am
  cron.schedule(
    "1 1 3 * * *",
    () => {
      deleteOrders();
      console.log("request to delete orders");
    },
    { timezone: "Europe/London" }
  );

  // Action at 8am every morning
  cron.schedule("0 8 * * *", () => {
    // email with all paid orders, marked not ready to collect.
    emailShopAdmins();
    // email with open enquiries
    emailEnquiryAdmin();
    // check waiting lists and email if places available
    waitingListCheck();
  });

  // send email at midnight every day to trial attendees who have attended their session. Remove from database.
  cron.schedule("0 0 * * *", () => {
    checkTrialComplete();
  });
};

// remove cancelled member records from db
// check black belt deletions if account reinstated
