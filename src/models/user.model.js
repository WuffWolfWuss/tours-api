const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

//INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
