const express = require('express');

const userRouter = express.Router();

//userRouter.param('id', );

const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('./user.controller');

userRouter.get('/', getAllUser);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;
