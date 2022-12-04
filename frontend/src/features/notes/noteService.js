import axios from 'axios'

const API_URL = '/api/tickets/' // root URL

///////////////////////////////////////////////////////
// GET TICKET NOTES
const getNotes = async (ticketId, token) => {
  // Put / Add authorization Bearer Token to your request
  const config ={
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Send the GET request for fetching ALL notes for specific ticket
  const response = await axios.get(API_URL + ticketId + '/notes', config) //only 2 params since you wont be posting any new data
  return response.data
}

///////////////////////////////////////////////////////
// CREATE TICKET NOTE
const createNote = async (noteText, ticketId, token) => {
  // Put / Add authorization Bearer Token to your request
  const config ={
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Send the POST request to create note entry
  // POST requests have 3 params => endpoint to hit, what data to POST to the endpoint, condif
  const response = await axios.post(API_URL + ticketId + '/notes', {
    text: noteText
  }, config) //only 2 params since you wont be posting any new data
  return response.data
}

const noteService = {
  getNotes,
  createNote
}

export default noteService