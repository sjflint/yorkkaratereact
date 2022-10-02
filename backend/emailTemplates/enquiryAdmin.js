import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Enquiry from "../models/enquiryModel.js";
import Member from "../models/memberModel.cjs";
import { footer, header, logoYorkKarate } from "./emailParams.cjs";

dotenv.config();

const emailEnquiryAdmin = asyncHandler(async () => {
  const enquiries = await Enquiry.find({ responded: false });

  console.log(enquiries);
  if (enquiries.length > 0) {
    const adminMembers = await Member.find({ isAdmin: true });
    if (adminMembers) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "info@yorkkarate.net",
          pass: process.env.GMAIL_SECRET,
        },
      });

      // recipients admins
      let recipients = [];
      adminMembers.forEach((member) => {
        recipients.push(`${member.email};`);
      });

      const mailOptions = {
        from: "info@yorkkarate.net",
        to: recipients,
        subject: "enquiries awaiting response",
        text: "enquiries awaiting response",
        html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test Email</title>
    <style></style>
  </head>

 
 
  <body>
  ${header}
  <!-- Body -->
    <div id="email" style="width: 600px">
          <h4
            style="
              text-align: left;
              padding: 10px;
              margin: 0;
              background-color: #f7f7f9;
            "
          >
          There are enquiries awaiting to be replied to.
          </h4>
          <div
              style="
                padding-bottom: 20px;
                margin-top: 20px;
                border-bottom: 2px solid #f57231;
              "
            >
              <a
                href='${process.env.DOMAIN_LINK}/admin/emailmembers'
                target="_blank"
                style="
                  box-sizing: border-box;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 12px 18px;
                  border-radius: 4px;
                  border: solid 1px #0b0b0b;
                  font-weight: 700;
                  font-size: 14px;
                  color: #0b0b0b;
                "
              >
                View Enquiries
              </a>
          </div>

      <!-- generic image -->
      <img
        src=${logoYorkKarate}
        alt=""
        width="100%"
        style="display: block; border: none"
      />
    </div>
      <!-- Footer -->
      ${footer}
  </body>
</html>

    `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Email sent ${info.response}`);
        }
      });
    } else {
      console.log("ERROR: cant find member");
    }
  } else {
    console.log("No enquiries to respond to");
  }
});

export { emailEnquiryAdmin };
