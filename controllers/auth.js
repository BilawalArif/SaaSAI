const User = require("../models/User");
const ErrorResponse = require("../utils/errResponse");
const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken(res);
  res.status(statusCode).json({ success: true, token });
};

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new ErrorResponse("This email already in use", 400));
  }

  try {
    const user = await User.create({ username, email, password });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user gave  none email and password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and/or Passowrd", 400)
    );
  }
  try {
    // Checking if user already exist
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid Email or Password", 401));
    }
    const isPasswordMatched = await user.matchPasswords(password);
    if (!isPasswordMatched) {
      return next(new ErrorResponse("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
};

exports.getRefreshToken = async (req, res, next) => {
  try {
    const getToken = req.cookies.refreshToken;
    if (getToken) {
      const token = jwt.verify(getToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = jwt.sign(
        { id: token.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
      );
      res.status(200).json(accessToken);
    }
  } catch (err) {
    next(err);
  }
};

exports.getSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ subscription: user.subscription });
  } catch (err) {
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ customerId: user.customerId });
  } catch (err) {
    next(err);
  }
};
