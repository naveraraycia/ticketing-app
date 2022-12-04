const jwt = require('jsonwebtoken') // json web token
const asyncHandler = require('express-async-handler') // async handler
const User = require('../models/userModel') // model schema

// Create a function that protects the routes
const protect = asyncHandler(async (req, res, next) => {
  // initialize a token var
  let token

  // check for the token in the headers
  // Our JSON webtoken upon logging in is stored within the header as 'Bearer Token' that is why we must check for it
  // Check if within the headers part, there is a Bearer token at present
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      // Get token from header
      token = req.headers.authorization.split(' ')[1]  // this gets the word 'Bearer Token' and splits it by the space (' ') so that you will get [0] = Bearer & [1] = Token. Index [1] is what we need

      // Verify the token
      // jwt.verify() takes in the token from line 16 above, as well as the Client secret we set up in .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // decoded var => now holds the de-coded token with the user ID in it
      // Get user from token => use findById() method which takes in as param => decoded.id (the user id from the decoded token)
      // Get just the decoded ID not the password field => add .select('-password') => this part excludes the password field
      req.user = await User.findById(decoded.id).select('-password')

      next() //this calls the next middleware
    } catch (error) {
      console.log(error)
      // Status 401 = unauthorized
      res.status(401)
      throw new Error('Not Authotized!')
    }
  }

  // Check if there is no token
  if(!token){
    // Erorr => not authorized
    res.status(401)
    throw new Error('Not Authotized!')
  }
})

// export module
module.exports = { protect }