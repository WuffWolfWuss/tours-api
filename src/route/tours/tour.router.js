const express = require('express');
const authController = require('./../users/auth.controller');
const reviewRouter = require('./../reviews/reviews.router');

const toursRouter = express.Router();

const {
  topTours,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getToursStats,
  getMonthlyTours,
} = require('./tour.controller');

//nested route
toursRouter.use('/:tourId/reviews', reviewRouter);

//toursRouter.param('id', checkId);
toursRouter.route('/best-tours').get(topTours, getAllTours);
toursRouter.route('/tour-stats').get(getToursStats);
toursRouter
  .route('/monthly-freq/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    getMonthlyTours
  );

toursRouter
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    createTour
  );

toursRouter
  .route('/:id')
  .get(getTourById)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    deleteTour
  );

//GET: tour/:tourid/reviews ->get all reviews of specific tour
//POST: tour/:tourid/reviews -> create reviews of specific tour
// toursRouter
//   .route('/:id/reviews')
//   .post(authController.protect, reviewController.createReview);

module.exports = toursRouter;
