const jwt = require("jsonwebtoken");
const User = require("../models/User/user");
const dotenv = require("dotenv");
const { getStripeSubscription } = require("../utils/stripe");

dotenv.config({ path: ".././src/config/config.env" });

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Token incorrect" });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const isEditor = async (req, res, next) => {
  try {
    if (req.user.role !== "editor") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const isAdminOrEditor = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "editor") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkStripeSubscription = async (req, res, next) => {
  try {
    if (!req.user.role === "user") {
      next();
    }
    if (!req.user.stripeSubscriptionID) {
      req.user.subscribed = false;
      next();
    } else {
      const subscription = await getStripeSubscription(
        req.user.stripeSubscriptionID
      );
      if (!subscription || subscription.status !== "active") {
        req.user.subscribed = false;
        next();
      }
      req.user.subscribed = true;
      const permissions = [];
      if(subscription.items.data[0].price.product === process.env.STRIPE_PREMIUM_PRODUCT){
        permissions.push("premium");
      } else if(subscription.items.data[0].price.product === process.env.STRIPE_STARTER_PRODUCT){
        permissions.push("starter");
      }
      next();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isEditor,
  isAdminOrEditor,
  checkStripeSubscription,
};
