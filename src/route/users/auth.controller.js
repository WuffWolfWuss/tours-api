const jwt = require('jsonwebtoken');
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
