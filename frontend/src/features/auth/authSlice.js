import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'))

// create initial state
const initialState = {
  user: user ? user : null, // if user variable has content then use its data as the value for this key, if none then say null
  isError: false,  // error from server will be put here
  isSuccess: false, // success message from server
  isLoading: false,
  message: ''
}

/////////////////////////////////////////////////////////////////////////////////////
// createAsyncThunk() => a function that allows you to use asyncronous data
// 'auth/register' => the name we want to use (can be anything because it is just a string)
// second arg = an async function
// async (user) => variable 'user' comes from the form
// thunkAPI - has stuff we can use
// Register Action
export const register = createAsyncThunk('auth/register', async (user, thunkAPI)=> {
  try {
    // authService.js contains register()
    // user here is from registration form 'userData' object
    return await authService.register(user)
  } catch (error) {
    // if something goes wrong then show message from backend folder
    // locate where the error message example 'Inavlid Credentials!' is. Check if it is in either error.response && error.response.data && error.response.data.message || error.message || error itself <= if in error itself then change it toString()
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    return thunkAPI.rejectWithValue(message)
  }
})

////////////////////////////////////////////////////////////////////////////////////////
// Login Action
export const login = createAsyncThunk('auth/login', async (user, thunkAPI)=> {
  try {
    // authService.js contains login()
    // user here is from registration form 'userData' object
    return await authService.login(user)
  } catch (error) {
    // if something goes wrong then show message from backend folder
    // locate where the error message example 'Inavlid Credentials!' is. Check if it is in either error.response && error.response.data && error.response.data.message || error.message || error itself <= if in error itself then change it toString()
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

    // reutrn the error message using thunkAPI.rejectWithValue(messageFromAbove)
    return thunkAPI.rejectWithValue(message)
  }
})

////////////////////////////////////////////////////////////////////////////////////////
// Logout Action
export const logout = createAsyncThunk('auth/logout', async ()=> {
  await authService.logout()
})


////////////////////////////////////////////////////////////////////////////////////////


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => { // turn back states to default ; these functions under 'reducers' are authSlice.actions
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state)=>{
      // when your register action is pending => do this (set state isLoading to true)
      state.isLoading = true
    })
    .addCase(register.fulfilled, (state, action)=>{
      state.isLoading = false // false since request is done
      state.isSuccess = true
      state.user = action.payload // user Data

    })
    .addCase(register.rejected, (state, action)=>{
      // when something goes wrong === error
      state.isLoading = false // false since request is done
      state.isError = true
      state.message = action.payload // error message from thunkAPI.rejectWithValue(message) on line 31
      state.user = null
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null
    })
    .addCase(login.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(login.fulfilled, (state, action)=>{
      state.isLoading = false // false since request is done
      state.isSuccess = true
      state.user = action.payload // user Data

    })
    .addCase(login.rejected, (state, action)=>{
      // when something goes wrong === error
      state.isLoading = false // false since request is done
      state.isError = true
      state.message = action.payload // error message from thunkAPI.rejectWithValue(message) on line 31
      state.user = null
    })
  }  // extraReducer = a function that takes in builder => allows us to add cases
  // we need extraReducers to be able to apply an afetr effect after an action dispatches
})

export const { reset } = authSlice.actions

export default authSlice.reducer