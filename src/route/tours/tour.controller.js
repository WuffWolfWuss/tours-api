const Tour = require('../../models/tour.model');
const APIFilters = require('./../../utilities/apiFilters');
const catchAsync = require('./../../utilities/catchAsync');
const appError = require('./../../utilities/errors');

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
const getAllTours = catchAsync(async (req, res, next) => {
  const apiFilters = new APIFilters(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const result = await apiFilters.mongoQuery;

  res.status(200).json({
    status: 'ok',
    result: result.length,
    data: {
      result,
    },
  });
});

const getTourById = catchAsync(async (req, res, next) => {
  const result = await Tour.findById(req.params.id);
  //Tour.findOne({ _id: req.params.id })

  if (!result) {
    return next(new appError('No tour found match given id.'));
  }

  res.status(200).json({
    status: 'ok',
    data: {
      result,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const result = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //return new document
    runValidators: true,
  });
  if (!result) {
    return next(new appError('No tour found match given id.'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: result,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const result = await Tour.findByIdAndDelete(req.params.id);
  //const result = await Tour.deleteOne({ _id: req.params.id });

  if (!result) {
    return next(new appError('No tour found match given id.'));
  }
  res.status(204).json({
    status: 'success',
    data: result,
  });
});

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
