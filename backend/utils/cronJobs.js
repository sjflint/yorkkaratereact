import cron from "node-cron";
import { newsLetterEmail } from "../emailTemplates/newsLetter.js";
import {
  deleteOrders,
  emailShopAdmins,
} from "../controllers/orderControllers.js";
import { checkTrialComplete } from "../controllers/registerTrialControllers.js";
import { emailEnquiryAdmin } from "../emailTemplates/enquiryAdmin.js";

export const cronJobs = () => {
  // Newsletter sent every Monday @ 7am
  cron.schedule(
    "1 1 7 * * 1",
    () => {
      newsLetterEmail();
      console.log("request to send newsletter");
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

  // send email to admin with all paid orders, marked not ready to collect.
  cron.schedule("0 8 * * *", () => {
    emailShopAdmins();
    console.log("request to send email to shop admins");
  });

  // send email to trial attendees who have attended their session. Remove from database.
  cron.schedule("0 0 * * *", () => {
    checkTrialComplete();
  });

  // send email for open enquiries
  cron.schedule("0 8 * * *", () => {
    emailEnquiryAdmin();
  });
};