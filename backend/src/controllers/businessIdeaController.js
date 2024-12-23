const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const BusinessIdea = require("../models/BusinessIdea/businessIdea");
const { get } = require("mongoose");
const { downloadFile } = require("../utils/googleDrive");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config({ path: ".././src/config/config.env" });

const createOrUpdateBusinessIdea = async (req, res) => {
  try {
    const data = req.body;
    let businessIdea;
    if (req.body._id) {
      data.updatedBy = req.user._id;
      businessIdea = await BusinessIdea.findByIdAndUpdate(req.body._id, data, {
        new: true,
        runValidators: true,
      });
    } else {
      data.createdBy = req.user._id;
      data.updatedBy = req.user._id;
      businessIdea = await BusinessIdea.create(data);
    }
    return SuccessHandler(businessIdea, 201, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteBusinessIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const businessIdea = await BusinessIdea.findById(id);
    if (!businessIdea) {
      return ErrorHandler("Business Idea not found", 404, req, res);
    }
    if (
      req.user.role !== "admin" &&
      businessIdea.createdBy.toString() !== req.user._id.toString()
    ) {
      return ErrorHandler(
        "You are not authorized to delete this business idea",
        403,
        req,
        res
      );
    }
    await businessIdea.remove();
    return SuccessHandler("Business Idea deleted successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getBusinessIdeas = async (req, res) => {
  try {
    let businessIdeas;
    const filters = {};
    req.body.pays && (filters.pays = req.body.pays);
    req.body.type && (filters.type = req.body.type);
    req.body.niche && (filters.niche = req.body.niche);
    req.body.tarif && (filters.tarif = req.body.tarif);
    req.body.search &&
      (filters.title = { $regex: req.body.search, $options: "i" });
    if (req.user.role === "user" && !req.user.subscribed) {
      const freeBusinessIdeas = await BusinessIdea.find({
        ...{ ...filters, tarif: "Free" },
      }).select("+document");
      const paidBusinessIdeas = await BusinessIdea.find({
        tarif: "paid",
        ...{ ...filters, tarif: "Paid" },
      });
      businessIdeas = freeBusinessIdeas.concat(paidBusinessIdeas);
    } else {
      businessIdeas = await BusinessIdea.find({
        ...filters,
      }).select("+document");
    }
    return SuccessHandler(businessIdeas, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const generateDownloadToken = async (req, res) => {
  try {
    const { id } = req.params;
    const businessIdea = await BusinessIdea.findById(id).select("+document");
    if (!businessIdea) {
      return ErrorHandler("Business Idea not found", 404, req, res);
    }
    if (
      req.user.role === "user" &&
      !req.user.subscribed &&
      businessIdea.tarif === "paid"
    ) {
      return ErrorHandler(
        "You need to subscribe to download this document",
        403,
        req,
        res
      );
    }

    const token = jwt.sign({ _id: businessIdea._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    const docLink = businessIdea.document;
    const regex = /\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/;
    const match = docLink.match(regex);
    const fileId = match ? match[1] || match[2] : null;

    let { link, filePath, mimeType, stream } = await downloadFile(
      fileId
    );
    link =
      `https://yassoa-production.up.railway.app` + link + `?token=${token}`;


    SuccessHandler(
      {
        link,
        url: `https://docs.google.com/gview?embedded=true&url=${link}`,
        message:
          "Link will be expired in 10 min. Please make a copy or download again",
      },
      200,
      res
    );

    setTimeout(() => {
      fs.unlinkSync(filePath);
    }, 600000);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const downloadDoc = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const decoded = jwt.verify(id, process.env.JWT_SECRET);
//     if (!decoded) {
//       return ErrorHandler("Invalid token", 400, req, res);
//     }
//     const businessIdea = await BusinessIdea.findById(decoded._id).select(
//       "+document"
//     );
//     if (!businessIdea) {
//       return ErrorHandler("Business Idea not found", 404, req, res);
//     }

//     const link = businessIdea.document;
//     const regex = /\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/;
//     const match = link.match(regex);
//     const fileId = match ? match[1] || match[2] : null;

//     const { stream, filename, mimeType } = await downloadFile(fileId);
//     res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
//     res.setHeader("Content-Type", mimeType);
//     stream.pipe(res);
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

module.exports = {
  createOrUpdateBusinessIdea,
  deleteBusinessIdea,
  getBusinessIdeas,
  // downloadDoc,
  generateDownloadToken,
};
