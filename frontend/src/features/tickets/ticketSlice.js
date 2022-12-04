import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import ticketService from './ticketService'

const initialState = {
  tickets: [], // for getting MUTLITPLE tickets
  ticket: {}, // for getting SINGLE ticket
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}


/////////////////////////////////////////////////////////////////////////////////////
// createAsyncThunk() => a function that allows you to use asyncronous data
// 'tickets/create' => the name we want to use (can be anything because it is just a string)
// second arg = an async function
// async (ticketData) => variable 'ticketData' comes from the form for creating ticket in frontend
// thunkAPI - has stuff we can use
// Create new ticket Action
export const createTicket = createAsyncThunk('tickets/create', async (ticketData, thunkAPI)=> {
  try {
    // thunkAPI.getState() => allows you to get any data / state from any reducer
    const token = thunkAPI.getState().auth.user.token // get user JWT

    // ticketService.js contains createTicket()
    // createTicket() first arg => 'ticketData' here is from create ticket form 'ticketData' object
    // createTicket() second arg =? pass in the user JWT
    // return the response.data from ticketService.js
    // this is the action.payload value for the ticketSlice
    return await ticketService.createTicket(ticketData, token) 
  } catch (error) {
    // if something goes wrong then show message from response.data back in ticketService.js
    // locate where the error message example 'Inavlid Credentials!' is. Check if it is in either error.response && error.response.data && error.response.data.message || error.message || error itself <= if in error itself then change it toString()
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    // this is the action.payload value for the ticketSlice
    return thunkAPI.rejectWithValue(message)
  }
})

/////////////////////////////////////////////////////////////////////////////////////
// Get user tickets (SELECT ALL)
// async(_) => means you won't be passing any arg to the first param
export const getTickets = createAsyncThunk('tickets/getAll', async (_, thunkAPI)=> {
  try {
    const token = thunkAPI.getState().auth.user.token // get user JWT
    // ticketService.js contains getTickets()
    // createTicket() arg => pass in the user JWT
    // return the response.data from ticketService.js
    // this is the action.payload value for the ticketSlice
    return await ticketService.getTickets(token) 
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    // this is the action.payload value for the ticketSlice
    return thunkAPI.rejectWithValue(message)
  }
})

/////////////////////////////////////////////////////////////////////////////////////
// Get SINGLE ticket 
// asyn(ticketId) => gets the ticket id
export const getTicket = createAsyncThunk('tickets/get', async (ticketId, thunkAPI)=> {
  try {
    const token = thunkAPI.getState().auth.user.token // get user JWT
    // ticketService.js contains getTicket()
    // createTicket() arg => pass in ticket ID and user JWT
    // return the response.data from ticketService.js
    // this is the action.payload value for the ticketSlice
    return await ticketService.getTicket(ticketId, token) 
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    // this is the action.payload value for the ticketSlice
    return thunkAPI.rejectWithValue(message)
  }
})

/////////////////////////////////////////////////////////////////////////////////////
// close ticket 
// async(ticketId) => gets the ticket id
export const closeTicket = createAsyncThunk('tickets/close', async (ticketId, thunkAPI)=> {
  try {
    const token = thunkAPI.getState().auth.user.token // get user JWT
    // ticketService.js contains closeTicket()
    // closeTicket() arg => pass in ticket ID and user JWT
    // return the response.data from ticketService.js
    // this is the action.payload value for the ticketSlice
    return await ticketService.closeTicket(ticketId, token) 
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    // this is the action.payload value for the ticketSlice
    return thunkAPI.rejectWithValue(message)
  }
})

/////////////////////////////////////////////////////////////////////////////////////

// Create slice
export const ticketSlice = createSlice({
  name: 'ticket', // name of slice
  initialState,
  reducers: {
    // reset form
    reset: (state) => initialState // returns state to default
  },
  extraReducers: (builder) => {
    // watch the status of the action here ; createTicket is the action being watched
    builder.addCase(createTicket.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(createTicket.fulfilled, (state)=> {
      state.isLoading = false
      state.isSuccess = true
      // no payload (and action second param) here since POST request does not fetch any data
    })
    .addCase(createTicket.rejected, (state, action)=> { // rejected status takes in second param => action because you want to get the response.data (fetch data)
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
    .addCase(getTickets.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(getTickets.fulfilled, (state, action)=> { // we have second param => action (payload) since GET request fetches data
      state.isLoading = false
      state.isSuccess = true
      state.tickets = action.payload
    })
    .addCase(getTickets.rejected, (state, action)=> { // rejected status takes in second param => action because you want to get the response.data (fetch data)
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
    .addCase(getTicket.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(getTicket.fulfilled, (state, action)=> { // we have second param => action (payload) since GET request fetches data
      state.isLoading = false
      state.isSuccess = true
      state.ticket = action.payload
    })
    .addCase(getTicket.rejected, (state, action)=> { // rejected status takes in second param => action because you want to get the response.data (fetch data)
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
    .addCase(closeTicket.fulfilled, (state, action)=> { // rejected status takes in second param => action because you want to get the response.data (fetch data)
      state.isLoading = false
      // map through 'tickets' array within redux and find the SINGLE entry with the ticketId from action.payload
      // doing this is only for the frontend (to immediately see the updated 'closed' status without reloading)
      // you can skip doing this but you would need to reload the page before seeing the updated result
      // logic => map through all the tickets and find the specific one by checking whether the mapped item's ._id matches with the action.payload.id which came from the response body upon sending the put request
      // if it matches then change the mapped ticket's status to 'closed' else just leave it
      state.tickets.map((ticketItem)=> ticketItem._id === action.payload._id ? (ticketItem.status = 'closed') : ticketItem)
    })
    
    
  }
})

// export reset from reducer on line 17
export const {reset} = ticketSlice.actions

export default ticketSlice.reducer