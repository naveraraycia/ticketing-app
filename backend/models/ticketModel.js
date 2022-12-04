// import mongoose
const mongoose = require('mongoose')

// create a schema, it takes in an object of fields
const ticketSchema = mongoose.Schema({
  user: {
    // relate this 'user' field here to the 'users' objectId
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref => will contain which collection to find that objectId
    ref: 'User'  // User collection
  },
  product: {
    type: String,
    required: [true, 'Please select a product'],
    // Specific products they can submit tickets for
    enum: ['iPhone', 'Macbook Pro', 'iMac', 'iPad']
  },
  description: {
    type: String,
    required: [true, 'Please add enter a description of the issue']
  },
  status: {
    type: String,
    required: true,
    // enum vals => the status of the ticket
    enum: ['new', 'open', 'closed'],
    default: 'new'
  }
},
  {
    timestamps: true // this can also be placed above instead
  }
)

// expor module
// mongoose.model('nameOfSchema', the object schema)
module.exports = mongoose.model('Ticket', ticketSchema)