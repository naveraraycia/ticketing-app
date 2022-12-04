const express = require('express')
const router = express.Router()
// Import Async API handlers
const {getTickets, getTicket, deleteTicket, updateTicket, createTicket} = require('../controllers/ticketController') 
// Bring protect middleware
const {protect} = require('../middleware/authMiddleware')
// import note router
const noteRouter = require('./noteRoutes')
// Re-route into note router
router.use('/:ticketId/notes', noteRouter)

// Get request to api/tickets
// router.route()  => has the ability to do router.route().get().post()
// router.route('/') with multiple attached request [get(), post(), delete(), put()] means all those request are available for the '/' route
// get() request here => only gets the current user's tickets
router.route('/').get(protect, getTickets).post(protect, createTicket)

// Route for Single Ticket
router.route('/:id').get(protect, getTicket).delete(protect, deleteTicket).put(protect, updateTicket)


module.exports = router