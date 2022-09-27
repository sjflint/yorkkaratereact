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
      let image = "logo2021a.png";
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
        console.log(image);
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
        to: emailDetails.recipientEmail,
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
          href="http://localhost:3000/profile?key=second"
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
    console.log("ERROR: cant find order info");
  }
});

module.exports = { orderEmail };
