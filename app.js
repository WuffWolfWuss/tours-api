const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const appError = require('./src/utilities/errors');
const errorHandler = require('./src/utilities/errorController');

const toursRouter = require('./src/route/tours/tour.router');
const userRouter = require('./src/route/users/user.router');
const reviewRouter = require('./src/route/reviews/reviews.router');

const app = express();

//MIDDLEWARES
app.use(helmet());

//body parser, reading data from body into req.body
app.use(express.json({ limit: '15kb' }));

//Data sanitization aganst NoSQL Query Injection
app.use(mongoSanitize());

//Data sanitization aganst cross site attack XSS
app.use(xss());

//Remove parameters pollutions
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'difficulty', 'price'], //allow parameters to be duplicate in query search
  })
);

//test static files
app.use(express.static(`${__dirname}/public`));

//routers
app.use('/v1/tours', toursRouter);
app.use('/v1/users', userRouter);
app.use('/v1/reviews', reviewRouter);

//Route not found handle
app.all('*', (req, res, next) => {
  next(new appError('route not found', 404));
});

//Error handle middleware
app.use(errorHandler);

module.exports = app;
