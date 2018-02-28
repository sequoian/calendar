import React, {Component} from 'react'
import EventForm from './EventForm'
import Modal from './Modal'
import EventList from './EventList'
import NewEventBtn from './NewEventBtn'
import Header from './Header'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <NewEventBtn />
        <EventList />
        <Modal>
          <EventForm />
        </Modal>
        
      </div>
    )
  }
}

export default App