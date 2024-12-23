const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCustomer = async (email) => {
  try {
    const customer = await stripe.customers.create({
      email,
    });
    return customer;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createStripeSubscription = async (
  customer,
  priceId,
  paymeentMethodId,
  metadata
) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ price: priceId }],
      default_payment_method: paymeentMethodId,
      metadata,
    });
    return subscription;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStripeSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error(error.message);
  }
};

const cancelStripeSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStripeProducts = async () => {
  try {
    // products with price information and recurring prices

    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addStripePaymentMethod = async (customer, paymentMethodId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer,
    });
    return paymentMethod;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStripePaymentMethods = async (customer) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer,
      type: "card",
    });
    return paymentMethods;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteStripePaymentMethod = async (paymentMethod) => {
  try {
    const deleted = await stripe.paymentMethods.detach(paymentMethod);
    return deleted;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCustomer,
  createStripeSubscription,
  getStripeSubscription,
  cancelStripeSubscription,
  getStripeProducts,
  addStripePaymentMethod,
  getStripePaymentMethods,
  deleteStripePaymentMethod,
};
