const mongoose = require('mongoose');
const validator = require('validator');
const jwb = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userShema = new mongoose.Schema({
  name: {
    type: String,
    requireq: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is not valid');
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [7, 'Password must have min 7 charachter'],
  },
  //FIXME: nead me one token or arr?
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userShema.method('toJSON', function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
});

userShema.method('generateAuthToken', async function () {
  const token = jwb.sign({ _id: this.id.toString() }, 'RubyGarage', {
    expiresIn: '7 days',
  });
  this.tokens.push({ token });
  await this.save();
  return token;
});

userShema.static('findByParams', async (email, password) => {
  const user = await User.findOne({ email }).exec();
  if (!user) {
    throw new Error('Unable to login');
  }
  const isLogin = bcrypt.compare(password, user.password);
  if (!isLogin) {
    throw new Error('Unable to login');
  }
  return user;
});

userShema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userShema);
module.exports = {
  User,
};
