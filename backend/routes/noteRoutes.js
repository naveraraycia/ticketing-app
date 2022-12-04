const express = require('express')
// mergeParams => for merging tickets and notes route
const router = express.Router({mergeParams: true})
const {getNotes, addNote} = require('../controllers/noteController')

// protected route
const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getNotes).post(protect, addNote)

module.exports = router

// route format => /api/tickets/:ticketId/notes