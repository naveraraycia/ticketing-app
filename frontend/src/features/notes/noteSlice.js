import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import noteService from './noteService'

const initialState = {
  notes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

/////////////////////////////////////////////////////////////////////////////////////
// GET TICKET NOTES
// async(ticketId) => gets the ticket id
export const getNotes = createAsyncThunk('notes/getAll', async (ticketId, thunkAPI)=> {
  try {
    const token = thunkAPI.getState().auth.user.token // get user JWT
    // noteService.js contains getNotes()
    // getNotes() arg => pass in ticket ID and user JWT
    // return the response.data from noteService.js
    // this is the action.payload value for the ticketSlice
    return await noteService.getNotes(ticketId, token) 
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    // this is the action.payload value for the ticketSlice
    return thunkAPI.rejectWithValue(message)
  }
})

/////////////////////////////////////////////////////////////////////////////////////
// CREATE TICKET NOTE
// async() first param => an object with noteText and ticketId
export const createNote = createAsyncThunk('notes/create', async ({noteText, ticketId}, thunkAPI)=> {
  try {
    const token = thunkAPI.getState().auth.user.token // get user JWT
    // noteService.js contains createNote()
    // createNote() arg => noteText, ticketId, JWT
    // return the response.data from noteService.js
    // this is the action.payload value for the ticketSlice
    return await noteService.createNote(noteText, ticketId, token) 
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    // this is the action.payload value for the ticketSlice
    return thunkAPI.rejectWithValue(message)
  }
})

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
    .addCase(getNotes.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(getNotes.fulfilled, (state, action)=> { // we have second param => action (payload) since GET request fetches data
      state.isLoading = false
      state.isSuccess = true
      state.notes = action.payload
    })
    .addCase(getNotes.rejected, (state, action)=> { // rejected status takes in second param => action because you want to get the response.data (fetch data)
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
    .addCase(createNote.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(createNote.fulfilled, (state, action)=> {
      state.isLoading = false
      state.isSuccess = true
      // do this to have the note show up immediately on the UI without reloading
      state.notes.push(action.payload)
    })
    .addCase(createNote.rejected, (state, action)=> { // rejected status takes in second param => action because you want to get the response.data (error message) (fetch data)
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
  }
})

export const {reset} = noteSlice.actions
export default noteSlice.reducer //import this to store.js