import {useState, useEffect} from 'react'
// We need to import useSelector because we need to select the user from redux global state (if there is a user in redux global state, that means there is a user logged in)
import {useSelector} from 'react-redux'

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true) // similar to loading

  // get user from redux global state ('auth' state)
  const {user} = useSelector((state) => state.auth)

  useEffect(()=>{
    // check if the 'user' is there (if user is there (not null) then there is a logged in user)
    if(user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
    setCheckingStatus(false) // done checking user logged in thats why loading is false

  },[user])  // user is passed as a dependency because we want this to run whenever the user changes

  return {loggedIn, checkingStatus}
}