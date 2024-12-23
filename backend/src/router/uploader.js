const express = require("express");
const router = express.Router();
const uploader = require("../controllers/uploaderController");
const { isAuthenticated, isAdminOrEditor } = require("../middleware/auth");
const { upload } = require("../config/multer");

// router.post("/upload-chunk", (req, res) => {
//   console.log("upload-chunk");
// });
router.post("/upload-chunk", upload.single("file"), uploader.uploadFileInChunks);

module.exports = router;
