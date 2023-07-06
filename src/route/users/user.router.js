const express = require('express');

const userRouter = express.Router();

//userRouter.param('id', );
const authController = require('./auth.controller');

const {
  getMe,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('./user.controller');

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

//Authenticate require
userRouter.use(authController.protect);

userRouter.patch('/updateMyPassword', authController.updatePassword);

userRouter.get('/me', getMe, getUserById);
userRouter.patch('/updateMe', updateMe);
userRouter.delete('/deleteMe', deleteMe);

//only admin allow to access below route
userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(getAllUser);

userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
