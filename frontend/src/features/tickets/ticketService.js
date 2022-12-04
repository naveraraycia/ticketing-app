import axios from 'axios'

// create API ulr
const API_URL = '/api/tickets/'

// Create new ticket => this is what you will call in Slice when creating ticket
const createTicket = async (ticketData, token) => {
  // Put / Add authorization Bearer Token to your request
  const config ={
    // headers must be added here because whn we send our token it must be in the 'headers' part (refer to postman) in the authorization field
    headers: {
      // authorization field
      // we need the string 'Bearer' because our backend handles this in a way that it finds the starting word 'Bearer' and cuts it off to purely just get the ${token}
      Authorization: `Bearer ${token}`
    }
  }

  // Send the POST request for creating the ticket
  // first param axios.post() => the endpoint
  // second param axios.post() => what data to send
  // third param axios.post() => bearer token for authorization (because it wont be posted if you do not have bearer token)
  const response = await axios.post(API_URL, ticketData, config)

  // return the data sent back by the backend upon successful / failed POST request
  return response.data
}

///////////////////////////////////////////////////////
// GET ALL USER (INDIVIDUAL) TICKETS
const getTickets = async (token) => {
  // Put / Add authorization Bearer Token to your request
  const config ={
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Send the GET request for fetching tickets
  const response = await axios.get(API_URL, config) //only 2 params since you wont be posting any new data
  return response.data
}

///////////////////////////////////////////////////////
// GET ALL USER (INDIVIDUAL) TICKETS
const getTicket = async (ticketId, token) => {
  // Put / Add authorization Bearer Token to your request
  const config ={
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Send the GET request for fetching single ticket
  const response = await axios.get(API_URL + ticketId, config) //only 2 params since you wont be posting any new data
  return response.data
}

///////////////////////////////////////////////////////
// CLOSE TICKET
const closeTicket = async (ticketId, token) => {
  // Put / Add authorization Bearer Token to your request
  const config ={
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Send the PUT request for updating ticket status to 'CLOSE'
  const response = await axios.put(API_URL + ticketId, {status: 'closed'}, config) // 3 params with 2nd param being the data you want to update with
  return response.data
}

// Export the functions above
const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  closeTicket
}

export default ticketService