const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config({ path: ".././src/config/config.env" });
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    phone: {
      type: String,
      reuired: true,
      unique: true,
    },
    haveBusiness: {
      type: Boolean,
      required: false,
    },
    password: {
      type: String,
      required: true,
      //validation will be before saving to db
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
    },
    profileImage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: Number,
    },
    emailVerificationTokenExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: Number,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    zip: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    stripeCustomerID: {
      type: String,
    },
    stripeSubscriptionID: {
      type: String,
    },
    stripeSubscriptionProdID: {
      type: String,
    },
    type: {
      type: String,
    },
    niche: {
      type: String,
    },
    employees: {
      type: String,
    },
    businessType: {
      type: String,
    },
    reference: {
      type: String,
    },
  },
  { timestamps: true }
);

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//jwtToken
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const user = mongoose.model("user", userSchema);

module.exports = user;
