const express = require('express');

const toursRouter = require('./src/route/tours/tour.router');
const userRouter = require('./src/route/users/user.router');

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/v1/tours', toursRouter);
app.use('/v1/users', userRouter);

module.exports = app;
