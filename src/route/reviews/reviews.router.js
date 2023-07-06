const express = require('express');

const reviewController = require('./reviews.controller');
const authController = require('./../users/auth.controller');

const reviewRouter = express.Router({ mergeParams: true }); //allow tour id accessible

//GET: tour/:tourid/reviews ->get all reviews of specific tour
//POST: tour/:tourid/reviews -> create reviews of specific tour
reviewRouter.use(authController.protect);
reviewRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourandUserId,
    reviewController.createReview
  );

reviewRouter
  .route('/:id')
  .get(reviewController.getReviewById)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = reviewRouter;
