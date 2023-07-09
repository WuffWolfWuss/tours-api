const Booking = require('../../models/booking.model');
const Tour = require('../../models/tour.model');
const factory = require('./../controller.factory');
const catchAsync = require('../../utilities/catchAsync');
const appError = require('../../utilities/errors');

exports.createBooking = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new appError('Tour no longer exist, please try again', 400));
  }

  const data = await Booking.create({
    tour: req.body.tour,
    user: req.body.user,
    price: tour.price,
  });

  res.status(201).json({
    status: 'success',
    data,
  });
});

exports.getMyBooking = catchAsync(async (req, res, next) => {
  //get all bookings match user id
  const bookings = await Booking.find({ user: req.user.id });

  //get tours details, use populate also work
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

exports.deleteMyBooking = factory.deleteOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.getOneBooking = factory.getOne(Booking);
