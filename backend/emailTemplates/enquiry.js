import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { defaultImg, footer, header } from "./emailParams.cjs";

dotenv.config();

const enquiryEmail = asyncHandler(async (emailDetails) => {
  const nameArray = emailDetails.recipientName.split(" ");

  // let firstName =
  // Format first name and last name to uppercase first letter and lower case for the rest
  const formatName = (name) => {
    const removeNoneAlpha = name.replace(/[^a-z0-9-\s]/gi, "");
    const nameLowerCase = removeNoneAlpha.toLowerCase().trim();
    return nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1);
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@yorkkarate.net",
      pass: process.env.GMAIL_SECRET,
    },
  });

  const mailOptions = {
    from: "info@yorkkarate.net",
    to: emailDetails.recipientEmail,
    subject: "Karate enquiry",
    text: "Thank you for your enquiry",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
    
      <body>
      ${header}
        <div style="max-width: 600px; margin: auto; background: white">
          <div style="padding: 10px">
            <h3>Thank you for contacting York Karate Dojo</h3>
            <p style="text-align: left">
              Dear ${formatName(nameArray[0])},<br /><br />
              Thank you for contacting York Karate Dojo. We will endeavour to
              respond to you within the next couple of days.
            </p>
            <p>
              If you are looking to book a trial session, you can do this through
              our website by clicking the link below:
            </p>
            <div
              style="
                padding-bottom: 20px;
                margin-top: 5px;
                border-bottom: 2px solid #f57231;
              "
            >
              <a href=${
                process.env.DOMAIN_LINK
              }/trialregistrationform target="_blank"
              style=" box-sizing: border-box; color: #ffffff; text-decoration: none;
              padding: 12px 18px; border-radius: 4px; border: solid 1px #0b0b0b;
              font-weight: 700; font-size: 14px; color: #0b0b0b; ">
              Register for a trial session</a>
            </div>
          </div>
        </div>
        <div style="text-align: center; max-width: 600px;">
          <img src="${defaultImg}" alt="" width="100%" />
        </div>
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
});

export { enquiryEmail };
