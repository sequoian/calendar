import React, { Component } from 'react'
import EventForm from './components/EventForm'
import moment from 'moment'

class App extends Component {
  render() {
    const now = moment()
    return (
      <div className="App">
        <EventForm 
          day={now}
          time={now.format('h:mma')}
        />
      </div>
    )
  }
}

export default App