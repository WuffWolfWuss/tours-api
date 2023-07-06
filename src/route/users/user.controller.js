const User = require('../../models/user.model');
const appError = require('./../../utilities/errors');
const catchAsync = require('./../../utilities/catchAsync');
const factory = require('./../controller.factory');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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

const getAllUser = factory.getAll(User);
const getUserById = factory.getOne(User);

//avoid changing password using this
const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
