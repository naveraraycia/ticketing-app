// import Express Async Handler
const asyncHandler = require('express-async-handler')
// import bcrypt for hashing password
const bcrypt = require('bcryptjs')
// import model
const User = require('../models/userModel')
// import jsonwebtoken for generating JWT
const jwt = require('jsonwebtoken')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @desc  Register a new user
// @route /api/users
// @access (means do we have to authenticate / send a token to access this route?) => Public (avail for all)
const registerUser = asyncHandler(async (req, res) => {
  // req.body => stores and gets the data sent by postman
  // de-structure
  const {name, email, password} = req.body

  // validate to make sure data exists
  if(!name || !email || !password) {
    // if there is no name, email, or password => send error status code
    // 400 = client error => an error where the client didn't include the correct information
    res.status(400)
    // Error handler middleware
    throw new Error('Please include all fields!')
  }

  // Find if user already exists - we don't want to register an existing user
  // User model has a built-in function => findOne() which is similar to firebase getDoc()
  // findOne({email}) => find a document with the specific email (since this is unique)
  // {email} comes from the de-structured req.body from above
  const userExists = await User.findOne({email})  // can also be User.findOne({email: email})

  if(userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash the password with bcryptjs
  // bcrypt.genSalt() => generate Salt => data to hash the password with. 10 is the ideal 
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt) // bcrypt.hash(passwordVariable, salt (basically what to hash the pwd with))

  // Create user
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword // do not put password: password since this stores the plain-text
  })

  // If user is created
  if(user){
    // status code 201 - everything is good and something is created
    res.status(201).json({
      _id: user._id, // the way you type it should be _id since this is how Mongoose stores the id
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new error('Invalid user data')
  }

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Login a user
// @route /api/users/login
// @access => Public (avail for all)
const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body (data credentials submitted by the client)
  const {email, password} = req.body

  // find that user from the document (database)
  const user = await User.findOne({email: email})
  
  // if a user is found, make sure the password sent by the client also matches with the password within the found document (same as pwd from database)
  // (await bcrypt.compare(client-sent password, password from the database)) => bcrypt.compare checks if the password inputted by the client matches with the hashed password
  // if-statement logic => if there is a user found and the passwords match then login the user
  if(user && (await bcrypt.compare(password, user.password))) {
    // Status code 200 - success
    res.status(200).json({
      _id: user._id, // the way you type it should be _id since this is how Mongoose stores the id
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    // Status code - 401 unauthorized
    res.status(401)
    throw new Error('Invalid user credentials')
  }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Get current user
// @route /api/users/me
// @access => Private (protected route = needs token)
const getMe = asyncHandler(async (req, res) => {
  // / Get the current user's credentials
  // req.user came from 'authMiddleware.js' line 24
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name
  }
  res.status(200).json(user)
})

// Generate Token function
const generateToken = (id) => {
  // jwt.sign() => takes in 3 params => the user ID argument, then a JWT client Secret, and an object with expire details
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'  // token expires in 30 days
  } )
}


// export the above stuff
module.exports = {
  registerUser,
  loginUser,
  getMe
}