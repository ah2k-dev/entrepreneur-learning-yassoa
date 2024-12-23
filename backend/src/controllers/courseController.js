const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Course = require("../models/Courses/courses");

const createCourse = async (req, res) => {
  try {
    const { title, description, step, position, thumbnail, video } = req.body;

    // if(step === "introduction"){
    //   return ErrorHandler("Introduction course cannot be created", 400, req, res);
    // }

    const exPosition = await Course.findOne({ step, position });
    if (exPosition) {
      //update position of existing courses
      await Course.updateMany(
        { step, position: { $gte: position } },
        { $inc: { position: 1 } }
      );
    }
    const course = await Course.create({
      title,
      description,
      step,
      position,
      thumbnail,
      video,
      createdBy: req.user._id,
    });

    return SuccessHandler(course, 201, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, step, position, thumbnail, video } = req.body;
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return ErrorHandler("Course not found", 404, req, res);
    }

    if (course.step !== step || course.position !== position) {
      const exPosition = await Course.findOne({ step, position });
      if (exPosition) {
        //update position of existing courses
        await Course.updateMany(
          { step, position: { $gte: position } },
          { $inc: { position: 1 } }
        );
      }
    }
    course.title = title;
    course.description = description;
    course.step = step;
    course.position = position;
    course.thumbnail = thumbnail;
    course.video = video;
    course.updatedBy = req.user._id;
    await course.save();

    return SuccessHandler(course, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return ErrorHandler("Course not found", 404, req, res);
    }
    //update position of existing courses
    await Course.updateMany(
      { step: course.step, position: { $gt: course.position } },
      { $inc: { position: -1 } }
    );
    await course.remove();
    return SuccessHandler("Course deleted successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getCourses = async (req, res) => {
  try {
    const { step } = req.query;
    let courses;
    if (
      (req.user.role === "user" && !req.user.subscribed) ||
      (req.user.subscribed && !req.user?.permissions?.includes("premium"))
    ) {
      courses = await Course.find({ step }).sort("position");
    } else {
      courses = await Course.find({ step }).sort("position").select("+video");
    }
    return SuccessHandler(courses, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let course;
    if (
      (req.user.role === "user" && !req.user.subscribed) ||
      (req.user.subscribed && !req.user?.permissions?.includes("premium"))
    ) {
      course = await Course.findById(id);
    } else {
      course = await Course.findById(id).select("+video");
    }
    if (!course) {
      return ErrorHandler("Course not found", 404, req, res);
    }
    return SuccessHandler(course, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourse,
};
