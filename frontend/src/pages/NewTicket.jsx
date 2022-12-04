import {useState, useEffect} from 'react' // used for the form fields (local state)
import {useSelector, useDispatch} from 'react-redux'  // get logged in user's name and email for display
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {createTicket, reset} from '../features/tickets/ticketSlice'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'

function NewTicket() {
  // get {user} first from the redux global state
  const {user} = useSelector((state) => state.auth)
  // take states from the 'ticket' reducer 
  const {isLoading, isError, isSuccess, message} = useSelector((state)=> state.tickets)

  // initialize dispatch and navigate
  const dispatch = useDispatch()
  const navigate = useNavigate()

// set local state
const [name] = useState(user.name) // 'user' came from line 6
const [email] = useState(user.email)
const [product, setProduct] = useState('iPhone')
const [description, setDescription] = useState('')

// useEffect
useEffect(()=>{
  // check for error (when handling the creation of ticket)
  if(isError) {
    toast.error(message)
  }

  if(isSuccess) { 
    // if no error and you got the response.data successfully, then reset the form since the create ticket functionality is complete
    dispatch(reset())
    navigate('/tickets') // go back to /tickets page
  }

  dispatch(reset()) // dispatch reset() to clear the form upon submission (whether there was an error or none => you still need to reset the form)
},[dispatch, isError, isSuccess, navigate, message])

// function onSubmit()
function onSubmit(e) {
  e.preventDefault()
  // use createTicket Action from slice
  // createTicket() first param is an object containing keys: product, description
  dispatch(createTicket({product, description}))
}

if(isLoading) {
  // isLoading state => from 'ticket' reducer
  return <Spinner />
}

  return (
    <>
    <BackButton url='/' />
      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          {/* disabled input because this is for display */}
          <input type="text" className="form-control" value={name} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="name">Customer Email</label>
          {/* disabled input because this is for display */}
          <input type="email" className="form-control" value={email} disabled />
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product</label>
            <select name="product" id="product" value={product} onChange={(e)=> setProduct(e.target.value)}>
              <option value="iPhone">iPhone</option>
              <option value="Macbook Pro">Macbook Pro</option>
              <option value="iMac">iMac</option>
              <option value="iPad">iPad</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            {/* onChange() sets the description state in real time with the user input as its value */}
            <textarea name="description" id="description" className='form-control' placeholder='Description' value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
          </div>

          <div className="form-group">
            <button className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default NewTicket