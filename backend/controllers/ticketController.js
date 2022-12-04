const asyncHandler = require('express-async-handler')

// bring in 'user' and 'ticket' model
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Get user tickets (current logged in user's)
// @route GET /api/tickets
// @access => Private (protected route = needs token)
const getTickets = asyncHandler(async (req, res) => {
  // get the current user's ID within JSON webtoken
  // 'User'.findById() => the 'User' model
  // req.user.id came from the authMiddleware.js
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  const tickets = await Ticket.find({user: req.user.id}) // find within Ticket Model a ticket with user field on schema = req.user.id
  // Send the gathered results (tickets above)
  res.status(200).json(tickets)
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Create new user ticket
// @route POST /api/tickets/
// @access => Private (protected route = needs token)
const createTicket = asyncHandler(async (req, res) => {
  // Send body data => product, description (details set by the user)
  const {product, description} = req.body
  // if they did not send a product and/or description
  if(!product || !description) {
    res.status(400)
    throw new Error('Please add a product and description')
  }

  // Get user from JWT
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  // Create the ticket
  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: 'new'
  })

  // Status 201 - created
  res.status(201).json(ticket)
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Get user single Ticket (current logged in user's)
// @route GET /api/tickets/:id
// @access => Private (protected route = needs token)
const getTicket = asyncHandler(async (req, res) => {
  // get the current user's ID within JSON webtoken
  // 'User'.findById() => the 'User' model
  // req.user.id came from the authMiddleware.js
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  // req.params.id => gets the 'id' param value within the URL such as /api/tickets/:id <- this
  // upon accessing this route, the single ticket ID is already placed within the URL, you must get that specific ID value using req.params.id and thats what you'll use to fetch that single specific ticket (reference)
  const ticket = await Ticket.findById(req.params.id) 

  // if no ticket found by that ID
  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Only fetch the current user's ticket and not anyone else's
  // Check if within the result single 'ticket' object, the user key is different from the user id of the currently logged in user
  // If it is different it means the fetched ticket does not belong to the logged in user. This shall not be given authorization for reading since you can only fetch and read your own ticket
  if(ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }
  // Send the gathered single result (ticket above)
  res.status(200).json(ticket)
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Delete single Ticket (current logged in user's)
// @route DELETE REQUEST /api/tickets/:id  <- has :d param to know which ticket ot delete
// @access => Private (protected route = needs token)
const deleteTicket = asyncHandler(async (req, res) => {
  // get the current user's ID within JSON webtoken
  // 'User'.findById() => the 'User' model
  // req.user.id came from the authMiddleware.js
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  // req.params.id => gets the 'id' param value within the URL such as /api/tickets/:id <- this
  // upon accessing this route, the single ticket ID is already placed within the URL, you must get that specific ID value using req.params.id and thats what you'll use to fetch that single specific ticket (reference)
  const ticket = await Ticket.findById(req.params.id) 

  // if no ticket found by that ID
  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Only fetch the current user's ticket and not anyone else's
  // Check if within the result single 'ticket' object, the user key is different from the user id of the currently logged in user
  // If it is different it means the fetched ticket does not belong to the logged in user. This shall not be given authorization for reading since you can only fetch and read your own ticket
  if(ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  await ticket.remove() // remove ticket here
  // Return a value of delete success: true
  res.status(200).json({success: true})
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @desc  Update single Ticket (current logged in user's)
// @route PUT REQUEST /api/tickets/:id  <- has :d param to know which ticket ot delete
// @access => Private (protected route = needs token)
const updateTicket = asyncHandler(async (req, res) => {
  // get the current user's ID within JSON webtoken
  // 'User'.findById() => the 'User' model
  // req.user.id came from the authMiddleware.js
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  // req.params.id => gets the 'id' param value within the URL such as /api/tickets/:id <- this
  // upon accessing this route, the single ticket ID is already placed within the URL, you must get that specific ID value using req.params.id and thats what you'll use to fetch that single specific ticket (reference)
  const ticket = await Ticket.findById(req.params.id) 

  // if no ticket found by that ID
  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Only fetch the current user's ticket and not anyone else's
  // Check if within the result single 'ticket' object, the user key is different from the user id of the currently logged in user
  // If it is different it means the fetched ticket does not belong to the logged in user. This shall not be given authorization for reading since you can only fetch and read your own ticket
  if(ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }


// findByIdAndUpdate() has 3 params
// req.params.id => api/tickets/:id <- this within URL
// req.body => input field content
// { new: true }   => means if this ticket is not there yet then create it instead of update
const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })
  // Return a value of delete success: true
  res.status(200).json(updatedTicket)
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Export async API handlers
module.exports = {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket
}