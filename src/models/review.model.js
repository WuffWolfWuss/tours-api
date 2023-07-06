const mongoose = require('mongoose');

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

module.exports = mongoose.model('Review', reviewSchema);
