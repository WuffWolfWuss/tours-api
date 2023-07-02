const User = require('../../models/user.model');
const catchAsync = require('./../../utilities/catchAsync');

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
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
