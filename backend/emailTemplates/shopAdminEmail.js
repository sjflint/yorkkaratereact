import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

dotenv.config();

const shopAdminEmail = asyncHandler(async (shopAdminEmails, ordersWaiting) => {
  let tableHTML = "";

  for (const order of ordersWaiting) {
    tableHTML = `${tableHTML} <tr>
            <td>order#:<br/> ${order._id}</td>
            <td>Created at:<br/> ${order.createdAt.toLocaleDateString()}</td>
            <td>
              <a
              href="http://localhost:3000/order/${order._id}"
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

export { shopAdminEmail };
