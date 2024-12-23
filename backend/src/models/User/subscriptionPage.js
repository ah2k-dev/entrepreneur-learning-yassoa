const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionPageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SubscriptionPage = mongoose.model("SubscriptionPage", subscriptionPageSchema);
module.exports = SubscriptionPage;