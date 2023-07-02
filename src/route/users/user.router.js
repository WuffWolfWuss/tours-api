const express = require('express');

const userRouter = express.Router();

//userRouter.param('id', );
const authController = require('./auth.controller');

const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('./user.controller');

userRouter.post('/signup', authController.signup);

userRouter.route('/').get(getAllUser).post(createUser);

userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
