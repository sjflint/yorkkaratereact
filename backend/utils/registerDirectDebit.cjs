const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");
const dotenv = require("dotenv");

dotenv.config();

const client = gocardless(
  process.env.GoCardlessAccessToken,
  constants.Environments.Sandbox
);

const createDirectDebit = async (member, session_token) => {
  let redirectFlow = await client.redirectFlows.create({
    description: "New Member",
    session_token: session_token,
    success_redirect_url: "http://localhost:3000/completeddsetup",
    prefilled_customer: {
      given_name: member.firstName,
      family_name: member.lastName,
      email: member.email,
      address_line1: member.addressLine1,
      city: member.addressLine4,
      postal_code: member.postCode,
    },
  });

  return redirectFlow.id;
};

const changeDirectDebit = async (session_token) => {
  let redirectFlow = await client.redirectFlows.create({
    description: "Update Direct Debit",
    session_token: session_token,
    success_redirect_url: "http://localhost:3000/completeupdatedd",
  });

  return redirectFlow.id;
};

module.exports = {
  createDirectDebit,
  changeDirectDebit,
};
