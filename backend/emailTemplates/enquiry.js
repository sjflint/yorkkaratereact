import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

dotenv.config();

const enquiryEmail = asyncHandler(async (emailDetails) => {
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
    <div
      style="
        padding: 10px 0 10px 0;
        max-width: 600px;
        margin: 20px auto 0 auto;
        background: black;
        text-align: center;
      "
    >
      <img src="https://www.yorkkarate.net/img/newlogov1.2.png" width="150" />
    </div>
    <div style="max-width: 600px; margin: auto; background: white">
      <div style="padding: 10px">
        <h3>Thank you for contacting York Karate Dojo</h3>
        <p style="text-align: left">
          Dear ${emailDetails.recipientName},<br /><br />
          Thank you for contacting York Karate Dojo. We will endeavour to
          respond to you within the next couple of days.
        </p>
        <p>
          If you are looking to book a trial session, you can do this through
          our website by clicking the link below:
        </p>
        <div style="padding-bottom: 20px; margin-top: 5px; border-bottom: 2px solid #f57231">
          <a
            href="https://www.yorkkarate.net/trialregistration"
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
            Register for a trial session
          </a>
        </div>
      </div>
    </div>
    <div style="text-align: center; max-width: 600px; margin: auto">
      <img
        src="https://www.yorkkarate.net/img/showcase.png"
        alt=""
        width="600"
      />
    </div>
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
    <div style="
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
    style="
    margin: 0 10px 0 10px
    "  
  />
    <img
    src="https://www.yorkkarate.net/img/logowkf.png"
    alt=""   
    width="80px"
    style="
    margin: 0 10px 0 10px
    "  
  />
    <img
    src="https://www.yorkkarate.net/img/logoekf.png"
    alt=""   
    width="80px"
    style="
    margin: 0 10px 0 10px
    "  
  />
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
});

export { enquiryEmail };
