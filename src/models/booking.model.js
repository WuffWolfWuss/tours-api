const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    require: [true, 'Which tour this booking belong?'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'Who booking this?'],
  },
  price: {
    type: Number,
    require: [true, 'Price of the tour that user booking.'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  alreadyPaid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
