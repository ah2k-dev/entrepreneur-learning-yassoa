const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const { TEMP_DIR, UPLOADS_DIR } = require("../config/multer");
const fs = require("fs");
const path = require("path");

const uploadFileInChunks = async (req, res) => {
  try {
    const { chunkIndex, totalChunks, fileName, key } = req.body;
    const chunkPath = req.file.path;
    const finalPath = path.join(UPLOADS_DIR, fileName);

    // append chunk to final file
    const writeStream = fs.createWriteStream(finalPath, {
      flags: chunkIndex === 0 ? "w" : "a",
    });
    const readStream = fs.createReadStream(chunkPath);
    readStream.pipe(writeStream);

    readStream.on("end", () => {
      fs.unlinkSync(chunkPath);
      if (parseInt(chunkIndex, 10) + 1 === parseInt(totalChunks, 10)) {
        const link = `/uploads/${fileName}`;
        return SuccessHandler(
          { message: "File uploaded successfully", link },
          200,
          res
        );
      } else {
        const link = `/uploads/${fileName}`;
        return SuccessHandler(
          { message: "Chunk uploaded successfully", link },
          200,
          res
        );
      }
    });

    writeStream.on("error", (error) => {
      return ErrorHandler(error.message, 500, req, res);
    });

    readStream.on("error", (error) => {
      return ErrorHandler(error.message, 500, req, res);
    });
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  uploadFileInChunks,
};
