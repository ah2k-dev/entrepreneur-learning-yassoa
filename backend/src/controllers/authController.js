const User = require("../models/User/user");
const sendMail = require("../utils/sendMail");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const { createCustomer } = require("../utils/stripe");
const Payment = require("../models/User/payment");
const SubscriptionPage = require("../models/User/subscriptionPage");
const { createOrUpdateBrevoContact } = require("../utils/brevo");

//checl if user exists
const checkUser = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (user) {
      return ErrorHandler(
        {
          message: "User already exists",
          errorKey:
            user.email === email
              ? user.phone === phone
                ? ["phone", "email"]
                : ["email"]
              : ["phone"],
        },
        400,
        req,
        res
      );
    }
    return SuccessHandler(
      {
        message: "User does not exist",
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//register
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      haveBusiness,
      type,
      niche,
      employees,
      businessType,
      reference,
    } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return ErrorHandler("User already exists", 400, req, res);
    }
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      haveBusiness,
      type,
      niche,
      employees,
      businessType,
      reference,
    });
    newUser.save();
    const customer = await createCustomer(email);
    await User.findByIdAndUpdate(newUser._id, {
      stripeCustomerID: customer.id,
    });

    let BrevoUserAttributes = {
      FIRSTNAME: name,
      FULLNAME: name,
      EMAIL: email,
      PHONE: phone,
      HAVEBUSINESS: haveBusiness,
      TYPE: type,
      NICHE: niche,
      EMPLOYEES: employees,
      BUSINESSTYPE: businessType,
      REFERENCE: reference,
    }
    const brevoCustomer = await createOrUpdateBrevoContact({ email, attributes: BrevoUserAttributes });
    console.log('brevoCustomer ', brevoCustomer)
    return SuccessHandler("User created successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//request email verification token
const requestEmailToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);
    const emailVerificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = emailVerificationTokenExpires;
    await user.save();
    const message = `Your email verification token is ${emailVerificationToken} and it expires in 10 minutes`;
    const subject = `Email verification token`;
    await sendMail(email, subject, message);
    return SuccessHandler(
      `Email verification token sent to ${email}`,
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//verify email token
const verifyEmail = async (req, res) => {
  try {
    const { email, emailVerificationToken } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    if (
      user.emailVerificationToken !== emailVerificationToken ||
      user.emailVerificationTokenExpires < Date.now()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    jwtToken = user.getJWTToken();
    await user.save();
    return SuccessHandler("Email verified successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    if (!user.isActive) {
      return ErrorHandler("You have been blocked by admin", 400, req, res);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
    if (!user.emailVerified) {
      return ErrorHandler("Email not verified", 400, req, res);
    }

    let jwtToken = user.getJWTToken();
    return SuccessHandler(
      {
        message: "Logged in successfully",
        user,
        jwtToken,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//logout
const logout = async (req, res) => {
  try {
    req.user = null;
    return SuccessHandler("Logged out successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const passwordResetToken = Math.floor(100000 + Math.random() * 900000);
    const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpires = passwordResetTokenExpires;
    await user.save();
    const message = `Your password reset token is ${passwordResetToken} and it expires in 10 minutes`;
    const subject = `Password reset token`;
    await sendMail(email, subject, message);
    return SuccessHandler(`Password reset token sent to ${email}`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { email, passwordResetToken, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    if (
      user.passwordResetToken !== passwordResetToken ||
      user.passwordResetTokenExpires < Date.now()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    return SuccessHandler("Password reset successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//update password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    // const isMatch = await user.comparePassword(currentPassword);
    // if (!isMatch) {
    //   return ErrorHandler("Invalid credentials", 400, req, res);
    // }
    const samePasswords = await user.comparePassword(newPassword);
    if (samePasswords) {
      return ErrorHandler(
        "New password cannot be same as old password",
        400,
        req,
        res
      );
    }
    user.password = newPassword;
    await user.save();
    return SuccessHandler("Password updated successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//me
const me = async (req, res) => {
  try {
    return SuccessHandler(req.user, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//update me
const updateMe = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      haveBusiness,
      zip,
      city,
      country,
      address,
      profileImage,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return ErrorHandler("User not found", 404, req, res);
    }
    // if (req.files && req.files?.profile) {
    //   const file = req.files.profile;
    //   const filePath = `/uploads/${Date.now()}-${file.name}`;
    //   file.mv(`${__dirname}/../${filePath}`, async (err) => {
    //     if (err) {
    //       return ErrorHandler(err.message, 500, req, res);
    //     }
    //     user.profile = filePath;
    //   });
    // }

    if (req.body.password) {
      return ErrorHandler(
        "Please use update password route to update password",
        400,
        req,
        res
      );
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.haveBusiness = JSON.parse(haveBusiness);
    user.zip = zip;
    user.city = city;
    user.country = country;
    user.address = address;
    user.profileImage = profileImage;

    await user.save();
    return SuccessHandler(
      {
        message: "User updated successfully",
        user,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// editor management
const addEditor = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const exUser = await User.findOne({
      email,
    });
    if (exUser) {
      return ErrorHandler("Email already exists", 400, req, res);
    }
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      emailVerified: true,
      role: "editor",
    });
    newUser.save();
    SuccessHandler(
      {
        message: "User created successfully",
        user: newUser,
      },
      201,
      res
    );
    const message = `You have been registered as editor on the learning app. Please use "Email: ${email} Password: ${password}"`;
    const subject = `Registered as editor`;
    await sendMail(email, subject, message);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const blockUnblockEditor = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    if (!user) {
      return ErrorHandler("User not found", 404, req, res);
    }
    user.isActive = !user.isActive;
    await user.save();

    return SuccessHandler(
      {
        message: `User ${user.isActive ? "unblocked" : "blocked"} successfully`,
        user,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const getEditors = async (req, res) => {
  try {
    const users = await User.find({ role: "editor" });
    return SuccessHandler(users, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          role: "user",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "user",
          as: "payments",
        },
      },
      {
        $addFields: {
          totalAmount: {
            $sum: "$payments.amount",
          },
        },
      },
    ]);
    return SuccessHandler(users, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateEditor = async (req, res) => {
  try {
    const { id } = req.query;
    console.log("id ", id);
    const { name, email, phone } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return ErrorHandler("User not found", 404, req, res);
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();
    return SuccessHandler(
      {
        message: "User updated successfully",
        user,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const dashboard = async (req, res) => {
  try {
    // pending
    /*
    Response array of objects required for all dates in the month
    [{
      date: "2021-09-01",
      totalUsersTillDate: 10,
      totalNewUsers: 5,
      newSubscribers: 2,
      totalRevenue: 1000,
    },{
      date: "2021-09-02",
      totalUsersTillDate: 15,
      totalNewUsers: 5,
      newSubscribers: 3,
      totalRevenue: 1500,
    }]
    */
    const month = req.query.month || new Date().getMonth() + 1;
    const year = req.query.year || new Date().getFullYear();
    const users = await User.find({ role: "user" });
    const payments = await Payment.find();
    const data = [];

    // run loop for all dates in the month till today
    console.log(new Date().getDate());

    for (let i = 1; i <= new Date().getDate(); i++) {
      const date = `${year}-${month < 10 ? "0" + month : month}-${i < 10 ? "0" + i : i
        }`;
      const totalUsers = users.filter(
        (user) => new Date(user.createdAt).toISOString().split("T")[0] <= date
      ).length;
      const totalNewUsers = users.filter(
        (user) => new Date(user.createdAt).toISOString().split("T")[0] === date
      ).length;
      const newSubscribers = payments.filter(
        (payment) =>
          new Date(payment.createdAt).toISOString().split("T")[0] === date
      ).length;
      const todayRevenue = payments
        .filter(
          (payment) =>
            new Date(payment.createdAt).toISOString().split("T")[0] === date
        )
        .reduce((acc, curr) => acc + curr.amount, 0);
      const totalRevenue = payments
        .filter(
          (payment) =>
            new Date(payment.createdAt).toISOString().split("T")[0] <= date
        )
        .reduce((acc, curr) => acc + curr.amount, 0);
      data.push({
        date,
        totalUsers,
        totalNewUsers,
        newSubscribers,
        todayRevenue,
        totalRevenue,
      });
    }

    return SuccessHandler(
      {
        message: "Dashboard",
        data,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const myInvoices = async (req, res) => {
  try {
    const invoices = await Payment.find({ user: req.user._id });
    return SuccessHandler(invoices, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateSubscriptionPage = async (req, res) => {
  try {
    const { title, subtitle, video } = req.body;
    const exPage = await SubscriptionPage.findOne();
    if (exPage) {
      exPage.title = title;
      exPage.subtitle = subtitle;
      exPage.video = video;
      await exPage.save();
      return SuccessHandler(
        {
          message: "Subscription page updated successfully",
          page: exPage,
        },
        200,
        res
      );
    } else {
      const newPage = await SubscriptionPage.create({
        title,
        subtitle,
        video,
      });
      newPage.save();
      return SuccessHandler(
        {
          message: "Subscription page created successfully",
          page: newPage,
        },
        201,
        res
      );
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getSubscriptionPage = async (req, res) => {
  try {
    const page = await SubscriptionPage.findOne();
    return SuccessHandler(page, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  register,
  requestEmailToken,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  me,
  updateMe,
  addEditor,
  blockUnblockEditor,
  getEditors,
  getUsers,
  updateEditor,
  dashboard,
  myInvoices,
  checkUser,
  updateSubscriptionPage,
  getSubscriptionPage,
};
