const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../../models/user.model');
const catchAsync = require('./../../utilities/catchAsync');
const appError = require('./../../utilities/errors');
const sendEmail = require('./../../utilities/email');
const crypto = require('crypto');

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPRIES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

  user.password = undefined; //hide password in response output

  res.cookie('jwt', token, cookiesOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt || undefined,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check email password valid
  if (!email || !password) {
    return next(new appError('Please provide email, password!', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  //if user exist then run correctPassword
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or password!', 401));
  }

  //send token if verify
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //check token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new appError('You must login to view this url', 401));
  }

  //validate toke
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);

  //check user exist
  const existUser = await User.findById(decoded.id);
  if (!existUser)
    next(new appError('User belonging to this token no longer exist!'));

  //check user changed password after JWT token was create
  if (existUser.passwordHasChanged(decoded.iat)) {
    return next(new appError('User password changed! Please login again', 401));
  }
  req.user = existUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin', 'guide']
    if (!roles.includes(req.user.role)) {
      return next(new appError('You do not have permission to do this', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('No user with that email.', 404));
  }
  //generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send back to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/v1/users/resetPassword/${resetToken}`;
  const message = `Confirm changing password with this ${resetURL}.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgot password',
      message,
    });
  } catch (error) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined);
    await user.save({ validateBeforeSave: false });

    return next(new appError('Email sent failed', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  //token not expired and user exist, set new password
  if (!user) {
    return next(new appError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //update changedPasswordAt property of user

  //log user in, sent JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user
  const user = await User.findById(req.user._id).select('+password');

  //check current password correct
  if (
    !user ||
    !(await user.correctPassword(req.body.oldPassword, user.password))
  ) {
    return next(new appError('Password incorrect'));
  }
  //if true, update
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //log user in, send JWT
  createSendToken(user, 200, res);
});
