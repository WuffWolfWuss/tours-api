const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../../models/user.model');
const catchAsync = require('./../../utilities/catchAsync');
const appError = require('./../../utilities/errors');

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
    passwordChangedAt: req.body.passwordChangedAt || null,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
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
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
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
