const responseHandler = (req, res, next) => {
  res.success = (data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  next();
};

module.exports = responseHandler;
