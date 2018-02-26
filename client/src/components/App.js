import React, {Component} from 'react'
import EventForm from './EventForm'
import Modal from './Modal'
import EventList from './EventList'

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
        <button
          type="button"
          onClick={() => this.setState({open: true})}
        >
          New Event
        </button>
        <EventList />
        <Modal 
          isOpen={this.state.open}
          onClose={() => this.setState({open: false})}
        >
          <EventForm />
        </Modal>
        
      </div>
    )
  }
}

export default App