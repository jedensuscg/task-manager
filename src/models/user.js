const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')
const { logger, requestLogger } = require("../logger");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email format')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain "password" ')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
})

userSchema.methods.generateAuthToken = async function () {

  try {
    const user = this
    const token = jwt.sign({_id: user.id.toString()}, "stargateSG1")
  
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
  } catch (error) {
    logger.error(error)
  }
}

userSchema.statics.FindByCredentials = async (email, password, ip) => {
  const user = await User.findOne({email})

  if (!user) {
    logger.log({level: 'info', message: {message: `Failed Login Attempt.`, reason: "No user found", ip: ip, email: email}})
    throw new Error('Unable to Login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    logger.log({level: 'info', message: {message: `Failed Login Attempt.`, reason: "Invalid password", ip: ip, email: email}})
    throw new Error('Unable to login')
  }

  return user
}

//Hash plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model("user", userSchema);

module.exports = User