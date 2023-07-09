const express = require('express');

const bookingController = require('./booking.controller');
const authController = require('./../users/auth.controller');

const bookingRouter = express.Router({ mergeParams: true }); //allow tour id accessible

bookingRouter.use(authController.protect);

bookingRouter.route('/me').get(bookingController.getMyBooking);

bookingRouter
  .route('/')
  .get(
    authController.restrictTo('admin', 'guide'),
    bookingController.getAllBooking
  )
  .post(authController.restrictTo('user'), bookingController.createBooking);

bookingRouter
  .route('/:id')
  .delete(bookingController.deleteMyBooking)
  .get(bookingController.getOneBooking);

module.exports = bookingRouter;
