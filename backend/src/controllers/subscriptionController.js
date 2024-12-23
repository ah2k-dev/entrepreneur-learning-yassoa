const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  createStripeSubscription,
  getStripeSubscription,
  cancelStripeSubscription,
  addStripePaymentMethod,
  getStripePaymentMethods,
  deleteStripePaymentMethod,
  getStripeProducts,
} = require("../utils/stripe");
const User = require("../models/User/user");
const Payment = require("../models/User/payment");

const addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const paymentMethod = await addStripePaymentMethod(
      req.user.stripeCustomerID,
      paymentMethodId
    );
    if (!paymentMethod) {
      return ErrorHandler("Payment method not added", 400, req, res);
    }
    return SuccessHandler(paymentMethod, 201, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await getStripePaymentMethods(
      req.user.stripeCustomerID
    );
    return SuccessHandler(paymentMethods, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const paymentMethod = await deleteStripePaymentMethod(
      //   req.user.stripeCustomerID,
      paymentMethodId
    );
    if (!paymentMethod) {
      return ErrorHandler("Payment method not deleted", 400, req, res);
    }
    return SuccessHandler(paymentMethod, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const createSubscription = async (req, res) => {
  try {
    const { planId, paymentMethodId, planType, prodId } = req.body;
    if (req.user.stripeSubscriptionID) {
      const exSubscription = await getStripeSubscription(
        req.user.stripeSubscriptionID
      );
      if (exSubscription && exSubscription.status === "active") {
        return ErrorHandler("You already have a subscription", 400, req, res);
      }
    }
    const subscription = await createStripeSubscription(
      req.user.stripeCustomerID,
      planId,
      paymentMethodId,
      {
        planType: planType,
        planId: planId,
        prodId: prodId,
      }
    );
    if (!subscription) {
      return ErrorHandler("Subscription not created", 400, req, res);
    }
    // await Payment.create({
    //   user: req.user._id,
    //   amount: subscription.items.data[0].price.unit_amount / 100,
    //   subscriptionId: subscription.id,
    //   stripePlanType: planType,
    //   stripePlanId: planId,
    //   currency: subscription.items.data[0].price.currency,
    // });
    // await User.findByIdAndUpdate(req.user._id, {
    //   stripeSubscriptionID: subscription.id,
    //   stripeSubscriptionProdID: prodId,
    // });
    return SuccessHandler(subscription, 201, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const cancelSubscription = async (req, res) => {
  try {
    if (!req.user.stripeSubscriptionID) {
      return ErrorHandler("No subscription found", 404, req, res);
    }
    const exSubscription = await getStripeSubscription(
      req.user.stripeSubscriptionID
    );
    if (!exSubscription || exSubscription.status !== "active") {
      return ErrorHandler("Subscription not found", 404, req, res);
    }
    const subscription = await cancelStripeSubscription(
      req.user.stripeSubscriptionID
    );
    await User.findByIdAndUpdate(req.user._id, {
      stripeSubscriptionID: null,
    });
    return SuccessHandler(subscription, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const getSubscription = async (req, res) => {
  try {
    if (!req.user.stripeSubscriptionID) {
      return ErrorHandler("No subscription found", 404, req, res);
    }

    const subscription = await getStripeSubscription(
      req.user.stripeSubscriptionID
    );
    if (!subscription) {
      return ErrorHandler("Subscription not found", 404, req, res);
    }
    return SuccessHandler(subscription, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getPlans = async (req, res) => {
  try {
    const products = await getStripeProducts();
    return SuccessHandler(products, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createSubscription,
  cancelSubscription,
  getSubscription,
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  getPlans,
};
