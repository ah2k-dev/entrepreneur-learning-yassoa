const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ApiError = require("./utils/ApiError");
const app = express();
const {
  auth,
  podcast,
  businessIdea,
  course,
  uploader,
  subscription,
} = require("./router");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const path = require("path");
const ErrorHandler = require("./utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const user = require("./models/User/user");
const Payment = require("./models/User/payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/docs/:filename", (req, res, next) => {
//   try {
//     const { token } = req.query;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return ErrorHandler("Invalid token", 400, req, res);
//     }
//     next();
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// });
app.use("/docs", express.static(path.join(__dirname, "../docs")));
app.use(loggerMiddleware);

// stripe webhook
app.post(
  "/stripe-hook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("stripe webhook");
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case "invoice.payment_succeeded":
        console.log("invoice.payment_succeeded");

        const exUser = await user.findOne({
          email: event.data.object.customer_email,
        });
        if (exUser) {
          console.log("user: ", exUser);
          console.log("subscription: ", event.data.object.subscription_details);
          await Payment.create({
            user: exUser._id,
            amount: event.data.object.amount_due / 100,
            currency: event.data.object.currency,
            stripePlanId:
              event.data.object.subscription_details.metadata.planId,
            stripePlanType:
              event.data.object.subscription_details.metadata.planType,
            subscriptionId: event.data.object.subscription,
          });
          await user.findByIdAndUpdate(exUser._id, {
            stripeSubscriptionID: event.data.object.subscription,
            stripeSubscriptionProdID:
              event.data.object.subscription_details.metadata.prodId,
          });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return res.json({ received: true });
  }
);

app.use(express.json());

//routes
app.use("/api/auth", auth);
app.use("/api/podcast", podcast);
app.use("/api/businessIdea", businessIdea);
app.use("/api/course", course);
app.use("/api/uploader", uploader);
app.use("/api/subscription", subscription);

app.get("/api", async (req, res) => {
  // const options = {
  //   method: "GET",
  //   headers: {
  //     // expecting html
  //     Accept: "text/html",
  //   },
  // };
  // fetch("https://www.highspeedinternet.com/ny/new-york?zip=10005", options)
  //   .then((response) => {
  //     console.log(response);
  //     return response.text();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.send(err);
  //   });
  res.send("Welcome to Learning API");
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

module.exports = app;
