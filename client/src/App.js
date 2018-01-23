import React, { Component } from 'react'
import EventForm from './components/EventForm'
import Modal from './components/FormModal'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <div className="App">
        <button
          type="button"
          onClick={() => this.setState({open: true})}
        >New Event</button>
        <Modal 
          isOpen={this.state.open}
          onRequestClose={this.closeModal}
        >
        <EventForm />
        </Modal>
        
      </div>
    )
  }
}

export default App