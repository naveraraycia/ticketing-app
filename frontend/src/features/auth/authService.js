// import axios to fetch API from our backend server
import axios from 'axios'

const API_URL = '/api/users'

////////////////////////////////////////////////////////////////////////////////////////
// Register user - API request
const register = async (userData) => {
  // endpoint for registering user => http://localhost:5000/api/users  => just /api/users
  // userData - data from registration form (name, email, password) => this is basically data that you will submit to the registration endpoint
  const response = await axios.post(API_URL, userData)

  // if you get a response save the data you get from the response as well as the JSON web token TO LOCAL STORAGE
  if(response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  // return userData and JWT
  return response.data
}

////////////////////////////////////////////////////////////////////////////////////////
// Login user - API request
const login = async (userData) => {
  // endpoint for registering user => http://localhost:5000/api/users  => just /api/users
  // userData - data from registration form (name, email, password) => this is basically data that you will submit to the registration endpoint
  const response = await axios.post(API_URL + '/login', userData)

  // if you get a response save the data you get from the response as well as the JSON web token TO LOCAL STORAGE
  if(response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  // return userData and JWT
  return response.data
}

////////////////////////////////////////////////////////////////////////////////////////
// Logout user = to logout a user => clear local storage user credentials
const logout = () => localStorage.removeItem('user')
////////////////////////////////////////////////////////////////////////////////////////


// functions we put here will get exported
const authService = {
  register,
  logout,
  login
}

export default authService