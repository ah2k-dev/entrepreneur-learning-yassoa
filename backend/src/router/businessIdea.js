const express = require("express");
const {
  isAuthenticated,
  isAdminOrEditor,
  checkStripeSubscription,
} = require("../middleware/auth");
const businessIdeaController = require("../controllers/businessIdeaController");
const router = express.Router();

router.post(
  "/addOrUpdate",
  isAuthenticated,
  isAdminOrEditor,
  businessIdeaController.createOrUpdateBusinessIdea
);

router.post(
  "/all",
  isAuthenticated,
  checkStripeSubscription,
  businessIdeaController.getBusinessIdeas
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdminOrEditor,
  businessIdeaController.deleteBusinessIdea
);

router.get(
  "/generate-download-token/:id",
  isAuthenticated,
  checkStripeSubscription,
  businessIdeaController.generateDownloadToken
)

// router.get(
//   "/download-doc/:id",
//   // isAuthenticated,
//   // checkStripeSubscription,
//   businessIdeaController.downloadDoc
// );

module.exports = router;
