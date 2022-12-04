const asyncHandler = require('express-async-handler')
// bring in 'user', 'note' and 'ticket' model
const User = require('../models/userModel')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

//////////////////////////////////////////////////////////////////////////////
// @desc  Get notes for a SINGLE ticket
// @route GET /api/tickets/:ticketId/notes
// @access => Private (protected route = needs token)
const getNotes = asyncHandler(async (req, res) => {
  // get the current user's ID within JSON webtoken
  // 'User'.findById() => the 'User' model
  // req.user.id came from the authMiddleware.js
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  // finc the specific ticket by ID using the req.params.ticketId from the URL
  const ticket = await Ticket.findById(req.params.ticketId)
  // make sure it is the currently logged in user's ticket
  // make sure the user in the ticket object within the database matches the user returned in the request
  // if they do not match then it is unauthorized
  if(ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // get notes
  // await the 'Note' model and find within it an entry with 'ticket' key === req.params.ticketId
  const notes = await Note.find({ticket: req.params.ticketId})
  // Send the gathered results (tickets above)
  res.status(200).json(notes)
})

//////////////////////////////////////////////////////////////////////////////
// @desc  Create ticket note
// @route POST /api/tickets/:ticketId/notes
// @access => Private (protected route = needs token)
const addNote = asyncHandler(async (req, res) => {
  // get the current user's ID within JSON webtoken
  // 'User'.findById() => the 'User' model
  // req.user.id came from the authMiddleware.js
  const user = await User.findById(req.user.id)

  if(!user){
    // if there is no user found
    res.status(401)
    throw new Error('User not found')
  }

  // find the specific ticket by ID using the req.params.ticketId from the URL
  const ticket = await Ticket.findById(req.params.ticketId)
  // make sure it is the currently logged in user's ticket
  // make sure the user in the ticket object within the database matches the user returned in the request
  // if they do not match then it is unauthorized
  if(ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // create notes
  // await the 'Note' model and find within it an entry with 'ticket' key === req.params.ticketId
  const note = await Note.create({
    ticket: req.params.ticketId,
    isStaff: false,
    text: req.body.text,
    user: req.user.id
  })
  // Send the gathered results (tickets above)
  res.status(200).json(note)
})

module.exports = {
  getNotes,
  addNote
}