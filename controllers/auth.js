const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
// const { BadRequestError } = require('../errors')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
  // create a temporary user object for bcrypt
  // deconstruct these values from the body
  const { name, email, password } = req.body

  // hashed password
  // create the "salt"
  const salt = await bcrypt.genSalt(10)
  // Generate the hashed password using salt and previous password string
  const hashedPassword = await bcrypt.hash(password, salt)

  // new user object w/ hashed password to be used in create function
  const tempUser = { name, email, password: hashedPassword }

  const user = await User.create({ ...tempUser })
  res.status(StatusCodes.CREATED).json({ user })
}

const login = async (req, res) => {
  res.send('login user')
}

module.exports = {
  register,
  login,
}
