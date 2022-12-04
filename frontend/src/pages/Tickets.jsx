import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getTickets, reset} from '../features/tickets/ticketSlice'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import TicketItem from '../components/TicketItem'

function Tickets() {
  // get data from ticket reducer in redux
  // de-structure
  const {tickets, isLoading, isSuccess} = useSelector((state)=> state.tickets)

  // init dispatch
  const dispatch = useDispatch()

  // Clear the state on unmount , this can be done under a single useEffect() or a separate one
  useEffect(()=> {
    return () => {
      // this will happen on unmount
      // check for success
      if(isSuccess) {
        // reset
        dispatch(reset())
      }

    }
  }, [dispatch, isSuccess])

  useEffect(()=>{
    // get tickets here
    dispatch(getTickets())
  },[dispatch])

  if(isLoading){
    return <Spinner />
  }

  return (
    <>
      <BackButton url='/' />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {/* Map through tickets result from GET request */}
        {tickets.map((ticketItem)=>(
          <TicketItem key={ticketItem._id} ticket={ticketItem} />
        ))}
      </div>
    
    </>
  )
}

export default Tickets