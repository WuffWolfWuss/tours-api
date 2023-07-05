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
  updateMe,
  deleteMe,
} = require('./user.controller');

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

userRouter.patch('/updateMe', authController.protect, updateMe);
userRouter.delete('/deleteMe', authController.protect, deleteMe);

userRouter.route('/').get(getAllUser).post(createUser);

userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
