const catchAsync = require('../utilities/catchAsync');
const appError = require('../utilities/errors');
const APIFilters = require('./../utilities/apiFilters');

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const user = req.user;
    const result =
      user.role === 'admin'
        ? await Model.findByIdAndDelete(req.params.id)
        : await Model.deleteOne({ _id: req.params.id, user: user.id });
    //const result = await Tour.deleteOne({ _id: req.params.id });

    if (!result) {
      return next(new appError('No result match given id.'));
    }
    res.status(204).json({
      status: 'success',
      data: result,
    });
  });
};

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //not allow password update.
    if (req.body.password || req.body.passwordConfirm) {
      return next(new appError('This route not support password update.', 400));
    }

    //todo: check if current user id match with the id of the user document
    //user not have permisssion to update other users document
    //admin have permission to update all.
    const result = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return new document
      runValidators: true,
    });
    if (!result) {
      return next(new appError('No result match given id.'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newData = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newData,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let qr = Model.findById(req.params.id);
    if (populateOptions) qr = qr.populate(populateOptions);

    const result = await qr;
    //Tour.findOne({ _id: req.params.id })

    if (!result) {
      return next(new appError('No result match given id.'));
    }

    res.status(200).json({
      status: 'ok',
      data: {
        result,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //nested GET reviews base on tour id
    let filterQ = {};
    if (req.params.tourId) filterQ = { tour: req.params.tourId };

    const apiFilters = new APIFilters(
      Model.find(filterQ, { __v: 0 }),
      req.query
    )
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
