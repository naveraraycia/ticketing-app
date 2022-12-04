import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {logout, reset} from '../features/auth/authSlice'

function Header() {
  // Initialize useNavigate && useDispatch
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Get the 'user' from global state
  const {user} = useSelector((state) => state.auth)

  // Function onLogout
  function onLogout() {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header'>
      <div className="logo">
        <Link to='/'>Support Desk</Link>
      </div>
      {/* navbar */}
      <ul>
        {/* If there is a logged in user => show the logout button only */}
      {user ? (
        <li>
          <button className="btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      ) : ( 
        // If no logged in user => show Login and Register instead
      <>
        <li>
          <Link to='/login'>
            <FaSignInAlt /> Login
          </Link>
        </li>
        <li>
          <Link to='/register'>
            <FaUser /> Register
          </Link>
        </li>
      </>
      )}
        
      </ul>
    </header>
  )
}

export default Header