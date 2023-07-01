const Tour = require('../../models/tour.model');
const APIFilters = require('./../../utilities/apiFilters');

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
const getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

const getTourById = async (req, res) => {
  try {
    const result = await Tour.findById(req.params.id);
    //Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'ok',
      data: {
        result,
      },
    });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const updateTour = async (req, res) => {
  try {
    const result = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return new document
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: result,
      },
    });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

const deleteTour = async (req, res) => {
  try {
    const result = await Tour.deleteOne({ _id: req.params.id });
    res.status(204).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

//PIPELINE
const getToursStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

const getMonthlyTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

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
