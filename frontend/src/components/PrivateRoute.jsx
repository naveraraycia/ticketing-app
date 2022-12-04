import {Navigate, Outlet} from 'react-router-dom'
import {useAuthStatus} from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const {loggedIn, checkingStatus} = useAuthStatus()
  
  if(checkingStatus) {
    return <Spinner />
  }

  // if user is loggedIn then redirect to Private route, if not then redirect to login page
  return loggedIn ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute