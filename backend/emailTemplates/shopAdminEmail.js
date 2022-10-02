import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { defaultImg, footer, header } from "./emailParams.cjs";

dotenv.config();

const shopAdminEmail = asyncHandler(async (shopAdminEmails, ordersWaiting) => {
  let tableHTML = "";

  for (const order of ordersWaiting) {
    tableHTML = `${tableHTML} <tr>
            <td>order#:<br/> ${order._id}</td>
            <td>Created at:<br/> ${order.createdAt.toLocaleDateString()}</td>
            <td>
              <a
              href="${process.env.DOMAIN_LINK}/order/${order._id}"
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
                margin: 0 auto 0 auto;
                display: block;
                width: 50%;
                text-align: center;
              "
            >
              View Order
              </a>
            </td>
          </tr>`;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@yorkkarate.net",
      pass: process.env.GMAIL_SECRET,
    },
  });

  const mailOptions = {
    from: "info@yorkkarate.net",
    to: shopAdminEmails,
    subject: "Shop orders waiting",
    text: "Shop orders waiting to be fulfilled",
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
        <h3>Current Orders waiting to be fulfilled</h3>
        <table
        style="text-align: center; background-color: #f7f7f9; padding: 10px"
        role="presentation"
        cellspacing="0"
        width="100%"
      >
          ${tableHTML}
        </table>
      </div>
    </div>
    <div style="text-align: center; max-width: 600px; margin: auto">
      <img
        src=${defaultImg}
        alt=""
        width="600"
      />
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

export { shopAdminEmail };
