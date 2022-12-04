// import or bring in express => similar to import Express from 'express' but this is better
const express = require('express')
// import colors (this can be used anywhere / any file upon just being initialized here)
const colors = require('colors')
const dotenv = require('dotenv').config()
// errorHandler module
const {errorHandler} = require('./middleware/errorMiddleware')
// MongoDB database connection
const connectDB = require('./config/db')
// import 'path' for deployment part
const path = require('path')

// Connect to MongoDB database
connectDB()

// port number var
// We have the || OR part since if port 5000 is unavailable it means just use port 8000 instead
const PORT = process.env.PORT || 8000

// create variable
const app = express()

// Middleware to be able to gather the body data send by Postman
// express.json() => allows us o send raw JSON
// middleware for accepting 'raw json'
app.use(express.json())
// middleware for accepting x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

///////////////////////////////////////////////////////////////////////////////////

// Use the router module (Routes)
// ('/api/users') => this is the end point you want to hit
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// Serve Frontend for deploymeny part
if(process.env.NODE_ENV === 'production') {
  // if you are in production then set a static path
  // __dirname => brings you to root directory
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // app.get('*) => means any route expect the routes created above (line 45 and 46)
  // res.sendFile() => we want to send the index.html from build folder of react project
  // __dirname => goes to root
  // '../' => goes up one level
  // 'frontend' => goes to 'frontend' folder
  // 'build' => goes to 'build' folder
  // 'index.html' => goes to 'index.html' from 'build' folder
  app.get('*', (req, res) => res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html'))
} else {
  // Create route with express
  // req => request
  // res => response
  // status code 201 = created
  // status 200 = OK
  // specific route endpoint => /api/users
  app.get('/', (req, res)=> {
    res.status(200).json({
      message: 'Welcome to the Support Desk API'
    })
  })
}


// use errorHandler middleware
app.use(errorHandler)

// listen() listens to a port number
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
