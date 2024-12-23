const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const KEYFILEPATH = path.join(
  __dirname,
  "../config/learning-app-drive-d9ee75c0ea44.json"
);
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const downloadFile = async (fileId) => {
  try {
    const drive = google.drive({ version: "v3", auth });

    // First, identify the file type
    const fileMetadata = await drive.files.get({ fileId });
    console.log(fileMetadata);
    const mimeType = fileMetadata.data.mimeType;
    console.log(mimeType);
    let fileData;
    if (mimeType.includes("application/vnd.google-apps")) {
      console.log("Exporting file...");
      fileData = await drive.files.export(
        { fileId, mimeType: "application/pdf" },
        { responseType: "stream" }
      );
    } else {
      console.log("Downloading file...");
      fileData = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" }
      );
    }

    const filePath = path.join(
      __dirname,
      `../../docs/${fileMetadata.data.name}`
    );
    // const dest = fs.createWriteStream(filePath);
    // fileData.data.pipe(dest).on("finish", () => {
    //   console.log("File downloaded!");
    // });
    await saveFile(filePath, fileData.data);
    const link = `/docs/${fileMetadata.data.name}`;

    return {
      stream: fileData.data,
      filename: fileMetadata.data.name,
      mimeType,
      link,
      filePath,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const saveFile = async (filePath, data) => {
  console.log("Saving file...");
  console.log(filePath, data);
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    data.pipe(file).on("finish", () => {
      resolve();
    });
  })
};

module.exports = {
  downloadFile,
};
