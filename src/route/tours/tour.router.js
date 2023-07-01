const express = require('express');

const toursRouter = express.Router();

const {
  checkBody,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require('./tour.controller');

//toursRouter.param('id', checkId);

toursRouter.route('/').get(getAllTours).post(createTour);
toursRouter
  .route('/:id')
  .get(getTourById)
  .patch(checkBody, updateTour)
  .delete(deleteTour);

module.exports = toursRouter;
