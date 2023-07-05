const User = require('../../models/user.model');
const appError = require('./../../utilities/errors');
const catchAsync = require('./../../utilities/catchAsync');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllUser = catchAsync(async (req, res) => {
  const result = await User.find();

  res.status(200).json({
    status: 'ok',
    result: result.length,
    data: {
      result,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError('This route not support password update.', 400));
  }
  //update user
  //no allow field like 'role' to be update
  const filterBody = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(204).json({ status: 'success' });
});

const getUserById = (req, res) => {
  return res.status(500).json({ err: 'Route not implement' });
};

const createUser = (req, res) => {
  return res.status(500).json({ err: 'Route not implement' });
};

const updateUser = (req, res) => {
  return res.status(500).json({ err: 'Route not implement' });
};

const deleteUser = (req, res) => {
  return res.status(500).json({ err: 'Route not implement' });
};

module.exports = {
  updateMe,
  deleteMe,
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
