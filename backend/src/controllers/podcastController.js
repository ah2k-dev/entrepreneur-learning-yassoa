const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Podcast = require("../models/Podcasts/podcast");

const createOrUpdatePodcast = async (req, res) => {
  // #swagger.tags = ['Podcast']
  try {
    const data = req.body;
    if (req.body.published) {
      return ErrorHandler(
        "Cannot publish podcast. Please use publish api",
        400,
        req,
        res
      );
    }
    if (req.body._id) {
      data.updatedBy = req.user._id;
      const podcast = await Podcast.findByIdAndUpdate(req.body._id, data, {
        new: true,
        runValidators: true,
      });

      return SuccessHandler(podcast, 200, res);
    } else {
      data.createdBy = req.user._id;
      data.updatedBy = req.user._id;
      const podcast = await Podcast.create(data);
      return SuccessHandler(podcast, 201, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const publishPodcast = async (req, res) => {
  // #swagger.tags = ['Podcast']
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    // check if all fields are filled
    if (!podcast) {
      return ErrorHandler("Podcast not found", 404, req, res);
    }
    // if (podcast.published) {
    //   return ErrorHandler("Podcast already published", 400, req, res);
    // }
    if (
      !podcast.section1 ||
      !podcast.section1.title ||
      podcast.section1?.title === "" ||
      !podcast.section1.content ||
      podcast.section1?.content === "" ||
      !podcast.section1.image ||
      podcast.section1?.image === ""
    ) {
      return ErrorHandler("Section 1 has missing fields", 400, req, res);
    }
    if (
      !podcast.section2 ||
      !podcast.section2.title ||
      podcast.section2?.title === "" ||
      !podcast.section2.content ||
      podcast.section2?.content === "" ||
      !podcast.section2.image ||
      podcast.section2?.image === ""
    ) {
      return ErrorHandler("Section 2 has missing fields", 400, req, res);
    }
    if (
      !podcast.section3 ||
      !podcast.section3.title ||
      podcast.section3?.title === "" ||
      !podcast.section3.content ||
      podcast.section3?.content === "" ||
      !podcast.section3.image ||
      podcast.section3?.image === ""
    ) {
      return ErrorHandler("Section 3 has missing fields", 400, req, res);
    }
    if (
      !podcast.section4 ||
      !podcast.section4.title ||
      podcast.section4?.title === "" ||
      !podcast.section4.content ||
      podcast.section4?.content === "" ||
      !podcast.section4.image ||
      podcast.section4?.image === ""
    ) {
      return ErrorHandler("Section 4 has missing fields", 400, req, res);
    }
    if (
      !podcast.section5 ||
      !podcast.section5.title ||
      podcast.section5?.title === "" ||
      !podcast.section5.content ||
      podcast.section5?.content === "" ||
      !podcast.section5.image ||
      podcast.section5?.image === ""
    ) {
      return ErrorHandler("Section 5 has missing fields", 400, req, res);
    }
    if (
      !podcast.section6 ||
      !podcast.section6.title ||
      podcast.section6?.title === "" ||
      !podcast.section6.content ||
      podcast.section6?.content === "" ||
      !podcast.section6.image ||
      podcast.section6?.image === ""
    ) {
      return ErrorHandler("Section 6 has missing fields", 400, req, res);
    }

    if (req.user.role == "editor") {
      if (podcast.createdBy.toString() !== req.user._id.toString()) {
        return ErrorHandler(
          "The podcast was not created by you",
          400,
          req,
          res
        );
      }
    }

    if (podcast.publishedAt) {
      podcast.publishedAt = Date.now();
    }
    podcast.published = !podcast.published;
    await podcast.save();

    return SuccessHandler(podcast, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getPodcasts = async (req, res) => {
  // #swagger.tags = ['Podcast']
  try {
    let podcasts;
    const filters = {};
    const sort = {};
    req.body.type ? (filters.type = req.body.type) : null;
    req.body.niche ? (filters.niche = req.body.niche) : null;
    req.body.periodicity ? (filters.periodicity = req.body.periodicity) : null;
    req.body.revenueFrom
      ? (filters.revenueFrom = {
          $gte: parseInt(req.body.revenueFrom),
        })
      : null;
    req.body.revenueTo
      ? (filters.revenueTo = {
          $lte: parseInt(req.body.revenueTo),
        })
      : null;
    req.body.au_departTo
      ? (filters.au_departTo = parseInt(req.body.au_departTo))
      : null;
    req.body.au_departFrom
      ? (filters.au_departFrom = parseInt(req.body.au_departFrom))
      : null;
    req.body.employeesTo
      ? (filters.employeesTo = parseInt(req.body.employeesTo))
      : null;
    req.body.employeesFrom
      ? (filters.employeesFrom = parseInt(req.body.employeesFrom))
      : null;

    req.body.search
      ? (filters.title = { $regex: req.body.search, $options: "i" })
      : null;

    req.body.sortBy
      ? (sort[req.body.sortBy] = req.body.sortValue == "asc" ? 1 : -1)
      : (sort.createdAt = -1);

    if (req.user?.role == "admin" || req.user?.role == "editor") {
      podcasts = await Podcast.find({
        ...filters,
      })
        .sort(sort)
        .select("+podcast");
    } else if (req.user?.role == "user" && req.user?.subscribed) {
      // subscriber work later
      podcasts = await Podcast.find({ published: true, ...filters })
        .select("+podcast")
        .sort(sort);
    } else {
      const unlockedPodcast = await Podcast.findOne({
        ...filters,
        published: true,
        locked: false,
      }).select("+podcast");
      const lockedPodcasts = await Podcast.find({
        published: true,
        locked: true,
        ...filters,
      }).sort(sort);
      podcasts = unlockedPodcast
        ? [unlockedPodcast, ...lockedPodcasts]
        : [...lockedPodcasts];
    }

    return SuccessHandler(podcasts, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getPodcast = async (req, res) => {
  // #swagger.tags = ['Podcast']
  try {
    const { id } = req.params;
    let podcast;
    if (req.user.role == "user" && !req.user.subscribed) {
      podcast = await Podcast.findById(id).select("+podcast");
      if (podcast.locked) {
        podcast = {
          ...podcast._doc,
          podcast: null,
        };
      }
    } else {
      podcast = await Podcast.findById(id).select("+podcast");
    }
    if (!podcast) {
      return ErrorHandler("Podcast not found", 404, req, res);
    }
    if (podcast.published === false && req.user.role === "user") {
      return ErrorHandler("Podcast not found", 404, req, res);
    }
    return SuccessHandler(podcast, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deletePodcast = async (req, res) => {
  // #swagger.tags = ['Podcast']
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return ErrorHandler("Podcast not found", 404, req, res);
    }
    if (req.user.role == "editor") {
      if (podcast.createdBy.toString() !== req.user._id.toString()) {
        return ErrorHandler(
          "You are not authorized to delete this podcast",
          400,
          req,
          res
        );
      }
    }
    await podcast.remove();
    return SuccessHandler("Podcast deleted successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const watchCount = async (req, res) => {
  // #swagger.tags = ['Podcast']
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return ErrorHandler("Podcast not found", 404, req, res);
    }
    podcast.watchCount += 1;
    await podcast.save();
    return SuccessHandler(podcast, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
module.exports = {
  createOrUpdatePodcast,
  publishPodcast,
  getPodcasts,
  deletePodcast,
  getPodcast,
  watchCount,
};
