import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {FaUser} from 'react-icons/fa'
import {toast} from 'react-toastify'
// import for redux
// useSelector - used for selecting from Global State (user, isSuccess, message .... the initialState object from authSlice.js)
// useDispatch - dipatches the actions such as register
import {useSelector, useDispatch} from 'react-redux'
// import Register Action and reset from reducers in createSlice authSlice.js line 46
import {register, reset} from '../features/auth/authSlice'
// import Spinner
import Spinner from '../components/Spinner'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const {name, email, password, password2} = formData

  // initialize Dispatch
  const dispatch = useDispatch()
  // initialize useNavigate
  const navigate = useNavigate()

  // for the selector => bring in pieces of initialState (from authSlice.js)
  const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.auth)

  // useEffect
  useEffect(()=>{
    if(isError) {
      // if there is an error then show error message
      toast.error(message)
    }

    // redirect when logged in (success === no error)
    // if isSuccess === true and 'user' state is filled then redirect to home page '/' and reset states
    if(isSuccess || user) {
      navigate('/')
    }

    // use the reset reducer in line 46 of authSlice.js 
    dispatch(reset())
  },[isError, isSuccess, user, message, navigate, dispatch])

  // onChange function
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value

    }))
  }

  // onSubmit function
  function onSubmit(e){
    e.preventDefault()

    // check if passwords match
    if(password !== password2) {
      toast.error('Passwords do not match')
    } else {
      // if passwords match then create a variable useData
      const userData = {
        name, // all data here are from the form inputs below
        email,
        password
      }
      // Disptach register (call register action from authSlice.js)
      // Pass in userData
      dispatch(register(userData))
    }
  }

  // Set Spinner
  if(isLoading) {
    return <Spinner />
  }
  
  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            {/* make sure name='name' and not name={name} */}
            <input type="text" className="form-control" id="name" name='name' value={name} onChange={onChange} placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <input type="email" className="form-control" id="email" name='email' value={email} onChange={onChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" id="password" name='password' value={password} onChange={onChange} placeholder="Enter your password" required />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" id="password2" name='password2' value={password2} onChange={onChange} placeholder="Confirm password" required />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register