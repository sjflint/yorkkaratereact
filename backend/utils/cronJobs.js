import cron from "node-cron";
import { newsLetterEmail } from "../emailTemplates/newsLetter.js";

export const exampleCron = cron.schedule(
  "1 1 7 * * 1",
  () => {
    newsLetterEmail();
    console.log("newsletter sent");
  },
  { timezone: "Europe/London" }
);

// run at 3am each day: delete orders for shop in 'isPaid: false' state and add stock back to the shop

// send email to admin with all paid orders, marked not ready to collect.
