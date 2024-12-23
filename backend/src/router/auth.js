const express = require("express");
const auth = require("../controllers/authController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();

//get
router.route("/logout").get(auth.logout);
router.route("/me").get(isAuthenticated, auth.me);
router.route("/users").get(isAuthenticated, isAdmin, auth.getUsers);
//post
router.route("/checkUser").post(auth.checkUser);
router.route("/register").post(auth.register);
router.route("/login").post(auth.login);
router.route("/requestEmailToken").post(auth.requestEmailToken);
router.route("/verifyEmail").post(auth.verifyEmail);
router.route("/forgotPassword").post(auth.forgotPassword);
//put
router.route("/resetPassword").put(auth.resetPassword);
router.route("/updatePassword").put(isAuthenticated, auth.updatePassword);
router.route("/updateMe").put(isAuthenticated, auth.updateMe);

// editor management
router.post("/addEditor", isAuthenticated, isAdmin, auth.addEditor);
router.delete(
  "/blockEditor",
  isAuthenticated,
  isAdmin,
  auth.blockUnblockEditor
);
router.get("/getEditors", isAuthenticated, isAdmin, auth.getEditors);
router.put("/updateEditor", isAuthenticated, isAdmin, auth.updateEditor);
router.get("/my-invoices", isAuthenticated, auth.myInvoices);

// single dashboard api k liye alag se route nh bana raha hu, wahi isme hi dal dunga
router.get("/dashboard", isAuthenticated, isAdmin, auth.dashboard);

// admin management
router.post("/update-subscription-page", isAuthenticated, isAdmin, auth.updateSubscriptionPage);
router.get("/get-subscription-page", isAuthenticated, auth.getSubscriptionPage);

module.exports = router;
