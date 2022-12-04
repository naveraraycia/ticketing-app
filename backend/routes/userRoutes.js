const express = require('express')
const router = express.Router()
// import userController modules
const { registerUser, loginUser, getMe } = require('../controllers/userController')

// import protect function from authMiddleware.js
const {protect} = require('../middleware/authMiddleware') // to use this to protect a route, just add this 'protect' function as a second argument to the router.get() or router.post() or whatever request

// user register endpoint => register / signup
router.post('/', registerUser)

// user validation endpoint => Login
router.post('/login', loginUser)

// Route for current logged in user
router.get('/me', protect, getMe) // route protected since it has 'protect' as second argument here

module.exports = router