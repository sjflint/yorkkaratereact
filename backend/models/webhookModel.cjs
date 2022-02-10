const mongoose = require("mongoose");

const webhookSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  created_at: { type: Date, required: true },
  resource_type: { type: String, required: true },
  action: { type: String, required: true },
  links: { type: Object },
  details: { type: Object },
});

const Webhook = (module.exports = mongoose.model("Webhook", webhookSchema));
