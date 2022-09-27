import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Enquiry from "../models/enquiryModel.js";
import Member from "../models/memberModel.cjs";

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

      // Is there an image to include in the email?
      let image = "logo2021a.png";

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
    <div id="email" style="width: 600px">
      <!-- Header -->
      <table role="presentation" cellspacing="0" width="100%">
        <tr>
          <td>
            <div
              style="
                padding: 10px 0 10px 0;
                max-width: 600px;
                margin: 20px auto 0 auto;
                background: black;
                text-align: center;
              "
            >
              <img
                src="https://www.yorkkarate.net/img/newlogov1.2.png"
                width="150"
              />
            </div>
          </td>
        </tr>
      </table>

      <!-- Body -->
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
                href='http://localhost:3000/admin/emailmembers'
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
                  background-color: #0b0b0b;
                "
              >
                View Enquiries
              </a>
            </div>

      <!-- generic image -->
      <img
        src=${image}
        alt=""
        width="100%"
        style="display: block; border: none"
      />

      <!-- Footer -->
      <table role="presentation" cellspacing="0" width="100%">
        <tr>
          <td>
            <div
              style="
                max-width: 600px;
                margin: 0 auto 20px auto;
                padding: 10px 0 10px 0;
                text-align: center;
                color: #fff;
                background: black;
                text-decoration: none;
              "
            >
              <h4>info@yorkkarate.net | 07814545013 | www.yorkkarate.net</h4>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div
              style="
                max-width: 600px;
                text-align: center;
                margin: 0 auto 20px auto;
                padding: 10px 0 10px 0;
              "
            >
              <img
                src="https://www.yorkkarate.net/img/logojksengland.png"
                alt=""
                width="80px"
                style="margin: 0 10px 0 10px"
              />
              <img
                src="https://www.yorkkarate.net/img/logowkf.png"
                alt=""
                width="80px"
                style="margin: 0 10px 0 10px"
              />
              <img
                src="https://www.yorkkarate.net/img/logoekf.png"
                alt=""
                width="80px"
                style="margin: 0 10px 0 10px"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
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
