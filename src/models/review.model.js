const mongoose = require('mongoose');
const Tour = require('./tour.model');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Your review is empty'],
      minlength: [5, 'Your review is too short'],
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Which tour this review belong to?'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Which user this review belong to?'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); //user can only create 1 review for 1 tour

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  //   populate({
  //     path: 'tour',
  //     select: 'name difficulty ratingsAverage',
  //   })
  next();
});

reviewSchema.post('save', function () {
  //this point to current review
  const model = this.constructor;
  model.calcAvgRatings(this.tour);
});

//findByIdAndUpdate - findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async function (doc) {
  //after query finish and database have been update review
  //access to the review above
  await doc.constructor.calcAvgRatings(doc.tour);
});

//statics method for calculation
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  //in statics, this point to model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour', //group all review match tour id together
        total: { $sum: 1 }, //plus 1 for each match review
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].total,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

module.exports = mongoose.model('Review', reviewSchema);
