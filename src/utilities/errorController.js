const appError = require('./errors');

const sendErrorDetail = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorSummary = (err, res) => {
  //operational, trusted error that dev created.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`ERROR `, err);
    //programing or unknow error: hide error details from client
    res.status(500).json({
      status: 'error',
      message: 'oops, something went wrong.',
    });
  }
};

//DATABASE ERRORS HANDLING
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}`;
  return new appError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate value ${err.keyValue.name}`;
  return new appError(message, 400);
};

const handleValidateErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(' | ')}`;

  return new appError(message, 400);
};

const handleJWTError = (err) =>
  new appError('Invalid token. Please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 400;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDetail(err, res);
  } else {
    let error = { ...err };
    const errorName = err.name;

    if (errorName === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (errorName === 'ValidationError') error = handleValidateErrDB(error);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
      error = handleJWTError(error);

    sendErrorSummary(error, res);
  }
};
