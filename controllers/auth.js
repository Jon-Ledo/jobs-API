const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  // // create a temporary user object for bcrypt
  // // deconstruct these values from the body
  // const { name, email, password } = req.body

  // // hashed password
  // // create the "salt"
  // const salt = await bcrypt.genSalt(10)
  // // Generate the hashed password using salt and previous password string
  // const hashedPassword = await bcrypt.hash(password, salt)

  // // new user object w/ hashed password to be used in create function
  // const tempUser = { name, email, password: hashedPassword }
  // const user = await User.create({ ...tempUser })
  // ☝ the slightly loner way to do this. Refer to the User model to see how bcrypt is being used there

  const user = await User.create({ ...req.body })

  // send both the token and user name fr front
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  // check if email and password exist
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // check if email matches one in DB
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  // comparing the password if there is a user
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}
