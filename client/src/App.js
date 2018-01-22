import React, { Component } from 'react'
import EventForm from './components/EventForm'
import moment from 'moment'
import Modal from 'react-modal'

const modalStyle = {
  content: {
    top: '50%', 
    left: '50%', 
    right: 'default', 
    bottom: 'default', 
    width: '300px',
    height: '500px',
    marginLeft: '-150px',
    marginTop: '-250px'
  }
}

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
    const now = moment()
    return (
      <div className="App">
        <button
          type="button"
          onClick={() => this.setState({open: true})}
        >New Event</button>
        <Modal isOpen={this.state.open}
          style={modalStyle}
          onRequestClose={this.closeModal}
        >
        <EventForm 
          day={now}
          time={now.format('h:mma')}
        />
        </Modal>
        
      </div>
    )
  }
}

export default App