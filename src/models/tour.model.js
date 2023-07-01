const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name field must not empty'],
      unique: true,
      trim: true,
      maxlength: [40, 'name field must not above 40 characters'],
      minlength: [10, 'name field must not less than 10 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.0,
      min: [0, 'rating invalid'],
      max: [5, 'rating invalid '],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'name field must not empty'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //not work on UPDATE, this only point at NEW document created
          return val < this.price;
        },
        message:
          'Discount price ({VALUE}) must not greater than original price',
      },
    },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationToWeeks').get(function () {
  return this.duration / 7; //allow convert durations from days to weeks
});

module.exports = mongoose.model('Tour', tourSchema);
