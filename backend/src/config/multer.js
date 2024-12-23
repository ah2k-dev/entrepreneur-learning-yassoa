const multer = require("multer");
const path = require("path");
const fs = require("fs");

const TEMP_DIR = path.join(__dirname, "../../temp");
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TEMP_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
});

module.exports = {
  upload,
  TEMP_DIR,
  UPLOADS_DIR,
};
