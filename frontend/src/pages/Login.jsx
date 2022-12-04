import {useState, useEffect} from 'react'
import {FaSignInAlt} from 'react-icons/fa'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Spinner from'../components/Spinner'
// useDispatch - dipatches the actions such as register
import {useSelector, useDispatch} from 'react-redux'
// import Login Action
import {login, reset} from '../features/auth/authSlice'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {email, password} = formData

  
  // initialize Dispatch
  const dispatch = useDispatch()
  // initialize Navigate
  const navigate = useNavigate()

  // for the selector => bring in pieces of initialState (from authSlice.js)
  const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.auth)

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    // get data from form input fields
    const userData = {
      email,
      password
    }

    // dispatch the login Action
    dispatch(login(userData))
  }

  if(isLoading) {
    return <Spinner />
  }
  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please log in to get support</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="email" className="form-control" id="email" name='email' value={email} onChange={onChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" id="password" name='password' value={password} onChange={onChange} placeholder="Enter your password" required />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login