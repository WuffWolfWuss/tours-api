const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name field required'],
    trim: true,
    maxlength: [30, 'name field must not above 30 characters'],
    minlength: [1, 'name field must not empty.'],
  },
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provided email invalid.'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'password required'],
    trim: true,
    maxlength: [30, 'password must not above 30 characters'],
    minlength: [6, 'password must not less than 6 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm your password'],
    //only work on save/create user
    validate: {
      validator: function (el) {
        return el === this.password; //passwordConfirm === password?
      },
      message: 'password not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//i bcryptjs
userSchema.pre('save', async function (next) {
  //only run this password is already modify
  if (!this.isModified('password')) return next();

  //modify password with hash
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //no need to save in database

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.passwordHasChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; //changed password after JWT token was issued
  }

  //nothing chagned JWT time > changedPassTime
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //console.log({ resetToken, Token: this.passwordResetToken });
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
