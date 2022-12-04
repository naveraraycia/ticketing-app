import {useSelector, useDispatch} from 'react-redux'
import {getTicket, closeTicket} from '../features/tickets/ticketSlice'
import {getNotes, createNote, reset as notesReset} from '../features/notes/noteSlice'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import {toast} from 'react-toastify'
import Modal from 'react-modal'
import {FaPlus} from 'react-icons/fa'
import {useParams, useNavigate} from 'react-router-dom' // to get the ID within the url
import {useEffect, useState} from 'react'

// Modal Style
const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative'
  }
}

// The modal will be mounted on the root index.html
Modal.setAppElement('#root')

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  // get the state values from redux 
  const {ticket, isLoading, isSuccess, isError, message} = useSelector((state)=> state.tickets) //state.tickets => 'tickets' is from store.js

  //  isLoading: notesIsLoading => this means rename 'isLoading' state to 'notesIsLoading'
  const {notes, isLoading: notesIsLoading} = useSelector((state)=> state.notes) //state.notes => 'notes' is from store.js (notes reducer)

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get :ticketID from URL => 'ticketId' variable name came from App.js Route how you initialized the route for Ticket.jsx
  const {ticketId} = useParams()

  useEffect(()=>{
    // check for error
    if(isError){
      toast.error(message)
    }

    // dispatch / use getTicket() function from ticketSlice.js
    dispatch(getTicket(ticketId))
    // dispatch / use getNotes() function action from notetSlice.js
    dispatch(getNotes(ticketId))

    // eslint-disable-next-line
  },[isError, message, ticketId])

  // function onTicketClose
  function onTicketClose(){
    // by clicking the button, you dispatch closeTicket Action to send PUT request on ticketService.js to change status to 'close'
    dispatch(closeTicket(ticketId))
    toast.success('Ticket Closed')
    navigate('/tickets')
  }

  // function openModal 
  function openModal(){
    setModalIsOpen(true)
  }

  // function closeModal 
  function closeModal(){
    setModalIsOpen(false)
  }

  // function onNoteSubmit => create note submit
  function onNoteSubmit(e){
    e.preventDefault()

    // dispatch create note function here
    // object keys => noteText - this is the state from textarea onChange
    // ticketId came from line 44 where it was grabbed from the URL param
    dispatch(createNote({noteText, ticketId}))
    // closemodal
    closeModal()
  }

  // Check for loading state of both 'tickets' and 'notes' reducer
  if(isLoading || notesIsLoading) {
    return <Spinner />
  }

  if(isError) {
    return <he> Something Went Wrong</he>
  }

  return (
    <div className='ticket-page'>
      <header className="ticket-header">
        <BackButton url='/tickets' />
        <h2>
          TicketID: {ticket._id}
          <span className={`status status-${ticket.status}`}>{ticket.status}</span>
        </h2>
        <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>Product: {ticket.product}</h3>

        <hr />

        <div className="ticket-desc">
          <h3>Descrption of Issue</h3>
          <p>{ticket.description}</p>
        </div>

        <h2>Notes</h2>
      </header>

      {/* only show this if ticket is not closed */}
      {ticket.status !== 'closed' && (
        <button onClick={openModal} className="btn"><FaPlus />Add Note</button>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Add Note'>
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>X</button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea name="noteText" id="noteText" className='form-control' placeholder='Note text' value={noteText} onChange={(e)=> setNoteText(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type='submit'>Submit</button>
          </div>
        </form>
      </Modal>

      {notes.map((noteItem)=> (
        <NoteItem key={noteItem._id} note={noteItem} />
      ))}

      {/* check to see if the ticket.status is NOT CLOSED because this button shall only appear if the ticket is not closed */}
      {/* if ticket.status is closed then DO NOT show this button */}
      {ticket.status !== 'closed' && (
        <button className='btn btn-block btn-danger' onClick={onTicketClose}>Close Ticket</button>
      )}
    </div>
  )
}

export default Ticket