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
    ratingsAverage: {
      type: Number,
      default: 4.0,
      min: [0, 'rating invalid'],
      max: [5, 'rating invalid '],
      set: (val) => Math.round(val * 10) / 10, //1.3333 -> 13.3 -> 13 / 10 = 1.3
    },
    ratingsQuantity: {
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //arrays of number [latitude, longtitude]
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual('durationToWeeks').get(function () {
  return this.duration / 7; //allow convert durations from days to weeks
});
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //tour field in review model
  localField: '_id', //current tour field to connect 2 models together
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);

//Embed
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
