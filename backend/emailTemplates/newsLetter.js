import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.cjs";
import Article from "../models/articleModel.cjs";
import Member from "../models/memberModel.cjs";
import { footer, header } from "./emailParams.cjs";

dotenv.config();

// today's date
const date = new Date();

const newsLetterEmail = asyncHandler(async () => {
  // Get recipients
  let recipients = "";
  const members = await Member.find({ ddsuccess: true });

  if (members) {
    members.forEach((member) => {
      recipients = `${recipients};${member.email}`;
    });
  }
  // Get upcoming events
  const events = await Event.find({}).sort({ dateOfEvent: 1 });
  const today = Date.parse(new Date());

  const filteredEvents = events.filter((event) => {
    const eventDate = Date.parse(event.dateOfEvent);
    return eventDate > today;
  });

  let eventsHTML = "";
  for (let i = 0; i < 4; i++) {
    if (filteredEvents[i]) {
      const image = filteredEvents[i].image;
      eventsHTML = `${eventsHTML} 
      <tr>
        <td>
          <img
            src=${image}
            alt=""
            width=150px
            style="padding: 10px"
          />
        </td>
        <td style="width: 400px">
          <h4>
             ${filteredEvents[i].title}
          </h4>
          <small>
            ${filteredEvents[i].dateOfEvent.toLocaleDateString()}
          </small>
          <p>
            ${filteredEvents[i].location}
          </p>
                
          <div style="padding-bottom: 20px; margin-top: 20px">
            <a
              href="${process.env.DOMAIN_LINK}/event/${filteredEvents[i]._id}"
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
              View...
            </a>
          </div>
          <div style="border-bottom: 2px solid #f57231"></div>
        </td>
      </tr>`;
    }
  }

  // Get recent news articles
  const articles = await Article.find({}).sort({ dateCreated: -1 });

  let articleHTML = "";
  for (let i = 0; i < 4; i++) {
    if (articles[i]) {
      const image = articles[i].carouselImages[0].original;
      articleHTML = `${articleHTML}
    <tr>
      <td>
        <img
          src=${image}
          alt=""
          width=150px
          style="padding: 10px"
        />
      </td>
      
      <td style="width='400px">
        <h4>
          ${articles[i].title}
        </h4>
        <small>
        ${articles[i].dateCreated.toLocaleDateString()}
        </small>
        <p style="text-align: left;">
        ${articles[i].leader}
        </p>
    
        <div
          style="
          padding-bottom: 20px;
          margin-top: 20px;
          border-bottom: 2px solid #f57231;
         "
         >
          <a
            href="${process.env.DOMAIN_LINK}/article/${articles[i]._id}"
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
            Read...
          </a>
        </div>
      </td>   
    </tr>  
    `;
    }
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
    to: recipients,
    subject: "York Karate News",
    text: "All the latest news from York Karate Dojo",
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
          <h3 style="text-align: center">
            York Karate Dojo News (${date.toLocaleDateString()})
          </h3>
          <h4
          style="
            text-align: left;
            background-color: #000;
            color: #fff;
            padding: 20px;
            margin-bottom: 0;
          "
        >
          What's coming up soon?
        </h4>
    
          <!-- Events -->
          <table
            style="text-align: center; background-color: #f7f7f9; padding: 10px"
            role="presentation"
            cellspacing="0"
            width="100%"
          >
            ${eventsHTML}
          </table>
    
          <!-- News -->
          <h4
            style="
              text-align: left;
              background-color: #000;
              color: #fff;
              padding: 20px;
              margin-bottom: 0;
            "
          >
            See the latest news and articles:
          </h4>
          <table
            style="text-align: center; background-color: #f7f7f9; padding: 10px"
            role="presentation"
            cellspacing="0"
            width="100%"
          >
          ${articleHTML}
          </table>
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
});

export { newsLetterEmail };