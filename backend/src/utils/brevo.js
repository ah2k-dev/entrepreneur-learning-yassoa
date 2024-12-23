const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({
  path: "./src/config/config.env",
});

const createOrUpdateBrevoContact = async ({ email, attributes }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const contactData = {
    email: email,
    attributes: attributes,
    // attributes: {
    //     FIRSTNAME: 'John',
    //     LASTNAME: 'Doe',
    //     SMS: '919876543210'
    // },
    listIds: [2],
    updateEnabled: true,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/contacts",
      contactData,
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Contact created or updated successfully:", response.data);
  } catch (error) {
    console.error(
      "Error creating or updating contact:",
      error.response ? error.response.data : error.message
    );
  }
};

const sendTransactionalEmail = async ({ email, subject, body }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const emailData = {
    from: "contact@ah2k.dev",
    to: email,
    subject: subject,
    body: body,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/emails",
      emailData,
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = {
  createOrUpdateBrevoContact,
};
