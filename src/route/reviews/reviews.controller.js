const Review = require('./../../models/review.model');
const factory = require('./../controller.factory');

exports.getAllReviews = factory.getAll(Review);

exports.getReviewById = factory.getOne(Review);

exports.setTourandUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
