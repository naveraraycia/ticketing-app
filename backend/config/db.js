// import Mongoose
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // connect to your database here
    // mongoose.connect() returns a promise, it takes in the param: Connecton string from cloud.mongodb.com (it is in our .env file as MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline) // conn.connection.host -> returns the MongoDB host we are connected to
    // .cyan.underline => comes from the 'color' package
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold)
    // exit with failure
    // process.exit(1) => exits the entire process if there is an error or if it fails
    process.exit(1)
  }
}

// export
module.exports = connectDB