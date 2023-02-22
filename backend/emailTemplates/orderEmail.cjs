const { header, defaultImg, footer } = require("./emailParams.cjs");

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.cjs");
const Member = require("../models/memberModel.cjs");

dotenv.config();

const orderEmail = asyncHandler(async (emailDetails, orderId) => {
  const order = await Order.findById(orderId);
  if (order) {
    const member = await Member.findById(order.member);
    if (member) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "info@yorkkarate.net",
          pass: process.env.GMAIL_SECRET,
        },
      });

      // Is there an image to include in the email?
      let image = defaultImg;
      if (emailDetails.image) {
        const emailImage = emailDetails.image;
        image = emailImage;
      }

      // create order html
      let orderHTML = "";
      const orderItems = order.orderItems;
      const totalPrice = order.totalPrice.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
      });
      let paymentStatus = "unpaid";
      if (paymentStatus === true) {
        paymentStatus = "paid";
      }
      orderItems.forEach((item) => {
        const image = item.image;
        const itemPrice = item.price.toLocaleString("en-GB", {
          style: "currency",
          currency: "GBP",
        });

        orderHTML = `${orderHTML}
    <tr>
    <td>
      <img
        src=${image}
        alt=""
        width="100"
      />
    </td>
    <td>${item.name}</td>
    <td>Qty: ${item.qty}</td>
    <td>Total: ${itemPrice}</td>
  </tr>
    `;
      });

      const mailOptions = {
        from: "info@yorkkarate.net",
        to: `${member.email}; ${member.secondaryEmail};`,
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
    <div id="email" style="width: 600px">    
  <!-- Body -->
      <h4
      style="
        text-align: left;
        padding: 10px;
        margin: 0;
        background-color: #f7f7f9;
      "
    >
      Thank you for placing your order with York Karate (order number: ${
        order._id
      }).
    </h4>
    <table
      style="text-align: center; background-color: #f7f7f9; padding: 10px"
      role="presentation"
      cellspacing="0"
      width="100%"
    >
    ${orderHTML}
    </table>

    <div style="background-color: #f7f7f9; padding: 10px">
      <h4 style="text-decoration: underline">SUMMARY</h4>
      <p>Items Total: ${totalPrice}</p>
      <p>Payment Method: ${order.paymentMethod}</p>
      <p>Payment Status: ${order.isPaid === "pending" ? "Pending" : "Paid"}</p>
      <div
        style="
          padding-bottom: 20px;
          margin-top: 20px;
          border-bottom: 2px solid #f57231;
        "
      >
        <a
          href="${process.env.DOMAIN_LINK}/profile?key=second"
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
      </div>

      <p>Regards</p>
      <p>York Karate Dojo</p>
    </div>

      <!-- generic image -->
      <img
        src=${image}
        alt=""
        width="100%"
        style="display: block; border: none"
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
    } else {
      console.log("ERROR: cant find member");
    }
  } else {
    console.log("ERROR: cant find order info");
  }
});

module.exports = { orderEmail };
