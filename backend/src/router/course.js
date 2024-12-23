const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const {
  isAuthenticated,
  isAdminOrEditor,
  checkStripeSubscription,
} = require("../middleware/auth");

router.post(
  "/add",
  isAuthenticated,
  isAdminOrEditor,
  courseController.createCourse
);

router.get(
  "/all",
  isAuthenticated,
  checkStripeSubscription,
  courseController.getCourses
);

router.get(
  "/single/:id",
  isAuthenticated,
  checkStripeSubscription,
  courseController.getCourse
);

router.put(
  "/update/:id",
  isAuthenticated,
  isAdminOrEditor,
  courseController.updateCourse
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdminOrEditor,
  courseController.deleteCourse
);

module.exports = router;
