// import mongoose
const mongoose = require('mongoose')

// create a schema, it takes in an object of fields
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'] // second param is a message in case value is false
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true // we want this to be unique
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  isAdmin: {
    // this wont be implemented on this project (Admin interface) but it is just here in case you want to add an admin interface
    type: Boolean,
    required: true,
    default: false
  }
},
  {
    timestamps: true // this can also be placed above instead
  }
)

// expor module
// mongoose.model('nameOfSchema', the object schema)
module.exports = mongoose.model('User', userSchema)