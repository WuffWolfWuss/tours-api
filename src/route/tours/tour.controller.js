const Tour = require('../../models/tour.model');

// const checkId = (req, res, next, val) => {
//   console.log(`${val}`);
//   next();
// };

const checkBody = (req, res, next) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ err: 'Body not valid' });
  }
  next();
};

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //filtering with mongodb operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // { query: "...", duration: { $gte: 5} => greater or equals than 5}
    //  ?duration[gte]=5          --- gte, gt, lte, lt

    let query = Tour.find(JSON.parse(queryStr), { __v: 0 });

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createAt');
    }
    //sort('price name') --> if 2 have same price, will sort by name.
    //&sort=-price --> descending order

    //limit return data fields
    if (req.query.fields) {
      const selectFields = req.query.fields.split(',').join(' ');
      query = query.select(selectFields);
    }

    //pagination
    if (req.query.page) {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      let skip = (page - 1) * limit;

      const numTours = await Tour.countDocuments();
      skip = skip > numTours ? numTours - limit : skip;

      query = query.skip(skip).limit(limit);
    }

    const result = await query;

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

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
};
