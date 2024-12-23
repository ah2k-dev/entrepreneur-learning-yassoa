const express = require("express");
const router = express.Router();
const podcastController = require("../controllers/podcastController");
const {
  isAuthenticated,
  isAdminOrEditor,
  checkStripeSubscription,
} = require("../middleware/auth");

router.post(
  "/addOrUpdate",
  isAuthenticated,
  isAdminOrEditor,
  podcastController.createOrUpdatePodcast
);

router.patch(
  "/publish/:id",
  isAuthenticated,
  isAdminOrEditor,
  podcastController.publishPodcast
);

router.post(
  "/all",
  isAuthenticated,
  checkStripeSubscription,
  podcastController.getPodcasts
);
router.get(
  "/single/:id",
  isAuthenticated,
  checkStripeSubscription,
  podcastController.getPodcast
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdminOrEditor,
  podcastController.deletePodcast
);

router.patch(
  "/watch/:id",
  isAuthenticated,
  // checkStripeSubscription,
  podcastController.watchCount
);
module.exports = router;
