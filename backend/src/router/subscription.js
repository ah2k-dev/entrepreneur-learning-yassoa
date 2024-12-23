const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/plans", subscriptionController.getPlans);

router.post(
  "/subscribe",
  isAuthenticated,
  subscriptionController.createSubscription
);
router.get(
  "/getSubscriptions",
  isAuthenticated,
  subscriptionController.getSubscription
);
router.delete(
  "/unsubscribe",
  isAuthenticated,
  subscriptionController.cancelSubscription
);

router.post(
  "/addPaymentMethod",
  isAuthenticated,
  subscriptionController.addPaymentMethod
);
router.get(
  "/getPaymentMethods",
  isAuthenticated,
  subscriptionController.getPaymentMethods
);
router.post(
  "/deletePaymentMethod",
  isAuthenticated,
  subscriptionController.deletePaymentMethod
);

module.exports = router;
