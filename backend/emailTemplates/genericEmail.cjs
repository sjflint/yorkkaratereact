const { footer, header, defaultImg } = require("./emailParams.cjs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config();

const genericEmail = asyncHandler(async (emailDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    auth: {
      user: "info@yorkkarate.net",
      pass: process.env.GMAIL_SECRET,
    },
  });

  // Is there an image to include in the email?
  let image = defaultImg;
  if (emailDetails.image) {
    image = emailDetails.image;
  }

  const sendEmail = (recipients) => {
    const mailOptions = {
      from: "info@yorkkarate.net",
      to: "no-reply@yorkkarate.net",
      bcc: recipients,
      subject: emailDetails.subject,
      text: emailDetails.subject,
      attachments: emailDetails.attachments,
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
      <table
        style="text-align: center; background-color: #f7f7f9; padding: 10px"
        role="presentation"
        cellspacing="0"
        width="100%"
      >
        <tr>
          <td style="text-align: left;">
            ${emailDetails.message}
          </td>
        </tr>
        <tr>
          <td>
            <div
              style="
                padding-bottom: 20px;
                margin-top: 20px;
                border-bottom: 2px solid #f57231;
              "
            >
              <a
                href='${emailDetails.link}'
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
                ${emailDetails.linkText}
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: left">
            <p>Regards</p>
            <p>York Karate Dojo</p>
          </td>
        </tr>
      </table>

      <!-- generic image -->
      <img
        src=${image}
        alt=""
        width="100%"
        style="display: block; border: none"
      />

      <!-- Footer -->
      ${footer}
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
  };

  // gmail email limits (100 per request). Check number of recipients and divide if needed
  const emailArray = emailDetails.recipientEmail;
  // remove blank email addresses
  const recipients = emailArray.filter((recipient) => recipient !== "");

  if (recipients.length > 100 && recipients.length < 200) {
    //if over 100 and less than 200
    // divide into two
    const firstArray = recipients.slice(0, recipients.length / 2);
    const secondArray = recipients.slice(recipients.length / 2);
    sendEmail(firstArray);
    sendEmail(secondArray);
  } else if (recipients.length > 200 && recipients.length < 300) {
    //if over 200 and less than 300
    // divide into 3
    const firstArray = recipients.slice(0, recipients.length / 3);
    const secondArray = recipients.slice(
      recipients.length / 3,
      recipients.length - recipients.length / 3
    );
    const thirdArray = recipients.slice(
      recipients.length - recipients.length / 3
    );
    sendEmail(firstArray);
    sendEmail(secondArray);
    sendEmail(thirdArray);
  } else if (recipients.length > 300 && recipients.length < 400) {
    //if over 300 and less than 400
    // divide into 4
    const firstArray = recipients.slice(0, recipients.length / 4);
    const secondArray = recipients.slice(
      recipients.length / 4,
      recipients.length - recipients.length / 2
    );
    const thirdArray = recipients.slice(
      recipients.length - recipients.length / 2,
      recipients.length - recipients.length / 4
    );
    const fourthArray = recipients.slice(
      recipients.length - recipients.length / 4
    );
    sendEmail(firstArray);
    sendEmail(secondArray);
    sendEmail(thirdArray);
    sendEmail(fourthArray);
  } else {
    // default and so less than 3. just send full array
    sendEmail(recipients);
  }
});

module.exports = { genericEmail };
