const ErrorResponse = require("../utils/errResponse");

module.exports = (err, req, res, next) => {
  //Server Error
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Log to console for dev
  console.log(err.stack.red);

  // Wrong Mongodb Id Error

  if (err.name === "CastError") {
    const message = `Resource not forund. Invalid: ${err.path}`;
    err = new ErrorResponse(message, 400);
  }

  // Mongoose Duplicate key error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorResponse(message, 400);
  }
  // Wrong JSON Web Token
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token Invalid, Try again`;
    err = new ErrorResponse(message, 400);
  }

  // JWT Expire Error
  if (err.name === "TokenExpireError") {
    const message = `Json Web Token Expired, Try again`;
    err = new ErrorResponse(message, 400);
  }
  res.status(err.statusCode).json({ success: false, error: err.message });
};
