const Tour = require('../../models/tour.model');
const catchAsync = require('./../../utilities/catchAsync');
const factory = require('./../controller.factory');

// const checkId = (req, res, next, val) => {
//   console.log(`${val}`);
//   next();
// };
//middlware
const checkBody = (req, res, next) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ err: 'Body not valid' });
  }
  next();
};

const topTours = (req, res, next) => {
  req.query.limit = 5;
  (req.query.sort = '-ratingsAverage, price'),
    (req.query.fields = 'name, price, ratingsAverage, summary, difficulty');
  next();
};

//req handler
const getAllTours = factory.getAll(Tour);

const getTourById = factory.getOne(Tour, 'reviews');

const createTour = factory.createOne(Tour);

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

//PIPELINE
const getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty', //set null to get all tours, no filter
        numTours: { $sum: 1 }, //add 1 to counter with each document go through pipeline
        numRatings: { $sum: '$ratingQuantity' },
        averageRating: { $avg: '$ratingAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { averagePrice: 1 }, //sort by averagePrice
    },
    //{$match: {_id: {$ne: 'easy'}}} //exclude 'easy' docs
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

const getMonthlyTours = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const freq = await Tour.aggregate([
    {
      $unwind: '$startDates',
      //deconstruct array fields, output each doc for each element in array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`), //within a given year
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 }, //remove _id from result
    },
    {
      $sort: { numTours: -1 },
    },
    //{$limit: 6},
  ]);
  res.status(200).json({
    status: 'success',
    data: freq,
  });
});

module.exports = {
  topTours,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
  getToursStats,
  getMonthlyTours,
};
