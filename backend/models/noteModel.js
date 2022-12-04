// import mongoose
const mongoose = require('mongoose')

// create a schema, it takes in an object of fields
const noteSchema = mongoose.Schema({
  // we need 'user' field to know which user applies to that note
  user: {
    // relate this 'user' field here to the 'users' objectId
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref => will contain which collection to find that objectId
    ref: 'User'  // User collection
  },
  // we want to know which ticket the note is related to
  ticket: {
     // relate this 'user' field here to the 'users' objectId
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     // ref => will contain which collection to find that objectId
     ref: 'Ticket'  // ticket collection
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  staffId: {
    type: String
  },
  
},
  {
    timestamps: true // this can also be placed above instead
  }
)

// expor module
// mongoose.model('nameOfSchema', the object schema)
module.exports = mongoose.model('Note', noteSchema)