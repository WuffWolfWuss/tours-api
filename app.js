const express = require('express');

const appError = require('./src/utilities/errors');
const errorHandler = require('./src/utilities/errorController');

const toursRouter = require('./src/route/tours/tour.router');
const userRouter = require('./src/route/users/user.router');

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/v1/tours', toursRouter);
app.use('/v1/users', userRouter);

//Route not found handle
app.all('*', (req, res, next) => {
  next(new appError('route not found', 404));
});

//Error handle middleware
app.use(errorHandler);

module.exports = app;
