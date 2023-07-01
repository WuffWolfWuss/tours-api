const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name field must not empty'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'durations must not empty'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'group size required'],
  },
  difficulty: {
    type: String,
    required: [true, 'difficulty required.'],
  },
  ratingAverage: {
    type: Number,
    default: 5.0,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'name field must not empty'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'summary required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'image required'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

module.exports = mongoose.model('Tour', tourSchema);
