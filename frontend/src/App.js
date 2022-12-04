import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import Toast
import {ToastContainer} from 'react-toastify'
// import toast CSS
import 'react-toastify/dist/ReactToastify.css'
// Header component
import Header from './components/Header'
// pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewTicket from './pages/NewTicket'
import PrivateRoute from './components/PrivateRoute'
import Tickets from './pages/Tickets'
import Ticket from './pages/Ticket'


function App() {
  return (
    <>
      <Router>
        <div className="container">
          {/* Header component - visible for every page */}
          <Header /> 
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            {/* Private Route => Create ticket page */}
            <Route path='/new-ticket' element={<PrivateRoute />}>
              <Route path='/new-ticket' element={<NewTicket />} />
            </Route>
            {/* Private Route => Get all tickets of a user page */}
            <Route path='/tickets' element={<PrivateRoute />}>
              <Route path='/tickets' element={<Tickets />} />
            </Route>
            {/* Private Route => Get SINGLE ticket page */}
            <Route path='/ticket/:ticketId' element={<PrivateRoute />}>
              <Route path='/ticket/:ticketId' element={<Ticket />} />
            </Route>

          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
