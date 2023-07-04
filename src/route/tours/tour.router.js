const express = require('express');
const authController = require('./../users/auth.controller');

const toursRouter = express.Router();

const {
  checkBody,
  topTours,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getToursStats,
  getMonthlyTours,
} = require('./tour.controller');

//toursRouter.param('id', checkId);
toursRouter.route('/best-tours').get(topTours, getAllTours);
toursRouter.route('/tour-stats').get(getToursStats);
toursRouter.route('/monthly-freq/:year').get(getMonthlyTours);

toursRouter
  .route('/')
  .get(authController.protect, getAllTours)
  .post(createTour);
toursRouter
  .route('/:id')
  .get(getTourById)
  .patch(checkBody, updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    deleteTour
  );

module.exports = toursRouter;
