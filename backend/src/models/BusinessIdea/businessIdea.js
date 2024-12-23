const mongoose = require("mongoose");

const businessIdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tarif: {
      type: String,
      enum: ["Free", "Paid"],
      required: true,
    },
    pays: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    niche: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    idIdea: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BusinessIdea = mongoose.model("BusinessIdea", businessIdeaSchema);
module.exports = BusinessIdea;
